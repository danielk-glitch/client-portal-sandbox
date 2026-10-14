/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box, Button, ButtonBase, Typography } from '@mui/material'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import ChevronRightOutlined from '@mui/icons-material/ChevronRightOutlined'
import { PlaceModal } from '../../components/PlaceModal'
import type { TransactionResource, UpcomingDate } from '../types'
import './resources.css'

/** Explains a date. One resource appears as the footer action; two or more appear as a list in the body. */
export function MilestoneExplanation({ title, guidance, resources = [], open, onClose, onReadResource }: { title: string; guidance?: UpcomingDate['guidance']; resources?: TransactionResource[]; open: boolean; onClose: () => void; onReadResource?: (resource: TransactionResource) => void }) {
  const single = resources.length === 1 && onReadResource ? resources[0] : undefined
  const list = resources.length > 1 && onReadResource ? resources : []
  const read = (resource: TransactionResource) => { onClose(); onReadResource?.(resource) }
  return (
    <PlaceModal open={open} onClose={onClose} title={title} size="s" closeLabel={`Close explanation: ${title}`} actions={<>
      {single && <Button variant="outlined" className="milestone-guide-action" onClick={() => read(single)} aria-label={`Read resource: ${single.title}`}>{`Resource: ${single.shortTitle ?? single.title}`}</Button>}
      <Button variant="contained" onClick={onClose}>Done</Button>
    </>}>
      <Box className="milestone-explanation-content">
        {guidance?.explanation && <Box className="milestone-explanation-section">
          <Typography component="h3" variant="titleXS">What it means</Typography>
          <Typography variant="bodyMStandard" color="text.secondary">{guidance.explanation}</Typography>
        </Box>}
        {guidance?.preparation && <Box className="milestone-explanation-section">
          <Typography component="h3" variant="titleXS">What you need to do</Typography>
          <Typography variant="bodyMStandard" color="text.secondary">{guidance.preparation}</Typography>
        </Box>}
        {list.length > 0 && <Box className="milestone-explanation-section">
          <Typography component="h3" variant="titleXS">Helpful resources</Typography>
          <Box component="ul" className="milestone-resource-list">{list.map(resource => <li key={resource.id}>
            <ButtonBase className="milestone-resource-link" onClick={() => read(resource)} aria-label={`Read resource: ${resource.title}`}>
              <MenuBookOutlined fontSize="small" />
              <Box component="span" className="milestone-resource-copy"><Typography variant="labelM">{resource.title}</Typography><Typography variant="labelS" color="text.secondary">{resource.readingTime}</Typography></Box>
              <ChevronRightOutlined fontSize="small" />
            </ButtonBase>
          </li>)}</Box>
        </Box>}
      </Box>
    </PlaceModal>
  )
}
