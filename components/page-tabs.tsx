"use client"

import type { ComponentType } from "react"
import { cn } from "@/lib/utils"

export interface PageTabItem {
  value: string
  label: string
  icon?: ComponentType<{ className?: string }>
  count?: number
}

interface PageTabsProps {
  tabs: PageTabItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function PageTabs({ tabs, value, onValueChange, className }: PageTabsProps) {
  return (
    <div className={cn("flex items-center gap-6 border-b border-border-default", className)}>
      {tabs.map((tab) => {
        const active = tab.value === value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors -mb-px",
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-mono leading-none",
                  active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {tab.count}
              </span>
            )}
            {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />}
          </button>
        )
      })}
    </div>
  )
}
