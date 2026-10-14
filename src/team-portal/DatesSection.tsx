import { useState } from 'react'
import { Autocomplete, Box, Button, Checkbox, Chip, FormControlLabel, Stack, TextField, Typography } from '@mui/material'
import EditOutlined from '@mui/icons-material/EditOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import type { UpcomingDate } from '../transaction-portal/types'
import { DateStamp } from '../transaction-portal/components'
import type { TeamState } from './teamData'

type SetState = (next: TeamState | ((previous: TeamState) => TeamState)) => void

export function DatesSection({ state, setState }: { state: TeamState; setState: SetState }) {
  const [editing, setEditing] = useState<UpcomingDate | null>(null)
  const [draft, setDraft] = useState({ date: '', title: '', description: '', explanation: '', preparation: '', resourceIds: [] as string[] })
  const [alsoShow, setAlsoShow] = useState(true)
  const published = state.resources.filter(resource => resource.published && !resource.archived)
  const titleOf = (id?: string) => state.resources.find(resource => resource.id === id)?.published?.title
  const dates = [...state.dates].sort((a, b) => a.date.localeCompare(b.date))
  const draftHidden = draft.resourceIds.filter(id => !state.visible.includes(id))

  function open(date: UpcomingDate) {
    setDraft({ date: date.date, title: date.title, description: date.description, explanation: date.guidance?.explanation ?? '', preparation: date.guidance?.preparation ?? '', resourceIds: date.guidance?.resourceIds ?? [] })
    setAlsoShow(true)
    setEditing(date)
  }
  function save() {
    if (!editing) return
    if (!draft.title.trim() || !draft.date) { toast.error('Add a title and a date.'); return }
    const hasGuidance = draft.explanation.trim() || draft.preparation.trim() || draft.resourceIds.length
    const updated: UpcomingDate = { id: editing.id, date: draft.date, title: draft.title.trim(), description: draft.description.trim(), guidance: hasGuidance ? { explanation: draft.explanation.trim(), preparation: draft.preparation.trim(), resourceIds: draft.resourceIds } : undefined }
    const show = draftHidden.length > 0 && alsoShow
    setState(previous => ({ ...previous, dates: previous.dates.map(item => item.id === editing.id ? updated : item), visible: show ? [...previous.visible, ...draftHidden] : previous.visible }))
    toast.success(show ? `Date updated, and ${draftHidden.length === 1 ? 'its resource is' : 'its resources are'} now visible` : 'Date updated in Tim and Alex’s portal')
    setEditing(null)
  }

  return <Box>
    <Box component="ul" className="team-resource-list">{dates.map(date => {
      const ids = date.guidance?.resourceIds ?? []
      const hiddenCount = ids.filter(id => !state.visible.includes(id)).length
      return <Box component="li" className="team-row team-date-row" key={date.id}>
        <DateStamp date={date.date} />
        <Box className="team-row-copy">
          <Typography variant="titleXS">{date.title}</Typography>
          <Typography variant="bodySStandard" color="text.secondary">{date.description}</Typography>
          <Box className="team-date-meta">
            {ids.length === 0 && <Typography variant="labelS" color="text.secondary" className="team-date-resource"><MenuBookOutlined sx={{ fontSize: 16 }} />No resources attached</Typography>}
            {ids.map(id => <Typography variant="labelS" key={id} color={state.visible.includes(id) ? 'text.primary' : 'text.secondary'} className="team-date-resource"><MenuBookOutlined sx={{ fontSize: 16 }} />{titleOf(id) ?? 'Resource no longer available'}{state.visible.includes(id) ? '' : ' (hidden)'}</Typography>)}
            {hiddenCount > 0 && <Typography variant="labelS" className="team-date-warning"><InfoOutlined sx={{ fontSize: 16 }} />{hiddenCount === 1 && ids.length === 1 ? 'Hidden from clients, so the link won’t show' : `${hiddenCount} hidden from clients, so ${hiddenCount === 1 ? 'its link won’t' : 'their links won’t'} show`}</Typography>}
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
        <Autocomplete multiple options={published.map(resource => resource.id)} value={draft.resourceIds} onChange={(_, value) => setDraft({ ...draft, resourceIds: value })} getOptionLabel={id => `${titleOf(id) ?? id}${state.visible.includes(id) ? '' : ' · hidden'}`} disableCloseOnSelect filterSelectedOptions
          renderValue={(value, getItemProps) => value.map((id, index) => { const { key, ...itemProps } = getItemProps({ index }); return <Chip key={key} {...itemProps} size="small" label={titleOf(id) ?? id} variant="outlined" /> })}
          renderInput={params => <TextField {...params} label="Attached resources" helperText="One resource shows as a link next to the date. Two or more show as a list when the client opens the date." />} />
        {draftHidden.length > 0 && <FormControlLabel control={<Checkbox checked={alsoShow} onChange={event => setAlsoShow(event.target.checked)} />} label={`${draftHidden.length === 1 ? 'One of these is' : `${draftHidden.length} of these are`} hidden. Also show ${draftHidden.length === 1 ? 'it' : 'them'} to clients so the ${draftHidden.length === 1 ? 'link appears' : 'links appear'}.`} />}
      </Stack>
    </PlaceModal>
  </Box>
}
