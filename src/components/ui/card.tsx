"use client"

import type { ComponentProps } from "react"
import { Card as HeroCard } from "@heroui/react"

import { cn } from "@/lib/utils"

function Card({ className, variant = "default", ...props }: ComponentProps<typeof HeroCard>) {
  return <HeroCard variant={variant} className={cn(className)} {...props} />
}

function CardHeader({ className, ...props }: ComponentProps<typeof HeroCard.Header>) {
  return <HeroCard.Header className={cn(className)} {...props} />
}

function CardTitle({ className, ...props }: ComponentProps<typeof HeroCard.Title>) {
  return <HeroCard.Title className={cn("font-heading", className)} {...props} />
}

function CardDescription({
  className,
  ...props
}: ComponentProps<typeof HeroCard.Description>) {
  return <HeroCard.Description className={cn(className)} {...props} />
}

function CardContent({ className, ...props }: ComponentProps<typeof HeroCard.Content>) {
  return <HeroCard.Content className={cn(className)} {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<typeof HeroCard.Footer>) {
  return <HeroCard.Footer className={cn(className)} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
