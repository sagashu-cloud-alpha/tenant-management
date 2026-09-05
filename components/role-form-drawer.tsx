"use client"

import { useEffect, useState } from "react"
import { Shield } from "lucide-react"
import { type Role, emptyRole } from "@/lib/role-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface RoleFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  nextId: string
  onSave: (role: Role) => void
}

export function RoleFormDrawer({ open, onOpenChange, role, nextId, onSave }: RoleFormDrawerProps) {
  const isEdit = !!role

  const [name, setName] = useState(emptyRole.name)
  const [description, setDescription] = useState(emptyRole.description)

  const reset = () => {
    setName(emptyRole.name)
    setDescription(emptyRole.description)
  }

  useEffect(() => {
    if (!open) return
    if (role) {
      setName(role.name)
      setDescription(role.description)
    } else {
      reset()
    }
  }, [role, open])

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please fill in required fields")
      return
    }
    const saved: Role = {
      id: role?.id ?? nextId,
      name: name.trim(),
      description: description.trim(),
      created: role?.created ?? new Date().toISOString().slice(0, 10),
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
      <AppDrawerContent size="default">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>{isEdit ? "Edit Role" : "Create Role"}</AppDrawerTitle>
            <AppDrawerDescription>
              {isEdit ? "Update this role's name and description" : "Define a new role users can be assigned"}
            </AppDrawerDescription>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Shield className="h-4 w-4 text-primary" /> Role Details
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="roleName" className="text-xs font-mono">
                  Role Name <span className="text-destructive">*</span>
                </Label>
                <Input id="roleName" placeholder="e.g. Support" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="roleDescription" className="text-xs font-mono">Description</Label>
                <Textarea
                  id="roleDescription"
                  placeholder="What this role can do..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        </AppDrawerBody>

        <AppDrawerFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <IconCheck className="mr-1 h-3.5 w-3.5" /> {isEdit ? "Save Changes" : "Create Role"}
          </Button>
        </AppDrawerFooter>
      </AppDrawerContent>
    </AppDrawer>
  )
}
