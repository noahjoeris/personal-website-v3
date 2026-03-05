const FALLBACK_BREAKPOINTS = {
  tablet: '48rem',
  desktop: '64rem',
} as const

type Breakpoint = keyof typeof FALLBACK_BREAKPOINTS

function getBreakpointValue(breakpoint: Breakpoint) {
  if (typeof window === 'undefined') {
    return FALLBACK_BREAKPOINTS[breakpoint]
  }

  const cssVariable = `--breakpoint-${breakpoint}`
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVariable).trim()

  return value || FALLBACK_BREAKPOINTS[breakpoint]
}

export function matchesMinBreakpoint(breakpoint: Breakpoint) {
  if (typeof window === 'undefined') {
    return false
  }

  return window.matchMedia(`(min-width: ${getBreakpointValue(breakpoint)})`).matches
}
