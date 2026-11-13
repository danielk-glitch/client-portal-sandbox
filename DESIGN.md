<!-- Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4 -->
<!-- Hallmark · studied: yes · DNA-source: image · extracted: 2026-09-23 -->

# PLACE Consumer design direction

PLACE should feel like the Apple of consumer real estate: premium but attainable, calm, clear, and deeply considered. The interface should make complicated real-estate moments feel simple and managed, with the emotional warmth of home rather than the visual language of enterprise software.

## Hallmark study record

- Source · User-attached PLACE consumer product screenshots: Home Screen as the primary reference, with Client Portal, Home Value, and Loading as supporting evidence.
- Confidence · Structure, surface roles, and rhythm were read directly from the screenshots. Font names and exact color values were not inferred; the connected design system remains authoritative.
- Genre · Modern-minimal product UI with a photographic editorial layer.
- Primary macrostructure · Ecosystem Index, leaning toward Bento Grid: a home hub composed from varied transaction, service, property, event, and upgrade modules.
- Hero archetype · H6 Photographic Fold: decisive crop, restrained tonal scrim, overlaid greeting, and one primary status surface.
- Feature archetype · F1 Bento: mixed full-width and two-up modules with clear changes in scale rather than uniform cards.
- Navigation · Persistent five-destination native bottom navigation. It replaces a conventional page footer on core mobile screens.
- Structural variants · Narrative Workflow for transaction progress; Stat-Led for home value and market intelligence; photographic form overlay for focused setup and loading states.
- Type roles · Regular soft-geometric or neutral-grotesque display and body; short uppercase or monospaced labels; tabular numerals for data.
- Surface axes · Near-white page canvas / regular sans display / neutral deep-navy anchor. Photography provides warmth and most chromatic color.

## Source of truth

- Inspect the available design system before building. Reuse its components, variants, text styles, icons, and tokens; the connected Figma library or component code governs exact APIs and values.
- Never invent a component variant, token name, font size, radius, shadow, or color when the system already provides an answer.
- If no existing component fits, compose from system primitives first. Create a new shared component only when the pattern will repeat.

## Visual character

- Make the home visually present. Architecture and interiors are part of the interface; use a predominantly monochrome UI and let photography provide warmth and natural color.
- Favor quiet confidence: regular-weight display type, generous space, simple geometry, precise alignment, and very little ornament.
- Pages should feel editorial and cinematic, but remain unmistakably useful product interfaces.
- Avoid conventional real-estate software cues: bright sales colors, busy property grids, heavy dashboards, decorative roofs or keys, and generic stock imagery.

## Surfaces: white, hairlines, one card

The portal is opaque. Content sits on a near-white canvas, grouped by spacing, hairlines, and one card surface. Translucency is reserved for things that float over moving content (the sticky header, the document viewer dock) and for controls on photography.

- **Canvas.** `--color-semantic-surface-primary`, never a gray page background.
- **Card.** `PlaceCard`: white, `--radius-m`, `--elevation-1`, no stroke, `--padding-card` inside. It is the only card. Never restyle a card's radius, shadow, or stroke locally. If a surface needs something else, it is not a card.
- **Overlay.** Modals (`PlaceModal`), sheets (`PlaceSheet`), and the full timeline: `--radius-l`, `--elevation-3`, `--padding-overlay`.
- **On photography.** A restrained scrim under the text, then one opaque surface (the agent card, `--elevation-3-on-photo`) or the `onImagePrimary` / `onImageSecondary` buttons. No more than two layers.
- **Frosted.** Only the sticky header and floating toolbars. Opaque fallback under `prefers-reduced-transparency`.

## Separating content

Use one method per boundary. Pick by what is being separated:

| Separating | Use | Never |
| --- | --- | --- |
| Rows in a list | A 1px hairline (`--color-semantic-stroke-primary-light`) between rows. No line above the first or below the last. | Boxing each row, gray row fills at rest |
| A card's header from its body | `PortalSectionHeader` (title, optional action, hairline below) | A second card inside |
| Groups inside a card or sheet | Spacing, then a hairline if the groups are peers | A gray rounded block |
| A card from the page | `--elevation-1` | A stroke plus a shadow |
| Major page zones | `--gap-zone` and a full-width hairline, then a Title | A colored band |

- **No gray rounded blocks.** Stats, facts, and callouts sit on white with hairlines. Gray fills are for small, bounded things only: icon badges, image placeholders, hover and selected states.
- **Hairlines are one color:** `stroke-primary-light`. `stroke-primary-lightest` is too faint on the canvas to separate anything. `stroke-primary` is for control outlines (outlined buttons, quiet tags), not dividers.
- **A stroke and a shadow never meet** on the same surface, except an interactive outlined control on a photo.

