"use client"

import { Controller, useForm } from "react-hook-form"
import { Shield, StickyNote } from "lucide-react"
import { type User, type UserStatus } from "@/lib/user-data"
import { type Role } from "@/lib/role-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CharCount } from "@/components/ui/char-count"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconGrid, IconCheck } from "@/components/icons"
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
import { createUser, updateUser } from "@/store/slices/user-slice"
import { useToast } from "@/components/ui/toast/toast-context"

interface UserFormValues {
  firstName: string
  lastName: string
  username: string
  email: string
  phone: string
  status: UserStatus
  roles: string[]
  notes: string
}

const emptyValues: UserFormValues = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  status: "active",
  roles: [],
  notes: "",
}

interface UserFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  roles: Role[]
  onSaved: () => void
}

export function UserFormDrawer({ open, onOpenChange, user, roles, onSaved }: UserFormDrawerProps) {
  const isEdit = !!user
  const dispatch = useAppDispatch()
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          email: user.email,
          phone: user.phone,
          status: user.status,
          roles: user.roles,
          notes: user.notes,
        }
      : emptyValues,
  })

  const notes = watch("notes")

  // Reset on close (not on `user` changing) so a later "create" doesn't inherit
  // whatever was typed and left unsaved in a previous create session — the
  // `values` option above still drives switching between edit targets while open.
  const handleOpenChange = (next: boolean) => {
    if (!next) reset(emptyValues)
    onOpenChange(next)
  }

  const onSubmit = (values: UserFormValues) => {
    const roleIds = roles.filter((r) => values.roles.includes(r.name)).map((r) => r.id)
    const payload = {
      username: values.username.trim(),
      email: values.email.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      phone: values.phone.trim() || undefined,
      status: values.status,
      notes: values.notes.trim() || undefined,
      roleIds,
    }
    const fullName = `${payload.firstName} ${payload.lastName}`

    handleOpenChange(false)

    const toast = addToast(isEdit ? `Saving "${fullName}"…` : `Creating "${fullName}"…`, "loading")
    const request = isEdit && user ? dispatch(updateUser({ id: user.id, payload })) : dispatch(createUser(payload))
    request
      .unwrap()
      .then(() => {
        toast.update(isEdit ? `User "${fullName}" updated` : `User "${fullName}" created`, "success")
        onSaved()
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? "Failed to save user", "error")
      })
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="wizard">
        <form onSubmit={handleSubmit(onSubmit)} className="contents">
          <AppDrawerHeader>
            <AppDrawerTitleWrap>
              <AppDrawerTitle>{isEdit ? "Edit User" : "Create User"}</AppDrawerTitle>
              <AppDrawerDescription>
                {isEdit ? "Update account details and access" : "Invite a new user and assign their access"}
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
                    <Label htmlFor="firstName" className="text-xs font-mono">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="firstName" placeholder="Jordan" {...register("firstName", { required: "First name is required", maxLength: { value: 100, message: "Must be at most 100 characters" } })} />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName" className="text-xs font-mono">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input id="lastName" placeholder="Morgan" {...register("lastName", { required: "Last name is required", maxLength: { value: 100, message: "Must be at most 100 characters" } })} />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username" className="text-xs font-mono">
                      Username <span className="text-destructive">*</span>
                    </Label>
                    <Input id="username" placeholder="jmorgan" {...register("username", { required: "Username is required", maxLength: { value: 100, message: "Must be at most 100 characters" } })} />
                    {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email" className="text-xs font-mono">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="jordan@acme.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                      })}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="phone" className="text-xs font-mono">Contact Phone</Label>
                    <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone", { maxLength: { value: 30, message: "Must be at most 30 characters" } })} />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                  </div>
                </div>
              </Card>

              {/* Access */}
              <Card className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <Shield className="h-4 w-4 text-primary" /> Access
                </div>
                <div className="flex flex-col gap-2 sm:w-1/2 sm:pr-2">
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
                          <SelectItem value="invited">Invited</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </Card>

              {/* Assigned Roles */}
              <Card className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <Shield className="h-4 w-4 text-primary" /> Assigned Roles
                </div>
                <Controller
                  name="roles"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {roles.map((r) => {
                        const active = field.value.includes(r.name)
                        return (
                          <Badge
                            key={r.id}
                            variant={active ? "default" : "outline"}
                            className={`cursor-pointer transition-all font-mono text-xs ${active ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:border-primary hover:text-primary"}`}
                            onClick={() =>
                              field.onChange(active ? field.value.filter((name) => name !== r.name) : [...field.value, r.name])
                            }
                          >
                            {r.name}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                />
              </Card>

              {/* Notes */}
              <Card className="p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                  <StickyNote className="h-4 w-4 text-primary" /> Notes
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes" className="text-xs font-mono">Internal Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Optional context about this user..."
                    className="min-h-[80px]"
                    maxLength={500}
                    {...register("notes", { maxLength: { value: 500, message: "Must be at most 500 characters" } })}
                  />
                  <CharCount value={notes} max={500} />
                  {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
                </div>
              </Card>
            </div>
          </AppDrawerBody>

          <AppDrawerFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <IconCheck className="mr-1 h-3.5 w-3.5" /> {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
            </Button>
          </AppDrawerFooter>
        </form>
      </AppDrawerContent>
    </AppDrawer>
  )
}
