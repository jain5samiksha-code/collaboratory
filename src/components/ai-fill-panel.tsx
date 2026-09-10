"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { StatusBadge } from "@/components/status-badge"
import { SuggestionPills } from "@/components/suggestion-pills"
import { cn } from "@/lib/utils"
import type { Candidate, FieldStatus, WebSource } from "@/lib/types"

function candidateLabel(item: Candidate) {
  return item.label ?? item.fillValue ?? item.quote
}

export function AiFillPanel({
  status,
  note,
  candidates,
  chosenCandidateId,
  webSource,
  expanded = false,
  onExpand,
  onSelectQuote,
  onPickCandidate,
}: {
  status: FieldStatus
  note?: string
  candidates?: Candidate[]
  chosenCandidateId?: string
  webSource?: WebSource
  expanded?: boolean
  onExpand?: () => void
  onSelectQuote?: (spanId: string) => void
  onPickCandidate?: (candidateId: string) => void
}) {
  const options = candidates ?? []
  const hasChoice = options.length > 1
  const [open, setOpen] = useState(expanded)

  useEffect(() => {
    setOpen(expanded)
  }, [expanded])

  if (status === "grounded") return null

  if (status === "absent") {
    return (
      <div className="flex items-center border-t border-border bg-muted/30 px-3 py-2 first:border-t-0">
        <StatusBadge status={status} />
      </div>
    )
  }

  const header = webSource
    ? `Found on ${webSource.site ?? "the public web"}${webSource.name ? ` (${webSource.name})` : ""}.`
    : hasChoice
      ? "You can select option which aligns better with the article"
      : null

  return (
    <div className="border-t border-border bg-muted/30 first:border-t-0">
      <button
        type="button"
        onClick={() => {
          if (open) {
            setOpen(false)
            return
          }
          onExpand?.()
          setOpen(true)
        }}
        className="flex w-full items-center justify-between gap-2 px-3 py-2"
      >
        <StatusBadge status={status} />
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open ? (
        <div className="space-y-2 border-t border-border px-3 py-2">
          {options.length > 0 ? (
            <SuggestionPills
              header={header}
              options={options.map((item) => ({ id: item.id, label: candidateLabel(item) }))}
              selectedId={chosenCandidateId}
              onPick={(id) => {
                const item = options.find((candidate) => candidate.id === id)
                if (item?.spanId) onSelectQuote?.(item.spanId)
                onPickCandidate?.(id)
              }}
            />
          ) : webSource ? (
            <p className="text-suggestion">{header}</p>
          ) : (
            <p className="text-suggestion text-muted-foreground">
              {note && !note.toLowerCase().includes("because") ? note : "Can't find any details."}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
