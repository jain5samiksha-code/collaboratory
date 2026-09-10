import type { ArticleBlock } from "./types"

export const SOURCE = {
  url: "https://news.asu.edu/b/20260122-how-your-neighborhood-affects-your-health",
  outlet: "ASU News",
  published: "January 22, 2026",
  byline: "Natasha Burrell",
  title: "How your neighborhood affects your health",
}

export const ARTICLE_IMAGES = {
  hero: {
    src: "https://news.asu.edu/sites/default/files/styles/block_image_16_9_lge/public/2026-01/Doing%20Well%20Built%20Environment%20Story%20Image.png?itok=leO5XwZq",
    alt: "Illustration showing two people using phones to locate a grocery store; one map displays a 45-minute route and the other a 10-minute route, highlighting differences in access to nearby groceries.",
    caption: "Illustration by Kyla Manzutto.",
    label: "Grocery access",
  },
  garden: {
    src: "https://news.asu.edu/sites/default/files/styles/full_body_width/public/2026-01/Built_Environment_NL_02.png?itok=NRW_SULk",
    alt: "Illustration showing community members gardening together in raised beds, holding plants and tending crops in a shared outdoor space.",
    caption: "Illustration by Kyla Manzutto.",
    label: "Community garden",
  },
} as const

const LINKS = {
  doingWell:
    "https://doingwellnews.substack.com/p/your-neighborhood-affects-your-health?open=false",
  subscribe: "https://doingwellnews.substack.com/",
  burrell: "https://search.asu.edu/profile/2230871",
  miller: "https://search.asu.edu/profile/2763979",
  chs: "https://chs.asu.edu/",
  stph: "https://publichealthtech.asu.edu/",
  live: "https://www.rwjf.org/en/insights/our-research/interactives/whereyouliveaffectshowlongyoulive.html",
  bikeLanes:
    "https://news.unm.edu/news/study-shows-protected-bike-lanes-increase-bicycle-commuting",
  foodDesert: "https://foodispower.org/access-health/food-deserts/",
  foodSwamps: "https://www.healthline.com/nutrition/food-swamps",
  asthma: "https://www.lung.org/blog/asthma-and-air-pollution",
  cohesionScience:
    "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/social-cohesion",
  reciprocal: "https://www.verywellmind.com/what-is-reciprocal-determinism-2795907",
  opEd: "https://www.theopedproject.org/resources",
  policyBrief: "https://idrc-crdi.ca/en/funding/resources-idrc-grantees/how-write-policy-brief",
  cohesionHealth:
    "https://odphp.health.gov/healthypeople/priority-areas/social-determinants-health/literature-summaries/social-cohesion",
  detroit:
    "https://www.oneearth.org/from-urban-gardens-to-agrihoods-the-rise-of-agricultural-neighborhoods-in-detroit/",
  tagHealth: "https://news.asu.edu/colleges-and-units/asu-health",
  tagStph: "https://news.asu.edu/colleges-and-units/school-technology-public-health",
  tagChs: "https://news.asu.edu/colleges-and-units/college-health-solutions",
}

