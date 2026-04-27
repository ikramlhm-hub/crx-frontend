'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import Header from '../../components/Header'

type Mode = 'login' | 'register'
type Role = 'CONSUMER' | 'BRAND'

function AuthContent() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('CONSUMER')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login, register, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || null

  function switchMode(newMode: Mode) {
    setMode(newMode)
    setError('')
    setSuccess('')
    setEmail('')
    setPassword('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (mode === 'login') {
        const user = await login(email, password)
        if (redirect) {
          router.push(redirect)
        } else if (user.role === 'BRAND') {
          router.push('/dashboard')
        } else if (user.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      } else {
        await register(email, password, role)
        if (role !== 'BRAND') {
          setSuccess('Compte créé ! Tu peux maintenant te connecter.')
          switchMode('login')
        }
      }
    } catch {
      setError(mode === 'login' ? 'Compte introuvable ou mot de passe incorrect' : 'Erreur lors de la création du compte')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="pt-24 pb-20 flex flex-col items-center px-4">
        <div className="flex items-center gap-4 text-sm font-semibold tracking-[0.25em]">
          <button onClick={() => switchMode('login')} className={mode === 'login' ? 'text-black' : 'text-gray-400 hover:text-black transition'}>
            CONNEXION
          </button>
          <span className="text-gray-300">|</span>
          <button onClick={() => switchMode('register')} className={mode === 'register' ? 'text-black' : 'text-gray-400 hover:text-black transition'}>
            INSCRIPTION
          </button>
        </div>

        <div className="mt-2 flex gap-4">
          <div className={`h-0.5 w-24 transition-all ${mode === 'login' ? 'bg-black' : 'bg-transparent'}`} />
          <div className={`h-0.5 w-24 transition-all ${mode === 'register' ? 'bg-black' : 'bg-transparent'}`} />
        </div>

        {error && <div className="mt-6 bg-red-500 text-white px-4 py-2 rounded-xl text-sm">{error}</div>}
        {success && <div className="mt-6 bg-green-500 text-white px-4 py-2 rounded-xl text-sm">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-10 w-full max-w-xl rounded-2xl bg-[#F2F2F2] p-10 shadow-[0_4px_30px_rgba(0,0,0,0.25)]">
          <label className="block text-base font-semibold mb-2">Adresse mail</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ton@email.fr" className="w-full h-12 mb-6 rounded-xl bg-[#D9D9D9] px-4 outline-none" />

          <label className="block text-base font-semibold mb-2">Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" className="w-full h-12 rounded-xl bg-[#D9D9D9] px-4 outline-none" />

          {mode === 'register' && (
            <div className="mt-6">
              <label className="block text-base font-semibold mb-3">Je suis...</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setRole('CONSUMER')} className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition ${role === 'CONSUMER' ? 'bg-[#6A00FF] text-white border-[#6A00FF]' : 'bg-white text-black border-gray-200'}`}>
                  Un acheteur
                </button>
                <button type="button" onClick={() => setRole('BRAND')} className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition ${role === 'BRAND' ? 'bg-[#6A00FF] text-white border-[#6A00FF]' : 'bg-white text-black border-gray-200'}`}>
                  Une marque
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div className="mt-2 text-right text-sm text-black/70 cursor-pointer">Mot de passe oublié</div>
          )}

          <button type="submit" disabled={loading} className="mt-6 w-full rounded-xl bg-[#6A00FF] py-3 text-white font-semibold text-base disabled:opacity-50 hover:opacity-90 transition">
            {loading ? '...' : mode === 'login' ? 'Connexion' : 'Créer mon compte'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  )
}