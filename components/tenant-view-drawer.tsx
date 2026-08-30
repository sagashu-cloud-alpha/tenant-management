"use client"

import { type Tenant } from "@/lib/tenant-data"
import TenantDetailContent from "@/components/tenant-detail-content"
import {
  AppDrawer,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerTitleWrap,
  AppDrawerTitle,
  AppDrawerClose,
  AppDrawerBody,
} from "@/components/ui/app-drawer"

interface TenantViewDrawerProps {
  tenant: Tenant | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TenantViewDrawer({ tenant, open, onOpenChange }: TenantViewDrawerProps) {
  return (
    <AppDrawer open={open} onOpenChange={onOpenChange}>
      <AppDrawerContent size="wizard">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>{tenant?.name ?? "Tenant Details"}</AppDrawerTitle>
          </AppDrawerTitleWrap>
          <AppDrawerClose />
        </AppDrawerHeader>

        <AppDrawerBody>
          {tenant && <TenantDetailContent tenant={tenant} />}
        </AppDrawerBody>
      </AppDrawerContent>
    </AppDrawer>
  )
}
