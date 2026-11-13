import { useMemo, useState } from 'react'
import { Avatar, Box, ButtonBase, Typography } from '@mui/material'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'
import AttachFileRounded from '@mui/icons-material/AttachFileRounded'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import { PlaceModal } from '../../components/PlaceModal'
import type { EmailPerson, TransactionEmail } from '../types'
import { formatRowDate } from '../dates'
import './emails-panel.css'

/**
 * Emails tab: every email picked up from the transaction's cc/bcc address, grouped into threads.
 * Rows follow the shared list-row anatomy (DESIGN.md › List rows): sender badge, subject, preview, then who's on it;
 * the latest date and attachment count sit on the right. No count line above the list: the list shows that.
 * A row opens a modal: threads on the left, the selected thread's messages on the right.
 */

type EmailThread = {
  id: string
  subject: string
  messages: TransactionEmail[]
  latest: TransactionEmail
  people: EmailPerson[]
  attachmentCount: number
}

function buildThreads(emails: TransactionEmail[]): EmailThread[] {
  const byThread = new Map<string, TransactionEmail[]>()
  for (const email of emails) byThread.set(email.threadId, [...(byThread.get(email.threadId) ?? []), email])
  return [...byThread.entries()]
    .map(([id, group]) => {
      const messages = [...group].sort((a, b) => a.sentAt.localeCompare(b.sentAt))
      const people = new Map<string, EmailPerson>()
      for (const message of messages) for (const person of [message.from, ...message.to, ...(message.cc ?? [])]) people.set(person.email, person)
      return {
        id,
        subject: messages[0].subject.replace(/^(re|fwd?):\s*/i, ''),
        messages,
        latest: messages[messages.length - 1],
        people: [...people.values()],
        attachmentCount: messages.reduce((total, message) => total + (message.attachments?.length ?? 0), 0),
      }
    })
    .sort((a, b) => b.latest.sentAt.localeCompare(a.latest.sentAt))
}

