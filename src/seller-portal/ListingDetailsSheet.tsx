/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import GridViewOutlined from '@mui/icons-material/GridViewOutlined'
import ImageOutlined from '@mui/icons-material/ImageOutlined'
import type { SellerTransaction } from './sellerTransaction'
import { AgentIdentity } from '../components/AgentIdentity'
import { PartnerBrandLockup } from '../components/PartnerBrandLockup'
import { Eyebrow } from '../components/Eyebrow'
import { FactList } from '../components/FactList'
import { PlaceSheet } from '../components/PlaceSheet'
import { PlaceTag } from '../components/PlaceTag'
import './listing-details.css'

/** Shared listing overlay data. Nearby homes can omit details unavailable in the market feed. */
export type ListingDetailsData = {
  listing: Pick<SellerTransaction['listing'], 'address' | 'city' | 'price' | 'photoUrl' | 'photos'>
    & Partial<Pick<SellerTransaction['listing'], 'state' | 'postalCode' | 'dataSource' | 'published' | 'expiration' | 'daysOnMarket' | 'lastUpdated'>>
    & { status: string }
  details: Pick<SellerTransaction['details'], 'property' | 'listingFacts' | 'interiorDetails' | 'exteriorDetails' | 'financialDetails'>
    & Partial<Pick<SellerTransaction['details'], 'dateListed' | 'approximateMapPin' | 'listingDescription'>>
  priceLabel?: string
}

