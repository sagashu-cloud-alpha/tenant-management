"use client"

import { useEffect, useState } from "react"
import { Shield, StickyNote } from "lucide-react"
import { type User, type UserStatus, ROLES, COLORS, emptyUser } from "@/lib/user-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconGrid, IconCheck } from "@/components/icons"
import {
  AppDrawer,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerTitleWrap,
  AppDrawerTitle,
  AppDrawerDescription,
  AppDrawerClose,
  AppDrawerBody,
  AppDrawerFooter,
} from "@/components/ui/app-drawer"

interface UserFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  nextId: string
  onSave: (user: User) => void
}

export function UserFormDrawer({ open, onOpenChange, user, nextId, onSave }: UserFormDrawerProps) {
  const isEdit = !!user

  const [firstName, setFirstName] = useState(emptyUser.firstName)
  const [lastName, setLastName] = useState(emptyUser.lastName)
  const [username, setUsername] = useState(emptyUser.username)
  const [email, setEmail] = useState(emptyUser.email)
  const [phone, setPhone] = useState(emptyUser.phone)
  const [status, setStatus] = useState<UserStatus>(emptyUser.status)
  const [roles, setRoles] = useState<Set<string>>(new Set())
  const [notes, setNotes] = useState(emptyUser.notes)

  const reset = () => {
    setFirstName(emptyUser.firstName); setLastName(emptyUser.lastName); setUsername(emptyUser.username)
    setEmail(emptyUser.email); setPhone(emptyUser.phone); setStatus(emptyUser.status)
    setRoles(new Set()); setNotes(emptyUser.notes)
  }

  useEffect(() => {
    if (!open) return
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setUsername(user.username)
      setEmail(user.email)
      setPhone(user.phone)
      setStatus(user.status)
      setRoles(new Set(user.roles))
      setNotes(user.notes)
    } else {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, open])

  const toggleRole = (r: string) =>
    setRoles((prev) => {
      const next = new Set(prev)
      next.has(r) ? next.delete(r) : next.add(r)
      return next
    })

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim()) {
      alert("Please fill in required fields")
      return
    }
    const saved: User = {
      id: user?.id ?? nextId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      status,
      roles: Array.from(roles),
      notes: notes.trim(),
      colorIdx: user?.colorIdx ?? Math.floor(Math.random() * COLORS.length),
      created: user?.created ?? new Date().toISOString().slice(0, 10),
      lastActive: user?.lastActive ?? "—",
    }
    onSave(saved)
    onOpenChange(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="wizard">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>{isEdit ? "Edit User" : "Create User"}</AppDrawerTitle>
            <AppDrawerDescription>
              {isEdit ? "Update account details and access" : "Invite a new user and assign their access"}
            </AppDrawerDescription>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          <div className="flex flex-col gap-5">
            {/* Basic Information */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <IconGrid className="h-4 w-4 text-primary" /> Basic Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="firstName" className="text-xs font-mono">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="firstName" placeholder="Jordan" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lastName" className="text-xs font-mono">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="lastName" placeholder="Morgan" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="username" className="text-xs font-mono">
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <Input id="username" placeholder="jmorgan" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-xs font-mono">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" type="email" placeholder="jordan@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="phone" className="text-xs font-mono">Contact Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </Card>

            {/* Access */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4 text-primary" /> Access
              </div>
              <div className="flex flex-col gap-2 sm:w-1/2 sm:pr-2">
                <Label htmlFor="status" className="text-xs font-mono">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as UserStatus)}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Assigned Roles */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Shield className="h-4 w-4 text-primary" /> Assigned Roles
              </div>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Badge
                    key={r}
                    variant={roles.has(r) ? "default" : "outline"}
                    className={`cursor-pointer transition-all font-mono text-xs ${roles.has(r) ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:border-primary hover:text-primary"}`}
                    onClick={() => toggleRole(r)}
                  >
                    {r}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <StickyNote className="h-4 w-4 text-primary" /> Notes
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes" className="text-xs font-mono">Internal Notes</Label>
                <Textarea id="notes" placeholder="Optional context about this user..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[80px]" />
              </div>
            </Card>
          </div>
        </AppDrawerBody>

        <AppDrawerFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <IconCheck className="mr-1 h-3.5 w-3.5" /> {isEdit ? "Save Changes" : "Create User"}
          </Button>
        </AppDrawerFooter>
      </AppDrawerContent>
    </AppDrawer>
  )
}
