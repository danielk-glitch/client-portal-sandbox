/* design-build · self-critique: Clarity5 Warmth4 Restraint5 Craft5 Variety4 SlopFree5 */
import { Paper, Typography } from '@mui/material'
import './listing-preparation.css'

export function ListingPreparation({ message }: { message: { title: string; body: string } }) {
  return (
    <Paper component="section" variant="outlined" className="listing-preparation" aria-labelledby="listing-preparation-title">
      <Typography component="h2" variant="titleS" id="listing-preparation-title">{message.title}</Typography>
      <Typography variant="bodyMStandard" className="listing-preparation-message">{message.body}</Typography>
    </Paper>
  )
}
