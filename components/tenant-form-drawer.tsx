"use client"

import { Controller, useForm } from "react-hook-form"
import { Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CharCount } from "@/components/ui/char-count"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { IconGrid, IconAdministration, IconCheck } from "@/components/icons"
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
import { useAppDispatch } from "@/store/hooks"
import { createTenant, updateTenant } from "@/store/slices/tenant-slice"
import { useToast } from "@/components/ui/toast/toast-context"
import type { Plan } from "@/lib/plan-data"
import type { BillingCycle } from "@/lib/billing-cycle-data"
import type { Environment } from "@/lib/environment-data"
import type { Tenant } from "@/lib/tenant-data"

interface TenantFormValues {
  tenantName: string
  subDomain: string
  adminEmail: string
  contactNumber: string
  description: string
  status: string
  planId: string
  billingCycleId: string
  environmentId: string
  tags: string
}

const emptyValues: TenantFormValues = {
  tenantName: "",
  subDomain: "",
  adminEmail: "",
  contactNumber: "",
  description: "",
  status: "active",
  planId: "",
  billingCycleId: "",
  environmentId: "",
  tags: "",
}

interface TenantFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: Tenant | null
  plans: Plan[]
  billingCycles: BillingCycle[]
  environments: Environment[]
  onSaved: () => void
}

