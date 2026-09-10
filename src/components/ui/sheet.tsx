"use client"

import { createContext, useContext, type ComponentProps, type ReactNode } from "react"
import { Drawer } from "@heroui/react"

import { cn } from "@/lib/utils"

const SheetContext = createContext<{
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}>({})

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <SheetContext.Provider value={{ isOpen: open, onOpenChange }}>
      <Drawer>{children}</Drawer>
    </SheetContext.Provider>
  )
}

function SheetContent({
  className,
  children,
  side = "right",
}: {
  className?: string
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
}) {
  const { isOpen, onOpenChange } = useContext(SheetContext)

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement={side} className={cn(className)}>
        <Drawer.Dialog>
          <Drawer.CloseTrigger />
          {children}
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  )
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <Drawer.Header className={cn(className)} {...props} />
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <Drawer.Footer className={cn(className)} {...props} />
}

function SheetTitle({ className, ...props }: ComponentProps<typeof Drawer.Heading>) {
  return <Drawer.Heading className={cn("font-heading", className)} {...props} />
}

function SheetDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted", className)} {...props} />
}

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
}
