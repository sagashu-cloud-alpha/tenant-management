import { requireAdminAccess } from "@/lib/require-role"
import { SettingsPageClient } from "./settings-page-client"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  await requireAdminAccess()

  return <SettingsPageClient />
}
