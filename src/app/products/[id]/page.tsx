'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '../../../lib/api'
import { Product } from '../../../types'
import { useCart } from '../../../context/CartContext'
import { useAuth } from '../../../hooks/useAuth'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    async function load() {
      const res = await api.get<{ success: boolean; data: Product }>(`/products/${id}`)
      setProduct(res.data)
      if (res.data.sizes.length > 0) setSelectedSize(res.data.sizes[0])
      if (res.data.colors.length > 0) setSelectedColor(res.data.colors[0])

      const allRes = await api.get<{ success: boolean; data: Product[] }>('/products')
      setRelatedProducts(allRes.data.filter(p => p.id !== id).slice(0, 4))
    }
    load()
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addItem(product, quantity, selectedSize, selectedColor)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-black/40">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-6 md:px-20 py-4 text-xs text-black/50 flex items-center gap-2">
        <Link href="/" className="hover:text-black">HOMEPAGE</Link>
        <span>›</span>
        <Link href="/catalogue" className="hover:text-black">CATALOGUE</Link>
        <span>›</span>
        <span className="text-[#6A00FF] font-semibold">
          {product.name} ({product.brand?.name?.toUpperCase()})
        </span>
      </div>

      <div className="px-6 md:px-20 py-8">
        <div className="flex flex-col md:flex-row gap-12">

          <div className="flex-1">
            <div className="w-full aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
              {product.images.length > 0
                ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                : <span className="text-black/20 text-sm">Pas d&apos;image</span>
              }
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {product.colors.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-3">Couleur</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg text-sm border-2 transition ${
                        selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold mb-3">Taille</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg text-sm border-2 font-semibold transition ${
                        selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <p className="text-sm font-semibold mb-3">Quantité</p>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl hover:border-black transition">−</button>
                <span className="text-lg font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-xl hover:border-black transition">+</button>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold mb-1">Prix</p>
              <p className="text-3xl font-black">{product.price.toFixed(2)} €</p>
            </div>

            {/* Ajouter au panier — caché pour les BRAND */}
            {user?.role !== 'BRAND' ? (
              <button
                onClick={handleAddToCart}
                className={`mt-6 w-full py-4 rounded-xl font-bold text-base transition ${
                  added ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {added ? '✓ Ajouté au panier !' : '🛒 Ajouter au panier'}
              </button>
            ) : (
              <div className="mt-6 w-full py-4 rounded-xl bg-gray-100 text-center text-black/40 text-sm">
                Les marques ne peuvent pas effectuer d&apos;achat
              </div>
            )}

            <div className="mt-10 border-t pt-6 space-y-4">
              <h3 className="font-bold text-lg">Détails du produit</h3>
              {product.brand && (
                <div>
                  <p className="text-sm font-bold">Créateur</p>
                  <p className="text-sm text-black/60">{product.brand.name?.toUpperCase()}</p>
                </div>
              )}
              {product.description && (
                <div>
                  <p className="text-sm font-bold">Histoire du produit</p>
                  <p className="text-sm text-black/60 leading-relaxed">{product.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8">On recommande aussi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link href={`/products/${p.id}`} key={p.id}>
                  <div className="group cursor-pointer">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative">
                      {p.images.length > 0
                        ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                        : <span className="absolute inset-0 flex items-center justify-center text-black/20 text-xs">Pas d&apos;image</span>
                      }
                    </div>
                    <p className="font-bold mt-2">{p.name}</p>
                    <p className="text-sm text-black/60">{p.price.toFixed(2)} €</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 border-t pt-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Avis sur le produit</h2>
            <button className="bg-[#6A00FF] text-white px-5 py-2 rounded-lg text-sm font-semibold">
              Laisser un avis 💬
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold">Sarah Chetté</p>
                <p className="text-xs text-black/40">Le 22 Mars 2025</p>
              </div>
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">★</span>)}
              </div>
              <p className="text-sm text-black/70">
                Super achat ! En plus de bien tenir chaud, la veste taille super bien ! Très hâte de voir la prochaine collection !
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="font-bold">Ash Heather</p>
                <p className="text-xs text-black/40">Le 22 Mars 2025</p>
              </div>
              <div className="flex gap-1 mb-3">
                {[1,2,3].map(i => <span key={i} className="text-yellow-400">★</span>)}
                {[4,5].map(i => <span key={i} className="text-gray-300">★</span>)}
              </div>
              <p className="text-sm text-black/70">
                Pas mal. J&apos;ai eu des vestes de bien meilleure qualité pour le même prix, mais ça reste un plutôt bon achat.
              </p>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}