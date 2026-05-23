import { useTheme } from '../context/ThemeContext'
import {
  COLOR_MODE_LABELS,
  COLOR_MODES,
  type ColorMode,
} from '../theme/colorMode'
import { THEME_IDS, THEMES, type ThemeId } from '../theme/themes'
import '../styles/theme-settings.css'

const COLOR_MODE_SWATCHES: Record<ColorMode, string> = {
  light: 'linear-gradient(135deg, #f7f7f7 50%, #fff 50%)',
  dark: 'linear-gradient(135deg, #1c1f26 50%, #12141a 50%)',
}

export default function ThemeSettings() {
  const { themeId, setThemeId, colorMode, setColorMode } = useTheme()

  return (
    <section className="theme-settings" aria-labelledby="theme-settings-heading">
      <h2 id="theme-settings-heading" className="heading-secondary ma-bt-sm">
        Appearance
      </h2>
      <p className="theme-settings__hint ma-bt-lg">
        Customize how the site looks. Your choices are saved on this device only.
      </p>

      <h3 className="theme-settings__subheading ma-bt-sm">Color mode</h3>
      <div
        className="theme-settings__grid theme-settings__grid--mode"
        role="radiogroup"
        aria-label="Light or dark mode"
      >
        {COLOR_MODES.map((id) => {
          const selected = colorMode === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`theme-settings__option${selected ? ' theme-settings__option--active' : ''}`}
              onClick={() => setColorMode(id)}
            >
              <span
                className="theme-settings__swatch"
                style={{ background: COLOR_MODE_SWATCHES[id] }}
                aria-hidden
              />
              <span className="theme-settings__label">{COLOR_MODE_LABELS[id]}</span>
            </button>
          )
        })}
      </div>

      <h3 className="theme-settings__subheading ma-bt-sm ma-t-lg">Color theme</h3>
      <div className="theme-settings__grid" role="radiogroup" aria-label="Color theme">
        {THEME_IDS.map((id) => {
          const meta = THEMES[id]
          const selected = themeId === id
          return (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`theme-settings__option${selected ? ' theme-settings__option--active' : ''}`}
              onClick={() => setThemeId(id as ThemeId)}
            >
              <span
                className="theme-settings__swatch"
                style={{ background: meta.swatch }}
                aria-hidden
              />
              <span className="theme-settings__label">{meta.label}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
