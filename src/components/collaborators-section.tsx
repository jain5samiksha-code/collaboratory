"use client"

import { useState } from "react"
import { Check, ChevronDown, CircleMinus, Clock, Info, Send, Star, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SuggestionPills } from "@/components/suggestion-pills"
import {
  StatusBadge,
  STATUS_CHIP_CLASS,
  STATUS_REVIEW_BAR_CLASS,
  STATUS_REVIEW_BAR_ROW_CLASS,
} from "@/components/status-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DIRECTORY_MATCHES,
  displaySubtitle,
  kindLabel,
  searchDirectory,
  type DirectoryMatch,
  type EntityKind,
} from "@/lib/directory"
import { entityInitials, entityLogo } from "@/lib/entity-logos"
import { fieldById } from "@/lib/fields"
import { cn } from "@/lib/utils"
import type { FieldStatus } from "@/lib/types"

const ORG_ROLES_LEFT = [
  "Identify areas of need",
  "Negotiate costs and logistics",
  "Assist in raising funds for the activity",
  "Co-investigator",
  "Evaluate or provide feedback on students' work",
  "Manage the event or activity",
  "Promote event to target populations",
  "Provide access to target populations",
  "Provide information materials",
  "Supervise the activity",
  "Other",
]

const ORG_ROLES_RIGHT = [
  "Set goals",
  "Identify expected measures, benefits, or outcomes",
  "Co-educate students",
  "Discuss how to work together",
  "Evaluate or provide feedback on the process or relationship of the partners",
  "Measure the impact of the activity on the community",
  "Provide access to data",
  "Provide funds for the activity",
  "Provide volunteer site or space",
  "Supervise students",
]

function matchStatus(match: DirectoryMatch): FieldStatus {
  if (match.status === "invited") return "invited"
  if (match.status === "direct") return "grounded"
  if (match.note.startsWith("Can't find")) return "absent"
  return "review"
}

function hasFillableBody(match: DirectoryMatch) {
  return (
    match.kind === "faculty" ||
    match.kind === "organization" ||
    match.kind === "institution"
  )
}

type ExpandMode = "none" | "content" | "review"

function paneExpandMode(
  match: DirectoryMatch,
  status: FieldStatus,
  showSuggestions: boolean
): ExpandMode {
  if (status === "absent") return "none"

  const needsReviewAction =
    showSuggestions || status === "review" || match.status === "invite"

  if (needsReviewAction) return "review"
  if (status === "invited" && hasFillableBody(match)) return "review"
  if (status === "grounded" && hasFillableBody(match)) return "content"
  return "none"
}

function splitName(name?: string) {
  if (!name) return { first: "", last: "" }
  const space = name.indexOf(" ")
  if (space < 0) return { first: name, last: "" }
  return { first: name.slice(0, space), last: name.slice(space + 1) }
}

function contactEmailReview(match: DirectoryMatch) {
  const email = match.record?.email?.trim()
  if (!email) return null
  const field = fieldById("contactEmail")
  if (!field || field.origin !== "web" || field.value !== email) return null
  const quotes = (field.candidates ?? [])
    .map((item) => ({
      id: item.id,
      label: item.quote || item.fillValue || email,
    }))
    .filter((item) => item.label)
  return {
    status: field.status,
    note: field.note,
    quotes: quotes.length > 0 ? quotes : [{ id: `${match.id}-email-found`, label: email }],
  }
}

type ApprovalTagState = "approved" | "in-queue" | "invite-sent"

function approvalTagState(match: DirectoryMatch): ApprovalTagState {
  if (match.status === "invited") return "invite-sent"
  if (match.status === "invite") return "in-queue"
  if (match.status === "direct" && match.record?.approved) return "approved"
  return "in-queue"
}

const APPROVAL_TAG_LABEL: Record<ApprovalTagState, string> = {
  approved: "Approved",
  "in-queue": "In queue",
  "invite-sent": "Invite sent",
}

const APPROVAL_TAG_ICON: Record<ApprovalTagState, typeof Check> = {
  approved: Check,
  "in-queue": Clock,
  "invite-sent": Send,
}

