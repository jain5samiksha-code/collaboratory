"use client"

import type { MouseEvent, MouseEventHandler } from "react"
import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react"

import { cn } from "@/lib/utils"

const variantMap = {
  default: "primary",
  primary: "primary",
  outline: "outline",
  secondary: "secondary",
  ghost: "ghost",
  destructive: "danger",
  danger: "danger",
  link: "ghost",
  tertiary: "tertiary",
} as const

const sizeMap = {
  default: "md",
  xs: "sm",
  sm: "sm",
  md: "md",
  lg: "lg",
  icon: "sm",
  "icon-xs": "sm",
  "icon-sm": "sm",
  "icon-lg": "md",
} as const

type LegacyVariant = keyof typeof variantMap
type LegacySize = keyof typeof sizeMap

type ButtonProps = Omit<HeroButtonProps, "variant" | "size"> & {
  variant?: LegacyVariant
  size?: LegacySize
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

function Button({
  className,
  variant = "default",
  size = "default",
  disabled,
  isDisabled,
  isIconOnly,
  onClick,
  onPress,
  ...props
}: ButtonProps) {
  const iconOnly =
    isIconOnly ??
    (size === "icon" || size === "icon-xs" || size === "icon-sm" || size === "icon-lg")

  return (
    <HeroButton
      variant={variantMap[variant]}
      size={sizeMap[size]}
      isIconOnly={iconOnly}
      isDisabled={disabled ?? isDisabled}
      onPress={onPress ?? (onClick ? () => onClick({} as MouseEvent<HTMLButtonElement>) : undefined)}
      className={cn(variant === "link" && "underline-offset-4 hover:underline", className)}
      {...props}
    />
  )
}

export { Button }
export type { ButtonProps }
