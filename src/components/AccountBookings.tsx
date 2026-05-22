import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyBookings } from '../api/bookings'
import type { Booking } from '../types'
import { formatStartDate } from '../utils/formatDate'
import { normalizeId } from '../utils/mongoId'
import './account-bookings.css'

function formatBookedOn(value: string | Date | undefined): string {
  if (value == null) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function BookingCard({ booking }: { booking: Booking }) {
  const { tour } = booking

  return (
    <article className="booking-card">
      <div className="booking-card__media">
        <div className="booking-card__media-overlay" aria-hidden />
        <img
          className="booking-card__img"
          src={`/img/tours/${tour.imageCover}`}
          alt={tour.name}
        />
        {booking.paid && <span className="booking-card__badge">Paid</span>}
      </div>

      <div className="booking-card__body">
        <h3 className="booking-card__title">{tour.name}</h3>
        <div className="booking-card__meta">
          <span className="booking-card__meta-item">
            <svg className="booking-card__meta-icon">
              <use xlinkHref="/img/icons.svg#icon-flag" />
            </svg>
            {tour.difficulty} · {tour.duration} days
          </span>
          <span className="booking-card__meta-item">
            <svg className="booking-card__meta-icon">
              <use xlinkHref="/img/icons.svg#icon-map-pin" />
            </svg>
            {tour.startLocation?.description ?? '—'}
          </span>
          <span className="booking-card__meta-item">
            <svg className="booking-card__meta-icon">
              <use xlinkHref="/img/icons.svg#icon-calendar" />
            </svg>
            {formatStartDate(tour.startDates?.[0])}
          </span>
        </div>
        {tour.summary && <p className="booking-card__summary">{tour.summary}</p>}
      </div>

      <div className="booking-card__aside">
        <div>
          <span className="booking-card__price">${booking.price}</span>
          <span className="booking-card__price-label">Total paid</span>
        </div>
        {booking.createdAt && (
          <span className="booking-card__date">
            Booked {formatBookedOn(booking.createdAt)}
          </span>
        )}
        <Link className="btn btn--green btn--small" to={`/tour/${tour.slug}`}>
          View tour
        </Link>
      </div>
    </article>
  )
}

export default function AccountBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyBookings()
      .then(setBookings)
      .catch(() => setError('Could not load your bookings. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="user-view__content account-bookings">
        <div className="account-bookings__loading">
          <p>Loading your bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-view__content account-bookings">
        <div className="account-bookings__error">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-view__content account-bookings">
      <header className="account-bookings__header">
        <h2 className="heading-secondary">My bookings</h2>
        <p className="account-bookings__subtitle">
          {bookings.length === 0
            ? 'You have not booked any tours yet.'
            : `${bookings.length} tour${bookings.length === 1 ? '' : 's'} booked`}
        </p>
      </header>

      {bookings.length === 0 ? (
        <div className="account-bookings__empty">
          <svg className="account-bookings__empty-icon">
            <use xlinkHref="/img/icons.svg#icon-briefcase" />
          </svg>
          <p>Explore our tours and book your next adventure — it will show up here after checkout.</p>
          <Link className="btn btn--green" to="/">
            Browse tours
          </Link>
        </div>
      ) : (
        <div className="account-bookings__list">
          {bookings.map((booking) => (
            <BookingCard key={normalizeId(booking._id)} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}
