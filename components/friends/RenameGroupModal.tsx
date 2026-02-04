"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  open: boolean
  groupId: string | null
  currentName: string
  onClose: () => void
  onSaved: () => void
}

export default function RenameGroupModal({
  open,
  groupId,
  currentName,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(currentName)

  useEffect(() => {
    setName(currentName)
  }, [currentName])

  const save = async () => {
    if (!groupId) return

    await fetch(`/api/groups/${groupId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })

    onSaved()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Group</DialogTitle>
        </DialogHeader>

        <Input value={name} onChange={(e) => setName(e.target.value)} />

        <Button onClick={save}>Save</Button>
      </DialogContent>
    </Dialog>
  )
}
