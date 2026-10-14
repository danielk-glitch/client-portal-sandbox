import { useState } from 'react'
import { Avatar, Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined'
import PersonOffOutlined from '@mui/icons-material/PersonOffOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import { EmailPreview } from '../email-templates/EmailPreview'
import { emailTemplates } from '../email-templates/emailTemplates'
import { PortalSection } from '../transaction-portal/components'
import { teamPeople } from './teamData'
import type { ClientInvite, ClientPerson, TeamState } from './teamData'

type SetState = (next: TeamState | ((previous: TeamState) => TeamState)) => void
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const firstName = (name: string) => name.trim().split(' ')[0] || 'there'
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

/** The seller invite email, personalized for one client. */
export function inviteTemplate(name: string) {
  const template = emailTemplates.find(item => item.id === 'seller-activate')!
  const first = firstName(name)
  return { ...template, subject: template.subject.replace('John', first), intro: template.intro.replace('Hi John', `Hi ${first}`) }
}

function detail(person: ClientPerson, invite: ClientInvite) {
  if (invite.status === 'active') return `Joined ${invite.updatedOn}`
  if (invite.status === 'invited') return `Invite sent ${invite.updatedOn}`
  if (invite.status === 'removed') return `Access removed ${invite.updatedOn}`
  return person.source === 'Brivity' ? `${person.role} in Brivity` : person.role
}

export function ClientAccess({ state, setState }: { state: TeamState; setState: SetState }) {
  const isAdmin = state.role === 'admin'
  const [dialog, setDialog] = useState<{ person: ClientPerson | null } | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [menu, setMenu] = useState<{ anchor: HTMLElement; person: ClientPerson } | null>(null)
  const [removing, setRemoving] = useState<ClientPerson | null>(null)
  const inviteOf = (person: ClientPerson): ClientInvite => state.invites[person.id] ?? { status: 'not-invited' }
  const groups = [
    { title: 'Active', people: state.clients.filter(person => inviteOf(person).status === 'active') },
    { title: 'Invited', people: state.clients.filter(person => inviteOf(person).status === 'invited') },
    { title: 'Not invited', people: state.clients.filter(person => ['not-invited', 'removed'].includes(inviteOf(person).status)) },
  ].filter(group => group.people.length > 0)
  const target = dialog?.person
  const resending = target ? inviteOf(target).status === 'invited' : false
  const recipient = target?.name ?? name

  function open(person: ClientPerson | null) {
    setName(''); setEmail(''); setNote(person ? inviteOf(person).note ?? '' : '')
    setDialog({ person })
  }
  function send() {
    if (!dialog || !isAdmin) return
    if (!target && (!name.trim() || !validEmail(email))) { toast.error('Add a name and a valid email address.'); return }
    const person: ClientPerson = target ?? { id: `client-${Date.now()}`, name: name.trim(), email: email.trim(), role: 'Invited by your team', source: 'Invited' }
    setState(previous => ({
      ...previous,
      clients: previous.clients.some(item => item.id === person.id) ? previous.clients : [...previous.clients, person],
      invites: { ...previous.invites, [person.id]: { status: 'invited', updatedOn: today(), updatedBy: teamPeople.admin.name, note: note.trim() || undefined } },
    }))
    toast.success(`${resending ? 'Invite resent' : 'Invite sent'} to ${firstName(person.name)}`)
    setDialog(null)
  }
  function remove() {
    if (!removing || !isAdmin) return
    setState(previous => ({ ...previous, invites: { ...previous.invites, [removing.id]: { status: 'removed', updatedOn: today(), updatedBy: teamPeople.admin.name } } }))
    toast.success(`${firstName(removing.name)} no longer has portal access`)
    setRemoving(null)
  }

  return <PortalSection prominent title="Client access" subtitle={isAdmin ? undefined : 'Admins send invites and manage access.'} action={isAdmin ? <Button size="small" variant="outlined" startIcon={<AddOutlined />} onClick={() => open(null)} aria-label="Invite a client">Invite</Button> : undefined}>
    <Stack spacing={3}>{groups.map(group => <Box key={group.title}>
      <Typography component="h3" variant="labelS" color="text.secondary" className="team-access-group">{group.title} · {group.people.length}</Typography>
      <Box component="ul" className="team-access-list">{group.people.map(person => {
        const invite = inviteOf(person)
        return <Box component="li" className="team-access-person" key={person.id}>
          <Avatar src={person.photoUrl} alt="" sx={{ width: 40, height: 40 }}>{person.name[0]}</Avatar>
          <Box className="team-access-copy"><Typography variant="titleXS">{person.name}</Typography><Typography variant="bodySStandard" color="text.secondary">{detail(person, invite)}</Typography></Box>
          {isAdmin && <Box className="team-access-actions">
            {['not-invited', 'removed'].includes(invite.status) && <Button size="small" variant="contained" onClick={() => open(person)} aria-label={`Invite ${person.name}`}>{invite.status === 'removed' ? 'Invite again' : 'Invite'}</Button>}
            {invite.status === 'invited' && <Button size="small" onClick={() => open(person)}>Resend</Button>}
            {['invited', 'active'].includes(invite.status) && <IconButton size="small" aria-label={`More access options for ${person.name}`} aria-haspopup="menu" onClick={event => setMenu({ anchor: event.currentTarget, person })}><MoreHorizOutlined fontSize="small" /></IconButton>}
          </Box>}
        </Box>
      })}</Box>
    </Box>)}</Stack>
    <Menu anchorEl={menu?.anchor} open={!!menu} onClose={() => setMenu(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <MenuItem onClick={() => { setRemoving(menu!.person); setMenu(null) }} sx={{ color: 'error.main' }}><ListItemIcon sx={{ color: 'inherit' }}><PersonOffOutlined fontSize="small" /></ListItemIcon><ListItemText>Remove access</ListItemText></MenuItem>
    </Menu>
    <PlaceModal open={!!dialog} onClose={() => setDialog(null)} size="l" title={target ? `${resending ? 'Resend invite to' : 'Invite'} ${target.name}` : 'Invite someone to this portal'} description="Nothing is sent until you choose Send." actions={<><Button onClick={() => setDialog(null)}>Cancel</Button><Button variant="contained" onClick={send}>{resending ? 'Resend invite' : 'Send invite'}</Button></>}>
      {dialog && <Stack spacing={3} sx={{ pt: 1 }}>
        {target
          ? <TextField label="To" value={target.email} disabled fullWidth helperText={target.source === 'Brivity' ? 'Contact details come from Brivity. Update them there.' : undefined} />
          : <><TextField label="Full name" value={name} onChange={event => setName(event.target.value)} fullWidth autoFocus /><TextField label="Email" type="email" value={email} onChange={event => setEmail(event.target.value)} fullWidth helperText="Clients on the Brivity transaction already appear in the list." /></>}
        <TextField label="Personal note (optional)" value={note} onChange={event => setNote(event.target.value)} fullWidth multiline minRows={3} placeholder={`A few words for ${firstName(recipient)}…`} helperText="Appears in the email below Avery’s introduction." />
        <Box><Typography variant="labelM" sx={{ mb: 1.5, display: 'block' }}>Email preview</Typography><Box className="team-email-preview"><Typography variant="bodySStandard" color="text.secondary" className="team-email-subject">Subject: {inviteTemplate(recipient).subject}</Typography><EmailPreview template={inviteTemplate(recipient)} personalNote={note} /></Box></Box>
      </Stack>}
    </PlaceModal>
    <PlaceModal open={!!removing} onClose={() => setRemoving(null)} title={removing ? `Remove ${firstName(removing.name)}’s portal access?` : ''} actions={<><Button onClick={() => setRemoving(null)}>Cancel</Button><Button variant="contained" color="error" onClick={remove}>Remove access</Button></>}>
      <Typography variant="bodyMStandard">{removing && `${firstName(removing.name)} won’t be able to open the portal for this transaction. Nothing is sent to them. You can invite them again later.`}</Typography>
    </PlaceModal>
  </PortalSection>
}
