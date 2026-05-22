import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { bookTour, bookTourErrorMessage } from '../api/bookings'
import { fetchTourBySlug } from '../api/tours'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import OverviewBox from '../components/OverviewBox'
import ReviewCard from '../components/ReviewCard'
import TourMap from '../components/TourMap'
import type { Tour } from '../types'
import { formatStartDate } from '../utils/formatDate'
import { normalizeId } from '../utils/mongoId'

export default function TourDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [tour, setTour] = useState<Tour | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetchTourBySlug(slug)
      .then(setTour)
      .catch(() => setError('There is no tour with that name.'))
  }, [slug])

  if (error) {
    return (
      <main className="main">
        <p>{error}</p>
      </main>
    )
  }

  if (!tour) return null

  const paragraphs = tour.description.split('\n')

  const handleBookTour = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/tour/${slug}` } })
      return
    }

    setBooking(true)
    try {
      await bookTour(normalizeId(tour._id))
    } catch (err: unknown) {
      showAlert('error', bookTourErrorMessage(err))
      setBooking(false)
    }
  }

  return (
    <>
      <section className="section-header">
        <div className="header__hero">
          <div className="header__hero-overlay">&nbsp;</div>
          <img
            className="header__hero-img"
            src={`/img/tours/${tour.imageCover}`}
            alt={tour.name}
          />
        </div>

        <div className="heading-box">
          <h1 className="heading-primary">
            <span>{tour.name} tour</span>
          </h1>
          <div className="heading-box__group">
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-clock" />
              </svg>
              <span className="heading-box__text">{tour.duration} days</span>
            </div>
            <div className="heading-box__detail">
              <svg className="heading-box__icon">
                <use xlinkHref="/img/icons.svg#icon-map-pin" />
              </svg>
              <span className="heading-box__text">
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-description">
        <div className="overview-box">
          <div>
            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Quick facts</h2>
              <OverviewBox
                label="Next date"
                text={formatStartDate(tour.startDates?.[0])}
                icon="calendar"
              />
              <OverviewBox label="Difficulty" text={tour.difficulty} icon="trending-up" />
              <OverviewBox
                label="Participants"
                text={`${tour.maxGroupSize} people`}
                icon="user"
              />
              <OverviewBox
                label="Rating"
                text={`${tour.ratingsAverage} / 5`}
                icon="star"
              />
            </div>

            <div className="overview-box__group">
              <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
              {tour.guides.map((guide) => (
                <div className="overview-box__detail" key={normalizeId(guide._id)}>
                  <img
                    className="overview-box__img"
                    src={`/img/users/${guide.photo}`}
                    alt={guide.name}
                  />
                  {guide.role === 'lead-guide' && (
                    <span className="overview-box__label">Lead guide</span>
                  )}
                  {guide.role === 'guide' && (
                    <span className="overview-box__label">Tour guide</span>
                  )}
                  <span className="overview-box__text">{guide.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="description-box">
          <h2 className="heading-secondary ma-bt-lg">About {tour.name} tour</h2>
          {paragraphs.map((p) => (
            <p className="description__text" key={p.slice(0, 24)}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="section-pictures">
        {tour.images.map((img, i) => (
          <div className="picture-box" key={img}>
            <img
              className={`picture-box__img picture-box__img--${i + 1}`}
              src={`/img/tours/${img}`}
              alt={`${tour.name} ${i + 1}`}
            />
          </div>
        ))}
      </section>

      <section className="section-map">
        <TourMap locations={tour.locations} />
      </section>

      <section className="section-reviews">
        <div className="reviews">
          {tour.reviews?.map((review) => (
            <ReviewCard key={normalizeId(review._id)} review={review} />
          ))}
        </div>
      </section>

      <section className="section-cta">
        <div className="cta">
          <div className="cta__img cta__img--logo">
            <img src="/img/logo-white.png" alt="Natours logo" />
          </div>
          {tour.images[1] && (
            <img
              className="cta__img cta__img--1"
              src={`/img/tours/${tour.images[1]}`}
              alt="Tour"
            />
          )}
          {tour.images[2] && (
            <img
              className="cta__img cta__img--2"
              src={`/img/tours/${tour.images[2]}`}
              alt="Tour"
            />
          )}
          <div className="cta__content">
            <h2 className="heading-secondary">What are you waiting for?</h2>
            <p className="cta__text">
              {tour.duration} days. 1 adventure. Infinite memories. Make it yours
              today!
            </p>
            <button
              type="button"
              className="btn btn--green span-all-rows"
              id="book-tour"
              disabled={booking}
              onClick={handleBookTour}
            >
              {booking ? 'Processing...' : 'Book tour now!'}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
