import { resolveThemeId, type ThemeId } from './themes'

/** Keep in sync with the inline script in `index.html` (avoids flash on load). */
export const THEME_STORAGE_KEY = 'travel-ui-theme'

export function getStoredThemeId(): ThemeId {
  try {
    return resolveThemeId(localStorage.getItem(THEME_STORAGE_KEY) ?? undefined)
  } catch {
    return 'green'
  }
}

export function setStoredThemeId(id: ThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch {
    // private mode / blocked storage
  }
}
