export type MarketingFeedbackLayout = 'current' | 'editorial' | 'split' | 'note'

export const marketingFeedbackLayouts: Array<{ id: MarketingFeedbackLayout; label: string }> = [
  { id: 'current', label: 'Current' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'split', label: 'Side rail' },
  { id: 'note', label: 'Note' },
]
