"use client"

/**
 * Dashboard layout
 * Wraps all dashboard pages with navigation
 * Ensures user is authenticated
 */

import type React from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { MobileNav } from "@/components/layout/mobile-nav"
import TopNav from "@/components/layout/TopNav"
import { useProfile } from "@/lib/useProfile"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* TOP NAVBAR */}
      <TopNav />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-2 pb-20">
        {children}
      </main>

      {/* BOTTOM MOBILE NAV */}
      <MobileNav />
    </div>
  )


}
