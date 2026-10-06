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
import { SegmentedSwitch, type SegmentedSwitchOption } from '../components/SegmentedSwitch'
import { typographyTokens } from '../design-tokens'
import { primaryButtonHoverShadow } from '../theme'
import { ListingDetailsSheet } from '../seller-portal/ListingDetailsSheet'
import { ListingOverview } from '../seller-portal/ListingOverview'
import { MarketingSnapshot } from '../seller-portal/MarketingSnapshot'
import { futureMarketingSnapshot } from '../seller-portal/futureSellerTransaction'
import {
  ActivityEventRow,
  AdvertisingRow,
  DateEventList,
  DateEventRow,
  DetailGrid,
  DocumentRow,
  PeopleSection,
  PartnerBrandLockup,
  PortalIconBadge,
  PortalFooter,
  PortalSection,
  ShowingFeedbackRow,
  TaskRow,
  TeamNoteCard,
  TransactionRowList,
  type PeopleTab,
} from '../transaction-portal/components'
import type { TransactionDocument } from '../transaction-portal/types'
import { sampleSellerTransaction } from '../seller-portal/sellerTransaction'
import { EmailPreview } from '../email-templates/EmailPreview'
import { emailTemplates } from '../email-templates/emailTemplates'

const sections = [
  { id: 'typography', name: 'Typography' },
  { id: 'colors', name: 'Colors' },
  { id: 'button', name: 'Button' },
  { id: 'icon-button', name: 'Icon button' },
  { id: 'chip', name: 'Chip' },
  { id: 'segmented-switch', name: 'Segmented switch' },
  { id: 'paper', name: 'Paper' },
  { id: 'modal', name: 'Modal' },
  { id: 'listing-sheet', name: 'Listing sheet' },
  { id: 'portal-patterns', name: 'Portal patterns' },
  { id: 'email-blocks', name: 'Email blocks' },
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

const primitiveColorFamilies = ['neutral', 'gray', 'blue', 'sky', 'green', 'yellow', 'red', 'violet'] as const
const primitiveColorSteps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const
const neutralColorSteps = [...primitiveColorSteps, '950'] as const
const baseColorTokens = ['base-black', 'base-white'] as const

function Section({
  id,
  number,
  title,
  description,
  source,
  kind = 'Component',
  children,
}: {
  id: string
  number: string
  title: string
  description: string
  source: string
  kind?: 'Foundation' | 'Component'
  children: ReactNode
}) {
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

function ButtonSection() {
  const theme = useTheme()
  const [clicks, setClicks] = useState(0)

  function stateStyle(state: PreviewState) {
    if (state === 'Hover') return { boxShadow: primaryButtonHoverShadow, backgroundColor: 'var(--color-semantic-surface-reverse-secondary)' }
    if (state === 'Pressed') return { boxShadow: theme.shadows[8] }
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
      description="The shared action control uses the PLACE pill radius and a 44px minimum height. The contained primary button uses the neutral 800 fill and a soft hover shadow."
      source="Theme: MuiButton · src/theme.ts"
    >
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Variants</Typography>
      <SpecimenList>
        {variants.map(({ label, variant, color }) => (
          <Specimen key={label} label={label}>
            <Button variant={variant} color={color} onClick={() => setClicks(value => value + 1)}>Continue</Button>
          </Specimen>
        ))}
        <Specimen label="Card action">
          <Paper variant="outlined" sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="titleS">Recent activity</Typography>
              <CardActionButton onClick={() => setClicks(value => value + 1)}>See all</CardActionButton>
            </Box>
          </Paper>
        </Specimen>
      </SpecimenList>
      <Typography component="h3" variant="titleXS" sx={{ mt: 5, mb: 1 }}>States</Typography>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Hover, pressed, and focus are held previews of the primary button. The variants above can be tried directly.
      </Typography>
      <SpecimenList>
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
      </SpecimenList>
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
      source="Theme: MuiChip · src/theme.ts"
    >
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Variants</Typography>
      <SpecimenList>
        <Specimen label="Filled"><Chip label="In progress" /></Specimen>
        <Specimen label="Outlined"><Chip label="In progress" variant="outlined" /></Specimen>
        <Specimen label="Small"><Chip label="In progress" size="small" /></Specimen>
      </SpecimenList>
      <Typography component="h3" variant="titleXS" sx={{ mt: 5, mb: 1 }}>States</Typography>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Click the default chip to toggle its sample selection. Other state tiles are held previews.
      </Typography>
      <SpecimenList>
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
  const peopleOptions: readonly SegmentedSwitchOption<'team' | 'viewers'>[] = [
    { value: 'team', label: 'Team' },
    { value: 'viewers', label: 'Viewers' },
  ]

  return (
    <Section
      id="segmented-switch"
      number="06"
      title="Segmented switch"
      description="A compact control for moving between a few parallel views within the same page."
      source="SegmentedSwitch · src/components/SegmentedSwitch.tsx"
    >
      <SpecimenList>
        <Specimen label="Default / M">
          <SegmentedSwitch options={audienceOptions} value={audience} onChange={setAudience} aria-label="Client view" />
        </Specimen>
        <Specimen label="Compact / S">
          <SegmentedSwitch options={peopleOptions} defaultValue="team" size="s" aria-label="People view" />
        </Specimen>
        <Specimen label="Disabled">
          <SegmentedSwitch options={audienceOptions} defaultValue="seller" disabled aria-label="Unavailable client view" />
        </Specimen>
      </SpecimenList>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
        Use for two or three related views, not page navigation. The selected option is pressed; inactive options gain a quiet hover fill and every option has a visible keyboard focus state.
      </Typography>
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
      source="MUI IconButton · seller portal contact actions"
    >
      <SpecimenList>
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
      </SpecimenList>
    </Section>
  )
}

function PaperSection() {
  return (
    <Section
      id="paper"
      number="07"
      title="Paper"
      description="Paper provides the quiet surface behind grouped content. The outlined variant uses the system hairline border."
      source="Theme: MuiPaper · src/theme.ts"
    >
      <SpecimenList>
        <Specimen label="Default / flat">
          <Paper elevation={0} sx={{ width: '100%', p: 4 }}>
            <Typography variant="titleXS" sx={{ display: 'block' }}>Transaction summary</Typography>
            <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mt: 1 }}>A calm surface for related information.</Typography>
          </Paper>
        </Specimen>
        <Specimen label="Outlined">
          <Paper variant="outlined" sx={{ width: '100%', p: 4 }}>
            <Typography variant="titleXS" sx={{ display: 'block' }}>Transaction summary</Typography>
            <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mt: 1 }}>A hairline marks the surface boundary.</Typography>
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
  const [activeSize, setActiveSize] = useState<PlaceModalSize | null>(null)

  return (
    <Section
      id="modal"
      number="08"
      title="Modal"
      description="A focused overlay built on MUI Dialog, with five predictable widths and one consistent PLACE surface."
      source="PlaceModal · src/components/PlaceModal.tsx"
    >
      <SpecimenList>
        {modalSizes.map(size => (
          <Specimen key={size} label={`${size.toUpperCase()} / ${placeModalWidths[size]}px`}>
            <Button variant="outlined" onClick={() => setActiveSize(size)}>Open modal</Button>
          </Specimen>
        ))}
      </SpecimenList>
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

function primitiveReference(variable: string, value: string, styles: CSSStyleDeclaration) {
  if (variable === '--color-semantic-surface-glass') {
    return document.documentElement.dataset.colorMode === 'goth' ? 'neutral-900 / 94%' : 'base-white / 94%'
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
      number="02"
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
      number="09"
      title="Listing sheet"
      description="A centered listing sheet with a photo grid, full photo feed, structured home details, and an interactive location map."
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
            <Typography variant="labelS" color="text.secondary">Listing data from {listing.dataSource}</Typography>
          </Box>
          <Button variant="contained" onClick={() => setOpen(true)}>Preview sheet</Button>
        </Box>
      </Box>
      <ListingDetailsSheet open={open} onClose={() => setOpen(false)} transaction={sampleSellerTransaction} />
    </Section>
  )
}

function PortalPatternSample({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>{title}</Typography>
      {children}
    </Box>
  )
}

function PortalPatternsSection() {
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('team')
  const [previewDocument, setPreviewDocument] = useState<TransactionDocument | null>(null)
  const [listingPreviewOpen, setListingPreviewOpen] = useState(false)
  const sample = sampleSellerTransaction

  return (
    <Section
      id="portal-patterns"
      number="10"
      title="Portal patterns"
      description="Shared transaction components for seller views and future buyer views. Open this group to inspect the working samples."
      source="Transaction portal · src/transaction-portal/components"
    >
      <Box component="details" sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 2, '& summary': { cursor: 'pointer', typography: 'labelM', py: 1, '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 } } }}>
        <Box component="summary">Show portal components</Box>
        <Stack spacing={5} sx={{ pt: 4 }}>
          <PortalPatternSample title="Full-width listing header">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>The full-width variant groups the agent, side-by-side contact links, and partner logos in one card. The card variant keeps its compact agent row and logos in the header. Both share the same listing header component, photo fade, and status chips.</Typography>
            <Box sx={{ overflow: 'hidden', borderRadius: 2, '& .listing-overview--full.MuiPaper-root': { width: '100%', minHeight: 450, marginLeft: 0 }, '& .listing-overview--full .listing-summary': { marginLeft: 24 } }}>
              <ListingOverview
                transaction={sample}
                onSeeListing={() => setListingPreviewOpen(true)}
                variant="full"
              />
            </Box>
            <ListingDetailsSheet open={listingPreviewOpen} onClose={() => setListingPreviewOpen(false)} transaction={sample} />
          </PortalPatternSample>
          <PortalPatternSample title="Icon badge">
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
          <PortalPatternSample title="People section and rows">
            <Box sx={{ maxWidth: 460 }}>
              <PeopleSection team={sample.team.slice(0, 3)} viewers={sample.viewers} value={peopleTab} onChange={setPeopleTab} />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Team and brokerage logos">
            <Box sx={{ display: 'inline-flex', p: 3, borderRadius: 2, bgcolor: 'var(--color-semantic-surface-primary-darkest)' }}>
              <PartnerBrandLockup brand={sample.teamBrand} />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Portal footer">
            <PortalFooter agent={sample.team.find((member) => member.id === sample.teamBrand.leadAgentId)} brand={sample.teamBrand} />
          </PortalPatternSample>
          <PortalPatternSample title="Activity and upcoming dates cards">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Pair the cards at equal height. Show the next three dates in chronological order and let their rows share the available height without extra vertical padding around the list.</Typography>
            <Box className="priority-grid" sx={{ mt: 0 }}>
              <PortalSection title="Recent activity" prominent>
                <Box component="ol" className="activity-event-list">
                  {sample.timeline.slice(0, 3).map(event => <ActivityEventRow key={event.id} event={event} />)}
                </Box>
              </PortalSection>
              <Box className="upcoming-dates-card">
                <PortalSection title="Upcoming Dates" prominent>
                  <DateEventList>
                    {[...sample.upcomingDates].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3).map(date => <DateEventRow key={date.id} {...date} />)}
                  </DateEventList>
                </PortalSection>
              </Box>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Listing marketing snapshot">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              A full-width future seller preview. Six channel rollups use Metric L counts and Label M status text. Advertising and showing feedback share a secondary dark surface with a divider between them; the divider becomes horizontal when the notes stack. The actions open their corresponding portal tabs.
            </Typography>
            <MarketingSnapshot data={futureMarketingSnapshot} advertising={sample.advertising} feedback={sample.feedback} onViewActivity={() => { window.location.href = '/seller/future-v1?section=advertising#transaction-information' }} onViewFeedback={() => { window.location.href = '/seller/future-v1?section=feedback#transaction-information' }} />
          </PortalPatternSample>
          <PortalPatternSample title="Date event rows">
            <Box sx={{ maxWidth: 600 }}>
              <DateEventList>
                <DateEventRow {...sample.upcomingDates[0]} />
                <DateEventRow date="2026-09-14" title={sample.timeline[0].title} description={sample.timeline[0].description}>
                  {sample.timeline[0].actor} · 10:42 AM
                </DateEventRow>
              </DateEventList>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Activity event rows">
            <Box component="ol" className="activity-event-list" sx={{ maxWidth: 760 }}>
              {sample.timeline.slice(0, 2).map(event => <ActivityEventRow key={event.id} event={event} />)}
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Task row">
            <TransactionRowList><TaskRow task={sample.tasks[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Advertising row">
            <TransactionRowList><AdvertisingRow event={sample.advertising[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Showing feedback row">
            <TransactionRowList><ShowingFeedbackRow feedback={sample.feedback[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Team note card">
            <TeamNoteCard note={sample.notes[0]} />
          </PortalPatternSample>
          <PortalPatternSample title="Document row">
            <TransactionRowList><DocumentRow document={sample.documents[0]} onPreview={setPreviewDocument} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Detail grid and section">
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
              Library / 11
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
            <SegmentedSwitchSection />
            <PaperSection />
            <ModalSection />
            <ListingSheetSection />
            <PortalPatternsSection />
            <Section
              id="email-blocks"
              number="11"
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
