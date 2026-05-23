"use client"

import { useState } from "react"
import { type Tenant, COLORS } from "@/lib/tenant-data"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

type Tab = "overview" | "images" | "services" | "allocation"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

function getBadgeVariant(v: string): "default" | "secondary" | "destructive" | "outline" {
  if (v === "active" || v === "running") return "default"
  if (v === "suspended" || v === "warning") return "destructive"
  return "secondary"
}

function getBadgeClass(v: string) {
  if (v === "active" || v === "running") return "bg-[var(--green-bg)] text-[var(--green)] border border-[var(--green-border)] hover:brightness-110"
  if (v === "suspended" || v === "warning") return "bg-[var(--amber-bg)] text-[var(--amber)] border border-[var(--amber-border)] hover:brightness-110"
  if (v === "starter") return "bg-[var(--teal-bg)] text-[var(--teal)] border border-[var(--teal-border)] hover:brightness-110"
  if (v === "pro") return "bg-[var(--blue-bg)] text-[var(--blue)] border border-[var(--blue-bg)] hover:brightness-110"
  if (v === "enterprise") return "bg-[var(--purple-bg)] text-[var(--purple)] border border-[var(--purple-border)] hover:brightness-110"
  return "bg-[var(--bg4)] text-[var(--text2)] border border-[var(--border2)]"
}

function barFill(pct: number) {
  return pct > 85 ? "bg-[var(--red)]" : pct > 65 ? "bg-[var(--amber)]" : "bg-[var(--green)]"
}

