import api from './client'
import type { MyReview } from '../types'
import { normalizeId } from '../utils/mongoId'

function normalizeMyReview(raw: MyReview): MyReview {
  return {
    ...raw,
    _id: normalizeId(raw._id),
    tour: {
      ...raw.tour,
      _id: normalizeId(raw.tour._id),
    },
  }
}

export async function fetchMyReviews(): Promise<MyReview[]> {
  const { data } = await api.get<{ data: { docs: MyReview[] } }>('/reviews/my')
  return data.data.docs.map(normalizeMyReview)
}