const APPROVAL_TAG_OUTLINE: Record<ApprovalTagState, string> = {
  approved: "border-[#6BCB77]",
  "in-queue": "border-[#D4A843]",
  "invite-sent": "border-[#D4A843]",
}

function ApprovalTag({ match }: { match: DirectoryMatch }) {
  const state = approvalTagState(match)
  const Icon = APPROVAL_TAG_ICON[state]

  return (
    <span
      className={cn(
        STATUS_CHIP_CLASS,
        "w-fit gap-1.5 self-start border bg-transparent",
        APPROVAL_TAG_OUTLINE[state]
      )}
    >
      <Icon className="size-3.5 shrink-0" strokeWidth={2} />
      {APPROVAL_TAG_LABEL[state]}
    </span>
  )
}

const entityMarkClass =
  "size-[4.5rem] min-w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-white"

function EntityMark({ match }: { match: DirectoryMatch }) {
  const logo = entityLogo(match)
  const [failed, setFailed] = useState(false)
  const initials = logo.type === "image" ? logo.initials : logo.label

  if (logo.type === "initials" || failed) {
    return (
      <span
        className={cn(
          "flex items-center justify-center border border-[#D9D9D9] bg-[#F5F5F5] text-[15px] font-semibold tracking-tight text-[#303030]",
          entityMarkClass
        )}
        aria-hidden
      >
        {initials}
      </span>
    )
  }

  return (
    <span className={cn("flex items-center justify-center border border-[#E8E8E8]", entityMarkClass)} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt=""
        className="size-full object-contain p-1.5"
        onError={() => setFailed(true)}
      />
    </span>
  )
}

const detailInputClass =
  "h-10 rounded-lg border-[#D9D9D9] bg-white px-4 py-3 text-body placeholder:text-[#B3B3B3]"

