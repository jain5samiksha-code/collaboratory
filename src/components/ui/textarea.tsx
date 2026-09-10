"use client"

import type { ComponentProps } from "react"
import { TextArea } from "@heroui/react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: ComponentProps<typeof TextArea>) {
  return <TextArea fullWidth className={cn("text-body", className)} {...props} />
}

export { Textarea }