function MiniBar({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = total ? Math.round((used / total) * 100) : 0
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
        <span className="text-xs font-mono text-muted-foreground">
          {used} / {total} {label === "CPU" ? "cores" : "GB"} ({pct}%)
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full transition-all ${barFill(pct)} ${pct > 0 ? 'w-[' + pct + '%]' : 'w-0'}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SmallBar({ pct }: { pct: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-full flex-1 min-w-20 overflow-hidden rounded-full bg-muted">
        <div className={`h-full transition-all ${barFill(pct)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-muted-foreground min-w-10 text-right">{pct}%</span>
    </div>
  )
}

export default function TenantDetailContent({ tenant: t }: { tenant: Tenant }) {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const c = COLORS[t.colorIdx]
  const initials = t.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
  const r = t.resources
  const cpuPct = r.cpu ? Math.round((r.cpuUsed / r.cpu) * 100) : 0
  const memPct = r.mem ? Math.round((r.memUsed / r.mem) * 100) : 0
  const stoPct = r.storage ? Math.round((r.storageUsed / r.storage) * 100) : 0
  const imgPct = r.maxImages ? Math.round((t.images.length / r.maxImages) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Tenant Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold" style={{ background: c.bg, color: c.color }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold font-display text-foreground">{t.name}</h2>
            <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">{t.id} · {t.subdomain}.cloudaxis.io</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:ml-auto">
          <Badge className={getBadgeClass(t.status)}>{t.status}</Badge>
          <Badge className={getBadgeClass(t.plan)}>{t.plan}</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="space-y-10 md:space-y-5">
        <TabsList className="bg-[var(--bg2)] border border-[var(--border)] rounded-lg p-0.5 w-full h-full grid grid-cols-2 gap-0.5 sm:inline-flex sm:w-auto sm:p-1 sm:gap-0">
          <TabsTrigger value="overview" className="gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-[var(--accent)]/10">
            <i className="ti ti-layout-dashboard" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Info</span>
          </TabsTrigger>
          <TabsTrigger value="images" className="gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-[var(--accent)]/10">
            <i className="ti ti-container" />
            Images
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-[var(--accent)]/10">
            <i className="ti ti-server" />
            Services
          </TabsTrigger>
          <TabsTrigger value="allocation" className="gap-1.5 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-[var(--accent)]/10">
            <i className="ti ti-chart-pie" />
            <span className="hidden sm:inline">Allocation</span>
            <span className="sm:hidden">Usage</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Tenant ID", value: t.id, mono: true },
              { label: "Region", value: t.region, mono: true },
              { label: "Environment", value: t.env, mono: false },
              { label: "Admin Email", value: t.email, mono: true },
              { label: "Billing", value: t.billing, mono: false },
              { label: "Created", value: formatDate(t.created), mono: false },
            ].map((item) => (
              <Card key={item.label} className="border border-[var(--border)] bg-[var(--bg2)] p-3 sm:p-4">
                <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1.5 font-semibold">{item.label}</div>
                <div className={`text-sm font-medium text-foreground break-all ${item.mono ? "font-mono text-xs text-muted-foreground" : ""}`}>
                  {item.value}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Stats */}
            <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
                <i className="ti ti-server-2 text-[var(--accent)]" />
                <span className="text-foreground">Quick Stats</span>
              </div>
              <div className="space-y-0.5">
                <MiniBar label="CPU" used={r.cpuUsed} total={r.cpu} />
                <MiniBar label="Memory" used={r.memUsed} total={r.mem} />
                <MiniBar label="Storage" used={r.storageUsed} total={r.storage} />
                <div className="flex justify-between text-xs pt-2">
                  <span className="text-muted-foreground">Docker Images</span>
                  <span className="font-mono">{t.images.length} / {r.maxImages}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Services Running</span>
                  <span className="font-mono text-[var(--green)]">
                    {t.services.filter(s => s.status === "running").length} / {t.services.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Tags */}
            <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
              <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
                <i className="ti ti-tag text-[var(--accent)]" />
                <span className="text-foreground">Tags</span>
              </div>
              {t.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="font-mono">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">No tags assigned</span>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* Images Tab */}
        <TabsContent value="images">
          <Card className="border border-[var(--border)] bg-[var(--bg2)] overflow-hidden">
            {t.images.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <i className="ti ti-container text-5xl opacity-30" />
                <p className="text-sm">No docker images allocated</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-sm min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--bg3)]">
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Image Name</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Tag</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Status</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Containers</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">CPU Usage</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Memory</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Size</th>
                      <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Pulled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.images.map((img) => {
                      const dotClass = img.status === "running" ? "bg-[var(--green)]" : img.status === "warning" ? "bg-[var(--amber)]" : "bg-[var(--red)]"
                      return (
                        <tr key={img.name + img.tag} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                          <td className="px-3 sm:px-5 py-4">
                            <span className="font-mono text-xs text-[var(--accent)]">{img.name}</span>
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {img.tag}
                            </Badge>
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs">
                              <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                              {img.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <span className="font-mono text-xs text-muted-foreground">{img.containers}</span>
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <SmallBar pct={img.cpu} />
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <span className="font-mono text-xs text-muted-foreground">{img.mem}</span>
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <span className="font-mono text-xs text-muted-foreground">{img.size}</span>
                          </td>
                          <td className="px-3 sm:px-5 py-4">
                            <span className="text-xs text-muted-foreground">{img.pulled}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          {t.services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <i className="ti ti-server text-5xl opacity-30" />
              <p className="text-sm">No services running</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {t.services.map((svc) => {
                const borderClass =
                  svc.status === "running"
                    ? "border-l-[var(--green)]"
                    : svc.status === "warning"
                      ? "border-l-[var(--amber)]"
                      : "border-l-[var(--text3)]"
                return (
                  <Card
                    key={svc.name}
                    className={`border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5 border-l-4 ${borderClass}`}
                  >
                    <div className="flex items-start justify-between mb-3 gap-3">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{svc.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{svc.type}</div>
                      </div>
                      <Badge className={getBadgeClass(svc.status)}>{svc.status}</Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Port</span>
                        <span className="font-mono">{svc.port}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-mono">{svc.uptime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version</span>
                        <span className="font-mono">{svc.version}</span>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "vCPU Allocation", value: `${r.cpu} cores`, sub: `${r.cpuUsed} used`, pct: cpuPct },
              { label: "Memory Allocation", value: `${r.mem} GB`, sub: `${r.memUsed} GB used`, pct: memPct },
              { label: "Storage Allocation", value: `${r.storage} GB`, sub: `${r.storageUsed} GB used`, pct: stoPct },
              { label: "Image Quota", value: `${r.maxImages} images`, sub: `${t.images.length} deployed`, pct: imgPct },
            ].map((card) => (
              <Card key={card.label} className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
                <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-2 font-semibold">
                  {card.label}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-foreground">{card.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {card.sub} · {card.pct}% utilized
                </div>
                <div className="mt-4">
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className={`h-full transition-all ${barFill(card.pct)}`} style={{ width: `${card.pct}%` }} />
                  </div>
                  <div className="flex justify-between text-xs font-mono text-muted-foreground mt-2">
                    <span>0</span>
                    <span>{card.value.split(" ")[0]}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="border border-[var(--border)] bg-[var(--bg2)] p-4 sm:p-5">
            <div className="flex items-center gap-2.5 text-sm sm:text-base font-semibold mb-4 sm:mb-5">
              <i className="ti ti-list-details text-[var(--accent)]" />
              <span className="text-foreground">Allocated Resources Summary</span>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg3)]">
                    <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Resource</th>
                    <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Allocated</th>
                    <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Used</th>
                    <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Available</th>
                    <th className="px-3 sm:px-5 py-3 text-left text-xs font-mono text-[var(--text3)] font-semibold uppercase tracking-wider">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "vCPU",
                      allocated: `${r.cpu} cores`,
                      used: `${r.cpuUsed} cores`,
                      available: `${r.cpu - r.cpuUsed} cores`,
                      pct: cpuPct,
                    },
                    {
                      label: "Memory",
                      allocated: `${r.mem} GB`,
                      used: `${r.memUsed} GB`,
                      available: `${r.mem - r.memUsed} GB`,
                      pct: memPct,
                    },
                    {
                      label: "Storage",
                      allocated: `${r.storage} GB`,
                      used: `${r.storageUsed} GB`,
                      available: `${r.storage - r.storageUsed} GB`,
                      pct: stoPct,
                    },
                    {
                      label: "Images",
                      allocated: `${r.maxImages}`,
                      used: `${t.images.length}`,
                      available: `${r.maxImages - t.images.length}`,
                      pct: imgPct,
                    },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-[var(--border)] hover:bg-[var(--bg3)] transition-colors">
                      <td className="px-3 sm:px-5 py-4 font-mono text-xs">{row.label}</td>
                      <td className="px-3 sm:px-5 py-4 font-mono text-xs text-muted-foreground">{row.allocated}</td>
                      <td className="px-3 sm:px-5 py-4 font-mono text-xs text-muted-foreground">{row.used}</td>
                      <td className="px-3 sm:px-5 py-4 font-mono text-xs text-muted-foreground">{row.available}</td>
                      <td className="px-3 sm:px-5 py-4">
                        <SmallBar pct={row.pct} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}