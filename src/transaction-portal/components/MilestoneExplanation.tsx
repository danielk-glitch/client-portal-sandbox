/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety4 SlopFree5 */
import { Box, Button, Typography } from '@mui/material'
import { PlaceModal } from '../../components/PlaceModal'
import type { TransactionResource, UpcomingDate } from '../types'
import './resources.css'

export function MilestoneExplanation({ title, guidance, resource, open, onClose, onReadGuide }: { title: string; guidance: NonNullable<UpcomingDate['guidance']>; resource?: TransactionResource; open: boolean; onClose: () => void; onReadGuide?: () => void }) {
  return (
    <PlaceModal open={open} onClose={onClose} title={title} size="s" closeLabel={`Close explanation: ${title}`} actions={<>
      {onReadGuide && <Button variant="outlined" className="milestone-guide-action" onClick={() => { onClose(); onReadGuide() }} aria-label={resource ? `Read resource: ${resource.title}` : `Read guide: ${title}`}>{resource ? `Resource: ${resource.shortTitle ?? resource.title}` : 'Read the guide'}</Button>}
      <Button variant="contained" onClick={onClose}>Done</Button>
    </>}>
      <Box className="milestone-explanation-content">
        <Box className="milestone-explanation-section">
          <Typography component="h3" variant="titleXS">What it means</Typography>
          <Typography variant="bodyMStandard" color="text.secondary">{guidance.explanation}</Typography>
        </Box>
        <Box className="milestone-explanation-section">
          <Typography component="h3" variant="titleXS">What you need to do</Typography>
          <Typography variant="bodyMStandard" color="text.secondary">{guidance.preparation}</Typography>
        </Box>
      </Box>
    </PlaceModal>
  )
}
