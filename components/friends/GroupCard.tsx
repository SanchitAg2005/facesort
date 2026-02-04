"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Trash2, Plus, Pencil } from "lucide-react"

type Friend = {
  _id: string
  name: string
}

type Group = {
  _id: string
  name: string
  friends: Friend[]
}

type Props = {
  group: Group
  onRefresh: () => void
  onAddFriend: (groupId: string) => void
  onRename: (group: Group) => void
}

export default function GroupCard({
  group,
  onRefresh,
  onAddFriend,
  onRename,
}: Props) {
  const [open, setOpen] = useState(false)

  const removeFriend = async (friendId: string) => {
    await fetch(`/api/groups/${group._id}/friends`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friend_id: friendId }),
    })
    onRefresh()
  }

  return (
    <Card className="p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{group.name}</div>
          <div className="text-xs text-muted-foreground">
            {group.friends.length} friends
          </div>
        </div>

        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={() => onRename(group)}>
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={async () => {
              if (!confirm("Delete this group?")) return
              await fetch(`/api/groups/${group._id}`, { method: "DELETE" })
              onRefresh()
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>

          <Button size="icon" variant="ghost" onClick={() => setOpen(!open)}>
            {open ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="pt-2 space-y-2 border-t">
          {group.friends.map((f) => (
            <div key={f._id} className="flex justify-between text-sm">
              <span>{f.name}</span>
              <Button size="icon" variant="ghost" onClick={() => removeFriend(f._id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => onAddFriend(group._id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>
        </div>
      )}
    </Card>
  )
}
