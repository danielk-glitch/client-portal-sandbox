/** Standalone comparison entry, separate from the existing application. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import '../../fonts.css'
import '../../design-tokens.css'
import '../../system-tokens.css'
import '../../index.css'
import { theme } from '../../theme'
import { PlaceToaster } from '../../components/PlaceToaster'
import { HeroOptions } from './HeroOptions'

createRoot(document.getElementById('root')!).render(
  <StrictMode><ThemeProvider theme={theme}><CssBaseline /><HeroOptions /><PlaceToaster /></ThemeProvider></StrictMode>,
)
