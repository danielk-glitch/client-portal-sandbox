import type { ReactNode } from 'react'
import EmailOutlined from '@mui/icons-material/EmailOutlined'
import { Button, IconButton } from '@mui/material'
import { sampleSellerTransaction } from '../seller-portal/sellerTransaction'
import { PartnerBrandLockup } from '../transaction-portal/components/PartnerBrandLockup'
import type { EmailTemplate } from './emailTemplates'
import './email-preview.css'

const transaction = sampleSellerTransaction
const agent = transaction.team.find((member) => member.id === transaction.teamBrand.leadAgentId)!
const property = `${transaction.listing.address}, ${transaction.listing.city}`

function EmailHeader({ template }: { template: EmailTemplate }) {
  return (
    <header className="email-header">
      <div className="email-brand-row">
        <PartnerBrandLockup brand={transaction.teamBrand} />
      </div>
      <div className="email-hero">
        <div className="email-hero-copy">
          <span className="email-kicker">{template.audience === 'seller' ? 'Your home sale' : 'Your home purchase'}</span>
          <h1>{template.headline}</h1>
          <p>{property}</p>
        </div>
        <img src={transaction.listing.photoUrl ?? ''} alt="128 Meadowbrook Lane" className="email-hero-image" />
      </div>
    </header>
  )
}

function EmailContentPane({ children }: { children: ReactNode }) {
  return <div className="email-content-pane">{children}</div>
}

function EmailAction({ label, href }: { label: string; href: string }) {
  return (
    <Button component="a" variant="contained" color="primary" className="email-action" href={href} onClick={(event) => event.preventDefault()} aria-label={`${label} (preview only)`}>
      {label}
    </Button>
  )
}

function AgentSignature() {
  return (
    <div className="email-agent">
      <img src={agent.photoUrl} alt="" className="email-agent-avatar" />
      <div>
        <strong>{agent.name}</strong>
        <span>{transaction.teamBrand.name}</span>
      </div>
      <IconButton component="a" href={`mailto:${agent.email}`} aria-label={`Email ${agent.name}`} title={`Email ${agent.name}`} className="email-agent-action">
        <EmailOutlined fontSize="small" />
      </IconButton>
    </div>
  )
}

function EmailFooter({ template }: { template: EmailTemplate }) {
  return (
    <footer className="email-footer">
      <div className="email-footer-main">
        <PartnerBrandLockup brand={transaction.teamBrand} />
      </div>
      <p className="email-footer-note">You are receiving updates about {transaction.listing.address} because you are connected to this transaction.</p>
      {template.kind === 'activity' && <a className="email-footer-preferences" href="https://example.com/email-preferences">Manage email preferences</a>}
    </footer>
  )
}

function InviteBody({ template }: { template: EmailTemplate }) {
  return (
    <>
      <p className="email-intro">{template.intro}</p>
      <EmailAction label={template.actionLabel} href={template.actionHref} />
      <div className="email-support-block">
        <span className="email-small-label">What you’ll find inside</span>
        <p>One place for the dates that matter, updates from your team, and a clear view of what comes next.</p>
      </div>
      <p className="email-closing">We’re here if you have questions. You can reach me directly at any point.</p>
      <AgentSignature />
    </>
  )
}

function ActivityBody({ template }: { template: EmailTemplate }) {
  const seller = template.audience === 'seller'
  const items = seller
    ? [
        { title: 'Your listing is ready', detail: 'The property photos and listing details are in place.' },
        { title: 'Agreement completed', detail: 'The signed listing agreement has been received.' },
      ]
    : [
        { title: 'Your transaction is underway', detail: 'The team has started coordinating the next steps.' },
        { title: 'Key dates are in place', detail: 'The current transaction schedule is available in your portal.' },
      ]

  return (
    <>
      <p className="email-intro">{template.intro}</p>
      <section className="email-progress" aria-label="Progress this week">
        <span className="email-small-label">What moved forward</span>
        {items.map((item, index) => (
          <div className="email-progress-item" key={item.title}>
            <span className="email-progress-number">0{index + 1}</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.detail}</p>
            </div>
          </div>
        ))}
      </section>
      <div className="email-next-step">
        <span className="email-small-label">Coming up</span>
        <h2>{seller ? 'Seller disclosure · October 8' : 'Your next milestone · October 8'}</h2>
        <p>{seller ? 'Review and sign Form 17 before the deadline.' : 'Check your portal for the latest details and anything the team needs from you.'}</p>
      </div>
      <EmailAction label={template.actionLabel} href={template.actionHref} />
      <AgentSignature />
    </>
  )
}

export function EmailPreview({ template }: { template: EmailTemplate }) {
  return (
    <article className="email-document" aria-label={`${template.title} email preview`} onClick={(event) => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }}>
      <EmailHeader template={template} />
      <EmailContentPane>
        {template.kind === 'activity' ? <ActivityBody template={template} /> : <InviteBody template={template} />}
      </EmailContentPane>
      <EmailFooter template={template} />
    </article>
  )
}
