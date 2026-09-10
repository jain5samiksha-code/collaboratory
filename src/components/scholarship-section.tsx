"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { StatusBadge, StatusLegend, StatusSwatch } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SuggestionPills } from "@/components/suggestion-pills"
import {
  SCHOLARSHIP_INVOLVEMENT,
  SCHOLARSHIP_TYPES,
  SCHOLARLY_PRODUCTS,
  type ScholarlyProduct,
  type ScholarshipChoice,
} from "@/lib/directory"
import { cn } from "@/lib/utils"
import type { FieldStatus } from "@/lib/types"

export function ScholarshipSection() {
  const [coursesOn, setCoursesOn] = useState(true)
  const [outsideOn, setOutsideOn] = useState(false)
  const [scholarshipOn, setScholarshipOn] = useState(true)
  const [irbOn, setIrbOn] = useState(false)
  const [coursePick, setCoursePick] = useState("course-yes")
  const [outsidePick, setOutsidePick] = useState("outside-no")
  const [involvement, setInvolvement] = useState(SCHOLARSHIP_INVOLVEMENT)
  const [types, setTypes] = useState(SCHOLARSHIP_TYPES)
  const [products, setProducts] = useState(SCHOLARLY_PRODUCTS)
  const [involvementOther, setInvolvementOther] = useState("")
  const [typeOther, setTypeOther] = useState("")
  const [productOther, setProductOther] = useState("")
  const [studentCountMode, setStudentCountMode] = useState<"estimated" | "actual">("estimated")
  const [hoursMode, setHoursMode] = useState<"estimated" | "actual">("estimated")

  function toggleChoice(
    list: ScholarshipChoice[],
    setList: (next: ScholarshipChoice[]) => void,
    id: string,
    on: boolean
  ) {
    setList(list.map((item) => (item.id === id ? { ...item, on } : item)))
  }

  function toggleProduct(id: string, key: "expected" | "achieved", value: boolean) {
    setProducts((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  return (
    <div className="space-y-5">
      <StatusLegend statuses={["grounded", "review", "absent"]} />

      <YesNoCard
        label="Is this Activity connected to one or more credit-bearing courses?"
        required
        on={coursesOn}
        onChange={setCoursesOn}
        status="review"
      >
        <SuggestionPills
          header="You can select option which aligns better with the article"
          options={[
            { id: "course-yes", label: "Yes" },
            { id: "course-452", label: "HEP 452 · Health Advocacy" },
          ]}
          selectedId={coursePick}
          onPick={setCoursePick}
        />
        <Button variant="outline" size="sm">
          Link Section
        </Button>
      </YesNoCard>

      <YesNoCard
        label="Does the Activity involve students outside of course work?"
        required
        on={outsideOn}
        onChange={(value) => {
          setOutsideOn(value)
          setOutsidePick(value ? "outside-yes" : "outside-no")
        }}
        status="review"
      >
        <SuggestionPills
          options={[
            { id: "outside-no", label: "No" },
            { id: "outside-yes", label: "Yes" },
          ]}
          selectedId={outsidePick}
          onPick={(id) => {
            setOutsidePick(id)
            setOutsideOn(id === "outside-yes")
          }}
        />
        <ChoiceGroup
          title="Student involvement"
          items={involvement}
          otherValue={involvementOther}
          onOtherChange={setInvolvementOther}
          onToggle={(id, on) => toggleChoice(involvement, setInvolvement, id, on)}
        />
        <CountField
          label="How many non-enrolled students per term?"
          mode={studentCountMode}
          onModeChange={setStudentCountMode}
        />
        <CountField
          label="How many hours per non-enrolled student per term?"
          mode={hoursMode}
          onModeChange={setHoursMode}
        />
      </YesNoCard>

      <YesNoCard
        label="Is this Activity directly connected to scholarship?"
        required
        on={scholarshipOn}
        onChange={setScholarshipOn}
        status="grounded"
      />

      {scholarshipOn ? (
        <>
          <ChoiceGroup
            title="Scholarship type(s)"
            items={types}
            otherValue={typeOther}
            onOtherChange={setTypeOther}
            onToggle={(id, on) => toggleChoice(types, setTypes, id, on)}
          />
          <ProductGroup
            items={products}
            otherValue={productOther}
            onOtherChange={setProductOther}
            onToggle={toggleProduct}
          />
        </>
      ) : null}

      <YesNoCard
        label="Does this Activity have an IRB protocol?"
        required
        on={irbOn}
        onChange={setIrbOn}
        status="absent"
      />
    </div>
  )
}

function YesNoCard({
  label,
  required,
  on,
  onChange,
  status,
  children,
}: {
  label: string
  required?: boolean
  on: boolean
  onChange: (value: boolean) => void
  status: FieldStatus
  children?: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-question font-semibold">
        {required ? <span className="text-primary">*</span> : null}
        {label}
      </Label>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[1fr_auto] divide-x divide-border">
          <div className="px-3 py-2">
            <p className="text-body">{on ? "Yes" : "No"}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <Switch checked={on} onCheckedChange={onChange} />
            <span className="text-body font-medium">{on ? "Yes" : "No"}</span>
          </div>
        </div>
        <StatusExpand status={status}>{children}</StatusExpand>
      </div>
    </div>
  )
}

function StatusExpand({
  status,
  children,
}: {
  status: FieldStatus
  children?: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const expandable = status === "review" || status === "outside"

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
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div className="space-y-3 border-t border-border px-3 py-2">{children}</div>
      ) : null}
    </div>
  )
}

function ChoiceGroup({
  title,
  items,
  otherValue,
  onOtherChange,
  onToggle,
}: {
  title: string
  items: ScholarshipChoice[]
  otherValue: string
  onOtherChange: (value: string) => void
  onToggle: (id: string, on: boolean) => void
}) {
  const [open, setOpen] = useState(() => items.some((item) => item.on))
  const selected = items.filter((item) => item.on).length

  return (
    <section className="rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
      >
        <span>
          <span className="block text-body font-medium">{title}</span>
          <span className="block text-caption text-muted-foreground">{`${selected}/${items.length} selected`}</span>
        </span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="grid grid-cols-1 gap-1.5 border-t border-border p-3">
          {items.map((item) => (
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
                  onChange={(event) => onToggle(item.id, event.target.checked)}
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
          ))}
          {items.some((item) => item.id === "other" && item.on) ? (
            <Input
              value={otherValue}
              onChange={(event) => onOtherChange(event.target.value)}
              placeholder="Describe other"
              className="sm:col-span-2"
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function ProductGroup({
  items,
  otherValue,
  onOtherChange,
  onToggle,
}: {
  items: ScholarlyProduct[]
  otherValue: string
  onOtherChange: (value: string) => void
  onToggle: (id: string, key: "expected" | "achieved", value: boolean) => void
}) {
  const [open, setOpen] = useState(() => items.some((item) => item.expected || item.achieved))
  const selected = items.filter((item) => item.expected || item.achieved).length

  return (
    <section className="rounded-xl border border-border">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
      >
        <span>
          <span className="block text-body font-medium">Scholarly product(s)</span>
          <span className="block text-caption text-muted-foreground">{`${selected}/${items.length} selected`}</span>
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
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex min-w-0 items-start justify-between gap-3 rounded-lg border px-2.5 py-2 text-body",
                (item.expected || item.achieved) && "border-gold bg-gold-soft/50"
              )}
            >
              <span className="flex min-w-0 flex-1 items-start gap-2">
                <span className="min-w-0 whitespace-normal break-words">
                  {item.label}
                </span>
                <StatusSwatch
                  className="shrink-0"
                  status={item.origin === "source" ? "grounded" : "absent"}
                />
              </span>
              <span className="flex shrink-0 gap-4">
                <input
                  type="checkbox"
                  className="w-4"
                  checked={item.expected}
                  onChange={(event) => onToggle(item.id, "expected", event.target.checked)}
                  aria-label={`${item.label} expected`}
                />
                <input
                  type="checkbox"
                  className="w-4"
                  checked={item.achieved}
                  onChange={(event) => onToggle(item.id, "achieved", event.target.checked)}
                  aria-label={`${item.label} achieved`}
                />
              </span>
            </div>
          ))}
          {items.some((item) => item.id === "other" && (item.expected || item.achieved)) ? (
            <Input value={otherValue} onChange={(event) => onOtherChange(event.target.value)} placeholder="Describe other" />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

function CountField({
  label,
  mode,
  onModeChange,
}: {
  label: string
  mode: "estimated" | "actual"
  onModeChange: (value: "estimated" | "actual") => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-question font-medium">{label}</p>
        <StatusSwatch status="absent" />
      </div>
      <div className="flex flex-wrap gap-3 text-body">
        {(["estimated", "actual"] as const).map((option) => (
          <label key={option} className="inline-flex items-center gap-1.5 capitalize">
            <input
              type="radio"
              name={label}
              checked={mode === option}
              onChange={() => onModeChange(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <Input placeholder="Can't find any details." className="border-dashed" />
    </div>
  )
}
