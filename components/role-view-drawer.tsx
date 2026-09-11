"use client"

import { type Role } from "@/lib/role-data"
import { type User } from "@/lib/user-data"
import RoleDetailContent from "@/components/role-detail-content"
import {
  AppDrawer,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerTitleWrap,
  AppDrawerTitle,
  AppDrawerClose,
  AppDrawerBody,
} from "@/components/ui/app-drawer"

interface RoleViewDrawerProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
  users: User[]
}

export function RoleViewDrawer({ role, open, onOpenChange, users }: RoleViewDrawerProps) {
  return (
    <AppDrawer open={open} onOpenChange={onOpenChange}>
      <AppDrawerContent size="default">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>{role?.name ?? "Role Details"}</AppDrawerTitle>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          {role && <RoleDetailContent role={role} users={users} />}
        </AppDrawerBody>
      </AppDrawerContent>
    </AppDrawer>
  )
}
