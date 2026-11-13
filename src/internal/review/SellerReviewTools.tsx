import { useState } from 'react'
import { Box, Button, FormControlLabel, IconButton, Popover, Radio, RadioGroup, Typography } from '@mui/material'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import TuneOutlined from '@mui/icons-material/TuneOutlined'
import { AnnotationLayer } from './AnnotationLayer'
import { FeedbackToolbar } from './FeedbackToolbar'
import { JourneyViewMenu } from './JourneyViewMenu'
import { sellerAnnotations } from './sellerAnnotations'
import { sellerJourneyViews, type SellerJourneyView } from './sellerJourneyViews'
import { marketingFeedbackLayouts, type MarketingFeedbackLayout } from '../../seller-portal/marketingFeedbackLayouts'
import type { HeaderListingLink, ListingOverviewVariant } from '../../seller-portal/ListingOverview'
import type { MarketingSnapshotData } from '../../seller-portal/MarketingSnapshot'
import type { TimelineTransition } from '../../seller-portal/SellerTimeline'
import type { MarketActivityScenario, OverviewLayout } from '../../seller-portal/SellerPortal'
import './seller-review-tools.css'

type SellerReviewToolsProps = {
  containerStyle?: 'shadow' | 'stroke'
  selectContainerStyle?: (value: 'shadow' | 'stroke') => void
  timelineTransition?: TimelineTransition
  selectTimelineTransition?: (value: TimelineTransition) => void
  journeyView: SellerJourneyView
  selectJourneyView: (view: SellerJourneyView) => void
  beforeListing: boolean
  visualTheme?: 'polestar'
  marketingSnapshot?: MarketingSnapshotData
  /** Shown only on the current-functionality page. */
  overviewLayout?: OverviewLayout
  selectOverviewLayout?: (layout: OverviewLayout) => void
  listingLink: HeaderListingLink
  selectListingLink: (link: HeaderListingLink) => void
  headerVariant: ListingOverviewVariant
  selectHeaderVariant: (variant: ListingOverviewVariant) => void
  marketingLayout: 'materials' | 'views'
  selectMarketingLayout: (layout: 'materials' | 'views') => void
  feedbackLayout: MarketingFeedbackLayout
  selectFeedbackLayout: (layout: MarketingFeedbackLayout) => void
  /** Shown only when the page has a Market activity block. */
  marketScenario?: MarketActivityScenario
  selectMarketScenario?: (scenario: MarketActivityScenario) => void
}

