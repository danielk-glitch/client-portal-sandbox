import { useLayoutEffect, useRef, useState } from 'react'
import { Avatar, Box, Button, ButtonBase, Divider, Typography } from '@mui/material'
import { PlaceCard } from '../../components/PlaceCard'
import StarRounded from '@mui/icons-material/StarRounded'
import { PlaceModal } from '../../components/PlaceModal'
import { formatRowDate } from '../dates'
import type { TeamNote } from '../types'
import { MeetingNoteCard } from './MeetingNoteCard'
import { NoteSeeMore } from './NoteSeeMore'
import './team-note-card.css'

/**
 * A written note, or a meeting note (audio, summary, transcript) when the note carries a recording.
 * Notes are plain text with no title. A star means the team marked the note important.
 */
export function TeamNoteCard({ note }: { note: TeamNote }) {
  return note.meeting ? <MeetingNoteCard note={note} meeting={note.meeting} /> : <WrittenNoteCard note={note} />
}

/**
 * Notes tab: every note as a list row (DESIGN.md › List rows), newest first as given.
 * Author photo leads; a meeting note shows its title, a written note leads with its text. Every row opens the full note.
 */
export function NotesPanel({ notes }: { notes: TeamNote[] }) {
  if (!notes.length) return <Typography variant="bodySStandard" color="text.secondary">No notes yet. Notes from your team will show up here.</Typography>
  return (
    <Box component="ol" className="note-list" aria-label="Notes">
      {notes.map((note) => (note.meeting
        ? <MeetingNoteCard key={note.id} note={note} meeting={note.meeting} variant="row" />
        : <WrittenNoteRow key={note.id} note={note} />))}
    </Box>
  )
}

function WrittenNoteRow({ note }: { note: TeamNote }) {
  const initials = note.author.split(/\s+/).map(part => part[0]).join('').slice(0, 2)
  const [open, setOpen] = useState(false)
  return (
    <Box component="li" className="note-row">
      <ButtonBase className="note-row-main" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Open note from ${note.author}`} disableRipple>
        <Avatar src={note.authorPhotoUrl} alt="" className="note-row-avatar">{initials}</Avatar>
        <Box component="span" className="note-row-copy">
          <Typography variant="bodyMStandard" component="span" className="note-row-text">{note.body}</Typography>
          <Typography variant="labelS" component="span" className="note-row-meta">
            {note.starredAt && <StarRounded titleAccess="Important" />}{note.author}<NoteSeeMore />
          </Typography>
        </Box>
        <Typography variant="labelS" component="span" className="note-row-date">{formatRowDate(note.createdAt)}</Typography>
      </ButtonBase>
      <PlaceModal open={open} onClose={() => setOpen(false)} size="m" title="Note" description={`Added by ${note.author} · ${note.createdAt}`} closeLabel="Close note">
        <Typography component="p" variant="bodyMStandard" className="team-note-modal-body">{note.body}</Typography>
      </PlaceModal>
    </Box>
  )
}

function WrittenNoteCard({ note }: { note: TeamNote }) {
  const initials = note.author.split(/\s+/).map(part => part[0]).join('').slice(0, 2)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const [canExpand, setCanExpand] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useLayoutEffect(() => {
    const body = bodyRef.current
    if (!body) return

    const measure = () => setCanExpand(body.scrollHeight > body.clientHeight + 1)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(body)
    return () => observer.disconnect()
  }, [note.body])

  return (
    <>
      <PlaceCard component="article" className="team-note-card">
        <div className="team-note-card-meta">
          <div className="team-note-card-author">
            <Avatar src={note.authorPhotoUrl} alt={note.authorPhotoUrl ? note.author : undefined} className="team-note-card-avatar">
              {initials}
            </Avatar>
            <Typography variant="labelS" color="text.secondary">Added by {note.author}</Typography>
          </div>
          <div className="team-note-card-when">
            {note.starredAt && <StarRounded className="team-note-card-star" titleAccess="Important" />}
            <Typography variant="labelS" color="text.secondary" className="team-note-card-time">
              {formatRowDate(note.createdAt)}
            </Typography>
          </div>
        </div>
        <Divider className="team-note-card-divider" />
        <Typography component="p" ref={bodyRef} variant="bodySStandard" className="team-note-card-body">
          {note.body}
        </Typography>
        {canExpand && (
          <Button variant="text" className="team-note-card-expand" onClick={() => setModalOpen(true)}>
            See more
          </Button>
        )}
      </PlaceCard>
      <PlaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="m"
        title="Note"
        description={`Added by ${note.author} · ${note.createdAt}`}
        closeLabel="Close note"
      >
        <Typography component="p" variant="bodyMStandard" className="team-note-modal-body">
          {note.body}
        </Typography>
      </PlaceModal>
    </>
  )
}
