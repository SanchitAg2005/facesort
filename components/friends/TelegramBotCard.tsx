"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const BOT_LINK = "https://t.me/FaceSort_Bot" // replace if needed

export default function TelegramBotCard() {
    const [copied, setCopied] = useState(false)

    const copyLink = async () => {
        await navigator.clipboard.writeText(BOT_LINK)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <img src="/telegram-bot-qr.png" className="w-40 mx-auto" />

            <p className="text-sm text-center text-muted-foreground">
                Ask your friend to start the bot
            </p>

            <Button onClick={copyLink} className="w-full">
                {copied ? "Link Copied ✅" : "Copy Bot Link"}
            </Button>
        </div>
    )
}
