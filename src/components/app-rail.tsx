"use client"

import Link from "next/link"
import {
  Bell,
  Heart,
  Info,
  MessageCircle,
  Plus,
  Search,
  Send,
  Briefcase,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { icon: MessageCircle, label: "Activity", active: true },
  { icon: Briefcase, label: "Trips" },
  { icon: Search, label: "Search" },
  { icon: Heart, label: "Saved" },
  { icon: Bell, label: "Alerts" },
  { icon: Send, label: "Share" },
  { icon: Plus, label: "New" },
]

export function AppRail() {
  return (
    <aside className="hidden h-full w-14 shrink-0 flex-col items-center border-r border-border bg-background py-3 md:flex">
      <Link
        href="/"
        className="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground"
        aria-label="Collaboratory home"
      >
        C
      </Link>
      <nav className="mt-6 flex flex-1 flex-col items-center gap-1">
        {NAV.map((item) => (
          <button
            key={item.label}
            type="button"
            title={item.label}
            className={cn(
              "flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
              item.active && "bg-accent text-primary"
            )}
          >
            <item.icon className="size-4" />
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="flex flex-col items-center gap-2">
        <p
          className="text-[10px] font-medium tracking-[0.2em] text-primary uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          collaboratory
        </p>
        <button type="button" className="flex size-8 items-center justify-center rounded-full bg-muted" title="Profile">
          <User className="size-3.5 text-muted-foreground" />
        </button>
        <button type="button" className="flex size-8 items-center justify-center text-muted-foreground" title="About">
          <Info className="size-3.5" />
        </button>
      </div>
    </aside>
  )
}
