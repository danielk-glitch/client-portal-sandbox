import { Box, ButtonBase, Typography } from '@mui/material'
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import type { TransactionResource } from '../types'
import './resources.css'

/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
export function ResourcesPanel({ resources, onOpen }: { resources: TransactionResource[]; onOpen: (resource: TransactionResource) => void }) {
  const usefulNow = resources.filter((resource) => resource.relevance === 'Useful now')
  const otherGuides = resources.filter((resource) => resource.relevance !== 'Useful now')

  return (
    <Box component="section" aria-label="Transaction resources" className="portal-tab-content resources-panel">
      <Box className="resources-intro">
        <Typography component="h2" variant="titleS">Transaction Resources</Typography>
        <Typography variant="bodySStandard" color="text.secondary">Helpful resources from our team to help you gain clarity over every step of the transaction process.</Typography>
      </Box>
      {usefulNow.length > 0 && (
        <Box component="section" aria-label="Useful right now">
          <Typography component="h3" variant="titleXS" className="resources-group-title">Useful right now</Typography>
          <Box className="resources-featured">
            {usefulNow.map((resource) => (
              <ButtonBase key={resource.id} onClick={() => onOpen(resource)} className="resource-feature" aria-label={`Read ${resource.title}`}>
                <MenuBookOutlined aria-hidden="true" />
                <Typography component="h4" variant="titleXS">{resource.title}</Typography>
                <Typography variant="bodySStandard" color="text.secondary">{resource.summary}</Typography>
                <Box className="resource-feature-footer">
                  <Typography variant="labelS" color="text.secondary">{resource.readingTime}</Typography>
                  <ArrowForwardOutlined fontSize="small" />
                </Box>
              </ButtonBase>
            ))}
          </Box>
        </Box>
      )}
      {otherGuides.length > 0 && (
        <Box component="section" aria-label="More guides">
          <Typography component="h3" variant="titleXS" className="resources-group-title">More guides for your sale</Typography>
          <Box component="ul" className="resource-list">
            {otherGuides.map((resource) => (
              <Box component="li" key={resource.id}>
                <ButtonBase onClick={() => onOpen(resource)} className="resource-row" aria-label={`Read ${resource.title}`}>
                  <Box className="resource-row-copy">
                    <Typography variant="labelS" color="text.secondary">{resource.relevance} · {resource.readingTime}</Typography>
                    <Typography component="h4" variant="titleXS">{resource.title}</Typography>
                    <Typography variant="bodySStandard" color="text.secondary">{resource.summary}</Typography>
                  </Box>
                  <ArrowForwardOutlined fontSize="small" />
                </ButtonBase>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

