import { Box, Button } from '@mui/material'
import './filter-pills.css'

/**
 * FilterPills · narrows one list to a subset ("All, Pre-listing, Active…", "Open, Done").
 * Compact pills: outlined when off, contained (dark) when on. One is always selected.
 * No counts in the pills: the list below shows how much is there. On phones the row scrolls sideways.
 */
export function FilterPills<T extends string>({ options, value, onChange, label, className }: {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
  /** Accessible name for the group, e.g. "Filter documents by stage". */
  label: string
  className?: string
}) {
  return (
    <Box role="group" aria-label={label} className={['filter-pills', className].filter(Boolean).join(' ')}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Button
            key={option.value}
            size="small"
            variant={selected ? 'contained' : 'outlined'}
            color="primary"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className="filter-pill"
          >
            {option.label}
          </Button>
        )
      })}
    </Box>
  )
}
