/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { useEffect, useRef, useState } from 'react'
import { Box, Button, Dialog, DialogContent, Drawer, IconButton, Typography } from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import ChevronLeftOutlined from '@mui/icons-material/ChevronLeftOutlined'
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
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
type CarouselCategory = Exclude<MarketingMaterial['category'], 'Videos'>
const navigation: Array<{ id: MarketingDashboardSection; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'materials', label: 'Materials' },
  { id: 'feedback', label: 'Showing feedback' },
  { id: 'activity', label: 'Advertising' },
]

export function MarketingDashboardSheet({ open, onClose, initialSection, transaction, data }: MarketingDashboardSheetProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const carouselRefs = useRef<Partial<Record<CarouselCategory, HTMLDivElement | null>>>({})
  const [selectedMaterial, setSelectedMaterial] = useState<MarketingMaterial | null>(null)
  const [carouselBounds, setCarouselBounds] = useState<Record<CarouselCategory, { left: boolean; right: boolean }>>({
    'Social graphics': { left: false, right: false },
    'Printed media': { left: false, right: false },
  })
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

  useEffect(() => {
    if (!open) return
    const update = () => {
      for (const category of ['Social graphics', 'Printed media'] as const) {
        const carousel = carouselRefs.current[category]
        if (!carousel) continue
        const next = {
          left: carousel.scrollLeft > 2,
          right: carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 2,
        }
        setCarouselBounds((current) => current[category].left === next.left && current[category].right === next.right
          ? current
          : { ...current, [category]: next })
      }
    }
    const frame = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    for (const carousel of Object.values(carouselRefs.current)) if (carousel) observer.observe(carousel)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [open, materials])

  function closeSheet() {
    setSelectedMaterial(null)
    onClose()
  }

  function goToSection(section: MarketingDashboardSection) {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    scrollRef.current?.querySelector(`#marketing-dashboard-${section}`)?.scrollIntoView({ behavior, block: 'start' })
  }

  function scrollMaterials(category: CarouselCategory, direction: -1 | 1) {
    const carousel = carouselRefs.current[category]
    if (!carousel) return
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    carousel.scrollBy({ left: direction * carousel.clientWidth * 0.8, behavior })
  }

  function updateCarouselBounds(category: CarouselCategory) {
    const carousel = carouselRefs.current[category]
    if (!carousel) return
    const next = {
      left: carousel.scrollLeft > 2,
      right: carousel.scrollLeft < carousel.scrollWidth - carousel.clientWidth - 2,
    }
    setCarouselBounds((current) => current[category].left === next.left && current[category].right === next.right
      ? current
      : { ...current, [category]: next })
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={closeSheet}
      className="listing-sheet-root marketing-dashboard-root"
      slotProps={{ paper: { className: 'listing-sheet-paper marketing-dashboard-paper', role: 'dialog', 'aria-label': `Listing marketing for ${listing.address}` } }}
    >
      <Box ref={scrollRef} className="listing-sheet-scroll marketing-dashboard-scroll">
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
            <Box className="marketing-dashboard-metrics">
              {data.channels.map((channel) => (
                <Box key={channel.label} className="marketing-dashboard-metric">
                  <Typography variant="metricL" className="marketing-dashboard-metric-number">{channel.count}</Typography>
                  <Typography variant="bodyLStandard" className="marketing-dashboard-metric-label">{channel.label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="section" id="marketing-dashboard-materials" className="marketing-dashboard-section marketing-dashboard-materials" aria-labelledby="marketing-dashboard-materials-title">
            <Box className="marketing-dashboard-section-intro">
              <Box>
                <Typography component="h2" variant="titleM" id="marketing-dashboard-materials-title">Marketing materials</Typography>
                <Typography variant="bodyMStandard" color="text.secondary">The creative your team has produced for your home.</Typography>
              </Box>
              <Typography variant="labelM" color="text.secondary">{materials.length} materials</Typography>
            </Box>

            {categories.map((category) => {
              const categoryMaterials = materials.filter((material) => material.category === category)
              const isCarousel = category !== 'Videos'
              return (
                <Box component="section" key={category} className="marketing-dashboard-category" aria-label={category}>
                  <Box className="marketing-dashboard-category-heading">
                    <Box className="marketing-dashboard-category-title">
                      <Typography component="h3" variant="titleS">{category}</Typography>
                      <Typography variant="labelM" color="text.secondary">{categoryMaterials.length}</Typography>
                    </Box>
                    {isCarousel && (
                      <Box className="marketing-dashboard-carousel-controls">
                        <IconButton aria-label={`Scroll ${category.toLowerCase()} left`} disabled={!carouselBounds[category].left} onClick={() => scrollMaterials(category, -1)}><ChevronLeftOutlined /></IconButton>
                        <IconButton aria-label={`Scroll ${category.toLowerCase()} right`} disabled={!carouselBounds[category].right} onClick={() => scrollMaterials(category, 1)}><ChevronRightOutlined /></IconButton>
                      </Box>
                    )}
                  </Box>
                  <Box
                    className={isCarousel ? 'marketing-dashboard-material-carousel' : 'marketing-dashboard-material-grid'}
                    data-category={category}
                    ref={isCarousel ? (node: HTMLDivElement | null) => { carouselRefs.current[category] = node } : undefined}
                    onScroll={isCarousel ? () => updateCarouselBounds(category) : undefined}
                    role={isCarousel ? 'region' : undefined}
                    aria-label={isCarousel ? `${category} previews` : undefined}
                    tabIndex={isCarousel ? 0 : undefined}
                  >
                    {categoryMaterials.map((material) => (
                      <Box component="button" type="button" key={material.id} className="marketing-material-card" onClick={() => setSelectedMaterial(material)} aria-label={`View ${material.title}`}>
                        <MaterialPreview material={material} photos={photos} address={listing.address} />
                        <Box className="marketing-material-caption">
                          <Typography variant="bodySStandard">{material.title}</Typography>
                          <Typography variant="labelS" color="text.secondary">{material.format} · {material.date}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            })}
          </Box>

          <Box className="marketing-dashboard-history">
            <Box component="section" id="marketing-dashboard-feedback" className="marketing-dashboard-section marketing-dashboard-history-section" aria-labelledby="marketing-dashboard-feedback-title">
              <Box className="marketing-dashboard-section-intro">
                <Typography component="h2" variant="titleM" id="marketing-dashboard-feedback-title">Showing feedback</Typography>
                <Typography variant="labelM" color="text.secondary">{transaction.feedback.length} responses</Typography>
              </Box>
              <TransactionRowList>
                {transaction.feedback.map((item) => <ShowingFeedbackRow key={item.id} feedback={item} />)}
              </TransactionRowList>
            </Box>
            <Box component="section" id="marketing-dashboard-activity" className="marketing-dashboard-section marketing-dashboard-history-section" aria-labelledby="marketing-dashboard-activity-title">
              <Box className="marketing-dashboard-section-intro">
                <Typography component="h2" variant="titleM" id="marketing-dashboard-activity-title">Advertising updates</Typography>
                <Typography variant="labelM" color="text.secondary">{transaction.advertising.length} updates</Typography>
              </Box>
              <TransactionRowList>
                {transaction.advertising.map((event) => <AdvertisingRow key={event.id} event={event} compact />)}
              </TransactionRowList>
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={selectedMaterial !== null} onClose={() => setSelectedMaterial(null)} fullWidth maxWidth="sm" aria-label={selectedMaterial ? `${selectedMaterial.title} preview` : undefined}>
        {selectedMaterial && (
          <DialogContent className="marketing-material-dialog-content">
            <IconButton onClick={() => setSelectedMaterial(null)} aria-label="Close material preview" className="marketing-material-dialog-close"><CloseOutlined /></IconButton>
            <MaterialPreview material={selectedMaterial} photos={photos} address={listing.address} />
            <Box className="marketing-material-dialog-caption">
              <Typography variant="titleS">{selectedMaterial.title}</Typography>
              <Typography variant="bodySStandard" color="text.secondary">{selectedMaterial.format} · {selectedMaterial.date}</Typography>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Drawer>
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
