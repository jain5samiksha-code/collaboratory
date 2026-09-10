"use client"

import type { ComponentProps } from "react"
import { Switch as HeroSwitch } from "@heroui/react"

import { cn } from "@/lib/utils"

function Switch({
  className,
  checked,
  onCheckedChange,
  disabled,
  size = "default",
  ...props
}: Omit<ComponentProps<typeof HeroSwitch>, "onChange" | "size"> & {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  size?: "sm" | "default"
}) {
  return (
    <HeroSwitch
      isSelected={checked}
      isDisabled={disabled}
      size={size === "sm" ? "sm" : "md"}
      onChange={onCheckedChange}
      className={cn(className)}
      {...props}
    >
      <HeroSwitch.Control>
        <HeroSwitch.Thumb />
      </HeroSwitch.Control>
    </HeroSwitch>
  )
}

export { Switch }
