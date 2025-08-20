"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedIconProps {
  children: React.ReactNode
  className?: string
  isActive?: boolean
  pulse?: boolean
  bounce?: boolean
  wiggle?: boolean
}

export function AnimatedIcon({ children, className, isActive }: AnimatedIconProps) {
  return <div className={cn("transition-transform duration-200", isActive && "scale-110", className)}>{children}</div>
}
