/**
 * Important notes · the right-rail block on V1 iteration 2 (replaces "Recent updates").
 * - Up to five notes. The team stars notes; starred ones lead, most recently starred first.
 *   With no starred notes, the newest notes lead. Clients can see a star but never set one.
 * - Notes are plain text, so each row is just the note, who added it, and when. Long notes cut off at three lines.
 * - A meeting note previews as its meeting title, never its raw summary markup.
 * - embedded: no card of its own, for sitting inside another card (the current seller portal's overview block).
 *   pinnedOnly limits it to starred notes, `title` renames the heading, and `limit` caps how many show (pinned first, then newest).
 * - A row opens the full note: its name line ends in a "View note →" that animates in on hover. "See all notes" (a TextLink) jumps to the Notes tab below, and only shows when some notes are not listed here.
 */
import { useState } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import StarRounded from '@mui/icons-material/StarRounded'
import { PlaceCard } from '../../components/PlaceCard'
import { PlaceModal } from '../../components/PlaceModal'
import { TextLink } from '../../components/TextLink'
import { MeetingNoteCard, NoteSeeMore } from '../../transaction-portal/components'
import { SectionLabel } from '../../components/SectionLabel'
import { PortalSectionHeader } from '../../components/PortalSection'
import { sortImportantNotes } from '../../transaction-portal/notes'
import { formatRowDate } from '../../transaction-portal/dates'
import type { TeamNote } from '../../transaction-portal/types'
import './important-notes.css'

export const importantNotesLimit = 5

export function ImportantNotes({ notes, onSeeAll, embedded = false, cardHeader = false, pinnedOnly = false, title = 'Important notes', emptyText = 'No notes yet.', limit = importantNotesLimit }: { notes: TeamNote[]; onSeeAll: () => void; embedded?: boolean; /** Embedded in a card: the card title style (PortalSectionHeader) instead of the on-page label. */ cardHeader?: boolean; pinnedOnly?: boolean; title?: string; emptyText?: string; limit?: number }) {
  // The note stays set while the dialog fades out, so its text doesn't blank mid-close.
  const [openNote, setOpenNote] = useState<TeamNote | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const shown = sortImportantNotes(pinnedOnly ? notes.filter((note) => note.starredAt) : notes).slice(0, limit)

  const body = (
    <>
      {embedded && !cardHeader ? <SectionLabel id="important-notes-title" component="h2">{title}</SectionLabel> : <PortalSectionHeader title={title} titleId="important-notes-title" prominent />}
      <Box className="portal-section-content">
        {shown.length === 0 ? (
          <Typography variant="bodySStandard" color="text.secondary">{emptyText}</Typography>
        ) : (
          <Box component="ol" className="important-notes-list">
            {shown.map((note) => (
              <Box component="li" key={note.id} className="important-note">
                <ButtonBase className="important-note-button" onClick={() => { setOpenNote(note); setDialogOpen(true) }} aria-haspopup="dialog" disableRipple>
                  <Typography component="span" variant="bodySStandard" className="important-note-text">{note.meeting ? note.meeting.title : note.body}</Typography>
                  <Box component="span" className="important-note-meta">
                    {note.starredAt && <StarRounded className="important-note-star" titleAccess="Important" />}
                    <Typography component="span" variant="labelS" className="important-note-author">{note.author}</Typography>
                    <Typography component="span" variant="labelS" aria-hidden="true">·</Typography>
                    <Typography component="span" variant="labelS" className="important-note-date">{formatRowDate(note.createdAt, { time: false })}</Typography>
                    <NoteSeeMore />
                  </Box>
                </ButtonBase>
              </Box>
            ))}
          </Box>
        )}
        {notes.length > shown.length && (
          <Box className="important-notes-more"><TextLink onClick={onSeeAll}>See all notes</TextLink></Box>
        )}
      </Box>

      <PlaceModal
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        size="m"
        title={openNote?.meeting ? 'Meeting note' : 'Note'}
        description={openNote && !openNote.meeting ? `Added by ${openNote.author} · ${openNote.createdAt}` : undefined}
        closeLabel="Close note"
      >
        {openNote?.meeting
          ? <MeetingNoteCard note={openNote} meeting={openNote.meeting} />
          : <Typography component="p" variant="bodyMStandard" className="important-note-full">{openNote?.body}</Typography>}
      </PlaceModal>
    </>
  )

  return embedded
    ? <Box component="section" className="important-notes important-notes--embedded" aria-labelledby="important-notes-title">{body}</Box>
    : <PlaceCard component="section" className="portal-section important-notes" aria-labelledby="important-notes-title">{body}</PlaceCard>
}
