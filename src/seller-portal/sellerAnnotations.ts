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
    note: "Pulls in data from the seller report as well as showing feedback at the surface level. Clicking it opens a new marketing dashboard that's a combination of the seller report and the advertising + showing feedback tabs from the current client portal.",
  },
]
