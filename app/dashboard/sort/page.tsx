"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import FriendSelectCard from "@/components/sort/FriendSelectCard"
import UploadCard from "@/components/sort/UploadCard"


export default function SortPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [friends, setFriends] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/friends").then(r => r.json()).then(setFriends)
  }, [])

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/jobs")
      if (res.ok) setJobs(await res.json())
    }

    fetchJobs()
    const i = setInterval(fetchJobs, 4000)
    return () => clearInterval(i)
  }, [])

  const startJob = async () => {
    setLoading(true)
    const fd = new FormData()

    selected.forEach(id => fd.append("friend_ids", id))
    files.forEach(f => fd.append("images", f))

    const res = await fetch("/api/jobs", { method: "POST", body: fd })
    setLoading(false)

    if (!res.ok) {
      alert("Failed to create job")
      return
    }

    setSelected([])
    setFiles([])
    setStep(1)
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create Sorting Job</h1>

      {step === 1 && (
        <>
          <FriendSelectCard friends={friends} selected={selected} onToggle={id =>
            setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
          } />
          <Button disabled={!selected.length} onClick={() => setStep(2)}>Next</Button>
        </>
      )}

      {step === 2 && (
        <UploadCard
          files={files}
          setFiles={setFiles}
          onBack={() => setStep(1)}
          onStart={startJob}
          loading={loading}
        />
      )}


    </div>
  )
}
