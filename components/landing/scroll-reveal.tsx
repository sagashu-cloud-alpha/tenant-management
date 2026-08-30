"use client"

import { motion, type Variants } from "motion/react"
import type { ReactNode } from "react"

const variants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    rotateX: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
