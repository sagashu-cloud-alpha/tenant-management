import { serverFetch } from "@/lib/server-fetch"
import type { ApiPage, BillingCycleResponseDto, EnvironmentResponseDto, PlanResponseDto, TenantResponseDto } from "@/lib/api-types"
import { TenantsPageClient } from "./tenants-page-client"

// This page depends on live backend data — never statically prerender it.
export const dynamic = "force-dynamic"

// Server Component: loads the first page directly on the server so the page
// renders with real data immediately — no client-side loading spinner on first paint.
export default async function TenantsPage() {
  const [tenants, plans, billingCycles, environments] = await Promise.all([
    serverFetch<ApiPage<TenantResponseDto>>("/tenants?size=10"),
    serverFetch<ApiPage<PlanResponseDto>>("/plans?size=100"),
    serverFetch<ApiPage<BillingCycleResponseDto>>("/billing-cycles?size=100"),
    serverFetch<ApiPage<EnvironmentResponseDto>>("/environments?size=100"),
  ])

  return (
    <TenantsPageClient
      initialTenants={tenants}
      initialPlans={plans}
      initialBillingCycles={billingCycles}
      initialEnvironments={environments}
    />
  )
}
