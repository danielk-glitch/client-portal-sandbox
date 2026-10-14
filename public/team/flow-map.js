const viewport = document.getElementById('viewport')
const world = document.getElementById('world')
const extent = document.getElementById('extent')
const cardLayer = document.getElementById('cards')
const detailPanel = document.getElementById('details')
const stages = [240, 800, 1360, 1920, 2480]
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
let zoom = 0.85
let panMode = false
let selected = null
let moving = null
let nodes = []
let edges = []

const icon = name => `<svg aria-hidden="true"><use href="#${name}"/></svg>`
const journeys = {
  seller: {
    stages: ['Set up', 'Go live', 'Under contract', 'Closing', 'After closing'],
    subtitles: ['Prepare the experience', 'Listing is active', 'An offer is accepted', 'Complete the sale', 'Keep useful guidance'],
    title: 'The team’s work, along the seller’s journey.',
    nodes: [
      { id: 'setup', stage: 0, lane: 0, title: 'Set up the transaction', body: 'Add the clients, team, and transaction details in Brivity.', detail: 'The portal follows the transaction record. Client invitations and access rules belong with that record.', status: 'Product boundary confirmed. The Brivity entry point will be defined separately.' },
      { id: 'launch', stage: 1, lane: 0, title: 'Manage the listing', body: 'Keep dates, milestones, and internal tasks current in Brivity.', detail: 'The standalone app is not another transaction manager. Information the client sees should come from the CRM.', status: 'Confirmed product boundary.' },
      { id: 'contract', stage: 2, lane: 0, title: 'Move the sale forward', body: 'Coordinate inspections, appraisal, and closing work in Brivity.', detail: 'Operational work remains with agents and coordinators in their existing CRM.', status: 'Confirmed product boundary.' },
      { id: 'close', stage: 3, lane: 0, title: 'Complete the transaction', body: 'Manage closing details and update the transaction record.', detail: 'Closing dates and milestones stay in Brivity. The team checks their client-facing presentation in the portal.', status: 'Confirmed product boundary.' },
      { id: 'library', stage: 0, lane: 1, title: 'Build the team library', body: 'Create reusable guides. An admin publishes the materials.', href: '/team/library', action: 'Open resource library', detail: 'Writing materials takes time. The shared library allows the team to maintain them once and reuse them across the business.', status: 'Reusable library and admin-only publishing are confirmed. Create and edit permissions remain open.' },
      { id: 'selection', stage: 1, lane: 1, title: 'Choose the right guidance', body: 'Show or hide transaction basics and published team materials.', href: '/team/resources', action: 'Open transaction resources', detail: 'Resource visibility belongs to each transaction. “Use as default” saves a starting selection for future transactions without changing existing ones.', status: 'Transaction choices and defaults are in MVP. Team-wide buyer/seller defaults and admin-only default saving are proposals.' },
      { id: 'preview', stage: 2, lane: 1, title: 'Check the client experience', body: 'Open the latest client portal with a read-only preview banner.', href: '/team/preview', action: 'Open client preview', detail: 'Preview uses the actual latest seller portal design. It opens separately so the team can return to its work without losing context.', status: 'Confirmed. Preview cannot change client document pins or publish team content.' },
      { id: 'publish', stage: 3, lane: 1, title: 'Keep a shared guide current', body: 'Edit the resource. Review its reach, then publish from the editor.', href: '/team/editor?id=team-welcome', action: 'Open resource editor', detail: 'An admin reviews the updated guide in a confirmation inside the editor. Publishing updates every linked transaction while preserving visibility choices.', status: 'Admin-only publishing and updates to every linked transaction are confirmed.' },
      { id: 'archive', stage: 4, lane: 1, title: 'Maintain the library', body: 'An admin archives materials that should no longer be selected.', href: '/team/library', action: 'Open resource library', detail: 'The library persists beyond one transaction. Keeping it relevant benefits all future clients.', status: 'Admin-only archiving is confirmed. Retaining archived content in existing transactions is a proposal.' },
      { id: 'access', stage: 0, lane: 2, title: 'A clear place to begin', body: 'The client opens the portal to understand the next steps.', detail: 'The client portal is read-only for MVP. Questions and conversations happen directly with the team.', status: 'Read-only client scope is confirmed.' },
      { id: 'listing', stage: 1, lane: 2, title: 'Follow the sale', body: 'See listing progress and the guidance selected by the team.', href: '/team/preview', action: 'View client portal', detail: 'Only published resources selected for this transaction appear. Drafts stay private to the team.', status: 'Confirmed. Stage positions illustrate a possible journey, not scheduled automation.' },
      { id: 'guidance', stage: 2, lane: 2, title: 'Understand what comes next', body: 'Read useful guidance about appraisal, inspections, and closing.', href: '/team/preview?section=resources', action: 'View client resources', detail: 'Clients can browse resources, documents, and updates without commenting or asking questions in the app.', status: 'Confirmed read-only scope.' },
      { id: 'updated', stage: 3, lane: 2, title: 'See the published update', body: 'A visible shared guide shows its latest published version.', href: '/team/preview?section=resources', action: 'View client resources', detail: 'Published content is shared. A resource hidden in this transaction remains hidden after an update.', status: 'Updates to every linked transaction are confirmed. Visibility is preserved.' },
    ],
  },
  buyer: {
    stages: ['Set up', 'Offer accepted', 'Under contract', 'Closing', 'After closing'],
    subtitles: ['Prepare the experience', 'Begin the purchase', 'Work through contingencies', 'Complete the purchase', 'Keep useful guidance'],
    title: 'The team’s work, along a buyer’s journey.',
  },
}

