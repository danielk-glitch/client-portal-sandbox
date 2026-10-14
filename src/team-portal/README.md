# team experience exploration

product prototypes use browser-local sample data. the sandbox index links to four team pages and the internal flow map.

## product pages

| route | purpose |
| --- | --- |
| `/team` | transaction client experience overview and portal preview |
| `/team/preview` | actual latest seller portal with a read-only preview banner |
| `/team/resources` | transaction visibility and saving selections as defaults |
| `/team/library` | shared team materials, search, draft previews, and admin archiving |
| `/team/editor?id=team-welcome` | rich-text authoring, draft preview, saving, and publishing confirmation; accessed through the library |

publishing happens in a dialog within the editor, not a separate page. brivity entry, permissions, and resource state documentation have no dedicated screens. the brivity entry point will be defined separately.

## preview

seller preview renders `SellerPortal` with the same future transaction and marketing snapshot as `/seller/future-v1`. it adds the team’s visible, published resources, hides design review tools, and disables document pin changes. document and resource browsing remain available. preview links open in a separate tab.

`?type=buyer` renders the existing buyer placeholder. no finished buyer portal design exists yet.

## sample behavior

- the sample account is an admin. browser-local role state remains supported, without a product-facing role switcher.
- only admins can publish or archive. publishing updates the shared resource in every linked transaction while preserving visibility.
- drafts stay private to the team; published content continues appearing until the next publication.
- use as default saves the current selection for future transactions. existing selections stay intact.
- sample changes persist under `place-team-exploration-v1`; this is not authentication or production permission enforcement.

## internal documentation canvas

`/team/flow-map.html` is a dark, scrollable transaction timeline with brivity, team, and client lanes. drag the background to pan; select fixed cards for details; open their page buttons; use zoom, fit, or stage shortcuts. arrow keys pan a focused canvas, +/- zoom, and 0 fits. touch users can scroll naturally. the buyer journey is illustrative. card positions are dictated by the flow and cannot be rearranged.

## proposals kept separate from decisions

members can create/edit drafts and manage transaction visibility. admins save team-wide buyer/seller defaults. archived content remains in existing portals. these are prototype proposals; only admin publishing/archiving is confirmed. the working decisions record lives at `/Users/daniel/Desktop/PLACE Consumer/Client Portal/team-experience-decisions.md`.
