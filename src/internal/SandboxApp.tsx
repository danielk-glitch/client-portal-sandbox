/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { ReactNode } from 'react'
import AutoStoriesOutlined from '@mui/icons-material/AutoStoriesOutlined'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import OtherHousesOutlined from '@mui/icons-material/OtherHousesOutlined'
import { typographyTokens } from '../design-tokens'
import { ComponentGallery } from './component-gallery/ComponentGallery'
import { SellerPortal } from '../seller-portal/SellerPortal'
import { currentSellerTransaction } from '../seller-portal/currentSellerTransaction'
import { TimelineFirstPortal } from '../seller-portal/timeline-first/TimelineFirstPortal'
import { BuyerPortal } from '../buyer-portal/BuyerPortal'
import { mvpBuyerTimeline, mvpBuyerTransaction } from '../buyer-portal/mvpBuyerTransaction'
import { futureMarketingSnapshot, futureSellerTransaction } from '../seller-portal/futureSellerTransaction'
import { sampleMarketActivity } from '../seller-portal/market-activity/marketActivityData'
import { EmailGallery } from './email-gallery/EmailGallery'
import './presentation-dark.css'
import { ClientPortalPreview } from '../team-portal/ClientPortalPreview'
import { TeamPortal } from '../team-portal/TeamPortal'
import { teamViews } from '../team-portal/teamData'
import { TransactionsIndex } from '../client-account/TransactionsIndex'
import { ClientProfile } from '../client-account/ClientProfile'

/** Shown on the home page so collaborators can see how fresh the design is. Update on every push (see AGENTS.md). */
const lastUpdated = 'November 20, 2026'

type PrototypePage = {
  number: string
  title: string
  description: string
  actionLabel?: string
  icon: ReactNode
  featured?: boolean
  href: string
}

const prototypePages: PrototypePage[] = [
  {
    number: '01',
    title: 'Seller portal · MVP',
    description: 'A clear view of the listing, the people supporting it, and what comes next.',
    actionLabel: 'Open seller portal',
    icon: <OtherHousesOutlined />,
    featured: true,
    href: '/seller',
  },
  {
    number: '02',
    title: 'Component gallery',
    description: 'A minimal, storybook-like view of the design tokens and building blocks behind the portal.',
    icon: <AutoStoriesOutlined />,
    href: '/components',
  },
  {
    number: '03',
    title: 'Buyer portal · MVP',
    description: 'From signed contract to closing day.',
    icon: <HomeOutlined />,
    href: '/buyer',
  },
]

type PrototypeView = {
  label: string
  href: string
}

const buyerViews: PrototypeView[] = [
  { label: 'MVP', href: '/buyer' },
  { label: 'Future Vision', href: '/buyer/v1-iteration2' },
]

const sellerViews: PrototypeView[] = [
  { label: 'MVP', href: '/seller' },
  { label: 'Future Vision', href: '/seller/v1-iteration2' },
  { label: 'Transactions index', href: '/transactions' },
  { label: 'Profile', href: '/profile' },
]

type ArchivedExploration = PrototypeView & { audience: 'Seller' | 'Buyer' | 'Team' }

/** Retired explorations, kept for reference. Tag each with who the portal view is for. */
const archivedExplorations: ArchivedExploration[] = [
  { label: 'Future v1', href: '/seller/future-v1', audience: 'Seller' },
  { label: 'Timeline Exploration', href: '/seller/timeline-exploration', audience: 'Seller' },
  { label: 'Timeline · 2 column', href: '/seller/timeline-columns', audience: 'Seller' },
  { label: 'Timeline first A · Tracker rail', href: '/seller/timeline-first-a', audience: 'Seller' },
  { label: 'Timeline first B · Agenda', href: '/seller/timeline-first-b', audience: 'Seller' },
  { label: 'Timeline first C · Calendar', href: '/seller/timeline-first-c', audience: 'Seller' },
  { label: 'Polestar Style Exploration', href: '/seller/future-v1-polestar', audience: 'Seller' },
]

const resources = [
  {
    title: 'Client portal PRD',
    description: 'Product requirements and direction for the client portal.',
    href: 'https://app.clickup.com/8562814/v/dc/85a3y-43077/85a3y-57637',
  },
]

