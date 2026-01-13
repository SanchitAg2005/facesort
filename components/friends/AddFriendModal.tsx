"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
    open: boolean
    onClose: () => void
    onAdded: () => void
}

export default function AddFriendModal({ open, onClose, onAdded }: Props) {
    const [name, setName] = useState("")
    const [telegramId, setTelegramId] = useState("")
    const [photo, setPhoto] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleAdd = async () => {
        if (!name || !telegramId || !photo) {
            setError("All fields are required")
            return
        }

        setLoading(true)
        setError("")

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("telegram_chat_id", telegramId)
            formData.append("photo", photo)

            const res = await fetch("/api/friends", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error()

            onAdded()
            onClose()
            setName("")
            setTelegramId("")
            setPhoto(null)
        } catch {
            setError("Failed to add friend")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Friend</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label>Telegram Chat ID</Label>
                        <Input value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
                    </div>

                    <div>
                        <Label>Selfie</Label>
                        <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button onClick={handleAdd} disabled={loading}>
                        {loading ? "Adding…" : "Add Friend"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
