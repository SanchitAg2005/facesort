"use client"

import Image from "next/image"
import { signOut } from "next-auth/react"
import { useProfile } from "@/lib/useProfile"

export default function TopNav() {
    const profile = useProfile()

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card">
            <div className="flex items-center justify-between p-4">

                {/* LEFT — LOGO */}
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="FaceSort" width={28} height={28} />
                    <span className="text-xl font-semibold">FaceSort</span>
                </div>

                {/* RIGHT — USER INFO */}
                <div className="flex items-center gap-3">
                    {profile?.selfie_url ? (
                        <img
                            src={profile.selfie_url}
                            alt="Profile"
                            className="h-9 w-9 rounded-full object-cover border"
                        />
                    ) : (
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-sm">
                            👤
                        </div>
                    )}

                    <span className="text-sm font-medium">
                        {profile?.username ?? ""}
                    </span>

                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </header>
    )
}
