"use client"
import { useEffect, useState } from "react"
import { getThumbnailUrl } from "@/lib/getThumbnailUrl"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, WifiOff, User } from "lucide-react"
import { supabaseClient } from "@/lib/supabaseClient"

type Friend = {
    _id: string
    name: string
    telegram_chat_id: string
    status: "queued" | "processed"
    thumbnail_path?: string | null
}

type FriendCardProps = {
    friend: Friend
    onEdit: (friend: Friend) => void
    onDelete: (id: string) => void
}

export default function FriendCard({
    friend,
    onEdit,
    onDelete,
}: FriendCardProps) {
    const showAvatar = friend.status === "processed" && friend.thumbnail_path
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    useEffect(() => {
        if (!friend.thumbnail_path) return

        getThumbnailUrl(friend.thumbnail_path).then((url) => {
            if (url) setAvatarUrl(url)
        })
    }, [friend.thumbnail_path])

    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {showAvatar ? (
                            <img
                                src={avatarUrl!}
                                alt={friend.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <User className="h-6 w-6 text-muted-foreground" />
                        )}
                    </div>

                    {/* INFO */}
                    <div>
                        <div className="font-semibold">{friend.name}</div>
                        <div className="text-sm text-muted-foreground">
                            Telegram: {friend.telegram_chat_id}
                        </div>
                    </div>
                </div>

                {/* STATUS */}
                {friend.status === "queued" && (
                    <div className="flex items-center gap-1 text-xs text-orange-500">
                        <WifiOff className="h-4 w-4" />
                        Queued
                    </div>
                )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(friend)}
                >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                </Button>

                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(friend._id)}
                >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                </Button>
            </div>
        </Card>
    )
}
