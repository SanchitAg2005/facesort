"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Group = {
  _id: string
  name: string
  friends: { _id: string }[]
}

type Props = {
  groups: Group[]
  selectedGroupId: string | null
  disabled: boolean
  onSelect: (groupId: string) => void
  onClear: () => void
}

export default function GroupSelectCard({
  groups,
  selectedGroupId,
  disabled,
  onSelect,
  onClear,
}: Props) {
  return (
    <Card className={`p-4 space-y-3 ${disabled ? "opacity-50" : ""}`}>
      <h2 className="font-semibold">Select Group</h2>

      {groups.map(group => (
        <Button
          key={group._id}
          variant={selectedGroupId === group._id ? "default" : "outline"}
          disabled={disabled}
          className="w-full justify-between"
          onClick={() =>
            selectedGroupId === group._id
              ? onClear()
              : onSelect(group._id)
          }
        >
          <span>{group.name}</span>
          <span className="text-xs opacity-70">
            {group.friends.length} friends
          </span>
        </Button>
      ))}
    </Card>
  )
}
