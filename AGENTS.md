# PLACE client portal sandbox

## Working with the user

Unless the user specifies otherwise, assume they are a product designer with little to no technical expertise. Explain work in terms of the experience and visible result, use plain language, and explain implementation choices to the user using simple, easy to understand language.

## Product context

This repo explores the first product in the PLACE consumer family: a real estate transaction client portal. The broader family will include nationwide home search, a homeownership portal, and a native homeowner app. Design decisions should support a coherent system across those products.

The portal should give buyers and sellers a clear, high-level view of their transaction through milestones, tasks, comments, and important updates. Make a complicated process feel simple and well managed. Buyers and sellers have different goals, but their experiences should share one underlying system.

## Brand direction

PLACE should feel premium but attainable, trustworthy, composed, clear, and approachable. Apple and Airbnb are benchmarks for craft and ease. The product voice is calm, concise, and friendly-professional.

Preserve the recognizable foundation of the existing PLACE brand at https://place.com/: a primarily monochrome palette, clean sans-serif typography, confident scale, generous spacing, and simple layouts. Refine it for consumer warmth and usability. Avoid conventional corporate real estate software, decorative excess, and overly technical or generic presentation.

The portal may favor agent or team branding slightly, while nationwide search and homeownership will be primarily PLACE-branded. Support flexible co-branding so PLACE and partner identities feel intentionally composed across products.

## Design system and component gallery

Follow `DESIGN.md` for the detailed visual direction. Reuse the color and type tokens in `src/design-tokens.css` and `src/design-tokens.ts`, and the radius, elevation, and spacing tokens in `src/system-tokens.css` and `src/system-tokens.ts`. Never hardcode a value a token covers. Build cards with `PlaceCard`, and pick links, disclosures, labels, and tags by the use-case table in `DESIGN.md` › Controls by use case.

The component gallery (`src/internal/component-gallery/ComponentGallery.tsx`, at `/components`) covers system-wide foundations and components only: design tokens, theme-styled MUI components, and shared components in `src/components`. Whenever you add or change one of these, update the gallery in the same change with its visual sample and relevant guidance; document variants and interaction states where they apply. List only components with project styling or implementation, not untouched MUI defaults.

Page-specific components stay with their page (`src/seller-portal`, `src/buyer-portal`, `src/team-portal`) and are not added to the gallery. `src/transaction-portal/components` is the shared transaction kit: rows, panels, and sections that the seller, buyer, and team preview views all compose from transaction data. It is not in the gallery either. A component that isn't about transaction data (a card header, a badge, an identity or brand block) belongs in `src/components` with a gallery entry. Document page and kit components with a short comment at the top of the component instead.
