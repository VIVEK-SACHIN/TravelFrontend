/** Theme ids — user picks in Account → Settings; persisted in localStorage. */
export const THEME_IDS = ['green', 'ocean', 'sunset', 'violet', 'rose'] as const

export type ThemeId = (typeof THEME_IDS)[number]

export interface ThemeMeta {
  id: ThemeId
  label: string
  /** Swatch shown in Account → Settings appearance picker. */
  swatch: string
  /** Footer logo (green theme uses tinted asset; others use white). */
  footerLogo: string
  ctaLogo: string
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  green: {
    id: 'green',
    label: 'Natours Green',
    swatch: 'linear-gradient(135deg, #a8e063, #11998e)',
    footerLogo: '/img/logo-green.png',
    ctaLogo: '/img/logo-white.png',
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean Blue',
    swatch: 'linear-gradient(135deg, #4facfe, #2b5876)',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset Coral',
    swatch: 'linear-gradient(135deg, #ff9a56, #c0392b)',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
  violet: {
    id: 'violet',
    label: 'Violet',
    swatch: 'linear-gradient(135deg, #da77f2, #5f27cd)',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
  rose: {
    id: 'rose',
    label: 'Rose',
    swatch: 'linear-gradient(135deg, #ff9ff3, #b53471)',
    footerLogo: '/img/logo-white.png',
    ctaLogo: '/img/logo-white.png',
  },
}

const DEFAULT_THEME: ThemeId = 'green'

export function resolveThemeId(raw: string | undefined): ThemeId {
  const id = (raw ?? DEFAULT_THEME).trim().toLowerCase()
  return (THEME_IDS as readonly string[]).includes(id) ? (id as ThemeId) : DEFAULT_THEME
}

export function getActiveTheme(themeId?: ThemeId): ThemeMeta {
  const id =
    themeId ??
    (typeof document !== 'undefined'
      ? resolveThemeId(document.documentElement.getAttribute('data-theme') ?? undefined)
      : 'green')
  return THEMES[id]
}
