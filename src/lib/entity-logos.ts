import type { DirectoryMatch } from "@/lib/directory"

/** Local assets in public/logos/. Anything without a file uses initials. */
const RECORD_LOGO: Record<string, string> = {
  "unit-chs": "/logos/chs.png",
  "unit-stph": "/logos/chs.png",
  "inst-nyu": "/logos/nyu.png",
}

const SKIP = new Set(["of", "the", "for", "and", "at", "a", "an", "to", "in"])

export function entityInitials(name: string) {
  const parts = name
    .trim()
    .split(/[\s/]+/)
    .filter((part) => part && !SKIP.has(part.toLowerCase()))
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return parts
    .slice(0, 3)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
}

export function entityLogo(
  match: DirectoryMatch
): { type: "image"; src: string; initials: string } | { type: "initials"; label: string } {
  const name = (match.record?.name ?? match.query).trim()
  const initials = entityInitials(name)
  const recordId = match.record?.id
  if (recordId && RECORD_LOGO[recordId]) {
    return { type: "image", src: RECORD_LOGO[recordId], initials }
  }
  return { type: "initials", label: initials }
}
