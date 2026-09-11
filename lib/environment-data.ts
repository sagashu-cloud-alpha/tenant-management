import type { EnvironmentResponseDto } from "@/lib/api-types"

export interface Environment {
  id: string
  name: string
  description: string
  created: string
}

export function mapEnvironmentResponse(dto: EnvironmentResponseDto): Environment {
  return {
    id: dto.environmentId,
    name: dto.environmentName,
    description: dto.environmentDescription ?? "",
    created: dto.createdAt,
  }
}
