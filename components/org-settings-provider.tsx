"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface OrgSettings {
  orgName: string
  supportEmail: string
}

interface OrgSettingsContextValue extends OrgSettings {
  setOrgSettings: (settings: OrgSettings) => void
}

const STORAGE_KEY = "cloud-alpha-org-settings"

const defaultSettings: OrgSettings = {
  orgName: "Cloud Alpha",
  supportEmail: "support@cloudaxis.io",
}

const OrgSettingsContext = createContext<OrgSettingsContextValue | null>(null)

export function OrgSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<OrgSettings>(defaultSettings)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSettings(JSON.parse(raw))
    } catch {
      // ignore malformed/inaccessible storage
    }
  }, [])

  const setOrgSettings = (next: OrgSettings) => {
    setSettings(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore write failures (e.g. private browsing)
    }
  }

  return (
    <OrgSettingsContext.Provider value={{ ...settings, setOrgSettings }}>
      {children}
    </OrgSettingsContext.Provider>
  )
}

export function useOrgSettings() {
  const ctx = useContext(OrgSettingsContext)
  if (!ctx) throw new Error("useOrgSettings must be used within OrgSettingsProvider")
  return ctx
}
