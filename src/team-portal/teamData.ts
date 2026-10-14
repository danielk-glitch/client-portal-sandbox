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
export type TransactionKind = 'buyer' | 'seller'
export type DefaultSelection = { visible: string[]; updatedBy: string; updatedOn: string }
export type TeamRole = 'admin' | 'member'
export type TeamState = {
  resources: TeamResource[]
  visible: string[]
  defaults: Record<TransactionKind, DefaultSelection | null>
  role: TeamRole
}
export const initialTeamState: TeamState = {
  role: 'admin',
  defaults: {
    seller: { visible: ['disclosures', 'closing', 'team-welcome', 'team-moving'], updatedBy: 'Avery Coleman', updatedOn: 'Sep 30, 2026' },
    buyer: null,
  },
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

export const teamStateKey = 'place-team-exploration-v2'
export function loadTeamState(): TeamState {
  const saved = localStorage.getItem(teamStateKey)
  if (!saved) return initialTeamState
  try {
    const state = JSON.parse(saved) as TeamState
    if (Array.isArray(state.resources) && Array.isArray(state.visible) && state.defaults && 'seller' in state.defaults && ['admin', 'member'].includes(state.role)) return state
  } catch {
    localStorage.removeItem(teamStateKey)
  }
  return initialTeamState
}
export const titleOf = (resource: TeamResource) => (resource.draft ?? resource.published)?.title ?? 'Untitled resource'
export const statusOf = (resource: TeamResource) => resource.archived ? 'Archived' : resource.published ? resource.draft ? 'Unpublished changes' : 'Published' : 'Draft'

/** Number of transactions where this resource is live. Sample data: `linked` counts other transactions. */
export const liveCount = (resource: TeamResource, state: TeamState) => resource.linked + (state.visible.includes(resource.id) && resource.linked === 0 ? 1 : 0)

/** Resources a default can include: published and not archived. */
export const selectableResources = (state: TeamState) => state.resources.filter(resource => resource.published && !resource.archived)

/** Ids that differ between a transaction's visible set and a saved default. */
export function defaultDifferences(state: TeamState, selection: DefaultSelection | null) {
  const ids = selectableResources(state).map(resource => resource.id)
  const current = new Set(state.visible.filter(id => ids.includes(id)))
  const saved = new Set((selection?.visible ?? []).filter(id => ids.includes(id)))
  return { shown: [...current].filter(id => !saved.has(id)), hidden: [...saved].filter(id => !current.has(id)) }
}

/** Review the member experience with `?as=member`. Sample only, not permission enforcement. */
export function roleFromUrl(fallback: TeamRole): TeamRole {
  const requested = new URLSearchParams(window.location.search).get('as')
  return requested === 'member' || requested === 'admin' ? requested : fallback
}
export const teamPeople = {
  admin: { name: 'Avery Coleman', role: 'Admin', photoId: 'agent' },
  member: { name: 'Morgan Ellis', role: 'Transaction coordinator', photoId: 'transaction' },
} as const

export const teamViews = [
  { label: 'Transaction overview', href: '/team' },
  { label: 'Client preview', href: '/team/preview' },
  { label: 'Transaction resources', href: '/team/resources' },
  { label: 'Team resource library', href: '/team/library' },
  { label: 'Team defaults', href: '/team/defaults' },
  { label: 'Member view of the library', href: '/team/library?as=member' },
  { label: 'Flow map', href: '/team/flow-map.html' },
]
