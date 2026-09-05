"use client"

import { useEffect, useMemo, useState } from "react"
import { CreditCard, Trash2 } from "lucide-react"
import { type Plan, emptyPlan } from "@/lib/plan-data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function getPlanStatusBadgeClass(isActive: boolean) {
  if (isActive) return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

interface PlanPanelProps {
  plans: Plan[]
  onPlansChange: (plans: Plan[]) => void
}

export function PlanPanel({ plans, onPlansChange }: PlanPanelProps) {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return plans.filter((p) => !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }, [plans, search])

  const nextId = "plan-" + String(plans.length + 1).padStart(3, "0")

  const openCreate = () => {
    setEditingPlan(null)
    setFormOpen(true)
  }

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan)
    setFormOpen(true)
  }

  const handleSave = (plan: Plan) => {
    const exists = plans.some((p) => p.id === plan.id)
    onPlansChange(exists ? plans.map((p) => (p.id === plan.id ? plan : p)) : [plan, ...plans])
  }

  const handleDelete = (plan: Plan) => {
    if (!window.confirm(`Delete plan "${plan.name}"? This cannot be undone.`)) return
    onPlansChange(plans.filter((p) => p.id !== plan.id))
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
        <button type="button" onClick={openCreate} className="page-action page-action--labeled ml-auto">
          <CreditCard className="h-3.5 w-3.5" /> New Plan
        </button>
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
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
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
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(p)}>
                          <IconEdit className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => handleDelete(p)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <PlanFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        plan={editingPlan}
        nextId={nextId}
        onSave={handleSave}
      />
    </div>
  )
}

interface PlanFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
  nextId: string
  onSave: (plan: Plan) => void
}

function PlanFormDrawer({ open, onOpenChange, plan, nextId, onSave }: PlanFormDrawerProps) {
  const isEdit = !!plan

  const [name, setName] = useState(emptyPlan.name)
  const [description, setDescription] = useState(emptyPlan.description)
  const [price, setPrice] = useState(emptyPlan.price)
  const [durationDays, setDurationDays] = useState(emptyPlan.durationDays)
  const [isActive, setIsActive] = useState(emptyPlan.isActive)

  const reset = () => {
    setName(emptyPlan.name)
    setDescription(emptyPlan.description)
    setPrice(emptyPlan.price)
    setDurationDays(emptyPlan.durationDays)
    setIsActive(emptyPlan.isActive)
  }

  useEffect(() => {
    if (!open) return
    if (plan) {
      setName(plan.name)
      setDescription(plan.description)
      setPrice(plan.price)
      setDurationDays(plan.durationDays)
      setIsActive(plan.isActive)
    } else {
      reset()
    }
  }, [plan, open])

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please fill in required fields")
      return
    }
    const saved: Plan = {
      id: plan?.id ?? nextId,
      name: name.trim(),
      description: description.trim(),
      price,
      durationDays,
      isActive,
      created: plan?.created ?? new Date().toISOString().slice(0, 10),
    }
    onSave(saved)
    onOpenChange(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="default">
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
                <Input id="planName" placeholder="e.g. Growth" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="planDescription" className="text-xs font-mono">Description</Label>
                <Textarea
                  id="planDescription"
                  placeholder="Who this plan is for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="planPrice" className="text-xs font-mono">Price (USD)</Label>
                  <Input
                    id="planPrice"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="planDuration" className="text-xs font-mono">Duration (days)</Label>
                  <Input
                    id="planDuration"
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="planStatus" className="text-xs font-mono">Status</Label>
                <Select value={isActive ? "active" : "inactive"} onValueChange={(v) => setIsActive(v === "active")}>
                  <SelectTrigger id="planStatus" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </AppDrawerBody>

        <AppDrawerFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <IconCheck className="mr-1 h-3.5 w-3.5" /> {isEdit ? "Save Changes" : "Create Plan"}
          </Button>
        </AppDrawerFooter>
      </AppDrawerContent>
    </AppDrawer>
  )
}
