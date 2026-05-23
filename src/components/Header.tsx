import { Link, useNavigate } from 'react-router-dom'
import { useAlert } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'
import { userPhotoUrl } from '../utils/staticUrl'

export default function Header() {
  const { user, logout } = useAuth()
  const { showAlert } = useAlert()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      showAlert('success', 'Logged out successfully!')
      navigate('/')
    } catch {
      showAlert('error', 'Error logging out! Try again.')
    }
  }

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          All tours
        </Link>
      </nav>
      <div className="header__logo">
        <img src="/img/logo-white.png" alt="TravelAndTour logo" />
      </div>
      <nav className="nav nav--user">
        {user ? (
          <>
            <a
              className="nav__el nav__el--logout"
              href="#logout"
              onClick={(e) => {
                e.preventDefault()
                handleLogout()
              }}
            >
              Log out
            </a>
            <Link className="nav__el" to="/me">
              <img
                className="nav__user-img"
                src={userPhotoUrl(user.photo)}
                alt={`Photo of ${user.name}`}
              />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link className="nav__el" to="/login">
              Log in
            </Link>
            <Link className="nav__el nav__el--cta" to="/signup">
              Sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
