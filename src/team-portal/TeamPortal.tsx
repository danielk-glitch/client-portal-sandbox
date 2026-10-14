/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Avatar, Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import AddOutlined from '@mui/icons-material/AddOutlined'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import FormatBoldOutlined from '@mui/icons-material/FormatBoldOutlined'
import FormatItalicOutlined from '@mui/icons-material/FormatItalicOutlined'
import FormatListBulletedOutlined from '@mui/icons-material/FormatListBulletedOutlined'
import LinkOutlined from '@mui/icons-material/LinkOutlined'
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import { brandAssets } from '../assets/brand'
import { sampleSellerTransaction as transaction } from '../seller-portal/sellerTransaction'
import { cleanResourceHtml, loadTeamState, statusOf, teamStateKey, titleOf } from './teamData'
import type { ResourceContent, TeamResource, TeamState } from './teamData'
import './team-portal.css'



function Heading({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return <Box className="team-heading"><Box className="team-heading-copy"><Typography component="h1" variant="titleL">{title}</Typography><Typography variant="bodyMStandard" color="text.secondary">{description}</Typography></Box>{actions && <Box className="team-heading-actions">{actions}</Box>}</Box>
}
function Note({ children }: { children: ReactNode }) {
  return <Box className="team-note"><InfoOutlined fontSize="small" /><Typography variant="bodySStandard">{children}</Typography></Box>
}
function ResourceBody({ content }: { content: ResourceContent }) {
  return <Box><Typography component="h2" variant="titleM" sx={{ mb: 1.5 }}>{content.title}</Typography><Typography variant="bodyMStandard" color="text.secondary" sx={{ mb: 4 }}>{content.summary}</Typography><Typography component="div" variant="bodyMStandard" className="team-guide-content" dangerouslySetInnerHTML={{ __html: cleanResourceHtml(content.html) }} /></Box>
}
function ClientAccess() {
  return <Box className="team-access-list">{transaction.viewers.map(viewer => <Box className="team-access-person" key={viewer.id}><Avatar src={viewer.photoUrl} alt={viewer.name} sx={{ width: 40, height: 40 }} /><Box><Typography variant="titleXS">{viewer.name}</Typography><Typography variant="bodySStandard" color="text.secondary">Portal access active</Typography></Box></Box>)}</Box>
}
function TransactionStrip() {
  return <Box className="team-transaction-strip"><img src={transaction.listing.photoUrl ?? undefined} alt="128 Meadowbrook Lane" /><Box><Typography variant="titleXS">128 Meadowbrook Lane</Typography><Typography variant="bodySStandard" color="text.secondary">Tim & Alex Bennett · Seller transaction</Typography></Box><Chip label="Under contract" size="small" variant="outlined" sx={{ ml: 'auto' }} /></Box>
}

export function TeamPortal() {
  const [state, setStoredState] = useState<TeamState>(loadTeamState)
  function setState(next: TeamState | ((previous: TeamState) => TeamState)) {
    setStoredState(previous => {
      const updated = typeof next === 'function' ? next(previous) : next
      localStorage.setItem(teamStateKey, JSON.stringify(updated))
      return updated
    })
  }
  const path = window.location.pathname.replace(/\/$/, '')
  const selectedId = new URLSearchParams(window.location.search).get('id') ?? 'team-welcome'
  const selected = state.resources.find(resource => resource.id === selectedId)
  const updateResource = (resource: TeamResource) => {
    const updated = { ...state, resources: state.resources.some(item => item.id === resource.id) ? state.resources.map(item => item.id === resource.id ? resource : item) : [...state.resources, resource] }
    localStorage.setItem(teamStateKey, JSON.stringify(updated))
    setState(updated)
  }
  const isTransaction = ['/team', '/team/resources'].includes(path)
  return <Box className="team-app">
    <Box component="header" className="team-topbar">
      <Box className="team-brand"><a href="/" aria-label="PLACE home"><img src={brandAssets.place.wordmarkDefault} alt="PLACE" /></a><Box className="team-brand-copy"><Typography variant="titleXS">Client experience</Typography><Typography variant="bodySStandard" color="text.secondary">Ben Kinney Team</Typography></Box></Box>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><Avatar src={transaction.team.find(person => person.id === 'transaction')?.photoUrl} alt="Morgan Ellis" sx={{ width: 36, height: 36 }} /><Box><Typography variant="labelM">Morgan Ellis</Typography><Typography variant="labelS" color="text.secondary">{state.role === 'admin' ? 'Admin' : 'Team member'}</Typography></Box></Stack>
    </Box>
    <Box className="team-layout"><Box component="aside" className="team-sidebar">
      <Box component="nav" aria-label="Team workspace"><a className="team-nav-link" href="/team" aria-current={isTransaction ? 'page' : undefined}><HomeOutlined fontSize="small" /><Typography variant="labelM">Client experience</Typography></a><a className="team-nav-link" href="/team/library" aria-current={['/team/library','/team/editor'].includes(path) ? 'page' : undefined}><MenuBookOutlined fontSize="small" /><Typography variant="labelM">Resource library</Typography></a></Box>
      <Box className="team-sidebar-bottom"><Typography variant="bodySStandard" color="text.secondary">Ben Kinney Team</Typography><Typography variant="labelS" color="text.secondary" sx={{ mt: 1 }}>Powered by PLACE</Typography></Box>
    </Box>
    <Box component="main" className="team-main"><Box className="team-breadcrumb"><Typography variant="labelS" color="text.secondary">TEAM WORKSPACE</Typography><Typography variant="labelS" color="text.secondary">/</Typography><Typography variant="labelS">{isTransaction ? 'Client experience' : 'Resource library'}</Typography></Box>
      {isTransaction && <Box sx={{ mt: 3 }}><TransactionStrip /><Box component="nav" aria-label="Transaction views" className="team-transaction-nav"><a href="/team" aria-current={path === '/team' ? 'page' : undefined}>Overview</a><a href="/team/resources" aria-current={path === '/team/resources' ? 'page' : undefined}>Resources</a></Box></Box>}
      {path === '/team' && <Overview state={state} />}
      {path === '/team/resources' && <TransactionResources state={state} setState={setState} />}
      {path === '/team/library' && <ResourceLibrary state={state} updateResource={updateResource} />}
      {path === '/team/editor' && <ResourceEditor resource={selected} state={state} updateResource={updateResource} />}
      {!['/team','/team/resources','/team/library','/team/editor'].includes(path) && <Heading title="This team view isn’t available" description="Choose a screen from the sandbox index." actions={<Button component="a" href="/">Back to index</Button>} />}
    </Box></Box>
  </Box>
}

function Overview({ state }: { state: TeamState }) {
  const visible = state.resources.filter(resource => state.visible.includes(resource.id) && resource.published)
  return <><Heading title="Client experience" description="Check what Tim and Alex see, and choose the guidance that’s right for their sale." actions={<Button component="a" href="/team/preview" target="_blank" rel="noopener noreferrer" variant="contained" startIcon={<VisibilityOutlined />}>Preview client portal</Button>} /><Box className="team-split"><Box><img className="team-hero-photo" src={transaction.listing.photoUrl ?? undefined} alt="The Bennett home in its wooded setting" /><Box className="team-facts"><Box><Typography variant="labelM" color="text.secondary">Clients</Typography><Typography variant="titleXS">Tim & Alex Bennett</Typography></Box><Box><Typography variant="labelM" color="text.secondary">Stage</Typography><Typography variant="titleXS">Under contract</Typography></Box><Box><Typography variant="labelM" color="text.secondary">Guidance shared</Typography><Typography variant="titleXS">{visible.length} resources</Typography></Box></Box><Box className="team-panel"><Box className="team-panel-heading"><Typography component="h2" variant="titleS">Resources for this transaction</Typography><Button component="a" href="/team/resources" endIcon={<ArrowForwardOutlined />}>Manage</Button></Box><Typography variant="bodyMStandard" color="text.secondary" sx={{ mb: 2 }}>A mix of Brivity’s transaction basics and your team’s own guidance.</Typography>{visible.slice(0,3).map(resource => <Box className="team-row" key={resource.id}><Box className="team-row-icon"><MenuBookOutlined fontSize="small" /><Box className="team-row-copy"><Typography variant="titleXS">{resource.published?.title}</Typography><Typography variant="bodySStandard" color="text.secondary">{resource.source === 'Team' ? 'Ben Kinney Team' : 'Provided by Brivity'}</Typography></Box></Box><Typography variant="labelS">Visible</Typography></Box>)}</Box></Box><Stack spacing={3}><Box className="team-panel"><Typography component="h2" variant="titleS" sx={{ mb: 3 }}>Client access</Typography><ClientAccess /></Box><Box className="team-panel team-panel-white"><Typography component="h2" variant="titleS" sx={{ mb: 1.5 }}>One place for transaction work</Typography><Typography variant="bodyMStandard" color="text.secondary">Dates, milestones, people, and internal tasks come from Brivity. Make changes there, then check the client view here.</Typography></Box></Stack></Box></>
}

function TransactionResources({ state, setState }: { state: TeamState; setState: (state: TeamState) => void }) {
  const [guide, setGuide] = useState<ResourceContent | null>(null)
  const [defaultOpen, setDefaultOpen] = useState(false)
  const [kind, setKind] = useState<'buyer' | 'seller'>('seller')
  const [defaultSaved, setDefaultSaved] = useState(false)
  const available = state.resources.filter(resource => resource.published && (!resource.archived || state.visible.includes(resource.id)))
  const defaultResources = available.filter(resource => !resource.archived && state.visible.includes(resource.id))
  const visibleCount = state.visible.filter(id => state.resources.some(resource => resource.id === id && resource.published)).length
  function toggle(resource: TeamResource) {
    const showing = state.visible.includes(resource.id)
    setState({ ...state, visible: showing ? state.visible.filter(id => id !== resource.id) : [...state.visible, resource.id], resources: !showing && resource.source === 'Team' && resource.linked === 0 ? state.resources.map(item => item.id === resource.id ? { ...item, linked: 1 } : item) : state.resources })
    toast.success(`${showing ? 'Hidden from' : 'Visible in'} this client portal`)
  }
  return <><Heading title="Transaction resources" description="Visibility changes apply immediately to Tim and Alex’s portal. The materials themselves stay in your team library." actions={<Button component="a" href="/team/preview" target="_blank" rel="noopener noreferrer" startIcon={<VisibilityOutlined />}>Preview client portal</Button>} /><Box className="team-split"><Box>{(['Brivity','Team'] as const).map(source => <Box key={source} sx={{ mb: 5 }}><Box className="team-panel-heading"><Box><Typography component="h2" variant="titleS">{source === 'Brivity' ? 'Transaction basics' : 'From your team'}</Typography><Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 1 }}>{source === 'Brivity' ? 'Guides provided and maintained by Brivity.' : 'Published materials from the Ben Kinney Team library.'}</Typography></Box>{source === 'Team' && <Button component="a" href="/team/library">Open library</Button>}</Box><Box component="ul" className="team-resource-list">{available.filter(resource => resource.source === source).map(resource => <Box component="li" className="team-row" key={resource.id}><Box className="team-row-copy"><Typography variant="titleXS">{resource.published?.title}</Typography><Typography variant="bodySStandard" color="text.secondary">{resource.published?.summary}</Typography><Typography variant="labelS">{state.visible.includes(resource.id) ? 'Visible to clients' : 'Hidden from clients'}</Typography></Box><Box className="team-row-actions"><IconButton aria-label={`Preview ${resource.published?.title}`} onClick={() => setGuide(resource.published)}><VisibilityOutlined fontSize="small" /></IconButton><Switch checked={state.visible.includes(resource.id)} onChange={() => toggle(resource)} slotProps={{ input: { 'aria-label': `Show ${resource.published?.title} to clients` } }} color="primary" /></Box></Box>)}</Box></Box>)}</Box><Stack spacing={3}><Box className="team-panel"><Typography variant="metricM">{visibleCount}</Typography><Typography component="h2" variant="titleXS" sx={{ mt: 1, mb: 2 }}>resources visible to clients</Typography><Typography variant="bodySStandard" color="text.secondary">Only published materials can appear in the client portal. Your library’s drafts stay with the team.</Typography></Box><Box className="team-panel team-panel-white"><Typography component="h2" variant="titleS" sx={{ mb: 1.5 }}>A starting point for next time</Typography><Typography variant="bodyMStandard" color="text.secondary">Save this selection for new transactions. Your team can still adjust each one.</Typography><Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => { setDefaultSaved(false); setDefaultOpen(true) }} disabled={state.role !== 'admin'}>Use as default</Button>{state.role !== 'admin' && <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>Only admins can save team defaults.</Typography>}{state.defaults.seller && <Typography variant="bodySStandard" sx={{ mt: 2 }}>Seller default saved · {state.defaults.seller.length} resources</Typography>}{state.defaults.buyer && <Typography variant="bodySStandard" sx={{ mt: 2 }}>Buyer default saved · {state.defaults.buyer.length} resources</Typography>}</Box></Stack></Box><PlaceModal open={defaultOpen} onClose={() => setDefaultOpen(false)} title={defaultSaved ? 'Your starting point is saved' : 'Use this selection as the team default?'} description="Applies to new transactions only. Existing transactions keep their current choices." actions={<><Button onClick={() => setDefaultOpen(false)}>{defaultSaved ? 'Done' : 'Cancel'}</Button>{!defaultSaved && <Button variant="contained" onClick={() => { if (state.role !== 'admin') return; setState({ ...state, defaults: { ...state.defaults, [kind]: defaultResources.map(resource => resource.id) } }); setDefaultSaved(true); toast.success(`Team ${kind} default saved`) }}>Save {kind} default</Button>}</>}><Stack spacing={3}>{defaultSaved ? <Note>New {kind} transactions will start with this selection. Tim and Alex’s choices stay as they are.</Note> : <><Box sx={{ pt: 2 }}><FormControl fullWidth><InputLabel id="default-kind">Apply to</InputLabel><Select labelId="default-kind" label="Apply to" value={kind} onChange={event => setKind(event.target.value as 'buyer' | 'seller')}><MenuItem value="seller">New seller transactions</MenuItem><MenuItem value="buyer">New buyer transactions</MenuItem></Select></FormControl></Box><Typography variant="bodyMStandard">{defaultResources.length} visible resources will be included. Other current resources will start hidden.</Typography><Box component="ul" sx={{ m: 0, pl: 3 }}>{defaultResources.map(resource => <Typography component="li" variant="bodySStandard" key={resource.id} sx={{ mb: 1 }}>{resource.published?.title}</Typography>)}</Box><Note>This replaces your team’s saved {kind} selection.</Note></>}</Stack></PlaceModal><PlaceModal open={!!guide} onClose={() => setGuide(null)} title="Resource preview" size="l">{guide && <ResourceBody content={guide} />}</PlaceModal></>
}

