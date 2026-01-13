"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type ProfileResponse = {
  username: string
  telegram_id: string | null
  custom_message: string
  selfie_url: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [telegramId, setTelegramId] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchProfile = async () => {
    const res = await fetch("/api/profile/get")
    const data = await res.json()

    setProfile(data)
    setTelegramId(data.telegram_id ?? "")
    setCustomMessage(data.custom_message ?? "")
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setError("")

    try {
      await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegram_id: telegramId,
          custom_message: customMessage,
        }),
      })

      if (photo) {
        const fd = new FormData()
        fd.append("photo", photo)

        await fetch("/api/profile/upload-photo", {
          method: "POST",
          body: fd,
        })
      }

      await fetchProfile()
      setIsEditing(false)
    } catch {
      setError("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return <p className="p-4 text-muted-foreground">Loading profile...</p>
  }

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">

      {/* HEADER WITH DP + USERNAME */}
      <div className="flex items-center gap-4">
        {profile.selfie_url ? (
          <img
            src={profile.selfie_url}
            className="h-20 w-20 rounded-full object-cover border"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            👤
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">{profile.username}</h1>
          <p className="text-muted-foreground">Profile Settings</p>
        </div>

        {!isEditing && (
          <Button
            className="ml-auto"
            variant="outline"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </div>

      {/* PROFILE FORM */}
      <Card className="p-6 space-y-4">
        <div>
          <Label>Telegram ID</Label>
          <Input
            disabled={!isEditing}
            value={telegramId}
            onChange={(e) => setTelegramId(e.target.value)}
          />
        </div>

        <div>
          <Label>Custom Message</Label>
          <Textarea
            disabled={!isEditing}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
          />
        </div>

        <div>
          <Label>Profile Photo</Label>
          <Input
            type="file"
            disabled={!isEditing}
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isEditing && (
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </Card>
    </div>
  )
}
