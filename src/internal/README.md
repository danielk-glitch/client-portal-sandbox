# Internal sandbox tools

Everything in this folder is for design exploration, review, or preview. These components are not part of the consumer product and must not be reused in production screens.

- `review/`: annotations, feedback toolbar, journey scenario picker, and seller design panel. Styles and tests live beside the tools. `sellerJourneyViews.ts` contains illustrative preview scenarios.
- `component-gallery/`: the working gallery of consumer components and tokens.
- `email-gallery/`: email template selection and responsive preview controls. The actual email content remains in `src/email-templates`.
- `SandboxApp.tsx`: prototype routes, sandbox navigation, and placeholder previews.

Consumer components belong in `src/components`, `src/transaction-portal`, or `src/seller-portal`. Add future review and preview tools here instead of those folders. The sandbox seller page mounts `SellerReviewTools` explicitly; omit that integration when building the production product.