function initialsOf(name: string) {
  return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fullDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function firstName(person: EmailPerson) {
  return person.name.split(' ')[0]
}

/** "Sam, Avery +2" */
function participantsLine(people: EmailPerson[]) {
  const shown = people.slice(0, 2).map(firstName).join(', ')
  return people.length > 2 ? `${shown} +${people.length - 2}` : shown
}

function snippet(body: string) {
  return body.replace(/\s+/g, ' ').trim()
}

export function EmailsPanel({ emails }: { emails: TransactionEmail[] }) {
  const threads = useMemo(() => buildThreads(emails), [emails])
  const [openId, setOpenId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string>(threads[0]?.id ?? '')
  /** Narrow screens show one pane at a time. */
  const [readerOpen, setReaderOpen] = useState(false)
  const selected = threads.find((thread) => thread.id === selectedId) ?? threads[0]

  if (!threads.length) {
    return <Typography variant="bodySStandard" color="text.secondary">No emails yet. Emails your team sends about this sale will collect here.</Typography>
  }

  function openThread(id: string) {
    setSelectedId(id)
    setReaderOpen(true)
    setOpenId(id)
  }

  return (
    <Box className="emails-panel">
      <Box component="ul" className="emails-list" aria-label="Email conversations">
        {threads.map((thread) => (
          <Box component="li" key={thread.id} className="emails-list-item">
            <ButtonBase className="emails-row" onClick={() => openThread(thread.id)} disableRipple>
              <Avatar className="emails-avatar" aria-hidden="true">{initialsOf(thread.latest.from.name)}</Avatar>
              <Box component="span" className="emails-row-copy">
                <Typography variant="titleXS" component="span" className="emails-row-subject">{thread.subject}</Typography>
                <Typography variant="bodySStandard" component="span" color="text.secondary" className="emails-row-snippet">{snippet(thread.latest.body)}</Typography>
                <Typography variant="labelS" component="span" className="emails-row-people">{participantsLine(thread.people)}</Typography>
              </Box>
              <Box component="span" className="emails-row-end">
                <Typography variant="labelS" component="span" color="text.secondary" className="emails-row-date">{formatRowDate(thread.latest.sentAt)}</Typography>
                {thread.attachmentCount > 0 && (
                  <Typography variant="labelS" component="span" color="text.secondary" className="emails-row-clip" aria-label={`${thread.attachmentCount} attachments`}>
                    <AttachFileRounded aria-hidden="true" />{thread.attachmentCount}
                  </Typography>
                )}
              </Box>
            </ButtonBase>
          </Box>
        ))}
      </Box>

      <PlaceModal
        open={openId !== null}
        onClose={() => setOpenId(null)}
        size="xl"
        title="Emails"
        description="Every email on this sale, in one place."
        closeLabel="Close emails"
        className="emails-modal"
      >
        <Box className={`emails-modal-body${readerOpen ? ' is-reading' : ''}`}>
          <Box component="nav" aria-label="Email conversations" className="emails-threads">
            {threads.map((thread) => (
              <ButtonBase
                key={thread.id}
                className={`emails-thread${thread.id === selected.id ? ' is-selected' : ''}`}
                aria-current={thread.id === selected.id ? 'true' : undefined}
                onClick={() => { setSelectedId(thread.id); setReaderOpen(true) }}
                disableRipple
              >
                <Box component="span" className="emails-thread-top">
                  <Typography variant="labelS" component="span" color="text.secondary" className="emails-thread-people">{participantsLine(thread.people)}</Typography>
                  <Typography variant="labelS" component="span" color="text.secondary">{shortDate(thread.latest.sentAt)}</Typography>
                </Box>
                <Typography variant="labelM" component="span" className="emails-thread-subject">{thread.subject}</Typography>
                <Typography variant="bodySStandard" component="span" color="text.secondary" className="emails-thread-snippet">{snippet(thread.latest.body)}</Typography>
                {thread.attachmentCount > 0 && (
                  <Typography variant="labelS" component="span" color="text.secondary" className="emails-row-clip">
                    <AttachFileRounded aria-hidden="true" />{thread.attachmentCount}
                  </Typography>
                )}
              </ButtonBase>
            ))}
          </Box>

          <Box component="section" aria-label={selected.subject} className="emails-reader">
            <ButtonBase className="emails-reader-back" onClick={() => setReaderOpen(false)} disableRipple>
              <ArrowBackRounded aria-hidden="true" />
              <Typography variant="labelM" component="span">All emails</Typography>
            </ButtonBase>
            <Typography component="h3" variant="titleS" className="emails-reader-subject">{selected.subject}</Typography>
            <Typography variant="labelS" color="text.secondary" className="emails-reader-count">
              {selected.messages.length} {selected.messages.length === 1 ? 'email' : 'emails'}
            </Typography>
            <Box component="ol" className="emails-messages">
              {selected.messages.map((message) => <EmailMessage key={message.id} message={message} />)}
            </Box>
          </Box>
        </Box>
      </PlaceModal>
    </Box>
  )
}

function EmailMessage({ message }: { message: TransactionEmail }) {
  const names = (people: EmailPerson[]) => people.map((person) => person.name).join(', ')
  return (
    <Box component="li" className="emails-message">
      <Box className="emails-message-head">
        <Avatar className="emails-avatar" aria-hidden="true">{initialsOf(message.from.name)}</Avatar>
        <Box className="emails-message-who">
          <Typography variant="labelM" component="p">{message.from.name} <Box component="span" className="emails-message-address">{message.from.email}</Box></Typography>
          <Typography variant="labelS" component="p" color="text.secondary">To {names(message.to)}{message.cc?.length ? ` · Cc ${names(message.cc)}` : ''}</Typography>
        </Box>
        <Typography variant="labelS" component="time" color="text.secondary" dateTime={message.sentAt} className="emails-message-date">{fullDate(message.sentAt)}</Typography>
      </Box>
      <Typography variant="bodyMStandard" component="p" className="emails-message-body">{message.body}</Typography>
      {message.attachments && message.attachments.length > 0 && (
        <Box component="ul" className="emails-attachments" aria-label="Attachments">
          {message.attachments.map((attachment) => (
            <Box component="li" key={attachment.id} className="emails-attachment">
              <DescriptionOutlined aria-hidden="true" />
              <Typography variant="labelS" component="span" className="emails-attachment-name">{attachment.fileName}</Typography>
              <Typography variant="labelS" component="span" color="text.secondary">{attachment.size}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
