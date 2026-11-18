/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety3 SlopFree5 */
import { toast } from 'sonner'
import { useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Collapse,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import type { ReactNode } from 'react'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'
import EditOutlined from '@mui/icons-material/EditOutlined'
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined'
import DeleteOutlineOutlined from '@mui/icons-material/DeleteOutlineOutlined'
import { PlaceSheet } from '../../components/PlaceSheet'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import PushPin from '@mui/icons-material/PushPin'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import { Eyebrow } from '../../components/Eyebrow'
import { DisclosureButton } from '../../components/DisclosureButton'
import { PlaceCard } from '../../components/PlaceCard'
import { PlaceTag } from '../../components/PlaceTag'
import { FilterPills } from '../../components/FilterPills'
import { SectionLabel } from '../../components/SectionLabel'
import { TextLink } from '../../components/TextLink'
import { FactList } from '../../components/FactList'
import { HeadlineStat, Stat } from '../../components/Stat'
import { PlaceModal, placeModalWidths, type PlaceModalSize } from '../../components/PlaceModal'
import { SegmentedSwitch, type SegmentedSwitchOption } from '../../components/SegmentedSwitch'
import { typographyTokens } from '../../design-tokens'
import { breakpoints } from '../../system-tokens'
import { PortalSectionHeader } from '../../components/PortalSection'
import { PortalIconBadge } from '../../components/PortalIconBadge'
import { AgentIdentity } from '../../components/AgentIdentity'
import { PartnerBrandLockup } from '../../components/PartnerBrandLockup'
import CalendarTodayOutlined from '@mui/icons-material/CalendarTodayOutlined'
import { ListingDetailsSheet } from '../../seller-portal/ListingDetailsSheet'
import { sampleSellerTransaction } from '../../seller-portal/sellerTransaction'
import { EmailPreview } from '../../email-templates/EmailPreview'
import { emailTemplates } from '../../email-templates/emailTemplates'

const sections = [
  { id: 'typography', name: 'Typography' },
  { id: 'colors', name: 'Colors' },
  { id: 'radius', name: 'Corner radius' },
  { id: 'elevation', name: 'Elevation' },
  { id: 'spacing', name: 'Spacing' },
  { id: 'focus-motion', name: 'Focus and motion' },
  { id: 'breakpoints', name: 'Breakpoints' },
  { id: 'button', name: 'Button' },
  { id: 'icon-button', name: 'Icon button' },
  { id: 'chip', name: 'Chip' },
  { id: 'segmented-switch', name: 'Segmented switch' },
  { id: 'tabs', name: 'Tabs' },
  { id: 'card', name: 'Card' },
  { id: 'card-header', name: 'Card header' },
  { id: 'paper', name: 'Paper' },
  { id: 'modal', name: 'Modal' },
  { id: 'sheet', name: 'Sheet' },
  { id: 'toast', name: 'Toast' },
  { id: 'menu', name: 'Menu' },
  { id: 'form-controls', name: 'Form controls' },
  { id: 'eyebrow', name: 'Eyebrow' },
  { id: 'section-label', name: 'Section label' },
  { id: 'text-link', name: 'Text link' },
  { id: 'disclosure', name: 'Disclosure button' },
  { id: 'tag', name: 'Tag' },
  { id: 'filter-pills', name: 'Filter pills' },
  { id: 'stat', name: 'Stat' },
  { id: 'fact-list', name: 'Fact list' },
  { id: 'icon-badge', name: 'Icon badge' },
  { id: 'agent-identity', name: 'Agent identity' },
  { id: 'brand-lockup', name: 'Brand lockup' },
  { id: 'listing-sheet', name: 'Listing sheet' },
  { id: 'email-blocks', name: 'Email blocks' },
] as const

const modalSizes = Object.keys(placeModalWidths) as PlaceModalSize[]

const typographyGroups: { name: string; variants: (keyof typeof typographyTokens)[]; sample: string }[] = [
  { name: 'Display', variants: ['displayL', 'displayM', 'displayS'], sample: 'A place to call home' },
  { name: 'Title', variants: ['titleL', 'titleM', 'titleS', 'titleXS'], sample: 'Your next chapter' },
  {
    name: 'Body',
    variants: ['bodyLStandard', 'bodyMStandard', 'bodySStandard', 'bodyMCompact', 'bodySCompact'],
    sample: 'Everything you need to know, clearly in one place.',
  },
  { name: 'Label', variants: ['labelM', 'labelS', 'labelXS'], sample: 'Next step' },
  { name: 'Metric', variants: ['metricL', 'metricM', 'metricS'], sample: '$825,000' },
]

const semanticColorGroups = [
  {
    name: 'Text',
    tokens: [
      'text-lightest', 'text-light', 'text-disabled', 'text-primary', 'text-dark',
      'text-on-color-primary', 'text-on-color-light', 'text-caution', 'text-error', 'text-success',
    ],
  },
  {
    name: 'Surface',
    tokens: [
      'surface-glass', 'surface-primary', 'surface-primary-disabled', 'surface-primary-dark',
      'surface-primary-darkest', 'surface-secondary', 'surface-secondary-disabled',
      'surface-secondary-dark', 'surface-secondary-darkest', 'surface-reverse-primary',
      'surface-reverse-secondary',
    ],
  },
  {
    name: 'Stroke',
    tokens: [
      'stroke-primary-light', 'stroke-primary-lightest', 'stroke-primary',
      'stroke-primary-dark', 'stroke-primary-darkest',
    ],
  },
] as const

const primitiveColorFamilies = ['neutral', 'gray', 'blue', 'sky', 'green', 'yellow', 'red', 'violet'] as const
const primitiveColorSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const
const neutralColorSteps = [...primitiveColorSteps, '950'] as const
const baseColorTokens = ['base-black', 'base-white'] as const

function Section({
  id,
  title,
  description,
  source,
  kind = 'Component',
  children,
}: {
  id: string
  title: string
  description: string
  source: string
  kind?: 'Foundation' | 'Component'
  children: ReactNode
}) {
  // Numbers follow the nav order, so adding a section never means renumbering by hand.
  const number = String(sections.findIndex((section) => section.id === id) + 1).padStart(2, '0')
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-title`} sx={{ scrollMarginTop: 32, py: { xs: 5, md: 7 }, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {number} / {kind}
        </Typography>
        <Typography component="h2" id={`${id}-title`} variant="titleL" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="bodyMStandard" color="text.secondary" sx={{ maxWidth: 680, textWrap: 'pretty' }}>
          {description}
        </Typography>
        <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          {source}
        </Typography>
      </Box>
      {children}
    </Box>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr)' }, alignItems: 'center', gap: { xs: 1.5, sm: 3 }, minWidth: 0 }}>
      <Typography variant="labelM" color="text.secondary">{label}</Typography>
      <Box sx={{ width: '100%', minWidth: 0, minHeight: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 2.5, bgcolor: 'var(--color-semantic-surface-secondary)', borderRadius: 2 }}>
        {children}
      </Box>
    </Box>
  )
}

function SpecimenList({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {children}
    </Box>
  )
}

const buttonVariants: Array<{ label: string; variant: ButtonProps['variant']; onImage?: boolean }> = [
  { label: 'Primary / contained', variant: 'contained' },
  { label: 'Secondary / outlined', variant: 'outlined' },
  { label: 'Quiet / text', variant: 'text' },
  { label: 'On Image Primary', variant: 'onImagePrimary', onImage: true },
  { label: 'On Image Secondary', variant: 'onImageSecondary', onImage: true },
]

function ButtonSection() {
  const [clicks, setClicks] = useState(0)
  const tryAction = () => setClicks(value => value + 1)

  return (
    <Section id="button" title="Button"
      description="Five shared variants use the PLACE pill radius, typography, padding, and 44px minimum height. Photo actions use the same variants here and in the listing header."
      source="Theme: MuiButton · src/theme.ts · src/mui.d.ts">
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Variants and states</Typography>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mb: 3 }}>
        Each row shows an enabled, disabled, and loading button. Hover, press, or use Tab to inspect the actual interaction styles on enabled samples. These are live components, without simulated state overrides. Pressing scales a button down to 98% and fills it with a light gray ripple (a step darker than hover, never heavy). The same press feel applies to icon buttons, tabs, and menu items.
      </Typography>
      <SpecimenList>
        {buttonVariants.map(({ label, variant, onImage }) => (
          <Specimen key={label} label={label}>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap', p: 2, borderRadius: 2,
              ...(onImage ? { backgroundImage: `linear-gradient(rgb(0 0 0 / 32%), rgb(0 0 0 / 32%)), url("${sampleSellerTransaction.listing.photoUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 160 } : {}) }}>
              <Button variant={variant} onClick={tryAction}>{variant === 'onImageSecondary' ? 'Copy link' : onImage ? 'See Listing' : 'Continue'}</Button>
              <Button variant={variant} disabled>Disabled</Button>
              <Button variant={variant} loading>Loading</Button>
            </Box>
          </Specimen>
        ))}
        <Specimen label="Photo action pairing">
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', width: '100%', p: 3, borderRadius: 2, backgroundImage: `linear-gradient(rgb(0 0 0 / 32%), rgb(0 0 0 / 32%)), url("${sampleSellerTransaction.listing.photoUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Button variant="onImageSecondary" endIcon={<ContentCopyOutlined aria-hidden="true" />} onClick={tryAction}>Copy link</Button>
            <Button variant="onImagePrimary" endIcon={<ArrowOutwardOutlined />} onClick={tryAction}>See Listing</Button>
          </Box>
        </Specimen>
        <Specimen label="Listing outlined / contextual treatment">
          <Button variant="outlined" className="listing-copy-link" onClick={tryAction}>Copy link</Button>
        </Specimen>
        <Specimen label="Sizes / small, medium, large">
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {([{ size: 'small', height: '36 (44 touch)' }, { size: 'medium', height: 48 }, { size: 'large', height: 56 }] as const).map(({ size, height }) => (
              <Stack key={size} spacing={1} sx={{ alignItems: 'center' }}>
                <Button size={size} variant="outlined" onClick={tryAction}>Continue</Button>
                <Typography variant="labelS" color="text.secondary">{size} · {height}px</Typography>
              </Stack>
            ))}
          </Stack>
        </Specimen>
        <Specimen label="Leading and trailing icons">
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<DescriptionOutlined />} onClick={tryAction}>Documents</Button>
            <Button variant="contained" endIcon={<ArrowOutwardOutlined />} onClick={tryAction}>See Listing</Button>
          </Stack>
        </Specimen>
      </SpecimenList>
      <Typography aria-live="polite" variant="labelS" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        {clicks > 0 ? `Sample action used ${clicks} ${clicks === 1 ? 'time' : 'times'}.` : 'Select an enabled button to try it.'}
      </Typography>
    </Section>
  )
}

