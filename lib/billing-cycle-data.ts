export interface BillingCycle {
  id: string
  name: string
  description: string
  created: string
}

export const emptyBillingCycle: Omit<BillingCycle, "id"> = {
  name: "",
  description: "",
  created: "",
}

export const billingCycles: BillingCycle[] = [
  {
    id: "bc-001",
    name: "Monthly",
    description: "Billed every month",
    created: "2024-01-01",
  },
  {
    id: "bc-002",
    name: "Annual",
    description: "Billed once a year, at a discount",
    created: "2024-01-01",
  },
]
