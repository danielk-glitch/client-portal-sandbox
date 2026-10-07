/* design-build · self-critique: Clarity5 Warmth4 Restraint4 Craft4 Variety5 SlopFree5 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import {
  sampleSellerTransaction,
  type SellerTransaction,
  type TeamNote,
  type TimelineEvent,
  type TransactionDocument,
  type TransactionTask,
  type UpcomingDate,
} from './sellerTransaction'
import { ListingDetailsSheet } from './ListingDetailsSheet'
import { ListingOverview, type ListingOverviewVariant } from './ListingOverview'
import { MarketingSnapshot, type MarketingSnapshotData } from './MarketingSnapshot'
import { marketingFeedbackLayouts, type MarketingFeedbackLayout } from './marketingFeedbackLayouts'
import { MarketingDashboardSheet, type MarketingDashboardSection } from './MarketingDashboardSheet'
import {
  ActivityEventRow,
  ActivityPanel,
  DateEventList,
  DateEventRow,
  DetailGrid,
  DocumentRow,
  PeopleSection,
  PaginatedTabList,
  PortalIconBadge,
  PortalFooter,
  PortalSection,
  TaskRow,
  TeamNoteCard,
  TransactionRowList,
  type PeopleTab,
} from '../transaction-portal/components'
import { CardActionButton } from '../components/CardActionButton'
import './seller-portal.css'

type SellerPortalProps = {
  transaction?: SellerTransaction
  marketingSnapshot?: MarketingSnapshotData
  initialListingOpen?: boolean
  basePath?: string
}

export type PortalTab = 'activity' | 'tasks' | 'notes' | 'details' | 'documents'

export const portalTabs: Array<{ id: PortalTab; label: string }> = [
  { id: 'activity', label: 'Activity' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notes', label: 'Notes' },
  { id: 'details', label: 'Details' },
  { id: 'documents', label: 'Documents' },
]

export function SellerPortal({ transaction = sampleSellerTransaction, marketingSnapshot, initialListingOpen = false, basePath = '/seller' }: SellerPortalProps) {
  const portalRef = useRef<HTMLDivElement>(null)
  const [headerVariant, setHeaderVariant] = useState<ListingOverviewVariant>(() => {
    const requestedHeader = new URLSearchParams(window.location.search).get('header')
    if (requestedHeader === 'card' || requestedHeader === 'full') return requestedHeader
    return 'full'
  })
  const [designPanelAnchor, setDesignPanelAnchor] = useState<HTMLElement | null>(null)
  const [feedbackLayout, setFeedbackLayout] = useState<MarketingFeedbackLayout>(() => {
    const requestedLayout = new URLSearchParams(window.location.search).get('feedback')
    return marketingFeedbackLayouts.find((layout) => layout.id === requestedLayout)?.id ?? 'current'
  })
  const [activeTab, setActiveTab] = useState<PortalTab>(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('section')
    if (requestedTab === 'timeline') return 'activity'
    return portalTabs.find((tab) => tab.id === requestedTab)?.id ?? 'activity'
  })
  const [activePeopleTab, setActivePeopleTab] = useState<PeopleTab>(() =>
    new URLSearchParams(window.location.search).get('people') === 'viewers' ? 'viewers' : 'team',
  )
  const [selectedDocument, setSelectedDocument] = useState<TransactionDocument | null>(null)
  const [datesDrawerOpen, setDatesDrawerOpen] = useState(false)
  const [marketingDashboardSection, setMarketingDashboardSection] = useState<MarketingDashboardSection | null>(() => {
    const requestedDetail = new URLSearchParams(window.location.search).get('marketing')
    if (requestedDetail === 'advertising' || requestedDetail === 'activity') return 'activity'
    return requestedDetail === 'overview' || requestedDetail === 'materials' || requestedDetail === 'feedback' ? requestedDetail : null
  })
  const [listingOpen, setListingOpen] = useState(initialListingOpen)
  const listingReturnUrl = useRef(basePath)
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const listingPath = `${basePath.replace(/\/$/, '')}/listing`

  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const blocks = portalRef.current?.querySelectorAll<HTMLElement>(
      '.portal-main > .listing-overview, .priority-grid > .portal-section, .priority-grid > .upcoming-dates-card, .portal-main > .marketing-snapshot, .transaction-lower-grid > .people-section, .transaction-lower-grid > .transaction-sections, .portal-footer',
    )
    if (!blocks) return

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const block = entry.target as HTMLElement
        block.dataset.portalEntrance = 'visible'
        observer.unobserve(block)
      }
    }, { threshold: 0.05 })

    for (const block of blocks) {
      if (block.dataset.portalEntrance === 'visible') continue
      block.dataset.portalEntrance = 'pending'
      observer.observe(block)
    }

    return () => observer.disconnect()
  }, [marketingSnapshot])

  useEffect(() => {
    const target = window.location.hash.slice(1)
    if (target === 'transaction-information' || target === 'people') {
      document.getElementById(target)?.scrollIntoView()
    }
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    const section = url.searchParams.get('section')
    if (section && !portalTabs.some((tab) => tab.id === section)) {
      url.searchParams.delete('section')
      window.history.replaceState(null, '', url)
    }
  }, [])

  useEffect(() => {
    function syncListingRoute() {
      setListingOpen(window.location.pathname.replace(/\/$/, '') === listingPath)
    }

    window.addEventListener('popstate', syncListingRoute)
    return () => window.removeEventListener('popstate', syncListingRoute)
  }, [listingPath])

  function openListing() {
    listingReturnUrl.current = `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.history.pushState(null, '', listingPath)
    setListingOpen(true)
  }

  function closeListing() {
    window.history.replaceState(null, '', listingReturnUrl.current)
    setListingOpen(false)
  }

  function selectTab(value: PortalTab) {
    setActiveTab(value)
    const url = new URL(window.location.href)
    url.searchParams.set('section', value)
    window.history.replaceState(null, '', url)
  }

  function selectPeopleTab(value: PeopleTab) {
    setActivePeopleTab(value)
    const url = new URL(window.location.href)
    url.searchParams.set('people', value)
    window.history.replaceState(null, '', url)
  }

  function selectHeaderVariant(value: ListingOverviewVariant) {
    setHeaderVariant(value)
    const url = new URL(window.location.href)
    if (value === 'card') url.searchParams.set('header', 'card')
    else url.searchParams.delete('header')
    window.history.replaceState(null, '', url)
  }

  function selectFeedbackLayout(value: MarketingFeedbackLayout) {
    setFeedbackLayout(value)
    const url = new URL(window.location.href)
    if (value === 'current') url.searchParams.delete('feedback')
    else url.searchParams.set('feedback', value)
    window.history.replaceState(null, '', url)
  }

  function showAllActivity() {
    selectTab('activity')
    requestAnimationFrame(() => {
      document.getElementById('transaction-information')?.scrollIntoView({ block: 'start' })
      document.getElementById('seller-tab-activity')?.focus({ preventScroll: true })
    })
  }

  function closeMarketingDetail() {
    setMarketingDashboardSection(null)
    const url = new URL(window.location.href)
    if (url.searchParams.has('marketing')) {
      url.searchParams.delete('marketing')
      window.history.replaceState(null, '', url)
    }
  }

  return (
    <Box className="seller-portal" ref={portalRef}>
      <Box component="header" className="portal-topbar">
        <Container maxWidth="xl" className="portal-topbar-inner">
          <Box component="a" href="/" className="portal-brand-link" aria-label="PLACE client portal home">
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Typography className="place-wordmark">PLACE</Typography>
              <Box className="topbar-divider" />
              <Typography variant="bodySStandard" color="text.secondary">Client portal</Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip label="Design preview" size="small" variant="outlined" className="preview-chip" />
            <Avatar className="account-avatar">TB</Avatar>
            <Box className="account-name">
              <Typography variant="labelM">Tim Bennett</Typography>
              <Typography variant="labelS" color="text.secondary">Seller</Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" className="portal-main">
        <ListingOverview transaction={transaction} onSeeListing={openListing} variant={headerVariant} />

        <Box className="priority-grid" aria-label="Current transaction activity">
          <PortalSection
            title="Recent activity"
            prominent
            action={<CardActionButton onClick={showAllActivity}>See all</CardActionButton>}
          >
            <TimelineEventsList events={transaction.timeline.slice(0, 3)} />
          </PortalSection>
          <UpcomingDatesPanel dates={transaction.upcomingDates} onSeeAll={() => setDatesDrawerOpen(true)} />
        </Box>

        {marketingSnapshot && (
          <MarketingSnapshot
            data={marketingSnapshot}
            feedback={transaction.feedback}
            feedbackLayout={feedbackLayout}
            onOpenDashboard={() => setMarketingDashboardSection('overview')}
            onViewFeedback={() => setMarketingDashboardSection('feedback')}
          />
        )}

        <Box className="transaction-lower-grid">
          <PeopleSection team={transaction.team} viewers={transaction.viewers} value={activePeopleTab} onChange={selectPeopleTab} />

          <Box id="transaction-information" className="transaction-sections">
            <Box component="nav" aria-label="Transaction sections" className="portal-section-nav">
              <Tabs
                value={activeTab}
                onChange={(_, value: PortalTab) => selectTab(value)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="Transaction information"
              >
                {portalTabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    id={`seller-tab-${tab.id}`}
                    aria-controls={`seller-panel-${tab.id}`}
                    value={tab.id}
                    label={tab.label}
                  />
                ))}
              </Tabs>
            </Box>

            <Box
              role="tabpanel"
              id={`seller-panel-${activeTab}`}
              aria-labelledby={`seller-tab-${activeTab}`}
              className="portal-panel"
            >
              {activeTab === 'activity' && <ActivityPanel events={transaction.timeline} />}
              {activeTab === 'tasks' && <TasksPanel tasks={transaction.tasks} />}
              {activeTab === 'notes' && <NotesPanel notes={transaction.notes} />}
              {activeTab === 'details' && <DetailsPanel transaction={transaction} />}
              {activeTab === 'documents' && (
                <DocumentsPanel documents={transaction.documents} onOpen={setSelectedDocument} />
              )}
            </Box>
          </Box>
        </Box>
      </Container>

      <PortalFooter agent={leadAgent} brand={transaction.teamBrand} />

      <Button
        variant="contained"
        startIcon={<TuneOutlined />}
        className="design-panel-trigger"
        onClick={(event) => setDesignPanelAnchor(event.currentTarget)}
        aria-label="Open design panel"
        aria-haspopup="dialog"
        aria-expanded={Boolean(designPanelAnchor)}
        aria-controls={designPanelAnchor ? 'seller-design-panel' : undefined}
      >
        <Box component="span" className="design-panel-trigger-label">Design panel</Box>
      </Button>

      <Popover
        id="seller-design-panel"
        open={Boolean(designPanelAnchor)}
        anchorEl={designPanelAnchor}
        onClose={() => setDesignPanelAnchor(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        disableScrollLock
        slotProps={{ paper: { className: 'design-panel-paper', role: 'dialog', 'aria-label': 'Design panel' } }}
      >
        <Box className="design-panel-header">
          <Box>
            <Typography component="h2" variant="titleS">Design panel</Typography>
            <Typography variant="bodySStandard" color="text.secondary">Preview page layouts</Typography>
          </Box>
          <IconButton onClick={() => setDesignPanelAnchor(null)} aria-label="Close design panel">
            <CloseOutlined />
          </IconButton>
        </Box>
        <Box className="design-panel-content">
          <Box className="design-panel-option-section">
            <Typography component="h3" variant="titleXS" id="header-layout-label">Header layout</Typography>
            <RadioGroup aria-labelledby="header-layout-label" value={headerVariant} onChange={(event) => selectHeaderVariant(event.target.value as ListingOverviewVariant)}>
              <FormControlLabel value="card" control={<Radio />} label="Card" />
              <FormControlLabel value="full" control={<Radio />} label="Full width" />
            </RadioGroup>
          </Box>
          {marketingSnapshot && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="feedback-layout-label">Showing feedback layout</Typography>
              <RadioGroup aria-labelledby="feedback-layout-label" value={feedbackLayout} onChange={(event) => selectFeedbackLayout(event.target.value as MarketingFeedbackLayout)}>
                {marketingFeedbackLayouts.map((layout) => <FormControlLabel key={layout.id} value={layout.id} control={<Radio />} label={layout.label} />)}
              </RadioGroup>
            </Box>
          )}
        </Box>
      </Popover>

      <ListingDetailsSheet open={listingOpen} onClose={closeListing} transaction={transaction} />

      {marketingSnapshot && (
        <MarketingDashboardSheet
          open={marketingDashboardSection !== null}
          onClose={closeMarketingDetail}
          initialSection={marketingDashboardSection ?? 'overview'}
          transaction={transaction}
          data={marketingSnapshot}
        />
      )}

      <Drawer
        anchor="right"
        open={datesDrawerOpen}
        onClose={() => setDatesDrawerOpen(false)}
        slotProps={{ paper: { className: 'dates-drawer-paper' } }}
      >
        <Box className="dates-drawer-header">
          <Box>
            <Typography component="h2" variant="titleS">Transaction dates</Typography>
            <Typography variant="bodySStandard" color="text.secondary">
              Key dates and activity for your sale
            </Typography>
          </Box>
          <IconButton onClick={() => setDatesDrawerOpen(false)} aria-label="Close transaction dates" className="dates-drawer-close">
            <CloseOutlined />
          </IconButton>
        </Box>
        <Box className="dates-drawer-content">
          <Box component="section" aria-labelledby="all-upcoming-dates-title" className="dates-drawer-section">
            <Typography component="h3" variant="titleXS" id="all-upcoming-dates-title" className="dates-drawer-section-title">
              Upcoming dates
            </Typography>
            <UpcomingDatesList dates={transaction.upcomingDates} />
          </Box>
          <Divider />
          <Box component="section" aria-labelledby="past-events-title" className="dates-drawer-section">
            <Typography component="h3" variant="titleXS" id="past-events-title" className="dates-drawer-section-title">
              Past events
            </Typography>
            <PastEventsList events={transaction.timeline} />
          </Box>
        </Box>
      </Drawer>

      <Dialog open={selectedDocument !== null} onClose={() => setSelectedDocument(null)} fullWidth maxWidth="sm">
        {selectedDocument && (
          <>
            <DialogTitle className="document-dialog-title">
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <PortalIconBadge><InsertDriveFileOutlined /></PortalIconBadge>
                <Box>
                  <Typography variant="titleXS">{selectedDocument.name}</Typography>
                  <Typography variant="labelS" color="text.secondary">{selectedDocument.category}</Typography>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box className="document-preview-placeholder">
                  <DescriptionOutlined />
                  <Typography variant="bodySStandard">Document preview</Typography>
                  <Typography variant="labelS" color="text.secondary">
                    Sample document for this design prototype
                  </Typography>
                </Box>
                <Typography variant="bodySStandard" color="text.secondary">
                  {selectedDocument.summary}
                </Typography>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedDocument(null)}>Close preview</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

function TimelineEventsList({ events }: { events: TimelineEvent[] }) {
  return (
    <Box component="ol" className="activity-event-list">
      {events.map((event) => <ActivityEventRow key={event.id} event={event} />)}
    </Box>
  )
}

function UpcomingDatesPanel({ dates, onSeeAll }: { dates: UpcomingDate[]; onSeeAll: () => void }) {
  const nextDates = [...dates].sort((first, second) => first.date.localeCompare(second.date)).slice(0, 3)

  return (
    <Box className="upcoming-dates-card">
      <PortalSection
        title="Upcoming Dates"
        prominent
        action={<CardActionButton onClick={onSeeAll}>See all</CardActionButton>}
      >
        <UpcomingDatesList dates={nextDates} />
      </PortalSection>
    </Box>
  )
}

function UpcomingDatesList({ dates }: { dates: UpcomingDate[] }) {
  return (
    <DateEventList>
      {[...dates].sort((first, second) => first.date.localeCompare(second.date)).map((item) => (
        <DateEventRow key={item.id} date={item.date} title={item.title} description={item.description} />
      ))}
    </DateEventList>
  )
}

function PastEventsList({ events }: { events: TimelineEvent[] }) {
  return (
    <DateEventList>
      {events.map((event) => {
        const [datePart, time] = event.occurredAt.split(' · ')
        const [month, day, year] = datePart.split('/')
        const date = `${year}-${month}-${day}`

        return (
          <DateEventRow key={event.id} date={date} title={event.title} description={event.description}>
            {event.actor} · {time}
          </DateEventRow>
        )
      })}
    </DateEventList>
  )
}

function TasksPanel({ tasks }: { tasks: TransactionTask[] }) {
  return (
    <Box component="section" aria-label="Open tasks" className="portal-tab-content">
      <PaginatedTabList items={tasks} itemName="tasks" ariaLabel="Task pages">
        {(visibleTasks) => (
          <TransactionRowList>
            {visibleTasks.map((task) => <TaskRow key={task.id} task={task} />)}
          </TransactionRowList>
        )}
      </PaginatedTabList>
    </Box>
  )
}

function NotesPanel({ notes }: { notes: TeamNote[] }) {
  return (
    <Box component="section" aria-label="Team notes" className="portal-tab-content">
      <PaginatedTabList items={notes} itemName="notes" ariaLabel="Note pages">
        {(visibleNotes) => (
          <Stack className="notes-list" spacing={2}>
            {visibleNotes.map((note) => <TeamNoteCard key={note.id} note={note} />)}
          </Stack>
        )}
      </PaginatedTabList>
    </Box>
  )
}

function DetailsPanel({ transaction }: { transaction: SellerTransaction }) {
  const { details, listing } = transaction
  return (
    <Box className="details-grid">
      <PortalSection title="Transaction details">
        <DetailGrid rows={[
          { label: 'Publish state', value: listing.published ? 'Published' : 'Not published' },
          { label: 'Status', value: listing.status },
          { label: 'Property type', value: details.propertyType },
          { label: 'Date listed', value: details.dateListed },
          { label: 'Expiration', value: listing.expiration },
          { label: 'MLS number', value: listing.mlsNumber },
          { label: 'Listing price', value: formatCurrency(listing.price) },
          { label: 'Days on market', value: `${listing.daysOnMarket} days` },
          { label: 'Last updated', value: listing.lastUpdated },
        ]} />
      </PortalSection>
      <PortalSection title="Location details">
        <DetailGrid rows={details.location} />
      </PortalSection>
      <PortalSection title="Property details">
        <DetailGrid rows={details.property} />
      </PortalSection>
      <PortalSection title="Marketing details">
        <Box>
          <Typography variant="labelS" color="text.secondary">Listing description</Typography>
          <Typography variant="bodySStandard" className="marketing-copy">{details.listingDescription}</Typography>
        </Box>
      </PortalSection>
      <PortalSection title="Custom dates">
        <DetailGrid rows={details.customDates} />
      </PortalSection>
    </Box>
  )
}

function DocumentsPanel({ documents, onOpen }: { documents: TransactionDocument[]; onOpen: (document: TransactionDocument) => void }) {
  return (
    <Box component="section" aria-label="Transaction documents" className="portal-tab-content">
      <PaginatedTabList items={documents} itemName="documents" ariaLabel="Document pages">
        {(visibleDocuments) => (
          <TransactionRowList>
            {visibleDocuments.map((document) => <DocumentRow key={document.id} document={document} onPreview={onOpen} />)}
          </TransactionRowList>
        )}
      </PaginatedTabList>
    </Box>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
