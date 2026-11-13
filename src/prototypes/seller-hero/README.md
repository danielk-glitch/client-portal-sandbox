# seller hero options

open `/hero-options.html`. switch with the bottom picker, number keys 1 and 2, or the arrow keys. `?v=2` opens private client directly.

- property editorial: light, photo beside an address-led information column.
- private client: charcoal, wide property image beneath the address and countdown.

both use the existing sample transaction and working listing, date details, timeline, and agent contact actions. the sample transaction’s own date drives the countdown. the existing seller page is unchanged.

`PreviewDirection.tsx` and `PreviewShell.tsx` are throwaway copies of the current C2 page and shell for realistic context. nothing in the existing application imports these prototypes. the standalone html file is served by the existing vite dev server.

no direction has been chosen yet. once one is chosen, document the decision, integrate that hero into C2, and remove the comparison scaffolding unless requested otherwise.
