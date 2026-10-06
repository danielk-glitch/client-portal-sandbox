/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useState } from 'react'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import { brandAssets } from '../assets/brand'
import { SegmentedSwitch, type SegmentedSwitchOption } from '../components/SegmentedSwitch'
import { sampleSellerTransaction } from '../seller-portal/sellerTransaction'
import { EmailPreview } from './EmailPreview'
import { emailTemplates, type Audience, type EmailTemplate } from './emailTemplates'
import './email-gallery.css'

const agent = sampleSellerTransaction.team.find((member) => member.id === sampleSellerTransaction.teamBrand.leadAgentId)!
const audienceOptions: readonly SegmentedSwitchOption<Audience>[] = [
  { value: 'seller', label: 'Seller' },
  { value: 'buyer', label: 'Buyer' },
]
const previewWidthOptions: readonly SegmentedSwitchOption<'desktop' | 'mobile'>[] = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
]

function selectionFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('template')
  const selected = emailTemplates.find((template) => template.id === id)
  const audience = params.get('audience') === 'buyer' ? 'buyer' : 'seller'
  return selected ?? emailTemplates.find((template) => template.audience === audience)!
}

function setReviewUrl(template: EmailTemplate) {
  const url = new URL(window.location.href)
  url.searchParams.set('audience', template.audience)
  url.searchParams.set('template', template.id)
  window.history.replaceState({}, '', url)
}

export function EmailGallery() {
  const [selected, setSelected] = useState<EmailTemplate>(selectionFromUrl)
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'mobile'>('desktop')
  const visible = emailTemplates.filter((template) => template.audience === selected.audience)
  const currentIndex = visible.findIndex((template) => template.id === selected.id)

  useEffect(() => {
    const onPopState = () => setSelected(selectionFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function select(template: EmailTemplate) {
    setSelected(template)
    setReviewUrl(template)
  }

  function selectAudience(audience: Audience) {
    select(emailTemplates.find((template) => template.audience === audience && template.kind === selected.kind)!)
  }

  function step(direction: -1 | 1) {
    select(visible[(currentIndex + direction + visible.length) % visible.length])
  }

  return (
    <div className="email-gallery-page presentation-dark">
      <header className="email-gallery-site-header">
        <a href="/" aria-label="PLACE product sandbox home"><img src={brandAssets.place.wordmarkDefault} alt="PLACE" /></a>
        <span className="email-gallery-header-divider" aria-hidden="true" />
        <span>Client portal</span>
        <a className="email-gallery-back" href="/">All previews</a>
      </header>

      <main className="email-gallery-main">
        <div className="email-gallery-heading">
          <div>
            <span className="email-gallery-eyebrow">Communications · Review gallery</span>
            <h1>Email templates</h1>
            <p>Review what clients will receive, why it is sent, and how it appears in their inbox.</p>
          </div>
          <SegmentedSwitch options={audienceOptions} value={selected.audience} onChange={selectAudience} aria-label="Client view" />
        </div>

        <section className="email-gallery-navigation" aria-label="Email templates">
          <div className="email-gallery-nav-top">
            <div>
              <span className="email-gallery-eyebrow">In the journey</span>
              <p>{currentIndex + 1} of {visible.length} emails</p>
            </div>
            <div className="email-gallery-nav-actions">
              <label htmlFor="email-quick-jump">Jump to email</label>
              <select id="email-quick-jump" value={selected.id} onChange={(event) => select(emailTemplates.find((template) => template.id === event.target.value)!)}>
                {visible.map((template) => <option key={template.id} value={template.id}>{template.stage} · {template.title}</option>)}
              </select>
              <button className="email-step" type="button" aria-label="Previous email" onClick={() => step(-1)}><ArrowBackOutlined fontSize="small" /></button>
              <button className="email-step" type="button" aria-label="Next email" onClick={() => step(1)}><ArrowForwardOutlined fontSize="small" /></button>
            </div>
          </div>
          <div className="email-template-rail">
            {visible.map((template, index) => (
              <button className="email-template-tab" type="button" aria-current={selected.id === template.id ? 'true' : undefined} onClick={() => select(template)} key={template.id}>
                <span className="email-template-tab-top"><span>0{index + 1}</span><span>{template.stage}</span></span>
                <strong>{template.title}</strong>
              </button>
            ))}
          </div>
        </section>

        <div className="email-gallery-review-grid">
          <section className="email-review-panel" aria-labelledby="email-review-title">
            <span className="email-gallery-eyebrow">{selected.audience} · {selected.stage}</span>
            <h2 id="email-review-title">{selected.title}</h2>
            <p className="email-review-summary">{selected.summary}</p>

            <div className="email-review-detail">
              <span>Sent when</span>
              <p>{selected.trigger}</p>
            </div>
            <div className="email-review-detail">
              <span>From</span>
              <p>{agent.name} · {sampleSellerTransaction.teamBrand.name}</p>
            </div>
            <div className="email-review-detail">
              <span>Subject</span>
              <p>{selected.subject}</p>
            </div>
            <div className="email-review-detail">
              <span>Preview text</span>
              <p>{selected.preheader}</p>
            </div>

            <div className="email-review-notes">
              <div className="email-review-notes-heading"><h3>For reviewers</h3><span>Draft</span></div>
              <ul>{selected.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            </div>
          </section>

          <section className="email-preview-panel" aria-label="Email preview">
            <div className="email-preview-toolbar">
              <div>
                <span className="email-gallery-eyebrow">Email preview</span>
                <p>Sample recipient: John Doe</p>
              </div>
              <SegmentedSwitch options={previewWidthOptions} value={previewWidth} onChange={setPreviewWidth} size="s" aria-label="Preview width" />
            </div>
            <div className="email-inbox-meta">
              <div><span>From</span><strong>{agent.name} &lt;{agent.email}&gt;</strong></div>
              <div><span>To</span><strong>John Doe &lt;john.doe@example.com&gt;</strong></div>
              <div><span>Subject</span><strong>{selected.subject}</strong></div>
            </div>
            <div className={`email-preview-stage email-preview-stage--${previewWidth}`}>
              <div className="email-preview-frame"><EmailPreview template={selected} /></div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
