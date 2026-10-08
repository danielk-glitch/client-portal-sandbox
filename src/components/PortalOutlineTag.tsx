import { Chip } from '@mui/material'
import './portal-outline-tag.css'

export function PortalOutlineTag({ label, className }: { label: string; className?: string }) {
  return <Chip label={label} size="small" variant="outlined" className={['portal-outline-tag', className].filter(Boolean).join(' ')} />
}
