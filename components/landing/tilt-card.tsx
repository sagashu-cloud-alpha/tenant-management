"use client"

import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import type { ReactNode, PointerEvent } from "react"

export function TiltCard({
  children,
  className,
  max = 10,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)

  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.6 })
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.6 })

  const rotateX = useTransform(springY, [0, 1], [max, -max])
  const rotateY = useTransform(springX, [0, 1], [-max, max])

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width)
    y.set((e.clientY - rect.top) / rect.height)
  }

  function handlePointerLeave() {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <motion.div
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  )
}
