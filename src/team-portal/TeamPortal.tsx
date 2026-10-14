/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Avatar, Box, Button, Chip, FormControl, IconButton, InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Select, Stack, Switch, Tab, Tabs, TextField, Typography } from '@mui/material'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import AddOutlined from '@mui/icons-material/AddOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import FormatBoldOutlined from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlined from '@mui/icons-material/FormatItalicOutlined'
import FormatListBulletedOutlined from '@mui/icons-material/FormatListBulletedOutlined'
import LinkOutlined from '@mui/icons-material/LinkOutlined'
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined'
import OpenInNewOutlined from '@mui/icons-material/OpenInNewOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import { SegmentedSwitch } from '../components/SegmentedSwitch'
import { PortalOutlineTag } from '../components/PortalOutlineTag'
import { brandAssets } from '../assets/brand'
import { sampleSellerTransaction as transaction } from '../seller-portal/sellerTransaction'
import { cleanResourceHtml, defaultDifferences, liveCount, loadTeamState, roleFromUrl, selectableResources, statusOf, teamPeople, teamStateKey, titleOf } from './teamData'
import type { DefaultSelection, ResourceContent, TeamResource, TeamState, TransactionKind } from './teamData'
import { ClientAccess } from './ClientAccess'
import { DatesSection } from './DatesSection'
import './team-portal.css'

type SetState = (next: TeamState | ((previous: TeamState) => TeamState)) => void
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
/** With no saved default, new transactions start with Brivity’s basics visible. */
const brivityBasics = (state: TeamState) => selectableResources(state).filter(resource => resource.source === 'Brivity').map(resource => resource.id)

