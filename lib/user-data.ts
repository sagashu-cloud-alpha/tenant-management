import { COLORS } from "@/lib/tenant-data"
import { roles, getRoleBadgeClass } from "@/lib/role-data"

export type UserStatus = "active" | "invited" | "inactive"

export interface User {
  id: string
  username: string
  firstName: string
  lastName: string
  name: string
  email: string
  phone: string
  status: UserStatus
  roles: string[]
  notes: string
  colorIdx: number
  created: string
  lastActive: string
}

export const ROLES = roles.map((r) => r.name)

export { COLORS, getRoleBadgeClass }

export function getStatusBadgeClass(status: UserStatus) {
  if (status === "active") return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  if (status === "invited") return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

export function getStatusDotClass(status: UserStatus) {
  if (status === "active") return "bg-[var(--green)]"
  if (status === "invited") return "bg-[var(--amber)]"
  return "bg-[var(--text3)]"
}

export const emptyUser: Omit<User, "id"> = {
  username: "",
  firstName: "",
  lastName: "",
  name: "",
  email: "",
  phone: "",
  status: "active",
  roles: [],
  notes: "",
  colorIdx: 0,
  created: "",
  lastActive: "",
}

export const users: User[] = [
  {
    id: "usr-001",
    username: "jmorgan",
    firstName: "Jordan",
    lastName: "Morgan",
    name: "Jordan Morgan",
    email: "jordan.morgan@acme.com",
    phone: "+1 (555) 010-2231",
    status: "active",
    roles: ["Owner", "Admin"],
    notes: "Founding admin, manages billing and provisioning.",
    colorIdx: 0,
    created: "2024-01-16",
    lastActive: "2026-09-04",
  },
  {
    id: "usr-002",
    username: "s.kapoor",
    firstName: "Sara",
    lastName: "Kapoor",
    name: "Sara Kapoor",
    email: "sara.kapoor@novatech.io",
    phone: "+44 20 7946 0958",
    status: "active",
    roles: ["Admin", "Developer"],
    notes: "",
    colorIdx: 1,
    created: "2024-03-09",
    lastActive: "2026-09-03",
  },
  {
    id: "usr-003",
    username: "d.reyes",
    firstName: "Diego",
    lastName: "Reyes",
    name: "Diego Reyes",
    email: "diego.reyes@helixai.com",
    phone: "+1 (555) 442-9981",
    status: "active",
    roles: ["Developer"],
    notes: "ML infra lead.",
    colorIdx: 2,
    created: "2024-02-25",
    lastActive: "2026-09-05",
  },
  {
    id: "usr-004",
    username: "l.chen",
    firstName: "Lily",
    lastName: "Chen",
    name: "Lily Chen",
    email: "lily.chen@zephyr.shop",
    phone: "+91 98765 43210",
    status: "inactive",
    roles: ["Billing"],
    notes: "Account suspended alongside tenant.",
    colorIdx: 4,
    created: "2024-04-02",
    lastActive: "2024-07-11",
  },
  {
    id: "usr-005",
    username: "r.patel",
    firstName: "Ravi",
    lastName: "Patel",
    name: "Ravi Patel",
    email: "ravi.patel@datastream.co",
    phone: "+1 (555) 771-3345",
    status: "active",
    roles: ["Admin", "Viewer"],
    notes: "",
    colorIdx: 3,
    created: "2024-05-15",
    lastActive: "2026-09-01",
  },
  {
    id: "usr-006",
    username: "a.novak",
    firstName: "Anna",
    lastName: "Novak",
    name: "Anna Novak",
    email: "anna.novak@betawave.dev",
    phone: "+1 (555) 224-6610",
    status: "invited",
    roles: ["Viewer"],
    notes: "Invitation sent, awaiting first sign-in.",
    colorIdx: 5,
    created: "2024-06-02",
    lastActive: "—",
  },
  {
    id: "usr-007",
    username: "t.osei",
    firstName: "Tunde",
    lastName: "Osei",
    name: "Tunde Osei",
    email: "tunde.osei@acme.com",
    phone: "+1 (555) 883-1120",
    status: "active",
    roles: ["Developer", "Viewer"],
    notes: "Shared infra consultant.",
    colorIdx: 0,
    created: "2024-07-19",
    lastActive: "2026-08-30",
  },
  {
    id: "usr-008",
    username: "m.fischer",
    firstName: "Mara",
    lastName: "Fischer",
    name: "Mara Fischer",
    email: "mara.fischer@helixai.com",
    phone: "+49 30 1234567",
    status: "invited",
    roles: ["Billing"],
    notes: "",
    colorIdx: 2,
    created: "2024-08-05",
    lastActive: "—",
  },
]
