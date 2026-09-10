"use client"

import { useCallback, useRef, useState } from "react"

export function useExclusiveOpen(initial: string | null = null) {
  const [openId, setOpenId] = useState<string | null>(initial)
  const rootRef = useRef<HTMLDivElement>(null)

  const onPointerDownCapture = useCallback((event: React.PointerEvent) => {
    const item = (event.target as HTMLElement).closest("[data-open-id]")
    if (!item) setOpenId(null)
  }, [])

  function toggle(id: string) {
    setOpenId((current) => (current === id ? null : id))
  }

  return { openId, setOpenId, toggle, rootRef, onPointerDownCapture }
}