function ChipSection() {
  const [selected, setSelected] = useState(false)
  return (
    <Section id="chip" title="Chip"
      description="Chips are MUI's interactive pills (filters, removable selections). For a static label on a row, card, or photo, use PlaceTag in Shared components."
      source="Theme: MuiChip">
      <SpecimenList>
        <Specimen label="Filled / medium"><Chip label="In progress" /></Specimen>
        <Specimen label="Outlined / medium"><Chip label="In progress" variant="outlined" /></Specimen>
        <Specimen label="Small / filled and outlined"><Stack direction="row" spacing={1}><Chip label="In progress" size="small" /><Chip label="In progress" size="small" variant="outlined" /></Stack></Specimen>
        <Specimen label="Clickable / live interaction">
          <Chip label={selected ? 'Selected' : 'Filter'} variant="outlined" clickable aria-pressed={selected} onClick={() => setSelected(value => !value)} />
        </Specimen>
        <Specimen label="Disabled / filled and outlined"><Stack direction="row" spacing={1}><Chip label="Filter" disabled /><Chip label="Filter" variant="outlined" disabled /></Stack></Specimen>
      </SpecimenList>
    </Section>
  )
}

/* Tabs sit on white in the product, so the specimens use a white tile; the gray specimen fill would hide the hover. */
function TabStrip({ children }: { children: ReactNode }) {
  return <Box sx={{ width: '100%', px: 'var(--space-24)', borderRadius: 'var(--radius-s)', bgcolor: 'var(--color-semantic-surface-primary)' }}>{children}</Box>
}

function TabsSection() {
  const [tab, setTab] = useState('timeline')
  const tabs = [['timeline', 'Timeline'], ['documents', 'Documents'], ['notes', 'Notes'], ['people', 'People']] as const
  return (
    <Section id="tabs" title="Tabs"
      description="Switches between sections of one page. Every tab bar uses the theme style: labelM labels, text-primary at rest and text-dark when selected or hovered, a 2px text-dark indicator under the selected label. Each tab has 12px of padding so the hover fill (surface-secondary, radius xs, 44px tall, ending 2px above the indicator) has room around the label; the bar pulls out by the same 12px, so labels line up with the content edge. A hairline under the bar is inset by that bleed. No ripple: pressing darkens the fill instead."
      source="MuiTabs, MuiTab · src/theme.ts">
      <SpecimenList>
        <Specimen label="Default / interactive">
          <TabStrip>
            <Tabs value={tab} onChange={(_, value: string) => setTab(value)} variant="scrollable" scrollButtons={false} aria-label="Gallery tabs">
              {tabs.map(([value, label]) => <Tab key={value} value={value} label={label} />)}
            </Tabs>
          </TabStrip>
        </Specimen>
        <Specimen label="Hover / Pressed / Focus (forced)">
          <TabStrip>
            <Tabs value="timeline" aria-label="Gallery tab states">
              <Tab value="timeline" label="Selected" />
              <Tab value="hover" label="Hover" sx={{ color: 'text.primary', '&::before': { bgcolor: 'var(--color-semantic-surface-secondary)' } }} />
              <Tab value="pressed" label="Pressed" sx={{ color: 'text.primary', '&::before': { bgcolor: 'var(--color-semantic-surface-secondary-dark)' } }} />
              <Tab value="focus" label="Focus" sx={{ outline: 'var(--focus-ring)', outlineOffset: -2, borderRadius: 'var(--radius-xs)' }} />
            </Tabs>
          </TabStrip>
        </Specimen>
      </SpecimenList>
    </Section>
  )
}

