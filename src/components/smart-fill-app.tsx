"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Check } from "lucide-react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"
import { AppRail } from "@/components/app-rail"
import { ActivityStepper } from "@/components/activity-stepper"
import { ParseProgress } from "@/components/parse-progress"
import { SourcePanel } from "@/components/source-panel"
import { FieldBlock, ContactNameBlock, ContactWithPrivateBlock, type FieldDraft } from "@/components/field-block"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CollaboratorsSection } from "@/components/collaborators-section"
import { FocusSection } from "@/components/focus-section"
import { ScholarshipSection } from "@/components/scholarship-section"
import { GoalsSection } from "@/components/goals-section"
import { FIELDS, PARSE_BEATS, SECTIONS, fieldsInSection } from "@/lib/fields"
import { DIRECTORY_MATCHES } from "@/lib/directory"
import { loadQualify, type ActivityClass } from "@/lib/qualify"
import { AUTOSAVE_MS, loadSmartFillDraft, saveSmartFillDraft } from "@/lib/draft-storage"
import type { SectionId } from "@/lib/types"

const PRIMARY_BASIC = ["title", "description"]
const CONTACT_IDS = [
  "contactFirst",
  "contactLast",
  "contactEmail",
  "contactEmailPrivate",
  "contactPhone",
  "contactPhonePrivate",
]

const initialDrafts: Record<string, FieldDraft> = Object.fromEntries(
  FIELDS.map((field) => {
    const matched = field.candidates?.find(
      (candidate) => candidate.fillValue === field.value || candidate.quote === field.value
    )
    return [
      field.id,
      {
        value: field.value,
        status: field.status,
        chosenCandidateId: matched?.id ?? (field.value ? field.candidates?.[0]?.id : undefined),
      },
    ]
  })
)

