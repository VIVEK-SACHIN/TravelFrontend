import api from './client'
import type { BillingRecord } from '../types'
import { normalizeId } from '../utils/mongoId'

function normalizeBillingRecord(raw: BillingRecord): BillingRecord {
  return {
    ...raw,
    _id: normalizeId(raw._id),
    tour: {
      ...raw.tour,
      _id: normalizeId(raw.tour._id),
    },
  }
}

export async function fetchMyBilling(): Promise<BillingRecord[]> {
  const { data } = await api.get<{ data: { docs: BillingRecord[] } }>('/billing/my')
  return data.data.docs.map(normalizeBillingRecord)
}
