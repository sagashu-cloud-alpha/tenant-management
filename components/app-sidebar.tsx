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

const navSections = [
  {
    label: "Workspace",
    items: [
      { title: "Tenants", href: "/tenants", icon: "ti ti-building-skyscraper" },
      { title: "Create Tenant", href: "/create-tenants", icon: "ti ti-circle-plus" },
      { title: "Tenant Detail", href: "/tenant-details", icon: "ti ti-layout-dashboard" },
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
  if (href.startsWith("/tenants") && pathname.startsWith("/tenants/")) return true
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
      <SidebarHeader className="border-b px-5 pb-[18px] pt-[22px] group-data-[collapsible=icon]:px-3">
        <Link
          href="/tenants"
          className="flex items-center gap-2.5 no-underline group-data-[collapsible=icon]:justify-center"
        >
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-primary text-[15px] text-primary-foreground">
            <i className="ti ti-layers-intersect" />
          </div>
          {!isCollapsed && (
            <span className="font-display text-[17px] font-bold tracking-tight">
              Cloud Alpha
              <span className="ml-1 align-middle rounded border border-primary bg-primary/10 px-[5px] py-[1px] text-[9px] text-primary font-mono">
                SaaS
              </span>
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {navSections.map((section) => (
          <SidebarGroup key={section.label} className="px-2.5 py-1 group-data-[collapsible=icon]:px-2">
            <SidebarGroupLabel className="h-auto px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground group-data-[collapsible=icon]:hidden">
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
                        className="h-auto rounded-lg px-[10px] py-[9px] text-[13.5px] font-medium hover:bg-muted data-[active=true]:bg-primary/10 data-[active=true]:text-primary [&_i]:text-[17px] [&_i]:w-auto [&_i]:h-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                      >
                        <Link href={item.href} className="flex items-center gap-2.5" onClick={handleNavClick}>
                          <i className={item.icon} />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
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
        <div className="flex cursor-pointer items-center gap-2.5 rounded-lg p-2 hover:bg-muted group-data-[collapsible=icon]:justify-center">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            OP
          </div>
          {!isCollapsed && (
            <div>
              <div className="text-sm font-medium">Ops Admin</div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </div>
          )}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
