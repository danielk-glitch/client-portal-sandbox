import { render, screen, within } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { theme } from '../theme'
import { BuyerPortal } from './BuyerPortal'
import { buyerTimelineAt, todayFor } from './buyerTimelineData'

function renderAt(moment?: string) {
  window.history.replaceState(null, '', moment ? `/buyer/v1-iteration2?moment=${moment}` : '/buyer/v1-iteration2')
  return render(<ThemeProvider theme={theme}><BuyerPortal /></ThemeProvider>)
}

afterEach(() => window.history.replaceState(null, '', '/'))

describe('buyerTimelineAt', () => {
  it('works out stage and step status from today', () => {
    const timeline = buyerTimelineAt(todayFor('inspection'))
    expect(timeline.milestones.map((milestone) => milestone.status)).toEqual(['current', 'upcoming', 'upcoming', 'upcoming'])
    expect(timeline.nextStepId).toBe('b-disclosures')
    const steps = timeline.milestones[0].steps
    expect(steps.find((step) => step.id === 'b-earnest')?.status).toBe('complete')
    expect(steps.find((step) => step.id === 'b-inspection')?.status).toBe('upcoming')
  })

  it('moves to the move-in stage after closing and drops the countdown', () => {
    const timeline = buyerTimelineAt(todayFor('moved-in'))
    expect(timeline.milestones.map((milestone) => milestone.status)).toEqual(['complete', 'complete', 'complete', 'current'])
    expect(timeline.countdown).toBeUndefined()
    // An undated step in a finished stage counts as done.
    expect(timeline.milestones[1].steps.find((step) => step.id === 'b-loan-docs')?.status).toBe('complete')
  })
})

describe('BuyerPortal', () => {
  it('keeps the hero clean, leads the notes with the lender warning, and puts the agent under the notes', () => {
    renderAt()
    expect(screen.queryByRole('heading', { name: 'Day 4 of 10' })).not.toBeInTheDocument()
    expect(screen.queryByRole('list', { name: 'Key dates' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /View home details/ })).toBeInTheDocument()
    const notes = within(screen.getByRole('region', { name: 'Important notes' })).getAllByRole('listitem')
    expect(notes[0]).toHaveTextContent('Please hold off on all of these until after closing')
    expect(within(screen.getByRole('complementary', { name: 'Important notes and your agent' })).getByText('Your agent')).toBeInTheDocument()
  })

  it('shows the first 10 days when turned on in the design panel', () => {
    window.history.replaceState(null, '', '/buyer/v1-iteration2?tenDays=show')
    render(<ThemeProvider theme={theme}><BuyerPortal /></ThemeProvider>)
    expect(screen.getByRole('heading', { name: 'Day 4 of 10' })).toBeInTheDocument()
  })

  it('leaves seller-only content out', () => {
    renderAt()
    expect(screen.queryByRole('tab', { name: 'Open houses' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Market activity/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Copy listing link/i)).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Let us connect your services' })).toBeInTheDocument()
  })

  it('shows moving in and after closing once the buyer has moved in', () => {
    renderAt('moved-in')
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome home' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Moving in' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'After closing' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Day \d+ of 10/ })).not.toBeInTheDocument()
  })
})
