import type { Annotation } from '../components/AnnotationLayer'

export const sellerAnnotations: Annotation[] = [
  {
    id: 'date-descriptions',
    target: '.upcoming-dates-card .portal-date-row:first-child',
    audience: 'product',
    title: 'Date Descriptions',
    note: "Currently, dates don't have descriptions. Descriptions would help clients better understand what's happening, where they are in the transaction, and provide clarity on the overall process",
  },
  {
    id: 'marketing',
    target: '.marketing-snapshot',
    audience: 'product',
    title: 'New Listing Marketing Block',
    note: "Pulls in data from the seller report as well as showing feedback at the surface level. Clicking it opens a new marketing dashboard that's a combination of the seller report and the advertising + showing feedback tabs from the current client portal.\n\nBTW: Hop in the design panel and change the listing marketing block version to see a version of what we could have (new functionality).",
  },
  {
    id: 'marketing-views',
    target: '.advertising-snapshot',
    audience: 'product',
    title: 'New listing marketing block',
    note: 'Pulls content that we have today (seller report, showing feedback, etc.) and mixes it in with net new, popular features from competitors (namely, listing views).\n\nBTW: Hop in the design panel and switch the marketing block version to see a variant based on just what we have today.',
  },
]
