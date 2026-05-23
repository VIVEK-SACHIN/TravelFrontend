import { useState } from 'react'
import type { FormEvent } from 'react'
import { createReview, updateReview } from '../api/reviews'
import { useAlert } from '../context/AlertContext'
import { getApiErrorMessage } from '../utils/apiError'

type WriteReviewFormProps = {
  tourName: string
  tourId: string
  onSuccess: () => void
  onCancel: () => void
  /** When set, form updates an existing review instead of creating one. */
  reviewId?: string
  initialReview?: string
  initialRating?: number
}

function StarPicker({
  rating,
  onChange,
}: {
  rating: number
  onChange: (value: number) => void
}) {
  const [hover, setHover] = useState(0)
  const active = hover || rating

  return (
    <div
      className="write-review__stars"
      role="radiogroup"
      aria-label="Rating"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`write-review__star-btn ${
            star <= active ? 'write-review__star-btn--active' : ''
          }`}
          aria-label={`${star} star${star === 1 ? '' : 's'}`}
          aria-pressed={rating === star}
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(star)}
        >
          <svg className="reviews__star reviews__star--active">
            <use xlinkHref="/TravelFrontend/img/icons.svg#icon-star" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function WriteReviewForm({
  tourName,
  tourId,
  onSuccess,
  onCancel,
  reviewId,
  initialReview = '',
  initialRating = 5,
}: WriteReviewFormProps) {
  const isEdit = Boolean(reviewId)
  const { showAlert } = useAlert()
  const [rating, setRating] = useState(initialRating)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const review = String(form.get('review') ?? '').trim()

    if (review.length < 10) {
      showAlert('error', 'Please write at least 10 characters for your review.')
      return
    }
    if (rating < 1 || rating > 5) {
      showAlert('error', 'Please select a rating between 1 and 5.')
      return
    }

    setSubmitting(true)
    try {
      if (isEdit && reviewId) {
        await updateReview(reviewId, { review, rating })
        showAlert('success', 'Your review has been updated.')
      } else {
        await createReview(tourId, { review, rating })
        showAlert('success', 'Thank you! Your review has been submitted.')
      }
      onSuccess()
    } catch (err: unknown) {
      showAlert(
        'error',
        getApiErrorMessage(err) ??
          (isEdit ? 'Could not update review.' : 'Could not submit review.'),
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="write-review" onSubmit={handleSubmit}>
      <h4 className="write-review__heading">
        {isEdit ? 'Edit review for' : 'Review'} <span>{tourName}</span>
      </h4>

      <div className="write-review__field">
        <label className="form__label">Your rating</label>
        <StarPicker rating={rating} onChange={setRating} />
        <input type="hidden" name="rating" value={rating} />
      </div>

      <div className="form__group">
        <label className="form__label" htmlFor={`review-${tourId}-${reviewId ?? 'new'}`}>
          Your review
        </label>
        <textarea
          id={`review-${tourId}-${reviewId ?? 'new'}`}
          name="review"
          className="form__input write-review__textarea"
          rows={4}
          placeholder="Share your experience on this tour..."
          defaultValue={initialReview}
          required
          minLength={10}
        />
      </div>

      <div className="write-review__actions">
        <button
          type="button"
          className="btn btn--small btn--white"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn--small btn--green"
          disabled={submitting}
        >
          {submitting
            ? isEdit
              ? 'Saving...'
              : 'Submitting...'
            : isEdit
              ? 'Save changes'
              : 'Submit review'}
        </button>
      </div>
    </form>
  )
}
