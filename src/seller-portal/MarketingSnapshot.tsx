/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useState } from 'react'
import { Box, IconButton, Paper, Typography } from '@mui/material'
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined'
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined'
import type { ShowingFeedback } from './sellerTransaction'
import type { MarketingMaterial } from './marketingMaterials'
import type { MarketingFeedbackLayout } from './marketingFeedbackLayouts'
import { TextLink } from '../components/TextLink'
import { FeedbackQuote } from '../transaction-portal/components'
import { PortalSectionHeader } from '../components/PortalSection'
import './marketing-snapshot.css'

export type MarketingSnapshotData = {
  channels: Array<{ label: string; count: number; unit: string }>
  materials: MarketingMaterial[]
  insights?: {
    totalViews: number
    dailyViews: number[]
    uniqueVisitors: number
    saves: number
    shares: number
    socialReach: number
    socialEngagements: number
    socialPosts: number
    showings: number
  }
}

export function MarketingSnapshot({ data, feedback, feedbackLayout = 'editorial', onOpenDashboard }: {
  data: MarketingSnapshotData
  feedback: ShowingFeedback[]
  feedbackLayout?: MarketingFeedbackLayout
  onOpenDashboard: () => void
}) {
  const [selectedFeedbackIndex, setSelectedFeedbackIndex] = useState(0)
  const activeFeedbackIndex = Math.min(selectedFeedbackIndex, Math.max(feedback.length - 1, 0))
  const activeFeedback = feedback[activeFeedbackIndex]

  return (
    <Paper component="section" variant="outlined" className="marketing-snapshot" aria-labelledby="marketing-snapshot-title">
      <PortalSectionHeader
        title="Listing Marketing"
        titleId="marketing-snapshot-title"
        prominent
        action={<TextLink onClick={onOpenDashboard}>View marketing dashboard</TextLink>}
      />

      <Box className="marketing-snapshot-content">
        <Box className="marketing-snapshot-channels" aria-label="Marketing materials and campaigns">
          {data.channels.map((channel) => (
            <Box className="marketing-snapshot-channel" key={channel.label}>
              <Typography variant="bodyMStandard" className="marketing-snapshot-channel-label">{channel.label}</Typography>
              <Box className="marketing-snapshot-channel-value">
                <Typography variant="metricL">{channel.count}</Typography>
                <Typography variant="labelS">{channel.unit}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {activeFeedback && (
          <Box className="marketing-snapshot-feedback" data-layout={feedbackLayout} role="group" aria-roledescription="carousel" aria-label="Showing feedback">
            <Box className="marketing-snapshot-feedback-slides" aria-live="polite" aria-atomic="true">
              {feedback.map((item, index) => (
                <FeedbackQuote
                  key={item.id}
                  feedback={item}
                  size="l"
                  className="marketing-snapshot-feedback-slide"
                  quoteClassName="marketing-snapshot-feedback-quote"
                  metaClassName="marketing-snapshot-feedback-meta"
                  data-active={index === activeFeedbackIndex}
                  aria-hidden={index !== activeFeedbackIndex}
                />
              ))}
            </Box>
            <Box className="marketing-snapshot-feedback-footer">
              <Typography variant="labelS" className="marketing-snapshot-label">Showing feedback</Typography>
              {feedback.length > 1 && (
                <Box className="marketing-snapshot-feedback-controls">
                  <IconButton aria-label="Previous showing feedback" onClick={() => setSelectedFeedbackIndex((activeFeedbackIndex - 1 + feedback.length) % feedback.length)}>
                    <ChevronLeftOutlined fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="Next showing feedback" onClick={() => setSelectedFeedbackIndex((activeFeedbackIndex + 1) % feedback.length)}>
                    <ChevronRightOutlined fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  )
}
