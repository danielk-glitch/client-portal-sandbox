/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
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
import { AdvertisingRow, ShowingFeedbackRow, ResourcesPanel, ResourceGuideSheet, ActivityEventRow, ActivityPanel, DateEventList, DateEventRow, DocumentsPanel, DocumentViewer, useDocumentPins, PeopleSection, PaginatedTabList, PortalFooter, PortalTopbar, TaskRow, TeamNoteCard, TransactionRowList, type PeopleTab } from '../transaction-portal/components'
import { PortalSection } from '../components/PortalSection'
import type { TransactionResource } from '../transaction-portal/types'
import { TextLink } from '../components/TextLink'
import { SectionLabel } from '../components/SectionLabel'
import { PlaceCard } from '../components/PlaceCard'
import { PlaceIconButton } from '../components/PlaceIconButton'
import { PlaceSheet } from '../components/PlaceSheet'
import { PlaceModal } from '../components/PlaceModal'
import { PlaceTag } from '../components/PlaceTag'
import { ListingPreparation } from './ListingPreparation'
import { createBeforeListingTransaction, createListedTransaction, readSellerJourneyView, type SellerJourneyView } from '../internal/review/sellerJourneyViews'
import { SellerReviewTools } from '../internal/review/SellerReviewTools'
import { SellerTimeline, type TimelineTransition } from './SellerTimeline'
import { DocumentListRow } from './DocumentListRow'
import { TransactionOverview } from './TransactionOverview'
import { ImportantNotes } from './timeline-first/ImportantNotes'
import { PropertySummaryCard } from './PropertySummaryCard'
import { MarketActivityBlock } from './market-activity/MarketActivityBlock'
import { emptyMarketActivity, hiddenMarketActivity, type MarketActivity } from './market-activity/marketActivityData'
import { daysBetween } from './timeline-first/timelineFirstData'
import './seller-columns.css'
import { beforeListingTimeline, listedTimeline, timelineResources, underContractTimeline, type SellerTimelineData } from './sellerTimelineData'
import { buildClientDocuments, documentsLinkedTo, sellerDocumentRecords, type ClientDocument } from './timeline-first/documentLibrary'
import { clientDocumentFacts } from './timeline-first/documentViewerFacts'
import { StagedDocumentsPanel } from './timeline-first/StagedDocumentsPanel'
import { buildTaggedDocuments, resourceDocumentId } from './timeline-first/taggedDocuments'
import './seller-portal.css'
import './seller-polestar.css'

/** 2 column page only: how containers separate from the page. */
type ContainerStyle = 'shadow' | 'stroke'

/** Design panel review scenario for Market activity (?market=empty|hidden). */
export type MarketActivityScenario = 'activity' | 'empty' | 'hidden'

type SellerPortalProps = {
  transaction?: SellerTransaction
  marketingSnapshot?: MarketingSnapshotData
  /** Nearby competing homes since listing. Omit to leave the block off the page. */
  marketActivity?: MarketActivity
  initialListingOpen?: boolean
  basePath?: string
  /** Show documents as list rows instead of preview cards, with no pinning (current functionality). */
  documentRows?: boolean
  /** Adds Showing feedback and Advertising to the tabs under the overview (current functionality). */
  listingPerformanceTabs?: boolean
  /** Header layout when the URL doesn't pick one. */
  defaultHeader?: ListingOverviewVariant
  /** Before listing: put the preparation message in the header (top right) instead of in its own block below it. */
  headerPreparation?: boolean
  visualTheme?: 'polestar'
  readOnly?: boolean
  showReviewTools?: boolean
  /** 'timeline' swaps the dates + activity overview for the milestone timeline exploration. */
  layout?: 'dashboard' | 'timeline' | 'timeline-columns'
  /** Buyer: the same page for the home being bought (MVP buyer portal). Pair with `timeline` and showReviewTools={false}. */
  side?: 'seller' | 'buyer'
  /** Replaces the seller timeline picked by the journey view. */
  timeline?: SellerTimelineData
}

