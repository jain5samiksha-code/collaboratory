export type EntityKind =
  | "unit"
  | "program"
  | "faculty"
  | "organization"
  | "institution"

export type MatchStatus = "direct" | "invite" | "invited"

export type DirectoryRecord = {
  id: string
  kind: EntityKind
  name: string
  subtitle?: string
  approved?: boolean
  email?: string
  phone?: string
  contactFirstName?: string
  contactLastName?: string
}

export type DirectoryMatch = {
  id: string
  kind: EntityKind
  label: string
  query: string
  tagId?: string
  spanIds: string[]
  status: MatchStatus
  record?: DirectoryRecord
  note: string
  why: string
}

export const ARTICLE_TAGS = [
  { id: "tag-health", label: "ASU Health" },
  { id: "tag-stph", label: "School of Technology for Public Health" },
  { id: "tag-chs", label: "College of Health Solutions" },
]

export const DIRECTORY: DirectoryRecord[] = [
  {
    id: "unit-chs",
    kind: "unit",
    name: "College of Health Solutions",
    approved: true,
  },
  {
    id: "unit-stph",
    kind: "unit",
    name: "School of Technology for Public Health",
    subtitle: "College of Health Solutions",
    approved: true,
  },
  {
    id: "unit-wpcarey",
    kind: "unit",
    name: "W.P. Carey Graduate Programs",
    subtitle: "W.P. Carey School of Business",
    approved: true,
  },
  {
    id: "prog-mph",
    kind: "program",
    name: "Master of Public Health",
    subtitle: "School of Technology for Public Health",
    approved: true,
  },
  {
    id: "prog-desert",
    kind: "program",
    name: "Desert Humanities Initiative",
    subtitle: "The College of Liberal Arts and Sciences",
    approved: true,
  },
  {
    id: "fac-miller",
    kind: "faculty",
    name: "Jordan Miller",
    subtitle: "College of Health Solutions · Teaching Professor",
    email: "jordan.anne.miller@asu.edu",
    approved: true,
  },
  {
    id: "fac-ngo",
    kind: "faculty",
    name: "Christina Ngo",
    subtitle: "University Initiatives",
    approved: true,
  },
  {
    id: "org-prep",
    kind: "organization",
    name: "ASU Prep South Phoenix Primary/Intermediate School",
    approved: true,
  },
  {
    id: "inst-nyu",
    kind: "institution",
    name: "New York University",
    approved: true,
  },
]

export const DIRECTORY_MATCHES: DirectoryMatch[] = [
  {
    id: "match-chs",
    kind: "unit",
    label: "Units",
    query: "College of Health Solutions",
    tagId: "tag-chs",
    spanIds: ["tag-chs", "span-miller"],
    status: "direct",
    record: DIRECTORY.find((item) => item.id === "unit-chs"),
    note: "College of Health Solutions",
    why: "",
  },
  {
    id: "match-stph",
    kind: "unit",
    label: "Units",
    query: "School of Technology for Public Health",
    tagId: "tag-stph",
    spanIds: ["tag-stph", "span-miller"],
    status: "direct",
    record: DIRECTORY.find((item) => item.id === "unit-stph"),
    note: "School of Technology for Public Health",
    why: "",
  },
  {
    id: "match-health-tag",
    kind: "unit",
    label: "Units",
    query: "ASU Health",
    tagId: "tag-health",
    spanIds: ["tag-health"],
    status: "invite",
    note: "Not in Collaboratory",
    why: "",
  },
  {
    id: "match-mph",
    kind: "program",
    label: "Programs / Initiatives",
    query: "Master of Public Health",
    spanIds: ["span-miller"],
    status: "direct",
    record: DIRECTORY.find((item) => item.id === "prog-mph"),
    note: "Master of Public Health",
    why: "",
  },
  {
    id: "match-doing-well",
    kind: "program",
    label: "Programs / Initiatives",
    query: "Doing Well",
    spanIds: ["span-doing-well"],
    status: "invite",
    note: "Not in Collaboratory",
    why: "",
  },
  {
    id: "match-miller",
    kind: "faculty",
    label: "Faculty / Staff",
    query: "Jordan Miller",
    spanIds: ["span-miller"],
    status: "direct",
    record: DIRECTORY.find((item) => item.id === "fac-miller"),
    note: "Jordan Miller",
    why: "",
  },
  {
    id: "match-prep",
    kind: "organization",
    label: "Community Organizations",
    query: "ASU Prep South Phoenix",
    spanIds: [],
    status: "direct",
    record: DIRECTORY.find((item) => item.id === "org-prep"),
    note: "ASU Prep South Phoenix",
    why: "",
  },
  {
    id: "match-nyu",
    kind: "institution",
    label: "Other Institutions",
    query: "New York University",
    spanIds: [],
    status: "direct",
    record: DIRECTORY.find((item) => item.id === "inst-nyu"),
    note: "New York University",
    why: "",
  },
]

