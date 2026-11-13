# Seller portal · Current Functionality spec

**Status:** Draft for engineering alignment · Nov 6, 2026
**Prototype:** `/seller` in the client portal sandbox (Current Functionality)
**Audience:** Engineering, design, product
**Related:** [Client portal PRD (ClickUp)](https://app.clickup.com/8562814/v/dc/85a3y-43077/85a3y-57637)

---

## How to read this

- The spec follows the client's page from top to bottom. Each section is one **epic**.
- Each numbered requirement (`HDR-01`, `DOC-03`…) is sized to be **one ticket** or a small group of tickets.
- The tag after each ID says how it compares with today's live seller portal:
  - **[NEW]** Not in today's portal
  - **[CHANGED]** Exists today, but behaves or looks different
  - **[SAME]** Visual refresh only; behavior and data unchanged
  - **[CONFIRM]** Not sure; design and engineering need to check against production

> ⚠️ The tags are design's first pass and need to be checked against production before ticketing. Anything marked **[CONFIRM]** is a question, not a decision.

---

## Summary of changes

The biggest differences engineering should plan for:

1. **Overview block (new).** A stage tracker with a countdown, an "Up next" date, and a short notes preview sit under the header. They replace the old Upcoming dates / Recent activity row.
2. **Important notes.** The team can star a note. Starred notes come first everywhere, and clients see the star.
3. **Collaborators.** Outside partners (escrow, title, lender, attorney, inspector) get their own People tab with phone and email.
4. **Listing link.** The header links to the agent's IDX listing page and offers Copy link. The in-portal listing sheet is used only before the home is published.
5. **Showing feedback and Advertising as tabs.** They move into the main tab bar.
6. **Documents.** Clients can pin documents. Files open in an in-page viewer instead of a download or a new tab.
7. **Stage-aware page.** What shows depends on the stage: Before listing, Listed, or Pending.

---

## 0 · Page shell

- **SHL-01 · Top bar** [CONFIRM]
  - PLACE wordmark, divider, and "Client portal" on the left.
  - Signed-in client on the right: initials avatar, name, role (e.g. "Seller").
- **SHL-02 · Footer** [CONFIRM]
  - Lead agent photo, role, name, and call/email icon buttons.
  - Team and brokerage logo lockup.
  - "Powered by Brivity" line.
- **SHL-03 · Deep links** [NEW]
  - The URL keeps page state: `?section=<tab>`, `?people=<tab>`, and `/seller/listing` opens the listing sheet.
  - `#people` and `#transaction-information` scroll to those blocks.
  - Switching tabs replaces history, so it doesn't fill up the back button.
  - Opening the listing sheet adds a history step, so Back closes it.
- **SHL-04 · Entrance motion** [NEW]
  - Each block fades in once as it scrolls into view.
  - Turned off when the user prefers reduced motion.
- **SHL-05 · Team preview mode** [NEW]
  - The team can view the same page as their client, read-only.
  - Pinning is turned off in this mode.
- **SHL-06 · Responsive** [CHANGED]
  - Works down to phone width with no sideways scrolling.
  - Tab bars scroll horizontally on small screens.

---

## 1 · Header (listing overview)

**Purpose:** confirm which home this is, where the listing stands, and who the agent is.

- **HDR-01 · Layout** [CHANGED]
  - Listing photo on the left, summary on the right.
  - Eyebrow: "Seller transaction".
- **HDR-02 · Status** [CONFIRM]
  - Listing status chip, e.g. *Under contract*, *Active*, *Coming soon*.
  - A **Published / Not published** tag beside it.
- **HDR-03 · Address** [SAME]
  - Street address is the page title, with city, state, and ZIP below it.
- **HDR-04 · Agent and brand** [CHANGED]
  - Lead agent identity (photo, name, role), with team and brokerage logos beside it.
  - No contact buttons in the header; contact lives in People and the footer.
- **HDR-05 · Published listing actions** [NEW]
  - Two buttons over the photo.
  - **Copy link** copies the agent's IDX listing URL and shows a "Listing link copied" toast, or an error toast if copying fails.
  - **See Listing** opens the IDX page in a new tab.
- **HDR-06 · Unpublished listing action** [NEW]
  - One **Preview listing** button that opens the in-portal listing sheet (section 1a).
- **HDR-07 · Before listing** [NEW]
  - No photo. The team brand lockup and agent fill the header.

**Data needed**
- Listing status and published flag
- Primary photo and address
- Lead agent, team logo, and brokerage logo
- IDX listing URL for each listing

**Open questions**
- Where does the IDX URL come from, and what happens when an agent has no IDX site? Proposed fallback: open the in-portal sheet.

### 1a · Listing details sheet

- **LST-01 · Photos** [CONFIRM]
  - Bottom sheet with a photo gallery and an "all photos" view.
- **LST-02 · Content** [CONFIRM]
  - Address, price, and highlights (beds, baths, interior size, lot size).
  - Description and listing facts.
  - Interior, exterior, and financial details.
  - Listing information: date listed, days on market, expiration, last updated.
  - Location map and agent.
  - Sections with no data are hidden.
- **LST-03 · Routing** [NEW]
  - Has its own URL (`/seller/listing`).
  - Closing returns to the exact page state the client came from.

---

## 2 · Transaction overview *(new block under the header)*

**Purpose:** answer "where are we, what's next, what should I know" at a glance.

### 2a · Stage tracker

- **OVR-01 · Countdown** [NEW]
  - Eyebrow "Transaction timeline" with a countdown headline: "31 days until closing" or "Today: closing".
  - Before listing, it counts down to "your home goes live".
  - No countdown while Listed.
- **OVR-02 · Stages** [NEW]
  - Four stages in order: **Pre-listing → Active listing → Pending → Closing**.
  - A progress rail fills up to the current stage.
- **OVR-03 · Stage captions** [NEW]
  - Complete: "Done Oct 2".
  - Current: highlighted, with no caption.
  - Upcoming: "From Nov 6", a custom caption, or "Not started".
- **OVR-04 · Interaction** [NEW]
  - Display only on this page: stages can't be clicked.
  - Shown vertically on phones.

**Data needed**
- Current stage
- Start and end date for each stage
- Closing date, or target go-live date before listing

**Open questions**
- Is the stage worked out from listing status and contract dates, or set by the team?

### 2b · Dates

- **DTE-01 · Up next** [CHANGED]
  - Heading "Dates".
  - An **Up next** card shows the first date on or after today, tagged *Today*, *Tomorrow*, or *In N days*.
- **DTE-02 · Later dates** [CHANGED]
  - Up to 5 later dates listed below the card, each with its date and title.
- **DTE-03 · All dates** [NEW]
  - **See all dates** opens an "All dates" dialog with every date in order.
  - Past dates are struck through.
  - The dialog opens scrolled to the first upcoming date.
- **DTE-04 · Empty state** [CONFIRM]
  - "No upcoming dates."

**Data needed**
- Every date on the transaction, past and future: date, title, description

### 2c · Notes preview

- **NTP-01 · Order** [NEW]
  - Heading "Notes", showing up to 3 notes.
  - Starred notes first (most recently starred on top), then newest.
- **NTP-02 · Rows** [NEW]
  - Note text (cut off at 3 lines), star if important, author, and date.
  - Clicking a row opens the full note in a dialog: "Added by {author} · {timestamp}".
- **NTP-03 · See all** [NEW]
  - **See all notes** switches to the Notes tab and scrolls to it.
- **NTP-04 · Stars** [NEW]
  - Clients can see stars but can't add them. Only the team can star a note.
- **NTP-05 · Empty state** [NEW]
  - "No notes yet."

**Data needed**
- A `starredAt` timestamp on notes, set by the team

---

## 3 · People

- **PPL-01 · Tabs** [CHANGED]
  - One card with tabs: **Team · Collaborators · Viewers**.
  - If the sale has no collaborators, the tabs are **Your Team · Viewers**.
- **PPL-02 · Rows** [CHANGED]
  - Photo or initials, name, and role.
  - Phone and email appear as labeled lines you can tap to call or email.
- **PPL-03 · Collaborators** [NEW]
  - Outside partners: escrow, title, lender, attorney, inspector.
  - The role includes the company, e.g. "Escrow officer · Cascade Title".
- **PPL-04 · Viewers** [CONFIRM]
  - The clients with portal access (seller, co-seller), with their contact details.
- **PPL-05 · URL state** [NEW]
  - The selected tab is kept in the URL (`?people=`).

**Data needed**
- Collaborator records for each transaction: name, role, company, phone, email

**Open questions**
- Who manages collaborator records: the team, or a sync from another system?

---

## 4 · Transaction tabs

- **TAB-01 · Tab bar** [CHANGED]
  - **Activity · Tasks · Notes · Showing feedback · Advertising · Documents**.
  - Opens on Activity.
  - Showing feedback and Advertising are hidden before listing.
- **TAB-02 · Pagination** [CONFIRM]
  - Every tab shows 10 items per page.
  - A "1 to 10 of N {items}" count and a pager sit underneath.

### 4a · Activity

- **ACT-01 · Activity list** [SAME]
  - Newest first.
  - Each row: type icon (document, listing, showing, note), title, description, who did it, timestamp.

### 4b · Tasks

- **TSK-01 · Task list** [CONFIRM]
  - Each row: task name, "Due MM/DD/YYYY" tag, description, "Assigned to {name}".
  - Read-only: clients can't complete tasks.

**Open questions**
- Do clients see tasks assigned to the team, or only their own?
- Are there overdue and completed states?

### 4c · Notes

- **NTE-01 · Note cards** [CHANGED]
  - Every note as a card: author avatar, "Added by {name}", timestamp, star if important.
  - Long notes are cut off with **See more**, which opens the full note in a dialog.
- **NTE-02 · Order** [NEW]
  - Starred first, then newest.

### 4d · Showing feedback

- **FBK-01 · Feedback list** [CHANGED: moved into tabs]
  - Each row: date · showing type (In-person showing, Open house…), interest rating (1–5), feedback quote.

### 4e · Advertising

- **ADV-01 · Advertising list** [CHANGED: moved into tabs]
  - Each row: "{Action} on **{Platform}**" (e.g. Listing published on Realtor.com), "Added by {name}", timestamp.
- **ADV-02 · Links** [CONFIRM]
  - When there's a URL, the whole row links to the listing on that platform in a new tab.
  - An arrow appears on hover or keyboard focus.

### 4f · Documents

- **DOC-01 · Document list** [CHANGED]
  - Unpinned documents are list rows: name, "{Category} · Uploaded {date}".
  - Click a row to open it.
- **DOC-02 · Pinned documents** [NEW]
  - Pinned documents show as preview cards above the list, most recently pinned first.
- **DOC-03 · Pinning** [NEW]
  - Pin or unpin from the document viewer.
  - Pins are saved per client per transaction.
  - The prototype saves pins in the browser. Production should save them on the server so they follow the client across devices.
- **DOC-04 · Document viewer** [NEW]
  - Opens on top of the page with a dimmed, blurred background.
  - PDF pages, with one bottom bar: title, page position, zoom, download, pin, close.
  - An info tooltip shows category, posted by, status, and summary.
  - Esc or clicking the background closes it and returns focus to where the client was.
  - On phones the bar uses two compact rows.
- **DOC-05 · Statuses** [CONFIRM]
  - *Signed*, *Signature requested*, *Ready to view*.

**Open questions**
- Does "Signature requested" link out to e-sign?
- Do we need preview thumbnails from the server for pinned cards? The prototype draws a placeholder page.

---

## 5 · Stage behavior (journey views)

The same page adapts to where the sale is. The prototype's review menu switches between these; production should take the stage from transaction data.

**Before listing**
- Header: *Coming soon* · Not published. Brand lockup instead of a photo, with a **Preview listing** button.
- Countdown: days until your home goes live.
- Tracker: current stage is Pre-listing.
- Tabs: Showing feedback and Advertising are hidden.
- Content: preparation dates, tasks, notes, and documents.

**Listed**
- Header: *Active* · Published. Photo with **Copy link** and **See Listing**.
- Countdown: none.
- Tracker: current stage is Active listing.
- Tabs: all shown.
- Content: listed-stage dates, tasks, notes, and documents.

**Pending** *(prototype default)*
- Header: *Under contract* · Published. Photo with **Copy link** and **See Listing**.
- Countdown: days until closing.
- Tracker: current stage is Pending.
- Tabs: all shown.
- Content: contract-to-close dates, tasks, notes, and documents.

---

## Out of scope for this release

These are in other prototype views, not in Current Functionality:

- Marketing snapshot and marketing dashboard
- Market activity (nearby competing homes)
- Resources / guides and date guidance (explanations and preparation tips)
- Expanded milestone timeline with step details
- Emails tab
- Meeting notes (AI note taker recordings)
- Internal review toolbar and design controls (prototype only; must not ship)

---

## Open questions (rolled up)

1. Check every **[CONFIRM]** tag against production.
2. Source of the IDX listing URL, and the fallback when there isn't one (HDR-05).
3. How the transaction stage is worked out (OVR-02, section 5).
4. Who manages collaborator records (PPL-03).
5. Server-side storage for document pins (DOC-03).
6. Which tasks clients see, and their states (TSK-01).
7. E-sign handoff for "Signature requested" documents (DOC-05).
