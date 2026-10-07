/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useState } from 'react'
import { Box, Button, IconButton, Paper, Rating, Typography } from '@mui/material'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined'
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined'
import Favorite from '@mui/icons-material/Favorite'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder'
import type { ShowingFeedback } from './sellerTransaction'
import type { MarketingMaterial } from './marketingMaterials'
import type { MarketingFeedbackLayout } from './marketingFeedbackLayouts'
import { CardActionButton } from '../components/CardActionButton'
import './marketing-snapshot.css'

export type MarketingSnapshotData = {
  channels: Array<{ label: string; count: number; unit: string }>
  materials: MarketingMaterial[]
}

export function MarketingSnapshot({ data, feedback, feedbackLayout = 'current', onOpenDashboard, onViewFeedback }: {
  data: MarketingSnapshotData
  feedback: ShowingFeedback[]
  feedbackLayout?: MarketingFeedbackLayout
  onOpenDashboard: () => void
  onViewFeedback: () => void
}) {
  const [selectedFeedbackIndex, setSelectedFeedbackIndex] = useState(0)
  const activeFeedbackIndex = Math.min(selectedFeedbackIndex, Math.max(feedback.length - 1, 0))
  const activeFeedback = feedback[activeFeedbackIndex]

  return (
    <Paper component="section" variant="outlined" className="marketing-snapshot" aria-labelledby="marketing-snapshot-title">
      <Box className="marketing-snapshot-header">
        <Typography component="h2" variant="titleS" id="marketing-snapshot-title">Listing Marketing</Typography>
        <CardActionButton className="marketing-snapshot-action" onClick={onOpenDashboard} endIcon={<ArrowForwardOutlined />}>
          View marketing dashboard
        </CardActionButton>
      </Box>

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
            <Box className="marketing-snapshot-feedback-heading">
              <Typography variant="labelS" className="marketing-snapshot-label">Showing feedback</Typography>
              <Button className="marketing-snapshot-see-all" variant="text" onClick={onViewFeedback} aria-label="See all showing feedback">See all</Button>
            </Box>
            <Box className="marketing-snapshot-feedback-slides" aria-live="polite" aria-atomic="true">
              {feedback.map((item, index) => {
                const rating = <Rating value={item.interest} max={5} readOnly size="small" icon={<Favorite fontSize="inherit" />} emptyIcon={<FavoriteBorder fontSize="inherit" />} aria-label={`Interest ${item.interest} out of 5`} />
                const quote = <Typography variant="bodyLStandard" className="marketing-snapshot-feedback-quote">“{item.feedback}”</Typography>
                const quoteFirst = feedbackLayout === 'editorial' || feedbackLayout === 'note'
                return (
                  <Box key={item.id} className="marketing-snapshot-feedback-slide" data-active={index === activeFeedbackIndex} aria-hidden={index !== activeFeedbackIndex}>
                    {quoteFirst ? <>{quote}{rating}</> : <>{rating}{quote}</>}
                  </Box>
                )
              })}
            </Box>
            <Box className="marketing-snapshot-feedback-footer">
              <Typography variant="bodySStandard" className="marketing-snapshot-feedback-meta">
                {activeFeedback.showingType} · {activeFeedback.date}
              </Typography>
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
