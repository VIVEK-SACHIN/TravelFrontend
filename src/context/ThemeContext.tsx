import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { applyColorModeToDocument, applyThemeToDocument } from '../theme/applyTheme'
import { resolveColorMode, type ColorMode } from '../theme/colorMode'
import { getStoredColorMode, getStoredThemeId, setStoredColorMode, setStoredThemeId } from '../theme/persistence'
import { resolveThemeId, THEMES, type ThemeId, type ThemeMeta } from '../theme/themes'

interface ThemeContextValue {
  themeId: ThemeId
  theme: ThemeMeta
  setThemeId: (id: ThemeId) => void
  colorMode: ColorMode
  setColorMode: (mode: ColorMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialThemeId(): ThemeId {
  if (typeof document !== 'undefined') {
    const fromDom = document.documentElement.getAttribute('data-theme')
    if (fromDom) return resolveThemeId(fromDom)
  }
  return getStoredThemeId()
}

function readInitialColorMode(): ColorMode {
  if (typeof document !== 'undefined') {
    const fromDom = document.documentElement.getAttribute('data-color-mode')
    if (fromDom) return resolveColorMode(fromDom)
  }
  return getStoredColorMode()
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>(readInitialThemeId)
  const [colorMode, setColorModeState] = useState<ColorMode>(readInitialColorMode)

  const setThemeId = useCallback((id: ThemeId) => {
    const resolved = resolveThemeId(id)
    setStoredThemeId(resolved)
    applyThemeToDocument(resolved)
    setThemeIdState(resolved)
  }, [])

  const setColorMode = useCallback((mode: ColorMode) => {
    const resolved = resolveColorMode(mode)
    setStoredColorMode(resolved)
    applyColorModeToDocument(resolved)
    setColorModeState(resolved)
  }, [])

  const value = useMemo(
    () => ({
      themeId,
      theme: THEMES[themeId],
      setThemeId,
      colorMode,
      setColorMode,
    }),
    [themeId, colorMode, setThemeId, setColorMode],
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
