"use client"

import { useEffect, useState } from "react"

type Profile = {
    username: string
    selfie_url: string | null
}

export function useProfile() {
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        fetch("/api/profile/get")
            .then((res) => res.json())
            .then((data) => setProfile(data))
            .catch(() => { })
    }, [])

    return profile
}