function App() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
  if (currentPath === '/team/preview' || currentPath === '/team/preview/listing') {
    return <ClientPortalPreview buyerPortal={<MvpBuyerPortal readOnly />} />
  }
  if (currentPath === '/team' || currentPath.startsWith('/team/')) return <TeamPortal />
  if (currentPath === '/seller') return <SellerPortal transaction={currentSellerTransaction} documentRows listingPerformanceTabs defaultHeader="light-compact" headerPreparation />
  if (currentPath === '/seller/listing') return <SellerPortal transaction={currentSellerTransaction} documentRows listingPerformanceTabs defaultHeader="light-compact" headerPreparation initialListingOpen />
  if (currentPath === '/seller/future-v1') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/future-v1" />
  }
  if (currentPath === '/seller/future-v1/listing') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/future-v1" initialListingOpen />
  }
  if (currentPath === '/seller/future-v1-polestar') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} basePath="/seller/future-v1-polestar" visualTheme="polestar" />
  }
  if (currentPath === '/seller/future-v1-polestar/listing') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} basePath="/seller/future-v1-polestar" visualTheme="polestar" initialListingOpen />
  }
  if (currentPath === '/seller/timeline-columns') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/timeline-columns" layout="timeline-columns" />
  }
  if (currentPath === '/seller/timeline-columns/listing') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/timeline-columns" layout="timeline-columns" initialListingOpen />
  }
  if (currentPath === '/seller/timeline-exploration') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/timeline-exploration" layout="timeline" />
  }
  if (currentPath === '/seller/timeline-exploration/listing') {
    return <SellerPortal transaction={futureSellerTransaction} marketingSnapshot={futureMarketingSnapshot} marketActivity={sampleMarketActivity} basePath="/seller/timeline-exploration" layout="timeline" initialListingOpen />
  }
  if (currentPath === '/seller/timeline-first-a') return <TimelineFirstPortal direction="a" />
  if (currentPath === '/seller/timeline-first-b') return <TimelineFirstPortal direction="b" />
  if (currentPath === '/seller/timeline-first-c') return <TimelineFirstPortal direction="c" />
  if (currentPath === '/seller/v1-iteration2') return <TimelineFirstPortal direction="c2" />
  if (currentPath === '/transactions') return <TransactionsIndex />
  if (currentPath === '/profile') return <ClientProfile />
  if (currentPath === '/components') return <ComponentGallery />
  if (currentPath === '/buyer') return <MvpBuyerPortal />
  if (currentPath === '/buyer/v1-iteration2') return <BuyerPortal />
  if (currentPath === '/seller/future-vision') {
    return <UpcomingPage eyebrow="Seller transaction" title="Future Vision" description="A space for the next direction of the seller portal." />
  }
  if (currentPath === '/email-templates') {
    return <EmailGallery />
  }
  return <SandboxGallery />
}

