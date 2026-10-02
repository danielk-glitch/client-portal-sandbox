/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Avatar, Box, Button, Chip, Divider, Drawer, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import GridViewOutlined from '@mui/icons-material/GridViewOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import type { ListingFact, SellerTransaction } from './sellerTransaction'
import './listing-details.css'

type ListingDetailsSheetProps = {
  open: boolean
  onClose: () => void
  transaction: SellerTransaction
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function ListingDetailsSheet({ open, onClose, transaction }: ListingDetailsSheetProps) {
  const [photoView, setPhotoView] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)
  const showAllButtonRef = useRef<HTMLButtonElement>(null)
  const { listing, details, teamBrand } = transaction
  const leadAgent = transaction.team.find((member) => member.id === teamBrand.leadAgentId)
  const photos = listing.photos.length > 0
    ? listing.photos
    : listing.photoUrl ? [{ url: listing.photoUrl, alt: `Exterior of ${listing.address}` }] : []
  const highlights = details.property.filter(({ label }) => ['Bedrooms', 'Bathrooms', 'Interior size', 'Lot size'].includes(label))
  const { latitude, longitude, zoom } = details.approximateMapPin
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`

  useEffect(() => {
    if (!open) setPhotoView(false)
  }, [open])

  function showPhotos() {
    setPhotoView(true)
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0 })
      backButtonRef.current?.focus({ preventScroll: true })
    })
  }

  function showListing() {
    setPhotoView(false)
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0 })
      showAllButtonRef.current?.focus({ preventScroll: true })
    })
  }

  function closeSheet() {
    setPhotoView(false)
    onClose()
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={closeSheet}
      className="listing-sheet-root"
      slotProps={{ paper: { className: 'listing-sheet-paper', role: 'dialog', 'aria-label': `${photoView ? 'Photos' : 'Listing'} for ${listing.address}` } }}
    >
      <Box ref={scrollRef} className="listing-sheet-scroll">
        {photoView ? (
          <>
            <Box component="header" className="listing-photo-view-header">
              <Button ref={backButtonRef} variant="text" startIcon={<ArrowBackOutlined />} onClick={showListing} className="listing-photo-back">
                Back to listing
              </Button>
              <Typography variant="labelM" className="listing-photo-view-count">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </Typography>
              <IconButton onClick={closeSheet} aria-label="Close listing details" className="listing-photo-view-close">
                <CloseOutlined />
              </IconButton>
            </Box>
            <PhotoFeed photos={photos} />
          </>
        ) : (
          <>
            <Box component="section" aria-label="Property photos" className="listing-sheet-gallery">
              <IconButton onClick={closeSheet} aria-label="Close listing details" className="listing-sheet-close">
                <CloseOutlined />
              </IconButton>
              {photos.length > 0 ? (
                <>
                  <Box className="listing-sheet-photo-grid" data-count={Math.min(photos.length, 5)}>
                    {photos.slice(0, 5).map((photo, index) => (
                      <Box component="img" key={`${photo.url}-${index}`} src={photo.url} alt={photo.alt} className="listing-sheet-grid-photo" />
                    ))}
                  </Box>
                  <Button
                    ref={showAllButtonRef}
                    variant="contained"
                    startIcon={<GridViewOutlined />}
                    onClick={showPhotos}
                    className="listing-sheet-see-all"
                  >
                    See all {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                  </Button>
                </>
              ) : (
                <Box className="listing-sheet-no-photo">
                  <ImageOutlined />
                  <Typography variant="bodySStandard">Property photos will appear here</Typography>
                </Box>
              )}
            </Box>
            <Box className="listing-sheet-content">
              <Box className="listing-sheet-intro">
                <Box>
                  <Typography variant="labelS" className="listing-sheet-eyebrow">{details.propertyType} · {listing.city}, {listing.state}</Typography>
                  <Typography component="h1" variant="titleL" className="listing-sheet-address">{listing.address}</Typography>
                  <Typography variant="bodyMStandard" color="text.secondary">
                    {listing.city}, {listing.state} {listing.postalCode}
                  </Typography>
                </Box>
                <Box className="listing-sheet-price-group">
                  <Typography variant="titleM" className="listing-sheet-price">{currency.format(listing.price)}</Typography>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
                    <Chip size="small" label={listing.status} className="listing-sheet-status" />
                    <Chip size="small" label={listing.published ? 'Published' : 'Not published'} variant="outlined" className="listing-sheet-published" />
                  </Stack>
                </Box>
              </Box>

              <Box className="listing-sheet-highlights" aria-label="Property highlights">
                {highlights.map(({ label, value }) => (
                  <Box key={label}>
                    <Typography variant="titleS" className="listing-sheet-highlight-value">{value}</Typography>
                    <Typography variant="labelS" color="text.secondary">{label}</Typography>
                  </Box>
                ))}
              </Box>

              <Box className="listing-sheet-story-grid">
                <Box component="section" aria-labelledby="listing-description-title" className="listing-sheet-about">
                  <Typography component="h2" variant="titleM" id="listing-description-title">Listing Description</Typography>
                  <Typography variant="bodyMStandard" color="text.secondary" className="listing-sheet-description">
                    {details.listingDescription}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box component="section" aria-labelledby="listing-facts-title" className="listing-sheet-detail-section">
                <Typography component="h2" variant="titleS" id="listing-facts-title">Listing facts</Typography>
                <FactList facts={details.listingFacts} columns />
              </Box>

              <Divider />

              <Box className="listing-sheet-detail-columns listing-sheet-detail-section">
                <Box component="section" aria-labelledby="listing-interior-title">
                  <Typography component="h2" variant="titleS" id="listing-interior-title">Interior details</Typography>
                  <FactList facts={details.interiorDetails} />
                </Box>
                <Box component="section" aria-labelledby="listing-exterior-title">
                  <Typography component="h2" variant="titleS" id="listing-exterior-title">Exterior details</Typography>
                  <FactList facts={details.exteriorDetails} />
                </Box>
              </Box>

              <Divider />

              <Box component="section" aria-labelledby="listing-financial-title" className="listing-sheet-detail-section listing-sheet-narrow-section">
                <Typography component="h2" variant="titleS" id="listing-financial-title">Financial details</Typography>
                <FactList facts={details.financialDetails} />
              </Box>

              <Divider />

              <Box component="section" aria-labelledby="listing-location-title" className="listing-sheet-detail-section listing-sheet-map-section">
                <Box className="listing-sheet-map-heading">
                  <Box>
                    <Typography component="h2" variant="titleS" id="listing-location-title">Location</Typography>
                    <Typography variant="bodySStandard" color="text.secondary">Near Foys Lake · Kalispell, Montana</Typography>
                  </Box>
                  <Typography variant="labelS" color="text.secondary">Approximate prototype pin</Typography>
                </Box>
                <Box className="listing-sheet-map-frame">
                  <Box
                    component="iframe"
                    src={mapUrl}
                    title="Interactive Google Map with an approximate sample pin near Foys Lake, Kalispell"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </Box>
              </Box>

              <Divider />

              <Box component="section" aria-labelledby="listing-information-title" className="listing-sheet-detail-section listing-sheet-narrow-section">
                <Typography component="h2" variant="titleS" id="listing-information-title">Listing information</Typography>
                <FactList facts={[
                  { label: 'Date listed', value: details.dateListed },
                  { label: 'Days on market', value: String(listing.daysOnMarket) },
                  { label: 'Expiration', value: listing.expiration },
                  { label: 'Last updated', value: listing.lastUpdated },
                ]} />
              </Box>

              {leadAgent && (
                <Box className="listing-sheet-agent">
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Avatar src={leadAgent.photoUrl} alt={leadAgent.name} className="listing-sheet-agent-avatar">{leadAgent.initials}</Avatar>
                    <Box>
                      <Typography variant="labelS" color="text.secondary">Your listing agent</Typography>
                      <Typography variant="titleXS">{leadAgent.name}</Typography>
                    </Box>
                  </Stack>
                  <Box component="img" src={teamBrand.logoUrl} alt={teamBrand.name} className="listing-sheet-team-logo" />
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  )
}

type ListingPhoto = SellerTransaction['listing']['photos'][number]

function PhotoFeed({ photos }: { photos: ListingPhoto[] }) {
  const rows: Array<{ layout: 'full' | 'pair'; photos: ListingPhoto[] }> = []

  for (let index = 0; index < photos.length;) {
    const layout = rows.length % 2 === 0 ? 'full' : 'pair'
    const rowPhotos = photos.slice(index, index + (layout === 'full' ? 1 : 2))
    rows.push({ layout, photos: rowPhotos })
    index += rowPhotos.length
  }

  return (
    <Box component="section" aria-label="All property photos" className="listing-photo-feed">
      {rows.map((row, rowIndex) => (
        <Box key={rowIndex} className={`listing-photo-feed-row listing-photo-feed-row-${row.layout}`}>
          {row.photos.map((photo, photoIndex) => (
            <Box
              component="img"
              key={`${photo.url}-${photoIndex}`}
              src={photo.url}
              alt={photo.alt}
              loading={rowIndex === 0 ? 'eager' : 'lazy'}
              className="listing-photo-feed-image"
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}

function FactList({ facts, columns = false }: { facts: ListingFact[]; columns?: boolean }) {
  return (
    <Box component="dl" className={`listing-sheet-fact-list${columns ? ' listing-sheet-fact-list-columns' : ''}`}>
      {facts.map(({ label, value }) => (
        <Box key={label} className="listing-sheet-fact">
          <Typography component="dt" variant="bodySStandard" color="text.secondary">{label}</Typography>
          <Typography component="dd" variant="bodySStandard">{value}</Typography>
        </Box>
      ))}
    </Box>
  )
}
