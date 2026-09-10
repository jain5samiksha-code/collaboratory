"use client"

import type { ComponentProps } from "react"
import { Input as HeroInput } from "@heroui/react"

import { cn } from "@/lib/utils"

function Input({ className, ...props }: ComponentProps<typeof HeroInput>) {
  return <HeroInput fullWidth className={cn("text-body", className)} {...props} />
}

export { Input }
