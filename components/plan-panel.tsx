"use client"

import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { CreditCard, Trash2 } from "lucide-react"
import { type Plan } from "@/lib/plan-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CharCount } from "@/components/ui/char-count"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconSearch, IconEdit, IconCheck } from "@/components/icons"
import {
  AppDrawer,
  AppDrawerContent,
  AppDrawerHeader,
  AppDrawerTitleWrap,
  AppDrawerTitle,
  AppDrawerDescription,
  AppDrawerClose,
  AppDrawerBody,
  AppDrawerFooter,
} from "@/components/ui/app-drawer"
import { PaginationBar } from "@/components/ui/pagination-bar"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { createPlan, deletePlan, fetchPlans, updatePlan } from "@/store/slices/plan-slice"
import { useToast } from "@/components/ui/toast/toast-context"
import { useCurrentUserRoles } from "@/components/current-user-provider"
import { canManagePlans } from "@/lib/permissions"

function getPlanStatusBadgeClass(isActive: boolean) {
  if (isActive) return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

export function PlanPanel() {
  const dispatch = useAppDispatch()
  const { addToast } = useToast()
  const roles = useCurrentUserRoles()
  const canManage = canManagePlans(roles)
  const plans = useAppSelector((s) => s.plans.items)
  const plansStatus = useAppSelector((s) => s.plans.status)
  const page = useAppSelector((s) => s.plans.page)
  const totalPages = useAppSelector((s) => s.plans.totalPages)
  const totalElements = useAppSelector((s) => s.plans.totalElements)

  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return plans.filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }, [plans, search])

  const goToPage = (nextPage: number) => {
    dispatch(fetchPlans({ page: nextPage, size: 10 }))
  }

  const openCreate = () => {
    setEditingPlan(null)
    setFormOpen(true)
  }

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const plan = deleteTarget
    setDeleteTarget(null)

    const toast = addToast(`Deleting "${plan.name}"…`, "loading")
    dispatch(deletePlan(plan.id))
      .unwrap()
      .then(() => {
        toast.update(`Plan "${plan.name}" deleted`, "success")
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? "Failed to delete plan", "error")
      })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-[280px]">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search plans…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {canManage && (
          <button type="button" onClick={openCreate} className="page-action page-action--labeled ml-auto">
            <CreditCard className="h-3.5 w-3.5" /> New Plan
          </button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Plan</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Status</th>
                {canManage && (
                  <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {plansStatus === "idle" || plansStatus === "loading" ? (
                <TableSkeleton columns={canManage ? 5 : 4} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconSearch className="h-10 w-10 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No plans match your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="border-b row-hover-brand transition-colors duration-150">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg3)] border border-[var(--border)]">
                          <CreditCard className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{p.description || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-muted-foreground">${p.price.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-muted-foreground">{p.durationDays} days</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge className={getPlanStatusBadgeClass(p.isActive)}>{p.isActive ? "active" : "inactive"}</Badge>
                    </td>
                    {canManage && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(p)}>
                            <IconEdit className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => setDeleteTarget(p)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <PaginationBar page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={goToPage} />
      </Card>

      <PlanFormDrawer open={formOpen} onOpenChange={setFormOpen} plan={editingPlan} onSaved={() => goToPage(page)} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(next) => !next && setDeleteTarget(null)}
        title="Delete plan"
        description={deleteTarget ? `Delete plan "${deleteTarget.name}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

interface PlanFormValues {
  name: string
  description: string
  price: number
  durationDays: number
  isActive: string
}

const emptyPlanValues: PlanFormValues = { name: "", description: "", price: 0, durationDays: 30, isActive: "active" }

interface PlanFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
  onSaved: () => void
}

function PlanFormDrawer({ open, onOpenChange, plan, onSaved }: PlanFormDrawerProps) {
  const isEdit = !!plan
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PlanFormValues>({
    values: plan
      ? { name: plan.name, description: plan.description, price: plan.price, durationDays: plan.durationDays, isActive: plan.isActive ? "active" : "inactive" }
      : emptyPlanValues,
  })
  const description = watch("description")

  // Reset on close (not on `plan` changing) so a later "create" doesn't inherit
  // whatever was typed and left unsaved in a previous create session — the
  // `values` option above still drives switching between edit targets while open.
  const handleOpenChange = (next: boolean) => {
    if (!next) reset(emptyPlanValues)
    onOpenChange(next)
  }

  const onSubmit = (values: PlanFormValues) => {
    const payload = {
      planName: values.name.trim(),
      planDescription: values.description.trim() || undefined,
      planPrice: Number(values.price),
      planDurationDays: Number(values.durationDays),
      isActive: values.isActive === "active",
    }

    handleOpenChange(false)

    const toast = addToast(isEdit ? `Saving "${payload.planName}"…` : `Creating "${payload.planName}"…`, "loading")
    const request = isEdit && plan ? dispatch(updatePlan({ id: plan.id, payload })) : dispatch(createPlan(payload))
    request
      .unwrap()
      .then(() => {
        toast.update(isEdit ? `Plan "${payload.planName}" updated` : `Plan "${payload.planName}" created`, "success")
        onSaved()
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? "Failed to save plan", "error")
      })
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="default">
        <form onSubmit={handleSubmit(onSubmit)} className="contents">
          <AppDrawerHeader>
            <AppDrawerTitleWrap>
              <AppDrawerTitle>{isEdit ? "Edit Plan" : "Create Plan"}</AppDrawerTitle>
              <AppDrawerDescription>
                {isEdit ? "Update this plan's pricing and details" : "Define a new plan tenants can subscribe to"}
              </AppDrawerDescription>
            </AppDrawerTitleWrap>
            <AppDrawerClose />
          </AppDrawerHeader>

          <AppDrawerBody>
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="planName" className="text-xs font-mono">
                    Plan Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="planName"
                    placeholder="e.g. Growth"
                    {...register("name", { required: "Plan name is required", maxLength: { value: 100, message: "Must be at most 100 characters" } })}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="planDescription" className="text-xs font-mono">Description</Label>
                  <Textarea
                    id="planDescription"
                    placeholder="Who this plan is for..."
                    className="min-h-[80px]"
                    maxLength={500}
                    {...register("description", { maxLength: { value: 500, message: "Must be at most 500 characters" } })}
                  />
                  <CharCount value={description} max={500} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="planPrice" className="text-xs font-mono">Price (USD)</Label>
                    <Input
                      id="planPrice"
                      type="number"
                      min={0}
                      step="0.01"
                      {...register("price", { required: "Price is required", min: { value: 0, message: "Must be zero or greater" }, valueAsNumber: true })}
                    />
                    {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="planDuration" className="text-xs font-mono">Duration (days)</Label>
                    <Input
                      id="planDuration"
                      type="number"
                      min={1}
                      {...register("durationDays", { required: "Duration is required", min: { value: 1, message: "Must be greater than zero" }, valueAsNumber: true })}
                    />
                    {errors.durationDays && <p className="text-xs text-destructive">{errors.durationDays.message}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="planStatus" className="text-xs font-mono">Status</Label>
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="planStatus" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </Card>
          </AppDrawerBody>

          <AppDrawerFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <IconCheck className="mr-1 h-3.5 w-3.5" /> {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create Plan"}
            </Button>
          </AppDrawerFooter>
        </form>
      </AppDrawerContent>
    </AppDrawer>
  )
}
