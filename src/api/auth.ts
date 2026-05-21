import api from './client'
import type { User } from '../types'
import { normalizeId } from '../utils/mongoId'

export async function login(email: string, password: string) {
  const { data } = await api.post('/users/login', { email, password })
  return data
}

export async function logout() {
  const { data } = await api.get('/users/logout')
  return data
}

export async function signup(body: Record<string, string>) {
  const { data } = await api.post('/users/signup', body)
  return data
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const { data } = await api.get<{ data: { doc: User } }>('/users/me')
    const user = data.data.doc
    return { ...user, _id: normalizeId(user._id) }
  } catch {
    return null
  }
}

export async function updateUserData(form: FormData) {
  const { data } = await api.patch('/users/updateUserData', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updatePassword(payload: {
  passwordCurrent: string
  password: string
  passwordConfirm: string
}) {
  const { data } = await api.patch('/users/updateMyPassword', payload)
  return data
}
