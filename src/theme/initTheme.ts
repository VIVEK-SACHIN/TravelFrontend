import { resolveThemeId } from './themes'

const DATA_ATTR = 'data-theme'

/** Apply `VITE_THEME` to `<html>` before paint (call once at startup). */
export function initTheme(): void {
  const themeId = resolveThemeId(import.meta.env.VITE_THEME)
  document.documentElement.setAttribute(DATA_ATTR, themeId)
}
