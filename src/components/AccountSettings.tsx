import {  useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { updatePassword, updateUserData } from '../api/auth'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'
import { userPhotoUrl } from '../utils/staticUrl'
import ThemeSettings from './ThemeSettings'

export default function AccountSettings() {
  const { user, refreshUser } = useAuth()
  const { showAlert } = useAlert()
  const [savingPassword, setSavingPassword] = useState(false)
  const [savingData, setSavingData] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoVersion, setPhotoVersion] = useState(0)
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    }
  }, [])

  if (!user) return null

  const displayPhotoSrc =
    photoPreview ?? userPhotoUrl(user.photo, photoVersion)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
    if (!file) {
      setPhotoPreview(null)
      return
    }
    const url = URL.createObjectURL(file)
    previewUrlRef.current = url
    setPhotoPreview(url)
  }

  const handleDataSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSavingData(true)
    const form = new FormData(e.currentTarget)

    try {
      await updateUserData(form)
      await refreshUser()
      setPhotoVersion((v) => v + 1)
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
      setPhotoPreview(null)
      showAlert('success', 'DATA updated successfully!')
    } catch (err: unknown) {
      showAlert('error', getApiErrorMessage(err) ?? 'Update failed.')
    } finally {
      setSavingData(false)
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
              src={displayPhotoSrc}
              alt="User"
            />
            <input
              className="form__upload"
              type="file"
              accept="image/*"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
            />
            <label htmlFor="photo">Choose new photo</label>
          </div>
          <div className="form__group right">
            <button
              className="btn btn--small btn--green"
              type="submit"
              disabled={savingData}
            >
              {savingData ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="line">&nbsp;</div>

      <div className="user-view__form-container">
        <ThemeSettings />
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
  )
}
