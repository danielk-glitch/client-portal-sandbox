/**
 * Add to calendar · one quiet button on a dated row. Opens a small menu of the common calendars,
 * each with its own favicon. Prototype only: picking a calendar shows a confirmation toast; no
 * event is created. In production, Google and Outlook would open prefilled event links and
 * Apple / other would download an .ics file with the same details.
 */
import { useId, useState, type MouseEvent } from 'react'
import { Box, Button, Divider, ListItemIcon, Menu, MenuItem } from '@mui/material'
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined'
import EventOutlined from '@mui/icons-material/EventOutlined'
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined'
import { toast } from 'sonner'
import './add-to-calendar.css'

/** Each calendar's own favicon, loaded from the provider's site so the menu is recognizable at a glance. */
const favicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

const calendars = [
  { id: 'google', label: 'Google Calendar', iconUrl: favicon('calendar.google.com') },
  { id: 'apple', label: 'Apple Calendar', iconUrl: favicon('icloud.com') },
  { id: 'outlook', label: 'Outlook', iconUrl: favicon('outlook.live.com') },
  { id: 'ics', label: 'Other calendar (.ics)', iconUrl: null },
] as const

/** The provider's favicon, falling back to a plain calendar icon if it can't load. */
function CalendarIcon({ url }: { url: string | null }) {
  const [failed, setFailed] = useState(false)
  if (!url) return <FileDownloadOutlined />
  if (failed) return <CalendarMonthOutlined />
  return <Box component="img" src={url} alt="" className="add-to-calendar-favicon" onError={() => setFailed(true)} />
}

function longDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
}

export function AddToCalendarButton({ title, date, className }: { title: string; date: string; className?: string }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const menuId = useId()

  function openMenu(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setAnchor(event.currentTarget)
  }

  function choose(label: string) {
    setAnchor(null)
    toast.success(label === 'Other calendar (.ics)' ? 'Calendar file downloaded' : `Added to ${label}`, { description: `${title} · ${longDate(date)}` })
  }

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<EventOutlined />}
        onClick={openMenu}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        aria-controls={anchor ? menuId : undefined}
        aria-label={`Add ${title} to your calendar`}
        className={['add-to-calendar', className].filter(Boolean).join(' ')}
      >
        <Box component="span" className="add-to-calendar-label">Add to calendar</Box>
      </Button>
      <Menu
        id={menuId}
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { className: 'add-to-calendar-menu' } }}
      >
        {calendars.map((calendar) => [
          calendar.id === 'ics' && <Divider key="divider" />,
          <MenuItem key={calendar.id} onClick={() => choose(calendar.label)}>
            <ListItemIcon><CalendarIcon url={calendar.iconUrl} /></ListItemIcon>
            {calendar.label}
          </MenuItem>,
        ])}
      </Menu>
    </>
  )
}
