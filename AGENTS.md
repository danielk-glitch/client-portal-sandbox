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

Follow `DESIGN.md` for the detailed visual direction. Reuse the semantic tokens in `src/design-tokens.css` and `src/design-tokens.ts`.

Whenever you add or change a PLACE component or design token, update `src/component-gallery/ComponentGallery.tsx` in the same change with its visual sample and relevant guidance; document variants and interaction states where they apply. List only components with project styling or implementation, not untouched MUI defaults.
