/**
 * Meeting note · a recorded meeting from an AI note taker.
 * - The card is a preview: who recorded it, any leads it's filed under, the title, the start of the AI summary,
 *   and a small play control. Clicking the card opens the full note.
 * - The full note (a large dialog): the audio player across the top, then two columns. The AI summary (headings and
 *   bullets) sits on the left. The transcript scrolls vertically on the right and follows the audio. The line being
 *   spoken is highlighted and kept in view. Scrolling it by hand pauses the following for a few seconds.
 *   Clicking a line jumps the audio there.
 * Prototype: there is no real audio file. The player simulates playback so the interaction can be reviewed.
 */
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Avatar, Box, ButtonBase, Divider, Typography } from '@mui/material'
import { PlaceCard } from '../../components/PlaceCard'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PersonOutlineOutlined from '@mui/icons-material/PersonOutlineOutlined'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import SubjectOutlined from '@mui/icons-material/SubjectOutlined'
import { Eyebrow } from '../../components/Eyebrow'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import { PlaceModal } from '../../components/PlaceModal'
import { formatRowDate } from '../dates'
import { NoteSeeMore } from './NoteSeeMore'
import type { MeetingRecording, TeamNote } from '../types'
import './meeting-note-card.css'

const speeds = [1, 1.5, 2] as const

function clock(seconds: number) {
  const whole = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(whole / 60)
  return `${minutes}:${String(whole % 60).padStart(2, '0')}`
}

/** Shared by the card and the transcript dialog, so they always agree on the position. */
function usePlayback(durationSeconds: number) {
  const [position, setPosition] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speedIndex, setSpeedIndex] = useState(0)
  const speed = speeds[speedIndex]

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setPosition((current) => {
        const next = current + 0.25 * speed
        if (next >= durationSeconds) {
          setPlaying(false)
          return durationSeconds
        }
        return next
      })
    }, 250)
    return () => window.clearInterval(timer)
  }, [playing, speed, durationSeconds])

  return {
    position,
    playing,
    speed,
    toggle: () => {
      if (!playing && position >= durationSeconds) setPosition(0)
      setPlaying(!playing)
    },
    seek: (seconds: number) => setPosition(Math.min(durationSeconds, Math.max(0, seconds))),
    play: () => setPlaying(true),
    cycleSpeed: () => setSpeedIndex((speedIndex + 1) % speeds.length),
  }
}

type Playback = ReturnType<typeof usePlayback>

/** A fixed, believable waveform for each note. */
function waveformFor(seed: string, bars: number) {
  const base = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Array.from({ length: bars }, (_, index) => 0.22 + 0.78 * Math.abs(Math.sin(index * 1.7 + base) * Math.cos(index * 0.55 + base / 3)))
}

function MeetingPlayer({ id, label, duration, playback }: { id: string; label: string; duration: number; playback: Playback }) {
  const bars = useMemo(() => waveformFor(id, 72), [id])
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function seekFromPointer(event: PointerEvent<HTMLDivElement>) {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    playback.seek(((event.clientX - rect.left) / rect.width) * duration)
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === 'ArrowRight' ? 5 : event.key === 'ArrowLeft' ? -5 : 0
    if (step) { event.preventDefault(); playback.seek(playback.position + step) }
    if (event.key === 'Home') { event.preventDefault(); playback.seek(0) }
    if (event.key === 'End') { event.preventDefault(); playback.seek(duration) }
  }

  const progress = duration ? playback.position / duration : 0

  return (
    <Box className="meeting-player" role="group" aria-label={label}>
      <PlaceIconButton
        className="meeting-player-play"
        onClick={playback.toggle}
        aria-label={playback.playing ? 'Pause recording' : 'Play recording'}
      >
        {playback.playing ? <PauseRounded aria-hidden="true" /> : <PlayArrowRounded aria-hidden="true" />}
      </PlaceIconButton>
      <Box
        ref={trackRef}
        className="meeting-player-track"
        role="slider"
        tabIndex={0}
        aria-label="Recording position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(playback.position)}
        aria-valuetext={`${clock(playback.position)} of ${clock(duration)}`}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); seekFromPointer(event) }}
        onPointerMove={(event) => { if (dragging.current) seekFromPointer(event) }}
        onPointerUp={() => { dragging.current = false }}
        onPointerCancel={() => { dragging.current = false }}
      >
        {bars.map((height, index) => (
          <Box key={index} component="span" className={`meeting-player-bar${(index + 0.5) / bars.length <= progress ? ' is-played' : ''}`} style={{ height: `${Math.round(height * 100)}%` }} />
        ))}
      </Box>
      <Typography variant="labelS" component="span" className="meeting-player-time">{clock(playback.position)} / {clock(duration)}</Typography>
      <PlaceIconButton className="meeting-player-speed" onClick={playback.cycleSpeed} aria-label={`Playback speed ${playback.speed}x. Change speed`}>
        <Typography variant="labelM" component="span">{playback.speed}x</Typography>
      </PlaceIconButton>
    </Box>
  )
}

