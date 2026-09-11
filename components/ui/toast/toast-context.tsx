"use client"

import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import { AnimatePresence } from "motion/react"
import { Toast, type ToastPosition, type ToastType } from "./toast"

interface ToastItem {
  id: number
  message: string
  type: ToastType
  position: ToastPosition
  autoClose?: boolean | number
}

interface AddToastOptions {
  position?: ToastPosition
  autoClose?: boolean | number
}

interface ToastHandle {
  update: (message: string, type: ToastType, options?: AddToastOptions) => void
  dismiss: () => void
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType, options?: AddToastOptions) => ToastHandle
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}

let toastId = 0

const POSITIONS: ToastPosition[] = ["top-left", "top-right", "bottom-left", "bottom-right"]

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = "info", options: AddToastOptions = {}): ToastHandle => {
      const id = ++toastId
      const position = options.position ?? "top-right"
      const autoClose = options.autoClose ?? (type === "loading" ? false : 4000)

      setToasts((prev) => [...prev, { id, message, type, position, autoClose }])

      return {
        update: (newMessage, newType, updateOptions = {}) => {
          const nextAutoClose = updateOptions.autoClose ?? (newType === "loading" ? false : 4000)
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, message: newMessage, type: newType, autoClose: nextAutoClose } : t)),
          )
        },
        dismiss: () => removeToast(id),
      }
    },
    [removeToast],
  )

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {POSITIONS.map((pos) => (
        <div
          key={pos}
          className={`pointer-events-none fixed z-[9999] flex flex-col gap-2 ${
            pos.includes("top") ? "top-4" : "bottom-4 flex-col-reverse"
          } ${pos.includes("left") ? "left-4" : "right-4"}`}
        >
          <AnimatePresence initial={false}>
            {toasts
              .filter((t) => t.position === pos)
              .map((t) => (
                <Toast
                  key={t.id}
                  type={t.type}
                  message={t.message}
                  position={t.position}
                  autoClose={t.autoClose}
                  closeButton={t.type !== "loading"}
                  onClose={() => removeToast(t.id)}
                />
              ))}
          </AnimatePresence>
        </div>
      ))}
    </ToastContext.Provider>
  )
}