function makeBuyerNodes() {
  return journeys.seller.nodes.map(node => {
    const changes = {
      launch: { title: 'Manage the accepted offer', body: 'Keep the purchase dates, milestones, and internal tasks in Brivity.' },
      contract: { title: 'Move the purchase forward', body: 'Coordinate inspections, financing, and closing work in Brivity.' },
      close: { title: 'Complete the purchase', body: 'Manage closing details and update the transaction record.' },
      listing: { title: 'Follow the purchase', body: 'See progress and the buyer guidance selected by the team.' },
      guidance: { title: 'Understand the next steps', body: 'Read guidance about inspections, financing, and closing.' },
      preview: { detail: 'This points to the current buyer portal entry. That design is still a placeholder; the flow illustrates the intended shared behavior.', status: 'Shared preview behavior is planned. The buyer screen has not been designed yet.' },
    }
    let href = node.href
    if (href?.startsWith('/team/preview')) href += (href.includes('?') ? '&' : '?') + 'type=buyer'
    return { ...node, ...changes[node.id], href }
  })
}

function changeJourney(value) {
  const journey = journeys[value]
  selected = null
  detailPanel.hidden = true
  nodes = (value === 'buyer' ? makeBuyerNodes() : journey.nodes).map(node => ({ ...node, x: stages[node.stage] - 160, y: 424 + node.lane * 356 }))
  edges = [
    ['setup','launch'], ['launch','contract'], ['contract','close'],
    ['library','selection'], ['selection','preview'], ['preview','publish'], ['publish','archive'],
    ['access','listing'], ['listing','guidance'], ['guidance','updated'],
    ['setup','library'], ['library','access'], ['selection','listing'], ['contract','preview'], ['preview','guidance'], ['publish','updated'],
  ]
  document.getElementById('journey-title').textContent = journey.title
  document.getElementById('milestones').innerHTML = journey.stages.map((label,index) => `<div class="milestone ${index === 2 ? 'current' : ''}" style="left:${stages[index]}px">${label}<small>${journey.subtitles[index]}</small></div>`).join('')
  document.querySelectorAll('[data-stage]').forEach((button,index) => { button.textContent = journey.stages[index]; button.removeAttribute('aria-current') })
  cardLayer.innerHTML = nodes.map(node => `<article class="board-card" data-node="${node.id}" style="left:${node.x}px;top:${node.y}px"><button class="card-details" aria-label="${node.title}"><span class="card-top"><span class="card-kind">${['BRIVITY','TEAM WORKSPACE','CLIENT PORTAL'][node.lane]}</span>${icon(node.lane === 0 ? 'home' : 'book')}</span><h3>${node.title}</h3><p>${node.body}</p>${node.href ? '' : `<span class="decision">${node.lane === 0 ? 'Transaction record' : 'Read-only portal'}</span>`}</button>${node.href ? `<a class="flow-page-button" href="${node.href}" ${node.href.startsWith('/team/preview') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${node.action}${icon('arrow-up-right')}</a>` : ''}</article>`).join('')
  cardLayer.querySelectorAll('.card-details').forEach(button => {
    button.addEventListener('click', () => { if (!panMode) selectNode(button.closest('[data-node]').dataset.node) })
  })
  viewport.scrollTo({ left: 0, top: 0 })
  requestAnimationFrame(drawConnections)
}

function drawConnections() {
  document.getElementById('edge-paths').innerHTML = edges.map(([fromId,toId]) => {
    const from = nodes.find(node => node.id === fromId), to = nodes.find(node => node.id === toId)
    const fromCard = cardLayer.querySelector(`[data-node="${fromId}"]`), toCard = cardLayer.querySelector(`[data-node="${toId}"]`)
    const vertical = from.lane !== to.lane
    let path
    if (vertical) {
      const x1 = from.x + 160, y1 = from.y + fromCard.offsetHeight, x2 = to.x + 160, y2 = to.y - 8, mid = (y1 + y2) / 2
      path = `M${x1},${y1} C${x1},${mid} ${x2},${mid} ${x2},${y2}`
    } else {
      const x1 = from.x + 320, y1 = from.y + fromCard.offsetHeight / 2, x2 = to.x - 8, y2 = to.y + toCard.offsetHeight / 2, mid = (x1 + x2) / 2
      path = `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`
    }
    return `<path class="connection ${vertical ? 'cross-lane' : ''}" d="${path}"/>`
  }).join('')
}

function selectNode(id) {
  selected = nodes.find(node => node.id === id)
  cardLayer.querySelectorAll('[data-node]').forEach(card => card.classList.toggle('selected',card.dataset.node === id))
  const link = selected.href ? `<a class="flow-page-button" href="${selected.href}" ${selected.href.startsWith('/team/preview') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${selected.action}${icon('arrow-up-right')}</a>` : ''
  document.getElementById('details-content').innerHTML = `<h2>${selected.title}</h2><p>${selected.body}</p><div class="detail-label">WHAT HAPPENS HERE</div><p>${selected.detail}</p><div class="detail-label">DECISION STATUS</div><p>${selected.status}</p>${link}`
  detailPanel.hidden = false
}

function setZoom(next, point) {
  const anchor = point ?? { x: viewport.clientWidth / 2, y: viewport.clientHeight / 2 }
  const position = { x: (viewport.scrollLeft + anchor.x) / zoom, y: (viewport.scrollTop + anchor.y) / zoom }
  zoom = Math.max(0.25,Math.min(1.5,next))
  world.style.transform = `scale(${zoom})`
  extent.style.width = `${2860 * zoom}px`
  extent.style.height = `${1440 * zoom + 100}px`
  document.getElementById('zoom-value').textContent = `${Math.round(zoom * 100)}%`
  viewport.scrollLeft = position.x * zoom - anchor.x
  viewport.scrollTop = position.y * zoom - anchor.y
}
function fit() {
  setZoom(Math.min((viewport.clientWidth - 48) / 2860, (viewport.clientHeight - 120) / 1440))
  viewport.scrollTo({ left: 0, top: 0, behavior: reducedMotion ? 'instant' : 'smooth' })
}
function setTool(pan) {
  panMode = pan
  viewport.classList.toggle('pan-mode',pan)
  document.getElementById('pan-tool').setAttribute('aria-pressed',String(pan))
  document.getElementById('select-tool').setAttribute('aria-pressed',String(!pan))
}

viewport.addEventListener('pointerdown',event => {
  if (event.button !== 0 || event.target.closest('a') || event.pointerType === 'touch') return
  if (event.target.closest('[data-node]') && !panMode) return
  moving = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop }
  viewport.setPointerCapture(event.pointerId)
  viewport.classList.add('dragging')
  event.preventDefault()
})
viewport.addEventListener('pointermove',event => {
  if (!moving) return
  viewport.scrollLeft = moving.left - (event.clientX - moving.x)
  viewport.scrollTop = moving.top - (event.clientY - moving.y)
})
function finishMove(event) {
  moving = null
  viewport.classList.remove('dragging')
  if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)
}
viewport.addEventListener('pointerup',finishMove)
viewport.addEventListener('pointercancel',finishMove)
viewport.addEventListener('wheel',event => {
  if (!(event.ctrlKey || event.metaKey)) return
  event.preventDefault()
  const bounds = viewport.getBoundingClientRect()
  setZoom(zoom * Math.exp(-event.deltaY * 0.002),{ x: event.clientX - bounds.left, y: event.clientY - bounds.top })
},{passive:false})
viewport.addEventListener('keydown',event => {
  if (event.target !== viewport) return
  const amounts = { ArrowRight:[160,0], ArrowLeft:[-160,0], ArrowDown:[0,160], ArrowUp:[0,-160] }
  if (amounts[event.key]) { event.preventDefault(); viewport.scrollBy(...amounts[event.key]) }
  if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom + .1) }
  if (event.key === '-') { event.preventDefault(); setZoom(zoom - .1) }
  if (event.key === '0') { event.preventDefault(); fit() }
})
document.getElementById('transaction').addEventListener('change',event=>changeJourney(event.target.value))
document.getElementById('zoom-in').addEventListener('click',()=>setZoom(zoom + .1))
document.getElementById('zoom-out').addEventListener('click',()=>setZoom(zoom - .1))
document.getElementById('fit').addEventListener('click',fit)
document.getElementById('pan-tool').addEventListener('click',()=>setTool(true))
document.getElementById('select-tool').addEventListener('click',()=>setTool(false))
document.getElementById('close-details').addEventListener('click',()=>{detailPanel.hidden=true; cardLayer.querySelector(`[data-node="${selected?.id}"]`)?.querySelector('.card-details')?.focus()})
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.getElementById('close-details').click()})
document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{
  const stage = Number(button.dataset.stage)
  viewport.scrollTo({ left: stages[stage] * zoom - viewport.clientWidth / 2, top: 160 * zoom, behavior: reducedMotion ? 'instant' : 'smooth' })
  document.querySelectorAll('[data-stage]').forEach(item=>item.removeAttribute('aria-current'))
  button.setAttribute('aria-current','step')
}))
setZoom(zoom,{x:0,y:0})
changeJourney('seller')
document.fonts.ready.then(drawConnections)
