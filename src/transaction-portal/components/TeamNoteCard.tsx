import { useLayoutEffect, useRef, useState } from 'react'
import { Avatar, Button, Divider, Paper, Typography } from '@mui/material'
import { PlaceModal } from '../../components/PlaceModal'
import type { TeamNote } from '../types'
import './team-note-card.css'

export function TeamNoteCard({ note }: { note: TeamNote }) {
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
      <Paper component="article" variant="outlined" className="team-note-card">
        <div className="team-note-card-meta">
          <div className="team-note-card-author">
            <Avatar src={note.authorPhotoUrl} alt={note.authorPhotoUrl ? note.author : undefined} className="team-note-card-avatar">
              {initials}
            </Avatar>
            <Typography variant="labelS" color="text.secondary">Added by {note.author}</Typography>
          </div>
          <Typography variant="labelS" color="text.secondary" className="team-note-card-time">
            {note.createdAt}
          </Typography>
        </div>
        <Divider className="team-note-card-divider" />
        <Typography component="h3" variant="titleXS" className="team-note-card-title">
          {note.title}
        </Typography>
        <Typography component="p" ref={bodyRef} variant="bodySStandard" className="team-note-card-body">
          {note.body}
        </Typography>
        {canExpand && (
          <Button variant="text" className="team-note-card-expand" onClick={() => setModalOpen(true)}>
            See more
          </Button>
        )}
      </Paper>
      <PlaceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size="m"
        title={note.title}
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
