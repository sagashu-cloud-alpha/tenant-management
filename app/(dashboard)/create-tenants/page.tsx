"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { tenants, type Tenant } from "@/lib/tenant-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const allServices = [
  "API Gateway", "PostgreSQL", "Redis Cache", "Kafka", "Elasticsearch", "S3 Storage", "CDN", "ML Pipeline", "Grafana", "Prometheus",
]

export default function CreateTenantPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [subdomain, setSubdomain] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [desc, setDesc] = useState("")
  const [plan, setPlan] = useState("pro")
  const [region, setRegion] = useState("us-east-1 (N. Virginia)")
  const [billing, setBilling] = useState("Monthly")
  const [env, setEnv] = useState("Production")
  const [cpu, setCpu] = useState(8)
  const [mem, setMem] = useState(16)
  const [storage, setStorage] = useState(100)
  const [maxImages, setMaxImages] = useState(10)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set(["API Gateway", "PostgreSQL", "Redis Cache", "S3 Storage"]))
  const [tags, setTags] = useState("")

  const toggleService = (svc: string) => setSelectedServices(prev => { const next = new Set(prev); next.has(svc) ? next.delete(svc) : next.add(svc); return next })
  const handleCreate = () => {
    if (!name.trim() || !subdomain.trim() || !email.trim()) { alert("Please fill in required fields"); return }
    const colorIdx = Math.floor(Math.random() * 6)
    const newTenant: Tenant = {
      id: "tnx-" + String(tenants.length + 1).padStart(3, "0"), name: name.trim(), subdomain: subdomain.trim(), email: email.trim(),
      status: "active", plan, region: region.split(" ")[0], env, created: new Date().toISOString().slice(0, 10), billing, description: desc.trim(),
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      resources: { cpu, cpuUsed: 0, mem, memUsed: 0, storage, storageUsed: 0, maxImages }, colorIdx, images: [], services: [],
    }
    tenants.push(newTenant); router.push("/tenants")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="font-display text-xl sm:text-[22px] font-bold tracking-[-0.3px]">Create Tenant</h1>
        <p className="text-xs sm:text-[13px] text-muted-foreground">Provision a new tenant with cloud resource allocation</p>
      </div>

      {/* Basic Information */}
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold mb-4 sm:mb-[18px]">
          <i className="ti ti-building text-primary" /> Basic Information
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
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold mb-4 sm:mb-[18px]">
          <i className="ti ti-settings-2 text-primary" /> Plan & Configuration
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
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold mb-4 sm:mb-[18px]">
          <i className="ti ti-cpu text-primary" /> Resource Allocation
        </div>
        <div className="flex flex-col gap-4">
          {[{ l: "vCPU", v: cpu, s: setCpu, m: 1, mx: 64, u: "cores" }, { l: "Memory", v: mem, s: setMem, m: 1, mx: 256, u: "GB" }, { l: "Storage", v: storage, s: setStorage, m: 10, mx: 2000, u: "GB" }, { l: "Max Images", v: maxImages, s: setMaxImages, m: 1, mx: 50, u: "" }].map(x => (
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
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold mb-4 sm:mb-[18px]">
          <i className="ti ti-puzzle text-primary" /> Enabled Services
        </div>
        <div className="flex flex-wrap gap-2">
          {allServices.map(svc => (
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
      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm sm:text-[15px] font-semibold mb-4 sm:mb-[18px]">
          <i className="ti ti-tag text-primary" /> Tags & Labels
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="tags" className="text-xs font-mono">Tags</Label>
          <Input id="tags" placeholder="e.g. production, fintech, enterprise" value={tags} onChange={(e) => setTags(e.target.value)} />
          <div className="text-[11px] text-muted-foreground">Separate with commas</div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-5 border-t">
        <Button variant="outline" onClick={() => router.push("/tenants")} className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={handleCreate} className="w-full sm:w-auto"><i className="ti ti-circle-check mr-1" /> Provision Tenant</Button>
      </div>
    </div>
  )
}
