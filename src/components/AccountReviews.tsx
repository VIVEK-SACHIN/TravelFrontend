import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyReviews } from '../api/reviews'
import type { MyReview } from '../types'
import { normalizeId } from '../utils/mongoId'
import './account-bookings.css'

function formatReviewDate(value: string | Date | undefined): string {
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
    <div className="reviews__rating review-item__stars">
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

function MyReviewCard({ item }: { item: MyReview }) {
  const { tour } = item

  return (
    <article className="booking-card review-item">
      <div className="booking-card__media">
        <div className="booking-card__media-overlay" aria-hidden />
        <img
          className="booking-card__img"
          src={`/img/tours/${tour.imageCover}`}
          alt={tour.name}
        />
        <span className="booking-card__badge">{item.rating} ★</span>
      </div>

      <div className="booking-card__body">
        <h3 className="booking-card__title">{tour.name}</h3>
        <ReviewStars rating={item.rating} />
        <p className="booking-card__summary review-item__text">{item.review}</p>
        {item.createdAt && (
          <span className="booking-card__date">
            Reviewed {formatReviewDate(item.createdAt)}
          </span>
        )}
      </div>

      <div className="booking-card__aside">
        <Link className="btn btn--green btn--small" to={`/tour/${tour.slug}`}>
          View tour
        </Link>
      </div>
    </article>
  )
}

export default function AccountReviews() {
  const [reviews, setReviews] = useState<MyReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyReviews()
      .then(setReviews)
      .catch(() => setError('Could not load your reviews. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="user-view__content account-bookings">
        <div className="account-bookings__loading">
          <p>Loading your reviews...</p>
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
        <h2 className="heading-secondary">My reviews</h2>
        <p className="account-bookings__subtitle">
          {reviews.length === 0
            ? 'No reviews yet'
            : `${reviews.length} review${reviews.length === 1 ? '' : 's'}`}
        </p>
      </header>

      {reviews.length === 0 ? (
        <div className="account-bookings__empty">
          <svg className="account-bookings__empty-icon">
            <use xlinkHref="/img/icons.svg#icon-star" />
          </svg>
          <h3 className="heading-tertirary ma-bt-md">No data available</h3>
          <p>
            You have not reviewed any tours yet. Visit a tour you have taken and leave
            your rating and feedback — it will appear here.
          </p>
          <Link className="btn btn--green" to="/">
            Find a tour to review
          </Link>
        </div>
      ) : (
        <div className="account-bookings__list">
          {reviews.map((item) => (
            <MyReviewCard key={normalizeId(item._id)} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
