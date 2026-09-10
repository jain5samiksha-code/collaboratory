export type FieldStatus = "grounded" | "outside" | "review" | "absent" | "invited"

export type Origin = "source" | "web" | "none"

export type SectionId =
  | "basic"
  | "collaborators"
  | "focus"
  | "scholarship"
  | "goals"
  | "submit"

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "email"
  | "tel"
  | "select"
  | "toggle"
  | "image"
  | "number"

export type Candidate = {
  id: string
  spanId: string
  quote: string
  reason?: string
  fillValue?: string
  label?: string
}

export type WebSource = {
  title: string
  url: string
  excerpt: string
  site?: string
  name?: string
}

export type ExtractedField = {
  id: string
  section: Exclude<SectionId, "submit">
  label: string
  question: string
  required?: boolean
  type: FieldType
  value: string
  status: FieldStatus
  origin: Origin
  note: string
  why?: string
  spanIds: string[]
  webSource?: WebSource
  candidates?: Candidate[]
  options?: string[]
  placeholder?: string
}

export type ArticleSpan = {
  id?: string
  text: string
  href?: string
}

export type ArticleBlock = {
  kind: "kicker" | "h1" | "dek" | "meta" | "p" | "h2" | "quote" | "tags" | "figure"
  spans: ArticleSpan[]
  src?: string
  alt?: string
}

export type ParseBeat = {
  id: string
  kind: "stage" | "question"
  section?: Exclude<SectionId, "submit">
  fieldId?: string
  title: string
  detail: string
}
