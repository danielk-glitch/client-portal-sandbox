import type { TypographyToken } from './design-tokens'

declare module '@mui/material/styles' {
  interface ThemeOptions {
    colorSpace?: 'oklch'
  }

  interface TypographyVariants {
    displayL: TypographyToken
    displayM: TypographyToken
    displayS: TypographyToken
    titleL: TypographyToken
    titleM: TypographyToken
    titleS: TypographyToken
    titleXS: TypographyToken
    bodyLStandard: TypographyToken
    bodyMStandard: TypographyToken
    bodySStandard: TypographyToken
    bodyMCompact: TypographyToken
    bodySCompact: TypographyToken
    labelM: TypographyToken
    labelS: TypographyToken
    metricL: TypographyToken
    metricM: TypographyToken
    metricS: TypographyToken
  }

  interface TypographyVariantsOptions {
    displayL?: TypographyToken
    displayM?: TypographyToken
    displayS?: TypographyToken
    titleL?: TypographyToken
    titleM?: TypographyToken
    titleS?: TypographyToken
    titleXS?: TypographyToken
    bodyLStandard?: TypographyToken
    bodyMStandard?: TypographyToken
    bodySStandard?: TypographyToken
    bodyMCompact?: TypographyToken
    bodySCompact?: TypographyToken
    labelM?: TypographyToken
    labelS?: TypographyToken
    metricL?: TypographyToken
    metricM?: TypographyToken
    metricS?: TypographyToken
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    displayL: true
    displayM: true
    displayS: true
    titleL: true
    titleM: true
    titleS: true
    titleXS: true
    bodyLStandard: true
    bodyMStandard: true
    bodySStandard: true
    bodyMCompact: true
    bodySCompact: true
    labelM: true
    labelS: true
    metricL: true
    metricM: true
    metricS: true
  }
}
