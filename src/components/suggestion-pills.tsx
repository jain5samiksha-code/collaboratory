"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export type SuggestionOption = {
  id: string
  label: string
}

const SHORT_LABEL_MAX = 40

export function prefersHorizontalSuggestions(options: SuggestionOption[]) {
  if (options.length === 0) return false
  const longest = Math.max(...options.map((option) => option.label.length))
  if (longest > SHORT_LABEL_MAX) return false
  return options.length <= 3
}

export function SuggestionPills({
  header = "You can select option which aligns better with the article",
  options,
  selectedId,
  onPick,
  className,
}: {
  header?: string | null
  options: SuggestionOption[]
  selectedId?: string
  onPick?: (id: string) => void
  className?: string
}) {
  const [dismissed, setDismissed] = useState(false)

  if (options.length === 0 || dismissed) return null

  const horizontal = prefersHorizontalSuggestions(options)

  return (
    <div className={cn("space-y-2", className)}>
      {header ? <p className="text-suggestion text-foreground">{header}</p> : null}
      <div className={cn(horizontal ? "flex flex-wrap gap-1.5" : "flex flex-col gap-1.5")}>
        {options.map((option) => {
          const selected = selectedId === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setDismissed(true)
                onPick?.(option.id)
              }}
              className={cn(
                "rounded-full px-3 py-1.5 text-left text-tag font-semibold",
                horizontal ? "w-auto" : "w-full",
                selected
                  ? "bg-muted text-foreground ring-1 ring-primary/40"
                  : "bg-muted text-foreground hover:bg-muted/80"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
