"use client"

import { createContext, useContext, type ComponentProps, type ReactNode } from "react"
import { Modal } from "@heroui/react"

import { cn } from "@/lib/utils"

const DialogContext = createContext<{
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}>({})

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <DialogContext.Provider value={{ isOpen: open, onOpenChange }}>
      <Modal>{children}</Modal>
    </DialogContext.Provider>
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
}: {
  className?: string
  children: ReactNode
  showCloseButton?: boolean
}) {
  const { isOpen, onOpenChange } = useContext(DialogContext)

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className={cn(className)}>
          {showCloseButton ? <Modal.CloseTrigger /> : null}
          {children}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  )
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <Modal.Header className={cn("flex flex-col gap-2", className)} {...props} />
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return <Modal.Footer className={cn(className)} {...props} />
}

function DialogTitle({ className, ...props }: ComponentProps<typeof Modal.Heading>) {
  return <Modal.Heading className={cn("font-heading", className)} {...props} />
}

function DialogDescription({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />
}

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
}
