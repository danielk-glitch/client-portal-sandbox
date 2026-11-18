import { createElement } from 'react'
import { createTheme } from '@mui/material/styles'
import { typographyTokens as type } from './design-tokens'
import { elevation, radius, radiusPx, space } from './system-tokens'
import { CheckboxIcon, ChipDeleteIcon, RadioIcon, SelectChevron } from './components/controlIcons'

const color = (token: string) => `var(--color-semantic-${token})`
const primitive = (token: string) => `var(--color-primitive-${token})`

/* Press fill: the click ripple. MUI draws it in the button's text color at 30% opacity, which read as heavy gray
   on white controls. A fixed light gray at the same opacity lands at about 93% lightness on white (hover is 97%),
   so pressing stays a quiet step darker than hover. */
export const pressFillColor = `color-mix(in oklch, ${primitive('neutral-300')} 50%, ${primitive('neutral-400')})`

/* Buttons shrink to 98% while pressed. Anything that sets its own `transition` on a button must include this. */
export const pressScale = 0.98
export const pressScaleTransition = 'scale var(--motion-press)'

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
  shape: { borderRadius: radiusPx.s },
  typography: {
    fontFamily: type.bodyMStandard.fontFamily,
    ...type,
    // MUI's default heading variants, mapped largest to smallest. Prefer the named PLACE variants in new code.
    h1: type.displayL,
    h2: type.titleL,
    h3: type.titleM,
    h4: type.titleS,
    h5: type.titleXS,
    h6: type.labelM,
    body1: type.bodyMStandard,
    body2: type.bodySStandard,
    subtitle1: type.titleM,
    subtitle2: type.titleS,
    caption: type.labelS,
    overline: { ...type.labelS, textTransform: 'uppercase' },
    button: { ...type.labelM, textTransform: 'none' },
  },
  components: {
    // MUI 9 only maps color="textSecondary"; the app writes color="text.secondary" (209 places), which MUI silently ignores.
    MuiTypography: {
      variants: [{ props: { color: 'text.secondary' }, style: { color: color('text-primary') } }],
    },
    // Every ButtonBase (buttons, icon buttons, tabs, menu items) draws its press ripple in this color.
    MuiButtonBase: {
      styleOverrides: {
        root: { '& .MuiTouchRipple-root': { color: pressFillColor } },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'onImagePrimary' },
          style: {
            color: primitive('neutral-800'),
            backgroundColor: primitive('base-white'),
            boxShadow: elevation[2],
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
            '&:focus-visible': { outline: 'var(--focus-ring-on-dark)', outlineOffset: 3 },
            '&.Mui-disabled': {
              color: `color-mix(in srgb, ${primitive('base-white')} 40%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${primitive('base-black')} 22%, transparent)`,
            },
          },
        },
      ],
      styleOverrides: {
        loadingIndicator: { color: color('text-primary') },
        // Small is the compact pill: 36px to the eye, with an invisible 44px touch target around it.
        sizeSmall: {
          ...type.labelS,
          position: 'relative',
          minHeight: 36,
          padding: `${space[6]} ${space[16]}`,
          '&::before': { content: '""', position: 'absolute', inset: '-4px 0' },
        },
        // Outlined: one hairline for every secondary pill ("Add to calendar", a linked document, filters).
        outlined: {
          borderColor: color('stroke-primary'),
          color: color('text-dark'),
          '&:hover': { borderColor: color('stroke-primary-dark'), backgroundColor: color('surface-primary-dark') },
          '&.MuiButton-sizeSmall:has(.MuiButton-startIcon)': { paddingLeft: space[12] },
          '&.MuiButton-sizeSmall .MuiButton-startIcon': { marginRight: space[6] },
          '&.MuiButton-sizeSmall .MuiButton-startIcon svg': { fontSize: 18 },
        },

        sizeMedium: { ...type.labelM, minHeight: 48, padding: '12px 20px' },
        sizeLarge: { ...type.titleXS, minHeight: 56, padding: '16px 24px' },
        root: {
          borderRadius: radius.pill,
          paddingInline: 20,
          minHeight: 44,
          transition: [
            'background-color var(--motion-hover)',
            'box-shadow var(--motion-hover)',
            'border-color var(--motion-hover)',
            'color var(--motion-hover)',
            pressScaleTransition,
          ].join(', '),
          '&:active:not(.Mui-disabled)': { scale: pressScale },
          // Dark filled buttons keep MUI's light-on-dark press highlight.
          '&.MuiButton-contained .MuiTouchRipple-root': { color: 'inherit' },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
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
    /* Tabs: one style for every tab bar. Each tab has 12px of padding so its hover fill has room around the label.
       The bar pulls out by the same amount (--row-hover-bleed), so labels still line up with the content edge.
       A hairline under a tab bar must be inset by the bleed too; see people-section.css. */
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 48, marginInline: 'calc(var(--row-hover-bleed) * -1)' },
        // The indicator spans the label only, not the tab's padding.
        indicator: { height: 2, backgroundColor: color('text-dark'), clipPath: 'inset(0 var(--row-hover-bleed))' },
        // A hidden scroll arrow takes no room, so the first tab stays flush with the content edge.
        scrollButtons: { '&.Mui-disabled': { width: 0, opacity: 0 } },
      },
    },
    MuiTab: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: {
          ...type.labelM,
          minWidth: 0,
          minHeight: 48,
          padding: `0 var(--row-hover-bleed)`,
          // The label sits at the bottom, centered in the hover fill, so it lines up however tall the bar is.
          justifyContent: 'flex-end',
          paddingBottom: 'calc(var(--space-4) + (44px - 1lh) / 2)',
          // 28px between labels: 4px between fills plus each tab's padding.
          marginRight: space[4],
          textTransform: 'none',
          color: color('text-primary'),
          isolation: 'isolate',
          transition: 'color var(--motion-hover)',
          // Hover fill: a 44px rounded block behind the label, ending 2px above the indicator.
          '&::before': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            insetInline: 0,
            bottom: space[4],
            height: 44,
            borderRadius: radius.xs,
            backgroundColor: 'transparent',
            transition: 'background-color var(--motion-hover)',
          },
          '&:last-of-type': { marginRight: 0 },
          '&.Mui-selected': { color: color('text-dark') },
          '&:hover': { color: color('text-dark') },
          '&:hover::before': { backgroundColor: color('surface-secondary') },
          '&:active::before': { backgroundColor: color('surface-secondary-dark') },
          '&.Mui-focusVisible': { outline: 'var(--focus-ring)', outlineOffset: -2, borderRadius: radius.xs },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none', '&::before': { transition: 'none' } },
        },
      },
    },
    /* Pagination: round, like every other small selectable control. */
    MuiPaginationItem: {
      defaultProps: { shape: 'circular' },
      styleOverrides: {
        root: { ...type.labelM, color: color('text-primary') },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: [
            'background-color var(--motion-hover)',
            pressScaleTransition,
          ].join(', '),
          '&:active:not(.Mui-disabled)': { scale: pressScale },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        },
      },
    },
    MuiChip: {
      defaultProps: { deleteIcon: createElement(ChipDeleteIcon) },
      styleOverrides: {
        label: type.labelS,
      },
    },
    MuiPaper: {
      styleOverrides: {
        // Outlined: one hairline for every secondary pill ("Add to calendar", a linked document, filters).
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
          borderRadius: radius.s,
          border: `1px solid ${color('stroke-primary-light')}`,
          boxShadow: elevation[2],
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
          borderRadius: radius.xs,
          color: color('text-dark'),
          transition: 'background-color var(--motion-hover)',
          '&:hover, &.Mui-focusVisible': { backgroundColor: color('surface-primary-dark') },
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: color('surface-secondary') },
          '& + &': { marginTop: 2 },
          // Destructive actions (delete, remove access) use the error text color and always open a confirmation.
          '&.is-destructive': { color: color('text-error') },
          '&.is-destructive .MuiListItemIcon-root': { color: color('text-error') },
        },
      },
    },
    /* ---------- Form controls ----------
       Text fields put a static label above a 48px box (44px when size="small"), never a floating, notched label.
       Focus darkens the border and adds a soft ring. Helper and error text sit 6px below. */
    MuiTextField: {
      defaultProps: { slotProps: { inputLabel: { shrink: true } } },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& > .MuiInputLabel-root + .MuiInputBase-root': { marginTop: 0 },
        },
      },
    },
    MuiInputLabel: {
      defaultProps: { shrink: true },
      styleOverrides: {
        root: {
          ...type.labelM,
          position: 'static',
          transform: 'none',
          maxWidth: '100%',
          marginBottom: 8,
          color: color('text-dark'),
          whiteSpace: 'normal',
          '&.Mui-focused': { color: color('text-dark') },
          '&.Mui-disabled': { color: color('text-primary') },
          '&.Mui-error': { color: color('text-error') },
        },
        asterisk: { color: color('text-primary') },
      },
    },
    MuiOutlinedInput: {
      defaultProps: { notched: false },
      styleOverrides: {
        root: {
          ...type.bodyMStandard,
          minHeight: 48,
          borderRadius: radius.s,
          color: color('text-dark'),
          backgroundColor: color('surface-primary'),
          transition: 'box-shadow var(--motion-hover)',
          '&:hover:not(.Mui-disabled, .Mui-error) .MuiOutlinedInput-notchedOutline': { borderColor: color('stroke-primary-dark') },
          '&.Mui-focused': { boxShadow: `0 0 0 3px color-mix(in oklch, ${color('text-dark')} 10%, transparent)` },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1, borderColor: color('text-dark') },
          '&.Mui-disabled': { backgroundColor: color('surface-primary-disabled') },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: color('stroke-primary-light') },
          '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: color('text-error') },
          '&.MuiInputBase-sizeSmall': { ...type.bodySStandard, fontSize: '1rem', minHeight: 44 },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        },
        input: {
          padding: '12px 14px',
          '&::placeholder': { color: color('text-light'), opacity: 1 },
          '&.Mui-disabled': { WebkitTextFillColor: color('text-primary') },
          '&::-webkit-calendar-picker-indicator': { opacity: 0.55, cursor: 'pointer' },
          '.MuiInputBase-sizeSmall &': { padding: '10px 14px' },
        },
        multiline: { padding: 0 },
        notchedOutline: {
          top: 0,
          borderColor: color('stroke-primary'),
          '& legend': { display: 'none' },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          ...type.labelS,
          margin: '6px 0 0',
          color: color('text-primary'),
          '&.Mui-error': { color: color('text-error') },
          '&.Mui-disabled': { color: color('text-light') },
        },
      },
    },
    MuiSelect: {
      defaultProps: { IconComponent: SelectChevron },
      styleOverrides: {
        icon: { right: 12, color: color('text-primary') },
        select: { '&.MuiOutlinedInput-input': { paddingRight: 44 } },
      },
    },
    MuiAutocomplete: {
      defaultProps: { popupIcon: createElement(SelectChevron) },
      styleOverrides: {
        inputRoot: { '&.MuiOutlinedInput-root': { padding: '6px 44px 6px 8px', gap: 4 } },
        input: { '&.MuiOutlinedInput-input.MuiAutocomplete-input': { padding: '6px 6px' } },
        endAdornment: { right: 10 },
        popupIndicator: { color: color('text-primary') },
        tag: {
          margin: 0,
          borderRadius: radius.pill,
          backgroundColor: color('surface-secondary'),
          '& .MuiChip-deleteIcon': { fontSize: 16, color: color('text-primary'), '&:hover': { color: color('text-dark') } },
        },
        paper: {
          marginTop: 4,
          borderRadius: radius.s,
          border: `1px solid ${color('stroke-primary-light')}`,
          boxShadow: elevation[2],
          backgroundColor: color('surface-primary'),
        },
        listbox: { padding: 6 },
        option: {
          '&.MuiAutocomplete-option': {
            ...type.labelM,
            minHeight: 40,
            padding: '8px 12px',
            borderRadius: radius.xs,
            color: color('text-dark'),
            '&.Mui-focused, &:hover': { backgroundColor: color('surface-primary-dark') },
            '&[aria-selected="true"], &[aria-selected="true"].Mui-focused': { backgroundColor: color('surface-secondary') },
          },
          '& + &': { marginTop: 2 },
        },
        noOptions: { ...type.labelM, color: color('text-primary') },
      },
    },
    MuiCheckbox: {
      defaultProps: { icon: createElement(CheckboxIcon), checkedIcon: createElement(CheckboxIcon, { checked: true }), disableRipple: true },
      styleOverrides: { root: { padding: 12 } },
    },
    MuiRadio: {
      defaultProps: { icon: createElement(RadioIcon), checkedIcon: createElement(RadioIcon, { checked: true }), disableRipple: true },
      styleOverrides: { root: { padding: 12 } },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: { marginLeft: -12 },
        label: { ...type.bodyMStandard, color: color('text-dark'), '&.Mui-disabled': { color: color('text-light') } },
      },
    },
    /* PLACE switch: a 44 × 24 pill with the thumb inside the track, centered in a 56 × 44 hit area. */
    MuiSwitch: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { width: 56, height: 44, padding: '10px 6px' },
        switchBase: {
          padding: 12,
          left: -4,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: color('surface-primary'),
            '& + .MuiSwitch-track': { opacity: 1, backgroundColor: color('surface-reverse-primary') },
          },
          '&.Mui-focusVisible + .MuiSwitch-track': { outline: 'var(--focus-ring)', outlineOffset: 2 },
          '&.Mui-disabled + .MuiSwitch-track': { opacity: 1, backgroundColor: color('stroke-primary-light') },
          '&.Mui-disabled.Mui-checked + .MuiSwitch-track': { backgroundColor: color('text-disabled') },
          '&.Mui-disabled .MuiSwitch-thumb': { boxShadow: 'none', backgroundColor: color('surface-primary') },
          '&:hover': { backgroundColor: 'transparent' },
        },
        thumb: {
          width: 20,
          height: 20,
          backgroundColor: color('surface-primary'),
          boxShadow: '0 1px 3px rgb(0 0 0 / 22%)',
        },
        track: {
          borderRadius: radius.pill,
          opacity: 1,
          backgroundColor: color('stroke-primary'),
          transition: 'background-color var(--motion-hover)',
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
