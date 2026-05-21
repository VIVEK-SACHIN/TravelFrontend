/** MongoDB Extended JSON / Rust `ObjectId` over JSON — not a plain string. */
export function normalizeId(id: unknown): string {
  if (typeof id === 'string' && id.length > 0) return id

  if (id && typeof id === 'object') {
    const oid = (id as { $oid?: string }).$oid
    if (typeof oid === 'string') return oid
  }

  throw new Error('Invalid MongoDB id in API response')
}
