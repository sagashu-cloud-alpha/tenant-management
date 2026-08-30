import Link from "next/link"
import { Rocket, Play, PieChart } from "lucide-react"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { AvatarMark } from "@/components/avatar-mark"
import {
  IconSparkle,
  IconGrid,
  IconUpDown,
  IconMenuWidgets,
  ServerIcon,
} from "@/components/icons"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Navigation */}
      <nav className="flex items-center px-6 md:px-10 h-16 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50 gap-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <AvatarMark initials="CA" size="sm" variant="brand" shape="rounded" />
          <span className="text-base font-bold text-foreground tracking-tight">Cloud Alpha</span>
        </Link>
        
        <div className="hidden md:flex gap-1 flex-1">
          <Link href="#" className="px-3.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">Product</Link>
          <Link href="#" className="px-3.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">Docs</Link>
          <Link href="#" className="px-3.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors">Blog</Link>
        </div>

        <div className="flex gap-2 items-center ml-auto">
          <ModeToggle />
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 pt-[100px] pb-[80px] gap-6 max-w-[760px] mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsla(213,94%,55%,0.08)] border border-[hsla(213,94%,55%,0.15)] text-primary text-xs font-medium dark:bg-[hsla(213,94%,68%,0.12)] dark:border-[hsla(213,94%,68%,0.2)]">
          <IconSparkle className="h-3.5 w-3.5" />
          Now with AI-powered tenant insights
        </div>
        
        <h1 className="text-[clamp(32px,5vw,52px)] font-extrabold tracking-tight leading-[1.1] text-foreground">
          Multi-tenant cloud<br />
          <span className="text-primary">management, simplified</span>
        </h1>
        
        <p className="text-lg text-muted-foreground leading-relaxed max-w-[580px]">
          Provision, monitor, and scale your SaaS tenants with full resource visibility — Docker images, services, allocations, and billing in one unified dashboard.
        </p>
        
        <div className="flex gap-3 items-center flex-wrap justify-center mt-2">
          <Button size="lg" asChild className="h-11 px-6 rounded-md">
            <Link href="/login">
              <Rocket className="mr-2 h-4 w-4" /> Start for free
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild className="h-11 px-6 rounded-md bg-[var(--bg-elevated)] border-border-input">
            <Link href="#">
              <Play className="mr-2 h-4 w-4" /> View demo
            </Link>
          </Button>
        </div>
      </section>

      {/* Features (Bento Grid) Section */}
      <section className="px-6 md:px-10 py-10 md:pb-20 max-w-[1100px] mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Features</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Everything you need to manage tenants</h2>
          <p className="text-base text-muted-foreground">From provisioning to monitoring — one platform, zero complexity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-card border border-border rounded-xl p-7 transition-all hover:border-primary hover:shadow-md hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl bg-[hsla(213,94%,55%,0.08)] text-primary dark:bg-[hsla(213,94%,68%,0.12)]">
              <IconGrid className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Tenant Provisioning</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Spin up fully isolated tenant environments in seconds. Configure plans, regions, billing cycles, and resource limits from a single workflow. Supports staging, production, and development environments out of the box.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-7 transition-all hover:border-primary hover:shadow-md hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl bg-[hsla(142,76%,36%,0.08)] text-[hsl(142,76%,36%)] dark:bg-[hsla(142,71%,45%,0.12)] dark:text-[hsl(142,71%,45%)]">
              <IconUpDown className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Real-time Monitoring</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CPU, memory, and storage usage tracked live with intelligent alerting when tenants approach their limits.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-7 transition-all hover:border-primary hover:shadow-md hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl bg-[hsla(263,70%,50%,0.08)] text-[hsl(263,70%,50%)] dark:bg-[hsla(263,70%,70%,0.12)] dark:text-[hsl(263,70%,70%)]">
              <IconMenuWidgets className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Docker Registry</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Manage container images per tenant with pull history, status, and container counts at a glance.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-7 transition-all hover:border-primary hover:shadow-md hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl bg-[hsla(32,95%,44%,0.08)] text-[hsl(32,95%,44%)] dark:bg-[hsla(38,92%,50%,0.12)] dark:text-[hsl(38,92%,50%)]">
              <ServerIcon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Service Management</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track all microservices — uptime, version, port, and status — across every tenant in your fleet.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-7 transition-all hover:border-primary hover:shadow-md hover:-translate-y-[1px]">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-xl bg-[hsla(173,80%,36%,0.08)] text-[hsl(173,80%,36%)] dark:bg-[hsla(173,80%,50%,0.12)] dark:text-[hsl(173,80%,50%)]">
              <PieChart className="h-5 w-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Resource Allocation</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Visualise vCPU, memory, storage, and image quota utilisation with clear allocation summaries.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 px-6 md:px-10 flex items-center justify-between text-sm text-muted-foreground">
        <div>&copy; {new Date().getFullYear()} Cloud Alpha. All rights reserved.</div>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-foreground">Terms</Link>
          <Link href="#" className="hover:text-foreground">Privacy</Link>
        </div>
      </footer>
    </div>
  )
}
