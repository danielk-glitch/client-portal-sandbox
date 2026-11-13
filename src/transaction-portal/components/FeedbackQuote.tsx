import type { ComponentProps } from 'react'
import { Box, Rating, Typography } from '@mui/material'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import type { ShowingFeedback } from '../types'
import './feedback-quote.css'

/** Buyer interest from a showing, as five hearts. */
export function InterestRating({ value }: { value: number }) {
  return (
    <Rating
      value={value}
      max={5}
      readOnly
      size="small"
      icon={<Favorite fontSize="inherit" />}
      emptyIcon={<FavoriteBorder fontSize="inherit" />}
      aria-label={`Interest ${value} out of 5`}
      className="interest-rating"
    />
  )
}

/**
 * One piece of showing feedback: interest hearts, the quote, then “showing type · date”.
 * Children sit directly in the root, so a parent layout can place them on a grid.
 */
export function FeedbackQuote({ feedback, size = 'm', className, quoteClassName, metaClassName, ...boxProps }: Omit<ComponentProps<typeof Box>, 'children'> & {
  feedback: ShowingFeedback
  /** l for a featured quote, m inside denser cards. */
  size?: 'm' | 'l'
  quoteClassName?: string
  metaClassName?: string
}) {
  return (
    <Box {...boxProps} className={['feedback-quote', className].filter(Boolean).join(' ')}>
      <InterestRating value={feedback.interest} />
      <Typography variant={size === 'l' ? 'bodyLStandard' : 'bodyMStandard'} component="p" className={['feedback-quote-text', quoteClassName].filter(Boolean).join(' ')}>“{feedback.feedback}”</Typography>
      <Typography variant="bodySStandard" component="p" className={['feedback-quote-meta', metaClassName].filter(Boolean).join(' ')}>{feedback.showingType} · {feedback.date}</Typography>
    </Box>
  )
}
