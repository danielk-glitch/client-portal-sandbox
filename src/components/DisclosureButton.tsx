import { ButtonBase, Typography } from '@mui/material'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import './disclosure-button.css'

/**
 * DisclosureButton · the one "show more / show less in place" control. Text plus a chevron that turns when open.
 * - placement "list": sits under a list, left aligned with the rows ("Show done").
 * - placement "cardFooter": the full-width last row of a card, above a hairline ("Show all details").
 * - count: optional, styled like a SectionLabel count. Use it when knowing how much is hidden helps decide whether to open it.
 * For going to another view, use TextLink instead.
 */
export function DisclosureButton({ open, onToggle, showLabel, hideLabel, count, controls, placement = 'list', className }: {
  open: boolean
  onToggle: () => void
  showLabel: string
  hideLabel: string
  count?: number
  /** id of the region this button shows and hides. */
  controls?: string
  placement?: 'list' | 'cardFooter'
  className?: string
}) {
  const classes = ['disclosure-button', `disclosure-button--${placement === 'cardFooter' ? 'card-footer' : 'list'}`, open ? 'is-open' : '', className].filter(Boolean).join(' ')
  return (
    <ButtonBase className={classes} onClick={onToggle} aria-expanded={open} aria-controls={controls} disableRipple>
      <Typography variant="labelM" component="span">
        {open ? hideLabel : showLabel}
        {!open && count !== undefined && <span className="disclosure-button-count">{count}</span>}
      </Typography>
      <ExpandMoreRounded className="disclosure-button-chevron" aria-hidden="true" />
    </ButtonBase>
  )
}