/* ---------- The AI summary: a little markdown. "## Heading", "- bullet", or a plain paragraph. ---------- */

type SummaryBlock = { kind: 'heading' | 'paragraph'; text: string } | { kind: 'list'; items: string[] }

function parseSummary(text: string): SummaryBlock[] {
  const blocks: SummaryBlock[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('## ')) blocks.push({ kind: 'heading', text: line.slice(3) })
    else if (line.startsWith('- ')) {
      const last = blocks[blocks.length - 1]
      if (last?.kind === 'list') last.items.push(line.slice(2))
      else blocks.push({ kind: 'list', items: [line.slice(2)] })
    } else blocks.push({ kind: 'paragraph', text: line })
  }
  return blocks
}

function SummaryBody({ text, className }: { text: string; className?: string }) {
  return (
    <Box className={['meeting-summary', className].filter(Boolean).join(' ')}>
      {parseSummary(text).map((block, index) => {
        if (block.kind === 'list') return <Box key={index} component="ul" className="meeting-summary-list">{block.items.map((item) => <Typography key={item} component="li" variant="bodySStandard">{item}</Typography>)}</Box>
        if (block.kind === 'heading') return <Typography key={index} component="h4" variant="labelM" className="meeting-summary-heading">{block.text}</Typography>
        return <Typography key={index} component="p" variant="bodySStandard" className="meeting-summary-paragraph">{block.text}</Typography>
      })}
    </Box>
  )
}

/** Plain text for a one-line preview: the summary without its headings and bullet markers. */
function plainSummary(text: string) {
  return parseSummary(text).filter((block) => block.kind !== 'heading').flatMap((block) => (block.kind === 'list' ? block.items : [block.text])).join(' ')
}

