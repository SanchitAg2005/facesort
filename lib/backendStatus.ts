export async function checkBackendOnline(): Promise<boolean> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/health`,
            { cache: "no-store" }
        )
        return res.ok
    } catch {
        return false
    }
}
