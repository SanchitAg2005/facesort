import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"

import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"

/* =========================
   ADD FRIEND TO GROUP
========================= */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params
  const { friend_id } = await req.json()

  const db = await getDatabase()

  await db.collection("groups").updateOne(
    { _id: new ObjectId(groupId), user_id: session.user.id },
    {
      $addToSet: { friend_ids: new ObjectId(friend_id) },
      $set: { updated_at: new Date() },
    }
  )

  return NextResponse.json({ success: true })
}

/* =========================
   REMOVE FRIEND FROM GROUP
========================= */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params
  const { friend_id } = await req.json()

  const db = await getDatabase()

  await db.collection("groups").updateOne(
    { _id: new ObjectId(groupId), user_id: session.user.id },
    {
      $pull: { friend_ids: new ObjectId(friend_id) },
      $set: { updated_at: new Date() },
    }
  )

  return NextResponse.json({ success: true })
}
