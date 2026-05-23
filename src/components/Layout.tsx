import { Outlet, useLocation } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

const AUTH_PATHS = new Set(['/login', '/signup'])

export default function Layout() {
  const { pathname } = useLocation()
  const isAuthPage = AUTH_PATHS.has(pathname)

  return (
    <div className="app-shell">
      <Header />
      <div className="app-shell__scroll">
        <Outlet />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  )
}
