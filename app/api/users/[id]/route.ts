/**
 * User profile endpoints
 * GET: retrieve user
 * PUT: update user
 * DELETE: delete user account
 */

import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongo"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const user = await db.collection("users").findOne({
      _id: new ObjectId(params.id),
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { telegram_id, selfie_path, custom_message } = await request.json()
    const db = await getDatabase()

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...(telegram_id !== undefined && { telegram_id }),
          ...(selfie_path !== undefined && { selfie_path }),
          ...(custom_message !== undefined && { custom_message }),
          updated_at: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Delete user
    const userResult = await db.collection("users").deleteOne({
      _id: new ObjectId(params.id),
    })

    if (userResult.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete user's friends and jobs
    await db.collection("friends").deleteMany({ user_id: params.id })
    await db.collection("jobs").deleteMany({ user_id: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
