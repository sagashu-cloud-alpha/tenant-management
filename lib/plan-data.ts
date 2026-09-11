import type { PlanResponseDto } from "@/lib/api-types"

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  durationDays: number
  isActive: boolean
  created: string
}

export function mapPlanResponse(dto: PlanResponseDto): Plan {
  return {
    id: dto.planId,
    name: dto.planName,
    description: dto.planDescription ?? "",
    price: dto.planPrice,
    durationDays: dto.planDurationDays,
    isActive: dto.isActive,
    created: dto.createdAt,
  }
}
