/**
 * Buyer portal · V1 iteration 2 (`/buyer/v1-iteration2`).
 * A clone of the seller's latest vision (DirectionC2), retold for buyers. Shared pieces come from the seller page;
 * buyer-only blocks live in this folder.
 * - Hero: days until closing and what's next, with View home details on the right. The stage tracker sits on the photo.
 * - Zone 1, "this stage": follows the stage picked in the tracker: what's next, then the stage's dates and documents.
 *   "Your first 10 days" is hidden by default; the design panel can show it (leads the inspection period while it's on).
 *   Closing: adds Moving in. Move in: adds Moving in and After closing.
 * - Right rail: Important notes, then the agent card. The lender's "Before closing" warning is starred, so it leads the notes.
 * - Zone 2, "Purchase and transaction details": Connect services (upsell), people, and tabs for activity,
 *   documents, the team's to-dos, emails, and notes.
 * - Left out on purpose: listing marketing and ads, showing feedback, open houses, market reports, pre-listing prep,
 *   offers, and saved or viewed homes.
 * - The design panel previews the deal at four moments; everything on the page follows that "today".
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import { TextLink } from '../components/TextLink'
import { PlaceModal } from '../components/PlaceModal'
import { ActivityPanel, DocumentViewer, EmailsPanel, PeopleSection, PortalFooter, NotesPanel, PortalTopbar, useDocumentPins, type PeopleTab } from '../transaction-portal/components'
import type { TransactionDocument } from '../transaction-portal/types'
import { SellerTimeline, MilestoneDetailsBlock } from '../seller-portal/SellerTimeline'
import { ListingDetailsSheet } from '../seller-portal/ListingDetailsSheet'
import type { MilestoneId } from '../seller-portal/sellerTimelineData'
import { currentMilestone } from '../seller-portal/timeline-first/timelineFirstData'
import { AgentBrandCard, SectionTabs, StepDetailBody, TeamTodoList, whenCopy, type OpenItem } from '../seller-portal/timeline-first/TimelineFirstParts'
import { FullTimelineDialog, NextUp, StickyTransactionHeader, documentProps } from '../seller-portal/timeline-first/DirectionC2'
import { buildClientDocuments, buyerStageForMilestone, documentsLinkedTo } from '../seller-portal/timeline-first/documentLibrary'
import { StagedDocumentsPanel } from '../seller-portal/timeline-first/StagedDocumentsPanel'
import { ImportantNotes } from '../seller-portal/timeline-first/ImportantNotes'
import { clientDocumentFacts } from '../seller-portal/timeline-first/documentViewerFacts'
import { resourceDocumentId } from '../seller-portal/timeline-first/taggedDocuments'
import { BuyerDesignPanel } from '../internal/review/BuyerDesignPanel'
import { buyerDeal, buyerTimelineAt, happenedBy, journeyMoments, todayFor, type JourneyMoment } from './buyerTimelineData'
import { buyerTransactionAt } from './buyerTransaction'
import { buyerDocumentRecords } from './buyerDocuments'
import { buyerResources } from './buyerResources'
import { BuyerHero } from './BuyerHero'
import { FirstTenDays } from './FirstTenDays'
import { AfterClosing, MovingIn } from './MoveInBlocks'
import { ConnectServices } from './ConnectServices'
import '../seller-portal/seller-portal.css'
import '../seller-portal/timeline-first/timeline-first.css'
import './buyer-portal.css'

/** "Your first 10 days" block: hidden by default, shown with ?tenDays=show or from the design panel. */
function initialShowTenDays() {
  return new URLSearchParams(window.location.search).get('tenDays') === 'show'
}

function initialMoment(): JourneyMoment {
  const requested = new URLSearchParams(window.location.search).get('moment')
  return journeyMoments.some((item) => item.value === requested) ? requested as JourneyMoment : 'inspection'
}

