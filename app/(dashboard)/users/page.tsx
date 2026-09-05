"use client"

import { useState, useMemo } from "react"
import {
  users as initialUsers,
  COLORS,
  ROLES,
  getStatusBadgeClass,
  getStatusDotClass,
  getRoleBadgeClass,
  type User,
} from "@/lib/user-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Trash2 } from "lucide-react"
import { IconSearch, IconEdit, IconUsers, CheckCircleIcon, IconLockDots } from "@/components/icons"
import { UserFormDrawer } from "@/components/user-form-drawer"
import { UserViewDrawer } from "@/components/user-view-drawer"

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>(() => [...initialUsers])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)

  const openUserView = (user: User) => {
    setViewUser(user)
    setViewDrawerOpen(true)
  }

  const openCreate = () => {
    setEditingUser(null)
    setFormOpen(true)
  }

  const openEdit = (user: User) => {
    setEditingUser(user)
    setFormOpen(true)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return userList.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      const matchesStatus = !statusFilter || statusFilter === "all" || u.status === statusFilter
      const matchesRole = !roleFilter || roleFilter === "all" || u.roles.includes(roleFilter)
      return matchesSearch && matchesStatus && matchesRole
    })
  }, [userList, search, statusFilter, roleFilter])

  const activeCount = userList.filter((u) => u.status === "active").length
  const invitedCount = userList.filter((u) => u.status === "invited").length
  const adminCount = userList.filter((u) => u.roles.includes("Owner") || u.roles.includes("Admin")).length

  const handleSave = (user: User) => {
    setUserList((prev) => {
      const exists = prev.some((u) => u.id === user.id)
      if (exists) return prev.map((u) => (u.id === user.id ? user : u))
      return [user, ...prev]
    })
  }

  const handleDelete = (user: User) => {
    if (!window.confirm(`Delete user "${user.name}"? This cannot be undone.`)) return
    setUserList((prev) => prev.filter((u) => u.id !== user.id))
  }

  const nextId = "usr-" + String(userList.length + 1).padStart(3, "0")

  const stats = [
    { label: "Total Users", value: userList.length, delta: "across all tenants", color: "bg-[var(--primary)]", icon: IconUsers },
    { label: "Active", value: activeCount, delta: `${Math.round((activeCount / userList.length) * 100)}% of total`, color: "bg-[var(--green)]", icon: CheckCircleIcon },
    { label: "Admins", value: adminCount, delta: "owner or admin role", color: "bg-[var(--purple)]", icon: IconLockDots },
    { label: "Pending Invites", value: invitedCount, delta: "awaiting first sign-in", color: "bg-[var(--amber)]", icon: IconSearch },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-end">
        <button type="button" onClick={openCreate} className="page-action page-action--labeled">
          <IconUsers className="h-3.5 w-3.5" /> New User
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
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {ROLES.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative sm:ml-auto sm:w-[260px]">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search users…"
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
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Roles</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Last Active</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconSearch className="h-10 w-10 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No users match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const c = COLORS[u.colorIdx]
                  const initials = `${u.firstName[0] ?? ""}${u.lastName[0] ?? ""}`.toUpperCase()
                  return (
                    <tr key={u.id} className="border-b row-hover-brand transition-colors duration-150 cursor-pointer">
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => openUserView(u)} className="flex items-center gap-3 text-left group">
                          <div
                            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold group-hover:shadow-md transition-shadow"
                            style={{ background: c.bg, color: c.color }}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                            <p className="text-xs text-muted-foreground font-mono truncate">@{u.username}</p>
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-muted-foreground truncate">{u.email}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {u.roles.length > 0 ? (
                            u.roles.map((r) => (
                              <Badge key={r} className={getRoleBadgeClass(r)}>{r}</Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={getStatusBadgeClass(u.status)}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotClass(u.status)} mr-1.5`} />
                          {u.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-mono text-muted-foreground">
                          {u.lastActive === "—" ? "—" : new Date(u.lastActive).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Detail" onClick={() => openUserView(u)}>
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(u)}>
                            <IconEdit className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => handleDelete(u)}>
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

      <UserFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editingUser}
        nextId={nextId}
        onSave={handleSave}
      />

      <UserViewDrawer user={viewUser} open={viewDrawerOpen} onOpenChange={setViewDrawerOpen} />
    </div>
  )
}
