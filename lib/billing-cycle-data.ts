import type { BillingCycleResponseDto } from "@/lib/api-types"

export interface BillingCycle {
  id: string
  name: string
  description: string
  created: string
}

export function mapBillingCycleResponse(dto: BillingCycleResponseDto): BillingCycle {
  return {
    id: dto.billingCycleId,
    name: dto.billingCycleName,
    description: dto.billingCycleDescription ?? "",
    created: dto.createdAt,
  }
}
