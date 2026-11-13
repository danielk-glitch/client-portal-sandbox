export type TypographyToken = {
  fontFamily: string
  fontWeight: string
  fontSize: string
  lineHeight: string
  letterSpacing: string
}

/** Points a text style at its CSS variables in design-tokens.css, so the values live in one place. */
const style = (name: string): TypographyToken => ({
  fontFamily: 'var(--font-family-sans)',
  fontWeight: `var(--type-${name}-weight)`,
  fontSize: `var(--type-${name}-size)`,
  lineHeight: `var(--type-${name}-line-height)`,
  letterSpacing: `var(--type-${name}-tracking)`,
})

// Named to match the Figma styles while remaining easy to use as MUI variants.
// labelXS (11px) is for counts beside labels and tiny markers only; never for sentences.
export const typographyTokens = {
  displayL: style('display-l'),
  displayM: style('display-m'),
  displayS: style('display-s'),
  titleL: style('title-l'),
  titleM: style('title-m'),
  titleS: style('title-s'),
  titleXS: style('title-xs'),
  bodyLStandard: style('body-l-standard'),
  bodyMStandard: style('body-m-standard'),
  bodySStandard: style('body-s-standard'),
  bodyMCompact: style('body-m-compact'),
  bodySCompact: style('body-s-compact'),
  labelM: style('label-m'),
  labelS: style('label-s'),
  labelXS: style('label-xs'),
  metricL: style('metric-l'),
  metricM: style('metric-m'),
  metricS: style('metric-s'),
} satisfies Record<string, TypographyToken>
