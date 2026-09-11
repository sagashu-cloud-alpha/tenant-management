import { serverFetch } from "@/lib/server-fetch"
import { requireAdminAccess } from "@/lib/require-role"
import type { ApiPage, RoleResponseDto, UserResponseDto } from "@/lib/api-types"
import { UsersPageClient } from "./users-page-client"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  await requireAdminAccess()

  const [users, roles] = await Promise.all([
    serverFetch<ApiPage<UserResponseDto>>("/users?size=10"),
    serverFetch<ApiPage<RoleResponseDto>>("/roles?size=100"),
  ])

  return <UsersPageClient initialUsers={users} initialRoles={roles} />
}
