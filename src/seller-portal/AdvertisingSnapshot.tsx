/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box, Paper, Typography } from '@mui/material'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import { Rating } from '@mui/material'
import { CardActionButton } from '../components/CardActionButton'
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
    <Paper component="section" variant="outlined" className="advertising-snapshot" aria-labelledby="advertising-snapshot-title">
      <Box className="advertising-snapshot-header">
        <Typography component="h2" variant="titleS" id="advertising-snapshot-title">Listing performance</Typography>
        <CardActionButton onClick={onOpenDashboard} endIcon={<ArrowForwardOutlined />}>View marketing dashboard</CardActionButton>
      </Box>

      <Box className="advertising-snapshot-body">
        <Box className="advertising-snapshot-primary">
          <Box className="advertising-snapshot-hero">
            <Typography variant="labelM" component="p">Total listing views</Typography>
            <Typography variant="displayL" component="p" className="advertising-snapshot-total">{number(data.totalViews)}</Typography>
            <Typography variant="bodySStandard" className="advertising-snapshot-context">Across listing sites</Typography>
          </Box>
          <ViewsTrend values={data.dailyViews} />
          <Box className="advertising-snapshot-supporting" aria-label="Listing engagement">
            <Box>
              <Typography variant="metricM" component="p">{number(data.uniqueVisitors)}</Typography>
              <Typography variant="bodySStandard">Unique visitors</Typography>
            </Box>
            <Box>
              <Typography variant="metricM" component="p">{number(data.saves)}</Typography>
              <Typography variant="bodySStandard">Saves</Typography>
            </Box>
            <Box>
              <Typography variant="metricM" component="p">{number(data.shares)}</Typography>
              <Typography variant="bodySStandard">Shares</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="advertising-snapshot-secondary">
          <Box className="advertising-snapshot-social">
            <Box className="advertising-snapshot-section-heading">
              <Typography component="h3" variant="titleXS">Social media</Typography>
              <Typography variant="labelS">{data.socialPosts} posts</Typography>
            </Box>
            <Box className="advertising-snapshot-social-stats">
              <Box>
                <Typography variant="metricM" component="p">{number(data.socialReach)}</Typography>
                <Typography variant="bodySStandard">People reached</Typography>
              </Box>
              <Box>
                <Typography variant="metricM" component="p">{number(data.socialEngagements)}</Typography>
                <Typography variant="bodySStandard">Interactions</Typography>
              </Box>
            </Box>
          </Box>

          <Box className="advertising-snapshot-showings">
            <Box className="advertising-snapshot-section-heading">
              <Typography component="h3" variant="titleXS">Showing feedback</Typography>
              <Typography variant="labelS">{data.showings} showings</Typography>
            </Box>
            {latestFeedback && (
              <Box className="advertising-snapshot-quote">
                <Rating value={latestFeedback.interest} max={5} readOnly size="small" icon={<Favorite fontSize="inherit" />} emptyIcon={<FavoriteBorder fontSize="inherit" />} aria-label={`Interest ${latestFeedback.interest} out of 5`} />
                <Typography variant="bodyMStandard" component="p">“{latestFeedback.feedback}”</Typography>
                <Typography variant="bodySStandard" component="p">{latestFeedback.showingType} · {latestFeedback.date}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
