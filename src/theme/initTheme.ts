import { applyThemeToDocument } from './applyTheme'
import { getStoredThemeId } from './persistence'

/** Sync `<html data-theme>` from localStorage before React mounts. */
export function initTheme(): void {
  applyThemeToDocument(getStoredThemeId())
}
