"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarMark } from "@/components/avatar-mark"
import { IconUser, IconLogout } from "@/components/icons"
import { useProfile } from "@/components/profile-provider"

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

export function ProfileMenu() {
  const { name, role } = useProfile()
  const initials = getInitials(name)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-transparent px-1.5 py-1 transition-colors hover:border-border-default hover:bg-surface-hover">
        <AvatarMark initials={initials} size="md" variant="user" shape="circle" />
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-foreground lg:block">
          {name}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 overflow-hidden rounded-lg border border-border-default bg-surface-card p-0 py-1 shadow-md ring-0"
      >
        <div className="flex items-center gap-3 border-b border-border-default px-4 py-3">
          <AvatarMark initials={initials} size="md" variant="user" shape="circle" className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            <p className="truncate text-xs text-tertiary">{role}</p>
          </div>
        </div>
        <DropdownMenuItem asChild className="gap-2 px-4 py-2.5 text-sm text-muted-foreground focus:bg-surface-hover focus:text-foreground">
          <Link href="/profile">
            <IconUser className="h-4 w-4 shrink-0" />
            Profile
          </Link>
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
