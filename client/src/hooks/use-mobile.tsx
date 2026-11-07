import * as React from "react"
import { initialClientState } from "@/lib/hydration"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Prerender has no window and renders mobile; hydration keeps that first render (it must match the
  // prerendered HTML) and the effect below sets the real width. A client-only render reads it up front.
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    initialClientState(true, () => window.innerWidth < MOBILE_BREAKPOINT),
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
