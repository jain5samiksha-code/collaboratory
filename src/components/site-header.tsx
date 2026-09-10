import Link from "next/link"
import { FilePenLine } from "lucide-react"

export function SiteHeader({
  eyebrow,
  title,
}: {
  eyebrow?: string
  title: string
}) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FilePenLine className="size-4" />
          </span>
          <span className="text-body font-medium tracking-wide">Collaboratory</span>
        </Link>
        {eyebrow ? (
          <span className="text-muted-foreground text-body">/ {eyebrow}</span>
        ) : null}
        <span className="ml-auto hidden text-body text-muted-foreground sm:block">
          {title}
        </span>
      </div>
    </header>
  )
}
