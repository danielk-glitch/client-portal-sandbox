export type MarketingMaterial = {
  id: string
  title: string
  category: 'Social graphics' | 'Printed media' | 'Videos'
  date: string
  format: string
  headline: string
  design: 'photo' | 'editorial' | 'framed' | 'print' | 'video'
  aspectRatio: string
  imageIndex: number
}

export const sampleMarketingMaterials: MarketingMaterial[] = [
  { id: 'social-1', title: 'Just listed', category: 'Social graphics', date: 'Sep 1', format: 'Social post', headline: 'A new place to call home', design: 'photo', aspectRatio: '4 / 5', imageIndex: 0 },
  { id: 'social-2', title: 'Property spotlight', category: 'Social graphics', date: 'Sep 2', format: 'Social post', headline: 'Room to slow down', design: 'editorial', aspectRatio: '1 / 1', imageIndex: 1 },
  { id: 'social-3', title: 'Open house invitation', category: 'Social graphics', date: 'Sep 4', format: 'Social story', headline: 'Come see it for yourself', design: 'framed', aspectRatio: '9 / 16', imageIndex: 2 },
  { id: 'social-4', title: 'Home details', category: 'Social graphics', date: 'Sep 5', format: 'Social post', headline: 'The details make it home', design: 'editorial', aspectRatio: '4 / 5', imageIndex: 0 },
  { id: 'social-5', title: 'Neighborhood highlight', category: 'Social graphics', date: 'Sep 6', format: 'Social post', headline: 'Close to everything you love', design: 'framed', aspectRatio: '1 / 1', imageIndex: 2 },
  { id: 'social-6', title: 'Weekend showing', category: 'Social graphics', date: 'Sep 8', format: 'Social story', headline: 'See it this weekend', design: 'photo', aspectRatio: '9 / 16', imageIndex: 1 },
  { id: 'social-7', title: 'Listing update', category: 'Social graphics', date: 'Sep 10', format: 'Social post', headline: 'A closer look', design: 'editorial', aspectRatio: '4 / 5', imageIndex: 2 },
  { id: 'social-8', title: 'Under contract', category: 'Social graphics', date: 'Sep 13', format: 'Social post', headline: 'Under contract', design: 'photo', aspectRatio: '1 / 1', imageIndex: 0 },
  { id: 'print-1', title: 'Property brochure', category: 'Printed media', date: 'Sep 1', format: 'Brochure', headline: '128 Meadowbrook Lane', design: 'print', aspectRatio: '3 / 4', imageIndex: 0 },
  { id: 'print-2', title: 'Open house flyer', category: 'Printed media', date: 'Sep 4', format: 'Flyer', headline: 'Open house', design: 'print', aspectRatio: '8.5 / 11', imageIndex: 1 },
  { id: 'print-3', title: 'Neighborhood mailer', category: 'Printed media', date: 'Sep 9', format: 'Mailer', headline: 'A home worth discovering', design: 'print', aspectRatio: '3 / 2', imageIndex: 2 },
  { id: 'video-1', title: 'Listing tour', category: 'Videos', date: 'Sep 4', format: 'Video', headline: 'Take the tour', design: 'video', aspectRatio: '16 / 9', imageIndex: 0 },
  { id: 'video-2', title: 'Social video', category: 'Videos', date: 'Sep 8', format: 'Short video', headline: 'A look inside', design: 'video', aspectRatio: '16 / 9', imageIndex: 1 },
]