export type FocusTag = {
  id: string
  label: string
  on: boolean
  origin: "source" | "none"
}

export type FocusGroup = {
  group: string
  items: FocusTag[]
}

export const FOCUS_TAGS: FocusGroup[] = [
  {
    group: "Target population",
    items: [
      { id: "pop-infants", label: "Infants (0–5)", on: false, origin: "none" },
      { id: "pop-children", label: "Children (6–11)", on: true, origin: "source" },
      { id: "pop-youth", label: "Youth (12–17)", on: false, origin: "none" },
      { id: "pop-young", label: "Young adults (18–24)", on: false, origin: "none" },
      { id: "pop-adults", label: "Adults (25–64)", on: false, origin: "none" },
      { id: "pop-older", label: "Older adults (65+)", on: false, origin: "none" },
      { id: "pop-college", label: "College students", on: true, origin: "source" },
      { id: "pop-families", label: "Families", on: false, origin: "none" },
      { id: "pop-public", label: "General public", on: false, origin: "none" },
      { id: "pop-urban", label: "Urban communities", on: true, origin: "source" },
      { id: "pop-rural", label: "Rural communities", on: false, origin: "none" },
      { id: "pop-regional", label: "Regional towns / cities", on: false, origin: "none" },
      { id: "pop-women", label: "Women", on: false, origin: "none" },
      { id: "pop-men", label: "Men", on: false, origin: "none" },
      { id: "pop-immigrants", label: "Immigrants", on: false, origin: "none" },
      { id: "pop-refugees", label: "Refugees", on: false, origin: "none" },
      { id: "pop-indigenous", label: "Indigenous", on: false, origin: "none" },
      { id: "pop-hispanic", label: "Hispanic or Spanish origin", on: false, origin: "none" },
      { id: "pop-latino", label: "Latino", on: false, origin: "none" },
      { id: "pop-aa", label: "African American", on: false, origin: "none" },
      { id: "pop-api", label: "Asian / Pacific Islander", on: false, origin: "none" },
      { id: "pop-white", label: "White", on: false, origin: "none" },
      { id: "pop-lgb", label: "Gay, lesbian, and bisexual", on: false, origin: "none" },
      { id: "pop-disability", label: "Individuals with disabilities", on: false, origin: "none" },
    ],
  },
  {
    group: "Arts & Design",
    items: [
      { id: "arch", label: "Architecture", on: false, origin: "none" },
      { id: "cultural-inst", label: "Cultural institutions", on: false, origin: "none" },
      { id: "cultural-und", label: "Cultural understanding", on: false, origin: "none" },
      { id: "dance", label: "Dance", on: false, origin: "none" },
      { id: "design", label: "Design", on: false, origin: "none" },
      { id: "fashion", label: "Fashion", on: false, origin: "none" },
      { id: "film", label: "Film / media", on: false, origin: "none" },
      { id: "local-history", label: "Local history", on: false, origin: "none" },
      { id: "museums", label: "Museums", on: false, origin: "none" },
      { id: "music", label: "Music", on: false, origin: "none" },
      { id: "performing", label: "Performing arts", on: false, origin: "none" },
      { id: "visual", label: "Visual arts", on: false, origin: "none" },
      { id: "writing", label: "Writing / literature", on: false, origin: "none" },
    ],
  },
  {
    group: "Business",
    items: [
      { id: "career", label: "Career and professional development", on: false, origin: "none" },
      { id: "econ", label: "Community economics", on: false, origin: "none" },
      { id: "entrepreneur", label: "Entrepreneurship", on: false, origin: "none" },
      { id: "job-skill", label: "Job skill development", on: false, origin: "none" },
      { id: "small-biz", label: "Small business", on: false, origin: "none" },
      { id: "workforce", label: "Workforce development", on: false, origin: "none" },
    ],
  },
  {
    group: "Community Development",
    items: [
      { id: "housing-dev", label: "Housing", on: false, origin: "none" },
      { id: "neighborhoods", label: "Neighborhood development", on: true, origin: "source" },
      { id: "transport", label: "Transportation", on: true, origin: "source" },
      { id: "urban", label: "Urban / regional planning", on: true, origin: "source" },
    ],
  },
  {
    group: "Education",
    items: [
      { id: "adult-ed", label: "Adult education", on: false, origin: "none" },
      { id: "after-school", label: "After-school programs", on: false, origin: "none" },
      { id: "early-child", label: "Early childhood", on: false, origin: "none" },
      { id: "k12", label: "K-12", on: false, origin: "none" },
      { id: "higher-ed", label: "Higher education", on: true, origin: "source" },
      { id: "literacy", label: "Literacy", on: false, origin: "none" },
      { id: "mentoring", label: "Mentoring", on: false, origin: "none" },
      { id: "school-ready", label: "School readiness", on: false, origin: "none" },
      { id: "stem", label: "STEM", on: false, origin: "none" },
      { id: "special-ed", label: "Special education", on: false, origin: "none" },
      { id: "teacher", label: "Teacher preparation", on: false, origin: "none" },
      { id: "tutoring", label: "Tutoring", on: false, origin: "none" },
    ],
  },
  {
    group: "Environment",
    items: [
      { id: "air", label: "Air quality", on: true, origin: "source" },
      { id: "climate", label: "Climate change", on: false, origin: "none" },
      { id: "conservation", label: "Conservation", on: true, origin: "source" },
      { id: "energy", label: "Energy", on: false, origin: "none" },
      { id: "pollution", label: "Pollution", on: true, origin: "source" },
      { id: "recycling", label: "Recycling", on: false, origin: "none" },
      { id: "sustainability", label: "Sustainability", on: false, origin: "none" },
      { id: "water", label: "Water", on: false, origin: "none" },
      { id: "green-space", label: "Parks & green space", on: true, origin: "source" },
      { id: "wildlife", label: "Wildlife", on: false, origin: "none" },
    ],
  },
  {
    group: "Health",
    items: [
      { id: "aging", label: "Aging / older adults", on: false, origin: "none" },
      { id: "disease", label: "Disease prevention", on: true, origin: "source" },
      { id: "access", label: "Healthcare access", on: false, origin: "none" },
      { id: "mental-health", label: "Mental health", on: true, origin: "source" },
      { id: "nutrition", label: "Nutrition / food access", on: true, origin: "source" },
      { id: "nursing", label: "Nursing", on: false, origin: "none" },
      { id: "health-wellbeing", label: "Public health / well-being", on: true, origin: "source" },
      { id: "physical-activity", label: "Physical activity", on: true, origin: "source" },
      { id: "substance", label: "Substance use", on: false, origin: "none" },
    ],
  },
  {
    group: "Human Services",
    items: [
      { id: "child-welfare", label: "Child welfare", on: false, origin: "none" },
      { id: "counseling", label: "Counseling", on: false, origin: "none" },
      { id: "disability", label: "Disability issues", on: false, origin: "none" },
      { id: "family-svcs", label: "Family services", on: false, origin: "none" },
      { id: "food-security", label: "Food security", on: true, origin: "source" },
      { id: "homeless", label: "Homelessness", on: false, origin: "none" },
      { id: "housing", label: "Housing services", on: false, origin: "none" },
      { id: "poverty", label: "Poverty", on: false, origin: "none" },
      { id: "senior", label: "Senior services", on: false, origin: "none" },
      { id: "social-work", label: "Social work", on: false, origin: "none" },
    ],
  },
  {
    group: "Public Safety",
    items: [
      { id: "crime", label: "Crime prevention", on: true, origin: "source" },
      { id: "disaster", label: "Disaster preparedness", on: false, origin: "none" },
      { id: "emergency", label: "Emergency management", on: false, origin: "none" },
      { id: "justice", label: "Justice / legal services", on: false, origin: "none" },
      { id: "law", label: "Law enforcement", on: false, origin: "none" },
    ],
  },
  {
    group: "Social & Civic",
    items: [
      { id: "civil-rights", label: "Civil / human rights", on: false, origin: "none" },
      { id: "civic", label: "Civic engagement", on: true, origin: "source" },
      { id: "diversity", label: "Diversity & inclusion", on: false, origin: "none" },
      { id: "government", label: "Government", on: true, origin: "source" },
      { id: "immigration", label: "Immigration", on: false, origin: "none" },
      { id: "leadership", label: "Leadership", on: false, origin: "none" },
      { id: "lgbtq", label: "LGBTQ issues", on: false, origin: "none" },
      { id: "policy", label: "Public policy", on: true, origin: "source" },
      { id: "voting", label: "Voting / democracy", on: false, origin: "none" },
    ],
  },
]

