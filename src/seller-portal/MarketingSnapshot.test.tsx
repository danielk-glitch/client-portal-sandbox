import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it } from 'vitest'
import { theme } from '../theme'
import { futureMarketingSnapshot } from './futureSellerTransaction'
import { MarketingSnapshot } from './MarketingSnapshot'
import { sampleSellerTransaction } from './sellerTransaction'

describe('MarketingSnapshot feedback carousel', () => {
  it('cycles through feedback with its source and date', () => {
    render(
      <ThemeProvider theme={theme}>
        <MarketingSnapshot
          data={futureMarketingSnapshot}
          feedback={sampleSellerTransaction.feedback}
          onOpenDashboard={() => {}}
        />
      </ThemeProvider>,
    )

    const activeSlide = () => document.querySelector('.marketing-snapshot-feedback-slide[data-active="true"]')
    expect(activeSlide()).toHaveTextContent(sampleSellerTransaction.feedback[0].feedback)
    expect(activeSlide()).toHaveTextContent(sampleSellerTransaction.feedback[0].showingType)
    expect(activeSlide()?.querySelector('.MuiRating-root')).toHaveAttribute('aria-label', 'Interest 4 out of 5')
    expect(screen.queryByText('1 / 3')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Next showing feedback' }))
    expect(activeSlide()).toHaveTextContent(sampleSellerTransaction.feedback[1].feedback)
    expect(activeSlide()?.querySelector('.MuiRating-root')).toHaveAttribute('aria-label', 'Interest 3 out of 5')

    fireEvent.click(screen.getByRole('button', { name: 'Previous showing feedback' }))
    expect(activeSlide()).toHaveTextContent(sampleSellerTransaction.feedback[0].feedback)

    fireEvent.click(screen.getByRole('button', { name: 'Previous showing feedback' }))
    expect(activeSlide()).toHaveTextContent(sampleSellerTransaction.feedback[2].feedback)

    expect(screen.queryByRole('button', { name: 'See all showing feedback' })).not.toBeInTheDocument()
  })
})
