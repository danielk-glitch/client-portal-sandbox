import { Typography, type TypographyProps } from '@mui/material'
import './eyebrow.css'

/** Small uppercase label that sits above a title, such as “Your home” or “Transaction timeline”. */
export function Eyebrow({ className, ...props }: Omit<TypographyProps, 'variant'>) {
  return <Typography {...props} variant="labelS" className={['place-eyebrow', className].filter(Boolean).join(' ')} />
}
