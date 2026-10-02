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
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import OtherHousesOutlined from '@mui/icons-material/OtherHousesOutlined'
import { typographyTokens } from './design-tokens'
import { ComponentGallery } from './component-gallery/ComponentGallery'
import { SellerPortal } from './seller-portal/SellerPortal'

type PrototypePage = {
  number: string
  title: string
  description: string
  actionLabel: string
  icon: ReactNode
  featured?: boolean
  href: string
}

const prototypePages: PrototypePage[] = [
  {
    number: '01',
    title: 'Latest seller portal',
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
    actionLabel: 'Open gallery',
    icon: <AutoStoriesOutlined />,
    href: '/components',
  },
  {
    number: '03',
    title: 'Latest buyer portal',
    description: 'A steady guide from accepted offer through closing day.',
    actionLabel: 'View buyer preview',
    icon: <HomeOutlined />,
    href: '/buyer',
  },
]

type PrototypeView = {
  label: string
  href: string
}

const sellerViews: PrototypeView[] = [
  { label: 'Current Functionality', href: '/seller' },
  { label: 'Future Vision', href: '/seller/future-vision' },
]

function App() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/'
  if (currentPath === '/seller') return <SellerPortal />
  if (currentPath === '/seller/listing') return <SellerPortal initialListingOpen />
  if (currentPath === '/components') return <ComponentGallery />
  if (currentPath === '/buyer') return <BuyerPortalPreview />
  if (currentPath === '/seller/future-vision') {
    return <UpcomingPage eyebrow="Seller transaction" title="Future Vision" description="A space for the next direction of the seller portal." />
  }
  if (currentPath === '/email-templates') {
    return <UpcomingPage eyebrow="Communications" title="Email templates" description="The portal’s email and communication templates will live together here." />
  }
  return <SandboxGallery />
}

function SandboxGallery() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
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
              A first look at what’s next.
            </Typography>
            <Typography
              variant="bodyMStandard"
              color="text.secondary"
              sx={{ maxWidth: 570, textWrap: 'pretty' }}
            >
              Explore early ideas for the PLACE client portal. This is a working space for shaping
              a clearer, more considered transaction experience.
            </Typography>
          </Stack>
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
          sx={{ borderTop: 1, borderColor: 'divider', pt: { xs: 5, md: 6 }, pb: { xs: 9, md: 11 } }}
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
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: { xs: 5, md: 8 },
            }}
          >
            <PrototypeViewGroup title="Seller" items={sellerViews} />
            <PrototypeViewGroup title="Buyer" items={[]} />
            <PrototypeViewGroup title="Communication" items={[{ label: 'Email templates', href: '/email-templates' }]} />
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

function PrototypeViewGroup({ title, items }: { title: 'Seller' | 'Buyer' | 'Communication'; items: PrototypeView[] }) {
  const headingId = `${title.toLowerCase()}-views-title`

  return (
    <Box component="section" aria-labelledby={headingId} sx={{ minWidth: 0 }}>
      <Typography component="h3" id={headingId} variant="titleS" sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      {items.length > 0 && (
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {items.map((item) => (
            <Box component="li" key={item.label} sx={{ minWidth: 0, borderTop: 1, borderColor: 'divider' }}>
              <Box
                component="a"
                href={item.href}
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
                  transition: 'background-color 150ms ease',
                  '&:hover': { bgcolor: 'var(--color-semantic-surface-secondary)' },
                  '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 2 },
                  '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                }}
              >
                <Typography variant="bodyMStandard">{item.label}</Typography>
                <ArrowForwardOutlined aria-hidden="true" sx={{ fontSize: 18, flexShrink: 0 }} />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}

function UpcomingPage({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ minHeight: 72, display: 'flex', alignItems: 'center' }}>
          <Box component="a" href="/" sx={{ minHeight: 44, display: 'inline-flex', alignItems: 'center', gap: 1.5, color: 'text.primary', textDecoration: 'none', borderRadius: 1, '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 } }}>
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

function BuyerPortalPreview() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box component="header" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ minHeight: 72, display: 'flex', alignItems: 'center' }}>
          <Box
            component="a"
            href="/"
            sx={{
              minHeight: 44,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              color: 'text.primary',
              textDecoration: 'none',
              borderRadius: 1,
              '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 },
            }}
          >
            <ArrowBackOutlined aria-hidden="true" sx={{ fontSize: 20 }} />
            <Typography variant="titleS">PLACE client portal</Typography>
          </Box>
        </Container>
      </Box>
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 8, md: 13 } }}>
        <Typography variant="labelS" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Buyer transaction
        </Typography>
        <Typography component="h1" variant="displayS" sx={{ maxWidth: 700, mt: 2, textWrap: 'balance' }}>
          Buyer portal
        </Typography>
        <Typography variant="bodyMStandard" color="text.secondary" sx={{ maxWidth: 560, mt: 2, textWrap: 'pretty' }}>
          The buyer prototype is taking shape. This view will bring the path from accepted offer to closing into one clear place.
        </Typography>
        <Button component="a" href="/" variant="contained" color="primary" sx={{ mt: 4 }}>
          Back to sandbox
        </Button>
      </Container>
    </Box>
  )
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
        transition: 'background-color 160ms ease',
        '&:hover': { bgcolor: 'var(--color-semantic-surface-secondary-dark)' },
        '&:active': { bgcolor: 'var(--color-semantic-surface-secondary-darkest)' },
        '&:focus-visible': { outline: '2px solid var(--color-semantic-stroke-primary-dark)', outlineOffset: 3 },
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
          ) : (
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
