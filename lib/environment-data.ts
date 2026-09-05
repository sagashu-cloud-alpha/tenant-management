export interface Environment {
  id: string
  name: string
  description: string
  created: string
}

export const emptyEnvironment: Omit<Environment, "id"> = {
  name: "",
  description: "",
  created: "",
}

export const environments: Environment[] = [
  {
    id: "env-001",
    name: "Production",
    description: "Live customer-facing workloads",
    created: "2024-01-01",
  },
  {
    id: "env-002",
    name: "Staging",
    description: "Pre-production verification",
    created: "2024-01-01",
  },
  {
    id: "env-003",
    name: "Development",
    description: "Active development and testing",
    created: "2024-01-01",
  },
]