function SegmentedSwitchSection() {
  const [audience, setAudience] = useState<'seller' | 'buyer'>('seller')
  const audienceOptions: readonly SegmentedSwitchOption<'seller' | 'buyer'>[] = [
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
  ]
  const viewOptions: readonly SegmentedSwitchOption<'list' | 'map'>[] = [
    { value: 'list', label: 'List' },
    { value: 'map', label: 'Map' },
  ]

  return (
    <Section
      id="segmented-switch"
      title="Segmented switch"
      description="A compact control for moving between a few parallel views within the same page."
      source="SegmentedSwitch · src/components/SegmentedSwitch.tsx"
    >
      <SpecimenList>
        <Specimen label="Default / M">
          <SegmentedSwitch options={audienceOptions} value={audience} onChange={setAudience} aria-label="Client view" />
        </Specimen>
        <Specimen label="Compact / S">
          <SegmentedSwitch options={viewOptions} defaultValue="list" size="s" aria-label="Search view" />
        </Specimen>
        <Specimen label="One option disabled">
          <SegmentedSwitch options={[{ value: 'list', label: 'List' }, { value: 'map', label: 'Map', disabled: true }]} defaultValue="list" aria-label="Search view with unavailable map" />
        </Specimen>
        <Specimen label="Disabled">
          <SegmentedSwitch options={audienceOptions} defaultValue="seller" disabled aria-label="Unavailable client view" />
        </Specimen>
      </SpecimenList>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Use for two or three related views, not page navigation. The selected option is pressed; inactive options gain a quiet hover fill and every option has a visible keyboard focus state.
      </Typography>
    </Section>
  )
}

function IconButtonSection() {
  const states = ['Default', 'Hover', 'Focus', 'Pinned', 'Disabled'] as const

  return (
    <Section
      id="icon-button"
      title="Icon button"
      description="Quiet icon buttons keep secondary actions available without competing with primary actions."
      source="PlaceIconButton · shared PLACE icon control"
    >
      <SpecimenList>
        {states.map((label) => (
          <Specimen key={label} label={label}>
            <PlaceIconButton
              aria-label={label === 'Pinned' ? 'Unpin document' : 'Call agent'}
              title={label === 'Pinned' ? 'Unpin document' : 'Call agent'}
              data-state={label.toLowerCase()}
              aria-pressed={label === 'Pinned' ? true : undefined}
              disabled={label === 'Disabled'}
            >
              {label === 'Pinned' ? <PushPin fontSize="small" /> : <PhoneOutlined fontSize="small" />}
            </PlaceIconButton>
          </Specimen>
        ))}
      </SpecimenList>
    </Section>
  )
}

function PaperSection() {
  return (
    <Section
      id="paper"
      title="Paper"
      description="Raw MUI Paper, for surfaces that are not cards (overlays build on it). For any card, use PlaceCard above. The outlined variant uses the system hairline."
      source="Theme: MuiPaper · src/theme.ts"
    >
      <SpecimenList>
        <Specimen label="Default / flat">
          <Paper elevation={0} sx={{ width: '100%', p: 4 }}>
            <Typography variant="titleXS" sx={{ display: 'block' }}>Transaction summary</Typography>
            <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mt: 1 }}>A calm surface for related information.</Typography>
          </Paper>
        </Specimen>
        <Specimen label="Outlined">
          <Paper variant="outlined" sx={{ width: '100%', p: 4 }}>
            <Typography variant="titleXS" sx={{ display: 'block' }}>Transaction summary</Typography>
            <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mt: 1 }}>A hairline marks the surface boundary.</Typography>
          </Paper>
        </Specimen>
      </SpecimenList>
      <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Paper is a container; hover, pressed, and disabled states are not part of its theme skin.
      </Typography>
    </Section>
  )
}

function ModalSection() {
  const [minimal, setMinimal] = useState(false)
  const [activeSize, setActiveSize] = useState<PlaceModalSize | null>(null)

  return (
    <Section
      id="modal"
      title="Modal"
      description="A focused overlay built on MUI Dialog, with five predictable widths and one consistent PLACE surface."
      source="PlaceModal · src/components/PlaceModal.tsx"
    >
      <SpecimenList>
        {modalSizes.map(size => (
          <Specimen key={size} label={`${size.toUpperCase()} / ${placeModalWidths[size]}px`}>
            <Button variant="outlined" onClick={() => { setMinimal(false); setActiveSize(size) }}>Open modal</Button>
          </Specimen>
        ))}
        <Specimen label="Content only / no description or footer actions">
          <Button variant="outlined" onClick={() => { setMinimal(true); setActiveSize('s') }}>Open content-only modal</Button>
        </Specimen>
      </SpecimenList>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>All five sizes share the same header, close control, and surface. Description and footer actions are optional content slots. Use Escape, the backdrop, or the close button to dismiss the sample.</Typography>
      <PlaceModal
        open={activeSize !== null}
        onClose={() => setActiveSize(null)}
        size={activeSize ?? 'm'}
        title="Transaction update"
        description={minimal ? undefined : 'A focused place for details that need your attention.'}
        actions={minimal ? undefined : (
          <>
            <Button variant="text" onClick={() => setActiveSize(null)}>Cancel</Button>
            <Button variant="contained" onClick={() => setActiveSize(null)}>Done</Button>
          </>
        )}
      >
        <Typography variant="bodyMStandard" color="text.secondary">
          Your team has shared a new update. Review the details here, then return to your transaction when you’re ready.
        </Typography>
      </PlaceModal>
    </Section>
  )
}

function SheetSection() {
  const [open, setOpen] = useState(false)
  return (
    <Section id="sheet" title="Sheet" description="PlaceSheet is the shared bottom-sheet surface used by listing details, resource guides, the marketing dashboard, and transaction dates. It has one responsive width, rather than the five modal sizes. Narrow content, such as transaction dates, sits in a centered 720px reading column inside the sheet." source="PlaceSheet · src/components/PlaceSheet.tsx · src/components/place-sheet.css">
      <Specimen label="Default / responsive bottom sheet"><Button variant="outlined" onClick={() => setOpen(true)}>Open sheet</Button></Specimen>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>The sheet uses the shared rounded top corners, scrim, and scrolling surface. Escape, the backdrop, or the close control dismiss it and return focus to its trigger. Reduced motion removes the opening transition.</Typography>
      <PlaceSheet open={open} onClose={() => setOpen(false)} label="Sheet preview">
        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Typography component="h2" variant="titleS">Sheet preview</Typography>
            <PlaceIconButton aria-label="Close sheet preview" onClick={() => setOpen(false)}><CloseOutlined /></PlaceIconButton>
          </Stack>
          <Typography variant="bodyMStandard" sx={{ mt: 3 }}>Use this surface for detailed reading while keeping the transaction behind it. Listing and resource sheets add their own content to this shared component.</Typography>
        </Box>
      </PlaceSheet>
    </Section>
  )
}

