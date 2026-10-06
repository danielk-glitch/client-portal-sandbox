import { Box } from '@mui/material'
import './partner-brand-lockup.css'

export type PartnerBrand = {
  name: string
  logoUrl: string
  brokerage?: {
    name: string
    logoUrl: string
  }
}

export function PartnerBrandLockup({ brand }: { brand: PartnerBrand }) {
  return (
    <Box className="partner-brand-lockup">
      <Box component="img" src={brand.logoUrl} alt={brand.name} className="partner-brand-team" />
      {brand.brokerage && (
        <>
          <Box component="span" className="partner-brand-divider" aria-hidden="true" />
          <Box component="img" src={brand.brokerage.logoUrl} alt={brand.brokerage.name} className="partner-brand-brokerage" />
        </>
      )}
    </Box>
  )
}
