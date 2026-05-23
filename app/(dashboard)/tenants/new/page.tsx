"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { tenants, type Tenant } from "@/lib/tenant-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

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
    if (!name.trim() || !subdomain.trim() || !email.trim()) { 
      alert("Please fill in required fields")
      return
    }
    const colorIdx = Math.floor(Math.random() * 6)
    const newTenant: Tenant = {
      id: "tnx-" + String(tenants.length + 1).padStart(3, "0"),
      name: name.trim(),
      subdomain: subdomain.trim(),
      email: email.trim(),
      status: "active",
      plan,
      region: region.split(" ")[0],
      env,
      created: new Date().toISOString().slice(0, 10),
      billing,
      description: desc.trim(),
      tags: tags.split(",").map(s => s.trim()).filter(Boolean),
      resources: { cpu, cpuUsed: 0, mem, memUsed: 0, storage, storageUsed: 0, maxImages },
      colorIdx,
      images: [],
      services: [],
    }
    tenants.push(newTenant)
    router.push("/tenants")
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold font-display tracking-tight text-foreground">Create Tenant</h1>
        <p className="text-sm text-muted-foreground">Provision a new tenant with cloud resource allocation</p>
      </div>

      {/* Basic Information */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-6">
        <div className="flex items-center gap-2.5 text-base font-semibold mb-5">
          <i className="ti ti-building text-[var(--accent)] text-lg" />
          <span className="text-foreground">Basic Information</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">
              Tenant Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Acme Corporation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[var(--bg3)] border-[var(--border)] text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">
              Subdomain <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="acme"
              value={subdomain}
              onChange={(e) => setSubdomain(e.target.value)}
              className="bg-[var(--bg3)] border-[var(--border)] text-foreground"
            />
            <div className="text-xs text-muted-foreground">Will be used as {subdomain || "acme"}.cloudaxis.io</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">
              Admin Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              placeholder="admin@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[var(--bg3)] border-[var(--border)] text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Contact Phone</label>
            <Input
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-[var(--bg3)] border-[var(--border)] text-foreground"
            />
          </div>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Description</label>
            <textarea
              placeholder="Brief description of your tenant..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="flex min-h-20 w-full rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
            />
          </div>
        </div>
      </Card>

      {/* Plan & Configuration */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-6">
        <div className="flex items-center gap-2.5 text-base font-semibold mb-5">
          <i className="ti ti-settings-2 text-[var(--accent)] text-lg" />
          <span className="text-foreground">Plan & Configuration</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">
              Plan <span className="text-red-500">*</span>
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-foreground outline-none cursor-pointer appearance-none hover:bg-[var(--bg4)] transition-colors"
            >
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">
              Cloud Region <span className="text-red-500">*</span>
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-foreground outline-none cursor-pointer appearance-none hover:bg-[var(--bg4)] transition-colors"
            >
              <option>us-east-1 (N. Virginia)</option>
              <option>us-west-2 (Oregon)</option>
              <option>eu-west-1 (Ireland)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Billing Cycle</label>
            <select
              value={billing}
              onChange={(e) => setBilling(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-foreground outline-none cursor-pointer appearance-none hover:bg-[var(--bg4)] transition-colors"
            >
              <option>Monthly</option>
              <option>Annual</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Environment</label>
            <select
              value={env}
              onChange={(e) => setEnv(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--bg3)] px-3 py-2 text-sm text-foreground outline-none cursor-pointer appearance-none hover:bg-[var(--bg4)] transition-colors"
            >
              <option>Production</option>
              <option>Staging</option>
              <option>Development</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Resource Allocation */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-6">
        <div className="flex items-center gap-2.5 text-base font-semibold mb-5">
          <i className="ti ti-cpu text-[var(--accent)] text-lg" />
          <span className="text-foreground">Resource Allocation</span>
        </div>
        <div className="space-y-4">
          {[
            { l: "vCPU", v: cpu, s: setCpu, m: 1, mx: 64 },
            { l: "Memory", v: mem, s: setMem, m: 1, mx: 256 },
            { l: "Storage", v: storage, s: setStorage, m: 10, mx: 2000 },
            { l: "Max Images", v: maxImages, s: setMaxImages, m: 1, mx: 50 },
          ].map((x) => (
            <div key={x.l} className="flex items-center gap-4">
              <span className="text-xs font-mono text-[var(--text3)] uppercase w-24 tracking-wider">{x.l}</span>
              <input
                type="range"
                className="flex-1 h-1.5 rounded-full bg-[var(--bg3)] appearance-none cursor-pointer accent-[var(--accent)]"
                min={x.m}
                max={x.mx}
                value={x.v}
                onChange={(e) => x.s(Number(e.target.value))}
              />
              <span className="text-xs font-mono text-muted-foreground w-16 text-right">
                {x.v} {x.l === "Max Images" ? "" : "GB"}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Enabled Services */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-6">
        <div className="flex items-center gap-2.5 text-base font-semibold mb-5">
          <i className="ti ti-puzzle text-[var(--accent)] text-lg" />
          <span className="text-foreground">Enabled Services</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {allServices.map((svc) => (
            <button
              key={svc}
              onClick={() => toggleService(svc)}
              className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-mono font-medium transition-all ${
                selectedServices.has(svc)
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] text-muted-foreground hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {svc}
            </button>
          ))}
        </div>
      </Card>

      {/* Tags & Labels */}
      <Card className="border border-[var(--border)] bg-[var(--bg2)] p-6">
        <div className="flex items-center gap-2.5 text-base font-semibold mb-5">
          <i className="ti ti-tag text-[var(--accent)] text-lg" />
          <span className="text-foreground">Tags & Labels</span>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider">Tags</label>
          <Input
            placeholder="e.g. production, fintech, enterprise"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="bg-[var(--bg3)] border-[var(--border)] text-foreground"
          />
          <div className="text-xs text-muted-foreground">Separate with commas</div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-5 border-t border-[var(--border)]">
        <Button
          variant="outline"
          onClick={() => router.push("/tenants")}
          className="border-[var(--border)] text-foreground hover:bg-[var(--bg3)]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          className="bg-[var(--accent)] hover:bg-[var(--accent2)] text-white gap-2"
        >
          <i className="ti ti-circle-check" />
          Provision Tenant
        </Button>
      </div>
    </div>
  )
}