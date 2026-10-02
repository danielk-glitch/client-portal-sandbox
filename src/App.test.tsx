import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it } from 'vitest'
import App from './App'
import { theme } from './theme'

describe('App', () => {
  it('shows the client portal design canvas', () => {
    window.history.replaceState(null, '', '/')
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>,
    )

    expect(screen.getByText('Prototype environment')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Component gallery' })).toHaveAttribute('href', '/components')
    expect(screen.queryByRole('link', { name: /browse the sandbox/i })).not.toBeInTheDocument()
  })

  it('shows only the customized MUI components in the gallery', () => {
    window.history.replaceState(null, '', '/components')
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>,
    )

    for (const name of ['Button', 'Chip', 'Paper', 'Typography']) {
      expect(screen.getByRole('heading', { name })).toBeInTheDocument()
    }
    expect(screen.queryByRole('heading', { name: 'TextField' })).not.toBeInTheDocument()
    window.history.replaceState(null, '', '/')
  })
})
