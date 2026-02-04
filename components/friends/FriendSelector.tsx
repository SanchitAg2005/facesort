"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type Friend = {
  _id: string
  name: string
  status: "queued" | "processed"
}

type Props = {
  friends: Friend[]
  selected: string[]
  onChange: (ids: string[]) => void
}

export default function FriendSelector({
  friends,
  selected,
  onChange,
}: Props) {
  const [search, setSearch] = useState("")

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const q = search.toLowerCase()

  const filteredFriends = friends.filter((f) =>
    f.name.toLowerCase().includes(q)
  )

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search friends…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-60 overflow-y-auto space-y-2">
        {filteredFriends.map((friend) => (
          <Card
            key={friend._id}
            className="flex items-center gap-3 p-2 cursor-pointer"
            onClick={() => toggle(friend._id)}
          >
            <Checkbox checked={selected.includes(friend._id)} />
            <div className="text-sm">
              {friend.name}
              {friend.status === "queued" && (
                <span className="ml-2 text-xs text-orange-500">
                  (queued)
                </span>
              )}
            </div>
          </Card>
        ))}

        {filteredFriends.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No friends found.
          </div>
        )}
      </div>
    </div>
  )
}
