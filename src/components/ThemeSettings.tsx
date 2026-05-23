import { useTheme } from '../context/ThemeContext'
import { THEME_IDS, THEMES } from '../theme/themes'
import '../styles/theme-settings.css'

export default function ThemeSettings() {
  const { themeId, setThemeId } = useTheme()

  return (
    <section className="theme-settings" aria-labelledby="theme-settings-heading">
      <h2 id="theme-settings-heading" className="heading-secondary ma-bt-sm">
        Appearance
      </h2>
      <p className="theme-settings__hint ma-bt-md">
        Choose a color theme for the site. Your choice is saved on this device only.
      </p>
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
              onClick={() => setThemeId(id)}
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
