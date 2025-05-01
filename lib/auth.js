'use client'

export function isAuthenticated() {
  if (typeof window === 'undefined') return false
  const token = localStorage.getItem('token') // ou "access_token" si tu utilises ce nom
  return !!token
}
