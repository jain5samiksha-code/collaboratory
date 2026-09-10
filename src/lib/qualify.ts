export const QUALIFY_STORAGE_KEY = "collaboratory-qualify"

export type QualifyKey =
  | "externalCommunity"
  | "knowledgeExchange"
  | "mutualBenefit"
  | "collaborativeRelationship"

export const QUALIFY_QUESTIONS: {
  key: QualifyKey
  step: string
  question: string
}[] = [
  {
    key: "externalCommunity",
    step: "Community involved",
    question:
      "Is an external community group, organization, agency, or neighborhood involved?",
  },
  {
    key: "knowledgeExchange",
    step: "Knowledge exchanged",
    question:
      "Is knowledge or expertise exchanged between the institution and the community?",
  },
  {
    key: "mutualBenefit",
    step: "Mutual benefits",
    question: "Are benefits to both the institution and community identified?",
  },
  {
    key: "collaborativeRelationship",
    step: "Collaborative relationship",
    question: "Is there an ongoing or collaborative relationship with the community?",
  },
]

export type QualifyAnswers = Partial<Record<QualifyKey, boolean>>

export type ActivityKind = "community-engagement" | "public-service" | "not-listed"

export type ActivityClass = {
  kind: ActivityKind
  title: string
  headline: string
  detail: string
}

export function classifyActivity(answers: QualifyAnswers): ActivityClass {
  if (answers.externalCommunity === false) {
    return {
      kind: "not-listed",
      title: "This looks internal to the university",
      headline: "No external community",
      detail:
        "Community engagement and public service involve a group, organization, agency, or neighborhood outside the institution.",
    }
  }

  const engagement =
    answers.externalCommunity &&
    answers.knowledgeExchange &&
    answers.mutualBenefit &&
    answers.collaborativeRelationship

  if (engagement) {
    return {
      kind: "community-engagement",
      title: "This looks like community engagement",
      headline: "Community engagement",
      detail:
        "An external community is involved, knowledge is exchanged, benefits go both ways, and the relationship is collaborative.",
    }
  }

  return {
    kind: "public-service",
    title: "This looks like public service",
    headline: "Public service",
    detail:
      "The work involves community, but it is not a full two-way collaboration. Collaboratory treats that as public service.",
  }
}

export function isQualifyComplete(answers: QualifyAnswers) {
  return QUALIFY_QUESTIONS.every((item) => answers[item.key] !== undefined)
}

export function saveQualify(answers: QualifyAnswers, result: ActivityClass) {
  sessionStorage.setItem(QUALIFY_STORAGE_KEY, JSON.stringify({ answers, result }))
}

export function loadQualify(): { answers: QualifyAnswers; result: ActivityClass } | null {
  if (typeof window === "undefined") return null
  const raw = sessionStorage.getItem(QUALIFY_STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as { answers: QualifyAnswers; result: ActivityClass }
  } catch {
    return null
  }
}
