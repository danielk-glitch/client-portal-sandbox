/**
 * Transactions index (`/transactions`) · the client's home when they have more than one deal, possibly with different teams.
 * Each card answers what a buyer or seller opens the app to learn: which home, buying or selling, where it stands,
 * the next date that matters, and who their agent is. Everything else lives a click in.
 * - In progress: one photo card per deal. The whole card opens that portal.
 * - Past: closed deals as quiet rows, kept for records and documents.
 * - PLACE leads the page, since it spans teams. Each card credits its team through the agent, not a logo wall.
 */
import { Avatar, Box, ButtonBase, Container, Typography } from '@mui/material'
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded'
import KeyRounded from '@mui/icons-material/KeyRounded'
import SellRounded from '@mui/icons-material/SellRounded'
import { PlaceCard } from '../components/PlaceCard'
import { SectionLabel } from '../components/SectionLabel'
import { Eyebrow } from '../components/Eyebrow'
import { PortalIconBadge } from '../components/PortalIconBadge'
import { DateStamp, PortalTopbar } from '../transaction-portal/components'
import { activeTransactions, clientProfile, pastTransactions, type ActiveTransaction, type PastTransaction } from './clientAccountData'
import './client-account.css'

export function TransactionsIndex() {
  return (
    <Box className="client-account">
      <PortalTopbar viewer={clientProfile} homeHref="/transactions" accountHref="/profile" />
      <Container component="main" className="client-account-main">
        <Typography component="h1" variant="titleL" className="client-account-title">
          Your Transactions
        </Typography>

        <Box component="section" aria-labelledby="ti-active" className="client-account-group">
          <SectionLabel component="h2" id="ti-active">In progress</SectionLabel>
          <Box component="ul" className="ti-card-list">
            {activeTransactions.map((transaction) => <li key={transaction.id}><ActiveCard transaction={transaction} /></li>)}
          </Box>
        </Box>

        {pastTransactions.length > 0 && (
          <Box component="section" aria-labelledby="ti-past" className="client-account-group">
            <SectionLabel component="h2" id="ti-past">Past</SectionLabel>
            <Box component="ul" className="ti-row-list">
              {pastTransactions.map((transaction) => <li key={transaction.id}><PastRow transaction={transaction} /></li>)}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  )
}

function ActiveCard({ transaction: t }: { transaction: ActiveTransaction }) {
  const stage = t.stages[t.currentStage]
  return (
    <PlaceCard padding="none" interactive className="ti-card">
      <ButtonBase component="a" href={t.href} className="ti-card-link" disableRipple aria-label={`${t.side} ${t.address}, ${t.locality}. ${stage}.`}>
        <Box className="ti-card-photo">
          <Box component="img" src={t.photoUrl} alt={t.photoAlt} />
        </Box>
        <Box className="ti-card-body">
          <Box className="ti-card-head">
            <Box className="ti-card-head-copy">
              <Box className="ti-card-eyebrow">
                <Eyebrow component="span">{t.side}</Eyebrow>
              </Box>
              <Typography component="h3" variant="titleM" className="ti-card-address">{t.address}</Typography>
              <Typography variant="bodySStandard" className="ti-muted">{t.locality}</Typography>
            </Box>
          </Box>

          <Box className="ti-stage">
            <Box className="ti-stage-track" aria-hidden="true">
              {t.stages.map((name, index) => (
                <Box key={name} component="span" className={['ti-stage-mark', index <= t.currentStage ? 'is-reached' : ''].join(' ')} />
              ))}
            </Box>
            <Typography variant="labelS" className="ti-muted">
              <Box component="span" className="ti-stage-name">{stage}</Box> · Stage {t.currentStage + 1} of {t.stages.length}
            </Typography>
          </Box>

          <Box className="ti-next">
            <DateStamp date={t.next.date} />
            <Box className="ti-next-copy">
              <Typography variant="labelS" className="ti-muted">Next</Typography>
              <Typography variant="titleXS">{t.next.title}</Typography>
              <Typography variant="bodySStandard" className="ti-muted">{t.next.detail}</Typography>
            </Box>
          </Box>

          <Box className="ti-card-foot">
            <Avatar src={t.agent.photoUrl} alt="" className="ti-agent-avatar">{t.agent.initials}</Avatar>
            <Box className="ti-agent-copy">
              <Typography variant="labelM">{t.agent.name}</Typography>
              <Typography variant="labelS" className="ti-muted">{t.agent.team}</Typography>
            </Box>
            <ChevronRightRounded className="ti-chevron" aria-hidden="true" />
          </Box>
        </Box>
      </ButtonBase>
    </PlaceCard>
  )
}

function PastRow({ transaction: t }: { transaction: PastTransaction }) {
  return (
    <ButtonBase component="a" href={t.href} className="ti-row" disableRipple>
      <PortalIconBadge>{t.side === 'Bought' ? <KeyRounded /> : <SellRounded />}</PortalIconBadge>
      <Box className="ti-row-copy">
        <Typography variant="titleXS">{t.address}</Typography>
        <Typography variant="labelS" className="ti-light">
          {t.side} · Closed {t.closedOn} · {t.agent.team}
        </Typography>
      </Box>
      <ChevronRightRounded className="ti-chevron" aria-hidden="true" />
    </ButtonBase>
  )
}
