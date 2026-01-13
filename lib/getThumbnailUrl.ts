import { supabaseClient } from "@/lib/supabaseClient"

export async function getThumbnailUrl(path: string) {
    const { data, error } = await supabaseClient.storage
        .from("facesort")
        .createSignedUrl(path, 60 * 60)

    if (error) {
        console.error("Signed URL error:", error)
        return null
    }

    return data.signedUrl
}
