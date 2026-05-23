/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  /** UI palette: `green` (default) | `ocean` | `sunset` | `violet` | `rose` */
  readonly VITE_THEME?: string
  readonly VITE_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
