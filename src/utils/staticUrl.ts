/** User avatars are stored and served by the Rust API (`/img/users/...`), like Express `public/`. */
const serverOrigin = (import.meta.env.VITE_SERVER_URL ?? '').replace(/\/$/, '')

export function userPhotoUrl(filename: string, cacheBust?: number): string {
  const path = `/img/users/${filename}`
  const base = serverOrigin ? `${serverOrigin}${path}` : path
  return cacheBust != null ? `${base}?v=${cacheBust}` : base
}
