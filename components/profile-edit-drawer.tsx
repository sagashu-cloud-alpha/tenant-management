"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { useProfile } from "@/components/profile-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { IconCheck } from "@/components/icons"
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

interface ProfileEditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileEditDrawer({ open, onOpenChange }: ProfileEditDrawerProps) {
  const { name: currentName, email: currentEmail, role, setProfile } = useProfile()
  const [name, setName] = useState(currentName)
  const [email, setEmail] = useState(currentEmail)

  useEffect(() => {
    if (!open) return
    setName(currentName)
    setEmail(currentEmail)
  }, [open, currentName, currentEmail])

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      alert("Please fill in required fields")
      return
    }
    setProfile({ name: name.trim(), email: email.trim(), role })
    onOpenChange(false)
  }

  return (
    <AppDrawer open={open} onOpenChange={onOpenChange}>
      <AppDrawerContent size="default">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>Edit Profile</AppDrawerTitle>
            <AppDrawerDescription>Update your personal details</AppDrawerDescription>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4 text-primary" /> Profile Details
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="profileName" className="text-xs font-mono">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input id="profileName" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="profileEmail" className="text-xs font-mono">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input id="profileEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
          </Card>
        </AppDrawerBody>

        <AppDrawerFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <IconCheck className="mr-1 h-3.5 w-3.5" /> Save Changes
          </Button>
        </AppDrawerFooter>
      </AppDrawerContent>
    </AppDrawer>
  )
}