function FormControlsSection() {
  const [name, setName] = useState('Deposit due')
  const [status, setStatus] = useState('Published')
  const [tags, setTags] = useState<string[]>(['Earnest money guide'])
  const [checked, setChecked] = useState(true)
  const [choice, setChoice] = useState('first-party')
  const [on, setOn] = useState(true)
  return (
    <Section
      id="form-controls"
      title="Form controls"
      description="Every text field, select, autocomplete, checkbox, radio, and switch takes its PLACE styling from the theme, so plain MUI components are already on brand. Labels sit above the field in labelM, never floating inside the border. Fields are 48px tall (44px with size small) with a 12px radius and a stroke-primary border; hover darkens the border, and focus switches it to text-dark with a soft 3px ring. Helper and error text sit 6px below in labelS. Input text stays 16px, so phones never zoom in."
      source="MuiTextField, MuiInputLabel, MuiOutlinedInput, MuiFormHelperText, MuiSelect, MuiAutocomplete, MuiCheckbox, MuiRadio, MuiSwitch · src/theme.ts · src/components/controlIcons.tsx"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3, maxWidth: 840 }}>
        <TextField label="Title" value={name} onChange={event => setName(event.target.value)} helperText="Shown under the date in the client’s list." fullWidth />
        <TextField label="Email" placeholder="name@example.com" required fullWidth />
        <TextField label="Date" type="date" defaultValue="2026-10-05" fullWidth />
        <TextField label="Contact details" value="tim@example.com" disabled helperText="Disabled: details come from Brivity." fullWidth />
        <TextField label="Email" value="tim@" error helperText="Enter a full email address." fullWidth />
        <TextField label="Search team resources" size="small" fullWidth />
        <FormControl fullWidth><InputLabel id="gallery-form-select">Show</InputLabel><Select labelId="gallery-form-select" label="Show" value={status} onChange={event => setStatus(event.target.value)}>{['All resources', 'Published', 'Drafts', 'Archived'].map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}</Select></FormControl>
        <Autocomplete multiple options={['Earnest money guide', 'Appraisal guide', 'Closing day guide']} value={tags} onChange={(_, value) => setTags(value)} renderInput={params => <TextField {...params} label="Attached resources" />} />
        <TextField label="Personal note" multiline minRows={3} placeholder="A few words for your client…" fullWidth sx={{ gridColumn: { md: '1 / -1' } }} />
      </Box>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 4, mb: 1 }}>Checkboxes and radios are 20px drawn marks: a 6px-radius square or a circle with a 1.5px stroke-primary-dark border, filled with the reverse surface when selected. They keep a 44px hit area, skip the ripple, and show a 2px ring on keyboard focus. The switch is a 44 × 24 pill with the thumb inside the track, dark when on.</Typography>
      <SpecimenList>
        <Specimen label="Checkbox"><FormControlLabel control={<Checkbox checked={checked} onChange={event => setChecked(event.target.checked)} />} label="Also show it to clients" /></Specimen>
        <Specimen label="Checkbox / disabled"><FormControlLabel control={<Checkbox disabled />} label="Unavailable" /><FormControlLabel control={<Checkbox disabled checked />} label="Locked on" /></Specimen>
        <Specimen label="Radio group"><RadioGroup value={choice} onChange={event => setChoice(event.target.value)}><FormControlLabel value="first-party" control={<Radio />} label="First Party" /><FormControlLabel value="idx" control={<Radio />} label="IDX MVP" /></RadioGroup></Specimen>
        <Specimen label="Switch"><Switch checked={on} onChange={event => setOn(event.target.checked)} slotProps={{ input: { 'aria-label': 'Visible to clients' } }} /><Switch disabled slotProps={{ input: { 'aria-label': 'Disabled switch' } }} /></Specimen>
      </SpecimenList>
    </Section>
  )
}

function MenuSection() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [status, setStatus] = useState('All resources')
  return (
    <Section id="menu" title="Menu" description="The PLACE menu styles every overflow (···) menu and Select dropdown: radius s surface, light stroke, elevation 2, labelM items with a radius xs hover fill. Destructive items add the is-destructive class and always open a confirmation dialog." source="MuiMenu, MuiMenuItem, MuiListItemIcon · src/theme.ts">
      <SpecimenList>
        <Specimen label="Overflow menu"><IconButton aria-label="More actions" aria-haspopup="menu" onClick={event => setAnchor(event.currentTarget)}><MoreHorizOutlined /></IconButton>
          <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={() => setAnchor(null)}><ListItemIcon><EditOutlined /></ListItemIcon><ListItemText>Edit</ListItemText></MenuItem>
            <MenuItem onClick={() => setAnchor(null)}><ListItemIcon><ArchiveOutlined /></ListItemIcon><ListItemText>Archive</ListItemText></MenuItem>
            <MenuItem className="is-destructive" onClick={() => setAnchor(null)}><ListItemIcon><DeleteOutlineOutlined /></ListItemIcon><ListItemText>Delete</ListItemText></MenuItem>
          </Menu>
        </Specimen>
        <Specimen label="Select dropdown"><FormControl size="small" sx={{ minWidth: 200 }}><InputLabel id="gallery-menu-select">Show</InputLabel><Select labelId="gallery-menu-select" label="Show" value={status} onChange={event => setStatus(event.target.value)}>{['All resources', 'Published', 'Drafts', 'Archived'].map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)}</Select></FormControl></Specimen>
      </SpecimenList>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>Use a menu only for two or more actions. A single action, like removing someone’s portal access, should be a visible button instead.</Typography>
    </Section>
  )
}

function ToastSection() {
  return (
    <Section id="toast" title="Toast" description="One shared Sonner toaster appears at the top center with a dark neutral background and light text." source="PlaceToaster · src/components/PlaceToaster.tsx">
      <SpecimenList>
        <Specimen label="Success"><Button variant="outlined" onClick={() => toast.success('Listing link copied')}>Preview success</Button></Specimen>
        <Specimen label="Error"><Button variant="outlined" onClick={() => toast.error('Couldn’t copy the link. Please try again.')}>Preview error</Button></Specimen>
        <Specimen label="Informational"><Button variant="outlined" onClick={() => toast('Your team shared an update')}>Preview message</Button></Specimen>
      </SpecimenList>
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>These buttons trigger the production toaster. Toasts announce the result without moving focus, and show a close (x) button on hover or keyboard focus; reduced motion removes transitions. Success and error use distinct icons on the same neutral surface.</Typography>
    </Section>
  )
}

