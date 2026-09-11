"use client"

import { useMemo, useState, type ComponentType } from "react"
import { useForm } from "react-hook-form"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CharCount } from "@/components/ui/char-count"
import { IconSearch, IconEdit, IconCheck } from "@/components/icons"
import { PaginationBar } from "@/components/ui/pagination-bar"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useToast } from "@/components/ui/toast/toast-context"
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

export interface LookupItem {
  id: string
  name: string
  description: string
  created: string
}

interface LookupFormValues {
  name: string
  description: string
}

interface LookupPanelProps<T extends LookupItem> {
  icon: ComponentType<{ className?: string }>
  entityLabel: string
  entityLabelPlural: string
  namePlaceholder: string
  items: T[]
  status: "idle" | "loading" | "succeeded" | "failed"
  page: number
  totalPages: number
  totalElements: number
  /** Whether the caller's role can create/edit/delete this resource — see lib/permissions.ts. */
  canManage: boolean
  onPageChange: (page: number) => void
  onCreate: (values: LookupFormValues) => Promise<void>
  onUpdate: (id: string, values: LookupFormValues) => Promise<void>
  onDelete: (item: T) => Promise<void>
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function LookupPanel<T extends LookupItem>({
  icon: Icon,
  entityLabel,
  entityLabelPlural,
  namePlaceholder,
  items,
  status,
  page,
  totalPages,
  totalElements,
  canManage,
  onPageChange,
  onCreate,
  onUpdate,
  onDelete,
}: LookupPanelProps<T>) {
  const { addToast } = useToast()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((i) => !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  }, [items, search])

  const openCreate = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const openEdit = (item: T) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const confirmDelete = () => {
    if (!deleteTarget) return
    const item = deleteTarget
    setDeleteTarget(null)

    const toast = addToast(`Deleting "${item.name}"…`, "loading")
    onDelete(item)
      .then(() => {
        toast.update(`${entityLabel} "${item.name}" deleted`, "success")
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? `Failed to delete ${entityLabel.toLowerCase()}`, "error")
      })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-[280px]">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={`Search ${entityLabelPlural.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {canManage && (
          <button type="button" onClick={openCreate} className="page-action page-action--labeled ml-auto">
            <Icon className="h-3.5 w-3.5" /> New {entityLabel}
          </button>
        )}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">{entityLabel}</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Description</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Created</th>
                {canManage && (
                  <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {status === "idle" || status === "loading" ? (
                <TableSkeleton columns={canManage ? 4 : 3} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 4 : 3} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <IconSearch className="h-10 w-10 opacity-30 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">No {entityLabelPlural.toLowerCase()} match your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="border-b row-hover-brand transition-colors duration-150">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-[var(--bg3)] border border-[var(--border)]">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="block max-w-[280px] truncate text-sm text-muted-foreground"
                        title={item.description || undefined}
                      >
                        {item.description || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-muted-foreground">{formatDate(item.created)}</span>
                    </td>
                    {canManage && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(item)}>
                            <IconEdit className="size-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => setDeleteTarget(item)}>
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
        <PaginationBar page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={onPageChange} />
      </Card>

      <LookupFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        entityLabel={entityLabel}
        namePlaceholder={namePlaceholder}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onSaved={() => onPageChange(page)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(next) => !next && setDeleteTarget(null)}
        title={`Delete ${entityLabel.toLowerCase()}`}
        description={deleteTarget ? `Delete ${entityLabel.toLowerCase()} "${deleteTarget.name}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}

interface LookupFormDrawerProps<T extends LookupItem> {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: T | null
  entityLabel: string
  namePlaceholder: string
  onCreate: (values: LookupFormValues) => Promise<void>
  onUpdate: (id: string, values: LookupFormValues) => Promise<void>
  onSaved: () => void
}

function LookupFormDrawer<T extends LookupItem>({
  open,
  onOpenChange,
  item,
  entityLabel,
  namePlaceholder,
  onCreate,
  onUpdate,
  onSaved,
}: LookupFormDrawerProps<T>) {
  const isEdit = !!item
  const { addToast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<LookupFormValues>({
    values: item ? { name: item.name, description: item.description } : { name: "", description: "" },
  })
  const description = watch("description")

  // Reset on close (not on `item` changing) so a later "create" doesn't inherit
  // whatever was typed and left unsaved in a previous create session — the
  // `values` option above still drives switching between edit targets while open.
  const handleOpenChange = (next: boolean) => {
    if (!next) reset({ name: "", description: "" })
    onOpenChange(next)
  }

  const onSubmit = (values: LookupFormValues) => {
    const name = values.name.trim()
    handleOpenChange(false)

    const toast = addToast(isEdit ? `Saving "${name}"…` : `Creating "${name}"…`, "loading")
    const request = isEdit && item ? onUpdate(item.id, values) : onCreate(values)
    request
      .then(() => {
        toast.update(isEdit ? `${entityLabel} "${name}" updated` : `${entityLabel} "${name}" created`, "success")
        onSaved()
      })
      .catch((err: { message?: string }) => {
        toast.update(err?.message ?? `Failed to save ${entityLabel.toLowerCase()}`, "error")
      })
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="default">
        <form onSubmit={handleSubmit(onSubmit)} className="contents">
          <AppDrawerHeader>
            <AppDrawerTitleWrap>
              <AppDrawerTitle>{isEdit ? `Edit ${entityLabel}` : `Create ${entityLabel}`}</AppDrawerTitle>
              <AppDrawerDescription>
                {isEdit ? `Update this ${entityLabel.toLowerCase()}'s details` : `Define a new ${entityLabel.toLowerCase()}`}
              </AppDrawerDescription>
            </AppDrawerTitleWrap>
            <AppDrawerClose />
          </AppDrawerHeader>

          <AppDrawerBody>
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lookupName" className="text-xs font-mono">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="lookupName"
                    placeholder={namePlaceholder}
                    {...register("name", { required: "Name is required", maxLength: { value: 100, message: "Must be at most 100 characters" } })}
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lookupDescription" className="text-xs font-mono">Description</Label>
                  <Textarea
                    id="lookupDescription"
                    placeholder="Brief description..."
                    className="min-h-[100px]"
                    maxLength={500}
                    {...register("description", { maxLength: { value: 500, message: "Must be at most 500 characters" } })}
                  />
                  <CharCount value={description} max={500} />
                  {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
              </div>
            </Card>
          </AppDrawerBody>

          <AppDrawerFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              <IconCheck className="mr-1 h-3.5 w-3.5" /> {isSubmitting ? "Saving…" : isEdit ? "Save Changes" : `Create ${entityLabel}`}
            </Button>
          </AppDrawerFooter>
        </form>
      </AppDrawerContent>
    </AppDrawer>
  )
}
