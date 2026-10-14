/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety3 SlopFree5 */
import { toast } from 'sonner'
import '../../../public/team/flow-map-button.css'
import { ClientPreviewBanner } from '../../team-portal/ClientPortalPreview'
import { TeamResourceSwitchSample } from '../../team-portal/TeamPortal'
import { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import type { ReactNode } from 'react'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import ContentCopyOutlined from '@mui/icons-material/ContentCopyOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import { PlaceSheet } from '../../components/PlaceSheet'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import PushPin from '@mui/icons-material/PushPin'
import PhoneOutlined from '@mui/icons-material/PhoneOutlined'
import { brandAssets } from '../../assets/brand'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import { CardActionButton } from '../../components/CardActionButton'
import { PortalOutlineTag } from '../../components/PortalOutlineTag'
import { PlaceModal, placeModalWidths, type PlaceModalSize } from '../../components/PlaceModal'
import { SegmentedSwitch, type SegmentedSwitchOption } from '../../components/SegmentedSwitch'
import { typographyTokens } from '../../design-tokens'
import { ListingDetailsSheet } from '../../seller-portal/ListingDetailsSheet'
import { ListingOverview } from '../../seller-portal/ListingOverview'
import { ListingPreparation } from '../../seller-portal/ListingPreparation'
import { createBeforeListingTransaction } from '../review/sellerJourneyViews'
import { portalTabs, type PortalTab } from '../../seller-portal/SellerPortal'
import { MarketingSnapshot } from '../../seller-portal/MarketingSnapshot'
import { AdvertisingSnapshot } from '../../seller-portal/AdvertisingSnapshot'
import { marketingFeedbackLayouts, type MarketingFeedbackLayout } from '../../seller-portal/marketingFeedbackLayouts'
import { MarketingDashboardSheet, type MarketingDashboardSection } from '../../seller-portal/MarketingDashboardSheet'
import { futureMarketingSnapshot, futureSellerTransaction } from '../../seller-portal/futureSellerTransaction'
import {
  ResourcesPanel,
  ResourceGuideSheet,
  ActivityEventRow,
  ActivityPanel,
  AdvertisingRow,
  DateEventList,
  DateEventRow,
  DetailGrid,
  DocumentsPanel,
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
} from '../../transaction-portal/components'
import type { TransactionDocument, TransactionResource } from '../../transaction-portal/types'
import { sampleSellerTransaction } from '../../seller-portal/sellerTransaction'
import { EmailPreview } from '../../email-templates/EmailPreview'
import { emailTemplates } from '../../email-templates/emailTemplates'

const sections = [
  { id: 'typography', name: 'Typography' },
  { id: 'colors', name: 'Colors' },
  { id: 'button', name: 'Button' },
  { id: 'icon-button', name: 'Icon button' },
  { id: 'chip', name: 'Chip' },
  { id: 'segmented-switch', name: 'Segmented switch' },
  { id: 'paper', name: 'Paper' },
  { id: 'modal', name: 'Modal' },
  { id: 'sheet', name: 'Sheet' },
  { id: 'toast', name: 'Toast' },
  { id: 'listing-sheet', name: 'Listing sheet' },
  { id: 'portal-patterns', name: 'Portal patterns' },
  { id: 'email-blocks', name: 'Email blocks' },
  { id: 'team-resources', name: 'Team resources' },
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
    <Section id="button" number="03" title="Button"
      description="Five shared variants use the PLACE pill radius, typography, padding, and 44px minimum height. Photo actions use the same variants here and in the listing header."
      source="Theme: MuiButton · src/theme.ts · src/mui.d.ts">
      <Typography component="h3" variant="titleXS" sx={{ mb: 2 }}>Variants and states</Typography>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 3 }}>
        Each row shows an enabled, disabled, and loading button. Hover, press, or use Tab to inspect the actual interaction styles on enabled samples. These are live components, without simulated state overrides.
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
        <Specimen label="Card action / CardActionButton">
          <Paper variant="outlined" sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Typography variant="titleS">Recent activity</Typography>
              <CardActionButton onClick={tryAction}>See all</CardActionButton>
            </Box>
          </Paper>
        </Specimen>
        <Specimen label="Sizes / small, medium, large">
          <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {([{ size: 'small', height: 44 }, { size: 'medium', height: 48 }, { size: 'large', height: 56 }] as const).map(({ size, height }) => (
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
    <Section id="chip" number="05" title="Chip"
      description="Chip variants share PLACE small-label typography. PortalOutlineTag is a separate 30px outlined treatment used for publication and task due dates."
      source="Theme: MuiChip · PortalOutlineTag">
      <SpecimenList>
        <Specimen label="Filled / medium"><Chip label="In progress" /></Specimen>
        <Specimen label="Outlined / medium"><Chip label="In progress" variant="outlined" /></Specimen>
        <Specimen label="Small / filled and outlined"><Stack direction="row" spacing={1}><Chip label="In progress" size="small" /><Chip label="In progress" size="small" variant="outlined" /></Stack></Specimen>
        <Specimen label="Portal outlined / publication and due date"><Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}><PortalOutlineTag label="Published" /><PortalOutlineTag label="Due 10/08/2026" /></Stack></Specimen>
        <Specimen label="Clickable / live interaction">
          <Chip label={selected ? 'Selected' : 'Filter'} variant="outlined" clickable aria-pressed={selected} onClick={() => setSelected(value => !value)} />
        </Specimen>
        <Specimen label="Disabled / filled and outlined"><Stack direction="row" spacing={1}><Chip label="Filter" disabled /><Chip label="Filter" variant="outlined" disabled /></Stack></Specimen>
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
          <SegmentedSwitch options={viewOptions} defaultValue="list" size="s" aria-label="Search view" />
        </Specimen>
        <Specimen label="One option disabled">
          <SegmentedSwitch options={[{ value: 'list', label: 'List' }, { value: 'map', label: 'Map', disabled: true }]} defaultValue="list" aria-label="Search view with unavailable map" />
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
  const states = ['Default', 'Hover', 'Focus', 'Pinned', 'Disabled'] as const

  return (
    <Section
      id="icon-button"
      number="04"
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
  const [minimal, setMinimal] = useState(false)
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
            <Button variant="outlined" onClick={() => { setMinimal(false); setActiveSize(size) }}>Open modal</Button>
          </Specimen>
        ))}
        <Specimen label="Content only / no description or footer actions">
          <Button variant="outlined" onClick={() => { setMinimal(true); setActiveSize('s') }}>Open content-only modal</Button>
        </Specimen>
      </SpecimenList>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>All five sizes share the same header, close control, and surface. Description and footer actions are optional content slots. Use Escape, the backdrop, or the close button to dismiss the sample.</Typography>
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
    <Section id="sheet" number="09" title="Sheet" description="PlaceSheet is the shared bottom-sheet surface used by listing details and resource guides. It has one responsive width, rather than the five modal sizes." source="PlaceSheet · src/components/PlaceSheet.tsx · src/components/place-sheet.css">
      <Specimen label="Default / responsive bottom sheet"><Button variant="outlined" onClick={() => setOpen(true)}>Open sheet</Button></Specimen>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>The sheet uses the shared rounded top corners, scrim, and scrolling surface. Escape, the backdrop, or the close control dismiss it and return focus to its trigger. Reduced motion removes the opening transition.</Typography>
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

