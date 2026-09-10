import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { SECTIONS } from "@/lib/fields"
import type { SectionId } from "@/lib/types"

export function ActivityStepper({
  current,
  onSelect,
}: {
  current: SectionId
  onSelect?: (id: SectionId) => void
}) {
  const currentIndex = SECTIONS.findIndex((section) => section.id === current)

  return (
    <ol className="relative flex w-full items-start justify-between gap-2">
      <span className="absolute top-4 right-8 left-8 h-px bg-border" aria-hidden />
      {SECTIONS.map((section, index) => {
        const active = section.id === current
        const done = index < currentIndex
        return (
          <li key={section.id} className="relative z-10 flex min-w-0 flex-1 flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect?.(section.id)}
              className="flex flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                  done && "bg-[#3b6d11] text-white",
                  active && "border-4 border-primary bg-background",
                  !active && !done && "border border-border bg-background text-muted-foreground"
                )}
              >
                {done ? <Check className="size-4" /> : active ? <span className="size-2.5 rounded-full bg-primary" /> : null}
              </span>
              <span
                className={cn(
                  "text-center text-xs font-medium",
                  active && "text-foreground",
                  done && "text-muted-foreground",
                  !active && !done && "text-muted-foreground"
                )}
              >
                {section.label}
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
