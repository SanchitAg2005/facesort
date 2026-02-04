"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, WifiOff } from "lucide-react"

import CreateGroupModal from "@/components/friends/CreateGroupModal"
import GroupCard from "@/components/friends/GroupCard"
import AddFriendToGroupModal from "@/components/friends/AddFriendToGroupModal"
import RenameGroupModal from "@/components/friends/RenameGroupModal"

import FriendTutorial from "@/components/friends/FriendTutorial"
import FriendCard from "@/components/friends/FriendCard"
import AddFriendModal from "@/components/friends/AddFriendModal"
import EditFriendModal from "@/components/friends/EditFriendModal"
import TelegramBotCard from "@/components/friends/TelegramBotCard"

/* ================= TYPES ================= */

type Friend = {
  _id: string
  name: string
  telegram_chat_id: string
  status: "queued" | "processed"
}

type Group = {
  _id: string
  name: string
  friends: {
    _id: string
    name: string
    status: "queued" | "processed"
  }[]
}

/* ================= PAGE ================= */

export default function FriendsPage() {
  const { status } = useSession()

  const [friends, setFriends] = useState<Friend[]>([])
  const [groups, setGroups] = useState<Group[]>([])

  const [showAddFriend, setShowAddFriend] = useState(false)
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null)

  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null)

  const [renamingGroup, setRenamingGroup] = useState<Group | null>(null)

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* ================= DERIVED ================= */

  const activeGroup = groups.find(g => g._id === activeGroupId)

  const selectableFriends = friends.filter(
    f => !activeGroup?.friends.some(gf => gf._id === f._id)
  )

  /* ================= FETCH FRIENDS ================= */
  const fetchFriends = async () => {
    try {
      const res = await fetch("/api/friends")
      if (!res.ok) throw new Error()
      setFriends(await res.json())
    } catch {
      setError("Unable to load friends")
    } finally {
      setLoading(false)
    }
  }

  /* ================= FETCH GROUPS ================= */
  const fetchGroups = async () => {
    try {
      const res = await fetch("/api/groups")
      if (!res.ok) throw new Error()
      setGroups(await res.json())
    } catch {
      console.error("Failed to load groups")
    }
  }

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (status === "authenticated") {
      fetchFriends()
      fetchGroups()
    }

    const interval = setInterval(() => {
      fetchFriends()
      fetchGroups()
    }, 5000)

    return () => clearInterval(interval)
  }, [status])

  /* ================= DELETE FRIEND ================= */
  const deleteFriend = async (id: string) => {
    const ok = confirm("This will permanently delete the friend. Continue?")
    if (!ok) return

    const res = await fetch(`/api/friends/${id}`, { method: "DELETE" })
    if (!res.ok) return alert("Failed to delete friend")

    setFriends(prev => prev.filter(f => f._id !== id))
  }

  /* ================= FILTERING ================= */
  const q = search.toLowerCase()
  const filteredFriends = friends.filter(f => f.name.toLowerCase().includes(q))
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(q))

  /* ================= STATES ================= */
  if (status === "loading" || loading) {
    return <div className="p-6">Loading friends…</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  /* ================= RENDER ================= */
  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Friends</h1>

        <div className="flex gap-2">
          <Button onClick={() => setShowAddFriend(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>

          <Button variant="outline" onClick={() => setShowCreateGroup(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Group
          </Button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search friends or groups…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full max-w-md rounded-md border px-3 py-2 text-sm"
      />

      <TelegramBotCard />

      {/* ================= GROUPS ================= */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Groups</h2>

        {filteredGroups.length === 0 ? (
          <Card className="p-4 text-sm text-muted-foreground">
            No groups found.
          </Card>
        ) : (
          <div className="grid gap-3">
            {filteredGroups.map(group => (
              <GroupCard
                key={group._id}
                group={group}
                onRefresh={fetchGroups}
                onAddFriend={setActiveGroupId}
                onRename={setRenamingGroup}
              />
            ))}
          </div>
        )}
      </div>

      {/* ================= FRIENDS ================= */}
      {filteredFriends.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No friends found.</p>
          <FriendTutorial />
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredFriends.map(friend =>
            friend.status === "queued" ? (
              <Card key={friend._id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{friend.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Telegram: {friend.telegram_chat_id}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-orange-500">
                    <WifiOff className="h-4 w-4" />
                    Queued
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditingFriend(friend)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => deleteFriend(friend._id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ) : (
              <FriendCard
                key={friend._id}
                friend={friend}
                onEdit={setEditingFriend}
                onDelete={deleteFriend}
              />
            )
          )}
        </div>
      )}

      {/* ================= MODALS ================= */}
      <AddFriendModal
        open={showAddFriend}
        onClose={() => setShowAddFriend(false)}
        onAdded={fetchFriends}
      />

      {editingFriend && (
        <EditFriendModal
          open={true}
          friend={editingFriend}
          onClose={() => setEditingFriend(null)}
          onSaved={fetchFriends}
        />
      )}

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        friends={friends}
        onCreated={fetchGroups}
      />

      <AddFriendToGroupModal
        open={!!activeGroupId}
        groupId={activeGroupId}
        friends={selectableFriends}
        onClose={() => setActiveGroupId(null)}
        onAdded={fetchGroups}
      />

      <RenameGroupModal
        open={!!renamingGroup}
        groupId={renamingGroup?._id ?? null}
        currentName={renamingGroup?.name ?? ""}
        onClose={() => setRenamingGroup(null)}
        onSaved={fetchGroups}
      />
    </div>
  )
}
