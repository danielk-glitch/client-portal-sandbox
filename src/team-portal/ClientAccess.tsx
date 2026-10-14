import { useState } from 'react'
import { Avatar, Box, Button, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import AddOutlined from '@mui/icons-material/AddOutlined'
import { toast } from 'sonner'
import { PlaceModal } from '../components/PlaceModal'
import { EmailPreview } from '../email-templates/EmailPreview'
import { emailTemplates } from '../email-templates/emailTemplates'
import { PortalSection } from '../transaction-portal/components'
import { sampleSellerTransaction as transaction } from '../seller-portal/sellerTransaction'
import { teamPeople } from './teamData'
import type { ClientInvite, ClientPerson, TeamState } from './teamData'

type SetState = (next: TeamState | ((previous: TeamState) => TeamState)) => void
const today = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const firstName = (name: string) => name.trim().split(' ')[0] || 'there'
const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

/** The seller invite email, personalized for one client. */
export function inviteTemplate(name: string) {
  const template = emailTemplates.find(item => item.id === 'seller-activate')!
  if (!name.trim()) return { ...template, subject: template.subject.replace('John, your', 'Your'), intro: template.intro.replace('Hi John, ', 'Hi, ') }
  const first = firstName(name)
  return { ...template, subject: template.subject.replace('John', first), intro: template.intro.replace('Hi John', `Hi ${first}`) }
}

const shortDate = (date?: string) => date?.replace(/, \d{4}$/, '') ?? ''
function detail(person: ClientPerson, invite: ClientInvite) {
  if (invite.status === 'active') return `Joined ${shortDate(invite.updatedOn)}`
  if (invite.status === 'invited') return `Invite sent ${shortDate(invite.updatedOn)}`
  if (invite.status === 'removed') return `Access removed ${shortDate(invite.updatedOn)}`
  return person.source === 'Brivity' ? `${person.role} in Brivity` : person.role
}

export function ClientAccess({ state, setState }: { state: TeamState; setState: SetState }) {
  const isAdmin = state.role === 'admin'
  const [dialog, setDialog] = useState<{ person: ClientPerson | null } | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [removing, setRemoving] = useState<ClientPerson | null>(null)
  const inviteOf = (person: ClientPerson): ClientInvite => state.invites[person.id] ?? { status: 'not-invited' }
  const [tab, setTab] = useState<'team' | 'viewers'>('viewers')
  /** Only people who were invited appear; nobody is pre-listed. */
  const viewers = state.clients.filter(person => inviteOf(person).status !== 'not-invited')
  const target = dialog?.person
  const resending = target ? inviteOf(target).status === 'invited' : false
  const recipient = target?.name ?? name.trim()

  function open(person: ClientPerson | null) {
    setName(''); setEmail(''); setNote(person ? inviteOf(person).note ?? '' : '')
    setDialog({ person })
  }
  function send() {
    if (!dialog || !isAdmin) return
    if (!target && !validEmail(email)) { toast.error('Add a valid email address.'); return }
    const person: ClientPerson = target ?? { id: `client-${Date.now()}`, name: name.trim() || email.trim(), email: email.trim(), role: 'Invited by your team', source: 'Invited' }
    setState(previous => ({
      ...previous,
      clients: previous.clients.some(item => item.id === person.id) ? previous.clients : [...previous.clients, person],
      invites: { ...previous.invites, [person.id]: { status: 'invited', updatedOn: today(), updatedBy: teamPeople.admin.name, note: note.trim() || undefined } },
    }))
    setTab('viewers')
    toast.success(`${resending ? 'Invite resent' : 'Invite sent'} to ${firstName(person.name)}`)
    setDialog(null)
  }
  function remove() {
    if (!removing || !isAdmin) return
    setState(previous => ({ ...previous, invites: { ...previous.invites, [removing.id]: { status: 'removed', updatedOn: today(), updatedBy: teamPeople.admin.name } } }))
    toast.success(`${firstName(removing.name)} no longer has portal access`)
    setRemoving(null)
  }

  return <PortalSection prominent title="Portal access" subtitle={isAdmin ? undefined : 'Admins send invites and manage access.'} action={isAdmin ? <Button size="small" variant="contained" startIcon={<AddOutlined />} onClick={() => open(null)} aria-label="Invite a client">Invite</Button> : undefined}>
    <Tabs value={tab} onChange={(_, value) => setTab(value)} aria-label="Who can see this portal" className="team-access-tabs">
      <Tab value="team" label={`Team · ${transaction.team.length}`} id="access-tab-team" aria-controls="access-panel-team" />
      <Tab value="viewers" label={`Viewers · ${viewers.length}`} id="access-tab-viewers" aria-controls="access-panel-viewers" />
    </Tabs>
    {tab === 'team' && <Box role="tabpanel" id="access-panel-team" aria-labelledby="access-tab-team">
      <Box component="ul" className="team-access-list">{transaction.team.map(member => <Box component="li" className="team-access-person" key={member.id}>
        <Avatar src={member.photoUrl} alt="" sx={{ width: 40, height: 40 }}>{member.initials}</Avatar>
        <Box className="team-access-copy"><Typography variant="titleXS">{member.name}</Typography><Typography variant="bodySStandard" color="text.secondary">{member.role}</Typography></Box>
      </Box>)}</Box>
      <Typography variant="bodySStandard" color="text.secondary" className="team-access-footnote">Team members come from the Brivity transaction.</Typography>
    </Box>}
    {tab === 'viewers' && <Box role="tabpanel" id="access-panel-viewers" aria-labelledby="access-tab-viewers">
      {viewers.length === 0 && <Typography variant="bodyMStandard" color="text.secondary" sx={{ py: 2 }}>No one has been invited yet.</Typography>}
      <Box component="ul" className="team-access-list">{viewers.map(person => {
        const invite = inviteOf(person)
        return <Box component="li" className="team-access-person" key={person.id}>
          <Avatar src={person.photoUrl} alt="" sx={{ width: 40, height: 40 }}>{person.name[0]}</Avatar>
          <Box className="team-access-copy"><Typography variant="titleXS">{person.name}</Typography><Typography variant="bodySStandard" color="text.secondary">{detail(person, invite)}</Typography></Box>
          {isAdmin && <Box className="team-access-actions">
            {invite.status === 'removed' && <Button size="small" variant="outlined" onClick={() => open(person)} aria-label={`Invite ${person.name}`}>Invite again</Button>}
            {invite.status === 'invited' && <Button size="small" onClick={() => open(person)}>Resend</Button>}
            {['invited', 'active'].includes(invite.status) && <Button size="small" className="team-remove-access" onClick={() => setRemoving(person)} aria-label={`Remove access for ${person.name}`}>Remove</Button>}
          </Box>}
        </Box>
      })}</Box>
    </Box>}
    <PlaceModal open={!!dialog} onClose={() => setDialog(null)} size="l" title={target ? `${resending ? 'Resend invite to' : 'Invite'} ${target.name}` : 'Invite someone to this portal'} description="Nothing is sent until you choose Send." actions={<><Button onClick={() => setDialog(null)}>Cancel</Button><Button variant="contained" onClick={send}>{resending ? 'Resend invite' : 'Send invite'}</Button></>}>
      {dialog && <Stack spacing={3} sx={{ pt: 1 }}>
        {target
          ? <TextField label="To" value={target.email} disabled fullWidth helperText={target.source === 'Brivity' ? 'Contact details come from Brivity. Update them there.' : undefined} />
          : <><TextField label="Email" type="email" value={email} onChange={event => setEmail(event.target.value)} fullWidth autoFocus required /><TextField label="Name (optional)" value={name} onChange={event => setName(event.target.value)} fullWidth helperText="Used to greet them in the email." /></>}
        <TextField label="Personal note (optional)" value={note} onChange={event => setNote(event.target.value)} fullWidth multiline minRows={3} placeholder={recipient ? `A few words for ${firstName(recipient)}…` : 'A few words for your client…'} helperText="Appears in the email below Avery’s introduction." />
        <Box><Typography variant="labelM" sx={{ mb: 1.5, display: 'block' }}>Email preview</Typography><Box className="team-email-preview"><Typography variant="bodySStandard" color="text.secondary" className="team-email-subject">Subject: {inviteTemplate(recipient).subject}</Typography><EmailPreview template={inviteTemplate(recipient)} personalNote={note} /></Box></Box>
      </Stack>}
    </PlaceModal>
    <PlaceModal open={!!removing} onClose={() => setRemoving(null)} title={removing ? `Remove ${removing.name}’s portal access?` : ''} description="This takes effect right away." actions={<><Button onClick={() => setRemoving(null)}>Cancel</Button><Button variant="contained" color="error" onClick={remove}>Remove access</Button></>}>
      <Typography variant="bodyMStandard">{removing && `${firstName(removing.name)} won’t be able to open the portal for this transaction. Nothing is sent to them. You can invite them again later.`}</Typography>
    </PlaceModal>
  </PortalSection>
}
