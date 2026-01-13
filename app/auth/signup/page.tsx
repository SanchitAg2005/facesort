"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PrivacyModal } from "@/components/auth/privacy-modal"

import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [privacyAccepted, setPrivacyAccepted] = useState(false)

  // Check privacy acceptance
  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccepted")
    if (accepted === "true") setPrivacyAccepted(true)
  }, [])

  const handleAcceptPrivacy = () => {
    localStorage.setItem("privacyAccepted", "true")
    setPrivacyAccepted(true)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name || !username || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Signup failed")
        return
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push("/dashboard/friends")
      } else {
        setError("Account created but login failed")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PrivacyModal
        isOpen={!privacyAccepted}
        onAccept={handleAcceptPrivacy}
        onDecline={() => router.push("/")}
      />

      {privacyAccepted && (
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <ArrowLeft size={16} /> Back
          </Link>

          <Card className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Create Account</h1>

            {error && (
              <div className="text-sm text-red-500">{error}</div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label>Your Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Username (unique)</Label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button className="w-full" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <p className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-semibold">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      )}
    </div>
  )
}
