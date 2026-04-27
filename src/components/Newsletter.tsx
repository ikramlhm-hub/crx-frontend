'use client'

import { useState } from 'react'
import { api } from '../lib/api'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubscribe() {
    try {
      await api.post('/newsletter/subscribe', { email })
      setSuccess(true)
      setEmail('')
    } catch {
      setError('Connecte-toi pour t\'abonner à la newsletter')
    }
  }

  return (
    <section className="w-full bg-black py-24">
      <div className="mx-auto max-w-5xl bg-white rounded-2xl px-8 py-20">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Rejoins notre newsletter
        </h2>
        <p className="mt-6 text-center text-sm md:text-base text-black/80 leading-relaxed">
          Sois parmi les premiers à être au courant des dernières sorties<br />
          de nos partenaires !
        </p>

        {success && (
          <p className="mt-6 text-center text-green-600 font-semibold">
            Inscription réussie ! 🎉
          </p>
        )}

        {error && (
          <p className="mt-6 text-center text-red-500 text-sm">{error}</p>
        )}

        <div className="mt-10 flex w-full justify-center">
          <div className="flex w-full max-w-xl">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Ecris ton adresse mail ici"
              className="h-12 w-full bg-[#D9D9D9] px-5 text-sm placeholder:text-black/50 rounded-l-md outline-none"
            />
            <button
              onClick={handleSubscribe}
              className="h-12 bg-[#5506DB] text-white px-8 text-sm font-semibold rounded-r-md whitespace-nowrap"
            >
              Rejoins-nous
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}