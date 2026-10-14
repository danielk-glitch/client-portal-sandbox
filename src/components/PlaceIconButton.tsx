import { IconButton, type IconButtonProps } from '@mui/material'
import './place-icon-button.css'

export function PlaceIconButton({ className, ...props }: IconButtonProps) {
  return <IconButton {...props} className={['place-icon-button', className].filter(Boolean).join(' ')} />
}
