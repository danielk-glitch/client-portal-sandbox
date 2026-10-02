import { createTheme } from '@mui/material/styles'
import { typographyTokens as type } from './design-tokens'

const color = (token: string) => `var(--color-semantic-${token})`
const primitive = (token: string) => `var(--color-primitive-${token})`

export const theme = createTheme({
  colorSpace: 'oklch',
  palette: {
    mode: 'light',
    primary: {
      main: color('surface-reverse-primary'),
      light: color('surface-reverse-secondary'),
      dark: color('surface-reverse-primary'),
      contrastText: color('text-on-color-primary'),
    },
    secondary: {
      main: color('surface-reverse-secondary'),
      light: color('surface-reverse-secondary'),
      dark: color('surface-reverse-primary'),
      contrastText: color('text-on-color-primary'),
    },
    info: {
      main: primitive('blue-600'),
      light: primitive('blue-400'),
      dark: primitive('blue-800'),
      contrastText: primitive('gray-50'),
    },
    success: {
      main: color('text-success'),
      light: color('text-success'),
      dark: color('text-success'),
      contrastText: color('surface-primary'),
    },
    warning: {
      main: color('text-caution'),
      light: color('text-caution'),
      dark: color('text-caution'),
      contrastText: color('surface-primary'),
    },
    error: {
      main: color('text-error'),
      light: color('text-error'),
      dark: color('text-error'),
      contrastText: color('surface-primary'),
    },
    background: {
      default: color('surface-primary'),
      paper: color('surface-primary'),
    },
    text: {
      primary: color('text-dark'),
      secondary: color('text-primary'),
      disabled: color('text-disabled'),
    },
    divider: color('stroke-primary-light'),
    action: {
      active: color('text-primary'),
      hover: color('surface-secondary'),
      selected: color('surface-primary-dark'),
      disabled: color('text-disabled'),
      disabledBackground: color('surface-primary-disabled'),
      focus: color('stroke-primary'),
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: type.bodyMStandard.fontFamily,
    ...type,
    h1: type.displayL,
    h2: type.titleM,
    h3: type.titleL,
    h4: type.titleM,
    h5: type.titleS,
    h6: type.titleXS,
    body1: type.bodyMStandard,
    body2: type.bodySStandard,
    subtitle1: type.titleM,
    subtitle2: type.titleS,
    caption: type.labelS,
    overline: { ...type.labelS, textTransform: 'uppercase' },
    button: { ...type.labelM, textTransform: 'none' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, minHeight: 44 },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: type.labelS,
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: { borderColor: color('stroke-primary-light') },
      },
    },
  },
})
