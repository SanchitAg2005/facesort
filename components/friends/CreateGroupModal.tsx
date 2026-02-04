"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import FriendSelector from "./FriendSelector"

type Friend = {
  _id: string
  name: string
  status: "queued" | "processed"
}

type Props = {
  open: boolean
  onClose: () => void
  friends: Friend[]
  onCreated: () => void
}

export default function CreateGroupModal({
  open,
  onClose,
  friends,
  onCreated,
}: Props) {
  const [name, setName] = useState("")
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const createGroup = async () => {
    if (!name.trim()) {
      setError("Group name is required")
      return
    }

    if (selectedFriends.length < 2) {
      setError("Select at least 2 friends")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 1️⃣ Create group
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error()

      const group = await res.json()
      const groupId = group._id

      // 2️⃣ Add friends to group
      await Promise.all(
        selectedFriends.map((friendId) =>
          fetch(`/api/groups/${groupId}/friends`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ friend_id: friendId }),
          })
        )
      )

      setName("")
      setSelectedFriends([])
      onCreated()
      onClose()
    } catch {
      setError("Failed to create group")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Group Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. College Friends"
            />
          </div>

          <div>
            <Label>Select Friends</Label>
            <FriendSelector
              friends={friends}
              selected={selectedFriends}
              onChange={setSelectedFriends}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button onClick={createGroup} disabled={loading}>
            {loading ? "Creating…" : "Create Group"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
