export const COLOR_MODES = ['light', 'dark'] as const

export type ColorMode = (typeof COLOR_MODES)[number]

export const COLOR_MODE_LABELS: Record<ColorMode, string> = {
  light: 'Light',
  dark: 'Dark',
}

const DEFAULT_COLOR_MODE: ColorMode = 'light'

export function resolveColorMode(raw: string | undefined): ColorMode {
  const id = (raw ?? DEFAULT_COLOR_MODE).trim().toLowerCase()
  return (COLOR_MODES as readonly string[]).includes(id) ? (id as ColorMode) : DEFAULT_COLOR_MODE
}