## Tokens: radius, elevation, spacing, focus, motion, breakpoints

All shape, space, focus, motion, and breakpoint values live in `src/system-tokens.css` (CSS) and `src/system-tokens.ts` (MUI theme and `sx`). Colors and type live in `design-tokens.css`; `design-tokens.ts` points the MUI type variants at those CSS variables. Never write a raw radius, shadow, padding, font size, focus outline, transition timing, or screen width that a token covers. PLACE v1 is light mode only. The component gallery (`/components`) shows each one.

### Corner radius: pick by what the surface is, not its size

| Token | Value | Use |
| --- | --- | --- |
| `--radius-2xs` | 4px | Marks only: progress bars, tiny indicators |
| `--radius-xs` | 8px | Hover and selected fills inside menus, small thumbnails |
| `--radius-s` | 12px | Inputs, menus, popovers, tooltips, image tiles inside cards, list-row hover |
| `--radius-m` | 20px | Every card |
| `--radius-l` | 28px | Every overlay: modals, sheets, the full timeline |
| `--radius-pill` | 999px | Buttons, tags, chips, segmented switches, filters |
| `--radius-circle` | 50% | Avatars, date stamps, icon badges, icon buttons, pagination |

### Elevation: four levels

| Token | Level | Use |
| --- | --- | --- |
| `--elevation-0` | Flat | On the canvas, separated by spacing or a hairline |
| `--elevation-1` | Rest | Cards on the page. Includes a faint 1px edge (4% ink) built into the shadow, so card outlines hold on the canvas. Never add a separate border on top |
| `--elevation-2` | Floating | Above content while scrolling or acting: sticky header, menus, popovers, toasts, an interactive card on hover |
| `--elevation-3` | Overlay | Modals, sheets, the full timeline |
| `--elevation-3-on-photo` | Overlay on a photo | A surface placed on photography |

A nested card (a property card inside the Market activity card) also uses `--elevation-1`. Never invent a shadow; if none of the four fits, the surface is the wrong kind.

### Spacing: a 4px base on an 8px rhythm

Scale: `--space-2, 4, 6, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80`. `--space-6` is only for tight inline gaps (metadata separators, icon plus label). Negative margins use `calc(var(--space-n) * -1)`.

Use the semantic roles first:

| Token | Value | Use |
| --- | --- | --- |
| `--padding-card` | 32, 20 on phones | Inside every card |
| `--padding-overlay` | 32, 20 on phones | Inside modals and sheets |
| `--padding-row-block` | 20 | Above and below each list row |
| `--row-hover-bleed` | 12 | How far a row's hover fill reaches past the column edge |
| `--gap-stack` | 16 | A section label to its content |
| `--gap-card` | 24 | Between cards |
| `--gap-section` | 64, 48 on phones | Between sections in a zone |
| `--gap-zone` | 80, 56 on phones | Between the page's major zones |

### Focus ring

Every control uses `outline: var(--focus-ring); outline-offset: var(--focus-ring-offset);` (2px, `stroke-primary-dark`, 2px outside). Use an inset offset (`-2px`) only where an outside ring would be clipped, such as a full-width card footer. Over photography or the dark timeline band, use `--focus-ring-on-dark`.

### Motion

| Token | Value | Use |
| --- | --- | --- |
| `--motion-press` | 120ms ease-out | Press scale on buttons and links |
| `--motion-hover` | 160ms ease | Hover and selection: fills, colors, borders, small icon nudges |
| `--motion-reveal` | 200ms ease | Something changing shape in place: a chevron turning, a card lifting |
| `--motion-overlay` | 240ms ease-out | Modals, sheets, and drawers entering |

Write `transition: background-color var(--motion-hover)`. For APIs that take a number, use `motionMs` from `system-tokens.ts`. Every transition switches off under `prefers-reduced-motion`. Longer choreographed sequences (the timeline, hero entrances) may set their own timing with a comment saying why.

### Breakpoints

Six widths, and only these: smallPhone 420, phone 600, tablet 768, laptop 900, desktop 1100, wide 1280. CSS can't read variables inside `@media`, so write them as max-width 0.05px under the value: `@media (max-width: 599.95px)`. In TypeScript use `useMediaQuery(below('phone'))`.

## Page composition

