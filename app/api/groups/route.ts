import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"

import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"

/* =======================
   GET GROUPS
======================= */
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = await getDatabase()

  const groups = await db
    .collection("groups")
    .find({ user_id: session.user.id })
    .toArray()

  if (groups.length === 0) {
    return NextResponse.json([])
  }

  const friendIds = Array.from(
    new Set(
      groups.flatMap((g) =>
        (g.friend_ids || []).map((id: ObjectId) => id.toString())
      )
    )
  ).map((id) => new ObjectId(id))

  const friends = await db
    .collection("friends")
    .find(
      {
        _id: { $in: friendIds },
        user_id: session.user.id,
      },
      { projection: { name: 1, status: 1 } }
    )
    .toArray()

  const friendMap = new Map(
    friends.map((f) => [f._id.toString(), f])
  )

  const result = groups.map((group) => ({
    _id: group._id.toString(),
    name: group.name,
    friends: (group.friend_ids || [])
      .map((id: ObjectId) => {
        const f = friendMap.get(id.toString())
        if (!f) return null
        return {
          _id: f._id.toString(),
          name: f.name,
          status: f.status,
        }
      })
      .filter(Boolean),
  }))

  return NextResponse.json(result)
}

/* =======================
   CREATE GROUP
======================= */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await req.json()

  if (!name || !name.trim()) {
    return NextResponse.json(
      { error: "Group name required" },
      { status: 400 }
    )
  }

  const db = await getDatabase()

  const group = {
    user_id: session.user.id,
    name: name.trim(),
    friend_ids: [],
    created_at: new Date(),
    updated_at: new Date(),
  }

  const res = await db.collection("groups").insertOne(group)

  return NextResponse.json({
    _id: res.insertedId.toString(),
    name: group.name,
    friends: [],
  })
}
