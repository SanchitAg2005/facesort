"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import FriendSelectCard from "@/components/sort/FriendSelectCard"
import GroupSelectCard from "@/components/sort/GroupSelectCard"
import UploadCard from "@/components/sort/UploadCard"
import { toast } from "sonner"
import { supabaseClient } from "@/lib/supabaseClient"
import { useSession } from "next-auth/react"

type Friend = {
  _id: string
  name: string
}

type Group = {
  _id: string
  name: string
  friends: Friend[]
}

export default function SortPage() {
  const { data: session } = useSession()

  const [step, setStep] = useState<1 | 2>(1)

  const [friends, setFriends] = useState<Friend[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetch("/api/friends").then(r => r.json()).then(setFriends)
    fetch("/api/groups").then(r => r.json()).then(setGroups)
  }, [])

  /* ================= DERIVED ================= */
  const finalFriendIds = selectedGroupId
    ? groups.find(g => g._id === selectedGroupId)?.friends.map(f => f._id) ?? []
    : selectedFriends

  /* ================= START JOB ================= */
  const startJob = async () => {
    if (!session?.user?.id) {
      toast.error("Not authenticated")
      return
    }

    if (!files.length || !finalFriendIds.length) {
      toast.error("Select friends or a group, and photos")
      return
    }

    try {
      setLoading(true)

      const userId = session.user.id
      const image_paths: string[] = []

      for (const file of files) {
        const path = `users/${userId}/jobs/${crypto.randomUUID()}.jpg`

        const { error } = await supabaseClient.storage
          .from("facesort")
          .upload(path, file, { upsert: false })

        if (error) throw error

        image_paths.push(path)
      }

      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          friend_ids: finalFriendIds,
          image_paths,
        }),
      })

      if (!res.ok) throw new Error("Job creation failed")

      toast.success("Sorting started", {
        description: "You can track progress in History",
      })

      setSelectedFriends([])
      setSelectedGroupId(null)
      setFiles([])
      setStep(1)
    } catch (err) {
      console.error(err)
      toast.error("Failed to create job")
    } finally {
      setLoading(false)
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Create Sorting Job</h1>

      {step === 1 && (
        <>
          <FriendSelectCard
            friends={friends}
            selected={selectedFriends}
            disabled={!!selectedGroupId}
            onToggle={id =>
              setSelectedFriends(s =>
                s.includes(id) ? s.filter(x => x !== id) : [...s, id]
              )
            }
          />

          <GroupSelectCard
            groups={groups}
            selectedGroupId={selectedGroupId}
            disabled={selectedFriends.length > 0}
            onSelect={setSelectedGroupId}
            onClear={() => setSelectedGroupId(null)}
          />

          <Button
            disabled={!finalFriendIds.length}
            onClick={() => setStep(2)}
          >
            Next
          </Button>
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
