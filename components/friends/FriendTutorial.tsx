"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function FriendTutorial() {
  const [open, setOpen] = useState(true)

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">
          How to add your first friend
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {open && (
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Share the Telegram bot link with your friend</li>
          <li>Ask them to start the bot and send you their Chat ID</li>
          <li>
            Click <b>Add Friend</b>, enter name, Chat ID, and upload their selfie
          </li>
          <li>Click Add — done 🎉</li>
        </ol>
      )}
    </Card>
  )
}
