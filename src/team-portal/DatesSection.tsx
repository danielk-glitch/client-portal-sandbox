import { useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Stack, TextField, Typography } from '@mui/material'
import EditOutlined from '@mui/icons-material/EditOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import type { UpcomingDate } from '../transaction-portal/types'
import type { TeamState } from './teamData'

type SetState = (next: TeamState | ((previous: TeamState) => TeamState)) => void
const month = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
const day = (date: string) => date.slice(8, 10)

export function DatesSection({ state, setState }: { state: TeamState; setState: SetState }) {
  const [editing, setEditing] = useState<UpcomingDate | null>(null)
  const [draft, setDraft] = useState({ date: '', title: '', description: '', explanation: '', preparation: '', resourceId: '' })
  const [alsoShow, setAlsoShow] = useState(true)
  const published = state.resources.filter(resource => resource.published && !resource.archived)
  const titleOf = (id?: string) => state.resources.find(resource => resource.id === id)?.published?.title
  const dates = [...state.dates].sort((a, b) => a.date.localeCompare(b.date))
  const draftHidden = !!draft.resourceId && !state.visible.includes(draft.resourceId)

  function open(date: UpcomingDate) {
    setDraft({ date: date.date, title: date.title, description: date.description, explanation: date.guidance?.explanation ?? '', preparation: date.guidance?.preparation ?? '', resourceId: date.guidance?.resourceId ?? '' })
    setAlsoShow(true)
    setEditing(date)
  }
  function save() {
    if (!editing) return
    if (!draft.title.trim() || !draft.date) { toast.error('Add a title and a date.'); return }
    const hasGuidance = draft.explanation.trim() || draft.preparation.trim() || draft.resourceId
    const updated: UpcomingDate = { id: editing.id, date: draft.date, title: draft.title.trim(), description: draft.description.trim(), guidance: hasGuidance ? { explanation: draft.explanation.trim(), preparation: draft.preparation.trim(), resourceId: draft.resourceId } : undefined }
    const show = draftHidden && alsoShow
    setState(previous => ({ ...previous, dates: previous.dates.map(item => item.id === editing.id ? updated : item), visible: show ? [...previous.visible, draft.resourceId] : previous.visible }))
    toast.success(show ? 'Date updated, and its resource is now visible' : 'Date updated in Tim and Alex’s portal')
    setEditing(null)
  }

  return <Box component="section" className="team-plain-section" aria-labelledby="dates-heading">
    <Box className="team-plain-heading"><Box><Typography component="h2" variant="titleM" id="dates-heading">Manage upcoming dates</Typography><Typography variant="bodySStandard" color="text.secondary">What each date means for Tim and Alex, and the resource that goes with it.</Typography></Box></Box>
    <Box component="ul" className="team-resource-list">{dates.map(date => {
      const resourceId = date.guidance?.resourceId
      const hidden = !!resourceId && !state.visible.includes(resourceId)
      return <Box component="li" className="team-row team-date-row" key={date.id}>
        <Box className="team-date-badge" aria-hidden="true"><Typography variant="labelS">{month(date.date)}</Typography><Typography variant="titleS">{day(date.date)}</Typography></Box>
        <Box className="team-row-copy">
          <Typography variant="titleXS">{date.title}</Typography>
          <Typography variant="bodySStandard" color="text.secondary">{date.description}</Typography>
          <Box className="team-date-meta">
            <Typography variant="labelS" color={resourceId ? 'text.primary' : 'text.secondary'} className="team-date-resource"><MenuBookOutlined sx={{ fontSize: 16 }} />{resourceId ? titleOf(resourceId) ?? 'Resource no longer available' : 'No resource attached'}</Typography>
            {hidden && <Typography variant="labelS" className="team-date-warning"><InfoOutlined sx={{ fontSize: 16 }} />Hidden from clients, so the link won’t show</Typography>}
            {!date.guidance?.explanation && <Typography variant="labelS" color="text.secondary">No “what this means” yet</Typography>}
          </Box>
        </Box>
        <Button size="small" startIcon={<EditOutlined />} onClick={() => open(date)} aria-label={`Edit ${date.title}`}>Edit</Button>
      </Box>
    })}</Box>
    <PlaceModal open={!!editing} onClose={() => setEditing(null)} size="l" title={editing ? `Edit “${editing.title}”` : ''} description="Changes appear in Tim and Alex’s portal right away." actions={<><Button onClick={() => setEditing(null)}>Cancel</Button><Button variant="contained" onClick={save}>Save date</Button></>}>
      <Stack spacing={3} sx={{ pt: 1 }}>
        <Box className="team-date-fields"><TextField label="Title" value={draft.title} onChange={event => setDraft({ ...draft, title: event.target.value })} fullWidth /><TextField label="Date" type="date" value={draft.date} onChange={event => setDraft({ ...draft, date: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} /></Box>
        <TextField label="Short description" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} fullWidth helperText="Shown under the date in the client’s list." />
        <TextField label="What this means" value={draft.explanation} onChange={event => setDraft({ ...draft, explanation: event.target.value })} fullWidth multiline minRows={3} helperText="Plain-language context clients see when they open the date." />
        <TextField label="How to prepare" value={draft.preparation} onChange={event => setDraft({ ...draft, preparation: event.target.value })} fullWidth multiline minRows={2} />
        <TextField select label="Attached resource" value={draft.resourceId} onChange={event => setDraft({ ...draft, resourceId: event.target.value })} fullWidth helperText="Clients see a link to this resource next to the date.">
          <MenuItem value=""><em>No resource</em></MenuItem>
          {published.map(resource => <MenuItem value={resource.id} key={resource.id}>{resource.published?.title}{state.visible.includes(resource.id) ? '' : ' · hidden'}</MenuItem>)}
        </TextField>
        {draftHidden && <FormControlLabel control={<Checkbox checked={alsoShow} onChange={event => setAlsoShow(event.target.checked)} />} label="This resource is hidden. Also show it to clients so the link appears." />}
      </Stack>
    </PlaceModal>
  </Box>
}
