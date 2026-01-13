"use client"

/**
 * Job History Page
 * Shows all jobs created by the user
 * Read-only view
 */

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import JobStatusCard from "@/components/sort/JobStatusCard"

type Job = {
  _id: string
  status: string
  created_at: string
}

export default function HistoryPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // -------- FETCH JOB HISTORY --------
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs")
        if (res.ok) {
          const data = await res.json()
          setJobs(data)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
    const interval = setInterval(fetchJobs, 10_000) // slower than live page
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Job History
        </h1>
        <p className="text-muted-foreground">
          View all your sorting jobs and their status
        </p>
      </div>

      {loading && (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Loading jobs…</p>
        </Card>
      )}

      {!loading && jobs.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            No jobs yet. Create your first sorting job to see it here.
          </p>
        </Card>
      )}

      {jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map(job => (
            <JobStatusCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}
