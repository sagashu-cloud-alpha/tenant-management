"use client"

import { useEffect, useRef, useState } from "react"
import { CreditCard, Receipt, Layers } from "lucide-react"
import { PageTabs } from "@/components/page-tabs"
import { PlanPanel } from "@/components/plan-panel"
import { BillingCyclePanel } from "@/components/billing-cycle-panel"
import { EnvironmentPanel } from "@/components/environment-panel"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { hydratePlans } from "@/store/slices/plan-slice"
import { hydrateBillingCycles } from "@/store/slices/billing-cycle-slice"
import { hydrateEnvironments } from "@/store/slices/environment-slice"
import type { ApiPage, BillingCycleResponseDto, EnvironmentResponseDto, PlanResponseDto } from "@/lib/api-types"

type Tab = "plans" | "billing-cycles" | "environments"

interface ConfigurationPageClientProps {
  initialPlans: ApiPage<PlanResponseDto>
  initialBillingCycles: ApiPage<BillingCycleResponseDto>
  initialEnvironments: ApiPage<EnvironmentResponseDto>
}

export function ConfigurationPageClient({ initialPlans, initialBillingCycles, initialEnvironments }: ConfigurationPageClientProps) {
  const dispatch = useAppDispatch()
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    dispatch(hydratePlans(initialPlans))
    dispatch(hydrateBillingCycles(initialBillingCycles))
    dispatch(hydrateEnvironments(initialEnvironments))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [activeTab, setActiveTab] = useState<Tab>("plans")
  const plansCount = useAppSelector((s) => s.plans.totalElements)
  const billingCyclesCount = useAppSelector((s) => s.billingCycles.totalElements)
  const environmentsCount = useAppSelector((s) => s.environments.totalElements)

  const tabs = [
    { value: "plans", label: "Plans", icon: CreditCard, count: plansCount },
    { value: "billing-cycles", label: "Billing Cycles", icon: Receipt, count: billingCyclesCount },
    { value: "environments", label: "Environments", icon: Layers, count: environmentsCount },
  ]

  return (
    <div className="space-y-5">
      <PageTabs tabs={tabs} value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} />

      {activeTab === "plans" && <PlanPanel />}
      {activeTab === "billing-cycles" && <BillingCyclePanel />}
      {activeTab === "environments" && <EnvironmentPanel />}
    </div>
  )
}
