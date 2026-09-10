import { cn } from "@/lib/utils"
import type { FieldStatus } from "@/lib/types"

export const STATUS_LABEL: Record<FieldStatus, string> = {
  grounded: "In source",
  outside: "Web Search",
  review: "Needs review",
  absent: "Can't find",
  invited: "Invited",
}

export const STATUS_TONE: Record<FieldStatus, string> = {
  grounded: "bg-[#BAF7BE]",
  review: "bg-[#FFE6BD]",
  absent: "bg-[#E8E8E8]",
  outside: "bg-[#82ACF4]",
  invited: "bg-[#E0C6F5]",
}

export const STATUS_CHIP_CLASS =
  "inline-flex h-6 w-fit shrink-0 items-center justify-center overflow-hidden rounded-lg px-3 text-[13px] font-normal leading-[18px] tracking-[-0.08px] text-[#303030]"

export const STATUS_REVIEW_BAR_CLASS =
  "overflow-hidden rounded-lg border border-[#D9D9D9] bg-white"

export const STATUS_REVIEW_BAR_ROW_CLASS =
  "flex w-full items-center justify-between gap-2 px-3 py-1.5"

export const DISMISS_TAG_CLASS =
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg p-2 text-[13px] font-normal leading-[18px] tracking-[-0.08px] bg-[#2C2C2C] text-white"

export function StatusBadge({
  status,
  className,
}: {
  status: FieldStatus
  className?: string
}) {
  return (
    <span className={cn(STATUS_CHIP_CLASS, STATUS_TONE[status], className)}>
      {STATUS_LABEL[status]}
    </span>
  )
}

export function StatusSwatch({
  status,
  className,
}: {
  status: FieldStatus
  className?: string
}) {
  return (
    <span
      title={STATUS_LABEL[status]}
      aria-label={STATUS_LABEL[status]}
      className={cn("size-2.5 shrink-0 rounded-full", STATUS_TONE[status], className)}
    />
  )
}

export function StatusLegend({
  statuses = ["grounded", "review", "absent", "outside"],
  className,
}: {
  statuses?: FieldStatus[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2",
        className
      )}
    >
      {statuses.map((status) => (
        <span
          key={status}
          className="inline-flex items-center gap-2 text-[13px] font-normal leading-[18px] tracking-[-0.08px] text-[#303030]"
        >
          <span className={cn("size-2.5 rounded-full", STATUS_TONE[status])} />
          {STATUS_LABEL[status]}
        </span>
      ))}
    </div>
  )
}