function TypographySection() {
  return (
    <Section
      id="typography"
      title="Typography"
      description="Eighteen Manrope roles, available as named MUI Typography variants and as CSS variables. In CSS write font: var(--type-label-s) with letter-spacing: var(--type-label-s-tracking); never type a font size by hand. labelXS (11px) is only for counts beside a label and tiny markers. Uppercase labels use --tracking-uppercase."
      source="Values: src/design-tokens.css (--type-*) · MUI variants: src/design-tokens.ts · src/mui.d.ts"
      kind="Foundation"
    >
      <Stack spacing={4}>
        {typographyGroups.map(group => (
          <Box key={group.name}>
            <Typography component="h3" variant="titleXS" sx={{ mb: 1.5 }}>{group.name}</Typography>
            <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
              {group.variants.map(variant => (
                <Box key={variant} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '170px minmax(0, 1fr)' }, gap: { xs: 1, md: 3 }, alignItems: 'baseline', py: 2.5, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="labelS" color="text.secondary" component="span">{variant}</Typography>
                  <Typography variant={variant} component="p" sx={{ m: 0, overflowWrap: 'anywhere' }}>{group.sample}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Stack>
    </Section>
  )
}

function primitiveReference(variable: string, value: string, styles: CSSStyleDeclaration) {
  if (variable === '--color-semantic-surface-glass') {
    return 'base-white / 94%'
  }

  for (const family of primitiveColorFamilies) {
    for (const step of family === 'neutral' ? neutralColorSteps : primitiveColorSteps) {
      if (styles.getPropertyValue(`--color-primitive-${family}-${step}`).trim() === value) return `${family}-${step}`
    }
  }

  for (const token of baseColorTokens) {
    if (styles.getPropertyValue(`--color-primitive-${token}`).trim() === value) return token
  }

  return 'Custom color'
}

function ColorToken({ variable, label, showValue = true, showPrimitiveReference = false }: { variable: string; label: string; showValue?: boolean; showPrimitiveReference?: boolean }) {
  const styles = typeof window === 'undefined' ? null : getComputedStyle(document.documentElement)
  const value = styles?.getPropertyValue(variable).trim() || `var(${variable})`
  const detail = showPrimitiveReference && styles ? primitiveReference(variable, value, styles) : value

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box aria-hidden="true" sx={{ height: 48, bgcolor: `var(${variable})`, border: 1, borderColor: 'divider', borderRadius: 1 }} />
      <Typography component="p" variant="labelS" sx={{ mt: 1, mb: 0, overflowWrap: 'anywhere' }}>{label}</Typography>
      {showValue && <Typography component="p" variant="labelS" color="text.secondary" sx={{ mt: 0.5, mb: 0, overflowWrap: 'anywhere' }}>{detail}</Typography>}
    </Box>
  )
}

function ColorsSection() {
  return (
    <Section
      id="colors"
      title="Colors"
      description="PLACE color tokens pair semantic roles with a compact set of primitive scales. Semantic swatches show their primitive reference in the current color mode."
      source="Tokens: src/design-tokens.css · Light and Goth modes"
      kind="Foundation"
    >
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Semantic colors</Typography>
      <Stack spacing={4}>
        {semanticColorGroups.map(group => (
          <Box key={group.name}>
            <Typography component="h4" variant="titleXS" sx={{ mb: 1.5 }}>{group.name}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 2 }}>
              {group.tokens.map(token => (
                <ColorToken key={token} label={token} variable={`--color-semantic-${token}`} showPrimitiveReference />
              ))}
            </Box>
          </Box>
        ))}
      </Stack>

      <Typography component="h3" variant="titleXS" sx={{ mt: 6, mb: 1 }}>Primitive palettes</Typography>
      <Typography variant="bodySStandard" color="text.secondary" component="p" sx={{ mb: 3 }}>
        Neutral, brand, and status scales available to build semantic roles.
      </Typography>
      <Stack spacing={3}>
        {primitiveColorFamilies.map(family => (
          <Box key={family}>
            <Typography component="h4" variant="titleXS" sx={{ mb: 1.5, textTransform: 'capitalize' }}>{family}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 54px), 1fr))', gap: 1 }}>
              {(family === 'neutral' ? neutralColorSteps : primitiveColorSteps).map(step => {
                const token = `--color-primitive-${family}-${step}`
                return <ColorToken key={token} label={step} variable={token} showValue={false} />
              })}
            </Box>
          </Box>
        ))}
        <Box>
          <Typography component="h4" variant="titleXS" sx={{ mb: 1.5 }}>Base</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 2 }}>
            {baseColorTokens.map(token => (
              <ColorToken key={token} label={token} variable={`--color-primitive-${token}`} showValue={false} />
            ))}
          </Box>
        </Box>
      </Stack>
    </Section>
  )
}

