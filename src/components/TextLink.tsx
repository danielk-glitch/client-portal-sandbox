import type { ReactNode } from 'react'
import { ButtonBase, Typography } from '@mui/material'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import './text-link.css'

/**
 * TextLink · the one "go somewhere" link. Text plus an arrow, no fill or outline.
 * - direction "forward" (→): opens another view, a sheet, a modal, or jumps down the page ("See all notes").
 * - direction "back" (←): returns to where the reader was ("Back to pending"). The arrow leads.
 * - href: an external link. Shows the outward arrow (↗) and opens a new tab.
 * - tone "onDark": for the dark timeline band and photography.
 * For showing or hiding content in place, use DisclosureButton instead.
 */
export function TextLink({ children, onClick, href, direction = 'forward', tone = 'default', className, ...aria }: {
  children: ReactNode
  onClick?: () => void
  href?: string
  direction?: 'forward' | 'back'
  tone?: 'default' | 'onDark'
  className?: string
  'aria-label'?: string
  'aria-haspopup'?: 'dialog' | boolean
}) {
  const external = Boolean(href)
  const Icon = external ? ArrowOutwardRounded : direction === 'back' ? ArrowBackRounded : ArrowForwardRounded
  const classes = ['text-link', `text-link--${direction}`, tone === 'onDark' ? 'text-link--on-dark' : '', className].filter(Boolean).join(' ')
  const label = <Typography variant="labelM" component="span" className="text-link-label">{children}</Typography>
  const icon = <Icon className="text-link-icon" aria-hidden="true" />
  const content = direction === 'back' ? <>{icon}{label}</> : <>{label}{icon}</>
  return external
    ? <ButtonBase component="a" href={href} target="_blank" rel="noreferrer" className={classes} disableRipple {...aria}>{content}</ButtonBase>
    : <ButtonBase onClick={onClick} className={classes} disableRipple {...aria}>{content}</ButtonBase>
}
