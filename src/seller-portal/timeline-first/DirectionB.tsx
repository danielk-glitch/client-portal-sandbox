/**
 * Direction B · Agenda.
 * The whole sale as one vertical journey you scroll through, like a trip itinerary.
 * Finished stages fold into one line. A "Today" marker anchors the present. Dates that
 * aren't scheduled yet sit in place as dashed placeholders. Rows expand inline to show
 * instructions, documents, and links, so you never leave the page.
 * Left rail: progress and stage jump links. Right rail: latest updates and files, always visible.
 */
import { Fragment, useState } from 'react'
import { Avatar, AvatarGroup, Box, Button, ButtonBase, Collapse, Container, Typography } from '@mui/material'
import CheckRounded from '@mui/icons-material/CheckRounded'
import DescriptionOutlined from '@mui/icons-material/DescriptionOutlined'
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import { Eyebrow } from '../../components/Eyebrow'
import type { SellerMilestone, SellerTimelineStep } from '../sellerTimelineData'
import { currentMilestone, daysBetween, formatDay, overallProgress, teamTodos } from './timelineFirstData'
import { ActivityFeed, NewBadge, OwnerLabel, StepDetailBody, TeamTodoList, UpdatesPill } from './TimelineFirstParts'
import type { DirectionContext } from './TimelineFirstPortal'

function byDate(a: SellerTimelineStep, b: SellerTimelineStep) {
  if (a.date && b.date) return a.date.localeCompare(b.date)
  return a.date ? -1 : b.date ? 1 : 0
}

function stageRange(milestone: SellerMilestone) {
  if (milestone.startDate && milestone.endDate) return `${formatDay(milestone.startDate)} – ${formatDay(milestone.endDate)}`
  if (milestone.startDate) return `From ${formatDay(milestone.startDate)}`
  return 'Dates to come'
}

