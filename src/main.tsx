import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import './fonts.css'
import './design-tokens.css'
import './system-tokens.css'
import './index.css'
import { PlaceToaster } from './components/PlaceToaster'
import App from './internal/SandboxApp.tsx'
import { theme } from './theme.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <PlaceToaster />
    </ThemeProvider>
  </StrictMode>,
)
