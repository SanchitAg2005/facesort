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

    const formData = await req.formData()
    const files = formData.getAll("images") as File[]
    const friendIdsRaw = formData.getAll("friend_ids") as string[]

    if (!files.length || !friendIdsRaw.length) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 })
    }

    // ✅ FIX: convert friend IDs to ObjectId
    const selected_friend_ids = friendIdsRaw.map(id => new ObjectId(id))

    const db = await getDatabase()
    const jobId = new ObjectId()
    const basePath = `users/${session.user.id}/jobs/${jobId}`

    const image_paths: string[] = []

    for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const path = `${basePath}/${crypto.randomUUID()}.jpg`

        await supabaseServer.storage
            .from("facesort")
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            })

        image_paths.push(path)
    }

    await db.collection("jobs").insertOne({
        _id: jobId,
        user_id: session.user.id,
        selected_friend_ids, // ✅ ObjectId[]
        image_paths,
        photo_count: image_paths.length,
        status: "queued",
        created_at: new Date(),
    })

    return NextResponse.json({ job_id: jobId }, { status: 201 })
}
