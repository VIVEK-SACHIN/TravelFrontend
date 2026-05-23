import {  useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/apiError'

export default function Signup() {
  const { user, refreshUser } = useAuth()
  const { showAlert } = useAlert()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    setSubmitting(true)
    try {
      await signup({
        name: String(form.get('name')),
        email: String(form.get('email')),
        password: String(form.get('password')),
        passwordConfirm: String(form.get('passwordConfirm')),
        role: String(form.get('role')),
      })
      await refreshUser()
      showAlert('success', 'Signup successful! Redirecting...')
      window.setTimeout(() => navigate('/'), 1500)
    } catch (err: unknown) {
      showAlert('error', getApiErrorMessage(err) ?? 'Signup failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="main main--auth">
      <div className="login-form">
        <h2 className="heading-secondary ma-bt-lg">Create a new account</h2>
        <form className="form form--signup" onSubmit={handleSubmit}>
          <div className="form__group">
            <label className="form__label" htmlFor="signup-name">
              Full Name
            </label>
            <input
              id="signup-name"
              name="name"
              className="form__input"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="signup-email">
              Email address
            </label>
            <input
              id="signup-email"
              name="email"
              className="form__input"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="signup-passwordConfirm">
              Confirm Password
            </label>
            <input
              id="signup-passwordConfirm"
              name="passwordConfirm"
              className="form__input"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <div className="form__group">
            <label className="form__label" htmlFor="signup-role">
              Role
            </label>
            <select id="signup-role" name="role" className="form__input" defaultValue="user">
              <option value="user">User</option>
              <option value="guide">Guide</option>
              <option value="lead-guide">Lead Guide</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form__group">
            <button className="btn btn--green" type="submit" disabled={submitting}>
              Sign Up
            </button>
          </div>
        </form>
        <p className="auth-page__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  )
}