function SandboxGallery() {
  return (
    <Box className="presentation-dark" sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        component="header"
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: 72 }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Typography variant="titleS">
                PLACE
              </Typography>
              <Box aria-hidden="true" sx={{ width: '1px', height: 20, bgcolor: 'divider' }} />
              <Typography variant="bodySStandard" color="text.secondary">
                Client portal
              </Typography>
            </Stack>
            <Chip
              label="Prototype environment"
              size="small"
              variant="outlined"
              sx={{ borderColor: 'divider', color: 'text.secondary' }}
            />
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" component="main">
        <Box
          component="section"
          aria-labelledby="page-title"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 240px' },
            gap: { xs: 5, md: 10 },
            alignItems: 'end',
            py: { xs: 8, md: 13 },
          }}
        >
          <Stack spacing={2.5} sx={{ maxWidth: 760 }}>
            <Typography
              variant="labelS"
              color="text.secondary"
              sx={{ textTransform: 'uppercase' }}
            >
              Place · Product sandbox
            </Typography>
            <Typography
              id="page-title"
              variant="displayL"
              sx={{
                textWrap: 'balance',
                fontSize: { xs: typographyTokens.displayS.fontSize, md: typographyTokens.displayL.fontSize },
                lineHeight: { xs: typographyTokens.displayS.lineHeight, md: typographyTokens.displayL.lineHeight },
                letterSpacing: { xs: typographyTokens.displayS.letterSpacing, md: typographyTokens.displayL.letterSpacing },
              }}
            >
              PLACE Client Portal Sandbox
            </Typography>
            <Typography
              variant="bodyMStandard"
              color="text.secondary"
              sx={{ maxWidth: 684, textWrap: 'pretty' }}
            >
              Explore early ideas for the PLACE client portal. This is a working space for designers
              to shape a clearer, more considered transaction experience. Start from the quick links
              below in the "latest pages" section, or access all views via the "Portal Views" section.
            </Typography>
            <Typography variant="labelS" color="text.secondary">
              Last updated {lastUpdated}
            </Typography>
          </Stack>
        </Box>

        <Box component="section" aria-labelledby="resources-title" sx={{ pb: { xs: 8, md: 10 } }}>
          <Stack spacing={1} sx={{ mb: 2.5 }}>
            <Typography component="h2" id="resources-title" variant="titleM">
              Resources
            </Typography>
            <Typography variant="bodySStandard" color="text.secondary">
              Reference documents for the work in this gallery.
            </Typography>
          </Stack>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gap: 2 }}>
            {resources.map((resource) => (
              <Box component="li" key={resource.href}>
                <Box
                  component="a"
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    minHeight: 112,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 3,
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 2,
                    bgcolor: 'var(--color-semantic-surface-secondary)',
                    color: 'text.primary',
                    textDecoration: 'none',
                    transition: 'background-color var(--motion-hover)',
                    '&:hover': { bgcolor: 'var(--color-semantic-surface-secondary-dark)' },
                    '&:active': { bgcolor: 'var(--color-semantic-surface-secondary-darkest)' },
                    '&:focus-visible': { outline: 'var(--focus-ring)', outlineOffset: 3 },
                    '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                  }}
                >
                  <Stack spacing={0.75} sx={{ minWidth: 0 }}>
                    <Typography variant="titleS">{resource.title}</Typography>
                    <Typography variant="bodySStandard" color="text.secondary">
                      {resource.description}
                    </Typography>
                  </Stack>
                  <ArrowOutwardOutlined aria-hidden="true" sx={{ fontSize: 22, flexShrink: 0 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" id="destinations" aria-labelledby="destinations-title" sx={{ pb: 6 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ alignItems: { sm: 'baseline' }, justifyContent: 'space-between', mb: 2.5 }}
          >
            <Typography id="destinations-title" variant="titleM">
              Latest Pages
            </Typography>
            <Typography variant="bodySStandard" color="text.secondary">
              A gallery of current and upcoming portal ideas.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
              gap: 2,
            }}
          >
            <DestinationCard page={prototypePages[0]} />
            <Stack spacing={2}>
              {prototypePages.slice(1).map((page) => (
                <DestinationCard key={page.number} page={page} />
              ))}
            </Stack>
          </Box>
        </Box>

        <Box
          component="section"
          aria-labelledby="view-index-title"
          sx={{ borderTop: 1, borderColor: 'divider', pt: { xs: 5, md: 6 }, pb: { xs: 6, md: 8 } }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography component="h2" id="view-index-title" variant="titleM">
              Portal views
            </Typography>
            <Typography variant="bodySStandard" color="text.secondary">
              Explore transaction views and communication templates.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
              gap: { xs: 5, md: 8 },
            }}
          >
            <PrototypeViewGroup title="Seller" items={sellerViews} />
            <PrototypeViewGroup title="Buyer" items={buyerViews} />
            <PrototypeViewGroup title="Team" items={teamViews} />
            <PrototypeViewGroup title="Communication" items={[{ label: 'Email templates', href: '/email-templates' }]} />
          </Box>
        </Box>

        <Box
          component="section"
          aria-labelledby="archived-title"
          sx={{ borderTop: 1, borderColor: 'divider', pt: { xs: 5, md: 6 }, pb: { xs: 9, md: 11 } }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography component="h2" id="archived-title" variant="titleM">
              Archived explorations
            </Typography>
            <Typography variant="bodySStandard" color="text.secondary">
              Earlier directions, kept for reference. Each is tagged by who it is for.
            </Typography>
          </Stack>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', maxWidth: 560, borderBottom: 1, borderColor: 'divider' }}>
            {archivedExplorations.map((item) => <ViewLinkRow key={item.label} label={item.label} href={item.href} tag={item.audience} />)}
          </Box>
        </Box>
      </Container>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 2.5 }}>
          <Typography variant="labelS" color="text.secondary">
            PLACE · Client portal design sandbox
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}

function PrototypeViewGroup({ title, items }: { title: 'Seller' | 'Buyer' | 'Team' | 'Communication'; items: PrototypeView[] }) {
  const headingId = `${title.toLowerCase().replace(/\s+/g, "-")}-views-title`

  return (
    <Box component="section" aria-labelledby={headingId} sx={{ minWidth: 0 }}>
      <Typography component="h3" id={headingId} variant="titleS" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {items.length > 0 && (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {items.map((item) => (
            <ViewLinkRow key={item.label} label={item.label} href={item.href} />
          ))}
        </Box>
      )}
    </Box>
  )
}

