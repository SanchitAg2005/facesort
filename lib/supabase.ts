/**
 * Supabase client utilities
 * Separate clients for server and client-side operations
 */

import { createClient } from "@supabase/supabase-js"
import { config } from "./config"

// Server-side Supabase client
export function createSupabaseServerClient() {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

// Client-side Supabase client
export function createSupabaseClient() {
  return createClient(config.supabaseUrl, config.supabaseAnonKey)
}

// Helper to upload file to Supabase Storage
export async function uploadToSupabase(bucket: string, path: string, file: File | Blob): Promise<string | null> {
  try {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })

    if (error) {
      console.error("Supabase upload error:", error)
      return null
    }

    return data?.path || null
  } catch (error) {
    console.error("Upload error:", error)
    return null
  }
}

// Helper to delete file from Supabase Storage
export async function deleteFromSupabase(bucket: string, path: string): Promise<boolean> {
  try {
    const supabase = createSupabaseClient()
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) {
      console.error("Supabase delete error:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Delete error:", error)
    return false
  }
}

// Helper to get public URL
export function getSupabasePublicUrl(bucket: string, path: string): string {
  const supabase = createSupabaseClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ""
}
