/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useRef, useState } from 'react'
import { useHorizontalScrollBounds } from '../hooks/useHorizontalScrollBounds'
import { Box, Button, IconButton, Typography } from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined'
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import { PlaceModal } from '../components/PlaceModal'
import { PlaceSheet } from '../components/PlaceSheet'
import { HeadlineStat, Stat } from '../components/Stat'
import { AdvertisingRow, ShowingFeedbackRow, TransactionRowList } from '../transaction-portal/components'
import type { SellerTransaction } from './sellerTransaction'
import type { MarketingSnapshotData } from './MarketingSnapshot'
import type { MarketingMaterial } from './marketingMaterials'
import './listing-details.css'
import './marketing-dashboard.css'

export type MarketingDashboardSection = 'overview' | 'materials' | 'activity' | 'feedback'

type MarketingDashboardSheetProps = {
  open: boolean
  onClose: () => void
  initialSection: MarketingDashboardSection
  transaction: SellerTransaction
  data: MarketingSnapshotData
}

const categories: MarketingMaterial['category'][] = ['Social graphics', 'Printed media', 'Videos']
const navigation: Array<{ id: MarketingDashboardSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'feedback', label: 'Showing feedback' },
  { id: 'activity', label: 'Advertising' },
  { id: 'materials', label: 'Materials' },
]

