"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  files: File[]
  setFiles: (f: File[]) => void
  onBack: () => void
  onStart: () => void
  loading: boolean
}

export default function UploadCard({
  files,
  setFiles,
  onBack,
  onStart,
  loading
}: Props) {
  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Upload Photos</h2>

      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={e => {
          if (e.target.files) {
            setFiles(Array.from(e.target.files))
          }
        }}
      />

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Previous
        </Button>

        <Button
          onClick={onStart}
          disabled={files.length === 0 || loading}
        >
          {loading ? "Starting…" : "Start Job"}
        </Button>
      </div>
    </Card>
  )
}
