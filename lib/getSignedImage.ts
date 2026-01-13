import { createSupabaseClient } from "@/lib/supabase"

export async function getSignedImage(path: string) {
    if (!path) return null

    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .storage
        .from("facesort")
        .createSignedUrl(path, 60 * 60) // 1 hour

    if (error) {
        console.error("Signed URL error:", error)
        return null
    }

    return data.signedUrl
}
