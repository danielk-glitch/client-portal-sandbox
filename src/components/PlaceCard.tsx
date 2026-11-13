import { forwardRef } from 'react'
import { Paper, type PaperProps } from '@mui/material'
import './place-card.css'

/**
 * PlaceCard · the one card surface. White, `--radius-m`, `--elevation-1`, no stroke, `--padding-card` inside.
 * - padding "none": for cards whose content runs edge to edge (a photo on top, a full-width footer toggle).
 * - interactive: lifts to `--elevation-2` on hover. Use only when the whole card is one click target.
 * Never restyle a card's radius, shadow, or stroke locally. If a surface needs a different treatment, it is not a card.
 */
export type PlaceCardProps = Omit<PaperProps, 'variant' | 'elevation'> & {
  padding?: 'default' | 'none'
  interactive?: boolean
}

export const PlaceCard = forwardRef<HTMLDivElement, PlaceCardProps>(function PlaceCard({ padding = 'default', interactive = false, className, ...props }, ref) {
  const classes = ['place-card', padding === 'none' ? 'place-card--flush' : '', interactive ? 'place-card--interactive' : '', className].filter(Boolean).join(' ')
  return <Paper ref={ref} elevation={0} {...props} className={classes} />
})
