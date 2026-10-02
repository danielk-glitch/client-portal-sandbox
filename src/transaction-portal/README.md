# Transaction portal components

`types.ts` defines content shared by seller and buyer transaction views. `components/` owns the visual treatment of people, dates, activity, tasks, advertising, feedback, notes, documents, and detail sections. Import those components through `components/index.ts`.

Pages own route state, the transaction data they display, and actions such as opening a document. `SellerPortal` currently supplies those values and accepts `transaction` and `basePath` props, so a second seller view can use different sample data and its own listing URL while sharing the same presentation. A buyer page can compose the shared components without importing seller data.

The central component gallery keeps portal examples together in its collapsed **Portal patterns** section. Add new portal-specific examples there rather than giving each row a separate gallery entry.
