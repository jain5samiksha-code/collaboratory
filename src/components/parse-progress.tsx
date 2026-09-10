"use client"

import dynamic from "next/dynamic"
import { Check, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PARSE_BEATS } from "@/lib/fields"
import { cn } from "@/lib/utils"

const DocumentParseAnimation = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => <div className="size-48" aria-hidden />,
  }
)

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function ParseProgress({
  beatIndex,
  elapsed,
  onSkip,
}: {
  beatIndex: number
  elapsed: number
  onSkip: () => void
}) {
  const currentIndex = Math.min(beatIndex, PARSE_BEATS.length - 1)
  const progress = Math.round(
    (Math.min(beatIndex, PARSE_BEATS.length) / PARSE_BEATS.length) * 100
  )

  return (
    <div className="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-muted/40 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardContent className="space-y-6 pt-4">
          <div className="flex flex-col items-center text-center">
            <DocumentParseAnimation
              src="/animations/document-parsing.lottie"
              loop
              autoplay
              className="size-48"
              style={{ width: 192, height: 192 }}
              aria-hidden
            />
            <h1 className="font-heading mt-2 text-2xl font-semibold tracking-tight">
              Filling your activity
            </h1>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-primary">
              <Clock className="size-3.5" />
              Time elapsed: {formatElapsed(elapsed)} minutes
            </p>
          </div>

          <Progress value={progress} />

          <ol className="space-y-5">
            {PARSE_BEATS.map((step, index) => {
              const done = beatIndex > index
              const active = currentIndex === index && beatIndex < PARSE_BEATS.length
              return (
                <li key={step.id} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      done && "bg-primary text-primary-foreground",
                      active && "bg-primary text-primary-foreground",
                      !done && !active && "bg-primary/10 text-primary"
                    )}
                  >
                    {done ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip to review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
