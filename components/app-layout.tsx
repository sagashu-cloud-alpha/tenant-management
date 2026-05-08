"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { ModeToggle } from "@/components/ui/mode-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

function pageTitle(pathname: string) {
  if (pathname === "/tenants") return "Tenant Management"
  if (pathname === "/tenants/new" || pathname === "/create-tenants") return "Create Tenant"
  if (pathname === "/tenants/detail" || pathname === "/tenant-details") return "Tenant Detail"
  if (pathname.startsWith("/tenants/")) return "Tenant Detail"
  if (pathname === "/deployment") return "Deployments"
  return "Cloud Alpha"
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const title = pageTitle(pathname)

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden bg-background">
          {/* Topbar - Fixed */}
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-4 border-b bg-card px-7">
            <SidebarTrigger className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all duration-[0.18s] hover:bg-muted [&_svg]:size-4" />
            <span className="flex-1 font-display text-base font-semibold">{title}</span>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button asChild className="h-9 gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-[0.18s]">
                <Link href="/create-tenants">
                  <i className="ti ti-plus text-sm" />
                  <span>New Tenant</span>
                </Link>
              </Button>
            </div>
          </header>
          
          {/* Content Area - Scrollable */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-7">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
