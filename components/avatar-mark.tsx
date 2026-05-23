// components/ui/avatar-mark.tsx

import { cn } from "@/lib/utils"

type AvatarMarkSize = "xs" | "sm" | "md" | "lg" | "xl"
type AvatarMarkVariant = "brand" | "user" | "neutral" | "success" | "warning" | "danger"

interface AvatarMarkProps {
  initials: string          // e.g. "CA", "SA", "OP"
  size?: AvatarMarkSize
  variant?: AvatarMarkVariant
  shape?: "rounded" | "circle"
  className?: string
  showName?: boolean        // show text label beside it
  name?: string             // full name for the label
  subtext?: string          // subtitle below name
}

const sizeClasses: Record<AvatarMarkSize, { wrap: string; text: string }> = {
  xs:  { wrap: "size-5",  text: "text-[9px]"  },
  sm:  { wrap: "size-7",  text: "text-[11px]" },
  md:  { wrap: "size-8",  text: "text-[13px]" },
  lg:  { wrap: "size-10", text: "text-[15px]" },
  xl:  { wrap: "size-12", text: "text-[18px]" },
}

const variantClasses: Record<AvatarMarkVariant, string> = {
  brand:   "bg-primary text-primary-foreground",
  user:    "bg-gradient-to-br from-purple-500 to-indigo-500 text-white",
  neutral: "bg-muted text-muted-foreground",
  success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  danger:  "bg-red-500/15 text-red-600 dark:text-red-400",
}

export function AvatarMark({
  initials,
  size = "md",
  variant = "brand",
  shape = "rounded",
  className,
  showName = false,
  name,
  subtext,
}: AvatarMarkProps) {
  const { wrap, text } = sizeClasses[size]
  const colors = variantClasses[variant]
  const radius = shape === "circle" ? "rounded-full" : "rounded-lg"

  const mark = (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-semibold leading-none",
        wrap,
        text,
        colors,
        radius,
        className
      )}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  )

  if (!showName) return mark

  return (
    <div className="flex items-center gap-2.5">
      {mark}
      {(name || subtext) && (
        <div className="min-w-0">
          {name && (
            <p className="truncate text-sm font-medium text-foreground">
              {name}
            </p>
          )}
          {subtext && (
            <p className="truncate text-xs text-muted-foreground">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  )
}