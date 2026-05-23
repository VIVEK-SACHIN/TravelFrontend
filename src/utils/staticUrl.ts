/** Static assets served by the Rust API (`public/img/...`), like Express `public/`. */
const serverOrigin = (import.meta.env.VITE_SERVER_URL ?? '').replace(/\/$/, '')

function staticAssetUrl(path: string): string {
  return serverOrigin ? `${serverOrigin}${path}` : path
}

export function userPhotoUrl(filename: string, cacheBust?: number): string {
  const base = staticAssetUrl(`/img/users/${filename}`)
  return cacheBust != null ? `${base}?v=${cacheBust}` : base
}

export function tourImageUrl(filename: string): string {
  return staticAssetUrl(`/img/tours/${filename}`)
}
