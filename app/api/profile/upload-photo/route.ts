import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"

import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"
import { supabaseServer } from "@/lib/supabase-server"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("photo") as File | null

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const userId = session.user.id
    const filePath = `user/${userId}/profile.jpg`

    const { error: uploadError } = await supabaseServer.storage
        .from("facesort")
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        return NextResponse.json({ error: "Upload failed" }, { status: 500 })
    }

    const db = await getDatabase()
    await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { selfie_path: filePath, updated_at: new Date() } }
    )

    return NextResponse.json({ success: true })
}
