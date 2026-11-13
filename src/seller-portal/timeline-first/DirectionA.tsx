/**
 * Direction A · Tracker + rail.
 * Closest to production. The current timeline component leads the page, now under a progress band
 * that answers "how far along are we?" in one glance. Recent activity lives in a right rail so it's
 * always one glance away. Items open a side drawer with instructions, documents, and links.
 */
import { useState } from 'react'
import { Box, Button, ButtonBase, Container, Paper, Stack, Typography } from '@mui/material'
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded'
import ArrowOutwardOutlined from '@mui/icons-material/ArrowOutwardOutlined'
import { Eyebrow } from '../../components/Eyebrow'
import { PeopleSection, ResourcesPanel, TeamNoteCard, type PeopleTab } from '../../transaction-portal/components'
import { PortalSectionHeader } from '../../components/PortalSection'
import { SellerTimeline } from '../SellerTimeline'
import { currentMilestone, daysBetween, formatDay, overallProgress, teamTodos } from './timelineFirstData'
import { ActivityFeed, NewBadge, SectionTabs, TeamTodoList, UpdatesPill, whenCopy } from './TimelineFirstParts'
import type { DirectionContext } from './TimelineFirstPortal'

export function DirectionA({ transaction, timeline, unseen, openItem, openDocument, openResource, openListing, openActivity, documentsPanel }: DirectionContext) {
  const [peopleTab, setPeopleTab] = useState<PeopleTab>('team')
  const current = currentMilestone(timeline)
  const next = current.steps.find((step) => step.id === timeline.nextStepId)
  const progress = overallProgress(timeline)
  const closing = timeline.countdown?.date ?? '2026-11-06'
  const daysLeft = daysBetween(timeline.today, closing)
  const start = timeline.milestones[0].startDate ?? timeline.today
  const listing = transaction.listing
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(listing.price)

  return (
    <Container maxWidth="xl" className="portal-main tf-a">
      <Box component="header" className="tf-a-header">
        <Box>
          <Eyebrow component="p" className="tf-date-eyebrow">{formatDay(timeline.today, { weekday: 'long', month: 'long', day: 'numeric' })}</Eyebrow>
          <Typography component="h1" variant="displayS">Good morning, Tim.</Typography>
          <UpdatesPill count={unseen} onClick={openActivity} className="tf-a-pill" />
        </Box>
        <ButtonBase className="tf-home-chip" onClick={openListing} aria-label={`See listing for ${listing.address}`} disableRipple>
          {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" />}
          <Box component="span" className="tf-home-chip-copy">
            <Typography variant="titleXS" component="span">{listing.address}</Typography>
            <Typography variant="labelS" component="span" color="text.secondary">{current.label} · {price}</Typography>
          </Box>
          <ArrowOutwardOutlined className="tf-home-chip-go" aria-hidden="true" />
        </ButtonBase>
      </Box>

      <Box component="section" aria-label="Overall progress" className="tf-a-progress">
        <Box className="tf-a-stat">
          <Typography variant="labelS" className="tf-stat-label">Overall</Typography>
          <Typography variant="metricL" component="p">{Math.round(progress * 100)}%</Typography>
          <Typography variant="bodySStandard" color="text.secondary">Stage {timeline.milestones.indexOf(current) + 1} of {timeline.milestones.length} · {current.label}</Typography>
        </Box>
        <Box className="tf-a-stat">
          <Typography variant="labelS" className="tf-stat-label">Closing</Typography>
          <Typography variant="metricL" component="p">{daysLeft} days</Typography>
          <Typography variant="bodySStandard" color="text.secondary">{formatDay(closing, { weekday: 'short', month: 'short', day: 'numeric' })}</Typography>
        </Box>
        {next && (
          <ButtonBase className="tf-a-next" onClick={() => openItem({ step: next, milestone: current })} disableRipple>
            <Typography variant="labelS" className="tf-stat-label">Next for you</Typography>
            <Typography variant="titleS" component="span">{next.title}</Typography>
            <Typography variant="bodySStandard" color="text.secondary" component="span">{whenCopy(next)}</Typography>
            <ArrowForwardRounded className="tf-a-next-go" aria-hidden="true" />
          </ButtonBase>
        )}
        <Box className="tf-a-bar" aria-hidden="true">
          <Box className="tf-a-bar-track"><Box className="tf-a-bar-fill" style={{ width: `${progress * 100}%` }} /></Box>
          <Box className="tf-a-bar-ends">
            <Typography variant="labelS">Started {formatDay(start)}</Typography>
            <Typography variant="labelS">Closing {formatDay(closing)}</Typography>
          </Box>
        </Box>
      </Box>

      <Box className="tf-a-grid">
        <Box className="tf-a-main">
          <SellerTimeline
            data={timeline}
            transition="card"
            resources={transaction.resources ?? []}
            documents={transaction.documents}
            team={transaction.team}
            onOpenResource={openResource}
            onOpenDocument={openDocument}
            onOpenStep={(step, milestone) => openItem({ step, milestone })}
          />

          <SectionTabs
            label="Transaction information"
            tabs={[
              { id: 'documents', label: 'Documents', content: documentsPanel },
              { id: 'team', label: 'Team to-dos', content: <TeamTodoList todos={teamTodos} team={transaction.team} intro="What Avery and the team are handling for you right now. Nothing here needs your action." /> },
              { id: 'notes', label: 'Notes', content: <Stack spacing={2} className="notes-list">{transaction.notes.map((note) => <TeamNoteCard key={note.id} note={note} />)}</Stack> },
              { id: 'guides', label: 'Guides', content: <ResourcesPanel resources={transaction.resources ?? []} onOpen={openResource} /> },
            ]}
          />
        </Box>

        <Box component="aside" className="tf-a-rail" aria-label="Recent activity and team">
          <Paper component="section" variant="outlined" className="portal-section tf-card">
            <PortalSectionHeader title="Recent activity" prominent action={<NewBadge count={unseen} />} />
            <Box className="portal-section-content">
              <ActivityFeed events={transaction.timeline.slice(0, 5)} unseen={unseen} />
              <Button variant="outlined" fullWidth onClick={openActivity} className="tf-see-all">See all updates</Button>
            </Box>
          </Paper>
          <PeopleSection team={transaction.team} viewers={transaction.viewers} value={peopleTab} onChange={setPeopleTab} />
        </Box>
      </Box>
    </Container>
  )
}
