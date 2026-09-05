"use client"

import { useEffect, useState } from "react"
import { Building2 } from "lucide-react"
import { useOrgSettings } from "@/components/org-settings-provider"
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

interface SettingsEditDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsEditDrawer({ open, onOpenChange }: SettingsEditDrawerProps) {
  const { orgName, supportEmail, setOrgSettings } = useOrgSettings()
  const [name, setName] = useState(orgName)
  const [email, setEmail] = useState(supportEmail)

  useEffect(() => {
    if (!open) return
    setName(orgName)
    setEmail(supportEmail)
  }, [open, orgName, supportEmail])

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please fill in required fields")
      return
    }
    setOrgSettings({ orgName: name.trim(), supportEmail: email.trim() })
    onOpenChange(false)
  }

  return (
    <AppDrawer open={open} onOpenChange={onOpenChange}>
      <AppDrawerContent size="default">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>Edit Organization</AppDrawerTitle>
            <AppDrawerDescription>Update your organization's identity</AppDrawerDescription>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Building2 className="h-4 w-4 text-primary" /> Organization
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="orgName" className="text-xs font-mono">
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="supportEmail" className="text-xs font-mono">Support Email</Label>
                <Input id="supportEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
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
