"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Eye, Plus, Search } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { AppRail } from "@/components/app-rail"
import { QualifyDialog } from "@/components/qualify-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  classifyActivity,
  isQualifyComplete,
  saveQualify,
  type QualifyAnswers,
} from "@/lib/qualify"
import { cn } from "@/lib/utils"

const ACTIVITIES = [
  {
    id: "agua",
    name: "Agua es Vida: Honoring Mothers and Water",
    owner: "Samiksha Jain",
    updated: "October 17, 2025",
    swatch: "bg-[#8C1D40]",
  },
  {
    id: "rural",
    name: "ASU helps rural communities access care",
    owner: "Samiksha Jain",
    updated: "January 8, 2026",
    swatch: "bg-[#1E4D2B]",
  },
  {
    id: "gardens",
    name: "Community gardens and neighborhood health",
    owner: "Samiksha Jain",
    updated: "March 2, 2026",
    swatch: "bg-[#C39B6A]",
  },
  {
    id: "heat",
    name: "Shade and heat resilience with South Phoenix partners",
    owner: "Samiksha Jain",
    updated: "November 21, 2025",
    swatch: "bg-[#5C6670]",
  },
  {
    id: "food",
    name: "Food access mapping with local grocers",
    owner: "Samiksha Jain",
    updated: "August 14, 2025",
    swatch: "bg-[#8C1D40]",
  },
]

export function LandingPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return ACTIVITIES
    return ACTIVITIES.filter((row) => row.name.toLowerCase().includes(needle))
  }, [query])

  function startSmartFill(answers: QualifyAnswers) {
    if (!isQualifyComplete(answers)) return
    saveQualify(answers, classifyActivity(answers))
    router.push("/smart-fill")
  }

  return (
    <div className="flex min-h-full bg-muted/30">
      <AppRail />
      <div className="flex min-w-0 flex-1 flex-col">
        <SiteHeader title="My Activities" />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="font-heading text-h1 font-semibold tracking-tight text-primary">
                My Activities
              </h1>
              <Button
                onClick={() => setOpen(true)}
                className="h-9 rounded-md bg-[#2E7D32] px-5 text-white hover:bg-[#256628]"
              >
                <Plus className="size-4" />
                New
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-56 flex-1 sm:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Keyword(s)"
                  className="pl-8"
                  aria-label="Search activities"
                />
              </div>
              <Button variant="outline">Search</Button>
            </div>

            <section className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-body text-muted-foreground">
                  Viewing all · {rows.length} activities
                </p>
                <div className="flex items-center gap-2 text-body text-muted-foreground">
                  <span>Page 1</span>
                  <span>1–{rows.length} of {rows.length}</span>
                  <button type="button" className="rounded-md p-1 hover:bg-muted" aria-label="Previous page">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button type="button" className="rounded-md p-1 hover:bg-muted" aria-label="Next page">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              <table className="w-full text-left text-body">
                <thead className="bg-muted/60 text-muted-foreground">
                  <tr>
                    <th className="w-10 px-4 py-2 font-medium">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-3 py-2 font-medium">Name</th>
                    <th className="px-3 py-2 font-medium">State</th>
                    <th className="hidden px-3 py-2 font-medium md:table-cell">Current owner</th>
                    <th className="hidden px-3 py-2 font-medium lg:table-cell">Last updated</th>
                    <th className="px-3 py-2 font-medium">View</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <input type="checkbox" aria-label={`Select ${row.name}`} />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <span className={cn("size-9 shrink-0 rounded-md", row.swatch)} />
                          <span className="font-medium">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full border border-primary px-2.5 py-0.5 text-tag font-medium leading-none tracking-wide text-primary">
                          PENDING
                        </span>
                      </td>
                      <td className="hidden px-3 py-3 md:table-cell">{row.owner}</td>
                      <td className="hidden px-3 py-3 text-muted-foreground lg:table-cell">
                        {row.updated}
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label={`View ${row.name}`}
                        >
                          <Eye className="size-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </main>
      </div>

      <QualifyDialog
        open={open}
        onOpenChange={setOpen}
        onContinue={startSmartFill}
      />
    </div>
  )
}
