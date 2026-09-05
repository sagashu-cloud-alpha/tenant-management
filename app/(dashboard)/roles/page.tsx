"use client"

import { useState, useMemo } from "react"
import { roles as initialRoles, getRoleBadgeClass, type Role } from "@/lib/role-data"
import { users } from "@/lib/user-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Shield, Users as UsersIcon, ShieldOff, Gauge } from "lucide-react"
import { IconSearch, IconEdit } from "@/components/icons"
import { RoleFormDrawer } from "@/components/role-form-drawer"
import { RoleViewDrawer } from "@/components/role-view-drawer"

export default function RolesPage() {
  const [roleList, setRoleList] = useState<Role[]>(() => [...initialRoles])
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [viewRole, setViewRole] = useState<Role | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const usersForRole = (name: string) => users.filter((u) => u.roles.includes(name))

  const openRoleView = (role: Role) => {
    setViewRole(role)
    setViewDrawerOpen(true)
  }

  const openCreate = () => {
    setEditingRole(null)
    setFormOpen(true)
  }

  const openEdit = (role: Role) => {
    setEditingRole(role)
    setFormOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return roleList.filter((r) => {
      return !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    })
  }, [roleList, search])

  const usersCovered = users.filter((u) => u.roles.length > 0).length
  const unassignedRoles = roleList.filter((r) => usersForRole(r.name).length === 0).length
  const totalAssignments = roleList.reduce((sum, r) => sum + usersForRole(r.name).length, 0)
  const avgAssignments = roleList.length ? Math.round(totalAssignments / roleList.length) : 0

  const handleSave = (role: Role) => {
    setRoleList((prev) => {
      const exists = prev.some((r) => r.id === role.id)
      if (exists) return prev.map((r) => (r.id === role.id ? role : r))
      return [role, ...prev]
    })
  }

  const handleDelete = (role: Role) => {
    const assigned = usersForRole(role.name).length
    const message = assigned > 0
      ? `"${role.name}" is assigned to ${assigned} user${assigned !== 1 ? "s" : ""}. Delete it anyway?`
      : `Delete role "${role.name}"? This cannot be undone.`
    if (!window.confirm(message)) return
    setRoleList((prev) => prev.filter((r) => r.id !== role.id))
  }

  const nextId = "role-" + String(roleList.length + 1).padStart(3, "0")

  const stats = [
    { label: "Total Roles", value: roleList.length, delta: "defined in this tenant", color: "bg-[var(--primary)]", icon: Shield },
    { label: "Users Covered", value: usersCovered, delta: "users with at least one role", color: "bg-[var(--green)]", icon: UsersIcon },
    { label: "Unassigned Roles", value: unassignedRoles, delta: "not used by any user", color: "bg-[var(--amber)]", icon: ShieldOff },
    { label: "Avg Assignments", value: avgAssignments, delta: "users per role", color: "bg-[var(--purple)]", icon: Gauge },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-end">
        <button type="button" onClick={openCreate} className="page-action page-action--labeled">
          <Shield className="h-3.5 w-3.5" /> New Role
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card size="sm" key={s.label} className="relative py-4 px-[18px] rounded-[var(--radius-lg)] overflow-hidden transition-colors hover:border-border-strong">
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${s.color}`} />
            <s.icon className="absolute top-4 right-4 h-5 w-5 opacity-[0.15] text-foreground" />
            <div className="text-[12px] font-medium text-muted-foreground">{s.label}</div>
            <div className="text-[28px] font-bold text-foreground leading-none tracking-tight">{s.value}</div>
            <div className="text-[12px] text-[var(--text-muted)]">{s.delta}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative ml-auto w-full sm:w-[260px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search roles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Description</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Users</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconSearch className="h-10 w-10 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No roles match your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const assignedCount = usersForRole(r.name).length
                  return (
                    <tr key={r.id} className="border-b row-hover-brand transition-colors duration-150 cursor-pointer">
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => openRoleView(r)} className="flex items-center gap-3 text-left group">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg3)] border border-[var(--border)] group-hover:shadow-md transition-shadow">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <Badge className={getRoleBadgeClass(r.name)}>{r.name}</Badge>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-muted-foreground">{r.description || "—"}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {assignedCount} user{assignedCount !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {new Date(r.created).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Detail" onClick={() => openRoleView(r)}>
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(r)}>
                            <IconEdit className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => handleDelete(r)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <RoleFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editingRole}
        nextId={nextId}
        onSave={handleSave}
      />

      <RoleViewDrawer role={viewRole} open={viewDrawerOpen} onOpenChange={setViewDrawerOpen} />
    </div>
  )
}
