import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { ObjectId } from "mongodb"

import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"
import { supabaseServer } from "@/lib/supabase-server"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const user = await db.collection("users").findOne({
        _id: new ObjectId(session.user.id),
    })

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let selfie_url: string | null = null

    if (user.selfie_path) {
        const { data } = await supabaseServer.storage
            .from("facesort")
            .createSignedUrl(user.selfie_path, 60 * 60)

        selfie_url = data?.signedUrl ?? null
    }

    return NextResponse.json({
        username: user.username,
        telegram_id: user.telegram_id,
        custom_message: user.custom_message,
        selfie_url,
    })
}
