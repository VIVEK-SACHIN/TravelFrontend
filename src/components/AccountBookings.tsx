import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyBookings } from '../api/bookings'
import { fetchMyReviews } from '../api/reviews'
import WriteReviewForm from './WriteReviewForm'
import type { Booking, MyReview } from '../types'
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

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="reviews__rating booking-card__review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`reviews__star reviews__star--${
            rating >= star ? 'active' : 'inactive'
          }`}
        >
          <use xlinkHref="/img/icons.svg#icon-star" />
        </svg>
      ))}
    </div>
  )
}

function BookingCard({
  booking,
  existingReview,
  onReviewSubmitted,
}: {
  booking: Booking
  existingReview?: MyReview
  onReviewSubmitted: () => void
}) {
  const { tour } = booking
  const tourId = normalizeId(tour._id)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const handleReviewSuccess = () => {
    setShowReviewForm(false)
    onReviewSubmitted()
  }

  return (
    <article className={`booking-card${showReviewForm ? ' booking-card--expanded' : ''}`}>
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

        {existingReview && (
          <div className="booking-card__reviewed">
            <span className="booking-card__reviewed-label">Your review</span>
            <ReviewStars rating={existingReview.rating} />
            <p className="booking-card__reviewed-text">{existingReview.review}</p>
          </div>
        )}
      </div>

      <div className="booking-card__aside">
        <div className="booking-card__price-block">
          <span className="booking-card__price">${booking.price}</span>
          <span className="booking-card__price-label">Total paid</span>
        </div>
        {booking.createdAt && (
          <span className="booking-card__date">
            Booked {formatBookedOn(booking.createdAt)}
          </span>
        )}
        <div className="booking-card__actions">
          <Link className="btn btn--green btn--small" to={`/tour/${tour.slug}`}>
            View tour
          </Link>
          {!existingReview && !showReviewForm && (
            <button
              type="button"
              className="btn btn--small btn--white booking-card__review-btn"
              onClick={() => setShowReviewForm(true)}
            >
              Write a review
            </button>
          )}
        </div>
      </div>

      {showReviewForm && (
        <div className="booking-card__review-form">
          <WriteReviewForm
            tourId={tourId}
            tourName={tour.name}
            onSuccess={handleReviewSuccess}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}
    </article>
  )
}

export default function AccountBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [reviewsByTourId, setReviewsByTourId] = useState<Map<string, MyReview>>(
    new Map(),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const [bookingList, reviewList] = await Promise.all([
      fetchMyBookings(),
      fetchMyReviews(),
    ])
    setBookings(bookingList)
    const map = new Map<string, MyReview>()
    for (const review of reviewList) {
      map.set(normalizeId(review.tour._id), review)
    }
    setReviewsByTourId(map)
  }, [])

  useEffect(() => {
    loadData()
      .catch(() => setError('Could not load your bookings. Please try again.'))
      .finally(() => setLoading(false))
  }, [loadData])

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
          {bookings.map((booking) => {
            const tourId = normalizeId(booking.tour._id)
            return (
              <BookingCard
                key={normalizeId(booking._id)}
                booking={booking}
                existingReview={reviewsByTourId.get(tourId)}
                onReviewSubmitted={loadData}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
