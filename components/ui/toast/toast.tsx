"use client"

import { useEffect } from "react"
import { motion } from "motion/react"
import { X } from "lucide-react"
import { IconError, IconInfo, IconWarning, IconSuccess, IconLoading } from "@/components/icons"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info" | "warning" | "loading"
export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left"

interface ToastProps {
  type?: ToastType
  message: string
  autoClose?: boolean | number
  closeButton?: boolean
  position?: ToastPosition
  onClose?: () => void
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <IconSuccess className="h-5 w-5 text-[var(--green)]" />,
  error: <IconError className="h-5 w-5 text-destructive" />,
  warning: <IconWarning className="h-5 w-5 text-[var(--amber)]" />,
  info: <IconInfo className="h-5 w-5 text-primary" />,
  loading: <IconLoading className="h-5 w-5 animate-spin text-primary" />,
}

const slideFrom: Record<ToastPosition, { x?: number; y?: number }> = {
  "top-right": { x: 24 },
  "bottom-right": { x: 24 },
  "top-left": { x: -24 },
  "bottom-left": { x: -24 },
}

export function Toast({
  type = "info",
  message,
  autoClose = 4000,
  closeButton = true,
  position = "top-right",
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (!autoClose || type === "loading") return
    const duration = typeof autoClose === "number" ? autoClose : 4000
    const timer = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(timer)
  }, [autoClose, type, onClose])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, ...slideFrom[position] }}
      animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, ...slideFrom[position] }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn(
        "pointer-events-auto flex w-[340px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-[var(--radius-lg)] border bg-[var(--bg2)] p-3.5 shadow-lg",
        "border-[var(--border)]",
      )}
    >
      <div className="mt-0.5 flex-shrink-0">{icons[type]}</div>
      <p className="min-w-0 flex-1 text-sm text-foreground leading-snug break-words">{message}</p>
      {closeButton && type !== "loading" && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="flex-shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  )
}
