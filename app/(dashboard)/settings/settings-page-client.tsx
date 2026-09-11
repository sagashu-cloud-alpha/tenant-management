"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Building2, Palette, Sun, Moon, Monitor } from "lucide-react"
import { useOrgSettings } from "@/components/org-settings-provider"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
]

export function SettingsPageClient() {
  const { orgName, supportEmail } = useOrgSettings()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const activeTheme = mounted ? theme ?? "system" : undefined

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
            <Building2 className="h-4 w-4 text-primary" /> Organization
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1 font-semibold">Organization Name</div>
              <div className="text-sm font-medium text-foreground">{orgName}</div>
            </div>
            <div>
              <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-1 font-semibold">Support Email</div>
              <div className="text-sm font-medium text-foreground break-all">{supportEmail || "—"}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
            <Palette className="h-4 w-4 text-primary" /> Appearance
          </div>
          <div className="text-xs font-mono text-[var(--text3)] uppercase tracking-wider mb-2 font-semibold">Theme</div>
          <div className="flex gap-2">
            {themeOptions.map((opt) => {
              const active = activeTheme === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border-default text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  )}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