function Heading({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <Box className="team-heading"><Box className="team-heading-copy"><Typography component="h1" variant="titleL">{title}</Typography><Typography variant="bodyMStandard" color="text.secondary">{description}</Typography></Box>{actions && <Box className="team-heading-actions">{actions}</Box>}</Box>
}
function Note({ children }: { children: ReactNode }) {
  return <Box className="team-note"><InfoOutlined fontSize="small" /><Typography component="div" variant="bodySStandard">{children}</Typography></Box>
}
function ResourceBody({ content }: { content: ResourceContent }) {
  return <Box><Typography component="h2" variant="titleM" sx={{ mb: 1.5 }}>{content.title}</Typography><Typography variant="bodyMStandard" color="text.secondary" sx={{ mb: 4 }}>{content.summary}</Typography><Typography component="div" variant="bodyMStandard" className="team-guide-content" dangerouslySetInnerHTML={{ __html: cleanResourceHtml(content.html) }} /></Box>
}
function SourceLabel({ resource }: { resource: TeamResource }) {
  return <Typography variant="bodySStandard" color="text.secondary">{resource.source === 'Team' ? 'Ben Kinney Team' : 'Provided by Brivity'}</Typography>
}
function ResourceNameList({ ids, state }: { ids: string[]; state: TeamState }) {
  return <Box component="ul" className="team-name-list">{ids.map(id => <Typography component="li" variant="bodySStandard" key={id}>{titleOf(state.resources.find(resource => resource.id === id)!)}</Typography>)}</Box>
}
function ChangeSummary({ shown, hidden, state }: { shown: string[]; hidden: string[]; state: TeamState }) {
  return <Stack spacing={2}>{shown.length > 0 && <Box><Typography variant="labelM">Will be visible</Typography><ResourceNameList ids={shown} state={state} /></Box>}{hidden.length > 0 && <Box><Typography variant="labelM">Will be hidden</Typography><ResourceNameList ids={hidden} state={state} /></Box>}</Stack>
}

export function TeamPortal() {
  const [state, setStoredState] = useState<TeamState>(() => {
    const loaded = loadTeamState()
    const role = roleFromUrl(loaded.role)
    if (role !== loaded.role) localStorage.setItem(teamStateKey, JSON.stringify({ ...loaded, role }))
    return { ...loaded, role }
  })
  const setState: SetState = next => {
    setStoredState(previous => {
      const updated = typeof next === 'function' ? next(previous) : next
      localStorage.setItem(teamStateKey, JSON.stringify(updated))
      return updated
    })
  }
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const selectedId = new URLSearchParams(window.location.search).get('id') ?? 'team-welcome'
  const selected = state.resources.find(resource => resource.id === selectedId)
  const updateResource = (resource: TeamResource) => setState(previous => ({ ...previous, resources: previous.resources.some(item => item.id === resource.id) ? previous.resources.map(item => item.id === resource.id ? resource : item) : [...previous.resources, resource] }))
  const isTransaction = ['/team', '/team/resources'].includes(path)
  const isLibrary = ['/team/library', '/team/editor'].includes(path)
  const person = teamPeople[state.role]
  const section = isTransaction ? 'Client experience' : isLibrary ? 'Resource library' : 'Team defaults'
  return <Box className="team-app">
    <Box component="header" className="team-topbar">
      <Box className="team-brand"><a href="/" aria-label="PLACE home"><img src={brandAssets.place.wordmarkDefault} alt="PLACE" /></a><Box className="team-brand-copy"><Typography variant="titleXS">Client experience</Typography><Typography variant="bodySStandard" color="text.secondary">Ben Kinney Team</Typography></Box></Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><Avatar src={transaction.team.find(member => member.id === person.photoId)?.photoUrl} alt="" sx={{ width: 36, height: 36 }} /><Box><Typography variant="labelM">{person.name}</Typography><Typography variant="labelS" color="text.secondary">{person.role}</Typography></Box></Stack>
    </Box>
    <Box className="team-layout"><Box component="aside" className="team-sidebar">
      <Box component="nav" aria-label="Team workspace">
        <a className="team-nav-link" href="/team" aria-current={isTransaction ? 'page' : undefined}><HomeOutlined fontSize="small" /><Typography variant="labelM">Client experience</Typography></a>
        <a className="team-nav-link" href="/team/library" aria-current={isLibrary ? 'page' : undefined}><MenuBookOutlined fontSize="small" /><Typography variant="labelM">Resource library</Typography></a>
        <a className="team-nav-link" href="/team/defaults" aria-current={path === '/team/defaults' ? 'page' : undefined}><TuneOutlined fontSize="small" /><Typography variant="labelM">Team defaults</Typography></a>
      </Box>
      <Box className="team-sidebar-bottom"><Typography variant="bodySStandard" color="text.secondary">Ben Kinney Team</Typography><Typography variant="labelS" color="text.secondary" sx={{ mt: 1 }}>Powered by PLACE</Typography></Box>
    </Box>
    <Box component="main" className="team-main"><Box className="team-breadcrumb"><Typography variant="labelS" color="text.secondary">TEAM WORKSPACE</Typography><Typography variant="labelS" color="text.secondary">/</Typography><Typography variant="labelS">{section}</Typography></Box>
      {isTransaction && <TransactionPage state={state} setState={setState} />}
      {path === '/team/library' && <ResourceLibrary state={state} setState={setState} updateResource={updateResource} />}
      {path === '/team/editor' && (state.role === 'admin' ? <ResourceEditor resource={selected} state={state} updateResource={updateResource} /> : <ReadOnlyResource resource={selected} />)}
      {path === '/team/defaults' && <TeamDefaults state={state} setState={setState} />}
      {!['/team', '/team/resources', '/team/library', '/team/editor', '/team/defaults'].includes(path) && <Heading title="This team view isn’t available" description="Choose a screen from the sandbox index." actions={<Button component="a" href="/">Back to index</Button>} />}
    </Box></Box>
  </Box>
}

function PreviewCard({ state }: { state: TeamState }) {
  const frame = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)
  const version = JSON.stringify([state.visible, state.dates])
  const [loadedVersion, setLoadedVersion] = useState<string | null>(null)
  const loaded = loadedVersion === version
  useEffect(() => {
    const element = frame.current
    if (!element || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1280))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  // The portal fades its content in after load, so wait for that before revealing the snapshot.
  const onLoad = () => window.setTimeout(() => setLoadedVersion(version), 700)
  return <a className="team-preview-card" href="/team/preview" target="_blank" rel="noopener noreferrer" aria-label="Open Tim and Alex’s client view in a new tab" aria-busy={!loaded}>
    <Box ref={frame} className={`team-preview-frame${loaded ? ' is-loaded' : ''}`} aria-hidden="true">
      <iframe key={version} src="/team/preview?embed=1" title="Client view snapshot" tabIndex={-1} scrolling="no" onLoad={onLoad} style={{ transform: `scale(${scale})` }} />
      <Box className="team-preview-skeleton">
        <Box className="sk-bar" />
        <Box className="sk-hero"><Box className="sk-copy"><Box className="sk-line short" /><Box className="sk-line title" /><Box className="sk-line" /><Box className="sk-line mid" /></Box><Box className="sk-image" /></Box>
        <Box className="sk-cards"><Box className="sk-card" /><Box className="sk-card" /></Box>
      </Box>
    </Box>
    <Box className="team-preview-hover" aria-hidden="true"><Typography variant="labelM">Open client view</Typography><OpenInNewOutlined fontSize="small" /></Box>
  </a>
}

function TransactionPage({ state, setState }: { state: TeamState; setState: SetState }) {
  const [guide, setGuide] = useState<ResourceContent | null>(null)
  const [saveOpen, setSaveOpen] = useState(false)
  const isAdmin = state.role === 'admin'
  const selection = state.defaults.seller
  const available = state.resources.filter(resource => resource.published && (!resource.archived || state.visible.includes(resource.id)))
  const visibleCount = state.visible.filter(id => state.resources.some(resource => resource.id === id && resource.published)).length
  const toSave = selectableResources(state).filter(resource => state.visible.includes(resource.id)).map(resource => resource.id)
  const saveChanges = defaultDifferences({ ...state, visible: toSave }, selection)
  const attached = new Set(state.dates.flatMap(date => date.guidance?.resourceIds ?? []))
  const [tab, setTab] = useState<'dates' | 'resources'>(() => window.location.pathname.startsWith('/team/resources') ? 'resources' : 'dates')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'Brivity' | 'Team'>('all')
  useEffect(() => { if (window.location.pathname.startsWith('/team/resources')) document.getElementById('resources')?.scrollIntoView?.() }, [])
  function toggle(resource: TeamResource) {
    const showing = state.visible.includes(resource.id)
    setState(previous => ({ ...previous, visible: showing ? previous.visible.filter(id => id !== resource.id) : [...previous.visible, resource.id], resources: !showing && resource.source === 'Team' && resource.linked === 0 ? previous.resources.map(item => item.id === resource.id ? { ...item, linked: 1 } : item) : previous.resources }))
    toast.success(`${showing ? 'Hidden from' : 'Visible in'} Tim and Alex’s portal`)
  }
  function saveDefault() {
    if (!isAdmin) return
    setState(previous => ({ ...previous, defaults: { ...previous.defaults, seller: { visible: toSave, updatedBy: teamPeople.admin.name, updatedOn: today() } } }))
    setSaveOpen(false)
    toast.success('Seller default saved. New seller transactions will start here.')
  }
  return <>
    <Box className="team-txn-header">
      <Box className="team-txn-title">
        <Typography variant="labelS" color="text.secondary" className="team-eyebrow">Seller transaction</Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Chip label="Under contract" size="small" icon={<HomeOutlined />} className="status-chip" /></Stack>
        <Typography component="h1" variant="displayS">128 Meadowbrook Lane</Typography>
        <Typography variant="bodyMStandard" color="text.secondary">Tim & Alex Bennett · Kalispell, MT 59901</Typography>
      </Box>
    </Box>
    <Box className="team-split team-txn-top">
      <Box component="section" className="team-preview-section" aria-labelledby="preview-heading"><Box className="team-preview-heading"><Typography component="h2" variant="titleS" id="preview-heading">Preview client view</Typography><Typography variant="bodySStandard" color="text.secondary">Tim and Alex’s seller portal right now. Opens in a new tab.</Typography></Box><PreviewCard state={state} /></Box>
      <ClientAccess state={state} setState={setState} />
    </Box>
    <Box component="section" id="resources" className="team-plain-section" aria-labelledby="manage-heading">
      <Box className="team-plain-heading">
        <Typography component="h2" variant="titleM" id="manage-heading">Manage what clients see</Typography>
      </Box>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Client content" className="team-manage-tabs">
        <Tab value="dates" label="Upcoming dates" id="manage-tab-dates" aria-controls="manage-panel-dates" />
        <Tab value="resources" label={`Resources · ${visibleCount} visible`} id="manage-tab-resources" aria-controls="manage-panel-resources" />
      </Tabs>
      {tab === 'dates' && <Box role="tabpanel" id="manage-panel-dates" aria-labelledby="manage-tab-dates" className="team-tab-panel"><DatesSection state={state} setState={setState} /></Box>}
      {tab === 'resources' && <Box role="tabpanel" id="manage-panel-resources" aria-labelledby="manage-tab-resources" className="team-tab-panel">
        <Box className="team-resource-toolbar">
          <SegmentedSwitch size="s" aria-label="Filter resources" value={sourceFilter} onChange={setSourceFilter} options={[{ value: 'all', label: 'All' }, { value: 'Brivity', label: 'From Brivity' }, { value: 'Team', label: 'From your team' }]} />
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {isAdmin && <Button size="small" onClick={() => setSaveOpen(true)} disabled={!!selection && saveChanges.shown.length + saveChanges.hidden.length === 0}>Save as seller default</Button>}
            <Button component="a" href="/team/library" size="small" variant="outlined" endIcon={<ArrowForwardOutlined />}>Resource library</Button>
          </Stack>
        </Box>
        <Box component="ul" className="team-resource-list">{available.filter(resource => sourceFilter === 'all' || resource.source === sourceFilter).map(resource => {
          const showing = state.visible.includes(resource.id)
          return <Box component="li" className={`team-row${showing ? '' : ' is-hidden'}`} key={resource.id}>
            <Box className="team-row-copy"><Box className="team-row-title"><Typography variant="titleXS">{resource.published?.title}</Typography><PortalOutlineTag label={resource.source === 'Brivity' ? 'Brivity' : 'Your team'} className={`team-source-tag ${resource.source === 'Brivity' ? 'brivity' : 'team'}`} /></Box><Typography variant="bodySStandard" color="text.secondary">{resource.published?.summary}</Typography>{(attached.has(resource.id) || resource.archived) && <Box className="team-row-meta">{attached.has(resource.id) && <Typography variant="labelS" color="text.secondary">Attached to a date</Typography>}{resource.archived && <Typography variant="labelS" color="text.secondary">Archived</Typography>}</Box>}</Box>
            <Box className="team-row-actions"><Typography variant="labelS" color={showing ? 'text.primary' : 'text.secondary'} className="team-visibility-label">{showing ? 'Visible' : 'Hidden'}</Typography><IconButton aria-label={`Preview ${resource.published?.title}`} onClick={() => setGuide(resource.published)}><VisibilityOutlined fontSize="small" /></IconButton><Switch checked={showing} onChange={() => toggle(resource)} slotProps={{ input: { 'aria-label': `Show ${resource.published?.title} to clients` } }} color="primary" /></Box>
          </Box>
        })}</Box>
      </Box>}
    </Box>
    <PlaceModal open={saveOpen} onClose={() => setSaveOpen(false)} title={selection ? 'Update the seller default?' : 'Save as the seller default?'} description="New seller transactions will start with this selection. Existing transactions keep their current choices." actions={<><Button onClick={() => setSaveOpen(false)}>Cancel</Button><Button variant="contained" onClick={saveDefault}>{selection ? 'Update default' : 'Save default'}</Button></>}>
      <Stack spacing={3}>{selection ? <><Typography variant="bodyMStandard">Changes from the current default, saved {selection.updatedOn} by {selection.updatedBy}:</Typography><ChangeSummary shown={saveChanges.shown} hidden={saveChanges.hidden} state={state} /></> : <><Typography variant="bodyMStandard">{plural(toSave.length, 'resource')} will start visible:</Typography><ResourceNameList ids={toSave} state={state} /></>}</Stack>
    </PlaceModal>
    <PlaceModal open={!!guide} onClose={() => setGuide(null)} title="Resource preview" size="l">{guide && <ResourceBody content={guide} />}</PlaceModal>
  </>
}

function ResourceLibrary({ state, setState, updateResource }: { state: TeamState; setState: SetState; updateResource: (resource: TeamResource) => void }) {
  const isAdmin = state.role === 'admin'
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All resources')
  const [menu, setMenu] = useState<{ anchor: HTMLElement; resource: TeamResource } | null>(null)
  const [archive, setArchive] = useState<TeamResource | null>(null)
  const [remove, setRemove] = useState<TeamResource | null>(null)
  const [guide, setGuide] = useState<ResourceContent | null>(null)
  const matches = (resource: TeamResource) => {
    if (!isAdmin) return !resource.archived && !!resource.published
    if (filter === 'Archived') return resource.archived
    return !resource.archived && (filter === 'All resources' || (filter === 'Published' && !!resource.published) || (filter === 'Drafts' && !!resource.draft))
  }
  const resources = state.resources.filter(resource => resource.source === 'Team' && titleOf(resource).toLowerCase().includes(search.toLowerCase()) && matches(resource))
  const removeLive = remove?.published ? liveCount(remove, state) : 0
  const archiveLive = archive ? liveCount(archive, state) : 0
  function deleteResource() {
    if (!remove || !isAdmin) return
    const id = remove.id
    const without = (selection: DefaultSelection | null) => selection && { ...selection, visible: selection.visible.filter(visibleId => visibleId !== id) }
    setState(previous => ({ ...previous, resources: previous.resources.filter(resource => resource.id !== id), visible: previous.visible.filter(visibleId => visibleId !== id), defaults: { buyer: without(previous.defaults.buyer), seller: without(previous.defaults.seller) } }))
    setRemove(null)
    toast.success(removeLive ? `Deleted and removed from ${plural(removeLive, 'transaction')}` : 'Resource deleted')
  }
  return <>
    <Heading title="Team resource library" description={isAdmin ? 'Create materials once. Share them across your transactions, and keep the guidance current for every client.' : 'Guides your admins have published for the team. Choose which ones clients see from each transaction.'} actions={isAdmin ? <Button component="a" href="/team/editor?id=new" variant="contained" startIcon={<AddOutlined />}>Create resource</Button> : undefined} />
    <Note>{isAdmin ? 'Publishing, archiving, and deleting reach every transaction that uses a resource. You’ll see that reach before you confirm.' : 'Admins create and update library resources. To change what a client sees, open their transaction’s resources.'}</Note>
    <Box className="team-library-toolbar"><TextField size="small" label="Search team resources" value={search} onChange={event => setSearch(event.target.value)} sx={{ width: { xs: '100%', sm: 320 } }} />{isAdmin && <FormControl size="small" sx={{ minWidth: 180 }}><InputLabel id="library-status-label">Show</InputLabel><Select labelId="library-status-label" label="Show" value={filter} onChange={event => setFilter(event.target.value)}>{['All resources', 'Published', 'Drafts', 'Archived'].map(value => <MenuItem value={value} key={value}>{value}</MenuItem>)}</Select></FormControl>}</Box>
    <Box className={`team-library-table header${isAdmin ? '' : ' member'}`}><Typography variant="labelM">Resource</Typography>{isAdmin && <Typography variant="labelM">Status</Typography>}<Typography variant="labelM" className="team-library-linked">Live in</Typography><Typography variant="labelM" className="team-library-action-label">Actions</Typography></Box>
    {resources.map(resource => <Box className={`team-library-table${isAdmin ? '' : ' member'}`} key={resource.id}>
      <Box className="team-library-title"><Typography variant="titleXS">{isAdmin ? <a href={`/team/editor?id=${resource.id}`}>{titleOf(resource)}</a> : titleOf(resource)}</Typography><Typography variant="bodySStandard" color="text.secondary">{(isAdmin ? resource.draft ?? resource.published : resource.published)?.summary}</Typography></Box>
      {isAdmin && <Box className="team-library-status"><Chip label={statusOf(resource)} size="small" variant="outlined" /></Box>}
      <Typography variant="bodySStandard" className="team-library-linked">{resource.published ? plural(liveCount(resource, state), 'transaction') : '—'}</Typography>
      <Stack direction="row" className="team-library-action">
        <IconButton aria-label={`Preview ${titleOf(resource)}`} onClick={() => setGuide(isAdmin ? resource.draft ?? resource.published : resource.published)}><VisibilityOutlined fontSize="small" /></IconButton>
        {isAdmin && <IconButton aria-label={`More actions for ${titleOf(resource)}`} aria-haspopup="menu" onClick={event => setMenu({ anchor: event.currentTarget, resource })}><MoreHorizOutlined fontSize="small" /></IconButton>}
      </Stack>
    </Box>)}
    {resources.length === 0 && <Typography variant="bodyMStandard" color="text.secondary" sx={{ py: 5 }}>No resources match this view.</Typography>}
    <Box className="team-section team-panel"><Typography component="h2" variant="titleS" sx={{ mb: 1.5 }}>Looking for the transaction basics?</Typography><Typography variant="bodyMStandard" color="text.secondary">Brivity’s built-in guides are available in every transaction. Choose which ones your clients see there.</Typography><Button component="a" href="/team/resources" endIcon={<ArrowForwardOutlined />} sx={{ mt: 2, ml: -1 }}>Go to transaction resources</Button></Box>
    <Menu anchorEl={menu?.anchor} open={!!menu} onClose={() => setMenu(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      {menu && !menu.resource.archived && <MenuItem component="a" href={`/team/editor?id=${menu.resource.id}`}><ListItemIcon><EditOutlined fontSize="small" /></ListItemIcon><ListItemText>Edit</ListItemText></MenuItem>}
      {menu && !menu.resource.archived && menu.resource.published && <MenuItem onClick={() => { setArchive(menu.resource); setMenu(null) }}><ListItemIcon><ArchiveOutlined fontSize="small" /></ListItemIcon><ListItemText>Archive</ListItemText></MenuItem>}
      {menu && <MenuItem onClick={() => { setRemove(menu.resource); setMenu(null) }} sx={{ color: 'error.main' }}><ListItemIcon sx={{ color: 'inherit' }}><DeleteOutlineOutlined fontSize="small" /></ListItemIcon><ListItemText>Delete</ListItemText></MenuItem>}
    </Menu>
    <PlaceModal open={!!archive} onClose={() => setArchive(null)} title={`Archive “${archive ? titleOf(archive) : ''}”?`} description="It can no longer be chosen for transactions or included in defaults." actions={<><Button onClick={() => setArchive(null)}>Cancel</Button><Button variant="contained" onClick={() => { if (!archive || !isAdmin) return; updateResource({ ...archive, archived: true }); setArchive(null); toast.success('Resource archived') }}>Archive resource</Button></>}>
      <Note>{archiveLive ? `It stays in the ${plural(archiveLive, 'transaction')} where it’s live now. Clients there keep seeing the published version.` : 'It isn’t live in any transactions.'}</Note>
    </PlaceModal>
    <PlaceModal open={!!remove} onClose={() => setRemove(null)} title={`Delete “${remove ? titleOf(remove) : ''}”?`} description="This can’t be undone." actions={<><Button onClick={() => setRemove(null)}>Cancel</Button>{remove && removeLive > 0 && !remove.archived && <Button variant="outlined" onClick={() => { setArchive(remove); setRemove(null) }}>Archive instead</Button>}<Button variant="contained" color="error" onClick={deleteResource}>Delete resource</Button></>}>
      {removeLive > 0
        ? <Stack spacing={2}><Box className="team-impact-callout"><Typography variant="metricM">{removeLive}</Typography><Typography variant="titleXS">{removeLive === 1 ? 'transaction has' : 'transactions have'} this resource live</Typography></Box><Typography variant="bodyMStandard">Deleting removes it from those client portals right away. To stop offering it while keeping it where it’s live, archive it instead.</Typography></Stack>
        : <Typography variant="bodyMStandard">{remove?.published ? 'It isn’t live in any transactions, so no client will notice.' : 'This draft was never published, so no client will notice.'}</Typography>}
    </PlaceModal>
    <PlaceModal open={!!guide} onClose={() => setGuide(null)} title={isAdmin ? 'Team resource preview' : 'Resource preview'} description={isAdmin ? 'Shows the latest saved draft when one exists. Clients continue seeing the published version.' : undefined} size="l">{guide && <ResourceBody content={guide} />}</PlaceModal>
  </>
}

function TeamDefaults({ state, setState }: { state: TeamState; setState: SetState }) {
  const isAdmin = state.role === 'admin'
  const [kind, setKind] = useState<TransactionKind>('seller')
  const [draft, setDraft] = useState<string[] | null>(null)
  const [removeOpen, setRemoveOpen] = useState(false)
  const selection = state.defaults[kind]
  const selectable = selectableResources(state)
  const visibleIds = draft ?? selection?.visible ?? brivityBasics(state)
  const skipped = (selection?.visible ?? []).filter(id => !selectable.some(resource => resource.id === id))
  const label = kind === 'seller' ? 'Seller' : 'Buyer'
  function save() {
    if (!isAdmin || !draft) return
    setState(previous => ({ ...previous, defaults: { ...previous.defaults, [kind]: { visible: draft, updatedBy: teamPeople.admin.name, updatedOn: today() } } }))
    setDraft(null)
    toast.success(`${label} default saved. New ${kind} transactions will start here.`)
  }
  function removeDefault() {
    setState(previous => ({ ...previous, defaults: { ...previous.defaults, [kind]: null } }))
    setRemoveOpen(false)
    toast.success(`${label} default removed`)
  }
  function group(title: string, items: TeamResource[]) {
    return <Box className="team-default-group"><Typography component="h3" variant="labelM" color="text.secondary">{title}</Typography>
      {items.length === 0 && <Typography variant="bodySStandard" color="text.secondary" className="team-row">None</Typography>}
      <Box component="ul" className="team-resource-list">{items.map(resource => <Box component="li" className="team-row" key={resource.id}><Box className="team-row-copy"><Typography variant="titleXS">{resource.published?.title}</Typography><SourceLabel resource={resource} /></Box>{draft && <Switch checked={draft.includes(resource.id)} onChange={() => setDraft(draft.includes(resource.id) ? draft.filter(id => id !== resource.id) : [...draft, resource.id])} slotProps={{ input: { 'aria-label': `Start ${resource.published?.title} visible` } }} />}</Box>)}</Box>
    </Box>
  }
  return <>
    <Heading title="Team defaults" description="The resources new transactions start with. Anyone on a transaction can still adjust it, and changing a default never touches existing transactions." />
    <SegmentedSwitch aria-label="Transaction type" options={[{ value: 'seller', label: 'Seller' }, { value: 'buyer', label: 'Buyer' }]} value={kind} onChange={value => { setKind(value); setDraft(null) }} disabled={!!draft} />
    <Box className="team-split" sx={{ mt: 4 }}>
      <Box className="team-panel team-panel-white">
        <Box className="team-panel-heading"><Box className="team-panel-heading-copy"><Typography component="h2" variant="titleS">{label} default</Typography><Typography variant="bodySStandard" color="text.secondary">{draft ? 'Choose what new transactions show clients from the start.' : selection ? `Updated ${selection.updatedOn} by ${selection.updatedBy}` : `No ${kind} default yet. New ${kind} transactions start with Brivity’s basics.`}</Typography></Box>
          {isAdmin && (draft
            ? <Stack direction="row" spacing={1}><Button onClick={() => setDraft(null)}>Cancel</Button><Button variant="contained" onClick={save}>Save default</Button></Stack>
            : <Stack direction="row" spacing={1}>{selection && <Button onClick={() => setRemoveOpen(true)}>Remove</Button>}<Button variant="outlined" startIcon={selection ? <EditOutlined /> : <AddOutlined />} onClick={() => setDraft(visibleIds.filter(id => selectable.some(resource => resource.id === id)))}>{selection ? 'Edit' : `Set up ${kind} default`}</Button></Stack>)}
        </Box>
        {skipped.length > 0 && !draft && <Box sx={{ mb: 3 }}><Note>{plural(skipped.length, 'resource')} in this default {skipped.length === 1 ? 'is' : 'are'} archived and won’t be added to new transactions.</Note></Box>}
        {draft
          ? group('Resources', selectable)
          : <>{group('Starts visible', selectable.filter(resource => visibleIds.includes(resource.id)))}{group('Starts hidden', selectable.filter(resource => !visibleIds.includes(resource.id)))}</>}
      </Box>
      <Stack spacing={3}>
        <Box className="team-panel"><Typography component="h2" variant="titleS" sx={{ mb: 2 }}>How defaults work</Typography><Box component="ul" className="team-plain-list"><Typography component="li" variant="bodyMStandard" color="text.secondary">Applied once, when a transaction is created.</Typography><Typography component="li" variant="bodyMStandard" color="text.secondary">Buyer and seller transactions each have their own.</Typography><Typography component="li" variant="bodyMStandard" color="text.secondary">Anyone on a transaction can adjust what their clients see.</Typography></Box></Box>
        {!isAdmin && <Note>Admins manage team defaults. To change what a client sees, open their transaction’s resources.</Note>}
      </Stack>
    </Box>
    <PlaceModal open={removeOpen} onClose={() => setRemoveOpen(false)} title={`Remove the ${kind} default?`} description="Existing transactions keep their choices." actions={<><Button onClick={() => setRemoveOpen(false)}>Cancel</Button><Button variant="contained" onClick={removeDefault}>Remove default</Button></>}>
      <Typography variant="bodyMStandard">New {kind} transactions will start with Brivity’s basics visible and your team’s resources hidden.</Typography>
    </PlaceModal>
  </>
}

function ReadOnlyResource({ resource }: { resource?: TeamResource }) {
  return <>
    <Heading title="Admins edit library resources" description="You can read the published version and choose it for your transactions." actions={<Button component="a" href="/team/library" startIcon={<ArrowBackOutlined />}>Back to library</Button>} />
    {resource?.published ? <Box className="team-panel team-panel-white team-reading"><ResourceBody content={resource.published} /></Box> : <Typography variant="bodyMStandard" color="text.secondary">This resource hasn’t been published yet.</Typography>}
  </>
}

function ResourceEditor({ resource, state, updateResource }: { resource?: TeamResource; state: TeamState; updateResource: (resource: TeamResource) => void }) {
  const [id] = useState(() => resource?.id ?? `team-${Date.now()}`)
  const original = resource?.draft ?? resource?.published
  const [title, setTitle] = useState(original?.title ?? '')
  const [summary, setSummary] = useState(original?.summary ?? '')
  const [html, setHtml] = useState(original?.html ?? '<p>Start writing your guide here.</p>')
  const [preview, setPreview] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [url, setUrl] = useState('')
  const editor = useRef<HTMLDivElement>(null)
  const selection = useRef<Range | null>(null)
  const archived = !!resource?.archived
  const live = resource?.published ? liveCount(resource, state) : 0
  useEffect(() => { if (editor.current) editor.current.innerHTML = original?.html ?? '<p>Start writing your guide here.</p>' }, [original?.html])
  function format(command: string, value?: string) { editor.current?.focus(); document.execCommand(command, false, value); setHtml(editor.current?.innerHTML ?? '') }
  function save() {
    if (!title.trim() || !editor.current?.textContent?.trim()) { toast.error('Add a title and some content before saving.'); return }
    updateResource({ id, source: 'Team', archived: false, linked: resource?.linked ?? 0, published: resource?.published ?? null, draft: { title: title.trim(), summary: summary.trim(), html: cleanResourceHtml(html) } })
    window.history.replaceState(null, '', `/team/editor?id=${id}`)
    toast.success('Draft saved. Clients won’t see changes until you publish.')
  }
  function publish() {
    if (state.role !== 'admin' || archived || !title.trim()) return
    const content = { title: title.trim(), summary: summary.trim(), html: cleanResourceHtml(html) }
    updateResource({ id, source: 'Team', archived: false, linked: resource?.linked ?? 0, published: content, draft: null })
    window.history.replaceState(null, '', `/team/editor?id=${id}`)
    setPublishOpen(false)
    toast.success(live ? `Published to ${plural(live, 'transaction')}` : 'Resource published')
  }
  const tool = (label: string, icon: ReactNode, onClick: () => void) => <IconButton disabled={archived} aria-label={label} onMouseDown={event => event.preventDefault()} onClick={onClick}>{icon}</IconButton>
  return <>
    <Heading title={resource ? 'Edit resource' : 'Create resource'} description={resource?.published ? 'Clients keep seeing the published version until you publish these changes.' : 'Write a useful guide. Save a draft, then publish when it’s ready.'} actions={<><Button onClick={() => setPreview(true)} startIcon={<VisibilityOutlined />}>Preview</Button>{!archived && <Button onClick={() => save()} variant="outlined">Save draft</Button>}{!archived && <Button onClick={() => { if (!title.trim() || !editor.current?.textContent?.trim()) { toast.error('Add a title and some content before publishing.'); return }; setPublishOpen(true) }} variant="contained">Publish</Button>}</>} />
    <Box className="team-split">
      <Box>
        <Box className="team-editor-fields"><TextField label="Resource title" value={title} onChange={event => setTitle(event.target.value)} fullWidth disabled={archived} /><TextField label="Short description" value={summary} onChange={event => setSummary(event.target.value)} fullWidth multiline minRows={2} disabled={archived} /></Box>
        <Typography variant="labelM" component="label" htmlFor="resource-content" sx={{ display: 'block', mb: 1 }}>Guide content</Typography>
        <Box className="team-editor-toolbar" role="toolbar" aria-label="Text formatting">
          <Button disabled={archived} onMouseDown={event => event.preventDefault()} onClick={() => format('formatBlock', 'h2')}>Heading</Button>
          <Button disabled={archived} onMouseDown={event => event.preventDefault()} onClick={() => format('formatBlock', 'p')}>Paragraph</Button>
          {tool('Bold', <FormatBoldOutlined />, () => format('bold'))}
          {tool('Italic', <FormatItalicOutlined />, () => format('italic'))}
          {tool('Bulleted list', <FormatListBulletedOutlined />, () => format('insertUnorderedList'))}
          {tool('Add link', <LinkOutlined />, () => { const current = window.getSelection(); selection.current = current?.rangeCount ? current.getRangeAt(0).cloneRange() : null; setUrl(''); setLinkOpen(true) })}
        </Box>
        <Typography component="div" variant="bodyMStandard" id="resource-content" ref={editor} contentEditable={!archived} suppressContentEditableWarning role="textbox" aria-label="Guide content" aria-multiline="true" className="team-rich-editor" onInput={() => setHtml(editor.current?.innerHTML ?? '')} />
      </Box>
      <Stack spacing={3}>
        <Box className="team-panel">
          <Typography component="h2" variant="titleS" sx={{ mb: 2 }}>{archived ? 'Archived resource' : 'Status'}</Typography>
          <Chip label={resource ? statusOf(resource) : 'New draft'} variant="outlined" size="small" />
          <Box component="dl" className="team-definition">
            <div><Typography component="dt" variant="labelM" color="text.secondary">Live in</Typography><Typography component="dd" variant="titleXS">{resource?.published ? plural(live, 'transaction') : 'Not published yet'}</Typography></div>
            <div><Typography component="dt" variant="labelM" color="text.secondary">Library</Typography><Typography component="dd" variant="bodyMStandard">Ben Kinney Team</Typography></div>
          </Box>
        </Box>
        <Box className="team-panel team-panel-white"><Typography component="h2" variant="titleS" sx={{ mb: 1.5 }}>Publish with care</Typography><Typography variant="bodyMStandard" color="text.secondary">Publishing updates every transaction where this resource is live. Hidden resources stay hidden. Saving a draft doesn’t change what clients see.</Typography></Box>
      </Stack>
    </Box>
    <PlaceModal open={preview} onClose={() => setPreview(false)} title="Draft preview" description="This version hasn’t been published to clients." size="l"><ResourceBody content={{ title: title || 'Untitled resource', summary, html }} /></PlaceModal>
    <PlaceModal open={publishOpen} onClose={() => setPublishOpen(false)} title={resource?.linked ? `Publish changes to ${plural(resource.linked, 'transaction')}?` : 'Publish this resource?'} description="Review the version your clients will see before publishing." size="l" actions={<><Button onClick={() => setPublishOpen(false)}>Keep editing</Button><Button variant="contained" onClick={publish}>Publish now</Button></>}>
      <Stack spacing={3}><Note>{resource?.linked ? `This replaces the published version in all ${resource.linked} linked transactions. Hidden resources remain hidden.` : 'Your team can choose this resource for client portals once it’s published.'}</Note><ResourceBody content={{ title, summary, html }} /></Stack>
    </PlaceModal>
    <PlaceModal open={linkOpen} onClose={() => setLinkOpen(false)} title="Add a link" actions={<><Button onClick={() => setLinkOpen(false)}>Cancel</Button><Button variant="contained" disabled={!/^(https?:\/\/|mailto:)/i.test(url)} onClick={() => { setLinkOpen(false); requestAnimationFrame(() => { editor.current?.focus(); const current = window.getSelection(); if (selection.current && current) { current.removeAllRanges(); current.addRange(selection.current) }; format('createLink', url) }) }}>Add link</Button></>}>
      <TextField autoFocus fullWidth label="Link address" placeholder="https://" value={url} onChange={event => setUrl(event.target.value)} helperText="Select the words you want to link before opening this dialog." />
    </PlaceModal>
  </>
}

export function TeamResourceSwitchSample() {
  const [checked, setChecked] = useState(true)
  return <Box className="team-app" sx={{ width: '100%' }}><Box className="team-row"><Box className="team-row-copy"><Typography variant="titleXS">Getting ready for closing day</Typography><Typography variant="bodySStandard" color="text.secondary">Provided by Brivity</Typography><Typography variant="labelS">{checked ? 'Visible to clients' : 'Hidden from clients'}</Typography></Box><Switch checked={checked} onChange={(_, value) => setChecked(value)} slotProps={{ input: { 'aria-label': 'Show closing guide to clients' } }} /></Box></Box>
}
