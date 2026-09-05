"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface Profile {
  name: string
  email: string
  role: string
}

interface ProfileContextValue extends Profile {
  setProfile: (profile: Profile) => void
}

const STORAGE_KEY = "cloud-alpha-profile"

const defaultProfile: Profile = {
  name: "Ops Admin",
  email: "ops.admin@cloudaxis.io",
  role: "Super Admin",
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<Profile>(defaultProfile)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProfileState(JSON.parse(raw))
    } catch {
      // ignore malformed/inaccessible storage
    }
  }, [])

  const setProfile = (next: Profile) => {
    setProfileState(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore write failures (e.g. private browsing)
    }
  }

  return (
    <ProfileContext.Provider value={{ ...profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider")
  return ctx
}
