/**
 * Client profile (`/profile`) · deliberately basic. A client comes here for two reasons: to make sure their team can
 * reach them, and to choose how they hear about updates. So the page has exactly those two cards, then sign out.
 * - Contact details: name, email, phone, mailing address. Shared with every team the client works with, so it says so.
 * - Notifications: three switches. Time-sensitive texts are on by default; the weekly summary is opt-in.
 * - Left out on purpose: passwords (sign-in is by email link), team management, and transaction details, which live on
 *   the index and in each portal.
 */
import { useState } from 'react'
import { Avatar, Box, Button, Container, Switch, TextField, Typography } from '@mui/material'
import { toast } from 'sonner'
import { PlaceCard } from '../components/PlaceCard'
import { PortalSectionHeader } from '../components/PortalSection'
import { FactList } from '../components/FactList'
import { PlaceModal } from '../components/PlaceModal'
import { TextLink } from '../components/TextLink'
import { PortalTopbar } from '../transaction-portal/components'
import { clientProfile, type ClientProfile as Profile } from './clientAccountData'
import './client-account.css'

const notificationOptions = [
  { id: 'email', title: 'Email updates', description: 'New milestones, documents, and notes from your team.', defaultOn: true },
  { id: 'text', title: 'Text messages', description: 'Only time-sensitive things, like a signature or closing day.', defaultOn: true },
  { id: 'weekly', title: 'Weekly summary', description: 'One email each Monday with where every transaction stands.', defaultOn: false },
] as const

export function ClientProfile() {
  const [profile, setProfile] = useState<Profile>(clientProfile)
  const [editing, setEditing] = useState(false)
  // Each open starts a fresh draft from the saved details.
  const [editCount, setEditCount] = useState(0)
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    () => Object.fromEntries(notificationOptions.map((option) => [option.id, option.defaultOn])),
  )

  function toggle(id: string, title: string) {
    const next = !notifications[id]
    setNotifications((current) => ({ ...current, [id]: next }))
    toast(`${title} ${next ? 'on' : 'off'}`)
  }

  return (
    <Box className="client-account">
      <PortalTopbar viewer={profile} homeHref="/transactions" accountHref="/profile" />
      <Container component="main" className="client-account-main client-account-main--narrow">
        <Box className="cp-title-row">
          <Typography component="h1" variant="titleL">Your Profile</Typography>
          <TextLink direction="back" onClick={() => { window.location.href = '/transactions' }}>Your transactions</TextLink>
        </Box>

        <Box className="cp-identity">
          <Avatar src={profile.photoUrl} alt="" className="cp-avatar">{profile.initials}</Avatar>
          <Box>
            <Typography component="h2" variant="titleS">{profile.name}</Typography>
            <Typography variant="bodySStandard" className="ti-muted">{profile.email}</Typography>
          </Box>
        </Box>

        <Box className="cp-cards">
          <PlaceCard component="section" aria-labelledby="cp-contact">
            <PortalSectionHeader
              title="Contact details"
              titleId="cp-contact"
              subtitle="Shared with the teams you work with"
              action={<Button variant="outlined" size="small" onClick={() => { setEditCount((count) => count + 1); setEditing(true) }}>Edit</Button>}
            />
            <FactList
              layout="rows"
              className="cp-facts"
              facts={[
                { label: 'Name', value: profile.name },
                { label: 'Email', value: profile.email },
                { label: 'Phone', value: profile.phone },
                { label: 'Mailing address', value: profile.mailingAddress },
              ]}
            />
          </PlaceCard>

          <PlaceCard component="section" aria-labelledby="cp-notifications">
            <PortalSectionHeader title="Notifications" titleId="cp-notifications" />
            <Box component="ul" className="cp-setting-list">
              {notificationOptions.map((option) => (
                <Box component="li" key={option.id} className="cp-setting">
                  <Box>
                    <Typography variant="titleXS" component="label" htmlFor={`cp-${option.id}`}>{option.title}</Typography>
                    <Typography variant="bodySStandard" className="ti-muted">{option.description}</Typography>
                  </Box>
                  <Switch id={`cp-${option.id}`} checked={notifications[option.id]} onChange={() => toggle(option.id, option.title)} />
                </Box>
              ))}
            </Box>
          </PlaceCard>
        </Box>

        <Button variant="outlined" className="cp-sign-out" onClick={() => toast('Signed out (prototype)')}>Sign out</Button>
      </Container>

      <EditContactModal key={editCount} open={editing} profile={profile} onClose={() => setEditing(false)} onSave={(next) => {
        setProfile(next)
        setEditing(false)
        toast('Contact details saved')
      }} />
    </Box>
  )
}

function EditContactModal({ open, profile, onClose, onSave }: { open: boolean; profile: Profile; onClose: () => void; onSave: (profile: Profile) => void }) {
  const [draft, setDraft] = useState(profile)
  const field = (key: 'name' | 'email' | 'phone' | 'mailingAddress', label: string, type = 'text') => (
    <TextField
      label={label}
      type={type}
      value={draft[key]}
      onChange={(event) => setDraft({ ...draft, [key]: event.target.value })}
      fullWidth
    />
  )
  return (
    <PlaceModal
      open={open}
      onClose={onClose}
      size="s"
      title="Contact details"
      description="Your teams use these to reach you."
      actions={(
        <>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => onSave(draft)}>Save</Button>
        </>
      )}
    >
      <Box className="cp-form">
        {field('name', 'Name')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Phone', 'tel')}
        {field('mailingAddress', 'Mailing address')}
      </Box>
    </PlaceModal>
  )
}
