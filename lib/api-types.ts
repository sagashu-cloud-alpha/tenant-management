// Types mirroring the backend's Spring Data `Page<T>` wrapper and response/request DTOs.
// Keep in sync with `Backend/tenant-management/.../dto/response|request/*.java`.

export interface ApiPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export type TenantStatusDto = "ACTIVE" | "SUSPENDED" | "INACTIVE"
export type UserStatusDto = "ACTIVE" | "INVITED" | "INACTIVE"
export type UserSyncStatusDto = "PENDING" | "SUCCESS" | "FAILURE"

export interface TenantResponseDto {
  tenantId: string
  tenantName: string
  subDomain: string
  adminEmail: string
  contactNumber: string | null
  description: string | null
  status: TenantStatusDto
  planId: string | null
  planName: string | null
  billingCycleId: string | null
  billingCycleName: string | null
  environmentId: string | null
  environmentName: string | null
  tags: string[] | null
  createdAt: string
  updatedAt: string | null
}

export interface TenantRequestDto {
  tenantName: string
  subDomain: string
  adminEmail: string
  contactNumber?: string
  description?: string
  status?: string
  planId: string
  billingCycleId: string
  environmentId: string
  tags?: string[]
}

export interface RoleResponseDto {
  roleId: string
  roleName: string
  roleDescription: string | null
  createdAt: string
}

export interface UserResponseDto {
  userId: string
  username: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  status: UserStatusDto
  notes: string | null
  syncStatus: UserSyncStatusDto
  syncFailureReason: string | null
  roles: RoleResponseDto[]
  createdAt: string
  lastActiveAt: string | null
}

export interface CurrentUserResponseDto {
  provisioned: boolean
  userId: string | null
  username: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  status: UserStatusDto | null
  active: boolean
  roles: string[]
}

export interface UserRequestDto {
  username: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  status?: string
  notes?: string
  roleIds?: string[]
}

export interface PlanResponseDto {
  planId: string
  planName: string
  planDescription: string | null
  planPrice: number
  planDurationDays: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface PlanRequestDto {
  planName: string
  planDescription?: string
  planPrice: number
  planDurationDays: number
  isActive?: boolean
}

export interface BillingCycleResponseDto {
  billingCycleId: string
  billingCycleName: string
  billingCycleDescription: string | null
  createdAt: string
}

export interface BillingCycleRequestDto {
  billingCycleName: string
  billingCycleDescription?: string
}

export interface EnvironmentResponseDto {
  environmentId: string
  environmentName: string
  environmentDescription: string | null
  createdAt: string
}

export interface EnvironmentRequestDto {
  environmentName: string
  environmentDescription?: string
}
