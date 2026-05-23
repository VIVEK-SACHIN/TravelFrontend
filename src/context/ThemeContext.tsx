import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { applyThemeToDocument } from '../theme/applyTheme'
import { getStoredThemeId, setStoredThemeId } from '../theme/persistence'
import { resolveThemeId, THEMES, type ThemeId, type ThemeMeta } from '../theme/themes'

interface ThemeContextValue {
  themeId: ThemeId
  theme: ThemeMeta
  setThemeId: (id: ThemeId) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialThemeId(): ThemeId {
  if (typeof document !== 'undefined') {
    const fromDom = document.documentElement.getAttribute('data-theme')
    if (fromDom) return resolveThemeId(fromDom)
  }
  return getStoredThemeId()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(readInitialThemeId)

  const setThemeId = useCallback((id: ThemeId) => {
    const resolved = resolveThemeId(id)
    setStoredThemeId(resolved)
    applyThemeToDocument(resolved)
    setThemeIdState(resolved)
  }, [])

  const value = useMemo(
    () => ({
      themeId,
      theme: THEMES[themeId],
      setThemeId,
    }),
    [themeId, setThemeId],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
