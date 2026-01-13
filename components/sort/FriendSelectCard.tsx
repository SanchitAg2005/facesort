"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

type Friend = {
  _id: string
  name: string
  status: "queued" | "processed"
  thumbnail_path?: string
}

type Props = {
  friends: Friend[]
  selected: string[]
  onToggle: (id: string) => void
}

export default function FriendSelectCard({ friends, selected, onToggle }: Props) {
  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Select Friends</h2>

      <div className="grid gap-3">
        {friends.map(friend => {
          const disabled = friend.status !== "processed"

          return (
            <div
              key={friend._id}
              className={`flex items-center justify-between p-3 rounded border ${
                disabled ? "opacity-50" : "cursor-pointer"
              }`}
              onClick={() => !disabled && onToggle(friend._id)}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selected.includes(friend._id)}
                  disabled={disabled}
                />
                <span>{friend.name}</span>
              </div>

              {disabled && <Badge variant="secondary">Processing</Badge>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
