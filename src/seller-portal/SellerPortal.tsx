/* design-build · self-critique: Clarity4 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useRef, useState } from 'react'
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
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import {
  sampleSellerTransaction,
  type AdvertisingEvent,
  type SellerTransaction,
  type ShowingFeedback,
  type TeamNote,
  type TimelineEvent,
  type TransactionDocument,
  type TransactionTask,
  type UpcomingDate,
} from './sellerTransaction'
import { ListingDetailsSheet } from './ListingDetailsSheet'
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
import { CardActionButton } from '../components/CardActionButton'
import './seller-portal.css'

type SellerPortalProps = {
  transaction?: SellerTransaction
  initialListingOpen?: boolean
  basePath?: string
}

export type PortalTab = 'activity' | 'tasks' | 'advertising' | 'feedback' | 'notes' | 'details' | 'documents'

export const portalTabs: Array<{ id: PortalTab; label: string }> = [
  { id: 'activity', label: 'Activity' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'advertising', label: 'Advertising' },
  { id: 'feedback', label: 'Showing feedback' },
  { id: 'notes', label: 'Notes' },
  { id: 'details', label: 'Details' },
  { id: 'documents', label: 'Documents' },
]

export function SellerPortal({ transaction = sampleSellerTransaction, initialListingOpen = false, basePath = '/seller' }: SellerPortalProps) {
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
  const [listingOpen, setListingOpen] = useState(initialListingOpen)
  const listingReturnUrl = useRef(basePath)
  const listing = transaction.listing
  const listingPath = `${basePath.replace(/\/$/, '')}/listing`
  const address = `${listing.address}, ${listing.city}, ${listing.state} ${listing.postalCode}`

  useEffect(() => {
    const target = window.location.hash.slice(1)
    if (target === 'transaction-information' || target === 'people') {
      document.getElementById(target)?.scrollIntoView()
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

  function showAllActivity() {
    selectTab('activity')
    requestAnimationFrame(() => {
      document.getElementById('transaction-information')?.scrollIntoView({ block: 'start' })
      document.getElementById('seller-tab-activity')?.focus({ preventScroll: true })
    })
  }

  return (
    <Box className="seller-portal">
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
        <ListingOverview transaction={transaction} address={address} onSeeListing={openListing} />

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

        <Box className="transaction-lower-grid">
          <PeopleSection team={transaction.team} viewers={transaction.viewers} brand={transaction.teamBrand} value={activePeopleTab} onChange={selectPeopleTab} />

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
              {activeTab === 'advertising' && <AdvertisingPanel events={transaction.advertising} />}
              {activeTab === 'feedback' && <FeedbackPanel feedback={transaction.feedback} />}
              {activeTab === 'notes' && <NotesPanel notes={transaction.notes} />}
              {activeTab === 'details' && <DetailsPanel transaction={transaction} />}
              {activeTab === 'documents' && (
                <DocumentsPanel documents={transaction.documents} onOpen={setSelectedDocument} />
              )}
            </Box>
          </Box>
        </Box>
      </Container>

      <ListingDetailsSheet open={listingOpen} onClose={closeListing} transaction={transaction} />

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

function ListingOverview({ transaction, address, onSeeListing }: { transaction: SellerTransaction; address: string; onSeeListing: () => void }) {
  const { listing } = transaction
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)

  return (
    <Paper component="section" aria-label="Listing overview" className="listing-overview">
      <Box className="listing-photo">
        {listing.photoUrl ? (
          <Box component="img" src={listing.photoUrl} alt={`Listing at ${address}`} className="listing-image" />
        ) : (
          <Stack spacing={1} sx={{ alignItems: 'center' }} className="photo-placeholder-content">
            <ImageOutlined />
            <Typography variant="labelS">Listing photo</Typography>
            <Typography variant="labelS" color="text.secondary">Sample image to be added</Typography>
          </Stack>
        )}
      </Box>
      <Box className="listing-summary">
        <Box className="listing-summary-header">
          <Typography variant="labelS" className="eyebrow">Seller transaction</Typography>
          <Box
            component="img"
            src={transaction.teamBrand.logoUrl}
            alt={transaction.teamBrand.name}
            className="listing-team-logo"
          />
        </Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }} className="listing-statuses">
          <Chip
            label={listing.status}
            size="small"
            icon={<HomeOutlined />}
            className="status-chip"
          />
          <Chip
            label={listing.published ? 'Published' : 'Not published'}
            size="small"
            variant="outlined"
            className="published-chip"
          />
        </Stack>
        <Typography variant="titleL" component="h1" className="listing-address">{listing.address}</Typography>
        <Typography variant="bodySStandard" color="text.secondary" className="listing-location">
          {listing.city}, {listing.state} {listing.postalCode}
        </Typography>
        <Box className="listing-feature-footer">
          {leadAgent && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Avatar src={leadAgent.photoUrl} alt={leadAgent.name} className="listing-agent-avatar">
                {leadAgent.initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="labelS" className="people-kicker">Your listing agent</Typography>
                <Typography variant="titleXS" className="listing-agent-name">{leadAgent.name}</Typography>
              </Box>
            </Stack>
          )}
          <Button onClick={onSeeListing} variant="contained" className="listing-detail-link">
            See Listing
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

function ActivityPanel({ events }: { events: TimelineEvent[] }) {
  return (
    <Box component="section" aria-label="Activity history" className="portal-tab-content">
      <TimelineEventsList events={events} />
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
    <PortalSection
      title="Upcoming Dates"
      prominent
      action={<CardActionButton onClick={onSeeAll}>See all</CardActionButton>}
    >
      <UpcomingDatesList dates={nextDates} />
    </PortalSection>
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
      <TransactionRowList>
        {tasks.map((task) => <TaskRow key={task.id} task={task} />)}
      </TransactionRowList>
    </Box>
  )
}

function AdvertisingPanel({ events }: { events: AdvertisingEvent[] }) {
  return (
    <Box component="section" aria-label="Advertising activity" className="portal-tab-content">
      <TransactionRowList>
        {events.map((event) => <AdvertisingRow key={event.id} event={event} />)}
      </TransactionRowList>
    </Box>
  )
}

function FeedbackPanel({ feedback }: { feedback: ShowingFeedback[] }) {
  return (
    <Box component="section" aria-label="Showing feedback" className="portal-tab-content">
      <TransactionRowList>
        {feedback.map((item) => <ShowingFeedbackRow key={item.id} feedback={item} />)}
      </TransactionRowList>
    </Box>
  )
}

function NotesPanel({ notes }: { notes: TeamNote[] }) {
  return (
    <Box component="section" aria-label="Team notes" className="portal-tab-content">
      <Stack className="notes-list" spacing={2}>
        {notes.map((note) => <TeamNoteCard key={note.id} note={note} />)}
      </Stack>
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
      <TransactionRowList>
        {documents.map((document) => <DocumentRow key={document.id} document={document} onPreview={onOpen} />)}
      </TransactionRowList>
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
