import type { TenantResponseDto } from "@/lib/api-types"
import { hashToIndex } from "@/lib/utils"

export interface Tenant {
  id: string
  name: string
  subdomain: string
  email: string
  phone: string
  status: string
  plan: string
  planId: string | null
  env: string
  environmentId: string | null
  created: string
  billing: string
  billingCycleId: string | null
  description: string
  tags: string[]
  colorIdx: number
}

export const COLORS = [
  { bg: "rgba(79,142,247,0.15)", color: "#4f8ef7" },
  { bg: "rgba(34,197,94,0.1)", color: "#22c55e" },
  { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  { bg: "rgba(45,212,191,0.1)", color: "#2dd4bf" },
  { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
  { bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
]

export function mapTenantResponse(dto: TenantResponseDto): Tenant {
  return {
    id: dto.tenantId,
    name: dto.tenantName,
    subdomain: dto.subDomain,
    email: dto.adminEmail,
    phone: dto.contactNumber ?? "",
    status: dto.status.toLowerCase(),
    plan: dto.planName?.toLowerCase() ?? "",
    planId: dto.planId,
    env: dto.environmentName ?? "",
    environmentId: dto.environmentId,
    created: dto.createdAt,
    billing: dto.billingCycleName ?? "",
    billingCycleId: dto.billingCycleId,
    description: dto.description ?? "",
    tags: dto.tags ?? [],
    colorIdx: hashToIndex(dto.tenantId, COLORS.length),
  }
}
