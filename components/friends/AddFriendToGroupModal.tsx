"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import FriendSelector from "./FriendSelector"

type Friend = {
  _id: string
  name: string
  status: "queued" | "processed"
}

type Props = {
  open: boolean
  groupId: string | null
  friends: Friend[]
  onClose: () => void
  onAdded: () => void
}

export default function AddFriendToGroupModal({
  open,
  groupId,
  friends,
  onClose,
  onAdded,
}: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addFriends = async () => {
    if (!groupId || selected.length === 0) return

    setLoading(true)

    await Promise.all(
      selected.map((friendId) =>
        fetch(`/api/groups/${groupId}/friends`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ friend_id: friendId }),
        })
      )
    )

    setSelected([])
    setLoading(false)
    onAdded()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Friends to Group</DialogTitle>
        </DialogHeader>

        <FriendSelector
          friends={friends}
          selected={selected}
          onChange={setSelected}
        />

        <Button onClick={addFriends} disabled={loading}>
          {loading ? "Adding…" : "Add Selected Friends"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
