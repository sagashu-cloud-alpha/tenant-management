"use client"

import { motion, useScroll, useTransform } from "motion/react"
import { IconGrid, IconUpDown, IconMenuWidgets } from "@/components/icons"
import { PieChart } from "lucide-react"
import { TiltCard } from "./tilt-card"

export function HeroParallaxField() {
  const { scrollY } = useScroll()

  const slowY = useTransform(scrollY, [0, 800], [0, 160])
  const fastY = useTransform(scrollY, [0, 800], [0, -220])
  const rotate = useTransform(scrollY, [0, 800], [0, 25])

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: 1400 }}
    >
      <motion.div
        style={{ y: slowY, rotate }}
        className="absolute -top-16 left-[8%] h-64 w-64 rounded-full bg-[hsla(213,94%,55%,0.10)] blur-3xl dark:bg-[hsla(213,94%,68%,0.14)]"
      />
      <motion.div
        style={{ y: fastY }}
        className="absolute top-24 right-[6%] h-72 w-72 rounded-full bg-[hsla(263,70%,50%,0.08)] blur-3xl dark:bg-[hsla(263,70%,70%,0.10)]"
      />
      <motion.div
        style={{ y: slowY }}
        className="absolute top-[60%] left-[45%] h-56 w-56 rounded-full bg-[hsla(173,80%,36%,0.07)] blur-3xl dark:bg-[hsla(173,80%,50%,0.09)]"
      />
    </div>
  )
}

export function HeroMockup() {
  const { scrollY } = useScroll()
  const scale = useTransform(scrollY, [0, 500], [1, 0.92])
  const opacity = useTransform(scrollY, [0, 500], [1, 0.4])
  const translateY = useTransform(scrollY, [0, 500], [0, 60])

  return (
    <motion.div
      style={{ scale, opacity, y: translateY, perspective: 1600 }}
      className="mt-8 w-full max-w-[880px]"
    >
      <TiltCard className="relative rounded-2xl">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative rounded-2xl border border-border bg-card shadow-lg p-5 md:p-7"
        >
          {/* depth layers behind the main panel */}
          <div
            style={{ transform: "translateZ(-60px)" }}
            className="absolute inset-4 rounded-2xl border border-border/60 bg-card/60"
          />
          <div
            style={{ transform: "translateZ(-30px)" }}
            className="absolute inset-2 rounded-2xl border border-border/80 bg-card/80"
          />

          <div
            style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
            className="relative grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <div className="md:col-span-2 rounded-xl border border-border bg-background p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">Tenant overview</span>
                <span className="text-xs font-medium text-primary">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Active tenants", value: "128", color: "text-primary" },
                  { label: "vCPU used", value: "76%", color: "text-[hsl(142,76%,36%)] dark:text-[hsl(142,71%,45%)]" },
                  { label: "Storage", value: "2.4TB", color: "text-[hsl(32,95%,44%)] dark:text-[hsl(38,92%,50%)]" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-muted p-3">
                    <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-end gap-1.5 h-16">
                {[40, 65, 50, 80, 60, 90, 70, 55, 85, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-primary/70"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[hsla(213,94%,55%,0.08)] text-primary dark:bg-[hsla(213,94%,68%,0.12)]">
                  <IconGrid className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">42</p>
                  <p className="text-[11px] text-muted-foreground">Environments</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[hsla(142,76%,36%,0.08)] text-[hsl(142,76%,36%)] dark:bg-[hsla(142,71%,45%,0.12)] dark:text-[hsl(142,71%,45%)]">
                  <IconUpDown className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">99.98%</p>
                  <p className="text-[11px] text-muted-foreground">Uptime</p>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-[hsla(263,70%,50%,0.08)] text-[hsl(263,70%,50%)] dark:bg-[hsla(263,70%,70%,0.12)] dark:text-[hsl(263,70%,70%)]">
                  <IconMenuWidgets className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">316</p>
                  <p className="text-[11px] text-muted-foreground">Images</p>
                </div>
              </div>
            </div>
          </div>

          {/* floating badge */}
          <motion.div
            style={{ transform: "translateZ(80px)" }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-4 -top-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 shadow-md"
          >
            <PieChart className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">+18% this week</span>
          </motion.div>
        </motion.div>
      </TiltCard>
    </motion.div>
  )
}