export type ScholarshipChoice = {
  id: string
  label: string
  on: boolean
  origin: "source" | "none"
}

export type ScholarlyProduct = {
  id: string
  label: string
  expected: boolean
  achieved: boolean
  origin: "source" | "none"
  note?: string
}

export type GoalRow = {
  id: string
  label: string
  expected: boolean
  achieved: boolean
  origin: "source" | "none"
  note?: string
}

export const SCHOLARSHIP_INVOLVEMENT: ScholarshipChoice[] = [
  { id: "assistantship", label: "Assistantship", on: false, origin: "none" },
  { id: "cncs", label: "Corporation for National & Community Service", on: false, origin: "none" },
  { id: "fellowship", label: "Fellowship", on: false, origin: "none" },
  { id: "grad-research", label: "Graduate research", on: false, origin: "none" },
  { id: "internship", label: "Internship (community-based)", on: false, origin: "none" },
  {
    id: "employee",
    label: "Student employee (e.g., peer/reflection leader, work-study, etc.)",
    on: false,
    origin: "none",
  },
  { id: "student-group", label: "Student group", on: false, origin: "none" },
  { id: "ug-research", label: "Undergraduate research", on: false, origin: "none" },
  { id: "volunteer", label: "Volunteer", on: false, origin: "none" },
  { id: "other", label: "Other", on: false, origin: "none" },
]

