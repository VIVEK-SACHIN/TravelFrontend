import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteReview, fetchMyReviews } from '../api/reviews'
import ConfirmDialog from './ConfirmDialog'
import WriteReviewForm from './WriteReviewForm'
import { useAlert } from '../context/AlertContext'
import type { MyReview } from '../types'
import { getApiErrorMessage } from '../utils/apiError'
import { normalizeId } from '../utils/mongoId'
import { tourImageUrl } from '../utils/staticUrl'
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

function MyReviewCard({
  item,
  onUpdated,
}: {
  item: MyReview
  onUpdated: () => void
}) {
  const { tour } = item
  const { showAlert } = useAlert()
  const reviewId = normalizeId(item._id)
  const tourId = normalizeId(tour._id)
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleConfirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteReview(reviewId)
      showAlert('success', 'Your review has been deleted.')
      setConfirmDelete(false)
      onUpdated()
    } catch (err: unknown) {
      showAlert('error', getApiErrorMessage(err) ?? 'Could not delete review.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <article
      className={`booking-card review-item${editing ? ' booking-card--expanded' : ''}`}
    >
      <div className="booking-card__media">
        <div className="booking-card__media-overlay" aria-hidden />
        <img
          className="booking-card__img"
          src={tourImageUrl(tour.imageCover)}
          alt={tour.name}
        />
        <span className="booking-card__badge">{item.rating} ★</span>
      </div>

      <div className="booking-card__body">
        <h3 className="booking-card__title">{tour.name}</h3>
        {!editing && (
          <>
            <ReviewStars rating={item.rating} />
            <p className="booking-card__summary review-item__text">{item.review}</p>
            {item.createdAt && (
              <span className="booking-card__date">
                Reviewed {formatReviewDate(item.createdAt)}
              </span>
            )}
          </>
        )}
      </div>

      <div className="booking-card__aside">
        <div className="booking-card__actions">
          <Link className="btn btn--green btn--small" to={`/tour/${tour.slug}`}>
            View tour
          </Link>
          {!editing && (
            <>
              <button
                type="button"
                className="btn btn--small btn--white booking-card__review-btn"
                onClick={() => setEditing(true)}
                disabled={deleting}
              >
                Edit review
              </button>
              <button
                type="button"
                className="btn btn--small btn--white booking-card__delete-btn"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                Delete review
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete review?"
        message={
          <>
            Delete your review for <strong>{tour.name}</strong>? This action cannot
            be undone.
          </>
        }
        confirmLabel="Delete review"
        cancelLabel="Keep review"
        variant="danger"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setConfirmDelete(false)}
      />

      {editing && (
        <div className="booking-card__review-form">
          <WriteReviewForm
            tourId={tourId}
            tourName={tour.name}
            reviewId={reviewId}
            initialReview={item.review}
            initialRating={item.rating}
            onSuccess={() => {
              setEditing(false)
              onUpdated()
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      )}
    </article>
  )
}

export default function AccountReviews() {
  const [reviews, setReviews] = useState<MyReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadReviews = useCallback(async () => {
    const list = await fetchMyReviews()
    setReviews(list)
  }, [])

  useEffect(() => {
    loadReviews()
      .catch(() => setError('Could not load your reviews. Please try again.'))
      .finally(() => setLoading(false))
  }, [loadReviews])

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
            <MyReviewCard
              key={normalizeId(item._id)}
              item={item}
              onUpdated={loadReviews}
            />
          ))}
        </div>
      )}
    </div>
  )
}
