import { createTheme } from '@mui/material/styles'
import { typographyTokens as type } from './design-tokens'

const color = (token: string) => `var(--color-semantic-${token})`
const primitive = (token: string) => `var(--color-primitive-${token})`

export const primaryButtonHoverShadow = '0px 0px 12px 1px rgb(0 0 0 / 18%)'

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
      contrastText: primitive('neutral-50'),
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
      variants: [
        {
          props: { variant: 'onImagePrimary' },
          style: {
            color: primitive('neutral-800'),
            backgroundColor: primitive('base-white'),
            boxShadow: 'var(--elevation-raised)',
            '& .MuiButton-loadingIndicator': { color: primitive('neutral-800') },
            '&.MuiButton-loadingPositionCenter.MuiButton-loading': { color: 'transparent' },
            '&:hover': { backgroundColor: primitive('neutral-100') },
            '&:focus-visible': { outline: `2px solid ${primitive('neutral-800')}`, outlineOffset: 3 },
            '&.Mui-disabled': {
              color: `color-mix(in srgb, ${primitive('neutral-800')} 40%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${primitive('base-white')} 70%, transparent)`,
              boxShadow: 'none',
            },
          },
        },
        {
          props: { variant: 'onImageSecondary' },
          style: {
            color: primitive('base-white'),
            border: 0,
            '& .MuiButton-loadingIndicator': { color: primitive('base-white') },
            '&.MuiButton-loadingPositionCenter.MuiButton-loading': { color: 'transparent' },
            backgroundColor: `color-mix(in srgb, ${primitive('base-black')} 55%, transparent)`,
            '&:hover': { backgroundColor: `color-mix(in srgb, ${primitive('base-black')} 67%, transparent)` },
            '&:focus-visible': { outline: '2px solid currentColor', outlineOffset: 3 },
            '&.Mui-disabled': {
              color: `color-mix(in srgb, ${primitive('base-white')} 40%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${primitive('base-black')} 22%, transparent)`,
            },
          },
        },
      ],
      styleOverrides: {
        loadingIndicator: { color: color('text-primary') },
        sizeSmall: { ...type.labelS, minHeight: 44, padding: '8px 16px' },
        sizeMedium: { ...type.labelM, minHeight: 48, padding: '12px 20px' },
        sizeLarge: { ...type.titleXS, minHeight: 56, padding: '16px 24px' },
        root: {
          borderRadius: 999,
          paddingInline: 20,
          minHeight: 44,
          '&:where(.MuiButton-contained.MuiButton-colorPrimary:not(.Mui-disabled))': {
            backgroundColor: color('surface-reverse-secondary'),
            '&:hover': {
              backgroundColor: color('surface-reverse-secondary'),
              boxShadow: primaryButtonHoverShadow,
            },
          },
        },
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
    // PLACE menu: used by overflow (···) menus and Select dropdowns.
    MuiMenu: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        paper: {
          marginTop: 4,
          minWidth: 200,
          borderRadius: 12,
          border: `1px solid ${color('stroke-primary-light')}`,
          boxShadow: 'var(--elevation-document)',
          backgroundColor: color('surface-primary'),
        },
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          ...type.labelM,
          minHeight: 40,
          gap: 4,
          padding: '8px 12px',
          borderRadius: 8,
          color: color('text-dark'),
          transition: 'background-color 120ms ease-out',
          '&:hover, &.Mui-focusVisible': { backgroundColor: color('surface-primary-dark') },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: color('surface-secondary') },
          '& + &': { marginTop: 2 },
          // Destructive actions (delete, remove access) use the error text color and always open a confirmation.
          '&.is-destructive': { color: color('text-error') },
          '&.is-destructive .MuiListItemIcon-root': { color: color('text-error') },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 28, color: color('text-primary'), '& .MuiSvgIcon-root': { fontSize: 18 } },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: type.labelM,
      },
    },
  },
})