export const SCHOLARSHIP_TYPES: ScholarshipChoice[] = [
  { id: "creative", label: "Creative Activity", on: false, origin: "none" },
  { id: "mixed", label: "Mixed/multiple methods", on: false, origin: "none" },
  { id: "qualitative", label: "Qualitative", on: false, origin: "none" },
  { id: "quantitative", label: "Quantitative", on: false, origin: "none" },
  { id: "other", label: "Other", on: false, origin: "none" },
]

export const SCHOLARLY_PRODUCTS: ScholarlyProduct[] = [
  { id: "article", label: "Article(s)/manuscript(s)", expected: false, achieved: false, origin: "none" },
  { id: "chapter", label: "Book chapter(s)", expected: false, achieved: false, origin: "none" },
  { id: "book", label: "Book(s)", expected: false, achieved: false, origin: "none" },
  { id: "presentation", label: "Conference presentation(s)", expected: false, achieved: false, origin: "none" },
  { id: "proceeding", label: "Conference proceeding(s)", expected: false, achieved: false, origin: "none" },
  { id: "course-design", label: "Course design", expected: false, achieved: false, origin: "none" },
  { id: "creative", label: "Creative product(s)", expected: false, achieved: false, origin: "none" },
  { id: "curricula", label: "Curricula/unit plan", expected: false, achieved: false, origin: "none" },
  { id: "edited", label: "Edited book(s)", expected: false, achieved: false, origin: "none" },
  { id: "exhibit", label: "Exhibit(s)", expected: false, achieved: false, origin: "none" },
  { id: "invention", label: "Invention(s) or Product(s)", expected: false, achieved: false, origin: "none" },
  { id: "lecture", label: "Lecture(s)", expected: false, achieved: false, origin: "none" },
  { id: "monograph", label: "Monograph(s)", expected: false, achieved: false, origin: "none" },
  { id: "noncredit", label: "Non-credit course(s)", expected: false, achieved: false, origin: "none" },
  { id: "patent", label: "Patent(s)", expected: false, achieved: false, origin: "none" },
  { id: "performance", label: "Performance(s)", expected: false, achieved: false, origin: "none" },
  { id: "evaluation", label: "Program evaluation(s)", expected: false, achieved: false, origin: "none" },
  { id: "tech-report", label: "Technical report(s)", expected: false, achieved: false, origin: "none" },
  { id: "video", label: "Video(s)/film(s)", expected: false, achieved: false, origin: "none" },
  { id: "website", label: "Website(s)", expected: false, achieved: false, origin: "none" },
  {
    id: "white",
    label: "White paper(s)",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Students write policy briefs.",
  },
  { id: "other", label: "Other", expected: false, achieved: false, origin: "none" },
]

