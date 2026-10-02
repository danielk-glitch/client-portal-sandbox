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
}

export type ShowingFeedback = {
  id: string
  date: string
  showingType: string
  interest: number
  feedback: string
}

export type TeamNote = {
  id: string
  title: string
  body: string
  author: string
  authorPhotoUrl?: string
  createdAt: string
}

export type TransactionDocument = {
  id: string
  name: string
  category: string
  updatedAt: string
  postedBy: string
  status: 'Ready to view' | 'Signature requested' | 'Signed'
  summary: string
}
