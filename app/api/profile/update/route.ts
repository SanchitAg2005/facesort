import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { getDatabase } from "@/lib/mongo"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { telegram_id, custom_message } = body

        const db = await getDatabase()

        const updateData: any = {
            updated_at: new Date(),
        }

        if (telegram_id !== undefined) {
            updateData.telegram_id = telegram_id
        }

        if (custom_message !== undefined) {
            updateData.custom_message = custom_message
        }

        await db.collection("users").updateOne(
            { _id: new (require("mongodb").ObjectId)(session.user.id) },
            { $set: updateData }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Profile update error:", error)
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        )
    }
}
