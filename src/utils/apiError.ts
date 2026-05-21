import axios from 'axios'

export function getApiErrorMessage(err: unknown): string | undefined {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message
  }
  return undefined
}
