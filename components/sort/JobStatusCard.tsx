"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function JobStatusCard({ job }: any) {
  const color =
    job.status === "queued" ? "secondary" :
      job.status === "in_progress" ? "default" :
        job.status === "completed" ? "outline" :
          "destructive"
  const displayTime =
    job.status === "processing" && job.in_progress
      ? job.in_progress
      : job.status === "completed" && job.delivered_at
        ? job.delivered_at
        : job.created_at
  const timeLabel =
    job.status === "processing"
      ? "Started at"
      : job.status === "completed"
        ? "Finished at"
        : "Created at"

  return (
    <Card className="p-4 flex justify-between">
      <div>
        <div className="font-semibold">Job #{job._id.slice(-6)}</div>
        <div className="text-sm text-muted-foreground">
          {timeLabel}: {new Date(displayTime).toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">
          {job.photo_count ?? job.image_paths?.length ?? 0} photos ·{" "}
          {job.selected_friend_ids?.length ?? 0} friends
        </div>
      </div>
      <Badge variant={color}>{job.status.replace("_", " ").toUpperCase()}</Badge>
    </Card>
  )
}
