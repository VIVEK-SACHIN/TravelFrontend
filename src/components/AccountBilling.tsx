import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMyBilling } from '../api/billing'
import type { BillingRecord } from '../types'
import { normalizeId } from '../utils/mongoId'
import './account-bookings.css'

function formatPaidOn(value: string | Date | undefined): string {
  if (value == null) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

function statusLabel(record: BillingRecord): string {
  if (record.billing?.paymentStatus) {
    return record.billing.paymentStatus.replace(/_/g, ' ')
  }
  return record.paid ? 'paid' : 'pending'
}

function BillingRow({ record }: { record: BillingRecord }) {
  const { tour, billing } = record
  const amount = billing?.amountTotal ?? record.price
  const currency = billing?.currency ?? 'usd'
  const reference = billing?.stripeSessionId ?? normalizeId(record._id)

  return (
    <article className="billing-card">
      <div className="billing-card__main">
        <div>
          <h3 className="billing-card__title">{tour.name}</h3>
          <p className="billing-card__date">Paid on {formatPaidOn(record.createdAt)}</p>
        </div>
        <div className="billing-card__amount">
          <span className="billing-card__price">{formatAmount(amount, currency)}</span>
          <span
            className={`billing-card__status billing-card__status--${
              record.paid || billing?.paymentStatus === 'paid' ? 'paid' : 'pending'
            }`}
          >
            {statusLabel(record)}
          </span>
        </div>
      </div>
      <dl className="billing-card__details">
        <div>
          <dt>Reference</dt>
          <dd title={reference}>{reference.slice(0, 24)}…</dd>
        </div>
        {billing?.stripePaymentIntent && (
          <div>
            <dt>Payment</dt>
            <dd title={billing.stripePaymentIntent}>
              {billing.stripePaymentIntent.slice(0, 20)}…
            </dd>
          </div>
        )}
        <div>
          <dt>Method</dt>
          <dd>Card (Stripe)</dd>
        </div>
      </dl>
    </article>
  )
}

export default function AccountBilling() {
  const [records, setRecords] = useState<BillingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMyBilling()
      .then(setRecords)
      .catch(() => setError('Could not load billing history. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="user-view__content account-bookings">
        <div className="account-bookings__loading">
          <p>Loading billing history...</p>
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
        <h2 className="heading-secondary">Billing</h2>
        <p className="account-bookings__subtitle">
          {records.length === 0
            ? 'No payments yet.'
            : `${records.length} payment${records.length === 1 ? '' : 's'}`}
        </p>
      </header>

      {records.length === 0 ? (
        <div className="account-bookings__empty">
          <svg className="account-bookings__empty-icon">
            <use xlinkHref="/TravelFrontend/img/icons.svg#icon-credit-card" />
          </svg>
          <p>When you book a tour through Stripe checkout, your receipt will appear here.</p>
          <Link className="btn btn--green" to="/">
            Browse tours
          </Link>
        </div>
      ) : (
        <div className="billing-list">
          {records.map((record) => (
            <BillingRow key={normalizeId(record._id)} record={record} />
          ))}
        </div>
      )}
    </div>
  )
}
