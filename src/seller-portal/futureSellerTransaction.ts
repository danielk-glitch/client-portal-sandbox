import { sampleSellerTransaction, type SellerTransaction } from './sellerTransaction'
import type { MarketingSnapshotData } from './MarketingSnapshot'

export const futureSellerTransaction: SellerTransaction = structuredClone(sampleSellerTransaction)

export const futureMarketingSnapshot: MarketingSnapshotData = {
  channels: [
    { label: 'Mailer campaigns', count: 2, unit: 'sent' },
    { label: 'Digital ads', count: 4, unit: 'live' },
    { label: 'Printed media', count: 3, unit: 'pieces' },
    { label: 'Social media graphics', count: 8, unit: 'created' },
    { label: 'Social media posts', count: 6, unit: 'published' },
    { label: 'Videos', count: 2, unit: 'shared' },
  ],
}
