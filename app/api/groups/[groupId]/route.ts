import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"

import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"

/* =========================
   RENAME GROUP
========================= */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params
  const { name } = await req.json()

  if (!ObjectId.isValid(groupId) || !name?.trim()) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  const db = await getDatabase()

  const result = await db.collection("groups").updateOne(
    {
      _id: new ObjectId(groupId),
      user_id: session.user.id,
    },
    {
      $set: { name: name.trim(), updated_at: new Date() },
    }
  )

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

/* =========================
   DELETE GROUP
========================= */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { groupId } = await params

  if (!ObjectId.isValid(groupId)) {
    return NextResponse.json({ error: "Invalid group id" }, { status: 400 })
  }

  const db = await getDatabase()

  const result = await db.collection("groups").deleteOne({
    _id: new ObjectId(groupId),
    user_id: session.user.id,
  })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
