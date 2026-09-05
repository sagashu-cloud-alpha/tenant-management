"use client"

import { useState } from "react"
import { CreditCard, Receipt, Layers } from "lucide-react"
import { PageTabs } from "@/components/page-tabs"
import { plans as initialPlans, type Plan } from "@/lib/plan-data"
import { billingCycles as initialBillingCycles, type BillingCycle } from "@/lib/billing-cycle-data"
import { environments as initialEnvironments, type Environment } from "@/lib/environment-data"
import { PlanPanel } from "@/components/plan-panel"
import { LookupPanel } from "@/components/lookup-panel"

type Tab = "plans" | "billing-cycles" | "environments"

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("plans")
  const [plans, setPlans] = useState<Plan[]>(() => [...initialPlans])
  const [billingCycles, setBillingCycles] = useState<BillingCycle[]>(() => [...initialBillingCycles])
  const [environments, setEnvironments] = useState<Environment[]>(() => [...initialEnvironments])

  const tabs = [
    { value: "plans", label: "Plans", icon: CreditCard, count: plans.length },
    { value: "billing-cycles", label: "Billing Cycles", icon: Receipt, count: billingCycles.length },
    { value: "environments", label: "Environments", icon: Layers, count: environments.length },
  ]

  return (
    <div className="space-y-5">
      <PageTabs tabs={tabs} value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} />

      {activeTab === "plans" && <PlanPanel plans={plans} onPlansChange={setPlans} />}

      {activeTab === "billing-cycles" && (
        <LookupPanel
          icon={Receipt}
          entityLabel="Billing Cycle"
          entityLabelPlural="Billing Cycles"
          namePlaceholder="e.g. Quarterly"
          idPrefix="bc"
          items={billingCycles}
          onItemsChange={setBillingCycles}
        />
      )}

      {activeTab === "environments" && (
        <LookupPanel
          icon={Layers}
          entityLabel="Environment"
          entityLabelPlural="Environments"
          namePlaceholder="e.g. QA"
          idPrefix="env"
          items={environments}
          onItemsChange={setEnvironments}
        />
      )}
    </div>
  )
}
