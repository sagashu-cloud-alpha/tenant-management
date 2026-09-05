export interface Role {
  id: string
  name: string
  description: string
  created: string
}

export const emptyRole: Omit<Role, "id"> = {
  name: "",
  description: "",
  created: "",
}

export function getRoleBadgeClass(role: string) {
  if (role === "Owner") return "bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--purple-border)] hover:brightness-110"
  if (role === "Admin") return "bg-[var(--blue-bg)] text-[var(--blue)] border border-[var(--blue-bg)] hover:brightness-110"
  if (role === "Developer") return "bg-[var(--teal-bg)] text-[var(--teal)] border border-[var(--teal-border)] hover:brightness-110"
  if (role === "Billing") return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

export const roles: Role[] = [
  {
    id: "role-001",
    name: "Owner",
    description: "Full control over the tenant, including billing",
    created: "2024-01-01",
  },
  {
    id: "role-002",
    name: "Admin",
    description: "Manage users, roles and tenant configuration",
    created: "2024-01-01",
  },
  {
    id: "role-003",
    name: "Developer",
    description: "Manage deployments and services",
    created: "2024-01-01",
  },
  {
    id: "role-004",
    name: "Billing",
    description: "Manage billing and subscription details",
    created: "2024-01-01",
  },
  {
    id: "role-005",
    name: "Viewer",
    description: "Read-only access",
    created: "2024-01-01",
  },
]
