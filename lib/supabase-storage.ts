import { getSupabaseServerClient } from "./supabase-server"

const BUCKET = "facesort"

export async function uploadToSupabase(
    path: string,
    data: Buffer,
    contentType: string
) {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, data, {
            contentType,
            upsert: false,
        })

    if (error) throw error
}

export async function deleteFromSupabase(path: string) {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([path])

    if (error) throw error
}
