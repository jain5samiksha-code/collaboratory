"use client"

import type { ComponentProps } from "react"
import { Label as HeroLabel } from "@heroui/react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: ComponentProps<typeof HeroLabel>) {
  return (
    <HeroLabel
      className={cn("text-body font-medium", className)}
      {...props}
    />
  )
}

export { Label }
