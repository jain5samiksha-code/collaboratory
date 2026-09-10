"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { StatusBadge, StatusLegend, StatusSwatch } from "@/components/status-badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { GOAL_COMMUNITY, GOAL_INSTITUTIONAL, GOAL_OUTPUTS, type GoalRow } from "@/lib/directory"
import { cn } from "@/lib/utils"

export function GoalsSection() {
  const [outputs, setOutputs] = useState(GOAL_OUTPUTS)
  const [institutional, setInstitutional] = useState(GOAL_INSTITUTIONAL)
  const [community, setCommunity] = useState(GOAL_COMMUNITY)
  const [outputOther, setOutputOther] = useState("")
  const [institutionalOther, setInstitutionalOther] = useState("")
  const [communityOther, setCommunityOther] = useState("")

  function toggle(list: GoalRow[], setList: (next: GoalRow[]) => void, id: string, key: "expected" | "achieved", value: boolean) {
    setList(list.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  return (
    <div className="space-y-5">
      <StatusLegend statuses={["grounded", "review", "absent"]} />

      <GoalGroup
        title="Outputs"
        rows={outputs}
        otherValue={outputOther}
        onOtherChange={setOutputOther}
        onToggle={(id, key, value) => toggle(outputs, setOutputs, id, key, value)}
      />
      <GoalGroup
        title="Institutional outcomes"
        rows={institutional}
        otherValue={institutionalOther}
        onOtherChange={setInstitutionalOther}
        onToggle={(id, key, value) => toggle(institutional, setInstitutional, id, key, value)}
      />
      <GoalGroup
        title="Impacts on community"
        rows={community}
        otherValue={communityOther}
        onOtherChange={setCommunityOther}
        onToggle={(id, key, value) => toggle(community, setCommunity, id, key, value)}
      />

      <section className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-question font-medium">How many community individuals were served by this Activity?</h2>
          <StatusBadge status="absent" />
        </div>
        <Input placeholder="Can't find any details." className="border-dashed" />
      </section>

      <section className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-question font-medium">Describe what has been learned about the community&apos;s views of this Activity</h2>
          <StatusBadge status="absent" />
        </div>
        <p className="text-body text-muted-foreground">Can&apos;t find any details.</p>
      </section>

      <section className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-question font-medium">Is there a systematic process for collecting data regarding outputs, outcomes, and impacts of this Activity?</h2>
          <StatusBadge status="absent" />
        </div>
        <div className="flex items-center gap-2">
          <Switch disabled checked={false} />
          <span className="text-body text-muted-foreground">No</span>
        </div>
      </section>
    </div>
  )
}

function GoalGroup({
  title,
  rows,
  otherValue,
  onOtherChange,
  onToggle,
}: {
  title: string
  rows: GoalRow[]
  otherValue: string
  onOtherChange: (value: string) => void
  onToggle: (id: string, key: "expected" | "achieved", value: boolean) => void
}) {
  const [open, setOpen] = useState(() => rows.some((row) => row.expected || row.achieved))
  const selected = rows.filter((row) => row.expected || row.achieved).length

  return (
    <section className="rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
      >
        <span>
          <span className="block text-body font-medium">{title}</span>
          <span className="block text-caption text-muted-foreground">{`${selected}/${rows.length} selected`}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="space-y-1.5 border-t border-border p-3">
          <div className="flex items-center justify-between gap-4 px-2.5 text-caption font-medium leading-none text-muted-foreground">
            <span>E expected · A achieved</span>
            <span className="flex gap-4">
              <span className="w-4 text-center">E</span>
              <span className="w-4 text-center">A</span>
            </span>
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "flex min-w-0 items-start justify-between gap-3 rounded-lg border px-2.5 py-2 text-body",
                (row.expected || row.achieved) && "border-gold bg-gold-soft/50"
              )}
            >
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <span className="min-w-0 whitespace-normal break-words">
                  {row.label}
                </span>
                <StatusSwatch
                  className="shrink-0"
                  status={row.origin === "source" ? "grounded" : "absent"}
                />
              </span>
              <span className="flex shrink-0 gap-4">
                <input
                  type="checkbox"
                  className="w-4"
                  checked={row.expected}
                  onChange={(event) => onToggle(row.id, "expected", event.target.checked)}
                  aria-label={`${row.label} expected`}
                />
                <input
                  type="checkbox"
                  className="w-4"
                  checked={row.achieved}
                  onChange={(event) => onToggle(row.id, "achieved", event.target.checked)}
                  aria-label={`${row.label} achieved`}
                />
              </span>
            </div>
          ))}
          {rows.some((row) => row.id === "other" && (row.expected || row.achieved)) ? (
            <Input value={otherValue} onChange={(event) => onOtherChange(event.target.value)} placeholder="Describe other" />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
