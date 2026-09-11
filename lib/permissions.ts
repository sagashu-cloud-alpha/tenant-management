// Mirrors the @PreAuthorize matrix on the backend controllers — see
// Backend/.../config/SecurityConfig.java and the individual controllers.
// Purely a UI-affordance layer (hide buttons/forms/nav the caller can't use);
// the backend is what actually enforces these on every request.

export function isOwner(roles: string[]) {
  return roles.includes("Owner")
}

export function canManageTenants(roles: string[]) {
  return roles.includes("Owner") || roles.includes("Developer")
}

export function canManageEnvironments(roles: string[]) {
  return roles.includes("Owner") || roles.includes("Developer")
}

export function canManagePlans(roles: string[]) {
  return isOwner(roles)
}

export function canManageBillingCycles(roles: string[]) {
  return isOwner(roles)
}

// Users & Roles administration is Owner-only end to end (see UserController/
// RoleController) — Developer/Viewer can't even read those resources.
export function canAccessAdmin(roles: string[]) {
  return isOwner(roles)
}
