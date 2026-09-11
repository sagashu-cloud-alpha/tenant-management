"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { AvatarMark } from "./avatar-mark"
import { IconGrid, IconUsers, IconAdministration } from "@/components/icons"
import { Shield, SlidersHorizontal } from "lucide-react"
import { useOrgSettings } from "@/components/org-settings-provider"
import { useCurrentUserRoles } from "@/components/current-user-provider"
import { canAccessAdmin } from "@/lib/permissions"
import type { ComponentType } from "react"

type NavIcon = ComponentType<{ className?: string }>
type NavSection = { label: string; adminOnly?: boolean; items: { title: string; href: string; icon: NavIcon }[] }

const navSections: NavSection[] = [
  {
    label: "Workspace",
    items: [
      { title: "Tenants", href: "/tenants", icon: IconGrid },
      { title: "Configuration", href: "/configuration", icon: SlidersHorizontal },
    ],
  },
  {
    label: "Admin",
    // Users/Roles are Owner-only end to end (backend rejects reads too, see
    // UserController/RoleController) and Settings is grouped alongside them —
    // Developer/Viewer never see this section at all.
    adminOnly: true,
    items: [
      { title: "Users", href: "/users", icon: IconUsers },
      { title: "Roles", href: "/roles", icon: Shield },
      { title: "Settings", href: "/settings", icon: IconAdministration },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href.startsWith("/tenants") && pathname === "/tenants") return true
  if (href.startsWith("/tenants") && pathname.startsWith("/tenants/"))
    return true
  return pathname === href || pathname.startsWith(href + "/")
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return initials || "CA"
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state, setOpenMobile, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { orgName } = useOrgSettings()
  const roles = useCurrentUserRoles()
  const visibleSections = navSections.filter((section) => !section.adminOnly || canAccessAdmin(roles))

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="h-[58px] shrink-0 justify-center border-b px-4 group-data-[collapsible=icon]:px-3">
        <Link
          href="/tenants"
          className="flex items-center gap-2.5 no-underline group-data-[collapsible=icon]:justify-center"
        >
          <AvatarMark initials={getInitials(orgName)} size="sm" variant="brand" shape="rounded" />
          {!isCollapsed && (
            <span className="font-display text-[17px] font-bold tracking-tight truncate">
              {orgName}
              <span className="ml-1 rounded border border-primary bg-primary/10 px-[5px] py-[1px] align-middle font-mono text-[9px] text-primary">
                SaaS
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {visibleSections.map((section) => (
          <SidebarGroup
            key={section.label}
            className="px-2.5 py-1 group-data-[collapsible=icon]:px-2"
          >
            <SidebarGroupLabel className="h-auto px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase group-data-[collapsible=icon]:hidden">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className="h-9 rounded-md px-[10px] py-0 text-[13.5px] font-medium text-muted-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 hover:bg-surface-hover hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-medium [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:opacity-65 data-[active=true]:[&_svg]:opacity-100 hover:[&_svg]:opacity-100"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5"
                          onClick={handleNavClick}
                        >
                          <item.icon />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
