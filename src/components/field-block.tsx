"use client"

import { useRef, useState } from "react"
import { Bold, HelpCircle, ImageIcon, Italic, Link2, List, ListOrdered, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AiFillPanel } from "@/components/ai-fill-panel"
import { cn } from "@/lib/utils"
import type { ExtractedField, FieldStatus } from "@/lib/types"

export type FieldDraft = {
  value: string
  status: FieldStatus
  chosenCandidateId?: string
}

export function FieldBlock({
  field,
  draft,
  active,
  onSelect,
  onChange,
  onPickCandidate,
  onPinSpan,
}: {
  field: ExtractedField
  draft: FieldDraft
  active: boolean
  onSelect: () => void
  onChange: (value: string) => void
  onAccept?: () => void
  onBlank?: () => void
  onPickCandidate: (candidateId: string) => void
  onPinSpan?: (spanId: string) => void
}) {
  const status = draft.status
  const details =
    status === "grounded" || field.type === "image" ? null : (
      <AiFillPanel
        status={status}
        note={field.note}
        candidates={field.candidates}
        chosenCandidateId={draft.chosenCandidateId}
        webSource={field.webSource}
        expanded={active}
        onExpand={onSelect}
        onSelectQuote={(spanId) => {
          onSelect()
          if (spanId) onPinSpan?.(spanId)
        }}
        onPickCandidate={onPickCandidate}
      />
    )

  return (
    <div className={cn("space-y-2", active && "rounded-xl bg-accent/40 p-3 -mx-3 ring-1 ring-primary/15")}>
      <Label htmlFor={field.id} className="text-question font-semibold">
        {field.required ? <span className="text-primary">*</span> : null}
        {field.label}
      </Label>

      {field.type === "image" ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <ImageDropzone
            id={field.id}
            value={draft.value}
            onSelect={onSelect}
            onChange={onChange}
          />
          {field.candidates && field.candidates.length > 0 ? (
            <ImageSuggestionPicker
              options={field.candidates.map((item) => ({
                id: item.id,
                src: item.fillValue ?? "",
                label: item.label ?? item.quote,
              }))}
              selectedId={draft.chosenCandidateId}
              onPick={(id) => {
                const item = field.candidates?.find((candidate) => candidate.id === id)
                onSelect()
                if (item?.spanId) onPinSpan?.(item.spanId)
                onPickCandidate(id)
              }}
            />
          ) : null}
        </div>
      ) : field.type === "textarea" ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1">
            <ToolbarIcon icon={Bold} />
            <ToolbarIcon icon={Italic} />
            <ToolbarIcon icon={List} />
            <ToolbarIcon icon={ListOrdered} />
            <ToolbarIcon icon={Link2} />
            <ToolbarIcon icon={HelpCircle} />
          </div>
          <Textarea
            id={field.id}
            value={draft.value}
            placeholder={field.placeholder ?? "Describe the activity."}
            onFocus={onSelect}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-28 rounded-none border-0 text-body focus-visible:ring-0"
          />
          {details}
        </div>
      ) : field.type === "toggle" ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center gap-2 px-3 py-2">
            <Switch
              id={field.id}
              checked={draft.value === "true"}
              onCheckedChange={(checked) => {
                onSelect()
                onChange(checked ? "true" : "false")
              }}
            />
            <span className="text-body text-muted-foreground">Private</span>
          </div>
          {details}
        </div>
      ) : field.type === "select" ? (
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex flex-wrap gap-1.5 p-3">
            {field.options?.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onSelect()
                  onChange(option)
                }}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-tag leading-none",
                  draft.value === option
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                )}
              >
                {option}
              </button>
            ))}
          </div>
          {details}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Input
            id={field.id}
            type={field.type === "number" ? "text" : field.type}
            value={draft.value}
            placeholder={field.placeholder}
            onFocus={onSelect}
            onChange={(event) => onChange(event.target.value)}
            className="rounded-none border-0 text-body focus-visible:ring-0"
          />
          {details}
        </div>
      )}
    </div>
  )
}

function ToolbarIcon({ icon: Icon }: { icon: typeof Bold }) {
  return (
    <span className="flex size-6 items-center justify-center rounded text-muted-foreground">
      <Icon className="size-3.5" />
    </span>
  )
}

