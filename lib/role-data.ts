import type { RoleResponseDto } from "@/lib/api-types"

export interface Role {
  id: string
  name: string
  description: string
  created: string
}

export function getRoleBadgeClass(role: string) {
  if (role === "Owner") return "bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--purple-border)] hover:brightness-110"
  if (role === "Developer") return "bg-[var(--teal-bg)] text-[var(--teal)] border border-[var(--teal-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

// Roles are a fixed set (see DB/schema.sql) — no create/edit/delete UI is exposed.
export function mapRoleResponse(dto: RoleResponseDto): Role {
  return {
    id: dto.roleId,
    name: dto.roleName,
    description: dto.roleDescription ?? "",
    created: dto.createdAt,
  }
}
