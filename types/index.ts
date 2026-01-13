/**
 * Shared TypeScript types for FaceSort
 */

export interface User {
  _id?: string
  username: string
  telegram_id?: string | null
  selfie_path?: string | null
  custom_message?: string
  created_at: Date
  updated_at: Date
}

export interface Friend {
  _id?: string
  user_id: string
  name: string
  telegram_id: string
  selfie_path: string
  telegram_connected: boolean
  created_at: Date
  updated_at: Date
}

export interface Job {
  _id?: string
  user_id: string
  selected_friend_ids: string[]
  input_path: string
  status: "queued" | "processing" | "completed" | "failed"
  created_at: Date
  completed_at?: Date
  photo_count: number
}

declare module "next-auth" {
  interface User {
    id: string
    username: string
    telegram_id?: string | null
    selfie_path?: string | null
  }

  interface Session {
    user: User & {
      email?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    telegram_id?: string | null
    selfie_path?: string | null
  }
}
