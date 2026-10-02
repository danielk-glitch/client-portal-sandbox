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

## Primary surface language: glass

- Glass is the dominant treatment throughout the experience: navigation, cards, controls, status modules, overlays, and image-led sections should feel like one translucent component family.
- Build glass from existing semantic surface, border, blur, radius, and elevation tokens. Never hardcode a one-off glass recipe.
- Use neutral smoke, soft white, or deep navy glass—never colorful glass, rainbow refraction, neon edges, or decorative gradients.
- Background context must remain visible through glass without competing with its content. Increase opacity before adding stronger blur.
- Use a subtle hairline edge and restrained shadow to separate glass from the image. Glass should feel like polished material, not a glowing effect.
- Use no more than two translucent layers in the same stack. Nested glass beyond two levels becomes muddy and destroys hierarchy.
- On quiet solid backgrounds, use highly opaque glass with subtle tonal separation. Do not exaggerate blur where there is nothing meaningful behind it.
- If text contrast cannot pass over an image, use a darker overlay or an opaque system surface. Legibility takes priority over translucency.
- Support reduced-transparency preferences with an opaque semantic-surface fallback.

## Layer hierarchy

Build image-led modules in this order:

1. Full-bleed architectural or lifestyle photography
2. A restrained tonal overlay for predictable contrast
3. One primary glass container carrying the hierarchy—not scattered floating cards
4. Opaque controls or small solid surfaces when an action needs extra clarity

## Page composition

- Design mobile-first, then adapt the composition to larger screens. Do not merely stretch mobile cards across desktop widths.
- Use immersive image-led openings and occasional full-width photographic sections to establish place, ownership, and emotional context.
- Alternate immersive moments with calm information sections so long pages have rhythm rather than uninterrupted spectacle.
- Keep the default page canvas near white, visually equivalent to approximately `#FEFEFE`. Do not use gray as the default full-page background.
- Use soft gray only for bounded sections, contained bands, grouped modules, or selected states where it creates meaningful structural contrast. A gray region should have a visible beginning and end rather than tinting the entire page.
- Give each section one clear purpose, one focal element, and no more than one primary action.
- Use the system page gutter and spacing scale. Favor generous vertical separation and compact internal component spacing.
- Keep reading lines between 45 and 75 characters, targeting approximately 65.

## Imagery

- Use warm, editorial photography of real homes, architecture, neighborhoods, materials, and lived-in details.
- Prefer natural light, restrained styling, believable spaces, and quiet human presence. The image should feel attainable, not staged as luxury advertising.
- Crop decisively and edge-to-edge. Preserve a clear low-detail region for overlaid text or glass content.
- Never place essential text on an uncontrolled image without a contrast layer. Do not use oversaturated HDR, obvious stock poses, collages, or unrelated lifestyle filler.

## Color

- Use the existing neutral system: near-white, soft gray, charcoal, and near-black. The default page background is a clean near-white equivalent to approximately `#FEFEFE`; use the system canvas token when one exists rather than hardcoding the value.
- Reserve soft gray backgrounds for select contained sections, cards, bands, and grouping surfaces. Never use gray as a page-wide default merely to make white cards visible; establish hierarchy through spacing, subtle elevation, or a bounded tonal section instead.
- Every contained surface whose boundary communicates grouping must separate clearly from the adjacent canvas. Use one method by default: a fill with at least a 0.03 OKLCH lightness difference, a subtle neutral hairline stroke, or a soft elevation token. Never rely on `#FFFFFF` against a `#FEFEFE`-like canvas by itself; that difference is visually imperceptible.
- Add a second separation method only when the surface is interactive, raised, or placed over photography. Strokes remain low contrast and neutral; never use a dark outline simply to make a container visible.
- Deep navy is the principal dark surface for focused transaction states, selected navigation, and timelines.
- Photography supplies most non-semantic color. Reserve product accents for defined semantic meanings; never add a new accent merely to make a screen interesting.

## Typography

