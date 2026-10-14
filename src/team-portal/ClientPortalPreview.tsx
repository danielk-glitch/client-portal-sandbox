import { Box, Button, Typography } from '@mui/material'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import type { ReactNode } from 'react'
import { SellerPortal } from '../seller-portal/SellerPortal'
import { futureMarketingSnapshot, futureSellerTransaction } from '../seller-portal/futureSellerTransaction'
import type { TransactionResource } from '../transaction-portal/types'
import { cleanResourceHtml, loadTeamState } from './teamData'
import type { TeamResource } from './teamData'
import './client-preview.css'

function clientResource(resource: TeamResource): TransactionResource {
  const content = resource.published!
  const original = futureSellerTransaction.resources?.find(guide => guide.id === resource.id)
  if (original && resource.source === 'Brivity') return original
  const document = new DOMParser().parseFromString(cleanResourceHtml(content.html), 'text/html')
  const sections: TransactionResource['sections'] = []
  let section = { title: 'Your guide', html: '' }
  for (const node of [...document.body.childNodes]) {
    if (node instanceof Element && ['H2', 'H3'].includes(node.tagName)) {
      if (section.html) sections.push(section)
      section = { title: node.textContent ?? 'Your guide', html: '' }
    } else {
      section.html += node instanceof Element ? node.outerHTML : node.textContent ?? ''
    }
  }
  if (section.html) sections.push(section)
  return { id: resource.id, title: content.title, summary: content.summary, readingTime: 'Team guide', relevance: 'Good to know', sections, questions: [] }
}

export function ClientPortalPreview({ buyerPortal }: { buyerPortal: ReactNode }) {
  const state = loadTeamState()
  const buyer = new URLSearchParams(window.location.search).get('type') === 'buyer'
  const resources = state.resources.filter(resource => resource.published && state.visible.includes(resource.id)).map(clientResource)
  return <Box className="client-preview-page">
    <ClientPreviewBanner clientLabel={buyer ? 'Buyer portal' : 'Tim & Alex Bennett’s seller portal'} />
    {buyer ? buyerPortal : <SellerPortal transaction={{ ...futureSellerTransaction, resources }} marketingSnapshot={futureMarketingSnapshot} basePath="/team/preview" initialListingOpen={window.location.pathname.endsWith('/listing')} readOnly showReviewTools={false} />}
  </Box>
}

export function ClientPreviewBanner({ clientLabel }: { clientLabel: string }) {
  return (
    <Box component="aside" aria-label="Client preview" className="client-preview-banner">
      <Box className="client-preview-label"><VisibilityOutlined fontSize="small" /><Box><Typography variant="labelM">Client preview · read only</Typography><Typography variant="bodySStandard">{clientLabel}</Typography></Box></Box>
      <Button component="a" href="/team" startIcon={<ArrowBackOutlined />}>Back to team workspace</Button>
    </Box>
  )
}
