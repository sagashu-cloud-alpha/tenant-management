"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { http } from "@/lib/http"
import type { CurrentUserResponseDto } from "@/lib/api-types"

interface Profile {
  name: string
  email: string
  role: string
}

interface ProfileContextValue extends Profile {
  setProfile: (profile: Profile) => void
}

const STORAGE_KEY = "cloud-alpha-profile"

// Shown only while the Auth0 session is still loading, or if it's somehow
// missing on a protected page (middleware.ts is what actually guards access).
const fallbackProfile: Profile = {
  name: "Loading…",
  email: "",
  role: "Member",
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser()
  const [profile, setProfileState] = useState<Profile>(fallbackProfile)
  const [hasLocalOverride, setHasLocalOverride] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        setProfileState(JSON.parse(raw))
        setHasLocalOverride(true)
      }
    } catch {
      // ignore malformed/inaccessible storage
    }
  }, [])

  useEffect(() => {
    if (hasLocalOverride || isLoading || !user) return

    let cancelled = false
    http
      .get<CurrentUserResponseDto>("/me")
      .then(({ data }) => {
        if (cancelled) return
        setProfileState({
          name: data.provisioned
            ? `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || user.name || data.email || "Unknown user"
            : user.name ?? user.email ?? "Unknown user",
          email: (data.provisioned ? data.email : null) ?? user.email ?? "",
          role: data.roles.length > 0 ? data.roles.join(", ") : "Member",
        })
      })
      .catch(() => {
        if (cancelled) return
        // /me is unreachable — fall back to the Auth0 claims. The dashboard
        // layout is what actually enforces access; this is just display text.
        setProfileState({
          name: user.name ?? user.email ?? "Unknown user",
          email: user.email ?? "",
          role: "Member",
        })
      })

    return () => {
      cancelled = true
    }
  }, [hasLocalOverride, isLoading, user])

  const setProfile = (next: Profile) => {
    setProfileState(next)
    setHasLocalOverride(true)
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