function ListingSheetSection() {
  const [open, setOpen] = useState(false)
  const { listing } = sampleSellerTransaction

  return (
    <Section
      id="listing-sheet"
      title="Listing sheet"
      description="A centered listing sheet with a photo grid, full photo feed, structured home details, and an interactive location map."
      source="Seller portal · ListingDetailsSheet"
    >
      <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        The MLS number sits above the address with standard label spacing. Status, publication, and source tags sit 12px below the price. The description fills the available width and sits 8px below its heading. Highlight labels use the medium size, while Financial details and Listing information share a row above the map on wide screens. The agent footer uses horizontal dividers like the main portal footer.
      </Typography>
      <Box sx={{ maxWidth: 640, overflow: 'hidden', borderRadius: '32px 32px 0 0', bgcolor: 'background.paper', boxShadow: 'var(--elevation-1)' }}>
        <Box sx={{ height: 230, display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: 1, overflow: 'hidden' }}>
          {listing.photos.slice(0, 3).map((photo, index) => (
            <Box
              component="img"
              key={photo.url}
              src={photo.url}
              alt={photo.alt}
              sx={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', gridRow: index === 0 ? 'span 2' : undefined }}
            />
          ))}
        </Box>
        <Box sx={{ p: 3, display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Box>
            <Typography variant="labelS" color="text.secondary">MLS # {sampleSellerTransaction.details.listingFacts.find(({ label }) => label === 'MLS #')?.value}</Typography>
            <Typography variant="titleS">{listing.address}</Typography>
            <Typography variant="bodySStandard" color="text.secondary">{listing.city}, {listing.state} · {listing.photos.length} photos</Typography>
            <Chip size="small" label={`Source: ${listing.dataSource}`} variant="outlined" sx={{ mt: 1 }} />
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>Preview sheet</Button>
        </Box>
      </Box>
      <ListingDetailsSheet open={open} onClose={() => setOpen(false)} transaction={sampleSellerTransaction} />
    </Section>
  )
}

function EyebrowSection() {
  return (
    <Section id="eyebrow" title="Eyebrow" description="The small uppercase label that sits above a title." source="Eyebrow · src/components/Eyebrow.tsx · src/components/eyebrow.css">
              <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Eyebrow is the small uppercase label above a title: labelS, uppercase, 0.08em tracking, and the text-primary color. Use it for “Seller transaction”, “Your home”, MLS numbers, and guide labels. Contexts may change its color, such as text-light on the property card. The centered timeline eyebrow keeps a wider 0.16em tracking because it sits over a full-bleed tracker.</Typography>
              <Stack spacing={1}>
                <Eyebrow>Seller transaction</Eyebrow>
                <Eyebrow>MLS # 00001428</Eyebrow>
              </Stack>
    </Section>
  )
}

function StatSection() {
  return (
    <Section id="stat" title="Stat" description="Numbers with a label: a headline figure for a card and smaller supporting figures." source="Stat, HeadlineStat · src/components/Stat.tsx · src/components/stat.css">
              <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>HeadlineStat leads a card: a labelM label, a displayL number, and optional context. Stat is the supporting number: metricM with a bodyS label directly below. Numbers use tabular figures so columns line up. The listing views snapshot and the marketing dashboard both use these.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={6} sx={{ alignItems: { sm: 'flex-end' } }}>
                <HeadlineStat label="Total listing views" value="8,746" context="Across listing sites" />
                <Stat value="2,378" label="Unique visitors" />
                <Stat value="42" label="Saves" />
              </Stack>
    </Section>
  )
}

function FactListSection() {
  return (
    <Section id="fact-list" title="Fact list" description="Label and value pairs, in a grid or in rows." source="FactList · src/components/FactList.tsx · src/components/fact-list.css">
              <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>FactList shows label and value pairs. The grid layout stacks a labelS label over a labelM value in two columns; the property card and timeline item modal use it. The rows layout puts a bodyS label on the left and the value on the right, one pair per line; listing details use it, with an optional second column that collapses below 760px. Parents set spacing and surfaces with their own class.</Typography>
              <Stack spacing={4} sx={{ maxWidth: 560 }}>
                <FactList facts={[{ label: 'Status', value: 'Under contract' }, { label: 'MLS number', value: '00001428' }]} />
                <FactList layout="rows" facts={[{ label: 'Property type', value: 'Single-family home' }, { label: 'Year built', value: '2003' }, { label: 'Square feet', value: '3,952 sq ft' }]} />
              </Stack>
    </Section>
  )
}


/* ---------- Shape and space foundations: src/system-tokens.css ---------- */

const radiusTiers = [
  { token: '2xs', px: 4, use: 'Marks only: progress bars, tiny indicators' },
  { token: 'xs', px: 8, use: 'Hover and selected fills in lists, menu items' },
  { token: 's', px: 12, use: 'Inputs, menus, popovers, tooltips, image tiles in cards, row hover' },
  { token: 'm', px: 20, use: 'Every card' },
  { token: 'l', px: 28, use: 'Overlays: modals, sheets, the full timeline' },
  { token: 'pill', px: 999, use: 'Buttons, tags, chips, segmented switches' },
  { token: 'circle', px: 0, use: 'Avatars, date stamps, icon badges, icon buttons' },
] as const

function RadiusSection() {
  return (
    <Section id="radius" kind="Foundation" title="Corner radius"
      description="Five tiers plus pill and circle. Pick the tier by what the surface is, never by its size: every card is m, every overlay is l. Never write a raw radius value."
      source="--radius-* · src/system-tokens.css · radius in src/system-tokens.ts">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }, gap: 2 }}>
        {radiusTiers.map((tier) => (
          <Box key={tier.token} sx={{ display: 'grid', gap: 1 }}>
            <Box sx={{ height: 88, bgcolor: 'var(--color-semantic-surface-primary)', boxShadow: 'inset 0 0 0 1px var(--color-semantic-stroke-primary)', borderRadius: `var(--radius-${tier.token})`, ...(tier.token === 'circle' ? { width: 88 } : {}) }} />
            <Typography variant="labelM">--radius-{tier.token}{tier.token !== 'circle' && tier.token !== 'pill' ? ` · ${tier.px}px` : ''}</Typography>
            <Typography variant="labelS" color="text.secondary">{tier.use}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  )
}

const elevationLevels = [
  { token: '--elevation-0', name: '0 · Flat', use: 'Sits on the canvas. Separated by spacing or a hairline.' },
  { token: '--elevation-1', name: '1 · Rest', use: 'Cards on the page canvas. PlaceCard uses this.' },
  { token: '--elevation-2', name: '2 · Floating', use: 'Above content while scrolling or acting: sticky header, menus, popovers, an interactive card on hover.' },
  { token: '--elevation-3', name: '3 · Overlay', use: 'Modals, sheets, and the full timeline.' },
  { token: '--elevation-3-on-photo', name: '3 · On photo', use: 'A surface placed on photography, such as the hero agent card.' },
] as const

function ElevationSection() {
  return (
    <Section id="elevation" kind="Foundation" title="Elevation"
      description="Four levels. A surface uses one separation method: a shadow, a hairline, or a tonal fill. Cards never combine a stroke with a shadow. Add a hairline only to an interactive outlined control or a surface on a photo."
      source="--elevation-* · src/system-tokens.css · elevation in src/system-tokens.ts">
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 3, p: { xs: 2, sm: 4 }, bgcolor: 'var(--color-semantic-surface-primary)' }}>
        {elevationLevels.map((level) => (
          <Box key={level.token} sx={{ display: 'grid', gap: 0.75, p: 3, borderRadius: 'var(--radius-m)', bgcolor: 'var(--color-semantic-surface-primary)', boxShadow: `var(${level.token})`, ...(level.token.endsWith('on-photo') ? { outline: '1px dashed var(--color-semantic-stroke-primary)' } : {}) }}>
            <Typography variant="titleXS">{level.name}</Typography>
            <Typography variant="labelS" color="text.secondary">{level.token}</Typography>
            <Typography variant="bodySStandard" color="text.secondary">{level.use}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  )
}

const spaceSteps = [2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80] as const
const spaceRoles = [
  { token: '--padding-card', value: '32 · 20 on phones', use: 'Inside every card' },
  { token: '--padding-overlay', value: '32 · 20 on phones', use: 'Inside modals and sheets' },
  { token: '--padding-row-block', value: '20', use: 'Above and below each list row' },
  { token: '--row-hover-bleed', value: '12', use: 'How far a row hover reaches past the column' },
  { token: '--gap-stack', value: '16', use: 'Section label to its content' },
  { token: '--gap-card', value: '24', use: 'Between cards' },
  { token: '--padding-panel-top', value: '32 · 24 on phones', use: 'Tab bar to the first thing in a tab panel' },
  { token: '--gap-panel', value: '32 · 24 on phones', use: 'A tab panel’s intro or filters to its list' },
  { token: '--gap-panel-group', value: '48 · 40 on phones', use: 'Between groups inside a tab panel' },
  { token: '--gap-section', value: '64 · 48 on phones', use: 'Between sections in a zone' },
  { token: '--gap-zone', value: '80 · 56 on phones', use: 'Between the page’s major zones' },
] as const

function SpacingSection() {
  return (
    <Section id="spacing" kind="Foundation" title="Spacing"
      description="A 4px base on an 8px rhythm. Use the semantic roles first; fall back to the scale for anything inside a component. 6px is only for tight inline gaps such as metadata separators."
      source="--space-*, --padding-*, --gap-* · src/system-tokens.css · space in src/system-tokens.ts">
      <Box sx={{ display: 'grid', gap: 1, mb: 5 }}>
        {spaceSteps.map((step) => (
          <Box key={step} sx={{ display: 'grid', gridTemplateColumns: '96px minmax(0, 1fr)', alignItems: 'center', gap: 2 }}>
            <Typography variant="labelS" color="text.secondary">--space-{step}</Typography>
            <Box sx={{ width: `var(--space-${step})`, height: 12, borderRadius: 'var(--radius-2xs)', bgcolor: 'var(--color-semantic-surface-reverse-secondary)' }} />
          </Box>
        ))}
      </Box>
      <Box component="dl" sx={{ m: 0, display: 'grid' }}>
        {spaceRoles.map((role) => (
          <Box key={role.token} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 140px minmax(0, 1fr)' }, gap: { xs: 0.5, sm: 2 }, py: 1.5, borderTop: '1px solid var(--color-semantic-stroke-primary-light)' }}>
            <Typography component="dt" variant="labelM">{role.token}</Typography>
            <Typography component="dd" variant="labelS" color="text.secondary" sx={{ m: 0 }}>{role.value}</Typography>
            <Typography component="dd" variant="bodySStandard" color="text.secondary" sx={{ m: 0 }}>{role.use}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  )
}

const motionTokens = [
  { token: '--motion-press', value: '120ms ease-out', use: 'Press scale on buttons and links' },
  { token: '--motion-hover', value: '160ms ease', use: 'Hover and selection: fills, colors, borders, small icon nudges' },
  { token: '--motion-reveal', value: '200ms ease', use: 'Something changing shape in place: a chevron turning, a card lifting' },
  { token: '--motion-overlay', value: '240ms ease-out', use: 'Modals, sheets, and drawers entering' },
] as const

function FocusMotionSection() {
  return (
    <Section id="focus-motion" kind="Foundation" title="Focus and motion"
      description="Every control shows the same keyboard focus ring: a 2px outline in stroke-primary-dark, 2px outside the control. Use --focus-ring-on-dark over photography and the dark timeline band. Motion uses four tokens that pair a duration with an easing; write transition: background-color var(--motion-hover). Every transition switches off under prefers-reduced-motion."
      source="--focus-ring*, --motion-* · src/system-tokens.css · motionMs in src/system-tokens.ts">
      <SpecimenList>
        <Specimen label="Focus ring / --focus-ring">
          <Button variant="outlined" sx={{ outline: 'var(--focus-ring)', outlineOffset: 'var(--focus-ring-offset)' }}>Add to calendar</Button>
        </Specimen>
        <Specimen label="On dark / --focus-ring-on-dark">
          <Box sx={{ p: 2, borderRadius: 'var(--radius-s)', bgcolor: 'var(--color-semantic-surface-reverse-primary)', color: 'var(--color-primitive-base-white)' }}>
            <TextLink tone="onDark">See the timeline</TextLink>
          </Box>
        </Specimen>
      </SpecimenList>
      <Box component="dl" sx={{ m: 0, mt: 4, display: 'grid' }}>
        {motionTokens.map((motion) => (
          <Box key={motion.token} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 140px minmax(0, 1fr)' }, gap: { xs: 0.5, sm: 2 }, py: 1.5, borderTop: '1px solid var(--color-semantic-stroke-primary-light)' }}>
            <Typography component="dt" variant="labelM">{motion.token}</Typography>
            <Typography component="dd" variant="labelS" color="text.secondary" sx={{ m: 0 }}>{motion.value}</Typography>
            <Typography component="dd" variant="bodySStandard" color="text.secondary" sx={{ m: 0 }}>{motion.use}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  )
}

const breakpointUses: Record<keyof typeof breakpoints, string> = {
  smallPhone: 'Small phones. Tighten only what breaks.',
  phone: 'Phones. Single column, card and overlay padding drop to 20.',
  tablet: 'Small tablets. Sheets go full width, two-column lists stack.',
  laptop: 'Narrow laptops. Side-by-side columns stack.',
  desktop: 'The full desktop layout starts here.',
  wide: 'Wide screens. Extra room for rails beside the main column.',
}

function BreakpointsSection() {
  return (
    <Section id="breakpoints" kind="Foundation" title="Breakpoints"
      description="Six screen widths, and only these six. Write them as max-width 0.05px below the value, such as @media (max-width: 599.95px), so they line up with MUI. CSS can't read variables inside @media, so the values are fixed; in TypeScript use below('phone')."
      source="src/system-tokens.css › Breakpoints · breakpoints, below() in src/system-tokens.ts">
      <Box component="dl" sx={{ m: 0, display: 'grid' }}>
        {(Object.keys(breakpoints) as (keyof typeof breakpoints)[]).map((name) => (
          <Box key={name} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '200px 140px minmax(0, 1fr)' }, gap: { xs: 0.5, sm: 2 }, py: 1.5, borderTop: '1px solid var(--color-semantic-stroke-primary-light)' }}>
            <Typography component="dt" variant="labelM">{name}</Typography>
            <Typography component="dd" variant="labelS" color="text.secondary" sx={{ m: 0 }}>below {breakpoints[name]}px</Typography>
            <Typography component="dd" variant="bodySStandard" color="text.secondary" sx={{ m: 0 }}>{breakpointUses[name]}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  )
}

function CardHeaderSection() {
  return (
    <Section id="card-header" title="Card header"
      description="PortalSectionHeader is the title row at the top of a card: a titleXS title (titleS when prominent), an optional labelS subtitle, an optional action on the right, and a hairline below. PortalSection wraps it in a PlaceCard with the body underneath. Use SectionLabel for groups that sit on the page or inside a list instead."
      source="PortalSection, PortalSectionHeader · src/components/PortalSection.tsx · src/components/portal-section.css">
      <SpecimenList>
        <Specimen label="Default / with action">
          <PlaceCard sx={{ width: '100%' }}>
            <PortalSectionHeader title="Listing performance" subtitle="Last 30 days" action={<TextLink>See all</TextLink>} />
            <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ pt: 'var(--space-20)' }}>Card content starts 20px below the hairline.</Typography>
          </PlaceCard>
        </Specimen>
        <Specimen label="Prominent">
          <PlaceCard sx={{ width: '100%' }}>
            <PortalSectionHeader title="Important notes" prominent />
          </PlaceCard>
        </Specimen>
      </SpecimenList>
    </Section>
  )
}

function IconBadgeSection() {
  return (
    <Section id="icon-badge" title="Icon badge"
      description="A round gray badge that leads a row or activity item with one icon. Decorative only: the row's text carries the meaning, so it is hidden from screen readers. Sizes: s 32px, m 44px (default), l 48px."
      source="PortalIconBadge · src/components/PortalIconBadge.tsx · src/components/portal-icon-badge.css">
      <Specimen label="s / m / l">
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          {(['s', 'm', 'l'] as const).map((size) => <PortalIconBadge key={size} size={size}><CalendarTodayOutlined /></PortalIconBadge>)}
        </Stack>
      </Specimen>
    </Section>
  )
}

function AgentIdentitySection() {
  const agent = sampleSellerTransaction.team[0]
  return (
    <Section id="agent-identity" title="Agent identity"
      description="The agent's photo, a small role line, and their name. Contact actions and the brand lockup sit beside it and are supplied by the parent. Sizes set the photo: s 44px, m 48px, l 56px, xl 64px; xl also uses the larger titleS name. Set eyebrow to show the role line as an uppercase Eyebrow."
      source="AgentIdentity · src/components/AgentIdentity.tsx · src/components/agent-identity.css">
      <SpecimenList>
        <Specimen label="m (default)"><AgentIdentity agent={agent} /></Specimen>
        <Specimen label="xl / eyebrow"><AgentIdentity agent={agent} size="xl" eyebrow /></Specimen>
      </SpecimenList>
    </Section>
  )
}

function BrandLockupSection() {
  return (
    <Section id="brand-lockup" title="Brand lockup"
      description="The partner's team logo, then the brokerage logo 24px to its right when there is one. Spacing alone separates them; there is no divider line. Use it wherever the partner is credited: portal header and footer, agent cards, listing details, and emails. Set the logo widths per placement with --partner-team-width and --partner-brokerage-width rather than restyling the images."
      source="PartnerBrandLockup · src/components/PartnerBrandLockup.tsx · src/components/partner-brand-lockup.css">
      <SpecimenList>
        <Specimen label="Team and brokerage"><PartnerBrandLockup brand={sampleSellerTransaction.teamBrand} /></Specimen>
        <Specimen label="Team only"><PartnerBrandLockup brand={{ name: sampleSellerTransaction.teamBrand.name, logoUrl: sampleSellerTransaction.teamBrand.logoUrl }} /></Specimen>
      </SpecimenList>
    </Section>
  )
}

/* ---------- Shared components added in the consolidation pass ---------- */

function CardSection() {
  const [open, setOpen] = useState(false)
  return (
    <Section id="card" title="Card"
      description="PlaceCard is the one card surface: white, radius m, elevation 1, no stroke, card padding inside. Card headers use PortalSectionHeader (title, optional action, hairline below). Never restyle a card's radius, shadow, or stroke locally."
      source="PlaceCard · src/components/PlaceCard.tsx · src/components/place-card.css">
      <SpecimenList>
        <Specimen label="Default">
          <PlaceCard sx={{ width: '100%' }}>
            <Typography variant="titleS">Listing performance</Typography>
            <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 1 }}>Content sits inside the card padding.</Typography>
          </PlaceCard>
        </Specimen>
        <Specimen label="Flush / with a disclosure footer">
          <PlaceCard padding="none" sx={{ width: '100%' }}>
            <Box sx={{ p: 'var(--padding-card)' }}>
              <Typography variant="titleS">Review and sign Form 17</Typography>
              <Collapse in={open}><Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 1 }}>The rest of the details appear in place.</Typography></Collapse>
            </Box>
            <DisclosureButton placement="cardFooter" open={open} onToggle={() => setOpen(!open)} showLabel="Show all details" hideLabel="Show less" />
          </PlaceCard>
        </Specimen>
        <Specimen label="Interactive / hover lifts to elevation 2">
          <PlaceCard interactive sx={{ width: '100%' }}>
            <Typography variant="titleXS">Meeting note</Typography>
            <Typography component="p" variant="bodySStandard" color="text.secondary" sx={{ mt: 1 }}>Use only when the whole card is one click target.</Typography>
          </PlaceCard>
        </Specimen>
      </SpecimenList>
    </Section>
  )
}

function SectionLabelSection() {
  return (
    <Section id="section-label" title="Section label"
      description="Names a list or group on the page or inside a list: “What’s coming up next”, “Dates”, “In progress”. Same type as Eyebrow. An optional count sits one step smaller on the baseline, and only when the number changes what the reader does. An optional action, such as a back link, sits on the same line."
      source="SectionLabel · src/components/SectionLabel.tsx · src/components/section-label.css">
      <SpecimenList>
        <Specimen label="Default"><Box sx={{ width: '100%' }}><SectionLabel>Dates</SectionLabel></Box></Specimen>
        <Specimen label="With a count"><Box sx={{ width: '100%' }}><SectionLabel count={3}>Pinned</SectionLabel></Box></Specimen>
        <Specimen label="With an action"><Box sx={{ width: '100%' }}><SectionLabel action={<TextLink direction="back" onClick={() => {}}>Back to pending</TextLink>}>First up in closing</SectionLabel></Box></Specimen>
      </SpecimenList>
    </Section>
  )
}

function TextLinkSection() {
  return (
    <Section id="text-link" title="Text link"
      description="The one way to go somewhere: text plus an arrow. → opens another view, sheet, or modal, or jumps down the page. ← returns. ↗ is only for external links that open a new tab. It is a quiet text button: no fill at rest, a soft pill fill on hover, and the arrow nudges. 44px hit area."
      source="TextLink · src/components/TextLink.tsx · src/components/text-link.css">
      <SpecimenList>
        <Specimen label="Forward"><TextLink onClick={() => {}}>View marketing dashboard</TextLink></Specimen>
        <Specimen label="Back"><TextLink direction="back" onClick={() => {}}>Back to pending</TextLink></Specimen>
        <Specimen label="External"><TextLink href="https://place.com">PLACE website</TextLink></Specimen>
      </SpecimenList>
    </Section>
  )
}

function DisclosureSection() {
  const [listOpen, setListOpen] = useState(false)
  return (
    <Section id="disclosure" title="Disclosure button"
      description="The one way to show or hide more in place: text plus a chevron that turns when open. Under a list it sits flush left with the rows; as a card's last row it runs full width under a hairline. Never use an outlined pill or a TextLink for this."
      source="DisclosureButton · src/components/DisclosureButton.tsx · src/components/disclosure-button.css">
      <SpecimenList>
        <Specimen label="List / with hidden count (card footer: see Card)"><Box sx={{ width: '100%', display: 'grid' }}><DisclosureButton open={listOpen} onToggle={() => setListOpen(!listOpen)} showLabel="Show done" hideLabel="Hide done" count={2} /></Box></Specimen>
      </SpecimenList>
    </Section>
  )
}

function TagSection() {
  return (
    <Section id="tag" title="Tag"
      description="A short, static label on a row, card, or photo. Quiet tags are a hairline pill on white, so they read on photography too. Strong tags are dark and mean the reader needs to act; use at most one per view. Tags are never buttons."
      source="PlaceTag · src/components/PlaceTag.tsx · src/components/place-tag.css">
      <SpecimenList>
        <Specimen label="Quiet"><Stack direction="row" spacing={1}><PlaceTag>File</PlaceTag><PlaceTag>Resource</PlaceTag><PlaceTag>Price drop</PlaceTag></Stack></Specimen>
        <Specimen label="Strong"><PlaceTag tone="strong">Needs your signature</PlaceTag></Specimen>
      </SpecimenList>
    </Section>
  )
}


function FilterPillsSection() {
  const [value, setValue] = useState<'open' | 'done'>('open')
  return (
    <Section id="filter-pills" title="Filter pills"
      description="Narrows one list to a subset. Compact pills: outlined when off, dark when on, one always selected, the broadest option first and selected by default. No counts in the pills. On phones the row scrolls sideways."
      source="FilterPills · src/components/FilterPills.tsx · src/components/filter-pills.css">
      <SpecimenList>
        <Specimen label="Team to-dos / Open, Done"><FilterPills label="Filter team to-dos" value={value} onChange={setValue} options={[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]} /></Specimen>
      </SpecimenList>
    </Section>
  )
}

export function ComponentGallery() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="titleS">PLACE</Typography>
          <Button component="a" href="/" variant="text" color="primary" startIcon={<ArrowBackOutlined />} sx={{ px: 1 }}>
            Sandbox home
          </Button>
        </Container>
      </Box>

      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: 12 }}>
        <Typography variant="labelS" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Design system / 01
        </Typography>
        <Typography component="h1" variant="displayS" sx={{ mt: 1.5, textWrap: 'balance' }}>Component gallery</Typography>
        <Typography component="p" variant="bodyMStandard" color="text.secondary" sx={{ mt: 2, mb: { xs: 7, md: 10 }, maxWidth: 650, textWrap: 'pretty' }}>
          A working record of PLACE foundations and system-wide components. Samples render the production components and their supported variants. Page-specific components live with their pages, not here.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '170px minmax(0, 1fr)' }, gap: { xs: 2, md: 7 } }}>
          <Box component="nav" aria-label="Gallery sections" sx={{ alignSelf: 'start', position: { md: 'sticky' }, top: { md: 32 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: { xs: 2, md: 1 }, overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 2, md: 0 } }}>
            <Typography variant="labelS" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Library / {sections.length}
            </Typography>
            {sections.map(section => (
              <Box key={section.id} component="a" href={`#${section.id}`} sx={{ flexShrink: 0, color: 'text.primary', textDecoration: 'none', py: 0.75, borderRadius: 1, typography: 'labelM', transition: 'color var(--motion-hover)', '&:hover': { color: 'text.secondary' }, '&:focus-visible': { outline: 'var(--focus-ring)', outlineOffset: 3 } }}>
                {section.name}
              </Box>
            ))}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <TypographySection />
            <ColorsSection />
            <RadiusSection />
            <ElevationSection />
            <SpacingSection />
            <FocusMotionSection />
            <BreakpointsSection />
            <ButtonSection />
            <IconButtonSection />
            <ChipSection />
            <SegmentedSwitchSection />
            <TabsSection />
            <CardSection />
            <CardHeaderSection />
            <PaperSection />
            <ModalSection />
            <SheetSection />
            <ToastSection />
            <MenuSection />
            <FormControlsSection />
            <EyebrowSection />
            <SectionLabelSection />
            <TextLinkSection />
            <DisclosureSection />
            <TagSection />
            <FilterPillsSection />
            <StatSection />
            <FactListSection />
            <IconBadgeSection />
            <AgentIdentitySection />
            <BrandLockupSection />
            <ListingSheetSection />
            <Section
              id="email-blocks"
              title="Email blocks"
              description="The client email family shares a team and brokerage header, property context, body pane, primary action, agent signature, and a centered footer."
              source="src/email-templates/EmailPreview.tsx · src/email-templates/email-preview.css"
            >
              <Box sx={{ maxWidth: 640, mx: 'auto', bgcolor: 'var(--color-semantic-surface-secondary)', p: { xs: 1, sm: 3 } }}>
                <EmailPreview template={emailTemplates[0]} />
              </Box>
              <Button component="a" href="/email-templates" variant="text" sx={{ mt: 3 }}>Review all email templates</Button>
            </Section>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