function ResourceLibrary({ state, updateResource }: { state: TeamState; updateResource: (resource: TeamResource) => void }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All resources')
  const [archive, setArchive] = useState<TeamResource | null>(null)
  const [guide, setGuide] = useState<ResourceContent | null>(null)
  const resources = state.resources.filter(resource => resource.source === 'Team' && titleOf(resource).toLowerCase().includes(search.toLowerCase()) && (filter === 'Archived' ? resource.archived : !resource.archived && (filter === 'All resources' || filter === 'Published' && !!resource.published || filter === 'Drafts' && !!resource.draft)))
  return <><Heading title="Team resource library" description="Create materials once. Share them across your transactions, and keep the guidance current for every client." actions={<Button component="a" href="/team/editor?id=new" variant="contained" startIcon={<AddOutlined />}>Create resource</Button>} /><Note>Only admins can publish or archive. Drafts and unpublished changes stay private to your team.</Note><Box className="team-library-toolbar"><TextField size="small" label="Search team resources" value={search} onChange={event => setSearch(event.target.value)} sx={{ width: { xs: '100%', sm: 320 } }} /><FormControl size="small" sx={{ minWidth: 180 }}><InputLabel id="library-status-label">Show</InputLabel><Select labelId="library-status-label" label="Show" value={filter} onChange={event => setFilter(event.target.value)}>{['All resources','Published','Drafts','Archived'].map(value => <MenuItem value={value} key={value}>{value}</MenuItem>)}</Select></FormControl></Box><Box className="team-library-table header"><Typography variant="labelM">Resource</Typography><Typography variant="labelM">Status</Typography><Typography variant="labelM" className="team-library-linked">Linked</Typography><Typography variant="labelM">Actions</Typography></Box>{resources.map(resource => <Box className="team-library-table" key={resource.id}><Box className="team-library-title"><Typography variant="titleXS"><a href={`/team/editor?id=${resource.id}`}>{titleOf(resource)}</a></Typography><Typography variant="bodySStandard" color="text.secondary">{(resource.draft ?? resource.published)?.summary}</Typography></Box><Box className="team-library-status"><Chip label={statusOf(resource)} size="small" variant="outlined" /></Box><Typography variant="bodySStandard" className="team-library-linked">{resource.linked + (state.visible.includes(resource.id) && resource.linked === 0 ? 1 : 0)} transactions</Typography><Stack direction="row" className="team-library-action"><IconButton aria-label={`Preview ${titleOf(resource)}`} onClick={() => setGuide(resource.draft ?? resource.published)}><VisibilityOutlined fontSize="small" /></IconButton>{!resource.archived && <IconButton aria-label={`Archive ${titleOf(resource)}`} disabled={state.role !== 'admin'} onClick={() => setArchive(resource)}><ArchiveOutlined fontSize="small" /></IconButton>}</Stack></Box>)}{resources.length === 0 && <Typography variant="bodyMStandard" sx={{ py: 5 }}>No resources match this view.</Typography>}<Box className="team-section team-panel"><Typography component="h2" variant="titleS" sx={{ mb: 1.5 }}>Looking for the transaction basics?</Typography><Typography variant="bodyMStandard" color="text.secondary">Brivity’s built-in guides are available in each transaction. Choose which ones your clients see there.</Typography><Button component="a" href="/team/resources" endIcon={<ArrowForwardOutlined />} sx={{ mt: 2 }}>Go to transaction resources</Button></Box><PlaceModal open={!!archive} onClose={() => setArchive(null)} title="Archive this resource?" description="It will no longer be available to select for new transactions." actions={<><Button onClick={() => setArchive(null)}>Cancel</Button><Button variant="contained" onClick={() => { if (!archive || state.role !== 'admin') return; updateResource({ ...archive, archived: true }); setArchive(null); toast.success('Resource archived') }}>Archive resource</Button></>}><Typography variant="bodyMStandard" sx={{ mb: 2 }}>{archive && titleOf(archive)}</Typography><Note>Existing linked transactions keep their published resource.</Note></PlaceModal><PlaceModal open={!!guide} onClose={() => setGuide(null)} title="Team resource preview" description="Shows the latest saved draft when one exists. Clients continue seeing the published version." size="l">{guide && <ResourceBody content={guide} />}</PlaceModal></>
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
  useEffect(() => { if (editor.current) editor.current.innerHTML = original?.html ?? '<p>Start writing your guide here.</p>' }, [original?.html])
  function format(command: string, value?: string) { editor.current?.focus(); document.execCommand(command, false, value); setHtml(editor.current?.innerHTML ?? '') }
  function save() {
    if (!title.trim() || !editor.current?.textContent?.trim()) { toast.error('Add a title and some content before saving.'); return }
    updateResource({ id, source: 'Team', archived: false, linked: resource?.linked ?? 0, published: resource?.published ?? null, draft: { title: title.trim(), summary: summary.trim(), html: cleanResourceHtml(html) } })
    window.history.replaceState(null, '', `/team/editor?id=${id}`)
    toast.success('Draft saved. No changes are visible to clients.')
  }
  function publish() {
    if (state.role !== 'admin' || archived || !title.trim()) return
    const content = { title: title.trim(), summary: summary.trim(), html: cleanResourceHtml(html) }
    updateResource({ id, source: 'Team', archived: false, linked: resource?.linked ?? 0, published: content, draft: null })
    window.history.replaceState(null, '', `/team/editor?id=${id}`)
    setPublishOpen(false)
    toast.success('Resource published. Every linked transaction has the updated version.')
  }
  return <><Heading title={resource ? 'Edit resource' : 'Create resource'} description={resource?.published ? 'Edit the next version. The current published guide stays visible until an admin publishes your changes.' : 'Write a useful guide, then save a draft for your team to review.'} actions={<><Button onClick={() => setPreview(true)} startIcon={<VisibilityOutlined />}>Preview</Button>{!archived && <Button onClick={() => save()} variant="outlined">Save draft</Button>}{state.role === 'admin' && !archived && <Button onClick={() => { if (!title.trim() || !editor.current?.textContent?.trim()) { toast.error('Add a title and some content before publishing.'); return }; setPublishOpen(true) }} variant="contained">Publish</Button>}</>} /><Box className="team-split"><Box><Box className="team-editor-fields"><TextField label="Resource title" value={title} onChange={event => setTitle(event.target.value)} fullWidth disabled={archived} /><TextField label="Short description" value={summary} onChange={event => setSummary(event.target.value)} fullWidth multiline minRows={2} disabled={archived} /></Box><Typography variant="labelM" component="label" htmlFor="resource-content" sx={{ display: 'block', mb: 1 }}>Guide content</Typography><Box className="team-editor-toolbar" role="toolbar" aria-label="Text formatting"><Button disabled={archived} onMouseDown={event => event.preventDefault()} onClick={() => format('formatBlock','h2')}>Heading</Button><Button disabled={archived} onMouseDown={event => event.preventDefault()} onClick={() => format('formatBlock','p')}>Paragraph</Button><IconButton disabled={archived} aria-label="Bold" onMouseDown={event => event.preventDefault()} onClick={() => format('bold')}><FormatBoldOutlined /></IconButton><IconButton disabled={archived} aria-label="Italic" onMouseDown={event => event.preventDefault()} onClick={() => format('italic')}><FormatItalicOutlined /></IconButton><IconButton disabled={archived} aria-label="Bulleted list" onMouseDown={event => event.preventDefault()} onClick={() => format('insertUnorderedList')}><FormatListBulletedOutlined /></IconButton><IconButton disabled={archived} aria-label="Add link" onMouseDown={event => event.preventDefault()} onClick={() => { const current = window.getSelection(); selection.current = current?.rangeCount ? current.getRangeAt(0).cloneRange() : null; setUrl(''); setLinkOpen(true) }}><LinkOutlined /></IconButton></Box><Typography component="div" variant="bodyMStandard" id="resource-content" ref={editor} contentEditable={!archived} suppressContentEditableWarning role="textbox" aria-label="Guide content" aria-multiline="true" className="team-rich-editor" onInput={() => setHtml(editor.current?.innerHTML ?? '')} /></Box><Stack spacing={3}><Box className="team-panel"><Typography component="h2" variant="titleS" sx={{ mb: 2 }}>{archived ? 'Archived resource' : 'Shared by your team'}</Typography><Typography variant="bodyMStandard" color="text.secondary">This resource lives in the Ben Kinney Team library. Once published, it can be selected for any transaction.</Typography><Box sx={{ mt: 3 }}><Chip label={resource ? statusOf(resource) : 'New draft'} variant="outlined" size="small" /></Box></Box><Box className="team-panel team-panel-white"><Typography component="h2" variant="titleS" sx={{ mb: 1.5 }}>{state.role === 'admin' ? 'Publish with care' : 'An admin publishes the final version'}</Typography><Typography variant="bodyMStandard" color="text.secondary">Publishing updates every transaction linked to this resource. Saving a draft does not change what clients see.</Typography></Box></Stack></Box><PlaceModal open={preview} onClose={() => setPreview(false)} title="Draft preview" description="This version has not been published to clients." size="l"><ResourceBody content={{ title: title || 'Untitled resource', summary, html }} /></PlaceModal><PlaceModal open={publishOpen} onClose={() => setPublishOpen(false)} title={resource?.linked ? `Publish changes to ${resource.linked} transactions?` : 'Publish this resource?'} description="Review the version your clients will see before publishing." size="l" actions={<><Button onClick={() => setPublishOpen(false)}>Keep editing</Button><Button variant="contained" onClick={publish}>Publish now</Button></>}><Stack spacing={3}><Note>{resource?.linked ? `This replaces the published version in all ${resource.linked} linked transactions. Hidden resources remain hidden.` : 'Your team can select this resource for client portals once it is published.'}</Note><ResourceBody content={{ title, summary, html }} /></Stack></PlaceModal><PlaceModal open={linkOpen} onClose={() => setLinkOpen(false)} title="Add a link" actions={<><Button onClick={() => setLinkOpen(false)}>Cancel</Button><Button variant="contained" disabled={!/^(https?:\/\/|mailto:)/i.test(url)} onClick={() => { setLinkOpen(false); requestAnimationFrame(() => { editor.current?.focus(); const current = window.getSelection(); if (selection.current && current) { current.removeAllRanges(); current.addRange(selection.current) }; format('createLink',url) }) }}>Add link</Button></>}><TextField autoFocus fullWidth label="Link address" placeholder="https://" value={url} onChange={event => setUrl(event.target.value)} helperText="Select the words you want to link before opening this dialog." /></PlaceModal></>
}

export function TeamResourceSwitchSample() {
  const [checked, setChecked] = useState(true)
  return <Box className="team-app" sx={{ width: '100%' }}><Box className="team-row"><Box className="team-row-copy"><Typography variant="titleXS">Getting ready for closing day</Typography><Typography variant="bodySStandard" color="text.secondary">Provided by Brivity</Typography><Typography variant="labelS">{checked ? 'Visible to clients' : 'Hidden from clients'}</Typography></Box><Switch checked={checked} onChange={(_, value) => setChecked(value)} slotProps={{ input: { 'aria-label': 'Show closing guide to clients' } }} /></Box></Box>
}