- Use the existing Display, Title, Body, Label, and Metric styles. They should remain connected to the system's `Default` type variable.
- Use regular weight for large display and primary titles. Use medium weight for smaller titles, labels, controls, and emphasis. Avoid heavy bold typography.
- Use Display styles rarely: immersive openings, major home-value moments, or celebratory states. Routine screen titles use Title styles.
- Use Standard body leading for instructions, comments, guidance, and text of three or more lines. Compact leading is limited to one or two lines inside constrained UI.
- Keep small uppercase labels brief and widely tracked; preserve sentence case everywhere else.
- Use tabular numerals for prices, rates, dates, countdowns, estimates, and changing values.
- Center only short, self-contained moments. Long explanations, lists, forms, and data remain left-aligned.

## Components and patterns

- A new component must look related to the components beside it: reuse the same radius tier, glass materials, borders, internal spacing, icon treatment, typography roles, and interaction behavior.
- Use one primary action per card, section, modal, or view. Competing primary actions mean the hierarchy is unresolved.
- Primary actions may use a calm opaque fill for contrast against glass. Secondary actions use the existing lower-emphasis or outlined treatment.
- Use pill shapes for compact controls, filters, and prominent single actions only. Use the system icon library at its existing stroke weight; never mix icon families or use emoji as interface icons.
- Data modules lead with one meaningful value, followed by muted context. Charts are quiet, mostly neutral, minimally labeled, and free of decorative fills.
- Lists and timelines use strong spacing, alignment, and type hierarchy before borders or shadows. Avoid boxing every row.
- Provide every new interactive component with default, hover, pressed, focus, disabled, loading, empty, and error behavior as applicable.

## Co-branding

- The transaction portal may visually favor the agent or team, but the shell must feel authored by PLACE. Express partners through approved logos, avatars, names, and attribution—not partner fonts or control colors.
- Nationwide search and homeownership are primarily PLACE-branded; every co-branded screen must look intentionally composed, never badged after the fact.

## Accessibility and responsive behavior

- Verify contrast after the final image crop and overlay are applied. Never assume a reusable overlay works across every photograph.
- Touch targets are at least 44 × 44 CSS pixels. Mobile input text is at least 16px.
- Layouts must survive browser zoom, larger text settings, long names, localized copy, and missing imagery without clipping or overlap.
- Preserve visible keyboard focus, never hide required actions behind hover, and honor reduced-motion and reduced-transparency preferences.

## Definition of done

- The screen uses existing components and semantic tokens wherever they exist.
- Glass is the dominant surface language, but content remains more noticeable than the effect.
- The page has one obvious next action and a calm reading order.
- Photography feels architectural, warm, and relevant to the user's home journey.
- New components include all required states, belong to the existing family, and introduce no raw visual values without a documented system-level reason.

## Notes from the study

Do not carry forward these weaknesses visible in the references:

- Glass-on-glass stacks beyond two layers; consolidate hierarchy into one primary glass container.
- Small, low-contrast labels over photography or translucent surfaces.
- Repeated white pill actions that make every decision appear equally important.
- Long runs of similarly sized cards; vary pacing with calm information sections and immersive photographic chapters.
- Inconsistent radius or shadow recipes between cards, overlays, and controls.
- Duplicate promotional modules or repeated content used only to fill a long screen.
- Section-title-plus-arrow rows repeated mechanically when the whole section is already visibly actionable.

## Exports

This file is the portable system contract. The connected Figma library or implemented component tokens remain the source of truth for exact values.

- CSS · Export semantic tokens to `tokens.css`; components consume named roles rather than raw values.
- Tailwind v4 · Map the same semantic roles through `@theme` without introducing a parallel palette.
- DTCG · Export shared color, typography, spacing, radius, elevation, and motion roles to `tokens.json` when cross-platform delivery begins.
- shadcn/ui · Map existing PLACE semantic roles onto shadcn variables; do not adopt shadcn defaults as a second visual system.
- Native · Preserve the same role names when mapping to iOS and Android resources so co-branding and semantic states remain consistent across products.
