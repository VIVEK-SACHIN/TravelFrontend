import api from './client'
import type { Tour } from '../types'
import { normalizeId } from '../utils/mongoId'

function normalizeTour(raw: Tour): Tour {
  return {
    ...raw,
    _id: normalizeId(raw._id),
  }
}

export async function fetchTours(): Promise<Tour[]> {
  const { data } = await api.get<{ data: { docs: Tour[] } }>('/tours')
  return data.data.docs.map(normalizeTour)
}

export async function fetchTourBySlug(slug: string): Promise<Tour> {
  const { data } = await api.get<{ data: { docs: Tour[] } }>('/tours', {
    params: { slug },
  })
  const match = data.data.docs.find((t) => t.slug === slug)
  if (!match) throw new Error('Tour not found')

  const id = normalizeId(match._id)
  const detail = await api.get<{ data: { doc: Tour } }>(`/tours/${id}`)
  return normalizeTour(detail.data.data.doc)
}
