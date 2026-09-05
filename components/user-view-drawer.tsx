"use client"

import { type User } from "@/lib/user-data"
import UserDetailContent from "@/components/user-detail-content"
import {
  AppDrawer,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerTitleWrap,
  AppDrawerTitle,
  AppDrawerClose,
  AppDrawerBody,
} from "@/components/ui/app-drawer"

interface UserViewDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserViewDrawer({ user, open, onOpenChange }: UserViewDrawerProps) {
  return (
    <AppDrawer open={open} onOpenChange={onOpenChange}>
      <AppDrawerContent size="wizard">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>{user?.name ?? "User Details"}</AppDrawerTitle>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          {user && <UserDetailContent user={user} />}
        </AppDrawerBody>
      </AppDrawerContent>
    </AppDrawer>
  )
}
