/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box, Button, Paper, Typography } from '@mui/material'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import type { AdvertisingEvent, ShowingFeedback } from './sellerTransaction'
import './marketing-snapshot.css'

export type MarketingSnapshotData = {
  channels: Array<{ label: string; count: number; unit: string }>
}

export function MarketingSnapshot({ data, advertising, feedback, onViewActivity, onViewFeedback }: {
  data: MarketingSnapshotData
  advertising: AdvertisingEvent[]
  feedback: ShowingFeedback[]
  onViewActivity: () => void
  onViewFeedback: () => void
}) {
  const latestAd = advertising[advertising.length - 1]
  const latestFeedback = feedback[0]

  return (
    <Paper component="section" variant="outlined" className="marketing-snapshot" aria-labelledby="marketing-snapshot-title">
      <Box className="marketing-snapshot-header">
        <Box>
          <Typography variant="labelS" className="marketing-snapshot-eyebrow">Listing marketing</Typography>
          <Typography component="h2" variant="titleM" id="marketing-snapshot-title">Your home is getting seen.</Typography>
        </Box>
        <Button className="marketing-snapshot-action" variant="text" onClick={onViewActivity} endIcon={<ArrowForwardOutlined />}>
          See marketing activity
        </Button>
      </Box>

      <Box className="marketing-snapshot-channels" aria-label="Marketing materials and campaigns">
        {data.channels.map((channel) => (
          <Box className="marketing-snapshot-channel" key={channel.label}>
            <Typography variant="bodySStandard">{channel.label}</Typography>
            <Box className="marketing-snapshot-channel-value">
              <Typography variant="metricL">{channel.count}</Typography>
              <Typography variant="labelM">{channel.unit}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box className="marketing-snapshot-footer">
        {latestAd && (
          <Box className="marketing-snapshot-note">
            <Typography variant="labelS" className="marketing-snapshot-label">Latest advertising update</Typography>
            <Typography variant="bodySStandard">{latestAd.action} on {latestAd.platform}</Typography>
          </Box>
        )}
        {latestFeedback && (
          <Box className="marketing-snapshot-note">
            <Box className="marketing-snapshot-note-heading">
              <Typography variant="labelS" className="marketing-snapshot-label">Latest showing feedback</Typography>
              <Button className="marketing-snapshot-see-all" variant="text" onClick={onViewFeedback} aria-label="See all showing feedback">See all</Button>
            </Box>
            <Typography variant="bodySStandard">“{latestFeedback.feedback}”</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  )
}
