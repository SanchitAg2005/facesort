"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil, WifiOff } from "lucide-react"

import FriendCard from "@/components/friends/FriendCard"
import AddFriendModal from "@/components/friends/AddFriendModal"
import EditFriendModal from "@/components/friends/EditFriendModal"
import TelegramBotCard from "@/components/friends/TelegramBotCard"

type Friend = {
  _id: string
  name: string
  telegram_chat_id: string
  status: "queued" | "processed"
}

export default function FriendsPage() {
  const { status } = useSession()

  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showAdd, setShowAdd] = useState(false)
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null)

  // ================= FETCH FRIENDS =================
  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFriends(data)
    } catch {
      setError("Unable to load friends")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated") fetchFriends()
    const interval = setInterval(() => {
      fetchFriends()
    }, 5000) // poll every 5s

    return () => clearInterval(interval)
  }, [status])

  // ================= DELETE FRIEND =================
  const deleteFriend = async (id: string) => {
    const ok = confirm(
      "This will permanently delete the friend and all related data. Continue?"
    )
    if (!ok) return

    const res = await fetch(`/api/friends/${id}`, { method: "DELETE" })

    if (!res.ok) {
      alert("Failed to delete friend")
      return
    }

    setFriends((prev) => prev.filter((f) => f._id !== id))
  }

  if (status === "loading" || loading) {
    return <div className="p-6">Loading friends…</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Friends</h1>

        <Button className="gap-2" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" />
          Add Friend
        </Button>
      </div>

      {/* TELEGRAM BOT HELPER */}
      <TelegramBotCard />

      {/* FRIEND LIST */}
      {friends.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No friends yet. Add your first friend.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {friends.map((friend) =>
            friend.status === "queued" ? (
              <Card key={friend._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{friend.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Telegram: {friend.telegram_chat_id}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <WifiOff className="h-4 w-4" />
                    Queued (Backend Offline)
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFriend(friend)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteFriend(friend._id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ) : (
              <FriendCard
                key={friend._id}
                friend={friend}
                onEdit={setEditingFriend}
                onDelete={deleteFriend}
              />
            )
          )}
        </div>
      )}

      {/* ADD FRIEND MODAL */}
      <AddFriendModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdded={fetchFriends}
      />

      {/* EDIT FRIEND MODAL */}
      {editingFriend && (
        <EditFriendModal
          open={true}
          friend={editingFriend}
          onClose={() => setEditingFriend(null)}
          onSaved={fetchFriends}
        />
      )}
    </div>
  )
}
