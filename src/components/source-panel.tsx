"use client"

import { useEffect, useRef } from "react"
import { Maximize2 } from "lucide-react"
import { ARTICLE, SOURCE } from "@/lib/article"
import { FIELDS } from "@/lib/fields"
import { DIRECTORY_MATCHES } from "@/lib/directory"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ArticleSpan, FieldStatus } from "@/lib/types"

export function SourcePanel({
  activeFieldId,
  activeSpanId,
  onSelectSpan,
  compact,
  onExpand,
}: {
  activeFieldId: string | null
  activeSpanId?: string | null
  onSelectSpan: (spanId: string) => void
  compact?: boolean
  onExpand?: () => void
}) {
  const field = FIELDS.find((item) => item.id === activeFieldId)
  const directoryMatch = DIRECTORY_MATCHES.find((item) => item.id === activeFieldId)
  const spanList = directoryMatch?.spanIds ?? field?.spanIds ?? []
  const highlightIds = new Set(activeSpanId ? [activeSpanId] : spanList)
  const relatedIds = new Set(spanList)
  const status: FieldStatus | undefined = field?.status
  const firstId = [...highlightIds][0]
  const firstRef = useRef<HTMLElement | null>(null)
  const webSource = field?.webSource

  useEffect(() => {
    firstRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeFieldId, activeSpanId])

  return (
    <div className="flex h-full min-h-0 flex-col bg-transparent">
      {compact ? null : (
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Article
          </p>
          <p className="truncate text-sm font-medium">{SOURCE.outlet}</p>
          <p className="truncate text-[11px] text-muted-foreground">{SOURCE.title}</p>
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Expand source" onClick={onExpand}>
          <Maximize2 />
        </Button>
      </div>
      )}
      {compact ? (
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{SOURCE.outlet}</p>
            <p className="truncate text-[11px] text-muted-foreground">{SOURCE.title}</p>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Widen article" onClick={onExpand}>
            <Maximize2 />
          </Button>
        </div>
      ) : null}
      <ScrollArea className="min-h-0 flex-1">
        <article className="space-y-3 px-4 py-4">
          {ARTICLE.map((block, index) => {
            if (block.kind === "figure" && block.src) {
              const span = block.spans[0]
              const spanId = span?.id
              const active = spanId ? highlightIds.has(spanId) : false
              const related = spanId ? relatedIds.has(spanId) : false
              return (
                <figure
                  key={index}
                  ref={(node) => {
                    if (spanId === firstId) firstRef.current = node
                  }}
                  onClick={() => {
                    if (spanId) onSelectSpan(spanId)
                  }}
                  className={cn(
                    "cursor-pointer overflow-hidden rounded-lg border",
                    related && !active && "border-gold bg-gold/10",
                    active && status === "review" && "border-primary bg-accent",
                    active && status !== "review" && "border-gold bg-gold-soft"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={block.src} alt={block.alt ?? ""} className="w-full object-cover" />
                  {span?.text ? (
                    <figcaption className="px-2 py-1.5 text-xs text-muted-foreground">
                      {span.text}
                    </figcaption>
                  ) : null}
                </figure>
              )
            }
            return (
              <p
              key={index}
              className={cn(
                "text-[14px] leading-6 text-foreground",
                block.kind === "kicker" && "text-[11px] font-medium tracking-wide text-primary uppercase",
                block.kind === "h1" && "font-heading text-xl leading-7 font-semibold",
                block.kind === "dek" && "text-base text-muted-foreground",
                block.kind === "meta" && "text-xs text-muted-foreground",
                block.kind === "h2" && "font-heading pt-2 text-lg font-semibold",
                block.kind === "quote" && "border-l-2 border-gold pl-3 text-sm text-muted-foreground",
                block.kind === "tags" && "flex flex-wrap items-center gap-1.5 pt-3"
              )}
            >
              {block.kind === "tags" ? (
                <span className="mr-1 text-xs font-medium text-muted-foreground">Tags</span>
              ) : null}
              {block.spans.map((span, spanIndex) => {
                const body = (
                  <LinkedText span={span} className={block.kind === "tags" ? "no-underline" : undefined} />
                )
                if (!span.id) {
                  return <span key={spanIndex}>{body}</span>
                }
                const active = highlightIds.has(span.id)
                const related = relatedIds.has(span.id)
                if (block.kind === "tags") {
                  return (
                    <mark
                      key={span.id}
                      ref={(node) => {
                        if (span.id === firstId) firstRef.current = node
                      }}
                      onClick={() => onSelectSpan(span.id!)}
                      className={cn(
                        "relative inline-flex cursor-pointer rounded-full border px-2 py-0.5 text-xs",
                        related && "border-gold bg-gold-soft",
                        active && "border-primary bg-accent"
                      )}
                    >
                      {body}
                    </mark>
                  )
                }
                return (
                  <mark
                    key={span.id}
                    ref={(node) => {
                      if (span.id === firstId) firstRef.current = node
                    }}
                    onClick={() => onSelectSpan(span.id!)}
                    className={cn(
                      "relative cursor-pointer rounded-sm bg-transparent px-0.5 transition-colors",
                      related && !active && "bg-gold/25",
                      active && status === "review" && "bg-primary/15",
                      active && status === "outside" && "bg-gold/35",
                      active && status !== "review" && status !== "outside" && "bg-gold/50"
                    )}
                  >
                    {active ? (
                      <span
                        className={cn(
                          "absolute -top-2.5 left-0 size-2.5 rounded-full ring-2 ring-background",
                          status === "review" ? "bg-primary" : "bg-gold"
                        )}
                      />
                    ) : null}
                    {body}
                    {active ? (
                      <span
                        className={cn(
                          "absolute -bottom-2.5 right-0 size-2.5 rounded-full ring-2 ring-background",
                          status === "review" ? "bg-primary" : "bg-gold"
                        )}
                      />
                    ) : null}
                  </mark>
                )
              })}
              </p>
            )
          })}
        </article>
        {webSource ? (
          <div className="border-t border-gold bg-gold-soft/50 px-6 py-4">
            <p className="text-[11px] font-medium tracking-wide uppercase">
              Web Search
            </p>
            <p className="mt-1 text-sm">
              Found on {webSource.site ?? "the public web"}
              {webSource.name ? ` (${webSource.name})` : ""}.
            </p>
            <a
              href={webSource.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-sm font-medium text-primary"
            >
              {webSource.title}
            </a>
          </div>
        ) : null}
      </ScrollArea>
    </div>
  )
}

function LinkedText({ span, className }: { span: ArticleSpan; className?: string }) {
  if (!span.href) return span.text
  return (
    <a
      href={span.href}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className={cn("text-primary underline underline-offset-2", className)}
    >
      {span.text}
    </a>
  )
}
