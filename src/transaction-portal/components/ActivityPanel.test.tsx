import { fireEvent, render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it } from 'vitest'
import { futureSellerTransaction } from '../../seller-portal/futureSellerTransaction'
import { theme } from '../../theme'
import { ActivityPanel } from './ActivityPanel'

describe('ActivityPanel', () => {
  it('shows 10 updates per page and the final remaining update', () => {
    render(
      <ThemeProvider theme={theme}>
        <ActivityPanel events={futureSellerTransaction.timeline} />
      </ThemeProvider>,
    )

    const history = screen.getByRole('region', { name: 'Activity history' })
    expect(history.querySelectorAll('.activity-event-row')).toHaveLength(10)
    expect(within(history).getByText('1–10 of 21 updates')).toBeInTheDocument()
    expect(within(history).getByText('Listing agreement signed')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 2' }))

    expect(history.querySelectorAll('.activity-event-row')).toHaveLength(10)
    expect(within(history).getByText('11–20 of 21 updates')).toBeInTheDocument()
    expect(within(history).queryByText('Listing agreement signed')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Go to page 3' }))

    expect(history.querySelectorAll('.activity-event-row')).toHaveLength(1)
    expect(within(history).getByText('21–21 of 21 updates')).toBeInTheDocument()
    expect(within(history).getByText('Listing consultation completed')).toBeInTheDocument()
  })
})