function ImageSuggestionPicker({
  options,
  selectedId,
  onPick,
}: {
  options: { id: string; src: string; label: string }[]
  selectedId?: string
  onPick?: (id: string) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="border-t border-border px-3 py-2">
      <p className="text-suggestion text-foreground">
        {options.length > 1
          ? "Select the option that aligns better with the article"
          : "In the article."}
      </p>
      <div className={cn("mt-3 grid gap-3", options.length > 1 ? "grid-cols-2" : "grid-cols-1")}>
        {options.map((option) => {
          const selected = selectedId === option.id
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onPick?.(option.id)}
              className={cn(
                "overflow-hidden rounded-lg border text-left transition-colors",
                selected
                  ? "border-primary bg-muted ring-1 ring-primary/40"
                  : "border-border bg-muted/30 hover:bg-muted/60"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={option.src} alt={option.label} className="aspect-video w-full object-cover" />
              <span className="block px-2 py-1.5 text-caption font-semibold leading-none">{option.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ImageDropzone({
  id,
  value,
  onSelect,
  onChange,
}: {
  id: string
  value: string
  onSelect: () => void
  onChange: (value: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function applyFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      onClick={() => {
        onSelect()
        inputRef.current?.click()
      }}
      onDragEnter={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        setDragging(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragging(false)
        onSelect()
        applyFile(event.dataTransfer.files[0])
      }}
      className={cn(
        "m-3 flex min-h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
        dragging ? "border-primary bg-accent" : "border-border bg-muted/30"
      )}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => applyFile(event.target.files?.[0])}
      />
      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Activity" className="block max-h-40 rounded-md object-contain" />
          <button
            type="button"
            aria-label="Remove image"
            onClick={(event) => {
              event.stopPropagation()
              onChange("")
              if (inputRef.current) inputRef.current.value = ""
            }}
            className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/70 text-white shadow-sm transition-colors hover:bg-black/90"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "flex size-12 items-center justify-center rounded-xl border border-dashed",
              dragging ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
            )}
          >
            {dragging ? <Upload className="size-5" /> : <ImageIcon className="size-5" />}
          </span>
          <p className="text-body font-medium">Drag and drop an image here</p>
          <p className="text-caption text-muted-foreground">or click to browse · PNG, JPG, GIF</p>
        </>
      )}
    </div>
  )
}

export function ContactNameBlock({
  first,
  last,
  firstDraft,
  lastDraft,
  active,
  onSelect,
  onChangeFirst,
  onChangeLast,
  onPickCandidate,
  onPinSpan,
}: {
  first: ExtractedField
  last: ExtractedField
  firstDraft: FieldDraft
  lastDraft: FieldDraft
  active: boolean
  onSelect: (id: string) => void
  onChangeFirst: (value: string) => void
  onChangeLast: (value: string) => void
  onAccept?: () => void
  onBlank?: () => void
  onPickCandidate?: (candidateId: string) => void
  onPinSpan?: (spanId: string) => void
}) {
  const status = firstDraft.status

  return (
    <div className={cn(active && "rounded-xl bg-accent/40 p-3 -mx-3 ring-1 ring-primary/15")}>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 divide-x divide-border">
          <div className="px-3 py-2">
            <Label htmlFor={first.id} className="text-question font-medium">
              First Name
            </Label>
            <Input
              id={first.id}
              value={firstDraft.value}
              placeholder={first.placeholder}
              onFocus={() => onSelect(first.id)}
              onChange={(event) => onChangeFirst(event.target.value)}
              className="h-8 rounded-none border-0 px-0 text-body focus-visible:ring-0"
            />
          </div>
          <div className="px-3 py-2">
            <Label htmlFor={last.id} className="text-question font-medium">
              Last Name
            </Label>
            <Input
              id={last.id}
              value={lastDraft.value}
              placeholder={last.placeholder}
              onFocus={() => onSelect(last.id)}
              onChange={(event) => onChangeLast(event.target.value)}
              className="h-8 rounded-none border-0 px-0 text-body focus-visible:ring-0"
            />
          </div>
        </div>
        {status === "grounded" ? null : (
          <AiFillPanel
            status={status}
            note={first.note}
            candidates={first.candidates}
            chosenCandidateId={firstDraft.chosenCandidateId}
            expanded={active}
            onExpand={() => onSelect(first.id)}
            onSelectQuote={(spanId) => {
              onSelect(first.id)
              if (spanId) onPinSpan?.(spanId)
            }}
            onPickCandidate={onPickCandidate}
          />
        )}
      </div>
    </div>
  )
}

export function ContactWithPrivateBlock({
  field,
  draft,
  privacy,
  privacyDraft,
  active,
  onSelect,
  onChange,
  onChangePrivacy,
  onPickCandidate,
  onPinSpan,
}: {
  field: ExtractedField
  draft: FieldDraft
  privacy: ExtractedField
  privacyDraft: FieldDraft
  active: boolean
  onSelect: (id: string) => void
  onChange: (value: string) => void
  onChangePrivacy: (value: string) => void
  onPickCandidate?: (candidateId: string) => void
  onPinSpan?: (spanId: string) => void
}) {
  const status = draft.status
  const hideWeb = field.id === "contactEmail" && status !== "outside"

  return (
    <div className={cn(active && "rounded-xl bg-accent/40 p-3 -mx-3 ring-1 ring-primary/15")}>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-[1fr_auto] divide-x divide-border">
          <div className="px-3 py-2">
            <Label htmlFor={field.id} className="text-question font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type === "email" ? "email" : "tel"}
              value={draft.value}
              placeholder={field.placeholder}
              onFocus={() => onSelect(field.id)}
              onChange={(event) => onChange(event.target.value)}
              className="h-8 rounded-none border-0 px-0 text-body focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2 px-3 py-2">
            <Switch
              id={privacy.id}
              checked={privacyDraft.value === "true"}
              onCheckedChange={(checked) => {
                onSelect(field.id)
                onChangePrivacy(checked ? "true" : "false")
              }}
            />
            <Label htmlFor={privacy.id} className="text-question font-medium">
              Private
            </Label>
          </div>
        </div>
        {status === "grounded" ? null : (
          <AiFillPanel
            status={status}
            note={hideWeb ? "Can't find any details." : field.note}
            candidates={hideWeb ? undefined : field.candidates}
            chosenCandidateId={draft.chosenCandidateId}
            webSource={hideWeb ? undefined : field.webSource}
            expanded={active}
            onExpand={() => onSelect(field.id)}
            onSelectQuote={(spanId) => {
              onSelect(field.id)
              if (spanId) onPinSpan?.(spanId)
            }}
            onPickCandidate={onPickCandidate}
          />
        )}
      </div>
    </div>
  )
}
