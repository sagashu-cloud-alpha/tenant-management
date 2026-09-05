export interface Plan {
  id: string
  name: string
  description: string
  price: number
  durationDays: number
  isActive: boolean
  created: string
}

export const emptyPlan: Omit<Plan, "id"> = {
  name: "",
  description: "",
  price: 0,
  durationDays: 30,
  isActive: true,
  created: "",
}

export const plans: Plan[] = [
  {
    id: "plan-001",
    name: "Starter",
    description: "For small teams getting started",
    price: 29,
    durationDays: 30,
    isActive: true,
    created: "2024-01-01",
  },
  {
    id: "plan-002",
    name: "Pro",
    description: "For growing teams that need more resources",
    price: 99,
    durationDays: 30,
    isActive: true,
    created: "2024-01-01",
  },
  {
    id: "plan-003",
    name: "Enterprise",
    description: "Custom limits, dedicated support and SLAs",
    price: 499,
    durationDays: 365,
    isActive: true,
    created: "2024-01-01",
  },
]