/** variant "row": the note as a list row (Notes tab). "card": the standalone card. Both open the same full note. */
export function MeetingNoteCard({ note, meeting, variant = 'card' }: { note: TeamNote; meeting: MeetingRecording; variant?: 'card' | 'row' }) {
  const initials = note.author.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)
  const [open, setOpen] = useState(false)
  const playback = usePlayback(meeting.durationSeconds)

  // The transcript line being spoken now.
  const activeIndex = meeting.transcript.reduce((found, line, index) => (line.at <= playback.position ? index : found), -1)

  const listRef = useRef<HTMLOListElement>(null)
  const itemRefs = useRef<Array<HTMLLIElement | null>>([])
  // After the reader scrolls the transcript by hand, leave it alone for a few seconds.
  const manualUntil = useRef(0)
  const holdAutoScroll = () => { manualUntil.current = Date.now() + 5000 }

  // Keep the spoken line centered in the transcript column.
  useEffect(() => {
    if (!open || activeIndex < 0 || Date.now() < manualUntil.current) return
    const list = listRef.current
    const item = itemRefs.current[activeIndex]
    if (!list || !item || !list.scrollTo) return
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    list.scrollTo({ top: item.offsetTop - (list.clientHeight - item.offsetHeight) / 2, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [activeIndex, open])

  const leadLine = meeting.leads.map((lead) => `Lead · ${lead}`).join(', ')
  const progress = meeting.durationSeconds ? playback.position / meeting.durationSeconds : 0

  const row = (
    <Box component="li" className="note-row">
      <ButtonBase className="note-row-main" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Open ${meeting.title}: summary and transcript`} disableRipple>
        <Avatar src={note.authorPhotoUrl} alt="" className="note-row-avatar">{initials}</Avatar>
        <Box component="span" className="note-row-copy">
          <Typography variant="titleXS" component="span">{meeting.title}</Typography>
          <Typography variant="bodySStandard" component="span" className="note-row-body">{plainSummary(note.body)}</Typography>
          <Typography variant="labelS" component="span" className="note-row-meta">
            <SubjectOutlined aria-hidden="true" />Recording · {clock(meeting.durationSeconds)}<Box component="span" aria-hidden="true">·</Box>{note.author}
          </Typography>
        </Box>
        <Typography variant="labelS" component="span" className="note-row-date">{formatRowDate(note.createdAt)}</Typography>
        <NoteSeeMore />
      </ButtonBase>
    </Box>
  )

  return (
    <>
      {variant === 'row' ? row : (
      <PlaceCard component="article" interactive className="team-note-card meeting-note">
        <div className="team-note-card-meta">
          <div className="team-note-card-author">
            <Avatar src={note.authorPhotoUrl} alt={note.authorPhotoUrl ? note.author : undefined} className="team-note-card-avatar">{initials}</Avatar>
            <Typography variant="labelS" color="text.secondary">Recorded by {note.author}</Typography>
          </div>
          <Typography variant="labelS" color="text.secondary" className="team-note-card-time">{note.createdAt}</Typography>
        </div>
        <Divider className="team-note-card-divider" />

        {meeting.leads.length > 0 && (
          <Box className="meeting-note-tags">
            {meeting.leads.map((lead) => (
              <Box key={lead} component="span" className="meeting-note-association"><PersonOutlineOutlined aria-hidden="true" />Lead · {lead}</Box>
            ))}
          </Box>
        )}

        <Typography component="h3" variant="titleXS" className="team-note-card-title">{meeting.title}</Typography>
        {/* Just the start of the summary, faded out. The full note has the rest. */}
        <SummaryBody text={note.body} className="meeting-summary--preview" />

        <Box className="meeting-card-footer">
          <PlaceIconButton
            className="meeting-card-play"
            onClick={playback.toggle}
            aria-label={playback.playing ? `Pause recording of ${meeting.title}` : `Play recording of ${meeting.title}`}
          >
            {playback.playing ? <PauseRounded aria-hidden="true" /> : <PlayArrowRounded aria-hidden="true" />}
          </PlaceIconButton>
          <Box className="meeting-card-progress" aria-hidden="true"><Box component="span" style={{ width: `${Math.round(progress * 100)}%` }} /></Box>
          <Typography variant="labelS" component="span" className="meeting-player-time">{clock(playback.position)} / {clock(meeting.durationSeconds)}</Typography>
          <Typography variant="labelM" component="span" className="meeting-card-more" aria-hidden="true"><SubjectOutlined />Summary and transcript</Typography>
        </Box>

        {/* The whole card opens the full note. The play control above sits over this. */}
        <ButtonBase className="meeting-card-open" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Open ${meeting.title}: summary and transcript`} disableRipple />
      </PlaceCard>
      )}

      <PlaceModal
        open={open}
        onClose={() => setOpen(false)}
        size="xl"
        title={meeting.title}
        description={[`Recorded by ${note.author}`, note.createdAt, leadLine].filter(Boolean).join(' · ')}
        closeLabel="Close meeting note"
        className="meeting-note-modal"
      >
        <Box className="meeting-modal">
          <MeetingPlayer id={note.id} label={meeting.title} duration={meeting.durationSeconds} playback={playback} />

          <Box className="meeting-modal-columns">
            <Box component="section" aria-labelledby={`${note.id}-summary`} className="meeting-modal-summary">
              <Eyebrow component="h3" id={`${note.id}-summary`} className="meeting-modal-eyebrow">AI summary</Eyebrow>
              <SummaryBody text={note.body} />
            </Box>

            <Box component="section" aria-labelledby={`${note.id}-transcript`} className="meeting-modal-transcript">
              <Eyebrow component="h3" id={`${note.id}-transcript`} className="meeting-modal-eyebrow">Transcript</Eyebrow>
              <Box component="ol" ref={listRef} className="meeting-transcript" onWheel={holdAutoScroll} onPointerDown={holdAutoScroll} onTouchStart={holdAutoScroll}>
                {meeting.transcript.map((line, index) => (
                  <Box component="li" key={`${line.at}-${index}`} ref={(node: HTMLLIElement | null) => { itemRefs.current[index] = node }}>
                    <ButtonBase
                      className={`meeting-line${index === activeIndex ? ' is-active' : ''}`}
                      aria-current={index === activeIndex ? 'true' : undefined}
                      aria-label={`${line.speaker} at ${clock(line.at)}. Play from here`}
                      onClick={() => { manualUntil.current = 0; playback.seek(line.at); playback.play() }}
                      disableRipple
                    >
                      <Typography variant="labelS" component="span" className="meeting-line-time">{clock(line.at)}</Typography>
                      <Box component="span" className="meeting-line-copy">
                        <Typography variant="labelM" component="span" className="meeting-line-speaker">{line.speaker}</Typography>
                        <Typography variant="bodySStandard" component="span" className="meeting-line-text">{line.text}</Typography>
                      </Box>
                    </ButtonBase>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </PlaceModal>
    </>
  )
}
