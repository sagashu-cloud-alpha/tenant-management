"use client"

import { Layers } from "lucide-react"
import { LookupPanel } from "@/components/lookup-panel"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createEnvironment, deleteEnvironment, fetchEnvironments, updateEnvironment } from "@/store/slices/environment-slice"
import { useCurrentUserRoles } from "@/components/current-user-provider"
import { canManageEnvironments } from "@/lib/permissions"

export function EnvironmentPanel() {
  const dispatch = useAppDispatch()
  const roles = useCurrentUserRoles()
  const items = useAppSelector((s) => s.environments.items)
  const status = useAppSelector((s) => s.environments.status)
  const page = useAppSelector((s) => s.environments.page)
  const totalPages = useAppSelector((s) => s.environments.totalPages)
  const totalElements = useAppSelector((s) => s.environments.totalElements)

  return (
    <LookupPanel
      icon={Layers}
      entityLabel="Environment"
      entityLabelPlural="Environments"
      namePlaceholder="e.g. QA"
      items={items}
      status={status}
      page={page}
      totalPages={totalPages}
      totalElements={totalElements}
      canManage={canManageEnvironments(roles)}
      onPageChange={(nextPage) => {
        dispatch(fetchEnvironments({ page: nextPage, size: 10 }))
      }}
      onCreate={async (values) => {
        await dispatch(createEnvironment({ environmentName: values.name.trim(), environmentDescription: values.description.trim() || undefined })).unwrap()
      }}
      onUpdate={async (id, values) => {
        await dispatch(updateEnvironment({ id, payload: { environmentName: values.name.trim(), environmentDescription: values.description.trim() || undefined } })).unwrap()
      }}
      onDelete={async (item) => {
        await dispatch(deleteEnvironment(item.id)).unwrap()
      }}
    />
  )
}
