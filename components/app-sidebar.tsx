"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

const navSections = [
  {
    label: "Workspace",
    items: [
      { title: "Tenants", href: "/tenants", icon: "ti ti-building-skyscraper" },
      {
        title: "Create Tenant",
        href: "/create-tenants",
        icon: "ti ti-circle-plus",
      },
      {
        title: "Tenant Detail",
        href: "/tenant-details",
        icon: "ti ti-layout-dashboard",
      },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Deployments", href: "/deployment", icon: "ti ti-container" },
      { title: "Monitoring", href: "/monitoring", icon: "ti ti-activity" },
      { title: "Security", href: "/security", icon: "ti ti-shield-check" },
      { title: "API Keys", href: "/api-keys", icon: "ti ti-key" },
    ],
  },
  {
    label: "Admin",
    items: [
      { title: "Users", href: "/users", icon: "ti ti-users" },
      { title: "Settings", href: "/settings", icon: "ti ti-settings" },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href.startsWith("/tenants") && pathname === "/tenants") return true
  if (href.startsWith("/tenants") && pathname.startsWith("/tenants/"))
    return true
  return pathname === href || pathname.startsWith(href + "/")
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state, setOpenMobile, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader className="border-b px-5 pt-[22px] pb-[18px] group-data-[collapsible=icon]:px-3">
        <Link
          href="/tenants"
          className="flex items-center gap-2.5 no-underline group-data-[collapsible=icon]:justify-center"
        >
          <AvatarMark initials="CA" size="sm" variant="brand" shape="rounded" />
          {!isCollapsed && (
            <span className="font-display text-[17px] font-bold tracking-tight">
              Cloud Alpha
              <span className="ml-1 rounded border border-primary bg-primary/10 px-[5px] py-[1px] align-middle font-mono text-[9px] text-primary">
                SaaS
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
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
                        className="h-auto rounded-lg px-[10px] py-[9px] text-[13.5px] font-medium group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary [&_i]:h-auto [&_i]:w-auto [&_i]:text-[17px]"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5"
                          onClick={handleNavClick}
                        >
                          <i className={item.icon} />
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

      <SidebarFooter className="border-t px-2.5 py-3.5 group-data-[collapsible=icon]:px-2">
        <div className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 group-data-[collapsible=icon]:justify-center hover:bg-muted">
          <AvatarMark
            initials="OP"
            size="sm"
            variant="user"
            shape="rounded"
            showName={!isCollapsed}
            name="Ops Admin"
            subtext="Super Admin"
          />
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
