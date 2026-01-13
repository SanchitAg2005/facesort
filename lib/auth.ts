

import bcrypt from "bcryptjs"
import { getDatabase } from "./mongo"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function createUser(
  username: string,
  password: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const db = await getDatabase()
    const hashedPassword = await hashPassword(password)

    const result = await db.collection("users").insertOne({
      username,
      password_hash: hashedPassword,
      telegram_id: null,
      selfie_path: null,
      custom_message: "",
      created_at: new Date(),
      updated_at: new Date(),
    })

    return { success: true, userId: result.insertedId.toString() }
  } catch (error: any) {
    if (error?.code === 11000) {
      return { success: false, error: "Username already exists" }
    }

    console.error("Create user error:", error)
    return { success: false, error: "Failed to create user" }
  }
}
