import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"
import { supabaseServer } from "@/lib/supabase-server"
import { ObjectId } from "mongodb"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = await getDatabase()
  const friends = await db
    .collection("friends")
    .find({ user_id: session.user.id })
    .toArray()

  return NextResponse.json(friends)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const name = formData.get("name") as string
  const telegram_chat_id = formData.get("telegram_chat_id") as string
  const photo = formData.get("photo") as File

  if (!name || !telegram_chat_id || !photo) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const db = await getDatabase()

  const friendId = new ObjectId()
  const photoPath = `users/${session.user.id}/friends/${friendId}/original.jpg`

  // Upload original image (NO processing yet)
  const { error: uploadError } = await supabaseServer.storage
    .from("facesort")
    .upload(photoPath, photo, { upsert: false })

  if (uploadError) {
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 })
  }

  await db.collection("friends").insertOne({
    _id: friendId,
    user_id: session.user.id,
    name,
    telegram_chat_id,
    status: "queued",
    original_image_path: photoPath,
    thumbnail_path: null,
    embedding_path: null,
    created_at: new Date(),
    updated_at: new Date(),
  })

  return NextResponse.json({ success: true })
}