- Design mobile-first, then adapt the composition to larger screens. Do not merely stretch mobile cards across desktop widths.
- Use immersive image-led openings and occasional full-width photographic sections to establish place, ownership, and emotional context.
- Alternate immersive moments with calm information sections so long pages have rhythm rather than uninterrupted spectacle.
- Keep the default page canvas near white, visually equivalent to approximately `#FEFEFE`. Do not use gray as the default full-page background.
- Give each section one clear purpose, one focal element, and no more than one primary action.
- Use the spacing roles (`--gap-stack`, `--gap-card`, `--gap-section`, `--gap-zone`). Favor generous vertical separation and compact internal component spacing.
- Keep reading lines between 45 and 75 characters, targeting approximately 65.

## Imagery

- Use warm, editorial photography of real homes, architecture, neighborhoods, materials, and lived-in details.
- Prefer natural light, restrained styling, believable spaces, and quiet human presence. The image should feel attainable, not staged as luxury advertising.
- Crop decisively and edge-to-edge. Preserve a clear low-detail region for overlaid text or the agent card.
- Never place essential text on an uncontrolled image without a contrast layer. Do not use oversaturated HDR, obvious stock poses, collages, or unrelated lifestyle filler.

## Color

- Use the existing neutral system: near-white, soft gray, charcoal, and near-black. The default page background is a clean near-white equivalent to approximately `#FEFEFE`; use the system canvas token when one exists rather than hardcoding the value.
- Soft gray is for small bounded things only: icon badges, image placeholders, hover and selected states. Never a page background, a card fill, or a rounded block around content.
- Separate surfaces with one method (see Separating content). Never rely on `#FFFFFF` against the near-white canvas by itself; that difference is invisible.
- Deep navy is the principal dark surface for focused transaction states, selected navigation, and timelines.
- Photography supplies most non-semantic color. Reserve product accents for defined semantic meanings; never add a new accent merely to make a screen interesting.

## Typography

- Use the existing Display, Title, Body, Label, and Metric styles. They should remain connected to the system's `Default` type variable.
- Use regular weight for large display and primary titles. Use medium weight for smaller titles, labels, controls, and emphasis. Avoid heavy bold typography.
- Use Display styles rarely: immersive openings, major home-value moments, or celebratory states. Routine screen titles use Title styles.
- Use Standard body leading for instructions, comments, guidance, and text of three or more lines. Compact leading is limited to one or two lines inside constrained UI.
- Keep small uppercase labels brief and tracked with `--tracking-uppercase` (0.08em); preserve sentence case everywhere else.
- In CSS, set type with the style's variables: `font: var(--type-label-s); letter-spacing: var(--type-label-s-tracking);`. Never type a font size by hand. `labelXS` (11px) is only for counts beside a label and tiny markers.
- Use tabular numerals for prices, rates, dates, countdowns, estimates, and changing values.
- Center only short, self-contained moments. Long explanations, lists, forms, and data remain left-aligned.

## Headers, labels, and counts

Each heading job has one style:

| Job | Use |
| --- | --- |
| A page zone ("Listing and transaction details") | `titleL`, after `--gap-zone` and a hairline |
| A card's title ("Important notes", "Market activity") | `PortalSectionHeader` inside the card |
| A list or group on the page or in a list ("What's coming up next", "Dates", "Pinned", "In progress") | `SectionLabel` |
| A short label above a title ("128 Meadowbrook Lane") | `Eyebrow` |

**Labels and counts must earn their place.** Before adding a count, a secondary label, or a metadata item, ask what the reader would do differently with it. If the answer is nothing, leave it out.

- A visible list never shows its own length ("Dates 5", "7 documents", "All 27"). The reader can see it.
- Metadata never repeats what the row already shows. The date stamp shows the date, so the meta line doesn't ("Due Oct 13", "Date TBD", "Thu, Oct 8").
- A count is allowed when it describes something hidden and helps decide whether to open it ("Show done 2"), or when the number is the information (visitors and leads, showings).
- Pagination announces its range to screen readers only; the pager shows where you are.
- When a count stays, it is one step smaller than its label, muted, and on the same baseline (`SectionLabel count`, `DisclosureButton count`). Never "· 2" or a separate right-aligned "2 documents".

## Controls by use case

Pick the control by what it does. Each job has exactly one pattern.

