import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchTours } from '../api/tours'
import type { Tour } from '../types'
import { formatStartDate } from '../utils/formatDate'
import { normalizeId } from '../utils/mongoId'
import { tourImageUrl } from '../utils/staticUrl'

export default function Overview() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTours()
      .then(setTours)
      .catch(() =>
        setError(
          `Could not load tours. Is the API running at ${import.meta.env.VITE_API_URL}?`,
        ),
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <main className="main">
        <p className="main__message">Loading tours...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="main">
        <p className="main__message main__message--error">{error}</p>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="card-container">
        {tours.map((tour) => (
          <div className="card" key={normalizeId(tour._id)}>
            <div className="card__header">
              <div className="card__picture">
                <div className="card__picture-overlay">&nbsp;</div>
                <img
                  className="card__picture-img"
                  src={tourImageUrl(tour.imageCover)}
                  alt={tour.name}
                />
              </div>
              <h3 className="heading-tertirary">
                <span>{tour.name}</span>
              </h3>
            </div>

            <div className="card__details">
              <h4 className="card__sub-heading">
                {tour.difficulty} {tour.duration}-day tour
              </h4>
              <p className="card__text">{tour.summary}</p>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-map-pin" />
                </svg>
                <span>{tour.startLocation.description}</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-calendar" />
                </svg>
                <span>{formatStartDate(tour.startDates?.[0])}</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-flag" />
                </svg>
                <span>{tour.locations?.length ?? 0} stops</span>
              </div>
              <div className="card__data">
                <svg className="card__icon">
                  <use xlinkHref="/img/icons.svg#icon-user" />
                </svg>
                <span>{tour.maxGroupSize} people</span>
              </div>
            </div>

            <div className="card__footer">
              <p>
                <span className="card__footer-value">${tour.price}</span>{' '}
                <span className="card__footer-text">per person</span>
              </p>
              <p className="card__ratings">
                <span className="card__footer-value">{tour.ratingsAverage}</span>{' '}
                <span className="card__footer-text">
                  rating ({tour.ratingsQuantity})
                </span>
              </p>
              <Link className="btn btn--green btn--small" to={`/tour/${tour.slug}`}>
                Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