export function TenantFormDrawer({ open, onOpenChange, tenant, plans, billingCycles, environments, onSaved }: TenantFormDrawerProps) {
  const isEdit = !!tenant
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TenantFormValues>({
    values: tenant
      ? {
          tenantName: tenant.name,
          subDomain: tenant.subdomain,
          adminEmail: tenant.email,
          contactNumber: tenant.phone,
          description: tenant.description,
          status: tenant.status,
          planId: tenant.planId ?? "",
          billingCycleId: tenant.billingCycleId ?? "",
          environmentId: tenant.environmentId ?? "",
          tags: tenant.tags.join(", "),
        }
      : emptyValues,
  })
  const description = watch("description")

  // Reset on close (not on `tenant` changing) so a later "create" doesn't inherit
  // whatever was typed and left unsaved in a previous create session — the
  // `values` option above still drives switching between edit targets while open.
  const handleOpenChange = (next: boolean) => {
    if (!next) reset(emptyValues)
    onOpenChange(next)
  }

  const onSubmit = (values: TenantFormValues) => {
    const tenantName = values.tenantName.trim()
    handleOpenChange(false)

    const payload = {
      tenantName,
      subDomain: values.subDomain.trim(),
      adminEmail: values.adminEmail.trim(),
      contactNumber: values.contactNumber.trim() || undefined,
      description: values.description.trim() || undefined,
      status: values.status.toUpperCase(),
      planId: values.planId,
      billingCycleId: values.billingCycleId,
      environmentId: values.environmentId,
      tags: values.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }

    const toast = addToast(isEdit ? `Saving "${tenantName}"…` : `Provisioning tenant "${tenantName}"…`, "loading")
    const request = isEdit && tenant ? dispatch(updateTenant({ id: tenant.id, payload })) : dispatch(createTenant(payload))
    request
      .unwrap()
      .then(() => {
        toast.update(isEdit ? `Tenant "${tenantName}" updated` : `Tenant "${tenantName}" provisioned successfully`, "success")
        onSaved()
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? (isEdit ? "Failed to update tenant" : "Failed to provision tenant"), "error")
      })
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="wizard">
        <form onSubmit={handleSubmit(onSubmit)} className="contents">
          <AppDrawerHeader>
            <AppDrawerTitleWrap>
              <AppDrawerTitle>{isEdit ? "Edit Tenant" : "Create Tenant"}</AppDrawerTitle>
              <AppDrawerDescription>
                {isEdit ? "Update this tenant's details" : "Provision a new tenant"}
              </AppDrawerDescription>
            </AppDrawerTitleWrap>
            <AppDrawerClose />
          </AppDrawerHeader>

          <AppDrawerBody>
            <div className="flex flex-col gap-5">
              {/* Basic Information */}
              <Card className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <IconGrid className="h-4 w-4 text-primary" /> Basic Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="tenantName" className="text-xs font-mono">
                      Tenant Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="tenantName"
                      placeholder="Acme Corporation"
                      {...register("tenantName", { required: "Tenant name is required", maxLength: { value: 150, message: "Must be at most 150 characters" } })}
                    />
                    {errors.tenantName && <p className="text-xs text-destructive">{errors.tenantName.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="subDomain" className="text-xs font-mono">
                      Subdomain <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subDomain"
                      placeholder="acme"
                      disabled={isEdit}
                      {...register("subDomain", { required: "Subdomain is required", maxLength: { value: 100, message: "Must be at most 100 characters" } })}
                    />
                    {isEdit ? (
                      <p className="text-[11px] text-muted-foreground">Subdomain can&apos;t be changed after creation</p>
                    ) : (
                      errors.subDomain && <p className="text-xs text-destructive">{errors.subDomain.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="adminEmail" className="text-xs font-mono">
                      Admin Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@acme.com"
                      {...register("adminEmail", {
                        required: "Admin email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                      })}
                    />
                    {errors.adminEmail && <p className="text-xs text-destructive">{errors.adminEmail.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contactNumber" className="text-xs font-mono">
                      Contact Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactNumber"
                      placeholder="+1 (555) 000-0000"
                      {...register("contactNumber", {
                        required: "Contact phone is required",
                        maxLength: { value: 30, message: "Must be at most 30 characters" },
                        pattern: { value: /^(?=.*\d)[+]?[0-9\s()-]{7,30}$/, message: "Enter a valid phone number" },
                      })}
                    />
                    {errors.contactNumber && <p className="text-xs text-destructive">{errors.contactNumber.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="description" className="text-xs font-mono">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description..."
                      className="min-h-[80px]"
                      maxLength={500}
                      {...register("description", { maxLength: { value: 500, message: "Must be at most 500 characters" } })}
                    />
                    <CharCount value={description} max={500} />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                  </div>
                </div>
              </Card>

              {/* Plan & Configuration */}
              <Card className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <IconAdministration className="h-4 w-4 text-primary" /> Plan & Configuration
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="planId" className="text-xs font-mono">
                      Plan <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="planId"
                      control={control}
                      rules={{ required: "Plan is required" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="planId" className="w-full">
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.planId && <p className="text-xs text-destructive">{errors.planId.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="billingCycleId" className="text-xs font-mono">
                      Billing Cycle <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="billingCycleId"
                      control={control}
                      rules={{ required: "Billing cycle is required" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="billingCycleId" className="w-full">
                            <SelectValue placeholder="Select billing cycle" />
                          </SelectTrigger>
                          <SelectContent>
                            {billingCycles.map((b) => (
                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.billingCycleId && <p className="text-xs text-destructive">{errors.billingCycleId.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="environmentId" className="text-xs font-mono">
                      Environment <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="environmentId"
                      control={control}
                      rules={{ required: "Environment is required" }}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="environmentId" className="w-full">
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                          <SelectContent>
                            {environments.map((e) => (
                              <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.environmentId && <p className="text-xs text-destructive">{errors.environmentId.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status" className="text-xs font-mono">Status</Label>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="status" className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </Card>

              {/* Tags & Labels */}
              <Card className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <Tag className="h-4 w-4 text-primary" /> Tags & Labels
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tags" className="text-xs font-mono">Tags</Label>
                  <Input id="tags" placeholder="e.g. production, fintech, enterprise" {...register("tags")} />
                  <div className="text-[11px] text-muted-foreground">Separate with commas</div>
                </div>
              </Card>
            </div>
          </AppDrawerBody>

          <AppDrawerFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <IconCheck className="mr-1 h-3.5 w-3.5" /> {isSubmitting ? (isEdit ? "Saving…" : "Provisioning…") : isEdit ? "Save Changes" : "Provision Tenant"}
            </Button>
          </AppDrawerFooter>
        </form>
      </AppDrawerContent>
    </AppDrawer>
  )
}
