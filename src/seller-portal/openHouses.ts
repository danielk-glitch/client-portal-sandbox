/**
 * Open houses · client-facing data.
 * Each open house belongs to a stage (almost always Active listing) and shows up as a row in that
 * stage's "Dates" list, plus in the "Open houses" tab for reference later.
 * Results (visitors and leads) only exist once the open house is done.
 */
import type { MilestoneId } from './sellerTimelineData'

export type OpenHouse = {
  id: string
  milestoneId: MilestoneId
  /** Defaults to "Open house". */
  title?: string
  /** ISO day. */
  date: string
  /** 24-hour "HH:MM". */
  startTime: string
  endTime: string
  /** Team member name. */
  host: string
  status: 'scheduled' | 'complete'
  /** Notes the team chose to share with the client. */
  notes?: string
  /** Only once complete. */
  attendees?: number
  /** Only once complete. Visitors who left contact info or asked for follow-up. */
  leads?: number
}

export const openHouseTitle = (openHouse: OpenHouse) => openHouse.title ?? 'Open house'

function clock(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return { label: `${hours % 12 || 12}${minutes ? `:${String(minutes).padStart(2, '0')}` : ''}`, period: hours < 12 ? 'AM' : 'PM' }
}

/** "1 – 4 PM", "11:30 AM – 1 PM". */
export function openHouseTime({ startTime, endTime }: Pick<OpenHouse, 'startTime' | 'endTime'>) {
  const start = clock(startTime)
  const end = clock(endTime)
  return start.period === end.period ? `${start.label} – ${end.label} ${end.period}` : `${start.label} ${start.period} – ${end.label} ${end.period}`
}

export const isOpenHouseDone = (openHouse: OpenHouse) => openHouse.status === 'complete'

/** Pending sale: every open house happened during Active listing. */
export const pendingOpenHouses: OpenHouse[] = [
  {
    id: 'oh-sep-05',
    milestoneId: 'active-listing',
    date: '2026-09-05',
    startTime: '13:00',
    endTime: '16:00',
    host: 'Avery Coleman',
    status: 'complete',
    attendees: 38,
    leads: 6,
    notes: 'Steady traffic all afternoon, mostly local buyers already touring the neighborhood. The kitchen and the garage workshop got the most comments. A few people asked about the roof’s age, so I’ve added the 2019 permit to your documents.',
  },
  {
    id: 'oh-sep-06',
    milestoneId: 'active-listing',
    date: '2026-09-06',
    startTime: '12:00',
    endTime: '15:00',
    host: 'Avery Coleman',
    status: 'complete',
    attendees: 21,
    leads: 3,
    notes: 'Quieter than Saturday, but the visitors were serious. One couple came back after touring on Saturday and asked about a second showing.',
  },
  {
    id: 'oh-sep-20',
    milestoneId: 'active-listing',
    date: '2026-09-20',
    startTime: '12:00',
    endTime: '14:00',
    host: 'Avery Coleman',
    status: 'complete',
    attendees: 15,
    leads: 2,
    notes: 'Smaller group, mostly buyers who found the listing online this week. One visitor’s agent followed up the next morning.',
  },
]
