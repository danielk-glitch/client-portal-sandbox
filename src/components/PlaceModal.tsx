import { forwardRef, useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import type { DialogProps } from '@mui/material/Dialog'
import CloseOutlined from '@mui/icons-material/CloseOutlined'
import './place-modal.css'

export const placeModalWidths = {
  xs: 360,
  s: 480,
  m: 640,
  l: 800,
  xl: 1040,
} as const

export type PlaceModalSize = keyof typeof placeModalWidths

export type PlaceModalProps = Omit<DialogProps, 'children' | 'fullWidth' | 'maxWidth' | 'onClose' | 'open'> & {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  size?: PlaceModalSize
  closeLabel?: string
}

export const PlaceModal = forwardRef<HTMLDivElement, PlaceModalProps>(function PlaceModal({
  open,
  onClose,
  title,
  description,
  actions,
  children,
  size = 'm',
  closeLabel = 'Close dialog',
  className,
  style,
  ...dialogProps
}, ref) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <Dialog
      {...dialogProps}
      ref={ref}
      open={open}
      onClose={onClose}
      maxWidth={false}
      className={['place-modal', className].filter(Boolean).join(' ')}
      style={{ ...style, '--place-modal-width': `${placeModalWidths[size]}px` } as CSSProperties}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      <DialogTitle component="div" className="place-modal-header">
        <Box className="place-modal-heading">
          <Typography component="h2" variant="titleS" id={titleId}>{title}</Typography>
          {description && (
            <Typography component="p" variant="bodySStandard" color="text.secondary" id={descriptionId}>
              {description}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} aria-label={closeLabel} className="place-modal-close">
          <CloseOutlined fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="place-modal-content">{children}</DialogContent>
      {actions && <DialogActions className="place-modal-actions">{actions}</DialogActions>}
    </Dialog>
  )
})
