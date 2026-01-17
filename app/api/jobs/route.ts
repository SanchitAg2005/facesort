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

  const jobs = await db
    .collection("jobs")
    .find({ user_id: session.user.id })
    .sort({ created_at: -1 })
    .toArray()

  return NextResponse.json(jobs)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { friend_ids, image_paths } = await req.json()

  if (!Array.isArray(friend_ids) || !Array.isArray(image_paths)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (!friend_ids.length || !image_paths.length) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 })
  }

  const selected_friend_ids = friend_ids.map(
    (id: string) => new ObjectId(id)
  )

  const db = await getDatabase()
  const jobId = new ObjectId()
  const userId = session.user.id

  const final_paths: string[] = []

  for (const tmpPath of image_paths) {
    const fileName = tmpPath.split("/").pop()
    if (!fileName) continue

    const finalPath = `users/${userId}/jobs/${jobId}/${fileName}`

    const { error } = await supabaseServer.storage
      .from("facesort")
      .move(tmpPath, finalPath)

    if (error) {
      return NextResponse.json(
        { error: "Failed to finalize uploads" },
        { status: 500 }
      )
    }

    final_paths.push(finalPath)
  }

  await db.collection("jobs").insertOne({
    _id: jobId,
    user_id: userId,
    selected_friend_ids,
    image_paths: final_paths,
    photo_count: final_paths.length,
    status: "queued",
    created_at: new Date(),
  })

  return NextResponse.json({ job_id: jobId }, { status: 201 })
}