type ListingDetailsSheetProps = {
  open: boolean
  onClose: () => void
  /** The role line above the agent. Buyers see "Your agent". */
  agentLabel?: string
} & ({ transaction: SellerTransaction; data?: never } | { data: ListingDetailsData; transaction?: never })

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export function ListingDetailsSheet({ open, onClose, transaction, data, agentLabel }: ListingDetailsSheetProps) {
  const [photoView, setPhotoView] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)
  const showAllButtonRef = useRef<HTMLButtonElement>(null)
  const { listing, details } = data ?? transaction
  const teamBrand = transaction?.teamBrand
  const leadAgent = transaction?.team.find((member) => member.id === teamBrand?.leadAgentId)
  const nearby = Boolean(data)
  const photos = listing.photos.length > 0
    ? listing.photos
    : listing.photoUrl ? [{ url: listing.photoUrl, alt: `Exterior of ${listing.address}` }] : []
  const highlights = nearby ? details.property : details.property.filter(({ label }) => ['Bedrooms', 'Bathrooms', 'Interior size', 'Lot size'].includes(label))
  const mlsNumber = details.listingFacts.find(({ label }) => label === 'MLS #')?.value
  const pin = details.approximateMapPin
  const mapUrl = pin ? `https://www.google.com/maps?q=${pin.latitude},${pin.longitude}&z=${pin.zoom}&output=embed` : undefined
  const listingInformation = [
    ...(details.dateListed ? [{ label: 'Date listed', value: details.dateListed }] : []),
    ...(listing.daysOnMarket !== undefined ? [{ label: 'Days on market', value: String(listing.daysOnMarket) }] : []),
    ...(listing.expiration ? [{ label: 'Expiration', value: listing.expiration }] : []),
    ...(listing.lastUpdated ? [{ label: 'Last updated', value: listing.lastUpdated }] : []),
  ]

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
    <PlaceSheet
      open={open}
      onClose={closeSheet}
      className="listing-sheet-root"
      paperClassName="listing-sheet-paper"
      label={`${photoView ? 'Photos' : 'Listing'} for ${listing.address}`}
    >
      <Box ref={scrollRef} className="place-sheet-scroll listing-sheet-scroll">
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
                    {photos.length === 1 ? 'View photo' : `See all ${photos.length} photos`}
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
                  {nearby && <Eyebrow>Nearby home</Eyebrow>}
                  {mlsNumber && <Eyebrow>MLS # {mlsNumber}</Eyebrow>}
                  <Typography component="h1" variant="titleL" className="listing-sheet-address">{listing.address}</Typography>
                  <Typography variant="bodyMStandard" color="text.secondary">
                    {[listing.city, listing.state].filter(Boolean).join(', ')} {listing.postalCode}
                  </Typography>
                </Box>
                <Box className="listing-sheet-price-group">
                  {data?.priceLabel && <Typography variant="labelM" color="text.secondary">{data.priceLabel}</Typography>}
                  <Typography variant="titleM" className="listing-sheet-price">{currency.format(listing.price)}</Typography>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
                    <PlaceTag className="listing-sheet-status">{listing.status}</PlaceTag>
                    {!nearby && <PlaceTag className="listing-sheet-published">{listing.published ? 'Published' : 'Not published'}</PlaceTag>}
                    {!nearby && <PlaceTag className="listing-sheet-source">{`Source: ${listing.dataSource}`}</PlaceTag>}
                  </Stack>
                </Box>
              </Box>

              <Box className="listing-sheet-highlights" aria-label="Property highlights">
                {highlights.map(({ label, value }) => (
                  <Box key={label}>
                    <Typography variant="titleS" className="listing-sheet-highlight-value">{value}</Typography>
                    <Typography variant="labelM" color="text.secondary">{label}</Typography>
                  </Box>
                ))}
              </Box>

              {details.listingDescription && <>
              <Box className="listing-sheet-story-grid">
                <Box component="section" aria-labelledby="listing-description-title" className="listing-sheet-about">
                  <Typography component="h2" variant="titleM" id="listing-description-title">Listing Description</Typography>
                  <Typography variant="bodyMStandard" color="text.secondary" className="listing-sheet-description">
                    {details.listingDescription}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              </>}

              <Box component="section" aria-labelledby="listing-facts-title" className="listing-sheet-detail-section">
                <Typography component="h2" variant="titleS" id="listing-facts-title">Listing facts</Typography>
                <FactList layout="rows" columns={2} facts={details.listingFacts} className="listing-sheet-fact-list" />
              </Box>

              {(details.interiorDetails.length > 0 || details.exteriorDetails.length > 0) && <>
              <Divider />
              <Box className="listing-sheet-detail-columns listing-sheet-detail-section">
                {details.interiorDetails.length > 0 && <Box component="section" aria-labelledby="listing-interior-title">
                  <Typography component="h2" variant="titleS" id="listing-interior-title">Interior details</Typography>
                  <FactList layout="rows" facts={details.interiorDetails} className="listing-sheet-fact-list" />
                </Box>}
                {details.exteriorDetails.length > 0 && <Box component="section" aria-labelledby="listing-exterior-title">
                  <Typography component="h2" variant="titleS" id="listing-exterior-title">Exterior details</Typography>
                  <FactList layout="rows" facts={details.exteriorDetails} className="listing-sheet-fact-list" />
                </Box>}
              </Box>
              </>}

              {(details.financialDetails.length > 0 || listingInformation.length > 0) && <>
              <Divider />
              <Box className="listing-sheet-detail-columns listing-sheet-detail-section listing-sheet-overview-columns">
                {details.financialDetails.length > 0 && <Box component="section" aria-labelledby="listing-financial-title">
                  <Typography component="h2" variant="titleS" id="listing-financial-title">Financial details</Typography>
                  <FactList layout="rows" facts={details.financialDetails} className="listing-sheet-fact-list" />
                </Box>}
                {listingInformation.length > 0 && <Box component="section" aria-labelledby="listing-information-title">
                  <Typography component="h2" variant="titleS" id="listing-information-title">Listing information</Typography>
                  <FactList layout="rows" className="listing-sheet-fact-list" facts={listingInformation} />
                </Box>}
              </Box>
              </>}

              {mapUrl && <>
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

              </>}

              {leadAgent && teamBrand && (
                <Box className="listing-sheet-agent">
                  <AgentIdentity agent={leadAgent} size="m" label={agentLabel} />
                  <PartnerBrandLockup brand={teamBrand} />
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </PlaceSheet>
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