function ToastSection() {
  return (
    <Section id="toast" number="10" title="Toast" description="One shared Sonner toaster appears at the top center with a dark neutral background and light text." source="PlaceToaster · src/components/PlaceToaster.tsx">
      <SpecimenList>
        <Specimen label="Success"><Button variant="outlined" onClick={() => toast.success('Listing link copied')}>Preview success</Button></Specimen>
        <Specimen label="Error"><Button variant="outlined" onClick={() => toast.error('Couldn’t copy the link. Please try again.')}>Preview error</Button></Specimen>
        <Specimen label="Informational"><Button variant="outlined" onClick={() => toast('Your team shared an update')}>Preview message</Button></Specimen>
      </SpecimenList>
      <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>These buttons trigger the production toaster. Toasts announce the result without moving focus; reduced motion removes transitions. Success and error use distinct icons on the same neutral surface.</Typography>
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
      number="11"
      title="Listing sheet"
      description="A centered listing sheet with a photo grid, full photo feed, structured home details, and an interactive location map."
      source="Seller portal · ListingDetailsSheet"
    >
      <Typography variant="bodySStandard" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        The MLS number sits above the address with standard label spacing. Status, publication, and source tags sit 12px below the price. The description fills the available width and sits 8px below its heading. Highlight labels use the medium size, while Financial details and Listing information share a row above the map on wide screens. The agent footer uses horizontal dividers like the main portal footer.
      </Typography>
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
  const [resourcePreview, setResourcePreview] = useState<TransactionResource | null>(null)
  const [sellerTab, setSellerTab] = useState<PortalTab>('activity')
  const [feedbackLayout, setFeedbackLayout] = useState<MarketingFeedbackLayout>('editorial')
  const [marketingDashboardSection, setMarketingDashboardSection] = useState<MarketingDashboardSection | null>(null)
  const [previewDocument, setPreviewDocument] = useState<TransactionDocument | null>(null)
  const [listingPreviewOpen, setListingPreviewOpen] = useState(false)
  const sample = sampleSellerTransaction

  return (
    <Section
      id="portal-patterns"
      number="12"
      title="Portal patterns"
      description="Shared transaction components for seller views and future buyer views. Open this group to inspect the working samples."
      source="Transaction portal · src/transaction-portal/components"
    >
      <Box component="details" sx={{ borderTop: 1, borderBottom: 1, borderColor: 'divider', py: 2, '& summary': { cursor: 'pointer', typography: 'labelM', py: 1, '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 } } }}>
        <Box component="summary">Show portal components</Box>
      <Stack spacing={5} sx={{ pt: 4 }}>
          <Typography variant="bodySStandard" color="text.secondary">
            On the seller page, the listing header and main blocks fade upward by 8px as they first enter view. Paired cards follow 55ms apart. The entrance plays once, stays off tab changes, and is removed for reduced motion.
          </Typography>
          <PortalPatternSample title="Portal top bar">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Use the supplied PLACE wordmark beside Client portal. The top bar shares the page content’s 1480px max width and side padding so the logo and account align with the sections below. On narrow screens, show the wordmark without the subtitle so both sides have room.</Typography>
            <Box component="header" className="portal-topbar">
              <Container maxWidth="xl" className="portal-topbar-inner">
                <Box component="a" href="/" className="portal-brand-link" aria-label="PLACE client portal home">
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box component="img" src={brandAssets.place.wordmarkDefault} alt="" className="place-wordmark" />
                    <Box className="topbar-divider" />
                    <Typography variant="bodySStandard" color="text.secondary" className="portal-brand-label">Client portal</Typography>
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Avatar className="account-avatar">TB</Avatar>
                  <Box className="account-name">
                    <Typography variant="labelM">Tim Bennett</Typography>
                    <Typography variant="labelS" color="text.secondary">Seller</Typography>
                  </Box>
                </Stack>
              </Container>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Compact card listing header">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>The Card variant places the address, statuses, agent row, and partner logos in a compact photo-led header. First Party opens the existing preview; IDX MVP uses the same external actions as the light split headers.</Typography>
            <ListingOverview transaction={sample} onSeeListing={() => setListingPreviewOpen(true)} variant="card" listingLink="idx-mvp" />
          </PortalPatternSample>
          <PortalPatternSample title="Full-width listing header">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>The taller dark header fades the house photo behind the address and listing action, with the agent card at the far right. The compact card keeps its agent row and logos inside the header.</Typography>
            <Box sx={{ overflow: 'hidden', borderRadius: 2, '& .listing-overview--full.MuiPaper-root': { width: '100%', marginLeft: 0 }, '& .listing-overview--full .listing-summary': { marginLeft: 24 } }}>
              <ListingOverview
                transaction={sample}
                onSeeListing={() => setListingPreviewOpen(true)}
                variant="full"
              />
            </Box>
            <ListingDetailsSheet open={listingPreviewOpen} onClose={() => setListingPreviewOpen(false)} transaction={sample} />
          </PortalPatternSample>
          <PortalPatternSample title="Light split listing header">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>The top-aligned light split option. The house photo sits beside the listing information with rounded corners. The listing action sits 16px from the photo edges on small screens. At stacked widths, the copy uses a 32px side inset to align with the cards below. The status chip uses extra space before its icon for optical balance. Agent details appear below a divider in the copy column; phone and email stay side by side until narrow mobile widths. Only the values are links, and they darken and reveal an up-right arrow on hover or keyboard focus. Partner logos stay out of this header.</Typography>
            <Box sx={{ overflow: 'hidden', borderRadius: 2, '& .listing-overview--light.MuiPaper-root': { width: '100%', marginLeft: 0 } }}>
              <ListingOverview transaction={sample} onSeeListing={() => setListingPreviewOpen(true)} variant="light" />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Bottom-aligned light listing header">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>The seller page default. The team and brokerage lockup sits at the top of the copy column. Listing status, address, and agent details have a 32px inset from the photo’s edges. The agent uses the same call and email icon buttons as the footer. Compare this with the standard Light split option in the seller design panel.</Typography>
            <Box sx={{ overflow: 'hidden', borderRadius: 2, '& .listing-overview--light-bottom.MuiPaper-root': { width: '100%', marginLeft: 0 } }}>
              <ListingOverview transaction={sample} onSeeListing={() => setListingPreviewOpen(true)} variant="light-bottom" />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="IDX MVP listing actions">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Header listing link defaults to First Party, which opens the listing preview. IDX MVP places an On Image Secondary Copy link button to the left of See Listing. The up-right arrow marks the external destination, which opens in a new tab. Copy link copies the same URL and shows a Sonner confirmation only after copying succeeds; a failed copy shows an error. Both actions keep visible keyboard focus and 44px touch targets.</Typography>
            <Box sx={{ overflow: 'hidden', borderRadius: 2, '& .listing-overview--light.MuiPaper-root': { width: '100%', marginLeft: 0 } }}>
              <ListingOverview transaction={sample} onSeeListing={() => setListingPreviewOpen(true)} variant="light-bottom" listingLink="idx-mvp" />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Listing photo unavailable">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>When a listing has no photo, the shared placeholder keeps the header and listing action available. This is a content state of the Card variant.</Typography>
            <ListingOverview transaction={{ ...sample, listing: { ...sample.listing, photoUrl: null } }} onSeeListing={() => setListingPreviewOpen(true)} variant="card" />
          </PortalPatternSample>
          <PortalPatternSample title="Unpublished listing preview">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>An unpublished listing uses Preview listing and opens the first-party preview even when IDX MVP is selected. Copy link and the external destination become available after publication.</Typography>
            <ListingOverview transaction={{ ...sample, listing: { ...sample.listing, published: false } }} onSeeListing={() => setListingPreviewOpen(true)} variant="card" listingLink="idx-mvp" />
          </PortalPatternSample>
          <PortalPatternSample title="Before listing · preparation">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Use the compact No listing header before a listing is available. It shares the Light split header’s column proportions, content inset, and responsive stacking. Larger team and brokerage logos replace the photo on the right and align with the bottom of the agent row. The header retains the address, status, and agent contacts, with no listing preview action. On smaller screens, the logos sit above the property details. A dark gray note from the team sits above activity and dates with no extra top margin, customizable title and message text, and no checklist or action. Marketing is hidden until the listing is live. The Under contract view retains its selected header layout.</Typography>
            <Box sx={{ overflow: 'hidden', '& .listing-overview--no-listing.MuiPaper-root': { width: '100%', marginLeft: 0 } }}>
              <ListingOverview transaction={createBeforeListingTransaction(sample)} onSeeListing={() => setListingPreviewOpen(true)} variant="no-listing" listingLink="idx-mvp" />
            </Box>
            <ListingPreparation message={createBeforeListingTransaction(sample).clientMessage!} />
            <Button component="a" href="/seller/future-v1?view=before-listing" variant="text" sx={{ mt: 2 }}>Open before-listing view</Button>
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
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              Your Team and Viewers each fill half the tab bar. Both lists begin 30px below the tabs, with no extra viewer description. On the seller page, People and transaction sections sit 40px apart. Tabs change the visible panel and support keyboard navigation.
            </Typography>
            <Box sx={{ maxWidth: 460 }}>
              <PeopleSection team={sample.team.slice(0, 3)} viewers={sample.viewers} value={peopleTab} onChange={setPeopleTab} />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Seller section tabs">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              Activity, Tasks, Notes, and Documents make up the original seller page tab row. Future v1 adds Resources, with stage-relevant guides. Tabs scroll on smaller screens and support keyboard navigation. Listing details live in See Listing.
            </Typography>
            <Box component="nav" aria-label="Transaction sections" className="portal-section-nav">
              <Tabs value={sellerTab} onChange={(_, value: PortalTab) => setSellerTab(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Transaction information">
                {portalTabs.map((tab) => <Tab key={tab.id} value={tab.id} label={tab.label} />)}
              </Tabs>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Team and brokerage logos">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, p: 3, borderRadius: 2, bgcolor: 'var(--color-semantic-surface-primary-darkest)' }}>
              <Box><Typography variant="labelS" sx={{ mb: 1, display: 'block' }}>Team and brokerage</Typography><PartnerBrandLockup brand={sample.teamBrand} /></Box>
              <Box><Typography variant="labelS" sx={{ mb: 1, display: 'block' }}>Team only</Typography><PartnerBrandLockup brand={{ ...sample.teamBrand, brokerage: undefined }} /></Box>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Portal footer">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>At stacked widths, center the agent group and partner branding as separate rows.</Typography>
            <PortalFooter agent={sample.team.find((member) => member.id === sample.teamBrand.leadAgentId)} brand={sample.teamBrand} />
          </PortalPatternSample>
          <PortalPatternSample title="Upcoming dates and recent activity">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Lead with upcoming dates in the wider desktop column and first on mobile. Match the card heights when they sit side by side, using the taller card’s natural height without stretching the row spacing. Stacked cards follow their own content height. Give the dates 24px below the header divider, 64px date markers with room around the month and day, and 28px between rows. The date row opens an explanation modal; the right-aligned guide chip opens the resource independently. On phones, the chip moves below the description. Use the compact activity variant with 32px icons, 16px row padding, and attribution alongside the timestamp.</Typography>
            <Box className="priority-grid" sx={{ mt: 0 }}>
              <Box className="upcoming-dates-card">
                <PortalSection title="Upcoming dates" prominent>
                  <DateEventList>
                    {[...futureSellerTransaction.upcomingDates].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3).map(date => <DateEventRow key={date.id} {...date} resource={futureSellerTransaction.resources?.find(resource => resource.id === date.guidance?.resourceId)} onReadResource={date.guidance && (() => setResourcePreview(futureSellerTransaction.resources!.find(resource => resource.id === date.guidance!.resourceId)!))} guidance={date.guidance} />)}
                  </DateEventList>
                </PortalSection>
              </Box>
              <PortalSection title="Recent activity" prominent>
                <Box component="ol" className="activity-event-list">
                  {sample.timeline.slice(0, 3).map(event => <ActivityEventRow key={event.id} event={event} variant="compact" />)}
                </Box>
              </PortalSection>
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Listing marketing snapshot">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              Channel labels use the medium body size on desktop and the small body size on tablet and mobile. On mobile, each channel places its label 18px above the count, with the unit aligned to the count baseline. The dashboard action stays beside the heading until narrow phone widths. Editorial showing feedback is the default; Current, Side rail, and Note remain available in the design panel. Its divider matches the metric separators: left of feedback on desktop, above it with more space when stacked. Each layout puts the hearts above the quote, the source and date below it, and Showing feedback beside the carousel controls. The main dashboard action opens the full marketing view.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }} aria-label="Showing feedback layouts">
              {marketingFeedbackLayouts.map((layout) => (
                <Button key={layout.id} size="small" variant={feedbackLayout === layout.id ? 'contained' : 'outlined'} onClick={() => setFeedbackLayout(layout.id)}>
                  {layout.label}
                </Button>
              ))}
            </Box>
            <MarketingSnapshot data={futureMarketingSnapshot} feedback={sample.feedback} feedbackLayout={feedbackLayout} onOpenDashboard={() => setMarketingDashboardSection('overview')} />
            <MarketingDashboardSheet open={marketingDashboardSection !== null} onClose={() => setMarketingDashboardSection(null)} initialSection={marketingDashboardSection ?? 'overview'} transaction={futureSellerTransaction} data={futureMarketingSnapshot} />
          </PortalPatternSample>
          <PortalPatternSample title="Listing views snapshot">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              An alternate seller view led by total listing views and a quiet 14-day trend. Unique visitors, saves, and shares support the main number; social reach and showing feedback stay visible at a lower level. Sample figures are illustrative. Select Listing views in the seller design panel to see it in context.
            </Typography>
            {futureMarketingSnapshot.insights && (
              <AdvertisingSnapshot data={futureMarketingSnapshot.insights} feedback={sample.feedback} onOpenDashboard={() => setMarketingDashboardSection('overview')} />
            )}
          </PortalPatternSample>
          <PortalPatternSample title="Transaction Resources and guide reader">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Future v1 leads with guides that are useful at the current stage, followed by upcoming and reference topics. Featured icons sit directly on the card surface. Featured cards and guide rows share 24px padding, reduced to 20px on mobile. Each full-row or card button opens a readable guide with preparation steps and questions to ask an agent. The reader shares the listing details bottom sheet, with an editorial title, section navigation, numbered preparation advice, and a question section. A hamburger opens the full resource library inside the sheet and highlights the current guide; selecting another guide closes the menu and starts reading at the top. The contents list collapses on mobile so reading starts sooner. It supports Escape and returns focus to the trigger.</Typography>
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Featured cards use a primary surface fill with a stroke-primary border. Featured cards and guide rows use the primary-dark surface token on hover.</Typography>
            <ResourcesPanel resources={futureSellerTransaction.resources!} onOpen={setResourcePreview} />
            <ResourceGuideSheet resource={resourcePreview} resources={futureSellerTransaction.resources ?? []} onSelectResource={setResourcePreview} onClose={() => setResourcePreview(null)} />
          </PortalPatternSample>
          <PortalPatternSample title="Contextual milestone guidance">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Keep dates scannable. The resource chip prefixes its label with “Resource: ”, uses the guide’s optional shortTitle, and opens the full guide; its accessible label retains the full title. The whole date row is a keyboard-accessible button that opens a PLACE small modal with the explanation and preparation advice. The row and resource chip use the primary-dark surface token for their hover fill. The resource chip is a separate button on the right, so opening the guide does not also open the explanation. The modal pairs “What it means” and “What you need to do” headings using titleXS. An outlined button labeled “Resource: ” followed by the guide’s short title sits on the left of the footer and opens the resource reader after closing the modal; the primary Done action sits on the right and closes the modal. On phones, the resource chip moves below the description, keeping the entire date row available as the explanation trigger. The modal supports Escape, focus return, and reduced motion. Use this optional guidance in the upcoming dates card and full dates drawer.</Typography>
            <DateEventList>
              {futureSellerTransaction.upcomingDates.slice(2, 4).map((date) => <DateEventRow key={date.id} {...date} resource={futureSellerTransaction.resources?.find(resource => resource.id === date.guidance?.resourceId)} onReadResource={date.guidance && (() => setResourcePreview(futureSellerTransaction.resources!.find(resource => resource.id === date.guidance!.resourceId)!))} guidance={date.guidance} />)}
            </DateEventList>
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
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              Standard rows align the timestamp with the title and keep the actor below the description. Use compact rows in overview cards: 32px icons, 16px row padding, and the actor and timestamp together beneath the description. Keep the standard variant for full activity history.
            </Typography>
            <Box component="ol" className="activity-event-list" sx={{ maxWidth: 760 }}>
              {sample.timeline.slice(0, 2).map(event => <ActivityEventRow key={event.id} event={event} />)}
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Compact activity event rows">
            <Box component="ol" className="activity-event-list" sx={{ maxWidth: 440 }}>
              {sample.timeline.slice(0, 3).map(event => <ActivityEventRow key={event.id} event={event} variant="compact" />)}
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Paginated activity history">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              Tab content uses the same horizontal inset as its tab labels. List tabs show up to 10 rows per page, then reveal page controls and a visible range count. This future seller sample has 21 activity updates across three pages; the Recent activity card stays limited to three.
            </Typography>
            <Box sx={{ maxWidth: 760, border: 1, borderColor: 'divider', borderRadius: 2 }}>
              <ActivityPanel events={futureSellerTransaction.timeline} />
            </Box>
          </PortalPatternSample>
          <PortalPatternSample title="Task row">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Place the due-date tag with the task title. When space is tight, it wraps within that heading row before the description.</Typography>
            <TransactionRowList><TaskRow task={sample.tasks[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Advertising row">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>
              Give the attribution line 6px of space below the update title and use the lighter text color.
            </Typography>
            <Typography variant="labelS">Standard / icon, attribution, and separate date</Typography>
            <TransactionRowList><AdvertisingRow event={sample.advertising[0]} /></TransactionRowList>
            <Typography variant="labelS" sx={{ mt: 2, display: 'block' }}>Compact / attribution and date below the update</Typography>
            <TransactionRowList><AdvertisingRow event={sample.advertising[0]} compact /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Showing feedback row">
            <TransactionRowList><ShowingFeedbackRow feedback={sample.feedback[0]} /></TransactionRowList>
          </PortalPatternSample>
          <PortalPatternSample title="Team note card">
            <TeamNoteCard note={sample.notes[0]} />
          </PortalPatternSample>
          <PortalPatternSample title="Document cards and pinning">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Document cards show a thumbnail with a subtle paper shadow, a title, an upload date, a byline, and an always-visible PlaceIconButton pin control. A filled pin marks a pinned document; the button stays borderless and uses the shared hover and keyboard-focus treatment. The entire card opens the document; categories, signature status, and a separate Preview action are omitted. Filled pins indicate pinned documents, which stay above the remaining paginated cards. Pins are remembered for this viewer and transaction in this browser. Supply thumbnailUrl for a real preview image; documents without one show a sample page built from their metadata.</Typography>
            <DocumentsPanel documents={sample.documents} storageKey="place-document-pins:gallery" onOpen={setPreviewDocument} />
            <Typography variant="labelM" sx={{ display: 'block', mt: 4, mb: 2 }}>Read-only client preview</Typography>
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>Pass readOnly to disable pin changes while keeping document previews available.</Typography>
            <DocumentsPanel documents={sample.documents.slice(0, 2)} storageKey="place-document-pins:gallery-preview" onOpen={setPreviewDocument} readOnly />
          </PortalPatternSample>
          <PortalPatternSample title="Detail grid and section">
            <Typography variant="bodySStandard" color="text.secondary" sx={{ mb: 2 }}>The standard section uses titleXS; the activity and dates examples above use the prominent titleS option. Subtitle and header action are optional slots.</Typography>
            <PortalSection title="Transaction details" subtitle="Your current sale" action={<CardActionButton onClick={() => setListingPreviewOpen(true)}>See listing</CardActionButton>}>
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
          A working record of PLACE foundations, shared components, and portal patterns. Samples render the production components and their supported variants. Page-specific combinations are documented under Portal patterns.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '170px minmax(0, 1fr)' }, gap: { xs: 2, md: 7 } }}>
          <Box component="nav" aria-label="Gallery sections" sx={{ alignSelf: 'start', position: { md: 'sticky' }, top: { md: 32 }, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: { xs: 2, md: 1 }, overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 2, md: 0 } }}>
            <Typography variant="labelS" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, mb: 1, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Library / {sections.length}
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
            <SheetSection />
            <ToastSection />
            <ListingSheetSection />
            <PortalPatternsSection />
            <Section id="team-resources" number="16" title="Transaction resource visibility" description="A resource’s publication state lives in the library. Its visibility is chosen separately for each transaction." source="Team workspace · uses the shared Switch, Typography, and semantic surface tokens.">
              <Specimen label="Visible / hidden"><TeamResourceSwitchSample /></Specimen>
              <Specimen label="Internal canvas page link"><Box sx={{ p: 3, bgcolor: 'var(--color-semantic-surface-reverse-primary)', borderRadius: 2 }}><a className="flow-page-button" href="/team/library">Open resource library</a></Box><Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 2 }}>The standalone HTML flow map uses this equivalent of PLACE’s onImagePrimary button, with the same pill shape, spacing, and color tokens.</Typography></Specimen>
              <Specimen label="Client preview banner"><ClientPreviewBanner clientLabel="Tim & Alex Bennett’s seller portal" /></Specimen>
              <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 3 }}>Switch changes apply immediately to one transaction. Publishing and archiving are admin-only; creation, editing, and default permissions remain proposals. Publishing opens a review dialog inside the editor, with the number of linked transactions affected. Buttons and dialogs reuse the existing PLACE components.</Typography>
            </Section>
            <Section
              id="email-blocks"
              number="13"
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
