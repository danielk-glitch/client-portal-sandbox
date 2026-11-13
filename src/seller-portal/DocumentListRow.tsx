/**
 * Document list row · one document (or document-like item) in a list.
 * Icon in a soft round badge, title with optional "Next step" tag, one line of meta,
 * then an optional PlaceTag sitting 12px from the chevron.
 * One look everywhere: rows sit flush with the column, hairlines between them, and the shared row hover
 * (DESIGN.md › List rows). There is no boxed variant.
 * - locked: shows a lock in the icon container; still opens when onOpen is given (to explain when it arrives)
 * - href: opens a link in a new tab, with an outward arrow instead of the chevron
 * - truncateMeta: keeps the meta line to one line with an ellipsis (a link's URL under its title)
 * - pinned: a small pin after the title, for documents the client pinned to the top
 */
import type { ReactNode } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import LockOutlined from '@mui/icons-material/LockOutlined'
import PushPin from '@mui/icons-material/PushPin'
import { PlaceTag } from '../components/PlaceTag'
import './document-list-row.css'

export type DocumentRowTag = {
  label: string
  /** quiet: outlined (default). strong: filled, only for items that truly need the client to act. */
  tone?: 'strong' | 'quiet'
}

export function DocumentListRow({ title, meta, tag, icon = <DescriptionOutlined />, next = false, done = false, locked = false, href, onOpen, label, truncateMeta = false, pinned = false }: {
  title: string
  meta?: ReactNode
  tag?: DocumentRowTag
  icon?: ReactNode
  next?: boolean
  done?: boolean
  locked?: boolean
  href?: string
  onOpen?: () => void
  /** Accessible name when the visible title needs more context. */
  label?: string
  truncateMeta?: boolean
  pinned?: boolean
}) {
  const classes = ['document-list-row', done ? 'is-done' : '', locked ? 'is-locked' : ''].filter(Boolean).join(' ')
  const interactive = Boolean(onOpen || href)
  const content = (
    <>
      <Box component="span" className="document-list-row-icon" aria-hidden="true">{locked ? <LockOutlined /> : icon}</Box>
      <Box component="span" className="document-list-row-copy">
        <Box component="span" className="document-list-row-title">
          <Typography variant="titleXS" component="span">{title}</Typography>
          {pinned && <PushPin className="document-list-row-pin" aria-hidden="true" />}
          {next && <Box component="span" className="timeline-next-tag">Next step</Box>}
        </Box>
        {meta && <Typography variant="labelS" component="span" className={truncateMeta ? 'document-list-row-meta document-list-row-meta--truncate' : 'document-list-row-meta'}>{meta}</Typography>}
      </Box>
      <Box component="span" className="document-list-row-end">
        {tag && <PlaceTag tone={tag.tone} className="document-list-row-tag">{tag.label}</PlaceTag>}
        {interactive && (href ? <ArrowOutwardRounded className="document-list-row-go" aria-hidden="true" /> : <ChevronRightRounded className="document-list-row-go" aria-hidden="true" />)}
      </Box>
    </>
  )

  return (
    <Box component="li" className="document-list-row-item">
      {!interactive
        ? <Box className={classes} aria-label={label}>{content}</Box>
        : href
          ? <ButtonBase component="a" href={href} target="_blank" rel="noreferrer" className={classes} aria-label={label} disableRipple>{content}</ButtonBase>
          : <ButtonBase className={classes} onClick={onOpen} aria-label={label} disableRipple>{content}</ButtonBase>}
    </Box>
  )
}
