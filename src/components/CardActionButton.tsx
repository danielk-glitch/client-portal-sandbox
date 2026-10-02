import { Button } from '@mui/material'
import type { ButtonProps } from '@mui/material/Button'
import './card-action-button.css'

export function CardActionButton({ className, ...props }: Omit<ButtonProps, 'variant'>) {
  return <Button {...props} variant="text" className={['card-action-button', className].filter(Boolean).join(' ')} />
}
