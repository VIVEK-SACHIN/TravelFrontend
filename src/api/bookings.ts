import { loadStripe } from '@stripe/stripe-js'
import api from './client'
import type { Booking } from '../types'
import { normalizeId } from '../utils/mongoId'
import { getApiErrorMessage } from '../utils/apiError'

function normalizeBooking(raw: Booking): Booking {
  return {
    ...raw,
    _id: normalizeId(raw._id),
    tour: {
      ...raw.tour,
      _id: normalizeId(raw.tour._id),
    },
  }
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const { data } = await api.get<{ data: { docs: Booking[] } }>('/bookings/my')
  return data.data.docs.map(normalizeBooking)
}

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
)

export async function bookTour(tourId: string): Promise<void> {
  const stripe = await stripePromise
  if (!stripe) {
    throw new Error(
      'Stripe is not configured. Set VITE_STRIPE_PUBLISHABLE_KEY in .env',
    )
  }

  const { data } = await api.get<{
    status: string
    session: { id: string }
  }>(`/bookings/checkout-session/${tourId}`)

  const { error } = await stripe.redirectToCheckout({
    sessionId: data.session.id,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export function bookTourErrorMessage(err: unknown): string {
  return getApiErrorMessage(err) ?? (err instanceof Error ? err.message : 'Booking failed.')
}