function DetailField({
  id,
  label,
  type = "text",
  defaultValue,
  value,
  onChange,
  className,
}: {
  id: string
  label: string
  type?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-question font-normal text-[#1E1E1E]">
        {label}
      </Label>
      {onChange ? (
        <Input
          id={id}
          type={type}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Can't find any details."
          className={detailInputClass}
        />
      ) : (
        <Input
          id={id}
          type={type}
          defaultValue={defaultValue}
          placeholder="Can't find any details."
          className={detailInputClass}
        />
      )}
    </div>
  )
}

function NestedReview({
  status,
  note,
  quotes,
  open,
  onToggle,
  onPick,
}: {
  status: FieldStatus
  note: string
  quotes: { id: string; label: string }[]
  open: boolean
  onToggle: () => void
  onPick?: (id: string) => void
}) {
  return (
    <div className={STATUS_REVIEW_BAR_CLASS}>
      <button
        type="button"
        onClick={onToggle}
        className={STATUS_REVIEW_BAR_ROW_CLASS}
        aria-expanded={open}
      >
        <StatusBadge status={status} />
        <ChevronDown className={cn("size-4 text-[#1E1E1E] transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div className="space-y-2 border-t border-[#D9D9D9] px-3 py-2">
          <p className="text-suggestion text-[#1E1E1E]">{note}</p>
          <SuggestionPills
            header={null}
            options={quotes}
            onPick={onPick}
          />
        </div>
      ) : null}
    </div>
  )
}

export function CollaboratorsSection({
  activeId,
  onSelect,
}: {
  activeId: string | null
  onSelect: (match: DirectoryMatch) => void
}) {
  const [matches, setMatches] = useState(DIRECTORY_MATCHES)
  const [picker, setPicker] = useState<DirectoryMatch | null>(null)
  const [invite, setInvite] = useState<DirectoryMatch | null>(null)
  const [inviteFirstName, setInviteFirstName] = useState("")
  const [inviteLastName, setInviteLastName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [invitePhone, setInvitePhone] = useState("")
  const [query, setQuery] = useState("")
  const [openIds, setOpenIds] = useState<string[]>(() =>
    DIRECTORY_MATCHES.filter((item) => {
      const status = matchStatus(item)
      const showSuggestions = status === "review" && item.status === "invite"
      return paneExpandMode(item, status, showSuggestions) === "review"
    }).map((item) => item.id)
  )
  const [resolvedIds, setResolvedIds] = useState<string[]>([])
  const [funded, setFunded] = useState(false)

  function resolveSuggestion(id: string) {
    setResolvedIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  function toggleOpen(id: string) {
    setOpenIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  const groups: EntityKind[] = ["unit", "program", "faculty", "organization", "institution"]

  function remove(id: string) {
    setMatches((current) => current.filter((item) => item.id !== id))
  }

  function resetInviteForm() {
    setInviteFirstName("")
    setInviteLastName("")
    setInviteEmail("")
    setInvitePhone("")
  }

  function closeInvite() {
    setInvite(null)
    resetInviteForm()
  }

  function openInvite(match: DirectoryMatch) {
    resetInviteForm()
    setInvite(match)
  }

  function markInvited(
    match: DirectoryMatch,
    contact: { firstName: string; lastName: string; email: string; phone: string }
  ) {
    const entityName = match.record?.name ?? match.query
    const invited: DirectoryMatch = {
      ...match,
      status: "invited",
      note: "Invite sent. Waiting for them to register.",
      record: {
        id: match.record?.id ?? match.id,
        kind: match.kind,
        name: entityName,
        subtitle: match.record?.subtitle,
        email: contact.email.trim() || undefined,
        phone: contact.phone.trim() || undefined,
        contactFirstName: contact.firstName.trim() || undefined,
        contactLastName: contact.lastName.trim() || undefined,
        approved: match.record?.approved ?? false,
      },
    }
    setMatches((current) => {
      const exists = current.some((item) => item.id === match.id)
      if (exists) {
        return current.map((item) => (item.id === match.id ? invited : item))
      }
      return [...current, { ...invited, id: `invited-${match.kind}-${Date.now()}` }]
    })
    resolveSuggestion(match.id)
    closeInvite()
    toast.message(`Invited ${entityName}`)
  }

  function selectRecord(match: DirectoryMatch, recordId: string) {
    const results = searchDirectory(match.kind, query || match.query)
    const record = results.find((item) => item.id === recordId) ?? match.record
    setMatches((current) =>
      current.map((item) =>
        item.id === match.id
          ? { ...item, status: "direct", record, note: "Direct match in Collaboratory." }
          : item
      )
    )
    resolveSuggestion(match.id)
    setPicker(null)
    toast.success(`Linked ${record?.name}`)
  }

  return (
    <div className="space-y-8">
      {groups.map((kind) => {
        const items = matches.filter((item) => item.kind === kind)
        const required = kind === "organization"
        return (
          <section key={kind} className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-1.5 text-h2 font-medium">
                {required ? <span className="text-primary">*</span> : null}
                {kind === "organization"
                  ? "Community Organizations"
                  : kind === "institution"
                    ? "Other Institutions"
                    : kind === "unit"
                      ? "Units"
                      : kind === "program"
                        ? "Programs / Initiatives"
                        : "Faculty / Staff"}
                <Info className="size-3.5 text-[#3b82f6]" />
              </h2>
            </div>
            {items.map((match) => {
              const status = matchStatus(match)
              const showSuggestions =
                status === "review" && match.status === "invite" && !resolvedIds.includes(match.id)
              const expandMode = paneExpandMode(match, status, showSuggestions)
              const expandable = expandMode !== "none"
              const expanded = expandable && openIds.includes(match.id)
              return (
                <EntityPane
                  key={match.id}
                  match={match}
                  status={status}
                  expandMode={expandMode}
                  expanded={expanded}
                  active={activeId === match.id}
                  showSuggestions={showSuggestions}
                  onSelect={() => onSelect(match)}
                  onToggle={() => toggleOpen(match.id)}
                  onRemove={() => {
                    resolveSuggestion(match.id)
                    remove(match.id)
                  }}
                  onInvite={() => openInvite(match)}
                  onLeaveOff={() => {
                    resolveSuggestion(match.id)
                    remove(match.id)
                  }}
                />
              )
            })}
            <Button
              className="bg-[#4a4a4a] text-white hover:bg-[#3a3a3a]"
              onClick={() =>
                setPicker({
                  id: `new-${kind}`,
                  kind,
                  label: kindLabel(kind),
                  query: "",
                  spanIds: [],
                  status: "invite",
                  note: "Search Collaboratory, or invite if missing.",
                  why: "",
                })
              }
            >
              Add Another{" "}
              {kind === "organization"
                ? "Community Organization"
                : kind === "institution"
                  ? "Institution"
                  : kind === "unit"
                    ? "Unit"
                    : kind === "program"
                      ? "Program"
                      : "Faculty / Staff"}
            </Button>
          </section>
        )
      })}

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="flex items-center gap-1.5 text-question font-medium">
            Is the Activity funded?
          </h2>
          <Switch checked={funded} onCheckedChange={setFunded} />
          <span className="text-body text-muted-foreground">{funded ? "Yes" : "No"}</span>
          {!funded ? <StatusBadge status="absent" /> : null}
        </div>
        {!funded ? (
          <p className="text-body text-muted-foreground">No details found</p>
        ) : (
          <div className="space-y-4 rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <Label className="flex items-center gap-1.5 text-question font-medium">
                  Funder
                  <Info className="size-3.5 text-[#3b82f6]" />
                </Label>
                <Input placeholder="Funder name" />
              </div>
              <Button variant="ghost" size="icon-xs" aria-label="Remove funder">
                <CircleMinus />
              </Button>
            </div>
            <div className="space-y-1.5">
              <p className="text-question font-medium">Source type</p>
              <div className="flex flex-wrap gap-4 text-body">
                <label className="flex items-center gap-2">
                  <input type="radio" name="fund-source" defaultChecked />
                  Internal to University
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="fund-source" />
                  External
                </label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-question font-medium">Total Amount</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-body text-muted-foreground">
                  $
                </span>
                <Input className="pl-6" placeholder="0.00" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-question font-medium">Activity Start Date</Label>
                <Input placeholder="mm/yyyy" />
              </div>
              <div className="space-y-1">
                <Label className="text-question font-medium">Activity End Date</Label>
                <Input placeholder="mm/yyyy" />
              </div>
            </div>
          </div>
        )}
      </section>

      <Dialog open={Boolean(picker)} onOpenChange={(open) => !open && setPicker(null)}>
        <DialogContent className="sm:max-w-lg" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-primary">
              Select {picker ? kindLabel(picker.kind) : ""}
            </DialogTitle>
            <DialogDescription>
              Search the Collaboratory database. If it is not there, invite them to register.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            className="text-left text-caption text-primary"
            onClick={() => {
              if (picker) openInvite(picker)
              setPicker(null)
            }}
          >
            Don&apos;t see it? Invite to register
          </button>
          <div className="flex gap-2">
            <Input
              value={query || picker?.query || ""}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
            />
            <Button variant="outline">Update</Button>
          </div>
          {picker ? (
            <DirectoryResults
              kind={picker.kind}
              query={query || picker.query}
              onSelect={(id) => selectRecord(picker, id)}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(invite)} onOpenChange={(open) => !open && closeInvite()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">Invite to register</DialogTitle>
            <DialogDescription>
              {invite ? (
                <>
                  People and units must be in Collaboratory before they can be partners. Invite{" "}
                  <span className="font-medium text-[#1E1E1E]">{invite.query || kindLabel(invite.kind)}</span>
                  , or ask an admin to add this record.
                </>
              ) : (
                "People and units must be in Collaboratory before they can be partners."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-2">
                <Label htmlFor="invite-first" className="text-question font-normal text-[#1E1E1E]">
                  Primary Contact First Name
                </Label>
                <Input
                  id="invite-first"
                  value={inviteFirstName}
                  onChange={(event) => setInviteFirstName(event.target.value)}
                  placeholder="First name"
                  className={detailInputClass}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-2">
                <Label htmlFor="invite-last" className="text-question font-normal text-[#1E1E1E]">
                  Primary Contact Last Name
                </Label>
                <Input
                  id="invite-last"
                  value={inviteLastName}
                  onChange={(event) => setInviteLastName(event.target.value)}
                  placeholder="Last name"
                  className={detailInputClass}
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="invite-email" className="text-question font-normal text-[#1E1E1E]">
                Primary Contact Email
              </Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                className={detailInputClass}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-2">
              <Label htmlFor="invite-phone" className="text-question font-normal text-[#1E1E1E]">
                Primary Contact Phone
              </Label>
              <Input
                id="invite-phone"
                type="tel"
                placeholder="Phone number"
                value={invitePhone}
                onChange={(event) => setInvitePhone(event.target.value)}
                className={detailInputClass}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={closeInvite}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (invite) {
                  markInvited(invite, {
                    firstName: inviteFirstName,
                    lastName: inviteLastName,
                    email: inviteEmail,
                    phone: invitePhone,
                  })
                }
              }}
            >
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function EntityPane({
  match,
  status,
  expandMode,
  expanded,
  active,
  showSuggestions,
  onSelect,
  onToggle,
  onRemove,
  onInvite,
  onLeaveOff,
}: {
  match: DirectoryMatch
  status: FieldStatus
  expandMode: ExpandMode
  expanded: boolean
  active: boolean
  showSuggestions: boolean
  onSelect: () => void
  onToggle: () => void
  onRemove: () => void
  onInvite: () => void
  onLeaveOff: () => void
}) {
  const name = match.record?.name ?? match.query
  const { first, last } = splitName(match.kind === "faculty" ? name : undefined)
  const contactFirst = match.record?.contactFirstName ?? first
  const contactLast = match.record?.contactLastName ?? last
  const hasContact = hasFillableBody(match)
  const emailReview = contactEmailReview(match)
  const [email, setEmail] = useState(match.record?.email ?? "")
  const [phone, setPhone] = useState(match.record?.phone ?? "")
  const [emailReviewOpen, setEmailReviewOpen] = useState(Boolean(emailReview))
  const expandable = expandMode !== "none"
  const showStatusRow = expandable || status !== "grounded"
  const showDetails =
    expanded && (showSuggestions || (status !== "absent" && match.status !== "invite"))

  return (
    <article className="flex flex-col gap-2" onClick={onSelect}>
      <div
        className={cn(
          "flex min-w-[240px] items-center gap-3 rounded-lg border border-[#D9D9D9] bg-white p-3",
          active && "ring-1 ring-primary/20"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <EntityMark match={match} />
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
            <h3 className="text-h3 font-semibold tracking-tight text-[#1E1E1E]">
              {name}
            </h3>
            {status !== "absent" ? <ApprovalTag match={match} /> : null}
          </div>
        </div>
        <button
          type="button"
          aria-label={`Remove ${name}`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#D9D9D9] bg-[#F5F5F5]"
          onClick={(event) => {
            event.stopPropagation()
            onRemove()
          }}
        >
          <X className="size-5 text-[#1E1E1E]" strokeWidth={1.6} />
        </button>
      </div>

      {showStatusRow ? (
        <div className={STATUS_REVIEW_BAR_CLASS}>
          {expandable ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-label={expanded ? "Hide details" : "Show details"}
              className={STATUS_REVIEW_BAR_ROW_CLASS}
              onClick={(event) => {
                event.stopPropagation()
                onToggle()
              }}
            >
              <StatusBadge status={status} />
              <ChevronDown
                className={cn("size-4 text-[#1E1E1E] transition-transform", expanded && "rotate-180")}
              />
            </button>
          ) : (
            <div className="flex w-full items-center px-3 py-1.5">
              <StatusBadge status={status} />
            </div>
          )}

          {showDetails ? (
            <div
              className="flex flex-col gap-5 border-t border-[#D9D9D9] px-3 py-2"
              onClick={(event) => event.stopPropagation()}
            >
              {showSuggestions ? (
                <div className="space-y-2">
                  <p className="text-suggestion text-[#1E1E1E]">
                    {match.note || "Not in Collaboratory"}
                  </p>
                  <SuggestionPills
                    header={null}
                    options={[
                      { id: "invite", label: `Invite ${match.query}` },
                      { id: "leave", label: "Leave off" },
                    ]}
                    onPick={(id) => (id === "invite" ? onInvite() : onLeaveOff())}
                  />
                </div>
              ) : null}

              {status === "invited" && !showSuggestions ? (
                <p className="text-suggestion text-[#1E1E1E]">
                  {match.note || "Invite sent. Waiting for them to register."}
                </p>
              ) : null}

              {hasContact && match.status !== "invite" ? (
                <>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <DetailField
                      id={`${match.id}-first`}
                      label="Primary Contact First Name"
                      defaultValue={contactFirst}
                      className="flex-1"
                    />
                    <DetailField
                      id={`${match.id}-last`}
                      label="Primary Contact Last Name"
                      defaultValue={contactLast}
                      className="flex-1"
                    />
                  </div>
                  {match.kind === "institution" ? (
                    <>
                      <DetailField
                        id={`${match.id}-institution`}
                        label="Institution"
                        defaultValue={name}
                      />
                      <DetailField
                        id={`${match.id}-dept`}
                        label="Primary Contact Department"
                        defaultValue=""
                      />
                    </>
                  ) : null}
                  <div className="flex flex-col gap-2">
                    <DetailField
                      id={`${match.id}-email`}
                      label="Primary Contact Email"
                      type="email"
                      value={email}
                      onChange={setEmail}
                    />
                    {emailReview ? (
                      <NestedReview
                        status={emailReview.status}
                        note={emailReview.note}
                        quotes={emailReview.quotes}
                        open={emailReviewOpen}
                        onToggle={() => setEmailReviewOpen((current) => !current)}
                        onPick={(id) => {
                          const picked = emailReview.quotes.find((item) => item.id === id)
                          if (picked) setEmail(picked.label)
                        }}
                      />
                    ) : null}
                  </div>
                  <DetailField
                    id={`${match.id}-phone`}
                    label="Primary Contact Phone"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                  />
                </>
              ) : null}

              {match.kind === "organization" && match.status !== "invite" ? (
                <div className="flex flex-col gap-2">
                  <p className="text-question text-[#1E1E1E]">
                    <span className="text-primary">*</span> What is the organization&apos;s role in
                    planning, designing, implementing, or evaluating this Activity?
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="space-y-2">
                      {ORG_ROLES_LEFT.map((role) => (
                        <label key={role} className="flex items-start gap-2 text-body">
                          <input type="checkbox" className="mt-1" />
                          {role}
                        </label>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {ORG_ROLES_RIGHT.map((role) => (
                        <label key={role} className="flex items-start gap-2 text-body">
                          <input type="checkbox" className="mt-1" />
                          {role}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}

function DirectoryResults({
  kind,
  query,
  onSelect,
}: {
  kind: EntityKind
  query: string
  onSelect: (id: string) => void
}) {
  const results = searchDirectory(kind, query)
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-caption">
        <span>
          {results.length} result{results.length === 1 ? "" : "s"}
        </span>
        {results.length === 1 ? (
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            <Star className="size-3 fill-current" /> Direct Match
          </span>
        ) : null}
      </div>
      {results.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className="flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left hover:bg-muted"
        >
          <span className="mt-0.5 flex size-8 items-center justify-center rounded bg-muted text-caption font-medium">
            {entityInitials(item.name)}
          </span>
          <span>
            <span className="block text-body font-medium text-primary">{item.name}</span>
            {displaySubtitle(item.subtitle) ? (
              <span className="block text-caption text-muted-foreground">
                {displaySubtitle(item.subtitle)}
              </span>
            ) : null}
          </span>
        </button>
      ))}
      {results.length === 0 ? (
        <p className="text-caption text-muted-foreground">
          No Collaboratory record. Invite to register or ask an admin.
        </p>
      ) : null}
    </div>
  )
}
