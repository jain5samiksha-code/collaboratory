"use client"

import type { ComponentProps } from "react"
import { ProgressBar } from "@heroui/react"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: Omit<ComponentProps<typeof ProgressBar>, "children">) {
  return (
    <ProgressBar
      aria-label="Progress"
      color="accent"
      value={value}
      className={cn("w-full", className)}
      {...props}
    >
      <ProgressBar.Track>
        <ProgressBar.Fill />
      </ProgressBar.Track>
    </ProgressBar>
  )
}

export { Progress }