export const ARTICLE: ArticleBlock[] = [
  {
    kind: "kicker",
    spans: [{ text: "ASU News  ·  College of Health Solutions" }],
  },
  {
    kind: "h1",
    spans: [
      {
        id: "span-title",
        text: "How your neighborhood affects your health",
      },
    ],
  },
  {
    kind: "dek",
    spans: [
      {
        id: "span-dek",
        text: "ASU health professor shares insight into how our built environment influences our habits, quality of life.",
      },
    ],
  },
  {
    kind: "meta",
    spans: [
      { text: "By " },
      { id: "span-burrell", text: "Natasha Burrell", href: LINKS.burrell },
      { text: "  ·  January 22, 2026  ·  Illustration by Kyla Manzutto" },
    ],
  },
  {
    kind: "figure",
    src: ARTICLE_IMAGES.hero.src,
    alt: ARTICLE_IMAGES.hero.alt,
    spans: [{ id: "span-image-hero", text: ARTICLE_IMAGES.hero.caption }],
  },
  {
    kind: "quote",
    spans: [
      { text: "This interview was originally published in " },
      { id: "span-doing-well", text: "Doing Well", href: LINKS.doingWell },
      {
        text: ", a health news outlet from ASU Media Enterprise and ASU Learning Enterprise. ",
      },
      { text: "Subscribe to Doing Well", href: LINKS.subscribe },
      { text: " to get interviews with health experts delivered to your inbox weekly." },
    ],
  },
  {
    kind: "p",
    spans: [
      {
        text: "The places we live quietly shape our health every day — often in ways we don’t realize. ",
      },
      {
        id: "span-built",
        text: "The built environment that surrounds us — sidewalks, grocery stores, public transportation, lighting and access to green space — influences how much we move, what we eat, the air we breathe, and even how safe and connected we feel in our own neighborhoods.",
      },
      {
        text: " In turn, these influences, in combination with factors like housing, education and access to health care, can determine ",
      },
      { text: "how long we live", href: LINKS.live },
      { text: " and the quality of our lives." },
    ],
  },
  {
    kind: "p",
    spans: [
      { text: "These influences are the research focus of " },
      { id: "span-miller", text: "Jordan Miller", href: LINKS.miller },
      { text: ", a professor at Arizona State University's " },
      { text: "College of Health Solutions", href: LINKS.chs },
      { text: " and " },
      { text: "School of Technology for Public Health", href: LINKS.stph },
      {
        text: ". In the Q&A below, Miller talks about how built environments influence our health, why green spaces matter, and what we can do to advocate for healthier spaces in our own communities.",
      },
    ],
  },
  {
    kind: "h2",
    spans: [{ text: "How does our built environment impact our health?" }],
  },
  {
    kind: "p",
    spans: [
      {
        id: "span-health-focus",
        text: "Our built environment impacts our physical, emotional and mental health. ",
      },
      {
        text: "If you have good walking paths, people are more likely to walk. Safe, protected bike lanes make people ",
      },
      { text: "more likely", href: LINKS.bikeLanes },
      {
        text: " to ride. Lighting and safety have a real impact on whether we walk or bike outside our homes.",
      },
    ],
  },
  {
    kind: "p",
    spans: [
      { text: "The food environment matters too. In " },
      { id: "span-population", text: "food deserts", href: LINKS.foodDesert },
      {
        text: ", people don’t have access to affordable produce close enough that they’ll go buy it. In ",
      },
      { text: "food swamps", href: LINKS.foodSwamps },
      {
        text: ", fast food dominates. People in rural areas may only have so far they can travel for fresh produce. And if you live closer to a highway where there’s a lot of exhaust, ",
      },
      { text: "kids are more likely to develop asthma", href: LINKS.asthma },
      { text: "." },
    ],
  },
  {
    kind: "p",
    spans: [
      {
        id: "span-research",
        text: "The area that I’ve done the most research in is the impacts of green space on health. Even just walking in sight of green space lowers our heart rate and blood pressure. It has measurable effects on mood and mental well-being and connects us socially.",
      },
    ],
  },
  {
    kind: "p",
    spans: [
      {
        id: "span-gardens",
        text: "I’ve done research on the impacts of community gardens, specifically on crime, and we find the same benefits as most green spaces and parks, plus they yield food. They bring people together, create more ",
      },
      { text: "social cohesion", href: LINKS.cohesionScience },
      {
        text: ", and that does a lot for building up really healthful neighborhoods. Both green space and community gardens reduce crime in neighborhoods.",
      },
    ],
  },
  {
    kind: "h2",
    spans: [{ text: "A place that shaped this work" }],
  },
  {
    kind: "p",
    spans: [
      {
        id: "span-arizona",
        text: "I have to say it’s moving to Arizona. I like hiking and biking and being in nature. When I moved to Arizona, I found that it was so hot and there were so few sidewalks. I remember walking to Target and there was no sidewalk. I gained quite a bit of weight when I first moved to Arizona because my physical activity levels just changed a lot based on those neighborhood features.",
      },
    ],
  },
  {
    kind: "h2",
    spans: [{ text: "Students advocating for healthier neighborhoods" }],
  },
  {
    kind: "p",
    spans: [
      { text: "There’s a concept called " },
      { text: "reciprocal determinism", href: LINKS.reciprocal },
      {
        text: ": a triangle between an individual, their environment, and social norms.",
      },
    ],
  },
  {
    kind: "p",
    spans: [
      {
        id: "span-students",
        text: "I have students who are really interested in biking, and they will develop advocacy campaigns to improve the bike lanes and safety for bikers where they live. If they’re successful, and a city or town builds more bike lanes, more people will use them. Social norms change. A workplace might see that 60% of employees bike to work and add bike storage and showers. It’s a self-reinforcing cycle.",
      },
    ],
  },
  {
    kind: "p",
    spans: [
      {
        id: "span-course",
        text: "I’m always inspired by my students. I have an assignment in one of my classes where they can take direct action for advocacy. I’ve seen a student lobby her city government to include more speed bumps in her neighborhood, and then she raised the money to have them installed.",
      },
    ],
  },
  {
    kind: "p",
    spans: [
      { text: "People can raise awareness. You can " },
      { text: "learn to write an op-ed", href: LINKS.opEd },
      { text: ", or " },
      { text: "how to write a policy brief", href: LINKS.policyBrief },
      { text: ". " },
      {
        id: "span-policy",
        text: "The student who advocated for the speed bumps wrote a policy brief in my class — a form of communicating scientific information in a very straightforward way for decision-makers. When she brought that to the county government, they were impressed. They’d never seen someone come prepared with a policy brief before.",
      },
    ],
  },
  {
    kind: "h2",
    spans: [{ text: "Social connection and what comes next" }],
  },
  {
    kind: "p",
    spans: [
      { text: "Community gardens impact " },
      { id: "span-impact", text: "social cohesion", href: LINKS.cohesionHealth },
      {
        text: ". Working on a garden together builds bonds of trust. These community projects are a great excuse for people to come together, and a sense of community and of feeling cared about can extend our lives.",
      },
    ],
  },
  {
    kind: "p",
    spans: [
      {
        text: "The city of Detroit is an example. Citizens created gardens, city beekeeping, and food growing on vacant land — a ",
      },
      { text: "story of hope and resilience", href: LINKS.detroit },
      { text: "." },
    ],
  },
  {
    kind: "figure",
    src: ARTICLE_IMAGES.garden.src,
    alt: ARTICLE_IMAGES.garden.alt,
    spans: [{ id: "span-image-garden", text: ARTICLE_IMAGES.garden.caption }],
  },
  {
    kind: "tags",
    spans: [
      { id: "tag-health", text: "ASU Health", href: LINKS.tagHealth },
      { id: "tag-stph", text: "School of Technology for Public Health", href: LINKS.tagStph },
      { id: "tag-chs", text: "College of Health Solutions", href: LINKS.tagChs },
    ],
  },
]
