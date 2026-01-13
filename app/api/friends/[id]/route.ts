import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"
import { ObjectId } from "mongodb"
import { supabaseServer } from "@/lib/supabase-server"

// =======================
// EDIT FRIEND (PATCH)
// =======================
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid friend id" }, { status: 400 })
        }

        const { name, telegram_chat_id } = await req.json()

        const db = await getDatabase()

        const result = await db.collection("friends").updateOne(
            {
                _id: new ObjectId(id),
                user_id: session.user.id,
            },
            {
                $set: {
                    name,
                    telegram_chat_id,
                    updated_at: new Date(),
                },
            }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Friend not found" }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("EDIT FRIEND ERROR:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// =======================
// DELETE FRIEND (HARD)
// =======================
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid friend id" }, { status: 400 })
        }

        const db = await getDatabase()

        const friend = await db.collection("friends").findOne({
            _id: new ObjectId(id),
            user_id: session.user.id,
        })

        if (!friend) {
            return NextResponse.json({ error: "Friend not found" }, { status: 404 })
        }

        // Delete from Mongo
        await db.collection("friends").deleteOne({
            _id: new ObjectId(id),
            user_id: session.user.id,
        })

        // Delete files from Supabase
        const paths: string[] = []

        if (friend.original_image_path) paths.push(friend.original_image_path)
        if (friend.thumbnail_path) paths.push(friend.thumbnail_path)
        if (friend.embedding_path) paths.push(friend.embedding_path)

        if (paths.length > 0) {
            await supabaseServer.storage.from("facesort").remove(paths)
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("DELETE FRIEND ERROR:", err)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
