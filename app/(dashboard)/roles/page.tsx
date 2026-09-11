import { serverFetch } from "@/lib/server-fetch"
import { requireAdminAccess } from "@/lib/require-role"
import type { ApiPage, RoleResponseDto, UserResponseDto } from "@/lib/api-types"
import { RolesPageClient } from "./roles-page-client"

export const dynamic = "force-dynamic"

export default async function RolesPage() {
  await requireAdminAccess()

  const [roles, users] = await Promise.all([
    serverFetch<ApiPage<RoleResponseDto>>("/roles?size=10"),
    serverFetch<ApiPage<UserResponseDto>>("/users?size=100"),
  ])

  return <RolesPageClient initialRoles={roles} initialUsers={users} />
}
