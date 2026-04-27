'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../lib/api'
import { User, AuthResponse } from '../types'

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  return stored ? JSON.parse(stored) : null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login(email: string, password: string) {
    setLoading(true)
    try {
      const res = await api.post<AuthResponse>('/auth/login', { email, password })
      document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=900`
      localStorage.setItem('accessToken', res.data.accessToken)
      localStorage.setItem('refreshToken', res.data.refreshToken)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      setUser(res.data.user)
      return res.data.user
    } finally {
      setLoading(false)
    }
  }

  async function register(email: string, password: string, role: 'CONSUMER' | 'BRAND') {
    setLoading(true)
    try {
      // Créer le compte
      await api.post('/auth/register', { email, password, role })

      // Si c'est une marque, connecter et créer la fiche automatiquement
      if (role === 'BRAND') {
        const res = await api.post<AuthResponse>('/auth/login', { email, password })
        document.cookie = `accessToken=${res.data.accessToken}; path=/; max-age=900`
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        setUser(res.data.user)

        // Créer la fiche marque avec le nom extrait de l'email
        const brandName = email.split('@')[0]
        await api.post('/brands', {
          name: brandName,
          description: '',
          story: ''
        })

        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken })
    }
    document.cookie = 'accessToken=; path=/; max-age=0'
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  return { user, loading, login, register, logout }
}