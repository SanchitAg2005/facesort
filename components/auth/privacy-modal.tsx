"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PrivacyModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export function PrivacyModal({ isOpen, onAccept, onDecline }: PrivacyModalProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-h-[90vh] flex flex-col p-0">

        {/* HEADER */}
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="text-xl font-semibold">
            Privacy & Data Policy
          </DialogTitle>
        </DialogHeader>

        {/* SCROLLABLE CONTENT */}
        <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
          <div className="space-y-4 text-sm text-popover">
            <p>
              We respect your privacy. This app processes images only for the
              purpose of sorting and delivery.
            </p>
            <p>
              <strong>What we collect:</strong> usernames, friend names,
              Telegram IDs, uploaded images.
            </p>
            <p>
              <strong>Permanent storage:</strong> friend embeddings and thumbnails.
            </p>
            <p>
              <strong>Temporary storage:</strong> batch photos (deleted after job completion).
            </p>
            <p>
              <strong>Security:</strong> all data is processed securely and isolated per user.
            </p>
            <p>
              <strong>Privacy:</strong> your data is never shared with third parties.
            </p>
          </div>
        </ScrollArea>

        {/* FIXED BUTTON FOOTER */}
        <div className="flex gap-3 px-6 py-4 border-t flex-shrink-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDecline}
          >
            Decline
          </Button>
          <Button
            className="flex-1"
            onClick={onAccept}
          >
            Accept & Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
