"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarMark } from "@/components/avatar-mark"
import { IconUser, IconLogout } from "@/components/icons"

export function ProfileMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 transition-colors hover:border-border-default hover:bg-surface-hover">
        <AvatarMark initials="OP" size="md" variant="user" shape="circle" />
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground lg:block">
          Ops Admin
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 overflow-hidden rounded-lg border border-border-default bg-surface-card p-0 py-1 shadow-md ring-0"
      >
        <div className="flex items-center gap-3 border-b border-border-default px-4 py-3">
          <AvatarMark initials="OP" size="md" variant="user" shape="circle" className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">Ops Admin</p>
            <p className="truncate text-xs text-tertiary">Super Admin</p>
          </div>
        </div>
        <DropdownMenuItem className="gap-2 px-4 py-2.5 text-sm text-muted-foreground focus:bg-surface-hover focus:text-foreground">
          <IconUser className="h-4 w-4 shrink-0" />
          Profile
        </DropdownMenuItem>
        <div className="border-t border-border-default">
          <DropdownMenuItem
            variant="destructive"
            className="gap-2 px-4 py-2.5 text-sm text-error focus:bg-error-bg focus:text-error"
          >
            <IconLogout className="h-4 w-4 shrink-0" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
