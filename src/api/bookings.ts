import { loadStripe } from '@stripe/stripe-js'
import api from './client'
import { getApiErrorMessage } from '../utils/apiError'

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
