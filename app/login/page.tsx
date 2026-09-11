import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AvatarMark } from "@/components/avatar-mark"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-raised)] bg-secondary/30 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-[400px] bg-card border border-border rounded-xl p-10 shadow-lg flex flex-col gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <AvatarMark initials="CA" size="sm" variant="brand" shape="rounded" />
            <span className="text-lg font-bold tracking-tight text-foreground">Cloud Alpha</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to your account to continue</p>
        </div>

        <Button asChild className="w-full h-10">
          <Link href="/auth/login?returnTo=/tenants">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Link>
        </Button>

        <p className="text-center text-[13px] text-muted-foreground">
          Don&apos;t have an account? <Link href="#" className="text-primary font-medium hover:underline">Contact sales</Link>
        </p>
      </div>
    </div>
  )
}
