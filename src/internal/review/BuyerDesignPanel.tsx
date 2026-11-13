/**
 * Design panel for the buyer portal (`/buyer/v1-iteration2`).
 * Previews the page at different moments in the deal. The timeline, documents, notes, updates,
 * and buyer blocks all follow the picked "today". Also settable with ?moment=inspection|financing|closing-week|moved-in.
 * Also shows or hides the "Your first 10 days" block (hidden by default; ?tenDays=show).
 */
import { useState } from 'react'
import { Box, Button, FormControlLabel, IconButton, Popover, Radio, RadioGroup, Typography } from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import { FeedbackToolbar } from './FeedbackToolbar'
import { journeyMoments, type JourneyMoment } from '../../buyer-portal/buyerTimelineData'
import './seller-review-tools.css'

export function BuyerDesignPanel({ moment, selectMoment, showTenDays, selectShowTenDays }: { moment: JourneyMoment; selectMoment: (value: JourneyMoment) => void; showTenDays: boolean; selectShowTenDays: (value: boolean) => void }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <FeedbackToolbar keepOpen={Boolean(anchor)}>
        <Button
          variant="contained"
          startIcon={<TuneOutlined />}
          className="design-panel-trigger"
          onClick={(event) => setAnchor(event.currentTarget)}
          aria-label="Open design panel"
          aria-haspopup="dialog"
          aria-expanded={Boolean(anchor)}
          aria-controls={anchor ? 'buyer-design-panel' : undefined}
        >
          <Box component="span" className="design-panel-trigger-label">Design panel</Box>
        </Button>
      </FeedbackToolbar>

      <Popover
        id="buyer-design-panel"
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: -12, horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        disableScrollLock
        slotProps={{ paper: { className: 'design-panel-paper', role: 'dialog', 'aria-label': 'Design panel' } }}
      >
        <Box className="design-panel-header">
          <Box>
            <Typography component="h2" variant="titleS">Design panel</Typography>
            <Typography variant="bodySStandard" color="text.secondary">Preview the buyer journey</Typography>
          </Box>
          <IconButton onClick={() => setAnchor(null)} aria-label="Close design panel"><CloseOutlined /></IconButton>
        </Box>
        <Box className="design-panel-content">
          <Box className="design-panel-option-section">
            <Typography component="h3" variant="titleXS" id="buyer-moment-label">Moment in the deal</Typography>
            <RadioGroup aria-labelledby="buyer-moment-label" value={moment} onChange={(event) => selectMoment(event.target.value as JourneyMoment)}>
              {journeyMoments.map((option) => <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />)}
            </RadioGroup>
          </Box>
          <Box className="design-panel-option-section">
            <Typography component="h3" variant="titleXS" id="buyer-ten-days-label">Your first 10 days</Typography>
            <RadioGroup aria-labelledby="buyer-ten-days-label" value={showTenDays ? 'show' : 'hide'} onChange={(event) => selectShowTenDays(event.target.value === 'show')}>
              <FormControlLabel value="hide" control={<Radio />} label="Hidden" />
              <FormControlLabel value="show" control={<Radio />} label="Shown during the inspection period" />
            </RadioGroup>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