| Job | Control | Notes |
| --- | --- | --- |
| The one primary action in a view | `Button variant="contained"` | At most one per card, section, modal, or view |
| Go somewhere: another view, a sheet, a modal, or further down the page | `TextLink` with → | A quiet text button: no fill at rest, soft pill fill on hover, never an underline. "View marketing dashboard", "See all notes", "Full timeline" |
| Go back | `TextLink direction="back"` (←) | Sits on the same line as the first section label, right aligned |
| Open an external site in a new tab | `TextLink href` (↗) | ↗ means external only, never "opens a sheet" |
| Show or hide more in place | `DisclosureButton` | Under a list: flush left. As a card's last row: `placement="cardFooter"` |
| A secondary action on a row | `Button variant="outlined" size="small"` | The compact pill: 36px to the eye, 44px touch target. "Add to calendar", a linked document |
| Narrow a list to one subset | `FilterPills` (compact outlined pills, selected = contained) | Documents by stage, team to-dos by Open / Done. One is always selected; Open (or All) is the default. No counts in the pills |
| Switch between views of the same content | `SegmentedSwitch` | |
| Switch between sections of a page | MUI `Tabs` (theme-styled) | One tab style everywhere: labels flush with the content edge (the bar bleeds out by `--row-hover-bleed` so each tab's 12px padding and gray hover fill don't shift them), 2px indicator under the label. A hairline under a tab bar is inset by the bleed |
| Icon-only actions | `PlaceIconButton` / `IconButton`, circular, 44px | |
| Page through a long list | MUI `Pagination` | Round items, selected = dark fill, left aligned under the list |

- **Arrows.** → go, ← back, ↗ external, › (chevron) on a row that opens. One exception: a photo-led property card (Market activity) shows ↗ on hover to open that home's listing. Use the Material "Rounded" icons. Never `OpenInFull` for navigation.
- **Pressed state.** Buttons and icon buttons scale to 0.98 (`pressScale` in `src/theme.ts`), and the click ripple uses one light gray (`pressFillColor`). A custom `transition` on a button must keep `scale 120ms ease-out`.

## List rows

Date rows, document rows, open houses, activity, to-dos, and notes share one anatomy:

- **Lead:** a 64px `DateStamp` for anything with a date, or a 44px round icon badge (soft gray fill) for anything without one. Dates are a hairline circle on white; "TBD" uses the same circle. Never a filled date circle, never a square icon tile.
- **Copy:** `titleXS` title, `bodySStandard` summary, `labelS` meta in `text-light`, separated by "·".
- **Trailing:** at most one compact outlined pill, then a chevron if the whole row opens.
- **Alignment:** the lead sits flush with the section label above. Rows are not inset.
- **Separation:** hairlines between rows, `--padding-row-block` above and below each one.
- **Hover:** a `surface-primary-dark` fill, `--radius-s`, from divider to divider and `--row-hover-bleed` past each side of the column. The row's content never moves.

## Tab panels

Every tab under the details zone shares one layout, so switching tabs never shifts the content.

