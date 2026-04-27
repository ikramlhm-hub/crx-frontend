'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import { useAuth } from '../hooks/useAuth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { count } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="w-full bg-[#000000] overflow-x-hidden">
      <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 sm:flex-nowrap sm:px-10 sm:py-6">
        <Link href="/" className="h-12 w-12 sm:h-16 sm:w-16">
          <img src="/icons/logo.png" alt="Logo CRX" className="h-full w-full object-contain cursor-pointer" />
        </Link>

        <div className="order-3 w-full sm:order-none sm:mx-10 sm:flex-1 sm:max-w-xl">
          <div className="flex items-center gap-2 bg-[#FAFAFA] px-4 py-2 sm:px-5 sm:py-3 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input type="text" placeholder="Rechercher..." className="w-full bg-transparent text-sm outline-none" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button className="p-1" aria-label="Favoris">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7a5 5 0 1 0-7.1 7.1l1.7 1.7L12 21l7.1-7.6 1.7-1.7a5 5 0 0 0 0-7.1z" />
            </svg>
          </button>

          {/* Panier — caché pour les BRAND */}
          {user?.role !== 'BRAND' && (
            <Link href="/panier" className="p-1 relative" aria-label="Panier">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M1 1h3l2.6 11.1A2 2 0 0 0 8.6 14h9.8a2 2 0 0 0 2-1.6L22 6H6" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#6A00FF] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </Link>
          )}

          {/* Si BRAND connectée → bouton dashboard */}
          {user?.role === 'BRAND' && (
            <Link href="/dashboard">
              <button className="bg-[#6A00FF] text-white px-4 py-2 text-xs font-bold rounded-md">
                Mon dashboard
              </button>
            </Link>
          )}

          <div className="hidden items-center gap-3 sm:flex">
            {!user ? (
              <Link href="/login">
                <button className="bg-[#FFFFFF] px-4 py-2 text-xs font-bold text-black rounded-md">Connexion</button>
              </Link>
            ) : (
              <button
                onClick={logout}
                className="bg-[#FFFFFF] px-4 py-2 text-xs font-bold text-black rounded-md"
              >
                Déconnexion
              </button>
            )}
            <button className="bg-[#FFFFFF] px-4 py-2 text-xs font-bold text-black rounded-md">Service client</button>
          </div>

          <button className="ml-1 inline-flex items-center justify-center p-1 sm:hidden" onClick={() => setOpen(!open)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {open ? (<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>) : (<><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>)}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-2 border-t border-black/10 px-4 pb-4 pt-2 text-sm sm:hidden">
          {!user
            ? <Link href="/login"><button className="bg-[#FFFFFF] px-4 py-2 text-left font-bold text-black rounded-md">Connexion</button></Link>
            : <button onClick={logout} className="bg-[#FFFFFF] px-4 py-2 text-left font-bold text-black rounded-md">Déconnexion</button>
          }
          <button className="bg-[#FFFFFF] px-4 py-2 text-left font-bold text-black rounded-md">Service client</button>
          <hr className="my-2 border-black/10" />
          <button className="px-2 py-1 text-left text-xs font-semibold tracking-[0.18em] text-white">CREATEURS</button>
          <button className="px-2 py-1 text-left text-xs font-semibold tracking-[0.18em] text-white">CATALOGUE</button>
          <button className="px-2 py-1 text-left text-xs font-semibold tracking-[0.18em] text-white">NOUVEAUTÉS</button>
        </div>
      )}

      <div className="hidden sm:grid w-full grid-cols-3 text-center pt-8 pb-10">
        <div><button className="text-lg font-bold tracking-[0.18em] text-white font-poppins">CREATEURS</button></div>
        <div><button className="text-lg font-bold tracking-[0.18em] text-white font-poppins">CATALOGUE</button></div>
        <div><button className="text-lg font-bold tracking-[0.18em] text-white font-poppins">NOUVEAUTÉS</button></div>
      </div>
    </header>
  )
}