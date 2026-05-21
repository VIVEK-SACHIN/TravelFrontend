import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AlertProvider } from './context/AlertContext'
import { AuthProvider } from './context/AuthContext'
import Account from './pages/Account'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Signup from './pages/Signup'
import TourDetail from './pages/TourDetail'

export default function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="tour/:slug" element={<TourDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route
                path="me"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  )
}
