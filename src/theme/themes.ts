/** Theme ids — set via `VITE_THEME` in `.env` (default: `green`). */
export const THEME_IDS = ['green', 'ocean', 'sunset', 'violet', 'rose'] as const

export type ThemeId = (typeof THEME_IDS)[number]

export interface ThemeMeta {
  id: ThemeId
  label: string
  /** Footer logo (green theme uses tinted asset; others use white). */
  footerLogo: string
  ctaLogo: string
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  green: {
    id: 'green',
    label: 'Natours Green',
    footerLogo: '/img/logo-green.png',
    ctaLogo: '/img/logo-white.png',
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean Blue',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset Coral',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
}

const DEFAULT_THEME: ThemeId = 'green'

export function resolveThemeId(raw: string | undefined): ThemeId {
  const id = (raw ?? DEFAULT_THEME).trim().toLowerCase()
  return (THEME_IDS as readonly string[]).includes(id) ? (id as ThemeId) : DEFAULT_THEME
}

export function getActiveTheme(): ThemeMeta {
  return THEMES[resolveThemeId(import.meta.env.VITE_THEME)]
}
