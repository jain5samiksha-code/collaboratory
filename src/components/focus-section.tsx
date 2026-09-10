"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown, X } from "lucide-react"
import { StatusBadge, DISMISS_TAG_CLASS, StatusLegend, StatusSwatch } from "@/components/status-badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FOCUS_TAGS, type FocusTag } from "@/lib/directory"
import { cn } from "@/lib/utils"
import { SuggestionPills } from "@/components/suggestion-pills"
import type { FieldStatus } from "@/lib/types"

const LOCATION_OPTIONS = [
  { id: "loc-az", label: "Arizona neighborhoods", origin: "source" as const },
  { id: "loc-gov", label: "Local city and county governments", origin: "source" as const },
]

const LOCATION_TYPE_LABEL = {
  physical: "Physical",
  virtual: "Virtual",
  both: "Both",
} as const

type LocationType = keyof typeof LOCATION_TYPE_LABEL

export function FocusSection() {
  const [groups, setGroups] = useState(FOCUS_TAGS)
  const [location, setLocation] = useState<LocationType>("physical")
  const [locationPicks, setLocationPicks] = useState<string[]>(["loc-az"])
  const [query, setQuery] = useState("")

  const filter = query.trim().toLowerCase()

  function toggleTag(groupIndex: number, itemIndex: number, on: boolean) {
    setGroups((current) =>
      current.map((entry, i) =>
        i === groupIndex
          ? {
              ...entry,
              items: entry.items.map((tag, j) => (j === itemIndex ? { ...tag, on } : tag)),
            }
          : entry
      )
    )
  }

  function removeLocationPick(id: string) {
    setLocationPicks((current) => current.filter((item) => item !== id))
  }

  const selectedLocations = LOCATION_OPTIONS.filter((item) => locationPicks.includes(item.id))
  const suggestionOptions = LOCATION_OPTIONS.filter((item) => !locationPicks.includes(item.id))

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <StatusLegend statuses={["grounded", "review", "absent"]} />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter focus fields"
        />
      </div>

      <QuestionCard
        label="Where does this activity take place?"
        required
        status="review"
        answer={
          <div className="space-y-2">
            <p className="text-body">{LOCATION_TYPE_LABEL[location]}</p>
            {selectedLocations.length ? (
              <div className="flex flex-wrap gap-1.5">
                <SelectedChips items={selectedLocations} onRemove={removeLocationPick} />
              </div>
            ) : null}
          </div>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(LOCATION_TYPE_LABEL) as LocationType[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setLocation(option)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-tag leading-none capitalize",
                location === option
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              )}
            >
              {option}
            </button>
          ))}
        </div>
        {location !== "virtual" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-question">Event address</Label>
              <Input placeholder="Can't find any details." className="border-dashed" />
            </div>
            <div className="space-y-1">
              <Label className="text-question">Community partner address</Label>
              <Input placeholder="Can't find any details." className="border-dashed" />
            </div>
          </div>
        ) : null}
        {location !== "physical" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-question">Virtual title</Label>
              <Input placeholder="Can't find any details." className="border-dashed" />
            </div>
            <div className="space-y-1">
              <Label className="text-question">Virtual URL</Label>
              <Input placeholder="Can't find any details." className="border-dashed" />
            </div>
          </div>
        ) : null}
        {suggestionOptions.length ? (
          <SuggestionPills
            options={suggestionOptions}
            onPick={(id) =>
              setLocationPicks((current) => (current.includes(id) ? current : [...current, id]))
            }
          />
        ) : null}
      </QuestionCard>

      {groups.map((group, groupIndex) => {
        const groupSelected = group.items.filter((item) => item.on)
        const filtered = group.items.filter((item) => item.label.toLowerCase().includes(filter))
        if (filter && filtered.length === 0) return null

        const hasSource = group.items.some((item) => item.origin === "source")
        const status: FieldStatus = hasSource || groupSelected.length > 0 ? "review" : "absent"
        const label =
          group.group === "Target population" ? "Who is this activity for?" : group.group

        return (
          <QuestionCard
            key={group.group}
            label={label}
            required={group.group === "Target population"}
            status={status}
            forceOpen={Boolean(filter)}
            answer={
              groupSelected.length ? (
                <div className="flex flex-wrap items-center gap-1.5">
                  <SelectedChips
                    items={groupSelected}
                    onRemove={(id) => {
                      const itemIndex = group.items.findIndex((tag) => tag.id === id)
                      toggleTag(groupIndex, itemIndex, false)
                    }}
                  />
                  <span className="text-caption text-muted-foreground">
                    {groupSelected.length} selected
                  </span>
                </div>
              ) : (
                <p className="text-body text-muted-foreground">Can&apos;t find any details.</p>
              )
            }
          >
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {(filter ? filtered : group.items).map((item) => {
                const itemIndex = group.items.findIndex((tag) => tag.id === item.id)
                return (
                  <label
                    key={item.id}
                    className={cn(
                      "flex min-w-0 items-start justify-between gap-2 rounded-lg border px-2.5 py-2 text-body",
                      item.on && "border-gold bg-gold-soft/50"
                    )}
                  >
                    <span className="flex min-w-0 flex-1 items-start gap-2">
                      <input
                        type="checkbox"
                        className="mt-0.5 shrink-0"
                        checked={item.on}
                        onChange={(event) => toggleTag(groupIndex, itemIndex, event.target.checked)}
                      />
                      <span className="min-w-0 whitespace-normal break-words">
                        {item.label}
                      </span>
                    </span>
                    <StatusSwatch
                      className="shrink-0"
                      status={item.origin === "source" ? "grounded" : "absent"}
                    />
                  </label>
                )
              })}
            </div>
          </QuestionCard>
        )
      })}
    </div>
  )
}

function QuestionCard({
  label,
  required,
  status,
  answer,
  forceOpen,
  children,
}: {
  label: string
  required?: boolean
  status: FieldStatus
  answer: ReactNode
  forceOpen?: boolean
  children?: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-question font-semibold">
        {required ? <span className="text-primary">*</span> : null}
        {label}
      </Label>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="px-3 py-2">
          {answer}
        </div>
        <StatusExpand status={status} forceOpen={forceOpen}>
          {children}
        </StatusExpand>
      </div>
    </div>
  )
}

function StatusExpand({
  status,
  forceOpen,
  children,
}: {
  status: FieldStatus
  forceOpen?: boolean
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const expandable = status === "review" || status === "outside" || Boolean(children)
  const showDetails = forceOpen || open

  if (status === "grounded") return null

  if (!expandable) {
    return (
      <div className="flex items-center border-t border-border bg-muted/30 px-3 py-2">
        <StatusBadge status={status} />
      </div>
    )
  }

  return (
    <div className="border-t border-border bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2"
      >
        <StatusBadge status={status} />
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", showDetails && "rotate-180")}
        />
      </button>
      {showDetails ? (
        <div className="space-y-3 border-t border-border px-3 py-2">{children}</div>
      ) : null}
    </div>
  )
}

function SelectedChips({
  items,
  onRemove,
}: {
  items: Pick<FocusTag, "id" | "label" | "origin">[]
  onRemove: (id: string) => void
}) {
  return (
    <>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onRemove(item.id)}
          className={DISMISS_TAG_CLASS}
          title="Remove"
        >
          {item.label}
          <X className="size-4 text-[#F5F5F5]" strokeWidth={1} />
        </button>
      ))}
    </>
  )
}
