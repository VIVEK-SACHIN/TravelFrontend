import type { ColorMode } from './colorMode'
import type { ThemeId } from './themes'

export function applyThemeToDocument(themeId: ThemeId): void {
  document.documentElement.setAttribute('data-theme', themeId)
}

export function applyColorModeToDocument(colorMode: ColorMode): void {
  document.documentElement.setAttribute('data-color-mode', colorMode)
}

export function getThemeIdFromDocument(): ThemeId | null {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr ? (attr as ThemeId) : null
}
