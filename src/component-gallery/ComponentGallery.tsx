/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety3 SlopFree5 */
import { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import type { ReactNode } from 'react'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import { CardActionButton } from '../components/CardActionButton'
import { PlaceModal, placeModalWidths, type PlaceModalSize } from '../components/PlaceModal'
import { typographyTokens } from '../design-tokens'
import { ListingDetailsSheet } from '../seller-portal/ListingDetailsSheet'
import {
  ActivityEventRow,
  AdvertisingRow,
  DateEventList,
  DateEventRow,
  DetailGrid,
  DocumentRow,
  PeopleSection,
  PortalIconBadge,
  PortalSection,
  ShowingFeedbackRow,
  TaskRow,
  TeamNoteCard,
  TransactionRowList,
  type PeopleTab,
} from '../transaction-portal/components'
import type { TransactionDocument } from '../transaction-portal/types'
import { sampleSellerTransaction } from '../seller-portal/sellerTransaction'

const sections = [
  { id: 'typography', name: 'Typography' },
  { id: 'colors', name: 'Colors' },
  { id: 'button', name: 'Button' },
  { id: 'icon-button', name: 'Icon button' },
  { id: 'chip', name: 'Chip' },
  { id: 'paper', name: 'Paper' },
  { id: 'modal', name: 'Modal' },
  { id: 'listing-sheet', name: 'Listing sheet' },
  { id: 'portal-patterns', name: 'Portal patterns' },
] as const

type PreviewState = 'Default' | 'Hover' | 'Pressed' | 'Focus' | 'Disabled' | 'Loading'

const buttonStates: PreviewState[] = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled', 'Loading']
const chipStates: Exclude<PreviewState, 'Loading'>[] = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled']
const modalSizes = Object.keys(placeModalWidths) as PlaceModalSize[]

const typographyGroups: { name: string; variants: (keyof typeof typographyTokens)[]; sample: string }[] = [
  { name: 'Display', variants: ['displayL', 'displayM', 'displayS'], sample: 'A place to call home' },
  { name: 'Title', variants: ['titleL', 'titleM', 'titleS', 'titleXS'], sample: 'Your next chapter' },
  {
    name: 'Body',
    variants: ['bodyLStandard', 'bodyMStandard', 'bodySStandard', 'bodyMCompact', 'bodySCompact'],
    sample: 'Everything you need to know, clearly in one place.',
  },
  { name: 'Label', variants: ['labelM', 'labelS'], sample: 'Next step' },
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

const primitiveColorFamilies = ['gray', 'slate', 'blue', 'sky', 'green', 'yellow', 'red', 'violet'] as const
const primitiveColorSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const
const baseColorTokens = ['base-black', 'base-white'] as const

function Section({
  id,
  number,
  title,
  description,
  guidance,
  source,
  kind = 'Component',
  children,
}: {
  id: string
  number: string
  title: string
  description: string
  guidance: string
  source: string
  kind?: 'Foundation' | 'Component'
  children: ReactNode
}) {
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-title`} sx={{ scrollMarginTop: 32, py: { xs: 5, md: 7 }, borderTop: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 230px' }, gap: { xs: 3, md: 8 }, mb: 4 }}>
        <Box>
          <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {number} / {kind}
          </Typography>
          <Typography component="h2" id={`${id}-title`} variant="titleL" sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="bodyMStandard" color="text.secondary" sx={{ maxWidth: 600, textWrap: 'pretty' }}>
            {description}
          </Typography>
        </Box>
        <Box>
          <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Guidance
          </Typography>
          <Typography variant="bodySStandard" sx={{ textWrap: 'pretty' }}>{guidance}</Typography>
          <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            {source}
          </Typography>
        </Box>
      </Box>
      {children}
    </Box>
  )
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>{label}</Typography>
      <Box sx={{ minHeight: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 2.5, bgcolor: 'var(--color-semantic-surface-secondary)', borderRadius: 2 }}>
        {children}
      </Box>
    </Box>
  )
}

function StateGrid({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 156px), 1fr))', gap: 2 }}>
      {children}
    </Box>
  )
}

function ButtonSection() {
  const theme = useTheme()
  const [clicks, setClicks] = useState(0)

  function stateStyle(state: PreviewState) {
    if (state === 'Hover') return { boxShadow: theme.shadows[4], '--variant-containedBg': theme.palette.primary.dark }
    if (state === 'Pressed') return { boxShadow: theme.shadows[8], '--variant-containedBg': theme.palette.primary.dark }
    if (state === 'Focus') return { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 }
    return undefined
  }

  const variants: { label: string; variant: ButtonProps['variant']; color: ButtonProps['color'] }[] = [
    { label: 'Primary / contained', variant: 'contained', color: 'primary' },
    { label: 'Secondary / outlined', variant: 'outlined', color: 'primary' },
    { label: 'Quiet / text', variant: 'text', color: 'primary' },
  ]

  return (
    <Section
      id="button"
      number="03"
      title="Button"
      description="The shared action control uses the PLACE pill radius and a 44px minimum height. Its color and text roles come from the theme."
      guidance="Use one contained action per view or decision area. Use outlined or text for supporting actions. Card actions use 16px horizontal padding and align their label with a card’s 32px content edge. Loading keeps the action in place while work completes."
      source="Theme: MuiButton · src/theme.ts"
    >
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Variants</Typography>
      <StateGrid>
        {variants.map(({ label, variant, color }) => (
          <Specimen key={label} label={label}>
            <Button variant={variant} color={color} onClick={() => setClicks(value => value + 1)}>Continue</Button>
          </Specimen>
        ))}
      </StateGrid>
      <Typography component="h3" variant="titleXS" sx={{ mt: 5, mb: 2 }}>Card action</Typography>
      <Paper variant="outlined" sx={{ maxWidth: 520, p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="titleS">Recent activity</Typography>
          <CardActionButton onClick={() => setClicks(value => value + 1)}>See all</CardActionButton>
        </Box>
      </Paper>
      <Typography component="h3" variant="titleXS" sx={{ mt: 5, mb: 1 }}>States</Typography>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Hover, pressed, and focus are held previews of the primary button. The variants above can be tried directly.
      </Typography>
      <StateGrid>
        {buttonStates.map(state => (
          <Specimen key={state} label={state}>
            <Button
              variant="contained"
              color="primary"
              disabled={state === 'Disabled'}
              loading={state === 'Loading'}
              sx={stateStyle(state)}
              onClick={() => setClicks(value => value + 1)}
            >
              Continue
            </Button>
          </Specimen>
        ))}
      </StateGrid>
      <Typography aria-live="polite" variant="labelS" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        {clicks > 0 ? `Sample action used ${clicks} ${clicks === 1 ? 'time' : 'times'}.` : 'Select an enabled button to try it.'}
      </Typography>
    </Section>
  )
}

function ChipSection() {
  const theme = useTheme()
  const [selected, setSelected] = useState(false)

  function stateStyle(state: Exclude<PreviewState, 'Loading'>) {
    if (state === 'Hover') return { bgcolor: theme.palette.action.hover }
    if (state === 'Pressed') return { bgcolor: theme.palette.action.selected, boxShadow: theme.shadows[1] }
    if (state === 'Focus') return { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 }
    return undefined
  }

  return (
    <Section
      id="chip"
      number="05"
      title="Chip"
      description="Compact status and filter labels use the PLACE small-label typography across MUI chip variants."
      guidance="Use a plain chip for status. Make a chip clickable only when it changes a filter or selection, and keep its selected state clear in nearby text."
      source="Theme: MuiChip · src/theme.ts"
    >
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Variants</Typography>
      <StateGrid>
        <Specimen label="Filled"><Chip label="In progress" /></Specimen>
        <Specimen label="Outlined"><Chip label="In progress" variant="outlined" /></Specimen>
        <Specimen label="Small"><Chip label="In progress" size="small" /></Specimen>
      </StateGrid>
      <Typography component="h3" variant="titleXS" sx={{ mt: 5, mb: 1 }}>States</Typography>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Click the default chip to toggle its sample selection. Other state tiles are held previews.
      </Typography>
      <StateGrid>
        {chipStates.map(state => (
          <Specimen key={state} label={state}>
            <Chip
              label={state === 'Default' && selected ? 'Selected' : 'Filter'}
              variant="outlined"
              clickable={state === 'Default'}
              disabled={state === 'Disabled'}
              onClick={state === 'Default' ? () => setSelected(value => !value) : undefined}
              sx={stateStyle(state)}
            />
          </Specimen>
        ))}
      </StateGrid>
    </Section>
  )
}

function IconButtonSection() {
  const states = ['Default', 'Hover', 'Focus'] as const

  return (
    <Section
      id="icon-button"
      number="04"
      title="Icon button"
      description="Quiet icon buttons keep secondary actions available without competing with primary actions."
      guidance="Use a transparent default, a subtle gray hover fill, visible keyboard focus, and an accessible label. Keep the target at least 44px square."
      source="MUI IconButton · seller portal contact actions"
    >
      <StateGrid>
        {states.map((label) => (
          <Specimen key={label} label={label}>
            <IconButton
              aria-label="Call agent"
              title="Call agent"
              sx={{
                width: 44,
                height: 44,
                color: 'text.secondary',
                bgcolor: 'transparent',
                transition: 'background-color 140ms ease, color 140ms ease',
                '&:hover': { color: 'text.primary', bgcolor: 'var(--color-semantic-surface-secondary-dark)' },
                ...(label === 'Hover' ? { color: 'text.primary', bgcolor: 'var(--color-semantic-surface-secondary-dark)' } : {}),
                ...(label === 'Focus' ? { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 2 } : {}),
              }}
            >
              <PhoneOutlined fontSize="small" />
            </IconButton>
          </Specimen>
        ))}
      </StateGrid>
    </Section>
  )
}

function PaperSection() {
  return (
    <Section
      id="paper"
      number="06"
      title="Paper"
      description="Paper provides the quiet surface behind grouped content. The outlined variant uses the system hairline border."
      guidance="Use a contained surface only when grouping helps comprehension. Seller portal cards use 32px internal padding. The outlined state is useful on the near-white canvas; use spacing and hierarchy first."
      source="Theme: MuiPaper · src/theme.ts"
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
        <Specimen label="Default / flat">
          <Paper elevation={0} sx={{ width: '100%', p: 4 }}>
            <Typography variant="titleXS">Transaction summary</Typography>
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 1 }}>A calm surface for related information.</Typography>
          </Paper>
        </Specimen>
        <Specimen label="Outlined">
          <Paper variant="outlined" sx={{ width: '100%', p: 4 }}>
            <Typography variant="titleXS">Transaction summary</Typography>
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 1 }}>A hairline marks the surface boundary.</Typography>
          </Paper>
        </Specimen>
      </Box>
      <Typography variant="labelS" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Paper is a container; hover, pressed, and disabled states are not part of its theme skin.
      </Typography>
    </Section>
  )
}

function ModalSection() {
  const [activeSize, setActiveSize] = useState<PlaceModalSize | null>(null)

  return (
    <Section
      id="modal"
      number="07"
      title="Modal"
      description="A focused overlay built on MUI Dialog, with five predictable widths and one consistent PLACE surface."
      guidance="Choose the smallest size that comfortably fits the content. Use xs for confirmations, s or m for short flows, and l or xl for richer content. MUI handles focus, Escape, backdrop dismissal, and focus return."
      source="PlaceModal · src/components/PlaceModal.tsx"
    >
      <StateGrid>
        {modalSizes.map(size => (
          <Specimen key={size} label={`${size.toUpperCase()} / ${placeModalWidths[size]}px`}>
            <Button variant="outlined" onClick={() => setActiveSize(size)}>Open modal</Button>
          </Specimen>
        ))}
      </StateGrid>
      <PlaceModal
        open={activeSize !== null}
        onClose={() => setActiveSize(null)}
        size={activeSize ?? 'm'}
        title="Transaction update"
        description="A focused place for details that need your attention."
        actions={
          <>
            <Button variant="text" onClick={() => setActiveSize(null)}>Cancel</Button>
            <Button variant="contained" onClick={() => setActiveSize(null)}>Done</Button>
          </>
        }
      >
        <Typography variant="bodyMStandard" color="text.secondary">
          Your team has shared a new update. Review the details here, then return to your transaction when you’re ready.
        </Typography>
      </PlaceModal>
    </Section>
  )
}

function TypographySection() {
  return (
    <Section
      id="typography"
      number="01"
      title="Typography"
      description="Seventeen Manrope roles are available as named MUI Typography variants. Each sample below renders with the actual token."
      guidance="Use Display sparingly, Title for routine headings, Body for reading, Label for controls and metadata, and Metric for meaningful values."
      source="Tokens: src/design-tokens.ts · src/mui.d.ts"
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

function ColorToken({ variable, label, showValue = true }: { variable: string; label: string; showValue?: boolean }) {
  const value = typeof window === 'undefined'
    ? `var(${variable})`
    : getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || `var(${variable})`

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box aria-hidden="true" sx={{ height: 48, bgcolor: `var(${variable})`, border: 1, borderColor: 'divider', borderRadius: 1 }} />
      <Typography component="p" variant="labelS" sx={{ mt: 1, mb: 0, overflowWrap: 'anywhere' }}>{label}</Typography>
      {showValue && <Typography component="p" variant="labelS" color="text.secondary" sx={{ mt: 0.5, mb: 0, overflowWrap: 'anywhere' }}>{value}</Typography>}
    </Box>
  )
}

function ColorsSection() {
  return (
    <Section
      id="colors"
      number="02"
      title="Colors"
      description="PLACE color tokens pair semantic roles with a compact set of primitive scales. Each swatch uses the live value from the design token stylesheet."
      guidance="Use semantic tokens in components so the same role adapts across color modes. Primitive scales are the source palette for defining those roles."
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
                <ColorToken key={token} label={token} variable={`--color-semantic-${token}`} />
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
              {primitiveColorSteps.map(step => {
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
              <ColorToken key={token} label={token} variable={`--color-primitive-${token}`} />
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
      number="08"
      title="Listing sheet"
      description="A centered listing sheet with a photo grid, full photo feed, structured home details, and an interactive location map."
      guidance="See all opens the full photo feed. Listing Description uses the MLS description as one content field, followed by facts, interior, exterior, and financial details; the Google map uses an explicitly approximate sample pin. Back returns to the listing; Close, Escape, or the backdrop exits the sheet."
      source="Seller portal · ListingDetailsSheet"
    >
      <Box sx={{ maxWidth: 640, overflow: 'hidden', borderRadius: '32px 32px 0 0', bgcolor: 'background.paper', boxShadow: 'var(--elevation-raised)' }}>
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
            <Typography variant="titleS">{listing.address}</Typography>
            <Typography variant="bodySStandard" color="text.secondary">{listing.city}, {listing.state} · {listing.photos.length} photos</Typography>
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>Preview sheet</Button>
        </Box>
      </Box>
      <ListingDetailsSheet open={open} onClose={() => setOpen(false)} transaction={sampleSellerTransaction} />
    </Section>
  )
}

function PortalPatternSample({ title, guidance, children }: { title: string; guidance: string; children: ReactNode }) {
  return (
    <Box>
      <Typography component="h3" variant="titleXS" sx={{ mb: 0.5 }}>{title}</Typography>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>{guidance}</Typography>
      {children}
    </Box>
  )
}

function PortalPatternsSection() {
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('team')
  const [previewDocument, setPreviewDocument] = useState<TransactionDocument | null>(null)
  const sample = sampleSellerTransaction

  return (
    <Section
      id="portal-patterns"
      number="09"
      title="Portal patterns"
      description="Shared transaction components for seller views and future buyer views. Open this group to inspect the working samples."
      guidance="Pass transaction content through props and compose rows in lists. The page owns route state and data selection; these components own their visual treatment and local interactions."
      source="Transaction portal · src/transaction-portal/components"
    >
      <Box component="details" sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 2, '& summary': { cursor: 'pointer', typography: 'labelM', py: 1, '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 } } }}>
        <Box component="summary">Show portal components</Box>
        <Stack spacing={5} sx={{ pt: 4 }}>
          <PortalPatternSample title="Icon badge" guidance="Use the same neutral badge for activity, advertising, and document icons. Sizes are s (32px), m (44px, default), and l (48px); the icon scales with the circle.">
            <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                <PortalIconBadge size="s"><DescriptionOutlined /></PortalIconBadge>
                <Typography variant="labelS" color="text.secondary">S · 32px</Typography>
              </Stack>
              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                <PortalIconBadge><DescriptionOutlined /></PortalIconBadge>
                <Typography variant="labelS" color="text.secondary">M · 44px</Typography>
              </Stack>
              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                <PortalIconBadge size="l"><DescriptionOutlined /></PortalIconBadge>
                <Typography variant="labelS" color="text.secondary">L · 48px</Typography>
              </Stack>
            </Stack>
          </PortalPatternSample>
          <PortalPatternSample title="People section and rows" guidance="Team and viewer rows share avatar, name, and role styling. Team rows compose optional call and email actions. The parent controls the active tab.">
            <Box sx={{ maxWidth: 460 }}>
              <PeopleSection team={sample.team.slice(0, 3)} viewers={sample.viewers} brand={sample.teamBrand} value={peopleTab} onChange={setPeopleTab} />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Date event rows" guidance="Use the same date row for upcoming milestones and past events; add attribution as child content when it exists.">
            <Box sx={{ maxWidth: 600 }}>
              <DateEventList>
                <DateEventRow {...sample.upcomingDates[0]} />
                <DateEventRow date="2026-09-14" title={sample.timeline[0].title} description={sample.timeline[0].description}>
                  {sample.timeline[0].actor} · 10:42 AM
                </DateEventRow>
              </DateEventList>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Activity event rows" guidance="The event type selects the icon. Adjacent rows have a divider and no connecting timeline line.">
            <Box component="ol" className="activity-event-list" sx={{ maxWidth: 760 }}>
              {sample.timeline.slice(0, 2).map(event => <ActivityEventRow key={event.id} event={event} />)}
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Task row" guidance="Keep the task name, description, assignee, and due date together. Lists provide dividers between rows.">
            <TransactionRowList><TaskRow task={sample.tasks[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Advertising row" guidance="Show the destination, who added the listing, and the timestamp in one row.">
            <TransactionRowList><AdvertisingRow event={sample.advertising[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Showing feedback row" guidance="Keep the date, visit type, interest rating, and quoted feedback visible together.">
            <TransactionRowList><ShowingFeedbackRow feedback={sample.feedback[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Team note card" guidance="The white card uses 32px padding. Two lines of body text are shown before See more opens the complete note.">
            <TeamNoteCard note={sample.notes[0]} />
          </PortalPatternSample>
          <PortalPatternSample title="Document row" guidance="Preview is an action supplied by the page. The row shows document type, status, and who last updated it.">
            <TransactionRowList><DocumentRow document={sample.documents[0]} onPreview={setPreviewDocument} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Detail grid and section" guidance="Compose labeled values inside the shared section surface for transaction facts and custom details.">
            <PortalSection title="Transaction details">
              <DetailGrid rows={[{ label: 'Status', value: sample.listing.status }, { label: 'MLS number', value: sample.listing.mlsNumber }]} />
            </PortalSection>
          </PortalPatternSample>
        </Stack>
      </Box>
      <PlaceModal open={previewDocument !== null} onClose={() => setPreviewDocument(null)} size="s" title={previewDocument?.name ?? 'Document preview'} closeLabel="Close document preview">
        <Typography variant="bodyMStandard">{previewDocument?.summary}</Typography>
      </PlaceModal>
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
          A working record of PLACE typography, color tokens, and MUI components. Samples use the styles and values from the current theme.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '170px minmax(0, 1fr)' }, gap: { xs: 2, md: 7 } }}>
          <Box component="nav" aria-label="Gallery sections" sx={{ alignSelf: 'start', position: { md: 'sticky' }, top: { md: 32 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: { xs: 2, md: 1 }, overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 2, md: 0 } }}>
            <Typography variant="labelS" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Library / 09
            </Typography>
            {sections.map(section => (
              <Box key={section.id} component="a" href={`#${section.id}`} sx={{ flexShrink: 0, color: 'text.primary', textDecoration: 'none', py: 0.75, borderRadius: 1, typography: 'labelM', transition: 'color 150ms ease', '&:hover': { color: 'text.secondary' }, '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 } }}>
                {section.name}
              </Box>
            ))}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <TypographySection />
            <ColorsSection />
            <ButtonSection />
            <IconButtonSection />
            <ChipSection />
            <PaperSection />
            <ModalSection />
            <ListingSheetSection />
            <PortalPatternsSection />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