export function BuyerPortal() {
  const [moment, setMoment] = useState<JourneyMoment>(initialMoment)
  const [showTenDays, setShowTenDays] = useState(initialShowTenDays)

  function selectShowTenDays(value: boolean) {
    setShowTenDays(value)
    const url = new URL(window.location.href)
    url.searchParams.set('tenDays', value ? 'show' : 'hide')
    window.history.replaceState(null, '', url)
  }

  function selectMoment(value: JourneyMoment) {
    setMoment(value)
    const url = new URL(window.location.href)
    url.searchParams.set('moment', value)
    window.history.replaceState(null, '', url)
  }

  return (
    <Box className="seller-portal tf-portal tf-portal--c2 buyer-portal">
      {/* A new moment is a new "today": remount so the tracker, tabs, and open stage start fresh. */}
      <BuyerPage key={moment} today={todayFor(moment)} showTenDays={showTenDays} />
      <BuyerDesignPanel moment={moment} selectMoment={selectMoment} showTenDays={showTenDays} selectShowTenDays={selectShowTenDays} />
    </Box>
  )
}

function BuyerPage({ today, showTenDays }: { today: string; showTenDays: boolean }) {
  const timeline = useMemo(() => buyerTimelineAt(today), [today])
  const { transaction, emails, todos } = useMemo(() => buyerTransactionAt(today), [today])
  // Only documents the client can see that exist by today. Guides join as Resource documents.
  const documents = useMemo(() => {
    const uploaded = happenedBy(today)
    return buildClientDocuments(buyerDocumentRecords.filter((record) => uploaded(record.uploadedAt)), buyerResources, timeline, buyerStageForMilestone)
  }, [today, timeline])
  const current = currentMilestone(timeline)
  const closed = today > buyerDeal.closingDate
  const leadAgent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)

  const [stageId, setStageId] = useState<MilestoneId>(current.id)
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('team')
  const [sectionTab, setSectionTab] = useState('activity')
  const [fullOpen, setFullOpen] = useState(false)
  const [modalItem, setModalItem] = useState<OpenItem | null>(null)
  const [shown, setShown] = useState<OpenItem | null>(null)
  const [document, setDocument] = useState<TransactionDocument | null>(null)
  const [homeOpen, setHomeOpen] = useState(false)
  const pins = useDocumentPins(`place-document-pins:buyer:${transaction.listing.mlsNumber}`, ['bd-contract'])
  const stage = timeline.milestones.find((milestone) => milestone.id === stageId) ?? current

  function open(item: OpenItem) {
    setShown(item)
    setModalItem(item)
  }

  function openGuide(guideId: string) {
    const doc = documents.find((candidate) => candidate.id === resourceDocumentId(guideId))
    if (doc) setDocument(doc)
  }

  function showTab(tab: string) {
    setSectionTab(tab)
    window.document.getElementById('bp-sections')?.scrollIntoView({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth', block: 'start' })
  }

  // Sticky header: show once the hero has fully scrolled out of view.
  const heroRef = useRef<HTMLElement>(null)
  const [heroPassed, setHeroPassed] = useState(false)
  useEffect(() => {
    const hero = heroRef.current
    if (!hero || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setHeroPassed(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0), { threshold: 0 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const tracker = (
    <SellerTimeline
      data={timeline}
      transition="dark"
      trackerOnly
      currentLabel="Current"
      headingAction={<TextLink className="tf-timeline-link" onClick={() => setFullOpen(true)} aria-haspopup="dialog">Full timeline</TextLink>}
      onSelectMilestone={setStageId}
      resources={buyerResources}
      documents={documents}
      team={transaction.team}
      onOpenResource={(guide) => openGuide(guide.id)}
      onOpenDocument={setDocument}
    />
  )

  const tenDaysShown = showTenDays && stage.id === 'inspection-period' && stage.status === 'current'

  return (
    <>
      <PortalTopbar viewer={transaction.viewers[0]} />
      <StickyTransactionHeader visible={heroPassed} transaction={transaction} onOpenListing={() => setHomeOpen(true)} agentLabel="Your agent" />
      <BuyerHero transaction={transaction} timeline={timeline} tracker={tracker} heroRef={heroRef} onOpenHome={() => setHomeOpen(true)} />

      <Container maxWidth="xl" className="portal-main tf-c2">
        {/* When the first 10 days card leads, the rail lines up with the card instead of a section label. */}
        <Box className={`tf-c2-top${tenDaysShown ? ' bp-top--card-first' : ''}`}>
          {/* ---------- Zone 1: this stage ---------- */}
          <Box component="section" aria-label={stage.label} className={`tf-c2-stage tf-c2-stage--${stage.status}`}>
            {tenDaysShown && <FirstTenDays timeline={timeline} onOpenStep={open} onOpenGuide={() => openGuide('first-10-days')} />}

            <NextUp
              key={stage.id}
              stage={stage}
              nextStepId={timeline.nextStepId}
              today={timeline.today}
              context={{ transaction, documents, openDocument: setDocument }}
              onBack={stage.id !== current.id ? () => setStageId(current.id) : undefined}
              backLabel={`Back to ${current.label.toLowerCase()}`}
            />

            <Box component="section" aria-label={`Everything in ${stage.label.toLowerCase()}`} className="tf-c2-all">
              <MilestoneDetailsBlock
                data={timeline}
                milestoneId={stage.id}
                onOpenStep={(step, milestone) => open({ step, milestone })}
                resourcesAsDocuments
                resources={buyerResources}
                documents={documents}
                team={transaction.team}
                onOpenResource={(guide) => openGuide(guide.id)}
                onOpenDocument={setDocument}
                linkedDocuments={(step) => documentsLinkedTo(documents, step.id)}
              />
            </Box>

            {(stage.id === 'closing' || stage.id === 'move-in') && <MovingIn timeline={timeline} />}
            {stage.id === 'move-in' && <AfterClosing timeline={timeline} onOpenStep={open} onOpenDocuments={() => showTab('documents')} />}
          </Box>

          {/* ---------- Right rail: important notes and your agent ---------- */}
          <Box component="aside" className="tf-c2-rail" aria-label="Important notes and your agent">
            <ImportantNotes notes={transaction.notes} onSeeAll={() => showTab('notes')} />
            {leadAgent && <AgentBrandCard agent={leadAgent} brand={transaction.teamBrand} label="Your agent" />}
          </Box>
        </Box>

        {/* ---------- Zone 2: the whole purchase ---------- */}
        <Box component="section" aria-labelledby="bp-details-title" className="tf-c2-sale">
          <Box className="tf-c2-sale-head">
            <Typography component="h2" variant="titleL" id="bp-details-title">Purchase and transaction details</Typography>
          </Box>

          <Box className="bp-connect-slot">
            <ConnectServices movedIn={closed} />
          </Box>

          <Box className="tf-c2-lower">
            <PeopleSection team={transaction.team} viewers={transaction.viewers} value={peopleTab} onChange={setPeopleTab} />
            <SectionTabs
              id="bp-sections"
              value={sectionTab}
              onChange={setSectionTab}
              label="Everything in your purchase"
              tabs={[
                { id: 'activity', label: 'Activity', content: <ActivityPanel events={transaction.timeline} /> },
                { id: 'documents', label: 'Documents', content: <StagedDocumentsPanel documents={documents} side="buyer" onOpen={setDocument} pinnedIds={pins.pinnedIds} /> },
                { id: 'team', label: 'Team to-dos', content: <TeamTodoList todos={todos} team={transaction.team} /> },
                { id: 'emails', label: 'Emails', content: <EmailsPanel emails={emails} /> },
                { id: 'notes', label: 'Notes', content: <NotesPanel notes={transaction.notes} /> },
              ]}
            />
          </Box>
        </Box>
      </Container>

      <PortalFooter agent={leadAgent} brand={transaction.teamBrand} />

      <FullTimelineDialog open={fullOpen} onClose={() => setFullOpen(false)} timeline={timeline} team={transaction.team} eyebrow={transaction.listing.address} onOpen={open} calendarEnd={buyerDeal.calendarEnd} />

      {shown && (
        <PlaceModal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={shown.step.title} description={`${shown.milestone.label} · ${whenCopy(shown.step, true)}`} size="m" className="tf-c-modal">
          <StepDetailBody item={shown} {...documentProps(documents)} introEyebrow="Details" showAfter={false} team={transaction.team} onOpenDocument={(doc) => { setModalItem(null); setDocument(doc) }} />
        </PlaceModal>
      )}

      <ListingDetailsSheet open={homeOpen} onClose={() => setHomeOpen(false)} transaction={transaction} agentLabel="Your agent" />
      <DocumentViewer
        document={document}
        onClose={() => setDocument(null)}
        pinned={document ? pins.isPinned(document.id) : false}
        onTogglePin={pins.togglePin}
        extraFacts={(doc) => clientDocumentFacts(doc, 'buyer')}
      />
    </>
  )
}