export type OverviewLayout = 'timeline' | 'classic'

export type PortalTab = 'activity' | 'tasks' | 'notes' | 'feedback' | 'advertising' | 'documents' | 'resources'

export const portalTabs: Array<{ id: PortalTab; label: string }> = [
  { id: 'activity', label: 'Activity' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'notes', label: 'Notes' },
  { id: 'feedback', label: 'Showing feedback' },
  { id: 'advertising', label: 'Advertising' },
  { id: 'documents', label: 'Documents' },
  { id: 'resources', label: 'Resources' },
]

/**
 * V1 documents for the timeline pages. Guides from the old resource list become documents with the type "resource".
 * Pending view: the team's document records (type, stage, linked date, visibility). Before-listing view: its own documents, with guides tagged.
 */
function timelineDocuments(transaction: SellerTransaction, beforeListing: boolean): TransactionDocument[] {
  return beforeListing
    ? buildTaggedDocuments(transaction.documents, timelineResources)
    : buildClientDocuments(sellerDocumentRecords, timelineResources, underContractTimeline)
}

export function SellerPortal({ transaction: baseTransaction = sampleSellerTransaction, marketingSnapshot, marketActivity, initialListingOpen = false, basePath = '/seller', visualTheme, readOnly = false, showReviewTools = true, layout = 'dashboard', documentRows = false, listingPerformanceTabs = false, defaultHeader = 'light-bottom', headerPreparation = false, side = 'seller', timeline }: SellerPortalProps) {
  /** Both timeline explorations share the timeline; 'timeline-columns' rearranges the page into two columns. */
  const timelineLayout = layout === 'timeline' || layout === 'timeline-columns'
  const columnsLayout = layout === 'timeline-columns'
  const [journeyView, setJourneyView] = useState(() => readSellerJourneyView(window.location.search))
  const beforeListing = journeyView === 'before-listing'
  const listed = journeyView === 'listed'
  const transaction = useMemo(() => {
    const journeyTransaction = beforeListing ? createBeforeListingTransaction(baseTransaction) : listed ? createListedTransaction(baseTransaction) : baseTransaction
    // V1 data: on the timeline pages resources are documents (type "resource"), not their own list.
    return timelineLayout ? { ...journeyTransaction, listing: { ...journeyTransaction.listing, status: journeyTransaction.listing.status === 'Under contract' ? 'Pending' : journeyTransaction.listing.status }, documents: timelineDocuments(journeyTransaction, beforeListing), resources: undefined } : journeyTransaction
  }, [beforeListing, listed, baseTransaction, timelineLayout])
  const showListingTabs = listingPerformanceTabs && !beforeListing
  const availableTabs = portalTabs.filter((tab) => {
    if (tab.id === 'feedback' || tab.id === 'advertising') return showListingTabs
    return tab.id !== 'resources' || Boolean(transaction.resources?.length)
  })
  const [selectedResource, setSelectedResource] = useState<TransactionResource | null>(null)
  const portalRef = useRef<HTMLDivElement>(null)
  const defaultMarketingLayout = marketingSnapshot?.insights ? 'views' : 'materials'
  const [headerVariant, setHeaderVariant] = useState<ListingOverviewVariant>(() => {
    if (visualTheme === 'polestar') return 'card'
    const requestedHeader = new URLSearchParams(window.location.search).get('header')
    if (requestedHeader === 'card' || requestedHeader === 'full' || requestedHeader === 'light' || requestedHeader === 'light-bottom' || requestedHeader === 'light-compact') return requestedHeader
    return defaultHeader
  })
  const [containerStyle, setContainerStyle] = useState<ContainerStyle>(() =>
    new URLSearchParams(window.location.search).get('containers') === 'stroke' ? 'stroke' : 'shadow',
  )
  const [timelineTransition, setTimelineTransition] = useState<TimelineTransition>(() =>
    new URLSearchParams(window.location.search).get('timeline') === 'dark' ? 'dark' : 'divider',
  )
  /** The row under the header on the current-functionality page. Timeline overview is the default; `?overview=classic` restores dates beside recent activity. */
  const [overviewLayout, setOverviewLayout] = useState<OverviewLayout>(() =>
    new URLSearchParams(window.location.search).get('overview') === 'classic' ? 'classic' : 'timeline',
  )
  const [listingLink, setListingLink] = useState<HeaderListingLink>(() =>
    new URLSearchParams(window.location.search).get('listingLink') === 'first-party' ? 'first-party' : 'idx-mvp',
  )
  const [feedbackLayout, setFeedbackLayout] = useState<MarketingFeedbackLayout>(() => {
    const requestedLayout = new URLSearchParams(window.location.search).get('feedback')
    return marketingFeedbackLayouts.find((layout) => layout.id === requestedLayout)?.id ?? 'editorial'
  })
  const [marketingLayout, setMarketingLayout] = useState<'materials' | 'views'>(() => {
    const requestedLayout = new URLSearchParams(window.location.search).get('marketingLayout')
    return requestedLayout === 'views' || requestedLayout === 'materials' ? requestedLayout : defaultMarketingLayout
  })
  const [marketScenario, setMarketScenario] = useState<MarketActivityScenario>(() => {
    const requested = new URLSearchParams(window.location.search).get('market')
    return requested === 'empty' || requested === 'hidden' ? requested : 'activity'
  })
  const [activeTab, setActiveTab] = useState<PortalTab>(() => {
    const requestedTab = new URLSearchParams(window.location.search).get('section')
    if (requestedTab === 'timeline') return 'activity'
    return availableTabs.find((tab) => tab.id === requestedTab)?.id ?? 'activity'
  })
  const visibleTab = availableTabs.find((tab) => tab.id === activeTab)?.id ?? 'activity'
  const [activePeopleTab, setActivePeopleTab] = useState<PeopleTab>(() =>
    peopleTabFromUrl(),
  )
  const documentStorageKey = `place-document-pins:${transaction.listing.mlsNumber}:${transaction.viewers[0]?.id ?? 'guest'}`
  const documentPins = useDocumentPins(documentStorageKey)
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
      '.portal-main > .listing-overview, .portal-main > .seller-timeline, .portal-main > .transaction-overview, .priority-grid > .portal-section, .priority-grid > .upcoming-dates-card, .portal-main > .marketing-snapshot, .portal-main > .market-activity, .transaction-lower-grid > .people-section, .transaction-lower-grid > .transaction-sections, .portal-footer',
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
  }, [marketingSnapshot, journeyView, marketScenario, overviewLayout])

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

  function peopleTabFromUrl(): PeopleTab {
    const requested = new URLSearchParams(window.location.search).get('people')
    return requested === 'viewers' || requested === 'collaborators' ? requested : 'team'
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

  function selectOverviewLayout(value: OverviewLayout) {
    setOverviewLayout(value)
    const url = new URL(window.location.href)
    if (value === 'timeline') url.searchParams.delete('overview')
    else url.searchParams.set('overview', value)
    window.history.replaceState(null, '', url)
  }

  function selectListingLink(value: HeaderListingLink) {
    setListingLink(value)
    const url = new URL(window.location.href)
    if (value === 'idx-mvp') url.searchParams.delete('listingLink')
    else url.searchParams.set('listingLink', value)
    window.history.replaceState(null, '', url)
  }

  function selectContainerStyle(value: ContainerStyle) {
    setContainerStyle(value)
    const url = new URL(window.location.href)
    if (value === 'shadow') url.searchParams.delete('containers')
    else url.searchParams.set('containers', value)
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

  function selectMarketScenario(value: MarketActivityScenario) {
    setMarketScenario(value)
    const url = new URL(window.location.href)
    if (value === 'activity') url.searchParams.delete('market')
    else url.searchParams.set('market', value)
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

  function showAllNotes() {
    selectTab('notes')
    requestAnimationFrame(() => {
      document.getElementById('transaction-information')?.scrollIntoView({ block: 'start' })
      document.getElementById('seller-tab-notes')?.focus({ preventScroll: true })
    })
  }

  /** Unpinned documents in the current-functionality tab are list rows, like v1 iteration 2. Pinned ones keep their preview cards. */
  function documentRow(doc: TransactionDocument) {
    return (
      <DocumentListRow
        key={doc.id}
        title={doc.name}
        meta={`${doc.category} · Uploaded ${doc.uploadedAt}`}
        label={`Open ${doc.name}`}
        onOpen={() => setSelectedDocument(doc)}
      />
    )
  }

  /** Guides are documents in V1: open the matching "resource" document. */
  function openGuideAsDocument(guide: { id: string }) {
    const doc = transaction.documents.find((candidate) => candidate.id === resourceDocumentId(guide.id))
    if (doc) setSelectedDocument(doc)
  }

  /** Documents the team linked to a date show on that date's row. Only the pending view has linked dates. */
  function linkedDocumentsFor(step: { id: string }) {
    return beforeListing ? [] : documentsLinkedTo(transaction.documents as ClientDocument[], step.id)
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


  const timelineData = timeline ?? (beforeListing ? beforeListingTimeline : listed ? listedTimeline : underContractTimeline)
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

  // Competing homes matter while the home is live. Before listing there's no list date; once pending, the comparison is moot.
  const scenarioActivity = marketScenario === 'empty' ? emptyMarketActivity : marketScenario === 'hidden' ? hiddenMarketActivity : marketActivity
  // Keep nearby homes directly below listing performance in every layout.
  const showMarketActivity = listed && marketActivity && scenarioActivity
  const marketActivityBlock = showMarketActivity && <MarketActivityBlock activity={scenarioActivity} />

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
        {visibleTab === 'feedback' && (
          <Box component="section" aria-label="Showing feedback" className="portal-tab-content">
            <PaginatedTabList items={transaction.feedback} itemName="responses" ariaLabel="Showing feedback pages">
              {(visible) => <TransactionRowList>{visible.map((item) => <ShowingFeedbackRow key={item.id} feedback={item} />)}</TransactionRowList>}
            </PaginatedTabList>
          </Box>
        )}
        {visibleTab === 'advertising' && (
          <Box component="section" aria-label="Advertising" className="portal-tab-content">
            <PaginatedTabList items={transaction.advertising} itemName="updates" ariaLabel="Advertising pages">
              {(visible) => <TransactionRowList>{visible.map((event) => <AdvertisingRow key={event.id} event={event} />)}</TransactionRowList>}
            </PaginatedTabList>
          </Box>
        )}
        {visibleTab === 'documents' && timelineLayout && !beforeListing && (
          <StagedDocumentsPanel documents={transaction.documents as ClientDocument[]} side="seller" onOpen={setSelectedDocument} pinnedIds={documentPins.pinnedIds} />
        )}
        {visibleTab === 'documents' && !(timelineLayout && !beforeListing) && (
          <DocumentsPanel readOnly={readOnly} key={`${transaction.listing.mlsNumber}:${transaction.viewers[0]?.id}`} storageKey={documentStorageKey} pins={documentPins} documents={transaction.documents} onOpen={setSelectedDocument} renderRow={documentRows ? documentRow : undefined} pinning={!documentRows} />
        )}
      </Box>
    </Box>
  )

  return (
    <Box className={`seller-portal${visualTheme === 'polestar' ? ' seller-portal--polestar' : ''}`} ref={portalRef}>
      <PortalTopbar viewer={transaction.viewers[0]} />

      {columnsLayout ? (
        <Container maxWidth="xl" className={`portal-main portal-main--columns portal-main--containers-${containerStyle}`}>
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
                facts={columnFacts(timelineData)}
                onSeeListing={openListing}
              />
              <PeopleSection team={transaction.team} collaborators={transaction.collaborators} showContact={!!transaction.collaborators} viewers={transaction.viewers} value={activePeopleTab} onChange={selectPeopleTab} />
            </Box>

            <Box className="columns-main">
              <SellerTimeline
                data={timelineData}
                transition="card"
                resources={timelineResources}
                documents={transaction.documents}
                team={transaction.team}
                resourcesAsDocuments
                linkedDocuments={linkedDocumentsFor}
                onOpenResource={openGuideAsDocument}
                onOpenDocument={setSelectedDocument}
                onOpenMarketing={!beforeListing && marketingSnapshot ? () => setMarketingDashboardSection('overview') : undefined}
              />
              {marketingBlock}
              {marketActivityBlock}
              {transactionSections}
            </Box>
          </Box>
        </Container>
      ) : (
      <Container maxWidth="xl" className="portal-main">
        <ListingOverview transaction={transaction} onSeeListing={openListing} listingLink={listingLink} variant={beforeListing ? 'no-listing' : headerVariant} polestarLayout={visualTheme === 'polestar'} compact={timelineLayout} preparation={beforeListing && headerPreparation ? transaction.clientMessage : undefined} side={side} />

        {beforeListing && transaction.clientMessage && !headerPreparation && <ListingPreparation message={transaction.clientMessage} />}

        {timelineLayout ? (
          <SellerTimeline
            data={timelineData}
            transition={timelineTransition}
            resources={timelineResources}
            documents={transaction.documents}
            team={transaction.team}
            resourcesAsDocuments
            linkedDocuments={linkedDocumentsFor}
            onOpenResource={openGuideAsDocument}
            onOpenDocument={setSelectedDocument}
            onOpenMarketing={!beforeListing && marketingSnapshot ? () => setMarketingDashboardSection('overview') : undefined}
          />
        ) : overviewLayout === 'timeline' ? (
          <TransactionOverview
            timeline={
              <SellerTimeline
                data={timelineData}
                transition="card"
                trackerOnly
                staticTracker
                resources={timelineResources}
                documents={transaction.documents}
                team={transaction.team}
                resourcesAsDocuments
                onOpenResource={openGuideAsDocument}
                onOpenDocument={setSelectedDocument}
              />
            }
            dates={<OverviewDates today={timelineData.today} dates={transaction.upcomingDates} resources={transaction.resources} onReadGuide={openMilestoneGuide} />}
            notes={<ImportantNotes embedded title="Notes" limit={3} emptyText="No notes yet." notes={transaction.notes} onSeeAll={showAllNotes} />}
          />
        ) : <Box className="priority-grid" aria-label="Current transaction activity">
          <UpcomingDatesPanel today={timelineData.today} dates={transaction.upcomingDates} resources={transaction.resources} onSeeAll={() => setDatesDrawerOpen(true)} onReadGuide={openMilestoneGuide} />
          <PortalSection
            title="Recent activity"
            prominent
            action={<TextLink onClick={showAllActivity}>See all</TextLink>}
          >
            <TimelineEventsList events={transaction.timeline.slice(0, 3)} />
          </PortalSection>
        </Box>}

        {marketingBlock}

        {marketActivityBlock}

        <Box className="transaction-lower-grid">
          <PeopleSection team={transaction.team} collaborators={transaction.collaborators} showContact={!!transaction.collaborators} viewers={transaction.viewers} value={activePeopleTab} onChange={selectPeopleTab} />

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
        overviewLayout={timelineLayout || columnsLayout ? undefined : overviewLayout}
        selectOverviewLayout={selectOverviewLayout}
        listingLink={listingLink}
        selectListingLink={selectListingLink}
        headerVariant={headerVariant}
        selectHeaderVariant={selectHeaderVariant}
        marketingLayout={marketingLayout}
        selectMarketingLayout={selectMarketingLayout}
        feedbackLayout={feedbackLayout}
        selectFeedbackLayout={selectFeedbackLayout}
        marketScenario={marketActivity && listed ? marketScenario : undefined}
        selectMarketScenario={selectMarketScenario}
        timelineTransition={timelineLayout && !columnsLayout ? timelineTransition : undefined}
        containerStyle={columnsLayout ? containerStyle : undefined}
        selectContainerStyle={selectContainerStyle}
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

      <PlaceSheet
        open={datesDrawerOpen}
        onClose={() => setDatesDrawerOpen(false)}
        labelledBy="transaction-dates-title"
        paperClassName="dates-drawer-paper"
      >
        <Box className="place-sheet-scroll dates-drawer-scroll">
          <Box className="dates-drawer-column">
            <Box className="dates-drawer-header">
              <Box>
                <Typography component="h2" variant="titleS" id="transaction-dates-title">Transaction dates</Typography>
                <Typography variant="bodySStandard" color="text.secondary">
                  Key dates and activity for your {side === 'buyer' ? 'purchase' : 'sale'}
                </Typography>
              </Box>
              <PlaceIconButton onClick={() => setDatesDrawerOpen(false)} aria-label="Close transaction dates">
                <CloseOutlined />
              </PlaceIconButton>
            </Box>
            <Box className="dates-drawer-content">
              <Box component="section" aria-labelledby="all-upcoming-dates-title" className="dates-drawer-section">
                <Typography component="h3" variant="titleXS" id="all-upcoming-dates-title" className="dates-drawer-section-title">
                  Upcoming dates
                </Typography>
                <UpcomingDatesList today={timelineData.today} dates={transaction.upcomingDates} resources={transaction.resources} onReadGuide={openMilestoneGuide} />
              </Box>
              <Divider />
              <Box component="section" aria-labelledby="past-events-title" className="dates-drawer-section">
                <Typography component="h3" variant="titleXS" id="past-events-title" className="dates-drawer-section-title">
                  Past events
                </Typography>
                <PastEventsList events={transaction.timeline} />
              </Box>
            </Box>
          </Box>
        </Box>
      </PlaceSheet>

      <ResourceGuideSheet resource={selectedResource} resources={transaction.resources ?? []} onSelectResource={setSelectedResource} onClose={() => setSelectedResource(null)} />

      <DocumentViewer
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        pinned={selectedDocument ? documentPins.isPinned(selectedDocument.id) : false}
        onTogglePin={readOnly || documentRows ? undefined : documentPins.togglePin}
        extraFacts={clientDocumentFacts}
      />
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

function UpcomingDatesPanel({ today, dates, resources, onSeeAll, onReadGuide }: { today: string; dates: UpcomingDate[]; resources?: TransactionResource[]; onSeeAll: () => void; onReadGuide: (resourceId: string) => void }) {
  const nextDates = [...dates].filter(item => item.date >= today).sort((first, second) => first.date.localeCompare(second.date)).slice(0, 3)

  return (
    <Box className="upcoming-dates-card">
      <PortalSection
        title="Upcoming dates"
        prominent
        action={<TextLink onClick={onSeeAll}>See all</TextLink>}
      >
        <UpcomingDatesList today={today} dates={nextDates} resources={resources} onReadGuide={onReadGuide} />
      </PortalSection>
    </Box>
  )
}

/** Dates carry only a day and a title, so rows stay light. The first date on or after today is featured with how far away it is. */
function UpcomingDatesList({ today, dates, resources, onReadGuide, featureNext = true }: { today: string; dates: UpcomingDate[]; resources?: TransactionResource[]; onReadGuide: (resourceId: string) => void; featureNext?: boolean }) {
  const sorted = [...dates].sort((first, second) => first.date.localeCompare(second.date))
  const nextId = featureNext ? sorted.find(item => item.date >= today)?.id : undefined
  return (
    <DateEventList>
      {sorted.map((item) => {
        const guidance = item.guidance
        const attached = (guidance?.resourceIds ?? []).map(id => resources?.find(resource => resource.id === id)).filter((resource): resource is TransactionResource => !!resource)
        const featured = item.id === nextId
        const days = daysBetween(today, item.date)
        const away = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`
        return <DateEventRow key={item.id} today={today} date={item.date} title={item.title} featured={featured} plainDate={!featured} resources={attached} onReadResource={resource => onReadGuide(resource.id)} guidance={guidance}>{featured ? away : undefined}</DateEventRow>
      })}
    </DateEventList>
  )
}

/** Overview block, one "Dates" section: the next date in an elevated card, the dates after it, and a button that opens every date. */
function OverviewDates({ today, dates, resources, onReadGuide }: { today: string; dates: UpcomingDate[]; resources?: TransactionResource[]; onReadGuide: (resourceId: string) => void }) {
  const sorted = [...dates].sort((first, second) => first.date.localeCompare(second.date))
  const upcoming = sorted.filter(item => item.date >= today)
  const [next, ...later] = upcoming
  const [allOpen, setAllOpen] = useState(false)
  const listedCount = 5
  if (!next) return <><SectionLabel component="h2">Dates</SectionLabel><Typography variant="bodySStandard" color="text.secondary" className="overview-empty">No upcoming dates.</Typography></>
  const days = daysBetween(today, next.date)
  const away = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`
  const attached = (next.guidance?.resourceIds ?? []).map(id => resources?.find(resource => resource.id === id)).filter((resource): resource is TransactionResource => !!resource)
  return (
    <>
      <SectionLabel id="overview-dates-label" component="h2">Dates</SectionLabel>
      <PlaceCard className="overview-next">
        <DateEventList>
          <DateEventRow today={today} date={next.date} title={next.title} featured eyebrow={<Typography variant="labelS" component="span" className="overview-next-eyebrow">Up next</Typography>} titleAdornment={<PlaceTag className="overview-next-away">{away}</PlaceTag>} resources={attached} onReadResource={resource => onReadGuide(resource.id)} guidance={next.guidance} />
        </DateEventList>
      </PlaceCard>
      {later.length > 0 && (
        <Box className="overview-later">
          <UpcomingDatesList today={today} dates={later.slice(0, listedCount)} resources={resources} onReadGuide={onReadGuide} featureNext={false} />
        </Box>
      )}
      <Box className="overview-all">
        <Button variant="outlined" onClick={() => setAllOpen(true)} aria-haspopup="dialog">See all dates</Button>
      </Box>
      <PlaceModal open={allOpen} onClose={() => setAllOpen(false)} title="All dates" size="m" closeLabel="Close all dates">
        <AllDatesList today={today} dates={sorted} resources={resources} onReadGuide={onReadGuide} />
      </PlaceModal>
    </>
  )
}

/** Every date in order as one connected timeline. Past dates are struck through. When it opens, the list scrolls to the first date that is today or later; earlier dates are above it. */
function AllDatesList({ today, dates, resources, onReadGuide }: { today: string; dates: UpcomingDate[]; resources?: TransactionResource[]; onReadGuide: (resourceId: string) => void }) {
  const firstUpcoming = dates.find(item => item.date >= today)
  const firstUpcomingDate = firstUpcoming?.date
  const scrollToUpcoming = useCallback((list: HTMLElement | null) => {
    if (!list || !firstUpcomingDate) return
    const row = list.querySelector(`time[datetime="${firstUpcomingDate}"]`)?.closest('li')
    const scroller = list.closest('.place-modal-content')
    if (!row || !scroller) return
    scroller.scrollTop += row.getBoundingClientRect().top - scroller.getBoundingClientRect().top
  }, [firstUpcomingDate])
  return (
    <Box className="all-dates-timeline" ref={scrollToUpcoming}>
      <DateEventList>
        {dates.map((item) => {
          const attached = (item.guidance?.resourceIds ?? []).map(id => resources?.find(resource => resource.id === id)).filter((resource): resource is TransactionResource => !!resource)
          return <DateEventRow key={item.id} today={today} date={item.date} title={item.title} past={item.date < today} resources={attached} onReadResource={resource => onReadGuide(resource.id)} guidance={item.guidance} />
        })}
      </DateEventList>
    </Box>
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
