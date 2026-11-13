# Seller portal · Current Functionality spec
TLDR; Read just the headlines for an overview of what we're trying to create and the blocks that go into the page. Read the bullet points for all the nitty gritty details. 

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

## 0 · Page Anatomy

- **Top bar**
  - PLACE wordmark, divider, and "Client portal" on the left.
  - Signed-in client on the right: initials avatar, name, role (e.g. "Seller").
- **Footer** 
  - Lead agent photo, role, name, and call/email icon buttons.
  - Team and brokerage logo lockup.
  - "Powered by Brivity" line.


### Page wide implementation details 
- **Motion on entry** Slight block fade in animation as scroll into view/load. Respect reduced motion 
- **Mobile responsiveness** Nuff said
- **Deep links** 
  - The URL keeps page state: `?section=<tab>`, `?people=<tab>`, and `/seller/listing` opens the listing sheet.
  - `#people` and `#transaction-information` scroll to those blocks.
  - Switching tabs replaces history, so it doesn't fill up the back button.
  - Opening the listing sheet adds a history step, so Back closes it.

---

## 1 · Header (listing overview)

- Goal/Purpose: visual anchor for the experience, highlighting agent, listing, and team/brokerage branding.

Notes: 
- Should be able to get seller/buyer transaction label from CRM as well as other information
- **To Discuss**: Will we have access to the published/not published tag? 
    - UX: Is that even helpful? Point of clarity or distraction? 
- **To Discuss**: Ability to link out to the IDX listing from the see listing button (as well as getting the link to the copy link button)
- If this is prior to the listing going live, you'll see a different view - change it in the design panel for reference 
    - **To Discuss - UX**: is the content in the "Before your home goes live" section universally true? 

---

## 2 · Transaction overview *(new block under the header)*

- Goal/Purpose: help clients orient themselves in the experience and know what they need to know 

### 2a · Stage tracker / Timeline component

- **Timeline header**
  - Eyebrow "Transaction timeline" with a countdown headline: "31 days until closing" or (if closing today) "Closing today!"
  - Before listing, it counts down to "your home goes live".
  - No countdown while Listed.
- **Timeline component** 
  - Show stages in order: **Pre-listing → Active listing → Pending → Closing**.
  - A progress rail fills up to the current stage.

**Data needed**
- Current stage
- Start and end date for each stage
- Closing date, or target go-live date before listing

### 2b · Dates

- **Dates Section**
  - Heading "Dates".
- **Up Next**
  - An **Up next** card shows the first date on or after today, with a tag on the right *Today*, *Tomorrow*, or *In N days*.
- **Rest of the dates** 
  - Up to 5 later dates listed below the card, each with its date and title.
- **See all dates** 
  - **See all dates** opens an "All dates" dialog with every date in order.
  - Past dates are styled differently to indicate they're in the past 
  - Dates in chronological order. The dialog opens scrolled to the first upcoming date.
- **Empty state**
  - "No upcoming dates."

### 2c · Notes preview
- **Notes Section Behavior**
  - Shows 3 notes at a time 
  - Show starred notes first (most recently starred on top), then newest regularr 
  - See all notes switches to the notes tab in the tab section and scrolls to it. 
- **Note Component**
  - Note text cut off at 3 lines. Show star if relevant, name, and date 
  - Clicking on a note opens full note in a dialog 
- **Empty State**
  - "No notes yet."

---

## 3 · People
- **People Section Behavior**
  - Show team, collaborator, and viewers tabs that, you guessed it, show the team, collaborator, and viewers for this transaction 
  - If no collaborators, don't show the tab 
- **Person Component**
  - Avatar (show photo if available, initials if not - CRM as source of truth), name, role, phone, and email 
  - If no role, just show "Team Member", "Collaborator", or "Viewer" depending on the tab 
  - If no phone or email show empty state of "--"

---

## 4 · Transaction tabs

- **Tab Bar**
  - **Activity · Tasks · Notes · Showing feedback · Advertising · Documents**.
  - Opens on Activity.
  - Showing feedback and Advertising are hidden before listing.
- **Tab Section Notes**
  - Every tab shows 10 items per page.

### 4a · Activity
  - Newest first.
  - Each row: type icon (document, listing, showing, note), title, description, who did it, timestamp.

### 4b · Tasks
  - Each row: task name, "Due MM/DD/YYYY" tag, description, "Assigned to {name}".
  - Read-only: clients can't complete tasks, these are the team's tasks and more for visibility for the client than something to be actionable. 

### 4c · Notes
  - Every note as a card: author avatar, "Added by {name}", timestamp, star if important.
  - Long notes are cut off with **See more**, which opens the full note in a dialog.
  - Starred notes first, then newest.

### 4d · Showing feedback
  - Each row: date · showing type (In-person showing, Open house…), interest rating (1–5), feedback quote.

### 4e · Advertising
  - Each row: "{Action} on **{Platform}**" (e.g. Listing published on Realtor.com), "Added by {name}", timestamp.
  - the whole row links to the listing on that platform in a new tab.
  - An arrow appears on hover or keyboard focus.

### 4f · Documents
  - Display documents in a row. Click a row to open it.

### 4f.5 · Document viewer 
  - Opens on top of the page with a dimmed, blurred background.
  - Opens with one bottom bar: title, page position, zoom, download, pin, close.
  - An info tooltip shows category, posted by, status, and summary.
  - Esc or clicking the background closes it and returns focus to where the client was.
  - On phones the bar uses two compact rows.

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
