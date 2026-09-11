import { COLORS } from "@/lib/tenant-data"
import { getRoleBadgeClass } from "@/lib/role-data"
import type { UserResponseDto } from "@/lib/api-types"
import { hashToIndex } from "@/lib/utils"

export type UserStatus = "active" | "invited" | "inactive"
export type UserSyncStatus = "pending" | "success" | "failure"

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  name: string
  email: string
  phone: string
  status: UserStatus
  roles: string[]
  notes: string
  syncStatus: UserSyncStatus
  syncFailureReason: string
  colorIdx: number
  created: string
}

export { COLORS, getRoleBadgeClass }

export function getStatusBadgeClass(status: UserStatus) {
  if (status === "active") return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  if (status === "invited") return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

export function getStatusDotClass(status: UserStatus) {
  if (status === "active") return "bg-[var(--green)]"
  if (status === "invited") return "bg-[var(--amber)]"
  return "bg-[var(--text3)]"
}

export function getSyncBadgeClass(status: UserSyncStatus) {
  if (status === "success") return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  if (status === "failure") return "bg-[var(--red-bg)] text-[var(--red)] border border-[var(--red-border)] hover:brightness-110"
  return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
}

export function mapUserResponse(dto: UserResponseDto): User {
  return {
    id: dto.userId,
    username: dto.username,
    firstName: dto.firstName,
    lastName: dto.lastName,
    name: `${dto.firstName} ${dto.lastName}`,
    email: dto.email,
    phone: dto.phone ?? "",
    status: dto.status.toLowerCase() as UserStatus,
    roles: dto.roles.map((r) => r.roleName),
    notes: dto.notes ?? "",
    syncStatus: dto.syncStatus.toLowerCase() as UserSyncStatus,
    syncFailureReason: dto.syncFailureReason ?? "",
    colorIdx: hashToIndex(dto.userId, COLORS.length),
    created: dto.createdAt,
  }
}