export function DirectionB({ transaction, timeline, unseen, openDocument, openResource, openListing, openActivity, openDocuments }: DirectionContext) {
  const current = currentMilestone(timeline)
  const progress = overallProgress(timeline)
  const closing = timeline.countdown?.date ?? '2026-11-06'
  const [expanded, setExpanded] = useState<string | null>(timeline.nextStepId)
  const [openStages, setOpenStages] = useState<Set<string>>(() => new Set())
  const listing = transaction.listing
  const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)
  const currentGuides = current.resourceIds.map((id) => transaction.resources?.find((guide) => guide.id === id)).filter((guide) => guide !== undefined).slice(0, 3)

  function toggleStage(id: string) {
    setOpenStages((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <Container maxWidth="xl" className="portal-main tf-b">
      <Box className="tf-b-grid">
        {/* ---------- Left rail: where you are ---------- */}
        <Box component="aside" className="tf-b-left" aria-label="Your progress">
          <ButtonBase className="tf-b-home" onClick={openListing} disableRipple aria-label={`See listing for ${listing.address}`}>
            {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" />}
            <Box component="span" className="tf-b-home-copy">
              <Typography variant="titleXS" component="span">{listing.address}</Typography>
              <Typography variant="labelS" component="span" color="text.secondary">{listing.city}, {listing.state}</Typography>
            </Box>
          </ButtonBase>

          <Box className="tf-b-progress">
            <Typography variant="metricL" component="p">{Math.round(progress * 100)}%</Typography>
            <Typography variant="bodySStandard" color="text.secondary">of the way to closing · {daysBetween(timeline.today, closing)} days left</Typography>
            <Box className="tf-b-progress-track" aria-hidden="true"><Box style={{ width: `${progress * 100}%` }} /></Box>
          </Box>

          <Box component="nav" aria-label="Jump to a stage" className="tf-b-stages">
            {timeline.milestones.map((milestone, index) => (
              <Box component="a" key={milestone.id} href={`#tf-stage-${milestone.id}`} className={`tf-b-stage tf-b-stage--${milestone.status}`}>
                <Box component="span" className="tf-b-stage-marker" aria-hidden="true">{milestone.status === 'complete' ? <CheckRounded /> : index + 1}</Box>
                <Box component="span" className="tf-b-stage-copy">
                  <Typography variant="labelM" component="span">{milestone.label}</Typography>
                  <Typography variant="labelS" component="span" color="text.secondary">{milestone.status === 'current' ? 'Now' : stageRange(milestone)}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="tf-b-team">
            <AvatarGroup max={4} className="tf-b-avatars">
              {transaction.team.map((member) => <Avatar key={member.id} src={member.photoUrl} alt={member.name} />)}
            </AvatarGroup>
            {agent?.email && <Button variant="outlined" size="small" href={`mailto:${agent.email}`}>Message {agent.name.split(' ')[0]}</Button>}
          </Box>
        </Box>

        {/* ---------- Center: the journey ---------- */}
        <Box className="tf-b-main">
          <Box component="header" className="tf-b-header">
            <Eyebrow component="p" className="tf-date-eyebrow">{formatDay(timeline.today, { weekday: 'long', month: 'long', day: 'numeric' })}</Eyebrow>
            <Typography component="h1" variant="displayS">Your sale, start to finish</Typography>
            <Typography variant="bodyMStandard" color="text.secondary">Tap any date for what to expect and how to prepare.</Typography>
            <UpdatesPill count={unseen} onClick={openActivity} className="tf-b-pill" />
          </Box>

          <Box component="ol" className="tf-b-journey">
            {timeline.milestones.map((milestone) => {
              const folded = milestone.status === 'complete' && !openStages.has(milestone.id)
              const steps = [...milestone.steps].sort(byDate)
              const todayIndex = milestone.status === 'current' ? steps.findIndex((step) => !step.date || step.date >= timeline.today) : -1
              return (
                <Box component="li" key={milestone.id} id={`tf-stage-${milestone.id}`} className={`tf-b-stage-block tf-b-stage-block--${milestone.status}`}>
                  <ButtonBase className="tf-b-stage-head" onClick={() => milestone.status === 'complete' && toggleStage(milestone.id)} disabled={milestone.status !== 'complete'} aria-expanded={milestone.status === 'complete' ? !folded : undefined} disableRipple>
                    <Box component="span" className="tf-b-stage-head-copy">
                      <Typography component="h2" variant="titleM">{milestone.label}</Typography>
                      <Typography variant="bodySStandard" color="text.secondary" component="span">
                        {folded ? `${milestone.steps.length} steps done · ${stageRange(milestone)}` : `${stageRange(milestone)} · ${milestone.summary}`}
                      </Typography>
                    </Box>
                    {milestone.status === 'current' && <Box component="span" className="tf-b-now">Now</Box>}
                    {milestone.status === 'complete' && <ExpandMoreRounded className={`tf-b-fold${folded ? '' : ' is-open'}`} aria-hidden="true" />}
                  </ButtonBase>

                  {!folded && (
                    <Box component="ul" className="tf-b-steps">
                      {steps.map((step, index) => (
                        <Fragment key={step.id}>
                          {index === todayIndex && (
                            <Box component="li" className="tf-b-today" aria-label="Today">
                              <Typography variant="labelS">Today · {formatDay(timeline.today, { weekday: 'short', month: 'short', day: 'numeric' })}</Typography>
                            </Box>
                          )}
                          <AgendaRow
                            step={step}
                            milestone={milestone}
                            open={expanded === step.id}
                            next={step.id === timeline.nextStepId}
                            onToggle={() => setExpanded(expanded === step.id ? null : step.id)}
                            context={{ transaction, openDocument, openResource }}
                          />
                        </Fragment>
                      ))}
                    </Box>
                  )}
                </Box>
              )
            })}
          </Box>

          <Box component="section" aria-labelledby="tf-b-team-title" className="tf-b-team-work">
            <Typography component="h2" variant="titleM" id="tf-b-team-title">Handled by your team</Typography>
            <TeamTodoList todos={teamTodos} team={transaction.team} intro="Behind-the-scenes work your team is doing for you. Nothing here needs your action." />
          </Box>
        </Box>

        {/* ---------- Right rail: what's new and your files ---------- */}
        <Box component="aside" className="tf-b-right" aria-label="Updates and files">
          <Box component="section" className="tf-b-panel">
            <Box className="tf-b-panel-head">
              <Typography component="h2" variant="titleS">Latest updates</Typography>
              <NewBadge count={unseen} />
            </Box>
            <ActivityFeed events={transaction.timeline.slice(0, 5)} unseen={unseen} />
            <Button variant="text" onClick={openActivity} className="tf-b-more">All updates</Button>
          </Box>

          <Box component="section" className="tf-b-panel">
            <Box className="tf-b-panel-head"><Typography component="h2" variant="titleS">Files</Typography></Box>
            <Box component="ul" className="tf-b-files">
              {transaction.documents.slice(0, 4).map((doc) => (
                <Box component="li" key={doc.id}>
                  <ButtonBase className="tf-b-file" onClick={() => openDocument(doc)} disableRipple>
                    <DescriptionOutlined aria-hidden="true" />
                    <Box component="span">
                      <Typography variant="labelM" component="span">{doc.name}</Typography>
                      <Typography variant="labelS" component="span" color="text.secondary" className={doc.status === 'Signature requested' ? 'tf-needs-you' : undefined}>{doc.status}</Typography>
                    </Box>
                  </ButtonBase>
                </Box>
              ))}
              {currentGuides.map((guide) => (
                <Box component="li" key={guide.id}>
                  <ButtonBase className="tf-b-file" onClick={() => openResource(guide)} disableRipple>
                    <MenuBookOutlined aria-hidden="true" />
                    <Box component="span">
                      <Typography variant="labelM" component="span">{guide.title}</Typography>
                      <Typography variant="labelS" component="span" color="text.secondary">Guide · {guide.readingTime}</Typography>
                    </Box>
                  </ButtonBase>
                </Box>
              ))}
            </Box>
            <Button variant="text" onClick={openDocuments} className="tf-b-more">All documents</Button>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

function AgendaRow({ step, milestone, open, next, onToggle, context }: {
  step: SellerTimelineStep
  milestone: SellerMilestone
  open: boolean
  next: boolean
  onToggle: () => void
  context: Pick<DirectionContext, 'transaction' | 'openDocument' | 'openResource'>
}) {
  const { transaction } = context
  const done = step.status === 'complete'
  const tbd = !step.date
  const panelId = `tf-b-panel-${step.id}`
  return (
    <Box component="li" className={`tf-b-row${done ? ' is-done' : ''}${open ? ' is-open' : ''}${next ? ' is-next' : ''}${tbd ? ' is-tbd' : ''}`}>
      <ButtonBase className="tf-b-row-head" onClick={onToggle} aria-expanded={open} aria-controls={panelId} disableRipple>
        <Box component="span" className="tf-b-date" aria-hidden={!tbd}>
          {tbd ? <Typography variant="labelS" component="span">TBD</Typography> : <>
            <Typography variant="labelS" component="span">{formatDay(step.date!, { weekday: 'short' })}</Typography>
            <Typography variant="titleXS" component="span">{formatDay(step.date!)}</Typography>
          </>}
        </Box>
        <Box component="span" className="tf-b-node" aria-hidden="true">{done && <CheckRounded />}</Box>
        <Box component="span" className="tf-b-row-copy">
          <Box component="span" className="tf-b-row-title">
            <Typography variant="titleXS" component="span">{step.title}</Typography>
            {next && <Box component="span" className="timeline-next-tag">Next step</Box>}
          </Box>
          <Typography variant="bodySStandard" color="text.secondary" component="span">
            {tbd && step.estimate ? `Not scheduled yet · ${step.estimate}` : step.summary}
          </Typography>
          <Typography variant="labelS" color="text.secondary" component="span" className="tf-b-row-meta">
            <OwnerLabel owner={step.owner} team={transaction.team} />
            {(step.documentId || step.pendingDocument) && <><Box component="span" aria-hidden="true">·</Box>Document</>}
            {step.resourceId && <><Box component="span" aria-hidden="true">·</Box>Guide</>}
          </Typography>
        </Box>
        <ExpandMoreRounded className="tf-b-chevron" aria-hidden="true" />
      </ButtonBase>
      <Collapse in={open} unmountOnExit>
        <Box id={panelId} className="tf-b-row-body">
          <StepDetailBody
            item={{ step, milestone }}
            hideFacts
            team={transaction.team}
            documents={transaction.documents}
            resources={transaction.resources ?? []}
            onOpenDocument={context.openDocument}
            onOpenResource={context.openResource}
          />
        </Box>
      </Collapse>
    </Box>
  )
}
