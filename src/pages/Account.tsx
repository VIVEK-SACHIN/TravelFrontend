import { FormEvent, useState } from 'react'
import { updatePassword, updateUserData } from '../api/auth'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

function NavItem({
  href,
  text,
  icon,
  active = false,
}: {
  href: string
  text: string
  icon: string
  active?: boolean
}) {
  return (
    <li className={active ? 'side-nav--active' : ''}>
      <a href={href}>
        <svg>
          <use xlinkHref={`/img/icons.svg#icon-${icon}`} />
        </svg>
        {text}
      </a>
    </li>
  )
}

export default function Account() {
  const { user, refreshUser } = useAuth()
  const { showAlert } = useAlert()
  const [savingPassword, setSavingPassword] = useState(false)

  if (!user) return null

  const handleDataSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const photo = (e.currentTarget.elements.namedItem('photo') as HTMLInputElement)
      .files?.[0]
    if (photo) form.set('photo', photo)

    try {
      await updateUserData(form)
      await refreshUser()
      showAlert('success', 'DATA updated successfully!')
    } catch (err: unknown) {
      showAlert('error', getApiErrorMessage(err) ?? 'Update failed.')
    }
  }

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingPassword(true)
    const form = new FormData(e.currentTarget)

    try {
      await updatePassword({
        passwordCurrent: String(form.get('passwordCurrent')),
        password: String(form.get('password')),
        passwordConfirm: String(form.get('passwordConfirm')),
      })
      showAlert('success', 'PASSWORD updated successfully!')
      e.currentTarget.reset()
    } catch (err: unknown) {
      showAlert('error', getApiErrorMessage(err) ?? 'Password update failed.')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <main className="main">
      <div className="user-view">
        <nav className="user-view__menu">
          <ul className="side-nav">
            <NavItem href="#" text="Settings" icon="settings" active />
            <NavItem href="#" text="My bookings" icon="briefcase" />
            <NavItem href="#" text="My reviews" icon="star" />
            <NavItem href="#" text="Billing" icon="credit-card" />
          </ul>

          {user.role === 'admin' && (
            <div className="admin-nav">
              <h5 className="admin-nav__heading">Admin</h5>
              <ul className="side-nav">
                <NavItem href="#" text="Manage tours" icon="map" />
                <NavItem href="#" text="Manage users" icon="users" />
                <NavItem href="#" text="Manage reviews" icon="star" />
                <NavItem href="#" text="Manage bookings" icon="briefcase" />
              </ul>
            </div>
          )}
        </nav>

        <div className="user-view__content">
          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Your account settings</h2>
            <form className="form form-user-data" onSubmit={handleDataSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="form__input"
                  type="text"
                  defaultValue={user.name}
                  required
                />
              </div>
              <div className="form__group ma-bt-md">
                <label className="form__label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  className="form__input"
                  type="email"
                  defaultValue={user.email}
                  required
                />
              </div>
              <div className="form__group form__photo-upload">
                <img
                  className="form__user-photo"
                  src={`/img/users/${user.photo}`}
                  alt="User"
                />
                <input
                  className="form__upload"
                  type="file"
                  accept="image/*"
                  id="photo"
                  name="photo"
                />
                <label htmlFor="photo">Choose new photo</label>
              </div>
              <div className="form__group right">
                <button className="btn btn--small btn--green" type="submit">
                  Save settings
                </button>
              </div>
            </form>
          </div>

          <div className="line">&nbsp;</div>

          <div className="user-view__form-container">
            <h2 className="heading-secondary ma-bt-md">Password change</h2>
            <form className="form form-user-password" onSubmit={handlePasswordSubmit}>
              <div className="form__group">
                <label className="form__label" htmlFor="password-current">
                  Current password
                </label>
                <input
                  id="password-current"
                  name="passwordCurrent"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group">
                <label className="form__label" htmlFor="password">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group ma-bt-lg">
                <label className="form__label" htmlFor="password-confirm">
                  Confirm password
                </label>
                <input
                  id="password-confirm"
                  name="passwordConfirm"
                  className="form__input"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              <div className="form__group right">
                <button
                  className="btn btn--small btn--green btn--save-password"
                  type="submit"
                  disabled={savingPassword}
                >
                  {savingPassword ? 'Updating...' : 'Save password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
