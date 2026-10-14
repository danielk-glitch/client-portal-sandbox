import { useState } from 'react'
import { Avatar, Box, Button, Chip, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'
import PersonOffOutlined from '@mui/icons-material/PersonOffOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import { EmailPreview } from '../email-templates/EmailPreview'
import { emailTemplates } from '../email-templates/emailTemplates'
import { sampleSellerTransaction as transaction } from '../seller-portal/sellerTransaction'
import { clientEmails, teamPeople } from './teamData'
import type { ClientInvite, TeamState } from './teamData'

type Viewer = (typeof transaction.viewers)[number]
type SetState = (next: TeamState | ((previous: TeamState) => TeamState)) => void
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const firstName = (viewer: Viewer) => viewer.name.split(' ')[0]

const statusLabel: Record<ClientInvite['status'], string> = { 'not-invited': 'Not invited', invited: 'Invited', active: 'Active', removed: 'Access removed' }
function statusDetail(invite: ClientInvite) {
  if (invite.status === 'active') return `Joined ${invite.updatedOn}`
  if (invite.status === 'invited') return `Sent ${invite.updatedOn}`
  if (invite.status === 'removed') return `Removed ${invite.updatedOn}`
  return 'Nothing sent yet'
}

/** The seller invite email, personalized for one client. */
export function inviteTemplate(viewer: Viewer) {
  const template = emailTemplates.find(item => item.id === 'seller-activate')!
  const name = firstName(viewer)
  return { ...template, subject: template.subject.replace('John', name), intro: template.intro.replace('Hi John', `Hi ${name}`) }
}

export function ClientAccess({ state, setState }: { state: TeamState; setState: SetState }) {
  const isAdmin = state.role === 'admin'
  const [inviting, setInviting] = useState<Viewer | null>(null)
  const [note, setNote] = useState('')
  const [menu, setMenu] = useState<{ anchor: HTMLElement; viewer: Viewer } | null>(null)
  const [removing, setRemoving] = useState<Viewer | null>(null)
  const inviteOf = (viewer: Viewer): ClientInvite => state.invites[viewer.id] ?? { status: 'not-invited' }
  const update = (viewer: Viewer, invite: ClientInvite) => setState(previous => ({ ...previous, invites: { ...previous.invites, [viewer.id]: invite } }))
  const resending = inviting ? inviteOf(inviting).status === 'invited' : false

  function openInvite(viewer: Viewer) { setNote(inviteOf(viewer).note ?? ''); setInviting(viewer) }
  function send() {
    if (!inviting || !isAdmin) return
    update(inviting, { status: 'invited', updatedOn: today(), updatedBy: teamPeople.admin.name, note: note.trim() || undefined })
    toast.success(`${resending ? 'Invite resent' : 'Invite sent'} to ${firstName(inviting)}`)
    setInviting(null)
  }
  function remove() {
    if (!removing || !isAdmin) return
    update(removing, { status: 'removed', updatedOn: today(), updatedBy: teamPeople.admin.name })
    toast.success(`${firstName(removing)} no longer has portal access`)
    setRemoving(null)
  }

  return <>
    <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: -2, mb: 3 }}>Invites go out only when {isAdmin ? 'you send them' : 'an admin sends them'}.</Typography>
    <Box component="ul" className="team-access-list">{transaction.viewers.map(viewer => {
      const invite = inviteOf(viewer)
      return <Box component="li" className="team-access-person" key={viewer.id}>
        <Avatar src={viewer.photoUrl} alt="" sx={{ width: 40, height: 40 }} />
        <Box className="team-access-copy">
          <Typography variant="titleXS">{viewer.name}</Typography>
          <Box className="team-access-status"><Chip label={statusLabel[invite.status]} size="small" variant="outlined" className={`team-invite-chip ${invite.status}`} /><Typography variant="bodySStandard" color="text.secondary">{statusDetail(invite)}</Typography></Box>
        </Box>
        {isAdmin && <Box className="team-access-actions">
          {invite.status === 'not-invited' && <Button size="small" variant="outlined" onClick={() => openInvite(viewer)}>Invite</Button>}
          {invite.status === 'removed' && <Button size="small" variant="outlined" onClick={() => openInvite(viewer)}>Invite again</Button>}
          {invite.status === 'invited' && <Button size="small" onClick={() => openInvite(viewer)}>Resend</Button>}
          {['invited', 'active'].includes(invite.status) && <IconButton size="small" aria-label={`More access options for ${viewer.name}`} aria-haspopup="menu" onClick={event => setMenu({ anchor: event.currentTarget, viewer })}><MoreHorizOutlined fontSize="small" /></IconButton>}
        </Box>}
      </Box>
    })}</Box>
    {!isAdmin && <Typography variant="bodySStandard" color="text.secondary" sx={{ mt: 3 }}>Admins send invites and manage access.</Typography>}
    <Menu anchorEl={menu?.anchor} open={!!menu} onClose={() => setMenu(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem onClick={() => { setRemoving(menu!.viewer); setMenu(null) }} sx={{ color: 'error.main' }}><ListItemIcon sx={{ color: 'inherit' }}><PersonOffOutlined fontSize="small" /></ListItemIcon><ListItemText>Remove access</ListItemText></MenuItem>
    </Menu>
    <PlaceModal open={!!inviting} onClose={() => setInviting(null)} size="l" title={inviting ? `${resending ? 'Resend invite to' : 'Invite'} ${inviting.name}` : ''} description="Nothing is sent until you choose Send." actions={<><Button onClick={() => setInviting(null)}>Cancel</Button><Button variant="contained" onClick={send}>{resending ? 'Resend invite' : 'Send invite'}</Button></>}>
      {inviting && <Stack spacing={3} sx={{ pt: 1 }}>
        <TextField label="To" value={clientEmails[inviting.id] ?? ''} disabled fullWidth helperText="Client contact details come from Brivity. Update them there." />
        <TextField label="Personal note (optional)" value={note} onChange={event => setNote(event.target.value)} fullWidth multiline minRows={3} placeholder={`A few words for ${firstName(inviting)}…`} helperText="Appears in the email below Avery’s introduction." />
        <Box><Typography variant="labelM" sx={{ mb: 1.5 }}>Email preview</Typography><Box className="team-email-preview"><Typography variant="bodySStandard" color="text.secondary" className="team-email-subject">Subject: {inviteTemplate(inviting).subject}</Typography><EmailPreview template={inviteTemplate(inviting)} personalNote={note} /></Box></Box>
      </Stack>}
    </PlaceModal>
    <PlaceModal open={!!removing} onClose={() => setRemoving(null)} title={removing ? `Remove ${firstName(removing)}’s portal access?` : ''} actions={<><Button onClick={() => setRemoving(null)}>Cancel</Button><Button variant="contained" color="error" onClick={remove}>Remove access</Button></>}>
      <Typography variant="bodyMStandard">{removing && `${firstName(removing)} won’t be able to open the portal for this transaction. Nothing is sent to them. You can invite them again later.`}</Typography>
    </PlaceModal>
  </>
}
