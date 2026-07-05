'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '../lib/api'
import { User, AuthResponse } from '../types'

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem('user')

  try {
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function storeAuthData(data: AuthResponse['data']) {
  document.cookie = `accessToken=${data.accessToken}; path=/; max-age=900`
  localStorage.setItem('accessToken', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  localStorage.setItem('user', JSON.stringify(data.user))
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function login(email: string, password: string) {
    setLoading(true)

    try {
      const res = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      storeAuthData(res.data)
      setUser(res.data.user)

      return res.data.user
    } finally {
      setLoading(false)
    }
  }

  async function register(
    email: string,
    password: string,
    role: 'CONSUMER' | 'BRAND'
  ) {
    setLoading(true)

    try {
      await api.post('/auth/register', {
        email,
        password,
        role,
      })

      const res = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })

      storeAuthData(res.data)
      setUser(res.data.user)

      if (role === 'BRAND') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }

      return res.data.user
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

  return {
    user,
    loading,
    login,
    register,
    logout,
  }
}