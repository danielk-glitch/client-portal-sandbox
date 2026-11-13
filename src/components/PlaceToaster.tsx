import { Toaster } from 'sonner'
import { useTheme } from '@mui/material/styles'
import './place-toaster.css'

export function PlaceToaster() {
  const theme = useTheme()
  return (
    <Toaster
      position="top-center"
      theme="dark"
      gap={8}
      closeButton
      toastOptions={{
        style: {
          fontFamily: theme.typography.fontFamily,
          background: 'var(--color-primitive-neutral-900)',
          color: 'var(--color-primitive-neutral-50)',
          borderColor: 'var(--color-primitive-neutral-700)',
          boxShadow: 'var(--elevation-2)',
        },
      }}
    />
  )
}
