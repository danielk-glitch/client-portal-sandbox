/**
 * Competing listing card · one nearby home in the Market activity carousel.
 * White card with a soft shadow. The photo carries the status tag (top left) and, on hover, an arrow that slides up out of a mask.
 * Price, address, facts, and a quiet change line sit below. The whole card opens the shared listing details overlay.
 */
import { Fragment, useState } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import { PlaceTag } from '../../components/PlaceTag'
import type { CompetingListing } from './marketActivityData'
import { currency, marketChangeLabels, marketChangeCopy, number, relativeDay } from './marketActivityFormat'

export function CompetingListingCard({ listing, today, onOpen }: { listing: CompetingListing; today: string; onOpen: () => void }) {
  const [photoFailed, setPhotoFailed] = useState(false)
  const facts = [`${listing.beds} bd`, `${listing.baths} ba`, `${number(listing.sqft)} sqft`, `${listing.distanceMiles} mi away`]

  return (
    <Box component="li" className="competing-listing">
      <ButtonBase className="competing-listing-open" onClick={onOpen} aria-label={`View listing for ${listing.address}`} aria-haspopup="dialog" disableRipple>
      <Box className="competing-listing-photo">
        {photoFailed
          ? <HomeOutlined aria-hidden="true" />
          : <Box component="img" src={listing.photoUrl} alt="" loading="lazy" draggable={false} onError={() => setPhotoFailed(true)} />}
        <PlaceTag className="competing-listing-tag">{marketChangeLabels[listing.change]}</PlaceTag>
        {/* The arrow rises out of a round mask on hover or focus. */}
        <Box component="span" className="competing-listing-open-mask" aria-hidden="true">
          <ArrowOutwardRounded className="competing-listing-open-icon" />
        </Box>
      </Box>

      <Box className="competing-listing-copy">
        <Typography variant="titleS" component="p" className="competing-listing-price">{currency(listing.price)}</Typography>
        <Typography variant="titleXS" component="p" className="competing-listing-address">{listing.address}</Typography>
        {/* Each fact stays on one line, so narrow screens wrap between facts, never inside one. */}
        <Typography variant="bodySStandard" component="p" className="competing-listing-facts">
          {facts.map((fact, index) => (
            <Fragment key={fact}>
              {index > 0 && ' · '}
              <Box component="span">{fact}</Box>
            </Fragment>
          ))}
        </Typography>
        <Typography variant="labelS" component="p" className="competing-listing-change">
          {marketChangeCopy(listing)} · <time dateTime={listing.changedOn}>{relativeDay(listing.changedOn, today)}</time>
        </Typography>
      </Box>

      </ButtonBase>
    </Box>
  )
}
