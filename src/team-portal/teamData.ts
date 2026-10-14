export { cleanResourceHtml } from '../transaction-portal/resourceContent'
import { sellerResources } from '../seller-portal/sellerResources'

export type ResourceContent = { title: string; summary: string; html: string }
export type TeamResource = {
  id: string
  source: 'Brivity' | 'Team'
  published: ResourceContent | null
  draft: ResourceContent | null
  archived: boolean
  linked: number
}
export type TeamState = {
  resources: TeamResource[]
  visible: string[]
  defaults: { buyer: string[] | null; seller: string[] | null }
  role: 'admin' | 'member'
}
export const initialTeamState: TeamState = {
  role: 'admin',
  defaults: { buyer: null, seller: null },
  visible: ['appraisal', 'disclosures', 'closing', 'team-welcome'],
  resources: [
    ...sellerResources.map(resource => ({
      id: resource.id, source: 'Brivity' as const, archived: false, linked: 0, draft: null,
      published: {
        title: resource.title, summary: resource.summary,
        html: resource.sections.map(section => `<h2>${section.title}</h2>${section.body ? `<p>${section.body}</p>` : ''}${section.points ? `<ul>${section.points.map(point => `<li>${point}</li>`).join('')}</ul>` : ''}`).join(''),
      },
    })),
    { id: 'team-welcome', source: 'Team', archived: false, linked: 12,
      published: { title: 'Your guide to working with our team', summary: 'Who to contact, what to expect, and how we keep your sale moving.', html: '<h2>A team in your corner</h2><p>There are a few people working together on your sale. Here’s how we’ll help you along the way.</p><h2>Your agent</h2><p>Avery is your main contact for pricing, negotiations, and decisions about your sale.</p><h2>Your transaction coordinator</h2><p>Morgan keeps the details moving, from important dates to the paperwork for closing.</p><h2>Staying in touch</h2><p>Your portal brings the latest updates together. When you need to talk something through, contact your team directly.</p>' },
      draft: { title: 'Your guide to working with our team', summary: 'Who to contact, what to expect, and how we keep your sale moving.', html: '<h2>A team in your corner</h2><p>There are a few people working together on your sale. Here’s how we’ll help you along the way.</p><h2>Your agent</h2><p>Avery is your main contact for pricing, negotiations, and decisions about your sale.</p><h2>Your transaction coordinator</h2><p>Morgan keeps the details moving, from important dates to the paperwork for closing.</p><h2>Staying in touch</h2><p>Your portal brings the latest updates together. When you need to talk something through, contact your team directly.</p><p><strong>For scheduling and paperwork questions, reach out to Morgan first.</strong></p>' },
    },
    { id: 'team-moving', source: 'Team', archived: false, linked: 8, draft: null,
      published: { title: 'A smoother move', summary: 'A few practical steps to prepare for handing over your home.', html: '<h2>Start with the dates</h2><p>Confirm your move-out and possession dates with your agent before booking movers.</p><h2>Before you leave</h2><ul><li>Arrange utility transfers.</li><li>Gather keys, remotes, and appliance information.</li><li>Confirm how the buyer will receive everything.</li></ul>' },
    },
    { id: 'team-checklist', source: 'Team', archived: false, linked: 0, published: null,
      draft: { title: 'Preparing for your first buyer tour', summary: 'Simple ways to make your home ready for a showing.', html: '<h2>A welcoming first impression</h2><p>Give yourself a little time before the first tour to tidy up and make the home easy to explore.</p><ul><li>Clear walkways and counters.</li><li>Open curtains to let in natural light.</li><li>Make a plan for pets during the visit.</li></ul>' },
    },
  ],
}

export const teamStateKey = 'place-team-exploration-v1'
export function loadTeamState(): TeamState {
  const saved = localStorage.getItem(teamStateKey)
  if (!saved) return initialTeamState
  try {
    const state = JSON.parse(saved) as TeamState
    if (Array.isArray(state.resources) && Array.isArray(state.visible) && state.defaults && ['admin', 'member'].includes(state.role)) return state
  } catch {
    localStorage.removeItem(teamStateKey)
  }
  return initialTeamState
}
export const titleOf = (resource: TeamResource) => (resource.draft ?? resource.published)?.title ?? 'Untitled resource'
export const statusOf = (resource: TeamResource) => resource.archived ? 'Archived' : resource.published ? resource.draft ? 'Unpublished changes' : 'Published' : 'Draft'

export const teamViews = [
  { label: 'Transaction overview', href: '/team' },
  { label: 'Client preview', href: '/team/preview' },
  { label: 'Transaction resources', href: '/team/resources' },
  { label: 'Team resource library', href: '/team/library' },
  { label: 'Flow map', href: '/team/flow-map.html' },
]
