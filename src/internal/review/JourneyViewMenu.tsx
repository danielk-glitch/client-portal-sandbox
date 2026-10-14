/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft5 Variety3 SlopFree5 */
import { useId, useState } from 'react'
import { Box, Button, ListItemText, Menu, MenuItem, Typography, useMediaQuery } from '@mui/material'
import CheckOutlined from '@mui/icons-material/CheckOutlined'
import ExpandMoreOutlined from '@mui/icons-material/ExpandMoreOutlined'
import './journey-view-menu.css'

export function JourneyViewMenu<T extends string>({ value, options, anchorEl, onOpen, onClose, onChange }: {
  value: T
  options: Array<{ id: T; label: string; description: string }>
  anchorEl: HTMLElement | null
  onOpen: (anchor: HTMLElement) => void
  onClose: () => void
  onChange: (value: T) => void
}) {
  const id = useId()
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [keyboard, setKeyboard] = useState(false)
  const activeLabel = options.find((option) => option.id === value)?.label
  return (
    <>
      <Button
        className="journey-view-trigger"
        endIcon={<ExpandMoreOutlined />}
        aria-label={`View: ${activeLabel}`}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        aria-controls={anchorEl ? id : undefined}
        onClick={(event) => { setKeyboard(event.detail === 0); onOpen(event.currentTarget) }}
      >
        <span className="journey-view-trigger-text"><span className="journey-view-prefix">View: </span>{activeLabel}</span>
      </Button>
      <Menu
        id={id}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{ vertical: -12, horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transitionDuration={reducedMotion || keyboard ? 0 : { enter: 180, exit: 140 }}
        disableScrollLock
        slotProps={{ paper: { className: 'journey-view-menu-paper' }, list: { 'aria-label': 'Journey view' } }}
      >
        {options.map((option) => (
          <MenuItem key={option.id} role="menuitemradio" aria-checked={option.id === value} selected={option.id === value} onClick={() => { onChange(option.id); onClose() }}>
            <ListItemText
              disableTypography
              primary={<Typography component="div" variant="labelM">{option.label}</Typography>}
              secondary={<Typography component="div" variant="bodySStandard" color="text.secondary" className="journey-view-description">{option.description}</Typography>}
            />
            <Box className="journey-view-check">{option.id === value && <CheckOutlined fontSize="small" />}</Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
