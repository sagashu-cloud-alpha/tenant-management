"use client"

import { useState } from "react"
import { Mail, User } from "lucide-react"
import { useProfile } from "@/components/profile-provider"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconEdit } from "@/components/icons"
import { ProfileEditDrawer } from "@/components/profile-edit-drawer"

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return initials || "U"
}

export default function ProfilePage() {
  const { name, email, role } = useProfile()
  const [editOpen, setEditOpen] = useState(false)
  const initials = getInitials(name)

  return (
    <div className="space-y-6">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl font-bold bg-primary/10 text-primary border border-primary/20">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold font-display text-foreground truncate">{name}</h2>
              <Badge variant="outline">{role}</Badge>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5" /> {email}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 self-start sm:self-center" title="Edit" onClick={() => setEditOpen(true)}>
            <IconEdit className="size-3" />
          </Button>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
          <User className="h-4 w-4 text-primary" /> Account Details
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1 font-semibold">Full Name</div>
            <div className="text-sm font-medium text-foreground">{name}</div>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1 font-semibold">Email Address</div>
            <div className="text-sm font-medium text-foreground font-mono break-all">{email}</div>
          </div>
          <div>
            <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1 font-semibold">Role</div>
            <div className="text-sm font-medium text-foreground">{role}</div>
          </div>
        </div>
      </Card>

      <ProfileEditDrawer open={editOpen} onOpenChange={setEditOpen} />
    </div>
  )
}
