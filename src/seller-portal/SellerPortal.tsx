/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import InsertDriveFileOutlined from '@mui/icons-material/InsertDriveFileOutlined'
import { brandAssets } from '../assets/brand'
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
import { ListingOverview, type ListingOverviewVariant, type HeaderListingLink } from './ListingOverview'
import { MarketingSnapshot, type MarketingSnapshotData } from './MarketingSnapshot'
import { AdvertisingSnapshot } from './AdvertisingSnapshot'
import { marketingFeedbackLayouts, type MarketingFeedbackLayout } from './marketingFeedbackLayouts'
import { MarketingDashboardSheet, type MarketingDashboardSection } from './MarketingDashboardSheet'
import {
  ResourcesPanel,
  ResourceGuideSheet,
  ActivityEventRow,
  ActivityPanel,
  DateEventList,
  DateEventRow,
  DocumentsPanel,
  DocumentThumbnail,
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
import type { TransactionResource } from '../transaction-portal/types'
import { CardActionButton } from '../components/CardActionButton'
import { ListingPreparation } from './ListingPreparation'
import { createBeforeListingTransaction, readSellerJourneyView, type SellerJourneyView } from '../internal/review/sellerJourneyViews'
import { SellerReviewTools } from '../internal/review/SellerReviewTools'
import { SellerTimeline, type TimelineTransition } from './SellerTimeline'
import { PropertySummaryCard } from './PropertySummaryCard'
import './seller-columns.css'
import { beforeListingTimeline, timelineResources, underContractTimeline, type SellerTimelineData } from './sellerTimelineData'
import './seller-portal.css'
import './seller-polestar.css'

type SellerPortalProps = {
  transaction?: SellerTransaction
  marketingSnapshot?: MarketingSnapshotData
  initialListingOpen?: boolean
  basePath?: string
  visualTheme?: 'polestar'
  readOnly?: boolean
  showReviewTools?: boolean
  /** 'timeline' swaps the dates + activity overview for the milestone timeline exploration. */
  layout?: 'dashboard' | 'timeline' | 'timeline-columns'
}

export type PortalTab = 'activity' | 'tasks' | 'notes' | 'documents' | 'resources'

export const portalTabs: Array<{ id: PortalTab; label: string }> = [
  { id: 'activity', label: 'Activity' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notes', label: 'Notes' },
  { id: 'documents', label: 'Documents' },
  { id: 'resources', label: 'Resources' },
]

export function SellerPortal({ transaction: baseTransaction = sampleSellerTransaction, marketingSnapshot, initialListingOpen = false, basePath = '/seller', visualTheme, readOnly = false, showReviewTools = true, layout = 'dashboard' }: SellerPortalProps) {
  /** Both timeline explorations share the timeline; 'timeline-columns' rearranges the page into two columns. */
  const timelineLayout = layout === 'timeline' || layout === 'timeline-columns'
  const columnsLayout = layout === 'timeline-columns'
  const [journeyView, setJourneyView] = useState(() => readSellerJourneyView(window.location.search))
  const beforeListing = journeyView === 'before-listing'
  const transaction = useMemo(() => {
    const journeyTransaction = beforeListing ? createBeforeListingTransaction(baseTransaction) : baseTransaction
    return timelineLayout ? { ...journeyTransaction, resources: timelineResources } : journeyTransaction
  }, [beforeListing, baseTransaction, timelineLayout])
  const availableTabs = portalTabs.filter((tab) => tab.id !== 'resources' || Boolean(transaction.resources?.length))
  const [selectedResource, setSelectedResource] = useState<TransactionResource | null>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const defaultMarketingLayout = marketingSnapshot?.insights ? 'views' : 'materials'
  const [headerVariant, setHeaderVariant] = useState<ListingOverviewVariant>(() => {
    if (visualTheme === 'polestar') return 'card'
    const requestedHeader = new URLSearchParams(window.location.search).get('header')
    if (requestedHeader === 'card' || requestedHeader === 'full' || requestedHeader === 'light' || requestedHeader === 'light-bottom') return requestedHeader
    return 'light-bottom'
  })
  const [timelineTransition, setTimelineTransition] = useState<TimelineTransition>(() =>
    new URLSearchParams(window.location.search).get('timeline') === 'dark' ? 'dark' : 'divider',
  )
  const [listingLink, setListingLink] = useState<HeaderListingLink>(() =>
    new URLSearchParams(window.location.search).get('listingLink') === 'idx-mvp' ? 'idx-mvp' : 'first-party',
  )
  const [feedbackLayout, setFeedbackLayout] = useState<MarketingFeedbackLayout>(() => {
    const requestedLayout = new URLSearchParams(window.location.search).get('feedback')
    return marketingFeedbackLayouts.find((layout) => layout.id === requestedLayout)?.id ?? 'editorial'
  })
  const [marketingLayout, setMarketingLayout] = useState<'materials' | 'views'>(() => {
    const requestedLayout = new URLSearchParams(window.location.search).get('marketingLayout')
    return requestedLayout === 'views' || requestedLayout === 'materials' ? requestedLayout : defaultMarketingLayout
  })
  const [activeTab, setActiveTab] = useState<PortalTab>(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('section')
    if (requestedTab === 'timeline') return 'activity'
    return availableTabs.find((tab) => tab.id === requestedTab)?.id ?? 'activity'
  })
  const visibleTab = availableTabs.find((tab) => tab.id === activeTab)?.id ?? 'activity'
  const [activePeopleTab, setActivePeopleTab] = useState<PeopleTab>(() =>
    new URLSearchParams(window.location.search).get('people') === 'viewers' ? 'viewers' : 'team',
  )
  const [selectedDocument, setSelectedDocument] = useState<TransactionDocument | null>(null)
  const [datesDrawerOpen, setDatesDrawerOpen] = useState(false)
  const [marketingDashboardSection, setMarketingDashboardSection] = useState<MarketingDashboardSection | null>(() => {
    if (beforeListing) return null
    const requestedDetail = new URLSearchParams(window.location.search).get('marketing')
    if (requestedDetail === 'advertising' || requestedDetail === 'activity') return 'activity'
    return requestedDetail === 'overview' || requestedDetail === 'materials' || requestedDetail === 'feedback' ? requestedDetail : null
  })
  const [listingOpen, setListingOpen] = useState(initialListingOpen)
  const listingReturnUrl = useRef(`${basePath}${window.location.search}${window.location.hash}`)
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const listingPath = `${basePath.replace(/\/$/, '')}/listing`

  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const blocks = portalRef.current?.querySelectorAll<HTMLElement>(
      '.portal-main > .listing-overview, .portal-main > .seller-timeline, .priority-grid > .portal-section, .priority-grid > .upcoming-dates-card, .portal-main > .marketing-snapshot, .transaction-lower-grid > .people-section, .transaction-lower-grid > .transaction-sections, .portal-footer',
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
  }, [marketingSnapshot, journeyView])

  useEffect(() => {
    const target = window.location.hash.slice(1)
    if (target === 'transaction-information' || target === 'people') {
      document.getElementById(target)?.scrollIntoView()
    }
  }, [])

  useEffect(() => {
    const url = new URL(window.location.href)
    const section = url.searchParams.get('section')
    if (section && !portalTabs.some((tab) => tab.id === section && (section !== 'resources' || transaction.resources?.length))) {
      url.searchParams.delete('section')
      window.history.replaceState(null, '', url)
    }
  }, [transaction.resources])

  useEffect(() => {
    function syncListingRoute() {
      setListingOpen(window.location.pathname.replace(/\/$/, '') === listingPath)
      setJourneyView(readSellerJourneyView(window.location.search))
      const params = new URLSearchParams(window.location.search)
      const section = params.get('section')
      setActiveTab(section === 'timeline' ? 'activity' : portalTabs.find((tab) => tab.id === section && (tab.id !== 'resources' || baseTransaction.resources?.length))?.id ?? 'activity')
      setActivePeopleTab(params.get('people') === 'viewers' ? 'viewers' : 'team')
      setMarketingDashboardSection(null)
      setDatesDrawerOpen(false)
      setSelectedDocument(null)
      setSelectedResource(null)
    }

    window.addEventListener('popstate', syncListingRoute)
    return () => window.removeEventListener('popstate', syncListingRoute)
  }, [listingPath, baseTransaction.resources])

  function openListing() {
    listingReturnUrl.current = `${window.location.pathname}${window.location.search}${window.location.hash}`
    window.history.pushState(null, '', `${listingPath}${window.location.search}`)
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

  function selectJourneyView(value: SellerJourneyView) {
    if (value === journeyView) return
    const url = new URL(window.location.href)
    url.pathname = basePath
    url.searchParams.set('view', value)
    url.searchParams.delete('marketing')
    window.history.pushState(null, '', url)
    setJourneyView(value)
    setListingOpen(false)
    setMarketingDashboardSection(null)
    setDatesDrawerOpen(false)
    setSelectedDocument(null)
    setSelectedResource(null)
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
    if (value === 'light-bottom') url.searchParams.delete('header')
    else url.searchParams.set('header', value)
    window.history.replaceState(null, '', url)
  }

  function selectListingLink(value: HeaderListingLink) {
    setListingLink(value)
    const url = new URL(window.location.href)
    if (value === 'first-party') url.searchParams.delete('listingLink')
    else url.searchParams.set('listingLink', value)
    window.history.replaceState(null, '', url)
  }

  function selectTimelineTransition(value: TimelineTransition) {
    setTimelineTransition(value)
    const url = new URL(window.location.href)
    if (value === 'divider') url.searchParams.delete('timeline')
    else url.searchParams.set('timeline', value)
    window.history.replaceState(null, '', url)
  }

  function selectFeedbackLayout(value: MarketingFeedbackLayout) {
    setFeedbackLayout(value)
    const url = new URL(window.location.href)
    if (value === 'editorial') url.searchParams.delete('feedback')
    else url.searchParams.set('feedback', value)
    window.history.replaceState(null, '', url)
  }

  function selectMarketingLayout(value: 'materials' | 'views') {
    setMarketingLayout(value)
    const url = new URL(window.location.href)
    if (value === defaultMarketingLayout) url.searchParams.delete('marketingLayout')
    else url.searchParams.set('marketingLayout', value)
    window.history.replaceState(null, '', url)
  }

  function showAllActivity() {
    selectTab('activity')
    requestAnimationFrame(() => {
      document.getElementById('transaction-information')?.scrollIntoView({ block: 'start' })
      document.getElementById('seller-tab-activity')?.focus({ preventScroll: true })
    })
  }

  function openMilestoneGuide(resourceId: string) {
    const resource = transaction.resources?.find((item) => item.id === resourceId)
    if (resource) setSelectedResource(resource)
  }

  function closeMarketingDetail() {
    setMarketingDashboardSection(null)
    const url = new URL(window.location.href)
    if (url.searchParams.has('marketing')) {
      url.searchParams.delete('marketing')
      window.history.replaceState(null, '', url)
    }
  }


  const timelineData = beforeListing ? beforeListingTimeline : underContractTimeline
  const marketingBlock = !beforeListing && (marketingSnapshot && marketingLayout === 'views' && marketingSnapshot.insights ? (
    <AdvertisingSnapshot
      data={marketingSnapshot.insights}
      feedback={transaction.feedback}
      onOpenDashboard={() => setMarketingDashboardSection('overview')}
    />
  ) : marketingSnapshot && (
    <MarketingSnapshot
      data={marketingSnapshot}
      feedback={transaction.feedback}
      feedbackLayout={feedbackLayout}
      onOpenDashboard={() => setMarketingDashboardSection('overview')}
    />
  ))

  const transactionSections = (
    <Box id="transaction-information" className="transaction-sections">
      <Box component="nav" aria-label="Transaction sections" className="portal-section-nav">
        <Tabs
          value={visibleTab}
          onChange={(_, value: PortalTab) => selectTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Transaction information"
        >
          {availableTabs.map((tab) => (
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
        id={`seller-panel-${visibleTab}`}
        aria-labelledby={`seller-tab-${visibleTab}`}
        className="portal-panel"
      >
        {visibleTab === 'resources' && transaction.resources && <ResourcesPanel resources={transaction.resources} onOpen={setSelectedResource} />}
        {visibleTab === 'activity' && <ActivityPanel events={transaction.timeline} />}
        {visibleTab === 'tasks' && <TasksPanel tasks={transaction.tasks} />}
        {visibleTab === 'notes' && <NotesPanel notes={transaction.notes} />}
        {visibleTab === 'documents' && (
          <DocumentsPanel readOnly={readOnly} key={`${transaction.listing.mlsNumber}:${transaction.viewers[0]?.id}`} storageKey={`place-document-pins:${transaction.listing.mlsNumber}:${transaction.viewers[0]?.id ?? "guest"}`} documents={transaction.documents} onOpen={setSelectedDocument} />
        )}
      </Box>
    </Box>
  )

  return (
    <Box className={`seller-portal${visualTheme === 'polestar' ? ' seller-portal--polestar' : ''}`} ref={portalRef}>
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

      {columnsLayout ? (
        <Container maxWidth="xl" className="portal-main portal-main--columns">
          <Box className="columns-greeting">
            <Box>
              <Typography variant="labelS" className="columns-greeting-date">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${timelineData.today}T12:00:00Z`))}</Typography>
              <Typography component="h1" variant="displayS" className="columns-greeting-title">Good morning, Tim.</Typography>
            </Box>
            <Typography variant="bodySStandard" color="text.secondary" className="columns-greeting-status">Your sale is on track. One item needs your attention.</Typography>
          </Box>

          <Box className="columns-grid">
            <Box component="aside" className="columns-side" aria-label="Your home and team">
              <PropertySummaryCard
                transaction={transaction}
                stage={beforeListing ? 'Preparing to list' : 'Under contract'}
                facts={columnFacts(timelineData)}
                onSeeListing={openListing}
              />
              <PeopleSection team={transaction.team} viewers={transaction.viewers} value={activePeopleTab} onChange={selectPeopleTab} />
            </Box>

            <Box className="columns-main">
              <SellerTimeline
                data={timelineData}
                transition="card"
                resources={transaction.resources ?? []}
                documents={transaction.documents}
                team={transaction.team}
                onOpenResource={setSelectedResource}
                onOpenDocument={setSelectedDocument}
                onOpenMarketing={!beforeListing && marketingSnapshot ? () => setMarketingDashboardSection('overview') : undefined}
              />
              {marketingBlock}
              {transactionSections}
            </Box>
          </Box>
        </Container>
      ) : (
      <Container maxWidth="xl" className="portal-main">
        <ListingOverview transaction={transaction} onSeeListing={openListing} listingLink={listingLink} variant={beforeListing ? 'no-listing' : headerVariant} polestarLayout={visualTheme === 'polestar'} />

        {beforeListing && transaction.clientMessage && <ListingPreparation message={transaction.clientMessage} />}

        {timelineLayout ? (
          <SellerTimeline
            data={timelineData}
            transition={timelineTransition}
            resources={transaction.resources ?? []}
            documents={transaction.documents}
            team={transaction.team}
            onOpenResource={setSelectedResource}
            onOpenDocument={setSelectedDocument}
            onOpenMarketing={!beforeListing && marketingSnapshot ? () => setMarketingDashboardSection('overview') : undefined}
          />
        ) : <Box className="priority-grid" aria-label="Current transaction activity">
          <UpcomingDatesPanel dates={transaction.upcomingDates} resources={transaction.resources} onSeeAll={() => setDatesDrawerOpen(true)} onReadGuide={openMilestoneGuide} />
          <PortalSection
            title="Recent activity"
            prominent
            action={<CardActionButton onClick={showAllActivity}>See all</CardActionButton>}
          >
            <TimelineEventsList events={transaction.timeline.slice(0, 3)} />
          </PortalSection>
        </Box>}

        {marketingBlock}

        <Box className="transaction-lower-grid">
          <PeopleSection team={transaction.team} viewers={transaction.viewers} value={activePeopleTab} onChange={selectPeopleTab} />

          {transactionSections}
        </Box>
      </Container>
      )}

      <PortalFooter agent={leadAgent} brand={transaction.teamBrand} />

      {showReviewTools && <SellerReviewTools
        journeyView={journeyView}
        selectJourneyView={selectJourneyView}
        beforeListing={beforeListing}
        visualTheme={visualTheme}
        marketingSnapshot={marketingSnapshot}
        listingLink={listingLink}
        selectListingLink={selectListingLink}
        headerVariant={headerVariant}
        selectHeaderVariant={selectHeaderVariant}
        marketingLayout={marketingLayout}
        selectMarketingLayout={selectMarketingLayout}
        feedbackLayout={feedbackLayout}
        selectFeedbackLayout={selectFeedbackLayout}
        timelineTransition={timelineLayout && !columnsLayout ? timelineTransition : undefined}
        selectTimelineTransition={selectTimelineTransition}
      />}

      <ListingDetailsSheet open={listingOpen} onClose={closeListing} transaction={transaction} />

      {!beforeListing && marketingSnapshot && (
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
            <UpcomingDatesList dates={transaction.upcomingDates} resources={transaction.resources} onReadGuide={openMilestoneGuide} />
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

      <ResourceGuideSheet resource={selectedResource} resources={transaction.resources ?? []} onSelectResource={setSelectedResource} onClose={() => setSelectedResource(null)} />

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
                <DocumentThumbnail document={selectedDocument} />
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

/** Two quick facts for the narrow property card: what's next, and the headline date. */
function columnFacts(data: SellerTimelineData) {
  const current = data.milestones.find((milestone) => milestone.status === 'current')
  const facts: Array<{ label: string; value: string }> = []
  if (current?.startDate) facts.push({ label: `${current.label} since`, value: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${current.startDate}T12:00:00Z`)) })
  if (data.countdown) {
    const label = data.countdown.label === 'closing' ? 'Closing' : 'Goes live'
    facts.push({ label, value: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${data.countdown.date}T12:00:00Z`)) })
  }
  return facts
}

function TimelineEventsList({ events }: { events: TimelineEvent[] }) {
  return (
    <Box component="ol" className="activity-event-list">
      {events.map((event) => <ActivityEventRow key={event.id} event={event} variant="compact" />)}
    </Box>
  )
}

function UpcomingDatesPanel({ dates, resources, onSeeAll, onReadGuide }: { dates: UpcomingDate[]; resources?: TransactionResource[]; onSeeAll: () => void; onReadGuide: (resourceId: string) => void }) {
  const nextDates = [...dates].sort((first, second) => first.date.localeCompare(second.date)).slice(0, 3)

  return (
    <Box className="upcoming-dates-card">
      <PortalSection
        title="Upcoming dates"
        prominent
        action={<CardActionButton onClick={onSeeAll}>See all</CardActionButton>}
      >
        <UpcomingDatesList dates={nextDates} resources={resources} onReadGuide={onReadGuide} />
      </PortalSection>
    </Box>
  )
}

function UpcomingDatesList({ dates, resources, onReadGuide }: { dates: UpcomingDate[]; resources?: TransactionResource[]; onReadGuide: (resourceId: string) => void }) {
  return (
    <DateEventList>
      {[...dates].sort((first, second) => first.date.localeCompare(second.date)).map((item) => {
        const guidance = item.guidance
        const attached = (guidance?.resourceIds ?? []).map(id => resources?.find(resource => resource.id === id)).filter((resource): resource is TransactionResource => !!resource)
        return <DateEventRow key={item.id} date={item.date} title={item.title} description={item.description} resources={attached} onReadResource={resource => onReadGuide(resource.id)} guidance={guidance} />
      })}
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
