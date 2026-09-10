"use client"

import { useEffect, useState } from "react"
import { Building2, Check, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  QUALIFY_QUESTIONS,
  classifyActivity,
  isQualifyComplete,
  type QualifyAnswers,
  type QualifyKey,
} from "@/lib/qualify"
import { cn } from "@/lib/utils"

export function QualifyDialog({
  open,
  onOpenChange,
  onContinue,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onContinue: (answers: QualifyAnswers) => void
}) {
  const [answers, setAnswers] = useState<QualifyAnswers>({})

  useEffect(() => {
    if (!open) setAnswers({})
  }, [open])

  const complete = isQualifyComplete(answers)
  const result = complete ? classifyActivity(answers) : null

  function choose(key: QualifyKey, value: boolean) {
    setAnswers((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-lg"
        showCloseButton
      >
        <Card>
          <CardContent className="space-y-6 pt-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="size-6" strokeWidth={1.6} />
                </span>
                <span className="text-muted-foreground">+</span>
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="size-6" strokeWidth={1.6} />
                </span>
              </div>
              <DialogTitle className="font-heading mt-4 text-h1 font-semibold tracking-tight">
                Create a new activity
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-sm text-body">
                Collaboratory is for work between an institution and community
                partner(s). Answer to see whether this is community engagement or
                public service.
              </DialogDescription>
            </div>

            <ol className="space-y-5">
              {QUALIFY_QUESTIONS.map((item, index) => {
                const value = answers[item.key]
                const done = value !== undefined
                return (
                  <li key={item.key} className="flex gap-3">
                    <span
                      className={cn(
                        "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-caption font-medium leading-none",
                        done
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : index + 1}
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-h3 font-semibold">{item.question}</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <ChoiceCard
                          selected={value === true}
                          onSelect={() => choose(item.key, true)}
                        >
                          Yes
                        </ChoiceCard>
                        <ChoiceCard
                          selected={value === false}
                          onSelect={() => choose(item.key, false)}
                        >
                          No
                        </ChoiceCard>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>

            <div className="flex items-center justify-between gap-3">
              <p className="text-body text-muted-foreground">
                {result ? result.title : "Answer all four to continue"}
              </p>
              <Button disabled={!complete} onClick={() => onContinue(answers)}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

function ChoiceCard({
  selected,
  onSelect,
  children,
}: {
  selected: boolean
  onSelect: () => void
  children: string
}) {
  return (
    <Button
      type="button"
      variant="outline"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "h-9 rounded-lg text-body font-medium",
        selected
          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary hover:bg-primary/15 hover:text-primary"
          : "text-muted-foreground"
      )}
    >
      {children}
    </Button>
  )
}
