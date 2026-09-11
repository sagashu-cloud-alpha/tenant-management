"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  COLORS,
  getStatusBadgeClass,
  getStatusDotClass,
  getRoleBadgeClass,
  getSyncBadgeClass,
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
import { PaginationBar } from "@/components/ui/pagination-bar"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { deleteUser, fetchUsers, hydrateUsers } from "@/store/slices/user-slice"
import { hydrateRoles } from "@/store/slices/role-slice"
import { useToast } from "@/components/ui/toast/toast-context"
import type { ApiPage, RoleResponseDto, UserResponseDto } from "@/lib/api-types"

interface UsersPageClientProps {
  initialUsers: ApiPage<UserResponseDto>
  initialRoles: ApiPage<RoleResponseDto>
}

export function UsersPageClient({ initialUsers, initialRoles }: UsersPageClientProps) {
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const hydrated = useRef(false)
  const skipNextFetch = useRef(true)

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    dispatch(hydrateUsers(initialUsers))
    dispatch(hydrateRoles(initialRoles))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userList = useAppSelector((s) => s.users.items)
  const usersStatus = useAppSelector((s) => s.users.status)
  const page = useAppSelector((s) => s.users.page)
  const totalPages = useAppSelector((s) => s.users.totalPages)
  const totalElements = useAppSelector((s) => s.users.totalElements)
  const roles = useAppSelector((s) => s.roles.items)
  const ROLES = useMemo(() => roles.map((r) => r.name), [roles])

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  // Search/status are server-driven filters — re-fetch (from page 0) on change (debounced).
  // Skip the very first run: the SSR-hydrated data already reflects the initial (empty) filters.
  useEffect(() => {
    if (!hydrated.current) return
    if (skipNextFetch.current) {
      skipNextFetch.current = false
      return
    }
    const timer = setTimeout(() => {
      dispatch(
        fetchUsers({
          search: search || undefined,
          status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
          size: 10,
        }),
      )
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter])

  const goToPage = (nextPage: number) => {
    dispatch(
      fetchUsers({
        search: search || undefined,
        status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
        page: nextPage,
        size: 10,
      }),
    )
  }

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
    return userList.filter((u) => !roleFilter || roleFilter === "all" || u.roles.includes(roleFilter))
  }, [userList, roleFilter])

  const activeCount = userList.filter((u) => u.status === "active").length
  const invitedCount = userList.filter((u) => u.status === "invited").length
  const ownerCount = userList.filter((u) => u.roles.includes("Owner")).length

  const confirmDelete = () => {
    if (!deleteTarget) return
    const user = deleteTarget
    setDeleteTarget(null)

    const toast = addToast(`Deleting "${user.name}"…`, "loading")
    dispatch(deleteUser(user.id))
      .unwrap()
      .then(() => {
        toast.update(`User "${user.name}" deleted`, "success")
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? "Failed to delete user", "error")
      })
  }

  const stats = [
    { label: "Total Users", value: totalElements, delta: "across all tenants", color: "bg-[var(--primary)]", icon: IconUsers },
    { label: "Active", value: activeCount, delta: userList.length ? `${Math.round((activeCount / userList.length) * 100)}% of total` : "—", color: "bg-[var(--green)]", icon: CheckCircleIcon },
    { label: "Owners", value: ownerCount, delta: "owner role", color: "bg-[var(--purple)]", icon: IconLockDots },
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
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Auth0 Sync</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersStatus === "idle" || usersStatus === "loading" ? (
                <TableSkeleton columns={6} />
              ) : filtered.length === 0 ? (
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
                            u.roles.map((r) => <Badge key={r} className={getRoleBadgeClass(r)}>{r}</Badge>)
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
                        <Badge
                          className={getSyncBadgeClass(u.syncStatus)}
                          title={u.syncStatus === "failure" ? u.syncFailureReason : undefined}
                        >
                          {u.syncStatus}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="View Detail" onClick={() => openUserView(u)}>
                            <Eye className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(u)}>
                            <IconEdit className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => setDeleteTarget(u)}>
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
        <PaginationBar page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={goToPage} />
      </Card>

      <UserFormDrawer open={formOpen} onOpenChange={setFormOpen} user={editingUser} roles={roles} onSaved={() => goToPage(page)} />

      <UserViewDrawer user={viewUser} open={viewDrawerOpen} onOpenChange={setViewDrawerOpen} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(next) => !next && setDeleteTarget(null)}
        title="Delete user"
        description={deleteTarget ? `Delete user "${deleteTarget.name}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
