'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import { Brand, Product, Order, CreditLog, ServiceRequest } from '../../types'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [creditLogs, setCreditLogs] = useState<CreditLog[]>([])
  const [services, setServices] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [brandRes, productsRes, ordersRes, creditsRes, servicesRes] = await Promise.all([
          api.get<{ success: boolean; data: Brand & { creditLogs: CreditLog[] } }>('/brands/me'),
          api.get<{ success: boolean; data: Product[] }>('/products/me'),
          api.get<{ success: boolean; data: Order[] }>('/orders/brand'),
          api.get<{ success: boolean; data: { credits: number; creditLogs: CreditLog[] } }>('/credits/me'),
          api.get<{ success: boolean; data: ServiceRequest[] }>('/credits/me/services'),
        ])
        setBrand(brandRes.data)
        setProducts(productsRes.data)
        setOrders(ordersRes.data)
        setCreditLogs(creditsRes.data.creditLogs)
        setServices(servicesRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED').length
  const cancelledOrders = orders.filter(o => o.status === 'CANCELLED').length

  if (loading) return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center">
      <p className="text-black/50 font-semibold">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F3F3F3] overflow-x-hidden">

      {/* Nav dashboard */}
      <div className="w-full border-b border-black/10 bg-white">
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-20 py-4">
          <div className="flex gap-10 text-sm font-semibold overflow-x-auto whitespace-nowrap">
            <span className="cursor-pointer hover:opacity-70">INFORMATIONS BOUTIQUE</span>
            <span className="cursor-pointer hover:opacity-70">INFORMATIONS VENDEUR</span>
            <span className="cursor-pointer hover:opacity-70 font-bold text-[#AA6BFF] border-b-2 border-[#AA6BFF] pb-1">
              DASHBOARD
            </span>
            <span className="cursor-pointer hover:opacity-70">MESSAGERIE</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-black/50 hidden md:block">{user?.email}</span>
            <button
              onClick={logout}
              className="text-sm bg-black text-white px-4 py-2 rounded-lg font-semibold"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 md:px-20 py-10">

        {/* Bienvenue */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-poppins font-bold">
              Bonjour, {brand?.name} 👋
            </h1>
            <p className="text-sm text-black/50 mt-1">
              Statut : <span className={brand?.isActive ? 'text-green-600 font-semibold' : 'text-orange-500 font-semibold'}>
                {brand?.isActive ? 'Active' : 'En attente de validation'}
              </span>
            </p>
          </div>
        </div>

        {/* ── CRÉDITS CRX ── */}
        <div className="bg-[#6A00FF] rounded-2xl p-6 mb-10 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-sm font-semibold tracking-wider">CRÉDITS CRX</p>
              <p className="text-5xl font-black mt-1">{brand?.credits}</p>
              <p className="text-white/60 text-sm mt-1">crédits disponibles</p>
            </div>
            <div className="flex flex-col gap-2">
              {services.slice(0, 3).map(service => (
                <div key={service.id} className="bg-white/10 rounded-lg px-4 py-2 text-sm flex items-center justify-between gap-6">
                  <span>{service.type.replace(/_/g, ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    service.status === 'COMPLETED' ? 'bg-green-400 text-white' :
                    service.status === 'APPROVED' ? 'bg-blue-400 text-white' :
                    service.status === 'REJECTED' ? 'bg-red-400 text-white' :
                    'bg-white/30 text-white'
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
              {services.length === 0 && (
                <p className="text-white/50 text-sm">Aucun service demandé</p>
              )}
            </div>
          </div>

          {/* Historique crédits */}
          <div className="mt-6 border-t border-white/20 pt-4">
            <p className="text-white/70 text-xs font-semibold mb-3">HISTORIQUE</p>
            <div className="space-y-2">
              {creditLogs.slice(0, 5).map(log => (
                <div key={log.id} className="flex items-center justify-between text-sm">
                  <span className="text-white/80">{log.description}</span>
                  <span className={log.amount > 0 ? 'text-green-300 font-bold' : 'text-red-300 font-bold'}>
                    {log.amount > 0 ? `+${log.amount}` : log.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── COMMANDES ── */}
        <h2 className="text-2xl font-poppins font-bold mb-6">Commandes</h2>

        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-6 font-semibold text-sm px-6 py-4 border-b items-center">
              <span>Nom du client</span>
              <span>Total</span>
              <span>Livraison</span>
              <span>Status</span>
              <span>Date</span>
              <span className="text-right pr-4">Action</span>
            </div>

            <div className="max-h-[330px] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="px-6 py-8 text-center text-black/40 text-sm">
                  Aucune commande pour l&apos;instant
                </div>
              ) : orders.map(order => (
                <div key={order.id} className="grid grid-cols-6 px-6 py-4 border-b text-sm items-center">
                  <span>Client #{order.id.slice(-4)}</span>
                  <div className="text-green-600 font-medium">
                    {order.total}€<br />
                    <span className="text-xs text-black/60">Payé</span>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs w-fit ${
                    order.status === 'SHIPPED' || order.status === 'DELIVERED'
                      ? 'bg-green-400 text-white'
                      : 'bg-gray-300 text-black/70'
                  }`}>
                    {order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'Envoyé' : 'Non-envoyé'}
                  </span>
                  <span className={`px-3 py-1 rounded-md text-xs w-fit ${
                    order.status === 'DELIVERED' ? 'bg-green-600 text-white' :
                    order.status === 'CANCELLED' ? 'bg-red-600 text-white' :
                    order.status === 'SHIPPED' ? 'bg-blue-500 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {order.status === 'DELIVERED' ? 'Complété' :
                     order.status === 'CANCELLED' ? 'Annulé' :
                     order.status === 'SHIPPED' ? 'En livraison' : 'En cours'}
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                  <button className="text-right pr-4 text-[#6A00FF] font-medium underline">Modifier</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats commandes */}
        <div className="flex flex-col md:flex-row gap-6 mt-10 w-full">
          <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💳</span>
              <span className="text-2xl font-bold">{pendingOrders}</span>
            </div>
            <div className="text-black/60 text-sm">Commandes en attente</div>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚚</span>
              <span className="text-2xl font-bold">{shippedOrders}</span>
            </div>
            <div className="text-black/60 text-sm">Commandes en livraison</div>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">↩️</span>
              <span className="text-2xl font-bold">{cancelledOrders}</span>
            </div>
            <div className="text-black/60 text-sm">Commandes annulées</div>
          </div>
        </div>

        {/* ── PERFORMANCE ── */}
        <h2 className="text-xl font-poppins font-bold mt-16 mb-6">Performance</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-center items-center">
            <p className="text-4xl font-black text-[#6A00FF]">{orders.length}</p>
            <p className="text-black/50 text-sm mt-2">Commandes totales</p>
            <div className="mt-4 w-full bg-gray-100 rounded-full h-2">
              <div className="bg-[#6A00FF] h-2 rounded-full" style={{ width: `${Math.min(orders.length * 10, 100)}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <h3 className="font-semibold mb-4 text-lg">Article le plus vu</h3>
            {products[0] ? (
              <>
                <div className="w-full h-[220px] rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                  {products[0].images.length > 0
                    ? <img src={products[0].images[0]} alt={products[0].name} className="w-full h-full object-cover" />
                    : <span className="text-black/30 text-sm">Pas d&apos;image</span>
                  }
                </div>
                <div className="font-semibold">{products[0].name}</div>
                <div className="text-sm text-black/60">{products[0].price}€</div>
              </>
            ) : (
              <p className="text-black/30 text-sm">Aucun produit</p>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col">
            <h3 className="font-semibold mb-4 text-lg">Article le plus vendu</h3>
            {products[0] ? (
              <>
                <div className="w-full h-[220px] rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                  {products[0].images.length > 0
                    ? <img src={products[0].images[0]} alt={products[0].name} className="w-full h-full object-cover" />
                    : <span className="text-black/30 text-sm">Pas d&apos;image</span>
                  }
                </div>
                <div className="font-semibold">{products[0].name}</div>
                <div className="text-sm text-black/60">{products[0].price}€</div>
              </>
            ) : (
              <p className="text-black/30 text-sm">Aucun produit</p>
            )}
          </div>
        </div>

        {/* ── CATALOGUE ── */}
        <h2 className="text-xl font-poppins font-bold mt-16 mb-6">Catalogue</h2>

        <div className="bg-white rounded-xl shadow-md p-6 overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-6 font-semibold text-sm pb-4 border-b">
              <span>Nom de l&apos;article</span>
              <span>Prix</span>
              <span>Stock</span>
              <span>Tailles</span>
              <span>Disponibilité</span>
              <span className="text-right pr-4">Action</span>
            </div>

            <div className="max-h-[350px] overflow-y-scroll mt-2">
              {products.length === 0 ? (
                <div className="py-8 text-center text-black/40 text-sm">
                  Aucun produit dans le catalogue
                </div>
              ) : products.map(product => (
                <div key={product.id} className="grid grid-cols-6 py-4 text-sm items-center border-b">
                  <span className="font-medium">{product.name}</span>
                  <span className="font-semibold">{product.price}€</span>
                  <span>{product.stock}</span>
                  <span className="text-black/60">{product.sizes.join(', ') || '—'}</span>
                  <span className={`px-3 py-1 rounded-md text-xs w-fit ${
                    product.isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-black/70'
                  }`}>
                    {product.isActive ? 'Visible' : 'Masqué'}
                  </span>
                  <span className="text-right pr-4 text-[#6A00FF] font-medium underline cursor-pointer">
                    Modifier
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button className="flex items-center gap-2 text-black/70 text-sm hover:opacity-70">
                <span className="text-xl">＋</span> Ajouter un article
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}