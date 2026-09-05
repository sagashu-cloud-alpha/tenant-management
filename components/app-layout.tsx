"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

import { ModeToggle } from "@/components/ui/mode-toggle"
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ProfileMenu } from "@/components/profile-menu"

function pageTitle(pathname: string) {
  if (pathname === "/tenants") return "Tenant Management"
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
          <header className="sticky top-0 z-10 flex h-[58px] shrink-0 items-center gap-4 border-b bg-surface-header px-[22px]">
            <SidebarTrigger className="inline-flex items-center gap-1.5 rounded-md border border-border-default px-2.5 py-1.5 text-xs font-medium transition-colors duration-150 hover:bg-surface-hover [&_svg]:size-4" />
            <span className="flex-1 font-display text-base font-semibold text-foreground">{title}</span>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <div className="h-6 w-px bg-border-default" />
              <ProfileMenu />
            </div>
          </header>
          
          {/* Content Area - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-surface-page">
            <div className="p-5">
              {children}
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
