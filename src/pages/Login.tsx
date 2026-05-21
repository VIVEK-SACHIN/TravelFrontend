import { FormEvent, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

export default function Login() {
  const { user, login } = useAuth()
  const { showAlert } = useAlert()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email'))
    const password = String(form.get('password'))

    setSubmitting(true)
    try {
      await login(email, password)
      showAlert('success', 'Logged in successfully!')
      window.setTimeout(() => navigate('/'), 1500)
    } catch (err: unknown) {
      showAlert(
        'error',
        getApiErrorMessage(err) ?? 'Login failed. Check your email and password.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="main">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Log into your account</h2>
        <form className="form form--login" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form__group ma-bt-md">
            <label className="form__label" htmlFor="password">
              Password
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
          <div className="form__group">
            <button className="btn btn--green" type="submit" disabled={submitting}>
              Login
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
