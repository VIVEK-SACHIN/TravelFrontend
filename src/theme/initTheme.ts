import { applyColorModeToDocument, applyThemeToDocument } from './applyTheme'
import { getStoredColorMode, getStoredThemeId } from './persistence'

/** Sync appearance attributes from localStorage before React mounts. */
export function initTheme(): void {
  applyThemeToDocument(getStoredThemeId())
  applyColorModeToDocument(getStoredColorMode())
}
