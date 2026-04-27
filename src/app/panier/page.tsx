'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../hooks/useAuth'

export default function PanierPage() {
  const { items, removeItem, increment, decrement, total, count } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  function handleCheckout() {
    if (!user) {
      router.push('/login?redirect=/checkout')
      return
    }
    router.push('/checkout')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="w-full border-b border-black/10">
        <div className="flex items-center justify-between px-6 md:px-20 py-4">
          <div className="flex gap-8 text-sm font-semibold">
            <span className="cursor-pointer hover:opacity-70">INFORMATIONS PERSONNELLES</span>
            <span className="cursor-pointer hover:opacity-70">FAVORIS</span>
            <span className="cursor-pointer hover:opacity-70 border-b-2 border-black pb-1">PANIER</span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-20 py-10">
        <h1 className="text-3xl font-black mb-8">Panier</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-black/40 text-lg mb-6">Ton panier est vide</p>
            <Link href="/">
              <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold">
                Continuer mes achats
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">

            <div className="flex-1 space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.images.length > 0
                      ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gray-200" />
                    }
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-base">{item.product.name}</p>
                      <p className="font-black text-lg">{(item.product.price * item.quantity).toFixed(2)} €</p>
                    </div>
                    <p className="text-sm text-black/50 mt-1">Couleur &nbsp; {item.color || '—'}</p>
                    <p className="text-sm text-black/50">Taille &nbsp;&nbsp;&nbsp; {item.size || '—'}</p>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1">
                        <button onClick={() => decrement(index)} className="text-lg font-bold hover:opacity-50 transition select-none w-6 text-center">−</button>
                        <span className="w-6 text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => increment(index)} className="text-lg font-bold hover:opacity-50 transition select-none w-6 text-center">+</button>
                      </div>
                      <button onClick={() => removeItem(index)} className="p-2 hover:opacity-50 transition text-red-400" title="Supprimer">🗑️</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80">
              <div className="border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">Total des articles</p>
                  <p className="font-black text-lg">{total.toFixed(2)} €</p>
                </div>
                <div className="flex items-center justify-between mb-6 pb-6 border-b">
                  <p className="font-semibold text-sm">Nombre d&apos;articles</p>
                  <p className="font-black">{count}</p>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full border-2 border-black rounded-xl py-3 font-bold text-sm hover:bg-black hover:text-white transition"
                >
                  Passer au paiement
                </button>

                {!user && (
                  <p className="text-center text-xs text-black/40 mt-3">
                    Tu devras te connecter pour finaliser ta commande
                  </p>
                )}

                <div className="mt-6 space-y-2 text-xs text-black/50">
                  <p>Les articles sont conservés pendant 30 jours dans votre panier.</p>
                  <p>Les coupons peuvent être appliqués depuis la page de paiement.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8">On recommande aussi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Link href="/products/cmoft59570001y9inx0qyebm7" key={i}>
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img src="/icons/articles/article1.png" alt="Veste IELO" className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <p className="font-bold mt-2">Veste IELO</p>
                  <p className="text-sm text-black/60">50,00 €</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}