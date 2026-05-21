import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type AlertType = 'success' | 'error'

interface AlertContextValue {
  showAlert: (type: AlertType, message: string) => void
}

const AlertContext = createContext<AlertContextValue | null>(null)

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(
    null,
  )

  const showAlert = useCallback((type: AlertType, message: string) => {
    setAlert({ type, message })
  }, [])

  useEffect(() => {
    if (!alert) return
    const timer = window.setTimeout(() => setAlert(null), 5000)
    return () => window.clearTimeout(timer)
  }, [alert])

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {alert && (
        <div className={`alert alert--${alert.type}`}>{alert.message}</div>
      )}
      {children}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}
