/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft4 Variety3 SlopFree5 */
import { Box, ButtonBase, Paper, Tooltip, Typography } from '@mui/material'
import PushPinOutlined from '@mui/icons-material/PushPinOutlined'
import PushPin from '@mui/icons-material/PushPin'
import { PlaceIconButton } from '../../components/PlaceIconButton'
import type { TransactionDocument } from '../types'
import './document-card.css'

export function DocumentThumbnail({ document }: { document: TransactionDocument }) {
  return (
    <Box className="document-thumbnail" aria-hidden="true">
      {document.thumbnailUrl ? <img src={document.thumbnailUrl} alt="" loading="lazy" /> : (
        <>
          <Box className="document-sample-page">
            <Typography variant="titleS" component="p">{document.name}</Typography>
            <Box className="document-sample-rule" />
            <Typography variant="bodySStandard" component="p">{document.summary}</Typography>
            <Box className="document-sample-details">
              <Typography variant="labelS">Prepared by</Typography>
              <Typography variant="bodySStandard">{document.postedBy}</Typography>
              <Typography variant="labelS">Uploaded</Typography>
              <Typography variant="bodySStandard">{document.uploadedAt}</Typography>
            </Box>
            <Box className="document-sample-lines"><span /><span /><span /></Box>
          </Box>
        </>
      )}
    </Box>
  )
}

export function DocumentCard({ document, pinned, onPin, onPreview, readOnly = false }: {
  document: TransactionDocument
  readOnly?: boolean
  pinned: boolean
  onPin: (document: TransactionDocument) => void
  onPreview: (document: TransactionDocument) => void
}) {
  const pinLabel = `${pinned ? 'Unpin' : 'Pin'} ${document.name}`
  return (
    <Paper component="li" variant="outlined" className="document-card">
      <Tooltip title={pinned ? 'Unpin document' : 'Pin document'}>
        <PlaceIconButton className="document-card-pin" disabled={readOnly} aria-label={pinLabel} aria-pressed={pinned} onClick={() => onPin(document)}>
          {pinned ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
        </PlaceIconButton>
      </Tooltip>
      <ButtonBase className="document-card-preview" onClick={() => onPreview(document)} aria-label={`Preview ${document.name}`}>
        <DocumentThumbnail document={document} />
        <Box className="document-card-copy">
          <Typography variant="titleXS" component="h3">{document.name}</Typography>
          <Box className="document-card-meta">
            <Typography variant="labelS" component="span">Uploaded {document.uploadedAt}</Typography>
            <Typography variant="labelS" component="span">Added by {document.postedBy}</Typography>
          </Box>
        </Box>
      </ButtonBase>
    </Paper>
  )
}
