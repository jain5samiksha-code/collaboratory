import type { FieldStatus, SectionId } from "@/lib/types"

export const DRAFT_STORAGE_KEY = "collaboratory-smart-fill-draft"
export const AUTOSAVE_MS = 30_000

export type SmartFillDraft = {
  drafts: Record<string, { value: string; status: FieldStatus; chosenCandidateId?: string }>
  section: SectionId
  savedAt: number
}

export function saveSmartFillDraft(payload: SmartFillDraft) {
  if (typeof window === "undefined") return
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload))
}

export function loadSmartFillDraft(): SmartFillDraft | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SmartFillDraft
    if (!parsed?.drafts || !parsed.savedAt) return null
    return parsed
  } catch {
    return null
  }
}