export function MarketingDashboardSheet({ open, onClose, initialSection, transaction, data }: MarketingDashboardSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<MarketingMaterial | null>(null)
  const { listing } = transaction
  const materials = data.materials
  const photos = listing.photos.length > 0
    ? listing.photos
    : listing.photoUrl ? [{ url: listing.photoUrl, alt: `Exterior of ${listing.address}` }] : []

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      if (initialSection === 'overview') scrollRef.current?.scrollTo({ top: 0 })
      else scrollRef.current?.querySelector(`#marketing-dashboard-${initialSection}`)?.scrollIntoView({ block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [open, initialSection])

  function closeSheet() {
    setSelectedMaterial(null)
    onClose()
  }

  function goToSection(section: MarketingDashboardSection) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    scrollRef.current?.querySelector(`#marketing-dashboard-${section}`)?.scrollIntoView({ behavior, block: 'start' })
  }

  return (
    <PlaceSheet
      open={open}
      onClose={closeSheet}
      className="listing-sheet-root marketing-dashboard-root"
      paperClassName="listing-sheet-paper marketing-dashboard-paper"
      label={`Listing marketing for ${listing.address}`}
    >
      <Box ref={scrollRef} className="place-sheet-scroll listing-sheet-scroll marketing-dashboard-scroll">
        <Box component="header" className="marketing-dashboard-hero">
          {listing.photoUrl && <Box component="img" src={listing.photoUrl} alt="" className="marketing-dashboard-hero-image" />}
          <Box className="marketing-dashboard-hero-copy">
            <Typography component="h1" variant="displayS">Your Listing Marketing Dashboard</Typography>
            <Typography variant="bodyMStandard">{listing.address} · {listing.city}, {listing.state}</Typography>
          </Box>
          <IconButton onClick={closeSheet} aria-label="Close marketing dashboard" className="listing-sheet-close">
            <CloseOutlined />
          </IconButton>
        </Box>

        <Box className="marketing-dashboard-content">
          <Box component="nav" className="marketing-dashboard-nav" aria-label="Marketing dashboard sections">
            {navigation.map(({ id, label }) => (
              <Button key={id} variant="text" onClick={() => goToSection(id)}>{label}</Button>
            ))}
          </Box>

          <Box component="section" id="marketing-dashboard-overview" className="marketing-dashboard-overview" aria-labelledby="marketing-dashboard-overview-title">
            <Box className="marketing-dashboard-section-intro">
              <Box>
                <Typography component="h2" variant="titleM" id="marketing-dashboard-overview-title">Marketing at a glance</Typography>
                <Typography variant="bodyMStandard" color="text.secondary">A look at the work your team has put behind your listing.</Typography>
              </Box>
            </Box>
            {data.insights && (
              <Box className="marketing-dashboard-insights" aria-label="Listing performance">
                <HeadlineStat label="Total listing views" value={data.insights.totalViews.toLocaleString('en-US')} context="Across listing sites" className="marketing-dashboard-insights-primary" />
                <Box className="marketing-dashboard-insights-secondary">
                  <Stat value={data.insights.uniqueVisitors.toLocaleString('en-US')} label="Unique visitors" />
                  <Stat value={data.insights.saves.toLocaleString('en-US')} label="Saves" />
                  <Stat value={data.insights.socialReach.toLocaleString('en-US')} label="People reached on social" />
                </Box>
              </Box>
            )}
            <Box className="marketing-dashboard-metrics">
              {data.channels.map((channel) => (
                <Box key={channel.label} className="marketing-dashboard-metric">
                  <Typography variant="metricL" className="marketing-dashboard-metric-number">{channel.count}</Typography>
                  <Typography variant="bodyLStandard" className="marketing-dashboard-metric-label">{channel.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="marketing-dashboard-history">
            <Box component="section" id="marketing-dashboard-feedback" className="marketing-dashboard-section marketing-dashboard-history-section" aria-labelledby="marketing-dashboard-feedback-title">
              <Box className="marketing-dashboard-section-intro">
                <Typography component="h2" variant="titleM" id="marketing-dashboard-feedback-title">Showing feedback</Typography>
                <Typography variant="labelM" className="marketing-dashboard-count">{transaction.feedback.length} responses</Typography>
              </Box>
              <TransactionRowList>
                {transaction.feedback.map((item) => <ShowingFeedbackRow key={item.id} feedback={item} />)}
              </TransactionRowList>
            </Box>
            <Box component="section" id="marketing-dashboard-activity" className="marketing-dashboard-section marketing-dashboard-history-section" aria-labelledby="marketing-dashboard-activity-title">
              <Box className="marketing-dashboard-section-intro">
                <Typography component="h2" variant="titleM" id="marketing-dashboard-activity-title">Advertising updates</Typography>
                <Typography variant="labelM" className="marketing-dashboard-count">{transaction.advertising.length} updates</Typography>
              </Box>
              <TransactionRowList>
                {transaction.advertising.map((event) => <AdvertisingRow key={event.id} event={event} compact />)}
              </TransactionRowList>
            </Box>
          </Box>

          <Box component="section" id="marketing-dashboard-materials" className="marketing-dashboard-section marketing-dashboard-materials" aria-labelledby="marketing-dashboard-materials-title">
            <Box className="marketing-dashboard-section-intro">
              <Box>
                <Box className="marketing-dashboard-category-title">
                  <Typography component="h2" variant="titleM" id="marketing-dashboard-materials-title">Marketing materials</Typography>
                  <Typography variant="labelM" className="marketing-dashboard-count" aria-label={`${materials.length} materials`}>{materials.length}</Typography>
                </Box>
                <Typography variant="bodyMStandard" color="text.secondary">The creative your team has produced for your home.</Typography>
              </Box>
            </Box>

            {categories.map((category) => (
              <MaterialCategory
                key={category}
                category={category}
                materials={materials.filter((material) => material.category === category)}
                carousel={category !== 'Videos'}
                photos={photos}
                address={listing.address}
                onSelect={setSelectedMaterial}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <MaterialPreviewModal material={selectedMaterial} photos={photos} address={listing.address} onClose={() => setSelectedMaterial(null)} />
    </PlaceSheet>
  )
}

/** One materials category: heading with a count, then a scrolling carousel (with arrows) or a grid. */
function MaterialCategory({ category, materials, carousel, photos, address, onSelect }: {
  category: MarketingMaterial['category']
  materials: MarketingMaterial[]
  carousel: boolean
  photos: Array<{ url: string; alt: string }>
  address: string
  onSelect: (material: MarketingMaterial) => void
}) {
  const scroller = useHorizontalScrollBounds<HTMLDivElement>()
  return (
    <Box component="section" className="marketing-dashboard-category" aria-label={category}>
      <Box className="marketing-dashboard-category-heading">
        <Box className="marketing-dashboard-category-title">
          <Typography component="h3" variant="titleS">{category}</Typography>
          <Typography variant="labelM" className="marketing-dashboard-count">{materials.length}</Typography>
        </Box>
        {carousel && (
          <Box className="marketing-dashboard-carousel-controls">
            <IconButton aria-label={`Scroll ${category.toLowerCase()} left`} disabled={!scroller.bounds.left} onClick={() => scroller.scrollByPage(-1)}><ChevronLeftOutlined /></IconButton>
            <IconButton aria-label={`Scroll ${category.toLowerCase()} right`} disabled={!scroller.bounds.right} onClick={() => scroller.scrollByPage(1)}><ChevronRightOutlined /></IconButton>
          </Box>
        )}
      </Box>
      <Box
        className={carousel ? 'marketing-dashboard-material-carousel' : 'marketing-dashboard-material-grid'}
        data-category={category}
        ref={carousel ? scroller.ref : undefined}
        onScroll={carousel ? scroller.onScroll : undefined}
        role={carousel ? 'region' : undefined}
        aria-label={carousel ? `${category} previews` : undefined}
        tabIndex={carousel ? 0 : undefined}
      >
        {materials.map((material) => (
          <Box component="button" type="button" key={material.id} className="marketing-material-card" onClick={() => onSelect(material)} aria-label={`View ${material.title}`}>
            <MaterialPreview material={material} photos={photos} address={address} />
            <Box className="marketing-material-caption">
              <Typography variant="bodySStandard">{material.title}</Typography>
              <Typography variant="labelS" color="text.secondary">{material.format} · {material.date}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function MaterialPreviewModal({ material, photos, address, onClose }: {
  material: MarketingMaterial | null
  photos: Array<{ url: string; alt: string }>
  address: string
  onClose: () => void
}) {
  // Keep the last material while the modal animates closed.
  const [shown, setShown] = useState(material)
  if (material && material !== shown) setShown(material)
  const current = material ?? shown
  if (!current) return null
  return (
    <PlaceModal open={material !== null} onClose={onClose} title={current.title} description={`${current.format} · ${current.date}`} size="s" closeLabel="Close material preview" className="marketing-material-modal">
      <MaterialPreview material={current} photos={photos} address={address} />
    </PlaceModal>
  )
}

function MaterialPreview({ material, photos, address }: {
  material: MarketingMaterial
  photos: Array<{ url: string; alt: string }>
  address: string
}) {
  const photo = photos[material.imageIndex % photos.length]
  return (
    <Box className="marketing-material-preview" data-design={material.design} data-format={material.format} style={{ aspectRatio: material.aspectRatio }}>
      {photo && <Box component="img" src={photo.url} alt="" />}
      <Box className="marketing-material-art-copy">
        <Typography variant="labelS" className="marketing-material-art-brand">PLACE</Typography>
        <Typography variant="titleS" className="marketing-material-art-headline">{material.headline}</Typography>
        <Typography variant="labelS" className="marketing-material-art-address">{address}</Typography>
      </Box>
      {material.design === 'video' && <Box className="marketing-material-play"><PlayArrowRounded /></Box>}
    </Box>
  )
}