export function SmartFillApp() {
  const [phase, setPhase] = useState<"parse" | "review">("parse")
  const [activityClass, setActivityClass] = useState<ActivityClass | null>(null)
  const [beatIndex, setBeatIndex] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [section, setSection] = useState<SectionId>("basic")
  const [activeFieldId, setActiveFieldId] = useState<string | null>("title")
  const [activeSpanId, setActiveSpanId] = useState<string | null>(null)
  const [articleOpen, setArticleOpen] = useState(true)
  const [articleWide, setArticleWide] = useState(false)
  const [mobileArticle, setMobileArticle] = useState(false)
  const [isLg, setIsLg] = useState(true)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [savedAt, setSavedAt] = useState(() => Date.now())
  const [now, setNow] = useState(() => Date.now())
  const draftsRef = useRef(drafts)
  const sectionRef = useRef(section)
  draftsRef.current = drafts
  sectionRef.current = section

  useEffect(() => {
    const saved = loadSmartFillDraft()
    if (!saved) return
    setDrafts(saved.drafts)
    if (saved.section) setSection(saved.section)
    setSavedAt(saved.savedAt)
  }, [])

  useEffect(() => {
    if (phase !== "review") return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "review") return
    const persist = () => {
      const at = Date.now()
      saveSmartFillDraft({
        drafts: draftsRef.current,
        section: sectionRef.current,
        savedAt: at,
      })
      setSavedAt(at)
    }
    persist()
    const timer = window.setInterval(persist, AUTOSAVE_MS)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    const saved = loadQualify()
    if (saved) setActivityClass(saved.result)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const sync = () => setIsLg(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  useEffect(() => {
    if (phase !== "parse") return
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000)
    return () => window.clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "parse") return
    if (beatIndex >= PARSE_BEATS.length) {
      const done = window.setTimeout(() => setPhase("review"), 700)
      return () => window.clearTimeout(done)
    }
    const delay = 1600
    const timer = window.setTimeout(() => setBeatIndex((value) => value + 1), delay)
    return () => window.clearTimeout(timer)
  }, [beatIndex, phase])

  const summary = useMemo(() => {
    const values = Object.values(drafts)
    return {
      grounded: values.filter((item) => item.status === "grounded").length,
      outside: values.filter((item) => item.status === "outside").length,
      review: values.filter((item) => item.status === "review").length,
      absent: values.filter((item) => item.status === "absent").length,
    }
  }, [drafts])

  function updateField(id: string, patch: Partial<FieldDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }))
  }

  function goNext() {
    const index = SECTIONS.findIndex((item) => item.id === section)
    const next = SECTIONS[Math.min(index + 1, SECTIONS.length - 1)]
    setSection(next.id)
    if (next.id !== "submit") {
      const first = fieldsInSection(next.id)[0]
      setActiveFieldId(first?.id ?? null)
      setActiveSpanId(first?.spanIds[0] ?? null)
    }
  }

  function revealArticle() {
    if (isLg) setArticleOpen(true)
    else setMobileArticle(true)
  }

  function handleSpan(spanId: string) {
    setActiveSpanId(spanId)
    const match = FIELDS.find(
      (field) =>
        field.spanIds.includes(spanId) ||
        field.candidates?.some((candidate) => candidate.spanId === spanId)
    )
    const entity = DIRECTORY_MATCHES.find(
      (item) => item.spanIds.includes(spanId) || item.tagId === spanId
    )
    if (entity) {
      setActiveFieldId(entity.id)
      setSection("collaborators")
      return
    }
    if (match) {
      setActiveFieldId(match.id)
      setSection(match.section)
    }
  }

  function renderSourcePanel() {
    return (
      <SourcePanel
        compact
        activeFieldId={activeFieldId}
        activeSpanId={activeSpanId}
        onSelectSpan={handleSpan}
        onExpand={() => setArticleWide((value) => !value)}
      />
    )
  }

  if (phase === "parse") {
    return (
      <div className="flex h-svh overflow-hidden bg-muted/40">
        <AppRail />
        <div className="flex min-w-0 flex-1 flex-col">
          <SiteHeader title="Smart Fill" eyebrow="New activity" />
          <ParseProgress
            beatIndex={beatIndex}
            elapsed={elapsed}
            onSkip={() => setPhase("review")}
          />
        </div>
      </div>
    )
  }

  function renderField(field: (typeof FIELDS)[number]) {
    if (field.id === "contactLast" || field.id === "contactEmailPrivate" || field.id === "contactPhonePrivate") {
      return null
    }
    if (field.id === "contactFirst") {
      const last = FIELDS.find((item) => item.id === "contactLast")
      if (!last) return null
      return (
        <ContactNameBlock
          key="contact-name"
          first={field}
          last={last}
          firstDraft={drafts[field.id]}
          lastDraft={drafts[last.id]}
          active={activeFieldId === field.id || activeFieldId === last.id}
          onSelect={(id) => {
            setActiveFieldId(id)
            const chosen = field.candidates?.find(
              (candidate) => candidate.id === drafts[field.id].chosenCandidateId
            )
            setActiveSpanId(chosen?.spanId ?? field.spanIds[0] ?? null)
            revealArticle()
          }}
          onChangeFirst={(value) => updateField(field.id, { value })}
          onChangeLast={(value) => updateField(last.id, { value })}
          onAccept={() => {
            updateField(field.id, { status: "grounded" })
            updateField(last.id, { status: "grounded" })
            toast.success("Kept primary contact")
          }}
          onBlank={() => {
            updateField(field.id, { value: "", status: "absent" })
            updateField(last.id, { value: "", status: "absent" })
            toast.message("Primary contact left blank")
          }}
          onPickCandidate={(candidateId) => {
            const candidate = field.candidates?.find((item) => item.id === candidateId)
            const full = candidate?.fillValue ?? ""
            const space = full.indexOf(" ")
            const firstName = space < 0 ? full : full.slice(0, space)
            const lastName = space < 0 ? "" : full.slice(space + 1)
            updateField(field.id, {
              chosenCandidateId: candidateId,
              status: "review",
              value: firstName,
            })
            updateField(last.id, {
              chosenCandidateId: candidateId,
              status: "review",
              value: lastName,
            })
            if (candidateId === "name-miller") {
              updateField("contactEmail", {
                value: "jordan.anne.miller@asu.edu",
                status: "outside",
                chosenCandidateId: "email-miller",
              })
            } else if (candidateId === "name-burrell") {
              updateField("contactEmail", {
                value: "",
                status: "absent",
                chosenCandidateId: "email-burrell",
              })
            }
            setActiveFieldId(field.id)
            setActiveSpanId(candidate?.spanId ?? null)
            revealArticle()
          }}
          onPinSpan={(spanId) => {
            setActiveSpanId(spanId)
            revealArticle()
          }}
        />
      )
    }
    if (field.id === "contactEmail" || field.id === "contactPhone") {
      const privacyId = field.id === "contactEmail" ? "contactEmailPrivate" : "contactPhonePrivate"
      const privacy = FIELDS.find((item) => item.id === privacyId)
      if (!privacy) return null
      return (
        <ContactWithPrivateBlock
          key={field.id}
          field={field}
          draft={drafts[field.id]}
          privacy={privacy}
          privacyDraft={drafts[privacy.id]}
          active={activeFieldId === field.id || activeFieldId === privacy.id}
          onSelect={(id) => {
            setActiveFieldId(id)
            const target = FIELDS.find((item) => item.id === id) ?? field
            const chosen = drafts[id]?.chosenCandidateId
              ? target.candidates?.find((candidate) => candidate.id === drafts[id].chosenCandidateId)
              : undefined
            setActiveSpanId(chosen?.spanId ?? target.spanIds[0] ?? null)
            revealArticle()
          }}
          onChange={(value) => updateField(field.id, { value })}
          onChangePrivacy={(value) => updateField(privacy.id, { value })}
          onPickCandidate={(candidateId) => {
            const candidate = field.candidates?.find((item) => item.id === candidateId)
            const fill = candidate?.fillValue
            const blank = fill === ""
            updateField(field.id, {
              chosenCandidateId: candidateId,
              status: blank ? "absent" : field.id === "contactEmail" ? "outside" : "review",
              value: fill ?? drafts[field.id].value,
            })
            setActiveFieldId(field.id)
            setActiveSpanId(candidate?.spanId ?? null)
            revealArticle()
          }}
          onPinSpan={(spanId) => {
            setActiveSpanId(spanId)
            revealArticle()
          }}
        />
      )
    }
    return (
      <FieldBlock
        key={field.id}
        field={field}
        draft={drafts[field.id]}
        active={activeFieldId === field.id}
        onSelect={() => {
          setActiveFieldId(field.id)
          setActiveSpanId(
            drafts[field.id].chosenCandidateId
              ? field.candidates?.find((candidate) => candidate.id === drafts[field.id].chosenCandidateId)?.spanId ??
                  field.spanIds[0] ??
                  null
              : field.spanIds[0] ?? null
          )
          revealArticle()
        }}
        onChange={(value) => {
          if (field.type === "image") {
            const match = field.candidates?.find((item) => item.fillValue === value)
            updateField(field.id, {
              value,
              chosenCandidateId: match?.id,
            })
            return
          }
          updateField(field.id, { value })
        }}
        onAccept={() => {
          updateField(field.id, { status: "grounded" })
          toast.success(`Kept ${field.label}`)
        }}
        onBlank={() => {
          updateField(field.id, { value: "", status: "absent" })
          toast.message(`${field.label} left blank`)
        }}
        onPickCandidate={(candidateId) => {
          const candidate = field.candidates?.find((item) => item.id === candidateId)
          const fill = candidate?.fillValue
          const blank = fill === ""
          updateField(field.id, {
            chosenCandidateId: candidateId,
            status: blank ? "absent" : "review",
            value: fill ?? drafts[field.id].value,
          })
          setActiveFieldId(field.id)
          setActiveSpanId(candidate?.spanId ?? null)
          revealArticle()
        }}
        onPinSpan={(spanId) => {
          setActiveSpanId(spanId)
          revealArticle()
        }}
      />
    )
  }

  return (
    <div className="flex h-svh overflow-hidden bg-muted/40">
      <AppRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <SiteHeader title="Smart Fill review" eyebrow="New activity" />
        <div className="flex min-h-0 flex-1">
          <main className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted/50">
            <div className="border-b border-border bg-background px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <ActivityStepper current={section} onSelect={setSection} />
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileArticle(true)}>
                    Article
                  </Button>
                  {!articleOpen ? (
                    <Button variant="outline" size="sm" className="hidden lg:inline-flex" onClick={() => setArticleOpen(true)}>
                      Show article
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <ScrollArea className="min-h-0 flex-1">
              <div className="mx-auto w-full max-w-3xl px-6 py-6">
                <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
                {section === "submit" ? (
                  <SubmitPanel
                    grounded={summary.grounded}
                    outside={summary.outside}
                    review={summary.review}
                    absent={summary.absent}
                    activityClass={activityClass}
                  />
                ) : section === "collaborators" ? (
                  <CollaboratorsSection
                    activeId={activeFieldId}
                    onSelect={(match) => {
                      setActiveFieldId(match.id)
                      setActiveSpanId(match.spanIds[0] ?? null)
                      revealArticle()
                    }}
                  />
                ) : section === "focus" ? (
                  <FocusSection />
                ) : section === "scholarship" ? (
                  <ScholarshipSection />
                ) : section === "goals" ? (
                  <GoalsSection />
                ) : (
                  <BasicForm renderField={renderField} />
                )}
                </div>
              </div>
            </ScrollArea>

            <footer className="shrink-0 border-t border-border bg-background px-6 py-3">
              <div className="mx-auto grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-3">
                <Button
                  variant="ghost"
                  className="justify-self-start"
                  onClick={() => {
                    const index = SECTIONS.findIndex((item) => item.id === section)
                    const prev = SECTIONS[Math.max(index - 1, 0)]
                    setSection(prev.id)
                  }}
                >
                  Previous
                </Button>
                <p className="flex items-center gap-1.5 text-caption text-muted-foreground">
                  <Check className="size-3.5 text-[#2E7D32]" strokeWidth={2.5} />
                  <span>Auto saved draft</span>
                  <span className="text-muted-foreground/80">{savedAgo(now, savedAt)}</span>
                </p>
                <Button
                  className="justify-self-end rounded-full px-6"
                  onClick={section === "submit" ? () => toast.success("Ready for a human to submit") : goNext}
                >
                  {section === "submit" ? "Submit" : "Next"}
                </Button>
              </div>
            </footer>
          </main>

          {articleOpen ? (
            <aside
              className="hidden min-h-0 shrink-0 border-l border-border bg-muted/50 lg:flex lg:flex-col"
              style={{ width: articleWide ? "42vw" : 400 }}
            >
              <div className="flex items-center justify-between border-b border-border bg-muted/80 px-3 py-2">
                <div>
                  <p className="text-caption font-medium leading-none tracking-wide uppercase">Side window · Article</p>
                  <p className="text-caption text-muted-foreground">Source pins, not the form</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setArticleOpen(false)}>
                  Hide
                </Button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">{renderSourcePanel()}</div>
            </aside>
          ) : (
            <button
              type="button"
              onClick={() => setArticleOpen(true)}
              className="hidden w-10 shrink-0 border-l border-border bg-muted/60 text-caption font-medium leading-none tracking-wide text-muted-foreground lg:flex lg:items-center lg:justify-center"
              style={{ writingMode: "vertical-rl" }}
            >
              Side · Article
            </button>
          )}
        </div>
      </div>

      <Sheet open={mobileArticle && !isLg} onOpenChange={setMobileArticle}>
        <SheetContent side="right" className="h-full w-[92vw] max-w-md gap-0 p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Article</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-hidden">{renderSourcePanel()}</div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function BasicForm({
  renderField,
}: {
  renderField: (field: (typeof FIELDS)[number]) => ReactNode
}) {
  const basic = fieldsInSection("basic")
  const primary = basic.filter((field) => PRIMARY_BASIC.includes(field.id))
  const contact = basic.filter((field) => CONTACT_IDS.includes(field.id))
  const extras = basic.filter(
    (field) => !PRIMARY_BASIC.includes(field.id) && !CONTACT_IDS.includes(field.id)
  )

  return (
    <div className="space-y-6">
      {primary.map(renderField)}
      <section className="space-y-4">
        <h2 className="text-question font-semibold">Primary Contact</h2>
        {contact.map(renderField)}
      </section>
      {extras.map(renderField)}
    </div>
  )
}

function SubmitPanel({
  grounded,
  outside,
  review,
  absent,
  activityClass,
}: {
  grounded: number
  outside: number
  review: number
  absent: number
  activityClass: ActivityClass | null
}) {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-h2 font-semibold">Before you submit</h2>
      {activityClass ? (
        <p className="text-body text-muted-foreground">
          You classified this as <span className="font-medium text-foreground">{activityClass.headline.toLowerCase()}</span>. {activityClass.detail}
        </p>
      ) : null}
      <p className="text-body text-muted-foreground">
        Verification is a rule check, not a model score: in the article, found on the public web, or can’t find.
      </p>
      <ul className="space-y-2 text-body">
        <li>{grounded} in source.</li>
        <li>{outside} not in source, found outside.</li>
        <li>{review} still need a person.</li>
        <li>{absent} can’t find any details.</li>
      </ul>
    </div>
  )
}

function savedAgo(now: number, savedAt: number) {
  const seconds = Math.max(1, Math.floor((now - savedAt) / 1000))
  if (seconds < 60) return `${seconds} sec ago`
  const minutes = Math.floor(seconds / 60)
  return minutes === 1 ? "1 min ago" : `${minutes} min ago`
}
