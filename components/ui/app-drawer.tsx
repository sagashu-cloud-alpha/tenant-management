"use client"

import * as React from "react"
import { Dialog as DrawerPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { IconX } from "@/components/icons"

function AppDrawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="app-drawer" {...props} />
}

function AppDrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="app-drawer-trigger" {...props} />
}

function AppDrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="app-drawer-portal" {...props} />
}

function AppDrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="app-drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(15,23,42,0.35)] backdrop-blur-[2px] duration-150 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function AppDrawerContent({
  className,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  size?: "default" | "wizard"
}) {
  return (
    <AppDrawerPortal>
      <AppDrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="app-drawer-content"
        className={cn(
          "fixed inset-y-0 right-0 z-50 box-border flex h-dvh min-h-0 flex-col overflow-hidden bg-surface-card text-foreground shadow-lg duration-150 data-open:animate-in data-open:slide-in-from-right-6 data-closed:animate-out data-closed:slide-out-to-right-6",
          size === "wizard" ? "w-full max-w-[720px]" : "w-full max-w-[440px]",
          className
        )}
        {...props}
      >
        {children}
      </DrawerPrimitive.Content>
    </AppDrawerPortal>
  )
}

function AppDrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-drawer-header"
      className={cn(
        "flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-border-default bg-surface-card px-5",
        className
      )}
      {...props}
    />
  )
}

function AppDrawerTitleWrap({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-drawer-title-wrap"
      className={cn("min-w-0 flex-1", className)}
      {...props}
    />
  )
}

function AppDrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="app-drawer-title"
      className={cn("m-0 text-base font-semibold text-foreground", className)}
      {...props}
    />
  )
}

function AppDrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="app-drawer-description"
      className={cn("mt-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function AppDrawerClose({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return (
    <DrawerPrimitive.Close
      data-slot="app-drawer-close"
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition-colors duration-150 hover:bg-surface-hover hover:text-foreground",
        className
      )}
      {...props}
    >
      <IconX className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </DrawerPrimitive.Close>
  )
}

function AppDrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-drawer-body"
      className={cn("min-h-0 flex-1 overflow-y-auto px-5 py-4", className)}
      {...props}
    />
  )
}

function AppDrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="app-drawer-footer"
      className={cn(
        "flex shrink-0 items-center justify-end gap-2 border-t border-border-default bg-surface-card px-5 py-3",
        className
      )}
      {...props}
    />
  )
}

export {
  AppDrawer,
  AppDrawerTrigger,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerTitleWrap,
  AppDrawerTitle,
  AppDrawerDescription,
  AppDrawerClose,
  AppDrawerBody,
  AppDrawerFooter,
}
