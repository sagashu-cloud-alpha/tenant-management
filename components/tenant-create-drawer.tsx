"use client"

import { useState } from "react"
import { Cpu, Tag } from "lucide-react"
import { type Tenant } from "@/lib/tenant-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconGrid, IconAdministration, IconMenuWidgets, IconCheck } from "@/components/icons"
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

const allServices = [
  "API Gateway", "PostgreSQL", "Redis Cache", "Kafka", "Elasticsearch", "S3 Storage", "CDN", "ML Pipeline", "Grafana", "Prometheus",
]

const emptyState = {
  name: "", subdomain: "", email: "", phone: "", desc: "",
  plan: "pro", region: "us-east-1 (N. Virginia)", billing: "Monthly", env: "Production",
  cpu: 8, mem: 16, storage: 100, maxImages: 10,
  selectedServices: new Set(["API Gateway", "PostgreSQL", "Redis Cache", "S3 Storage"]),
  tags: "",
}

interface TenantCreateDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  nextId: string
  onCreated: (tenant: Tenant) => void
}

export function TenantCreateDrawer({ open, onOpenChange, nextId, onCreated }: TenantCreateDrawerProps) {
  const [name, setName] = useState(emptyState.name)
  const [subdomain, setSubdomain] = useState(emptyState.subdomain)
  const [email, setEmail] = useState(emptyState.email)
  const [phone, setPhone] = useState(emptyState.phone)
  const [desc, setDesc] = useState(emptyState.desc)
  const [plan, setPlan] = useState(emptyState.plan)
  const [region, setRegion] = useState(emptyState.region)
  const [billing, setBilling] = useState(emptyState.billing)
  const [env, setEnv] = useState(emptyState.env)
  const [cpu, setCpu] = useState(emptyState.cpu)
  const [mem, setMem] = useState(emptyState.mem)
  const [storage, setStorage] = useState(emptyState.storage)
  const [maxImages, setMaxImages] = useState(emptyState.maxImages)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(emptyState.selectedServices))
  const [tags, setTags] = useState(emptyState.tags)

  const toggleService = (svc: string) =>
    setSelectedServices((prev) => {
      const next = new Set(prev)
      next.has(svc) ? next.delete(svc) : next.add(svc)
      return next
    })

  const reset = () => {
    setName(emptyState.name); setSubdomain(emptyState.subdomain); setEmail(emptyState.email)
    setPhone(emptyState.phone); setDesc(emptyState.desc); setPlan(emptyState.plan)
    setRegion(emptyState.region); setBilling(emptyState.billing); setEnv(emptyState.env)
    setCpu(emptyState.cpu); setMem(emptyState.mem); setStorage(emptyState.storage)
    setMaxImages(emptyState.maxImages); setSelectedServices(new Set(emptyState.selectedServices)); setTags(emptyState.tags)
  }

  const handleCreate = () => {
    if (!name.trim() || !subdomain.trim() || !email.trim()) {
      alert("Please fill in required fields")
      return
    }
    const colorIdx = Math.floor(Math.random() * 6)
    const newTenant: Tenant = {
      id: nextId, name: name.trim(), subdomain: subdomain.trim(), email: email.trim(),
      status: "active", plan, region: region.split(" ")[0], env, created: new Date().toISOString().slice(0, 10), billing, description: desc.trim(),
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
      resources: { cpu, cpuUsed: 0, mem, memUsed: 0, storage, storageUsed: 0, maxImages }, colorIdx, images: [], services: [],
    }
    onCreated(newTenant)
    reset()
    onOpenChange(false)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <AppDrawer open={open} onOpenChange={handleOpenChange}>
      <AppDrawerContent size="wizard">
        <AppDrawerHeader>
          <AppDrawerTitleWrap>
            <AppDrawerTitle>Create Tenant</AppDrawerTitle>
            <AppDrawerDescription>Provision a new tenant with cloud resource allocation</AppDrawerDescription>
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
                  <Label htmlFor="name" className="text-xs font-mono">
                    Tenant Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="name" placeholder="Acme Corporation" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subdomain" className="text-xs font-mono">
                    Subdomain <span className="text-destructive">*</span>
                  </Label>
                  <Input id="subdomain" placeholder="acme" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} />
                  <div className="text-[11px] text-muted-foreground">Will be used as {subdomain || "acme"}.cloudaxis.io</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-xs font-mono">
                    Admin Email <span className="text-destructive">*</span>
                  </Label>
                  <Input id="email" type="email" placeholder="admin@acme.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone" className="text-xs font-mono">Contact Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="desc" className="text-xs font-mono">Description</Label>
                  <Textarea id="desc" placeholder="Brief description..." value={desc} onChange={(e) => setDesc(e.target.value)} className="min-h-[80px]" />
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
                  <Label htmlFor="plan" className="text-xs font-mono">
                    Plan <span className="text-destructive">*</span>
                  </Label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger id="plan" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="region" className="text-xs font-mono">
                    Cloud Region <span className="text-destructive">*</span>
                  </Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-east-1 (N. Virginia)">us-east-1 (N. Virginia)</SelectItem>
                      <SelectItem value="us-west-2 (Oregon)">us-west-2 (Oregon)</SelectItem>
                      <SelectItem value="eu-west-1 (Ireland)">eu-west-1 (Ireland)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="billing" className="text-xs font-mono">Billing Cycle</Label>
                  <Select value={billing} onValueChange={setBilling}>
                    <SelectTrigger id="billing" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="env" className="text-xs font-mono">Environment</Label>
                  <Select value={env} onValueChange={setEnv}>
                    <SelectTrigger id="env" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Production">Production</SelectItem>
                      <SelectItem value="Staging">Staging</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Resource Allocation */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Cpu className="h-4 w-4 text-primary" /> Resource Allocation
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { l: "vCPU", v: cpu, s: setCpu, m: 1, mx: 64, u: "cores" },
                  { l: "Memory", v: mem, s: setMem, m: 1, mx: 256, u: "GB" },
                  { l: "Storage", v: storage, s: setStorage, m: 10, mx: 2000, u: "GB" },
                  { l: "Max Images", v: maxImages, s: setMaxImages, m: 1, mx: 50, u: "" },
                ].map((x) => (
                  <div key={x.l} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-mono">{x.l}</Label>
                      <span className="text-xs font-mono text-muted-foreground">{x.v} {x.u}</span>
                    </div>
                    <input
                      type="range"
                      className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
                      min={x.m}
                      max={x.mx}
                      value={x.v}
                      onChange={(e) => x.s(Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Enabled Services */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <IconMenuWidgets className="h-4 w-4 text-primary" /> Enabled Services
              </div>
              <div className="flex flex-wrap gap-2">
                {allServices.map((svc) => (
                  <Badge
                    key={svc}
                    variant={selectedServices.has(svc) ? "default" : "outline"}
                    className={`cursor-pointer transition-all font-mono text-xs ${selectedServices.has(svc) ? "bg-primary/10 text-primary hover:bg-primary/20" : "hover:border-primary hover:text-primary"}`}
                    onClick={() => toggleService(svc)}
                  >
                    {svc}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Tags & Labels */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <Tag className="h-4 w-4 text-primary" /> Tags & Labels
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="tags" className="text-xs font-mono">Tags</Label>
                <Input id="tags" placeholder="e.g. production, fintech, enterprise" value={tags} onChange={(e) => setTags(e.target.value)} />
                <div className="text-[11px] text-muted-foreground">Separate with commas</div>
              </div>
            </Card>
          </div>
        </AppDrawerBody>

        <AppDrawerFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate}><IconCheck className="mr-1 h-3.5 w-3.5" /> Provision Tenant</Button>
        </AppDrawerFooter>
      </AppDrawerContent>
    </AppDrawer>
  )
}
