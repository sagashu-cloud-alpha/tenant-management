"use client"

import { useEffect, useMemo, useState, type ComponentType } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

export interface LookupItem {
  id: string
  name: string
  description: string
  created: string
}

interface LookupPanelProps<T extends LookupItem> {
  icon: ComponentType<{ className?: string }>
  entityLabel: string
  entityLabelPlural: string
  namePlaceholder: string
  idPrefix: string
  items: T[]
  onItemsChange: (items: T[]) => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function LookupPanel<T extends LookupItem>({
  icon: Icon,
  entityLabel,
  entityLabelPlural,
  namePlaceholder,
  idPrefix,
  items,
  onItemsChange,
}: LookupPanelProps<T>) {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return items.filter((i) => !q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  }, [items, search])

  const nextId = `${idPrefix}-` + String(items.length + 1).padStart(3, "0")

  const openCreate = () => {
    setEditingItem(null)
    setFormOpen(true)
  }

  const openEdit = (item: T) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleSave = (item: T) => {
    const exists = items.some((i) => i.id === item.id)
    onItemsChange(exists ? items.map((i) => (i.id === item.id ? item : i)) : [item, ...items])
  }

  const handleDelete = (item: T) => {
    if (!window.confirm(`Delete ${entityLabel.toLowerCase()} "${item.name}"? This cannot be undone.`)) return
    onItemsChange(items.filter((i) => i.id !== item.id))
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
        <button type="button" onClick={openCreate} className="page-action page-action--labeled ml-auto">
          <Icon className="h-3.5 w-3.5" /> New {entityLabel}
        </button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">{entityLabel}</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Description</th>
                <th className="px-5 py-3.5 text-left text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Created</th>
                <th className="px-5 py-3.5 text-right text-xs font-mono text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
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
                      <span className="text-sm text-muted-foreground">{item.description || "—"}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-mono text-muted-foreground">{formatDate(item.created)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit" onClick={() => openEdit(item)}>
                          <IconEdit className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" title="Delete" onClick={() => handleDelete(item)}>
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

      <LookupFormDrawer
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        nextId={nextId}
        entityLabel={entityLabel}
        namePlaceholder={namePlaceholder}
        onSave={handleSave}
      />
    </div>
  )
}

interface LookupFormDrawerProps<T extends LookupItem> {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: T | null
  nextId: string
  entityLabel: string
  namePlaceholder: string
  onSave: (item: T) => void
}

function LookupFormDrawer<T extends LookupItem>({
  open,
  onOpenChange,
  item,
  nextId,
  entityLabel,
  namePlaceholder,
  onSave,
}: LookupFormDrawerProps<T>) {
  const isEdit = !!item
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const reset = () => {
    setName("")
    setDescription("")
  }

  useEffect(() => {
    if (!open) return
    if (item) {
      setName(item.name)
      setDescription(item.description)
    } else {
      reset()
    }
  }, [item, open])

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please fill in required fields")
      return
    }
    const saved = {
      ...(item ?? {}),
      id: item?.id ?? nextId,
      name: name.trim(),
      description: description.trim(),
      created: item?.created ?? new Date().toISOString().slice(0, 10),
    } as T
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
                <Input id="lookupName" placeholder={namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="lookupDescription" className="text-xs font-mono">Description</Label>
                <Textarea
                  id="lookupDescription"
                  placeholder="Brief description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        </AppDrawerBody>

        <AppDrawerFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>
            <IconCheck className="mr-1 h-3.5 w-3.5" /> {isEdit ? "Save Changes" : `Create ${entityLabel}`}
          </Button>
        </AppDrawerFooter>
      </AppDrawerContent>
    </AppDrawer>
  )
}