- **Start:** content begins `--padding-panel-top` below the tab bar, flush with the bar's left edge. No panel adds its own top padding or side inset.
- **Intro or filters (optional):** one line in `bodyMStandard`, `text-primary`, max 60ch (class `tab-panel-intro`), or a row of filter pills. Then `--gap-panel` to the list.
- **Groups (optional):** a `SectionLabel`, `--gap-stack` to its rows, `--gap-panel-group` between groups.
- **Rows:** the list-row spec above. Lead is a 44px badge or avatar (a status mark sits centered in that 44px column); a 64px date stamp only for rows that are dates. Title `titleXS`, summary `bodySStandard`, meta `labelS` in `text-light`.
- **Trailing date:** top right in `labelS`, formatted by `formatRowDate` ("Oct 5 · 4:20 PM", year only when it isn't this year). On phones it moves to the row's last line.
- **No cards inside a tab.** Notes, emails, and to-dos are rows like everything else.
- **No counts above a list** ("4 conversations"). Totals stay only when they are the information (open house visitors and leads).

## Tags

`PlaceTag` is a static label on a row, card, or photo. Quiet (default) is a hairline pill on white, which reads on photos too. Strong (dark fill) means the reader must act; use at most one per view. Tags are never buttons. Don't use MUI `Chip` for a static label.

## Components and patterns

- Use the shared components before writing new UI: `PlaceCard`, `PortalSectionHeader`, `PortalIconBadge`, `AgentIdentity`, `PartnerBrandLockup`, `SectionLabel`, `TextLink`, `DisclosureButton`, `PlaceTag`, `DateStamp`, `PlaceModal`, `PlaceSheet`, `SegmentedSwitch`, `Eyebrow`, `Stat`, `FactList`. A new pattern that will repeat becomes a shared component in `src/components` and gets a gallery entry in the same change.
- A new component must look related to the components beside it: the same radius tier, elevation level, padding token, icon treatment, typography roles, and interaction behavior.
- Use one primary action per card, section, modal, or view.
- Use pill shapes for buttons, tags, filters, and switches. Use the Material Rounded icon set at its existing weight; never mix icon families or use emoji as icons.
- Data modules lead with one meaningful value, followed by muted context. Charts are quiet, mostly neutral, minimally labeled, and free of decorative fills.
- Provide every new interactive component with default, hover, pressed, focus, disabled, loading, empty, and error behavior as applicable.
- A page shows each person or lockup once per view. The agent and brand lockups live in the hero, the sticky header, and the footer, not in a side rail too.

## Co-branding

- The transaction portal may visually favor the agent or team, but the shell must feel authored by PLACE. Express partners through approved logos, avatars, names, and attribution, not partner fonts or control colors.
- Nationwide search and homeownership are primarily PLACE-branded; every co-branded screen must look intentionally composed, never badged after the fact.

## Buyer portal

`/buyer/v1-iteration2` (`src/buyer-portal`) is the seller page's latest vision retold for buyers. Same shell, tokens, and shared blocks; buyer-only blocks stay in that folder.

- **Starts at the signed contract.** No offers, saved homes, or homes toured. Stages: Inspection period, Financing, Closing, Move in.
- **Seller-only content never appears:** listing marketing and ads, showing feedback, open houses, market activity and reports, pre-listing prep.
- **Buyers have deadlines, so dates lead.** The hero carries a quiet key dates row under the headline: the next two contract deadlines, then closing with its time and place (after closing: first payment and recorded deed). Each opens its date. No separate key dates card, since it would repeat the stage's dates list. The hero has one action, View home details; directions to closing live in the Closing date's details.
- **Your first 10 days** leads the stage zone only while the inspection period is current: the day count as the headline, one line on what the deadline protects, a to-scale track of five checkpoints (done fills, next gets a ring), and one link to the guide. On phones the track becomes a list.
- **Moving in** joins the Closing and Move in stages; **After closing** joins Move in. Dated items use a date stamp, the rest an icon badge. Only rows tied to a timeline date open.
- **Connect services** is the one upsell: a card at the top of the details zone with a single contained button. For now it confirms with a toast; no link out.
- **Notes.** The lender's "before closing" warning is a starred plain-text note, so it leads Important notes until closing. No special warning styling.
- **Status follows "today".** Steps, stages, documents, notes, emails, and to-dos are dated; the design panel previews four moments in the deal.

## Accessibility and responsive behavior

- Verify contrast after the final image crop and overlay are applied. Never assume a reusable overlay works across every photograph.
- Touch targets are at least 44 × 44 CSS pixels. Mobile input text is at least 16px.
- Layouts must survive browser zoom, larger text settings, long names, localized copy, and missing imagery without clipping or overlap.
- Preserve visible keyboard focus (always `--focus-ring`), never hide required actions behind hover, and honor reduced-motion and reduced-transparency preferences.

## Definition of done

- The screen uses shared components and tokens. No raw radius, shadow, or spacing values; no local restyling of a card.
- Every boundary uses one separation method from the table above.
- Every heading, link, disclosure, and tag uses the pattern for its job.
- Every count and label has earned its place.
- The page has one obvious next action and a calm reading order.
- New components include all required states, appear in the gallery, and introduce no raw visual values without a documented reason.

## Notes from the study

Do not carry forward these weaknesses visible in the references:

- Stacked translucent layers; use one opaque surface on a photo.
- Small, low-contrast labels over photography or translucent surfaces.
- Repeated white pill actions that make every decision appear equally important.
- Long runs of similarly sized cards; vary pacing with calm information sections and immersive photographic chapters.
- Inconsistent radius or shadow recipes between cards, overlays, and controls.
- Duplicate promotional modules or repeated content used only to fill a long screen.
- Section-title-plus-arrow rows repeated mechanically when the whole section is already visibly actionable.

## Exports

This file is the portable system contract. The connected Figma library or implemented component tokens remain the source of truth for exact values.

- CSS · Colors and type: `src/design-tokens.css`. Radius, elevation, spacing: `src/system-tokens.css`. Components consume named roles rather than raw values.
- Tailwind v4 · Map the same semantic roles through `@theme` without introducing a parallel palette.
- DTCG · Export shared color, typography, spacing, radius, elevation, and motion roles to `tokens.json` when cross-platform delivery begins.
- shadcn/ui · Map existing PLACE semantic roles onto shadcn variables; do not adopt shadcn defaults as a second visual system.
- Native · Preserve the same role names when mapping to iOS and Android resources so co-branding and semantic states remain consistent across products.