function ViewLinkRow({ label, href, tag }: { label: string; href: string; tag?: string }) {
  return (
    <Box component="li" sx={{ minWidth: 0, borderTop: 1, borderColor: 'divider' }}>
      <Box
        component="a"
        href={href}
        sx={{
          minHeight: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 1,
          mx: -1,
          color: 'text.primary',
          textDecoration: 'none',
          borderRadius: 1,
          transition: 'background-color var(--motion-hover)',
          '&:hover': { bgcolor: 'var(--color-semantic-surface-secondary)' },
          '&:focus-visible': { outline: 'var(--focus-ring)', outlineOffset: 2 },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <Typography variant="bodyMStandard" sx={{ minWidth: 0 }}>{label}</Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
          {tag && (
            <Typography
              variant="labelS"
              component="span"
              sx={{ px: 1.5, py: 0.5, borderRadius: 999, color: 'var(--color-semantic-text-on-color-primary)', bgcolor: 'var(--color-semantic-surface-reverse-secondary)' }}
            >
              {tag}
            </Typography>
          )}
          <ArrowForwardOutlined aria-hidden="true" sx={{ fontSize: 18 }} />
        </Stack>
      </Box>
    </Box>
  )
}

function UpcomingPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ minHeight: 72, display: 'flex', alignItems: 'center' }}>
          <Box component="a" href="/" sx={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 1.5, color: 'text.primary', textDecoration: 'none', borderRadius: 1, '&:focus-visible': { outline: 'var(--focus-ring)', outlineOffset: 3 } }}>
            <ArrowBackOutlined aria-hidden="true" sx={{ fontSize: 20 }} />
            <Typography variant="titleS">PLACE client portal</Typography>
          </Box>
        </Container>
      </Box>
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 8, md: 13 } }}>
        <Typography variant="labelS" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {eyebrow}
        </Typography>
        <Typography component="h1" variant="displayS" sx={{ maxWidth: 700, mt: 2, textWrap: 'balance' }}>
          {title}
        </Typography>
        <Typography variant="bodyMStandard" color="text.secondary" sx={{ maxWidth: 560, mt: 2, textWrap: 'pretty' }}>
          {description}
        </Typography>
        <Button component="a" href="/" variant="contained" color="primary" sx={{ mt: 4 }}>
          Back to sandbox
        </Button>
      </Container>
    </Box>
  )
}

/** MVP buyer portal: the MVP seller page, showing the home being bought. Post-contract only. */
function MvpBuyerPortal({ readOnly = false }: { readOnly?: boolean }) {
  return <SellerPortal transaction={mvpBuyerTransaction} timeline={mvpBuyerTimeline} side="buyer" basePath="/buyer" documentRows defaultHeader="light-compact" readOnly={readOnly} showReviewTools={false} />
}

function DestinationCard({ page }: { page: PrototypePage }) {
  return (
    <Paper
      component="a"
      href={page.href}
      aria-labelledby={`destination-title-${page.number}`}
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: page.featured ? { xs: 290, md: 376 } : 180,
        p: { xs: 2.5, md: page.featured ? 3.5 : 2.75 },
        bgcolor: 'var(--color-semantic-surface-secondary)',
        borderRadius: 2,
        color: 'text.primary',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'background-color var(--motion-hover)',
        '&:hover': { bgcolor: 'var(--color-semantic-surface-secondary-dark)' },
        '&:active': { bgcolor: 'var(--color-semantic-surface-secondary-darkest)' },
        '&:focus-visible': { outline: 'var(--focus-ring)', outlineOffset: 3 },
        '&:hover .destination-card-arrow, &:focus-visible .destination-card-arrow': {
          transform: 'translateX(3px)',
          color: 'text.primary',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
          '& .destination-card-arrow': { transition: 'none' },
        },
      }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', color: 'text.secondary' }}
      >
        <Typography variant="labelS" sx={{ textTransform: 'uppercase' }}>
          {page.number} / Prototype
        </Typography>
        <Box sx={{ display: 'grid', placeItems: 'center', '& svg': { fontSize: 22 } }}>
          {page.icon}
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mt: 5 }}>
        <Stack spacing={1.25} sx={{ minWidth: 0 }}>
          <Typography component="h3" id={`destination-title-${page.number}`} variant={page.featured ? 'titleM' : 'titleS'}>
            {page.title}
          </Typography>
          <Typography
            variant="bodySStandard"
            color="text.secondary"
            sx={{ maxWidth: 470, textWrap: 'pretty' }}
          >
            {page.description}
          </Typography>
          {page.featured ? (
            <Box
              component="span"
              sx={{
                alignSelf: 'flex-start',
                minHeight: 44,
                display: 'inline-flex',
                alignItems: 'center',
                px: 2.5,
                mt: 1,
                borderRadius: 999,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }}
            >
              <Typography variant="labelM">{page.actionLabel}</Typography>
            </Box>
          ) : page.actionLabel && (
            <Typography variant="labelM" sx={{ mt: 1 }}>{page.actionLabel}</Typography>
          )}
        </Stack>
        <ArrowForwardOutlined
          className="destination-card-arrow"
          aria-hidden="true"
          sx={{ fontSize: 22, flexShrink: 0, color: 'text.secondary', transition: 'transform 160ms ease, color 160ms ease' }}
        />
      </Box>
    </Paper>
  )
}

export default App
