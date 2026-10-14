# team experience exploration

product prototypes use browser-local sample data. the sandbox index links to the team pages, a member view, and the internal flow map.

## product pages

| route | purpose |
| --- | --- |
| `/team` | one transaction page, ordered by team priority: what the client sees (preview card plus a button that opens the full view), client access and invites, then resource visibility and the seller default |
| `/team/preview` | actual latest seller portal with a read-only preview banner |
| `/team/resources` | same page, scrolled to resources (kept for older links) |
| `/team/library` | shared team materials. admins create, edit, archive, and delete; members browse published resources |
| `/team/defaults` | buyer and seller defaults. admins edit or remove them; members view them |
| `/team/editor?id=team-welcome` | rich-text authoring, draft preview, saving, and publishing confirmation; accessed through the library |

publishing happens in a dialog within the editor, not a separate page. brivity entry, permissions, and resource state documentation have no dedicated screens. the brivity entry point will be defined separately.

## preview

seller preview renders `SellerPortal` with the same future transaction and marketing snapshot as `/seller/future-v1`. it adds the team’s visible, published resources, hides design review tools, and disables document pin changes. document and resource browsing remain available. preview links open in a separate tab.

`?type=buyer` renders the existing buyer placeholder. no finished buyer portal design exists yet.

## sample behavior

- the sample account is an admin (Avery Coleman). add `?as=member` to any team url to switch to the member view (Morgan Ellis, tc); `?as=admin` switches back. the choice persists.
- admins alone create, edit, publish, archive, and delete library resources, and save defaults. anyone on the transaction can change visibility.
- client access, grouped active / invited / not invited. only invited people and brivity collaborators are listed. admins invite brivity collaborators per row, or anyone by name and email through the invite button. nothing is sent until they choose send. the dialog previews the seller invite email with an optional personal note. members see status only.
- publishing updates every transaction where the resource is live and preserves visibility.
- deleting a published resource shows how many transactions it is live in, offers archive instead, and removes it from every transaction and default.
- archived resources stay in the transactions where they are live (still a proposal) and are skipped when a default is applied.
- transaction resources compare the current selection with the seller default, mark changed rows, and offer reset. admins can update the default from there.
- with no saved default, new transactions start with brivity basics visible and team resources hidden (a prototype assumption).
- sample changes persist under `place-team-exploration-v4`; this is not authentication or production permission enforcement.

## internal documentation canvas

`/team/flow-map.html` is a dark, scrollable transaction timeline with brivity, team, and client lanes. drag the background to pan; select fixed cards for details; open their page buttons; use zoom, fit, or stage shortcuts. arrow keys pan a focused canvas, +/- zoom, and 0 fits. touch users can scroll naturally. the buyer journey is illustrative. card positions are dictated by the flow and cannot be rearranged.

## decisions and proposals

permissions and default rules were confirmed october 14, 2026. still open: what archiving does to linked transactions, and what new transactions start with when no default exists. the working decisions record lives at `/Users/daniel/Desktop/PLACE Consumer/Client Portal/team-experience-decisions.md`.
