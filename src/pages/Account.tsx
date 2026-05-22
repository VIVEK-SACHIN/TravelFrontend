import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AccountBookings from '../components/AccountBookings'
import AccountSettings from '../components/AccountSettings'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'

type AccountTab = 'settings' | 'bookings' | 'reviews' | 'billing'

function NavItem({
  text,
  icon,
  active = false,
  onSelect,
}: {
  text: string
  icon: string
  active?: boolean
  onSelect: () => void
}) {
  return (
    <li className={active ? 'side-nav--active' : ''}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onSelect()
        }}
      >
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
        </svg>
        {text}
      </a>
    </li>
  )
}

export default function Account() {
  const { user } = useAuth()
  const { showAlert } = useAlert()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<AccountTab>('settings')

  useEffect(() => {
    if (searchParams.get('alert') === 'booking') {
      setActiveTab('bookings')
      showAlert('success', 'Booking successful! Check your email for confirmation.')
      searchParams.delete('alert')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams, showAlert])

  if (!user) return null

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem
              text="Settings"
              icon="settings"
              active={activeTab === 'settings'}
              onSelect={() => setActiveTab('settings')}
            />
            <NavItem
              text="My bookings"
              icon="briefcase"
              active={activeTab === 'bookings'}
              onSelect={() => setActiveTab('bookings')}
            />
            <NavItem
              text="My reviews"
              icon="star"
              active={activeTab === 'reviews'}
              onSelect={() => setActiveTab('reviews')}
            />
            <NavItem
              text="Billing"
              icon="credit-card"
              active={activeTab === 'billing'}
              onSelect={() => setActiveTab('billing')}
            />
          </ul>

          {user.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <NavItem text="Manage tours" icon="map" onSelect={() => {}} />
                <NavItem text="Manage users" icon="users" onSelect={() => {}} />
                <NavItem text="Manage reviews" icon="star" onSelect={() => {}} />
                <NavItem text="Manage bookings" icon="briefcase" onSelect={() => {}} />
              </ul>
            </div>
          )}
        </nav>

        {activeTab === 'settings' && <AccountSettings />}
        {activeTab === 'bookings' && <AccountBookings />}
      </div>
    </main>
  )
}
