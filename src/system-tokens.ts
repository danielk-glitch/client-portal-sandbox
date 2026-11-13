/**
 * PLACE system tokens for TypeScript: corner radius, elevation, and spacing.
 * These point at the CSS custom properties in `system-tokens.css`, so values live in one place.
 * Use them in the MUI theme and in `sx` props instead of raw numbers.
 */

export const radius = {
  '2xs': 'var(--radius-2xs)',
  xs: 'var(--radius-xs)',
  s: 'var(--radius-s)',
  m: 'var(--radius-m)',
  l: 'var(--radius-l)',
  pill: 'var(--radius-pill)',
  circle: 'var(--radius-circle)',
} as const

export const elevation = {
  0: 'var(--elevation-0)',
  1: 'var(--elevation-1)',
  2: 'var(--elevation-2)',
  3: 'var(--elevation-3)',
  onPhoto: 'var(--elevation-3-on-photo)',
} as const

export const space = {
  2: 'var(--space-2)',
  4: 'var(--space-4)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
  20: 'var(--space-20)',
  24: 'var(--space-24)',
  28: 'var(--space-28)',
  32: 'var(--space-32)',
  40: 'var(--space-40)',
  48: 'var(--space-48)',
  56: 'var(--space-56)',
  64: 'var(--space-64)',
  80: 'var(--space-80)',
} as const

/** Raw pixel values, for the few places that need a number (MUI `shape.borderRadius`, layout math). */
export const radiusPx = { '2xs': 4, xs: 8, s: 12, m: 20, l: 28, pill: 999 } as const

/** Motion durations in milliseconds, for APIs that take a number (MUI `transitionDuration`). Match `--motion-*` in CSS. */
export const motionMs = { press: 120, hover: 160, reveal: 200, overlay: 240 } as const

/** The six layout breakpoints, in px. CSS uses the same values; see system-tokens.css › Breakpoints. */
export const breakpoints = { smallPhone: 420, phone: 600, tablet: 768, laptop: 900, desktop: 1100, wide: 1280 } as const

/** Media query for screens narrower than a breakpoint, e.g. `useMediaQuery(below('phone'))`. */
export const below = (breakpoint: keyof typeof breakpoints) => `(max-width: ${breakpoints[breakpoint] - 0.05}px)`
