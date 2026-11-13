/**
 * Listing performance · views trend, engagement, social reach, and the latest showing feedback, in one card.
 */
import { Box, Typography } from '@mui/material'
import { PlaceCard } from '../components/PlaceCard'
import { TextLink } from '../components/TextLink'
import { FeedbackQuote } from '../transaction-portal/components'
import { PortalSectionHeader } from '../components/PortalSection'
import { HeadlineStat, Stat } from '../components/Stat'
import type { MarketingSnapshotData } from './MarketingSnapshot'
import type { ShowingFeedback } from './sellerTransaction'
import './advertising-snapshot.css'

type AdvertisingSnapshotProps = {
  data: NonNullable<MarketingSnapshotData['insights']>
  feedback: ShowingFeedback[]
  onOpenDashboard: () => void
}

function ViewsTrend({ values }: { values: number[] }) {
  const maximum = Math.max(...values, 1)
  const minimum = Math.min(...values, 0)
  const range = Math.max(maximum - minimum, 1)
  const points = values.map((value, index) => {
    const x = values.length === 1 ? 50 : index * 100 / (values.length - 1)
    const y = 46 - ((value - minimum) / range) * 40
    return `${x},${y}`
  }).join(' ')

  return (
    <Box className="advertising-snapshot-chart" role="img" aria-label="Daily listing views over the last 14 days">
      <svg viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <line x1="0" y1="46" x2="100" y2="46" />
        <line x1="0" y1="26" x2="100" y2="26" />
        <line x1="0" y1="6" x2="100" y2="6" />
        <polyline points={points} />
      </svg>
      <Box className="advertising-snapshot-chart-labels">
        <Typography variant="labelS">14 days ago</Typography>
        <Typography variant="labelS">Today</Typography>
      </Box>
    </Box>
  )
}

export function AdvertisingSnapshot({ data, feedback, onOpenDashboard }: AdvertisingSnapshotProps) {
  const latestFeedback = feedback[0]
  const number = (value: number) => value.toLocaleString('en-US')

  return (
    <PlaceCard component="section" className="advertising-snapshot" aria-labelledby="advertising-snapshot-title">
      <PortalSectionHeader
        title="Listing performance"
        titleId="advertising-snapshot-title"
        prominent
        action={<TextLink onClick={onOpenDashboard}>View marketing dashboard</TextLink>}
      />

      <Box className="advertising-snapshot-body">
        <Box className="advertising-snapshot-primary">
          <HeadlineStat label="Total listing views" value={number(data.totalViews)} context="Across listing sites" />
          <ViewsTrend values={data.dailyViews} />
          <Box className="advertising-snapshot-supporting" aria-label="Listing engagement">
            <Stat value={number(data.uniqueVisitors)} label="Unique visitors" />
            <Stat value={number(data.saves)} label="Saves" />
            <Stat value={number(data.shares)} label="Shares" />
          </Box>
        </Box>

        <Box className="advertising-snapshot-secondary">
          <Box className="advertising-snapshot-social">
            <Box className="advertising-snapshot-section-heading">
              <Typography component="h3" variant="titleXS">Social media</Typography>
            </Box>
            <Box className="advertising-snapshot-social-stats">
              <Stat value={number(data.socialReach)} label="People reached" />
              <Stat value={number(data.socialEngagements)} label="Interactions" />
            </Box>
          </Box>

          <Box className="advertising-snapshot-showings">
            <Box className="advertising-snapshot-section-heading">
              <Typography component="h3" variant="titleXS">Showing feedback</Typography>
              <Typography variant="labelS">{data.showings} showings</Typography>
            </Box>
            {latestFeedback && <FeedbackQuote feedback={latestFeedback} className="advertising-snapshot-quote" />}
          </Box>
        </Box>
      </Box>
    </PlaceCard>
  )
}
