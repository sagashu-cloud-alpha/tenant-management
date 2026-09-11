"use client"

import { createContext, useContext, type ReactNode } from "react"

// Populated once, server-side, from the same /me call the (dashboard) layout
// already makes to check the account is active — see app/(dashboard)/layout.tsx.
// Client components read roles from here instead of fetching /me again.
const CurrentUserRolesContext = createContext<string[]>([])

export function CurrentUserProvider({ roles, children }: { roles: string[]; children: ReactNode }) {
  return <CurrentUserRolesContext.Provider value={roles}>{children}</CurrentUserRolesContext.Provider>
}

export function useCurrentUserRoles() {
  return useContext(CurrentUserRolesContext)
}
