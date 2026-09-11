import { serverFetch } from "@/lib/server-fetch"
import type { ApiPage, BillingCycleResponseDto, EnvironmentResponseDto, PlanResponseDto } from "@/lib/api-types"
import { ConfigurationPageClient } from "./configuration-page-client"

export const dynamic = "force-dynamic"

export default async function ConfigurationPage() {
  const [plans, billingCycles, environments] = await Promise.all([
    serverFetch<ApiPage<PlanResponseDto>>("/plans?size=10"),
    serverFetch<ApiPage<BillingCycleResponseDto>>("/billing-cycles?size=10"),
    serverFetch<ApiPage<EnvironmentResponseDto>>("/environments?size=10"),
  ])

  return <ConfigurationPageClient initialPlans={plans} initialBillingCycles={billingCycles} initialEnvironments={environments} />
}
