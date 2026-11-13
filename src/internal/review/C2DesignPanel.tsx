/**
 * Design panel for V1 iteration 2 (`/seller/v1-iteration2`).
 * Header options for review: the default immersive cinematic header, plus the earlier Pass, Pass · light, and Current headers.
 * Agent card: in the rail under Important notes (listing buttons on the hero's right), or in the hero.
 */
import { useState } from 'react'
import { Box, Button, FormControlLabel, IconButton, Popover, Radio, RadioGroup, Typography } from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import { FeedbackToolbar } from './FeedbackToolbar'
import type { AgentPlacement, HeroVariant } from '../../seller-portal/timeline-first/C2Heroes'
import './seller-review-tools.css'

const headerOptions: Array<{ value: HeroVariant; label: string }> = [
  { value: 'cinematic', label: 'Cinematic · immersive (default)' },
  { value: 'pass', label: 'Pass' },
  { value: 'pass-light', label: 'Pass · light' },
  { value: 'current', label: 'Current' },
]

const agentOptions: Array<{ value: AgentPlacement; label: string }> = [
  { value: 'rail', label: 'Below important notes · buttons on the hero’s right' },
  { value: 'hero', label: 'In the hero' },
]

export function C2DesignPanel({ header, selectHeader, agentPlacement, selectAgentPlacement }: { header: HeroVariant; selectHeader: (value: HeroVariant) => void; agentPlacement: AgentPlacement; selectAgentPlacement: (value: AgentPlacement) => void }) {
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
          aria-controls={anchor ? 'c2-design-panel' : undefined}
        >
          <Box component="span" className="design-panel-trigger-label">Design panel</Box>
        </Button>
      </FeedbackToolbar>

      <Popover
        id="c2-design-panel"
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
            <Typography variant="bodySStandard" color="text.secondary">Preview page layouts</Typography>
          </Box>
          <IconButton onClick={() => setAnchor(null)} aria-label="Close design panel"><CloseOutlined /></IconButton>
        </Box>
        <Box className="design-panel-content">
          <Box className="design-panel-option-section">
            <Typography component="h3" variant="titleXS" id="c2-header-label">Header</Typography>
            <RadioGroup aria-labelledby="c2-header-label" value={header} onChange={(event) => selectHeader(event.target.value as HeroVariant)}>
              {headerOptions.map((option) => <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />)}
            </RadioGroup>
          </Box>
          <Box className="design-panel-option-section">
            <Typography component="h3" variant="titleXS" id="c2-agent-label">Agent card</Typography>
            <RadioGroup aria-labelledby="c2-agent-label" value={agentPlacement} onChange={(event) => selectAgentPlacement(event.target.value as AgentPlacement)}>
              {agentOptions.map((option) => <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} disabled={header !== 'cinematic' && option.value === 'hero'} />)}
            </RadioGroup>
          </Box>
        </Box>
      </Popover>
    </>
  )
}