export const GOAL_OUTPUTS: GoalRow[] = [
  {
    id: "boards",
    label: "Board(s) - Campus representation (e.g., commissions, task forces)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  { id: "camps", label: "Camp(s)", expected: false, achieved: false, origin: "none" },
  { id: "clinics", label: "Clinic(s)", expected: false, achieved: false, origin: "none" },
  { id: "consultation", label: "Consultation - Pro-bono", expected: false, achieved: false, origin: "none" },
  { id: "databases", label: "Database(s) - Community focused", expected: false, achieved: false, origin: "none" },
  { id: "drives", label: "Drive(s) (e.g., clothing, food)", expected: false, achieved: false, origin: "none" },
  {
    id: "ed-adult",
    label: "Education - Adult (e.g., non-credit, non-degree, personal improvement)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "ed-cont",
    label: "Education - Continuing (e.g., non-degree certification, CEU, professional development)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "event-ath",
    label: "Event(s) - Athletic or recreational (e.g., spectator or voluntary participant)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "event-cul",
    label: "Event(s) - Cultural (e.g., concert, exhibit, festival)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  { id: "testimony", label: "Expert testimony(ies)", expected: false, achieved: false, origin: "none" },
  {
    id: "media",
    label: "Media interview(s), op-ed article(s), editorial(s)",
    expected: false,
    achieved: true,
    origin: "source",
    note: "This ASU News interview.",
  },
  {
    id: "lectures",
    label: "Lecture(s) - community speech(es)",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Class advocacy work.",
  },
  {
    id: "policy",
    label: "Policy(ies)",
    expected: true,
    achieved: true,
    origin: "source",
    note: "Policy briefs and speed bumps.",
  },
  {
    id: "volunteer",
    label: "Volunteer support(s) - community event(s) or program(s)",
    expected: false,
    achieved: false,
    origin: "none",
    note: "Can't find any details.",
  },
  { id: "website", label: "Website(s) - Community", expected: false, achieved: false, origin: "none" },
  { id: "other", label: "Other", expected: false, achieved: false, origin: "none" },
]

export const GOAL_INSTITUTIONAL: GoalRow[] = [
  {
    id: "funding",
    label: "Funding - Activity (e.g., gifts, grants, contracts)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  { id: "interdisc", label: "Interdisciplinary opportunity(ies)", expected: false, achieved: false, origin: "none" },
  {
    id: "towngown",
    label: "Town-Gown relationship(s)",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Example only — not a reported ASU result.",
  },
  {
    id: "campus-events",
    label: "Community participation in campus event(s)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  { id: "stu-academic", label: "Student - Academic content", expected: false, achieved: false, origin: "none" },
  {
    id: "civic-know",
    label: "Student - Civic knowledge",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Advocacy assignment.",
  },
  {
    id: "stu-enroll",
    label: "Student - Enrollment from partner communities",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "stu-ethical",
    label: "Student - Ethical reasoning and action",
    expected: false,
    achieved: false,
    origin: "none",
  },
  { id: "stu-intercultural", label: "Student - Intercultural knowledge", expected: false, achieved: false, origin: "none" },
  {
    id: "stu-lifelong",
    label: "Student - Lifelong learning foundations and skills",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "stu-personal",
    label: "Student - Personal growth",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Students lobby local government.",
  },
  {
    id: "stu-professional",
    label: "Student - Professional growth",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Students lobby local government.",
  },
  { id: "stu-retention", label: "Student - Retention", expected: false, achieved: false, origin: "none" },
  { id: "other", label: "Other", expected: false, achieved: false, origin: "none" },
]

export const GOAL_COMMUNITY: GoalRow[] = [
  {
    id: "partnership",
    label: "Campus relationship(s) or partnership(s)",
    expected: false,
    achieved: false,
    origin: "none",
    note: "Can't find any details.",
  },
  {
    id: "connections",
    label: "Connection(s) to other community groups/network(s)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "cooperation",
    label: "Cooperation(s) (e.g., sharing/tag data systems)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "health",
    label: "Health(s) in a partner organization program(s)",
    expected: true,
    achieved: false,
    origin: "source",
    note: "Green space and gardens.",
  },
  { id: "awareness", label: "Public awareness", expected: false, achieved: false, origin: "none" },
  {
    id: "resource-qty",
    label: "Resource quantity(ies) (e.g., financial, staff, volunteers, information, publication)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  {
    id: "resource-use",
    label: "Resource usage (e.g., financial, staff, volunteer)",
    expected: false,
    achieved: false,
    origin: "none",
  },
  { id: "capacity", label: "Capacity to serve client(s)", expected: false, achieved: false, origin: "none" },
  { id: "services", label: "Service(s) to client(s)", expected: false, achieved: false, origin: "none" },
  { id: "volunteers", label: "Volunteer number(s)", expected: false, achieved: false, origin: "none" },
  { id: "other", label: "Other", expected: false, achieved: false, origin: "none" },
]

export function searchDirectory(kind: EntityKind, query: string) {
  const q = query.trim().toLowerCase()
  return DIRECTORY.filter(
    (item) =>
      item.kind === kind &&
      (item.name.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q))
  )
}

function isAsuOnlySubtitle(value: string) {
  const normalized = value.trim().toLowerCase().replace(/[.,]/g, "")
  return (
    normalized === "arizona state university" ||
    normalized === "asu" ||
    normalized === "arizona state university (asu)" ||
    normalized === "asu arizona state university"
  )
}

function isAddressLikeSubtitle(value: string) {
  const text = value.trim()
  if (!text) return false
  if (/\b\d{5}(?:-\d{4})?\b/.test(text)) return true
  if (
    /\b\d{1,6}\s+\S.*\b(ave|avenue|st|street|blvd|boulevard|rd|road|dr|drive|ln|lane|way|ct|court|pkwy|parkway|hwy|highway|pl|place|cir|circle|ter|terrace)\b/i.test(
      text
    )
  ) {
    return true
  }
  if (/\b[A-Za-z][A-Za-z .'-]+,\s*[A-Z]{2}\b/.test(text)) return true
  if (/,\s*(US|USA|United States)\s*$/i.test(text)) return true
  return false
}

export function displaySubtitle(subtitle?: string) {
  if (!subtitle) return undefined
  const parts = subtitle
    .split(/\s*[·|—–]\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
  const kept = parts.filter((part) => !isAsuOnlySubtitle(part) && !isAddressLikeSubtitle(part))
  if (kept.length === 0) return undefined
  return kept.join(" · ")
}

export function kindLabel(kind: EntityKind) {
  switch (kind) {
    case "unit":
      return "Unit"
    case "program":
      return "Program"
    case "faculty":
      return "Faculty / Staff"
    case "organization":
      return "Community organization"
    case "institution":
      return "Other institution"
  }
}
