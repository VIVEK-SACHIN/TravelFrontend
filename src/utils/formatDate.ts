export function formatStartDate(value: string | Date | undefined | null): string {
  if (value == null) return 'TBA'

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return 'TBA'

  return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}
