# PLACE Client Portal Sandbox

A local design sandbox for exploring the PLACE client portal. Built with Vite, React, TypeScript, Material UI, and Vitest.

## Getting started

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev` starts the local development server.
- `npm run build` type-checks and creates a production build.
- `npm run test` runs Vitest in watch mode.
- `npm run test:run` runs Vitest once.
- `npm run lint` checks the project with Oxlint.

The shared Material UI theme lives in `src/theme.ts`.
The component gallery at `/components` shows the MUI components customized by that theme, their variants, and applicable states. Open it from the sandbox home page when running locally.

## Design tokens

- `src/design-tokens.css` contains all 107 Figma color tokens. Primitive sRGB values are represented as OKLCH; semantic colors default to Light and switch to Goth when the root element uses `data-color-mode="goth"`.
- `src/design-tokens.ts` contains the 17 Figma Manrope type styles. Use them through the custom MUI Typography variants, such as `displayL`, `titleM`, `bodyMStandard`, `labelS`, and `metricL`.
- Manrope weights 400 and 500 are bundled locally through Fontsource.
