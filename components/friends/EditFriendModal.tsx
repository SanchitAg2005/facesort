"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

type Props = {
    open: boolean
    onClose: () => void
    friend: any
    onSaved: () => void
}

export default function EditFriendModal({ open, onClose, friend, onSaved }: Props) {
    const [name, setName] = useState(friend.name)
    const [telegramId, setTelegramId] = useState(friend.telegram_chat_id)
    const [loading, setLoading] = useState(false)

    const save = async () => {
        setLoading(true)
        await fetch(`/api/friends/${friend._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, telegram_chat_id: telegramId }),
        })
        setLoading(false)
        onSaved()
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Friend</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <Label>Telegram ID</Label>
                        <Input value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
                    </div>

                    <Button onClick={save} disabled={loading}>
                        Save Changes
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
