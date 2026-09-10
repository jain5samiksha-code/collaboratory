import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("relative overflow-auto scrollbar-thin", className)} {...props}>
      {children}
    </div>
  )
}

export { ScrollArea }