export function SellerReviewTools({ containerStyle, selectContainerStyle, timelineTransition, selectTimelineTransition, journeyView, selectJourneyView, beforeListing, visualTheme, marketingSnapshot, overviewLayout, selectOverviewLayout, listingLink, selectListingLink, headerVariant, selectHeaderVariant, marketingLayout, selectMarketingLayout, feedbackLayout, selectFeedbackLayout, marketScenario, selectMarketScenario }: SellerReviewToolsProps) {
  const [viewMenuAnchor, setViewMenuAnchor] = useState<HTMLElement | null>(null)
  const [designPanelAnchor, setDesignPanelAnchor] = useState<HTMLElement | null>(null)
  return (
    <>
      <FeedbackToolbar keepOpen={Boolean(designPanelAnchor || viewMenuAnchor)}>
        <JourneyViewMenu value={journeyView} options={sellerJourneyViews} anchorEl={viewMenuAnchor} onOpen={setViewMenuAnchor} onClose={() => setViewMenuAnchor(null)} onChange={selectJourneyView} />
        <Button
          variant="contained"
          startIcon={<TuneOutlined />}
          className="design-panel-trigger"
          onClick={(event) => setDesignPanelAnchor(event.currentTarget)}
          aria-label="Open design panel"
          aria-haspopup="dialog"
          aria-expanded={Boolean(designPanelAnchor)}
          aria-controls={designPanelAnchor ? 'seller-design-panel' : undefined}
        >
          <Box component="span" className="design-panel-trigger-label">Design panel</Box>
        </Button>
        {marketingSnapshot && <AnnotationLayer annotations={sellerAnnotations} />}
      </FeedbackToolbar>

      <Popover
        id="seller-design-panel"
        open={Boolean(designPanelAnchor)}
        anchorEl={designPanelAnchor}
        onClose={() => setDesignPanelAnchor(null)}
        anchorOrigin={{ vertical: -12, horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        disableScrollLock
        slotProps={{ paper: { className: 'design-panel-paper', role: 'dialog', 'aria-label': 'Design panel' } }}
      >
        <Box className="design-panel-header">
          <Box>
            <Typography component="h2" variant="titleS">Design panel</Typography>
            <Typography variant="bodySStandard" color="text.secondary">Preview page layouts</Typography>
          </Box>
          <IconButton onClick={() => setDesignPanelAnchor(null)} aria-label="Close design panel">
            <CloseOutlined />
          </IconButton>
        </Box>
        <Box className="design-panel-content">
          {containerStyle && selectContainerStyle && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="container-style-label">Containers</Typography>
              <RadioGroup aria-labelledby="container-style-label" value={containerStyle} onChange={(event) => selectContainerStyle(event.target.value as 'shadow' | 'stroke')}>
                <FormControlLabel value="shadow" control={<Radio />} label="Drop shadow" />
                <FormControlLabel value="stroke" control={<Radio />} label="Stroke" />
              </RadioGroup>
            </Box>
          )}
          {timelineTransition && selectTimelineTransition && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="timeline-transition-label">Timeline transition</Typography>
              <RadioGroup aria-labelledby="timeline-transition-label" value={timelineTransition} onChange={(event) => selectTimelineTransition(event.target.value as TimelineTransition)}>
                <FormControlLabel value="divider" control={<Radio />} label="Divider" />
                <FormControlLabel value="dark" control={<Radio />} label="Dark band" />
              </RadioGroup>
            </Box>
          )}
          {overviewLayout && selectOverviewLayout && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="overview-layout-label">Timeline and dates row</Typography>
              <RadioGroup aria-labelledby="overview-layout-label" value={overviewLayout} onChange={(event) => selectOverviewLayout(event.target.value as OverviewLayout)}>
                <FormControlLabel value="timeline" control={<Radio />} label="Timeline, dates and notes" />
                <FormControlLabel value="classic" control={<Radio />} label="Upcoming dates and recent activity" />
              </RadioGroup>
            </Box>
          )}
          {beforeListing && <Typography variant="bodySStandard" color="text.secondary">Before listing uses the compact header with team and brokerage logos. Switch to Pending to compare listing layouts.</Typography>}
          {!beforeListing && <Box className="design-panel-option-section">
            <Typography component="h3" variant="titleXS" id="header-listing-link-label">Header listing link</Typography>
            <RadioGroup aria-labelledby="header-listing-link-label" value={listingLink} onChange={(event) => selectListingLink(event.target.value as HeaderListingLink)}>
              <FormControlLabel value="first-party" control={<Radio />} label="First Party" />
              <FormControlLabel value="idx-mvp" control={<Radio />} label="IDX MVP" />
            </RadioGroup>
          </Box>}
          {!beforeListing && visualTheme !== 'polestar' && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="header-layout-label">Header layout</Typography>
              <RadioGroup aria-labelledby="header-layout-label" value={headerVariant} onChange={(event) => selectHeaderVariant(event.target.value as ListingOverviewVariant)}>
                <FormControlLabel value="card" control={<Radio />} label="Card" />
                <FormControlLabel value="full" control={<Radio />} label="Full width · Dark" />
                <FormControlLabel value="light" control={<Radio />} label="Full width · Light split" />
                <FormControlLabel value="light-bottom" control={<Radio />} label="Light split · Bottom aligned" />
                <FormControlLabel value="light-compact" control={<Radio />} label="Light split · Compact" />
              </RadioGroup>
            </Box>
          )}
          {!beforeListing && marketingSnapshot && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="marketing-layout-label">Marketing block</Typography>
              <RadioGroup aria-labelledby="marketing-layout-label" value={marketingLayout} onChange={(event) => selectMarketingLayout(event.target.value as 'materials' | 'views')}>
                <FormControlLabel value="materials" control={<Radio />} label="Marketing activity" />
                <FormControlLabel value="views" control={<Radio />} label="Listing views" disabled={!marketingSnapshot.insights} />
              </RadioGroup>
            </Box>
          )}
          {!beforeListing && marketingSnapshot && marketingLayout === 'materials' && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="feedback-layout-label">Showing feedback layout</Typography>
              <RadioGroup aria-labelledby="feedback-layout-label" value={feedbackLayout} onChange={(event) => selectFeedbackLayout(event.target.value as MarketingFeedbackLayout)}>
                {marketingFeedbackLayouts.map((layout) => <FormControlLabel key={layout.id} value={layout.id} control={<Radio />} label={layout.label} />)}
              </RadioGroup>
            </Box>
          )}
          {marketScenario && selectMarketScenario && (
            <Box className="design-panel-option-section">
              <Typography component="h3" variant="titleXS" id="market-activity-scenario-label">Market activity</Typography>
              <RadioGroup aria-labelledby="market-activity-scenario-label" value={marketScenario} onChange={(event) => selectMarketScenario(event.target.value as MarketActivityScenario)}>
                <FormControlLabel value="activity" control={<Radio />} label="With activity" />
                <FormControlLabel value="empty" control={<Radio />} label="No activity" />
                <FormControlLabel value="hidden" control={<Radio />} label="Hidden by team" />
              </RadioGroup>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}
