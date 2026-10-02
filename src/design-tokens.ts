export type TypographyToken = {
  fontFamily: string
  fontWeight: number
  fontSize: string
  lineHeight: number
  letterSpacing: string
}

// Named to match the Figma styles while remaining easy to use as MUI variants.
export const typographyTokens = {
  displayL: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "3.5rem",
    lineHeight: 1.071429,
    letterSpacing: "-0.02em",
  },
  displayM: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "2.75rem",
    lineHeight: 1.090909,
    letterSpacing: "-0.018em",
  },
  displayS: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "2.25rem",
    lineHeight: 1.111111,
    letterSpacing: "-0.014em",
  },
  titleL: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "2rem",
    lineHeight: 1.125000,
    letterSpacing: "-0.01em",
  },
  titleM: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "1.5rem",
    lineHeight: 1.166667,
    letterSpacing: "-0.005em",
  },
  titleS: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "1.25rem",
    lineHeight: 1.200000,
    letterSpacing: "0em",
  },
  titleXS: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.250000,
    letterSpacing: "0em",
  },
  bodyLStandard: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "1.125rem",
    lineHeight: 1.555556,
    letterSpacing: "0em",
  },
  bodyMStandard: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.500000,
    letterSpacing: "0em",
  },
  bodySStandard: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.428571,
    letterSpacing: "0em",
  },
  bodyMCompact: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "1rem",
    lineHeight: 1.250000,
    letterSpacing: "0em",
  },
  bodySCompact: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 400,
    fontSize: "0.875rem",
    lineHeight: 1.285714,
    letterSpacing: "0em",
  },
  labelM: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.285714,
    letterSpacing: "0.005em",
  },
  labelS: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "0.75rem",
    lineHeight: 1.333333,
    letterSpacing: "0.01em",
  },
  metricL: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "2rem",
    lineHeight: 1.125000,
    letterSpacing: "-0.01em",
  },
  metricM: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "1.5rem",
    lineHeight: 1.166667,
    letterSpacing: "-0.005em",
  },
  metricS: {
    fontFamily: 'Manrope, "Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 500,
    fontSize: "1rem",
    lineHeight: 1.250000,
    letterSpacing: "0em",
  },
} satisfies Record<string, TypographyToken>
