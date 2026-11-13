export type TeamMember = {
  id: string
  name: string
  role: string
  initials: string
  photoUrl?: string
  phone?: string
  email?: string
}

export type TransactionViewer = {
  id: string
  name: string
  role: 'Seller' | 'Co-seller' | 'Buyer' | 'Co-buyer'
  initials: string
  photoUrl?: string
  phone?: string
  email?: string
}

export type TimelineEvent = {
  id: string
  title: string
  description: string
  occurredAt: string
  actor: string
  type: 'task' | 'document' | 'listing' | 'showing' | 'note'
}

export type UpcomingDate = {
  id: string
  date: string
  title: string
  description: string
  guidance?: {
    explanation: string
    preparation: string
    /** Resources attached to this date. One shows as a direct chip; two or more open the date's explanation with a list. */
    resourceIds: string[]
    /** Web links attached to this date. They list in the date's explanation dialog and open in a new tab. */
    links?: DateLink[]
  }
}

export type DateLink = { id: string; title: string; url: string }

export type TransactionResource = {
  id: string
  title: string
  shortTitle?: string
  summary: string
  readingTime: string
  relevance: 'Useful now' | 'Coming up' | 'Good to know'
  sections: Array<{ title: string; body?: string; points?: string[]; html?: string }>
  questions: string[]
}

export type TransactionTask = {
  id: string
  name: string
  description: string
  assignee: string
  dueDate: string
}

export type AdvertisingEvent = {
  id: string
  platform: string
  action: string
  occurredAt: string
  postedBy: string
  /** Where this update lives (the live listing or post). When set, the row opens it in a new tab. */
  url?: string
}

export type ShowingFeedback = {
  id: string
  date: string
  showingType: string
  interest: number
  feedback: string
}

export type MeetingTranscriptLine = {
  /** Seconds from the start of the recording. */
  at: number
  speaker: string
  text: string
}

/**
 * A recorded meeting with an AI note taker. A note with this is shown as a meeting note: audio, summary, transcript.
 * Who recorded it is the note's author. The note's body is the AI summary.
 */
export type MeetingRecording = {
  title: string
  durationSeconds: number
  /** Leads this recording is filed under. Often none. */
  leads: string[]
  /** The transaction it's filed under. Usually the current one, so the client view doesn't show it. */
  transaction?: string
  transcript: MeetingTranscriptLine[]
}

/** A note is plain text only: no title, bold, italics, or headings. */
export type TeamNote = {
  id: string
  body: string
  author: string
  authorPhotoUrl?: string
  createdAt: string
  /** Set by the team when they mark a note important (ISO date-time). Clients can see it but not change it. */
  starredAt?: string
  /** Set when the note is a recorded meeting. Its body is the AI summary. */
  meeting?: MeetingRecording
}

export type TransactionDocument = {
  id: string
  name: string
  category: string
  uploadedAt: string
  postedBy: string
  status: 'Ready to view' | 'Signature requested' | 'Signed'
  summary: string
  thumbnailUrl?: string
  /** Uploaded file metadata; prototype PDFs otherwise resolve by document id. */
  fileName?: string
  fileUrl?: string
}

export type EmailPerson = {
  name: string
  email: string
}

export type EmailAttachment = {
  id: string
  fileName: string
  /** e.g. "212 KB" */
  size: string
}

/**
 * One email picked up from the transaction's cc/bcc address (e.g. listingagent+transaction003@...).
 * Emails with the same threadId belong to one conversation. The body is plain text.
 */
export type TransactionEmail = {
  id: string
  threadId: string
  subject: string
  from: EmailPerson
  to: EmailPerson[]
  cc?: EmailPerson[]
  /** ISO date-time. */
  sentAt: string
  body: string
  attachments?: EmailAttachment[]
}
