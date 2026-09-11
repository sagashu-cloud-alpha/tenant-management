"use client"

import { Receipt } from "lucide-react"
import { LookupPanel } from "@/components/lookup-panel"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createBillingCycle, deleteBillingCycle, fetchBillingCycles, updateBillingCycle } from "@/store/slices/billing-cycle-slice"
import { useCurrentUserRoles } from "@/components/current-user-provider"
import { canManageBillingCycles } from "@/lib/permissions"

export function BillingCyclePanel() {
  const dispatch = useAppDispatch()
  const roles = useCurrentUserRoles()
  const items = useAppSelector((s) => s.billingCycles.items)
  const status = useAppSelector((s) => s.billingCycles.status)
  const page = useAppSelector((s) => s.billingCycles.page)
  const totalPages = useAppSelector((s) => s.billingCycles.totalPages)
  const totalElements = useAppSelector((s) => s.billingCycles.totalElements)

  return (
    <LookupPanel
      icon={Receipt}
      entityLabel="Billing Cycle"
      entityLabelPlural="Billing Cycles"
      namePlaceholder="e.g. Quarterly"
      items={items}
      status={status}
      page={page}
      totalPages={totalPages}
      totalElements={totalElements}
      canManage={canManageBillingCycles(roles)}
      onPageChange={(nextPage) => {
        dispatch(fetchBillingCycles({ page: nextPage, size: 10 }))
      }}
      onCreate={async (values) => {
        await dispatch(createBillingCycle({ billingCycleName: values.name.trim(), billingCycleDescription: values.description.trim() || undefined })).unwrap()
      }}
      onUpdate={async (id, values) => {
        await dispatch(updateBillingCycle({ id, payload: { billingCycleName: values.name.trim(), billingCycleDescription: values.description.trim() || undefined } })).unwrap()
      }}
      onDelete={async (item) => {
        await dispatch(deleteBillingCycle(item.id)).unwrap()
      }}
    />
  )
}
