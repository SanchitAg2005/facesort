"use client"

import { Button } from "@/components/ui/button"

const BOT_LINK = "https://t.me/FaceSort_Bot"

export default function TelegramBotCard() {
    const sendOnWhatsApp = () => {
        const message = `Hey   
Here’s the FaceSort Telegram bot,  

 ${BOT_LINK}  

Please start the bot and share your chat ID with me so I can send you photos automatically .`

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`

        window.open(whatsappUrl, "_blank")
    }

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <img src="/telegram-bot-qr.png" className="w-40 mx-auto" />

            <p className="text-sm text-center text-muted-foreground">
                Ask your friend to start the bot
            </p>

            <Button onClick={sendOnWhatsApp} className="w-full">
                Share Link
            </Button>
        </div>
    )
}
