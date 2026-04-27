'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import Link from 'next/link'

interface Stats {
  totalBrands: number
  activeBrands: number
  pendingBrands: number
  totalOrders: number
  totalProducts: number
  pendingServices: number
  totalRevenue: number
}

interface Brand {
  id: string
  name: string
  slug: string
  status: string
  isActive: boolean
  credits: number
  createdAt: string
  user: { email: string }
}

interface Service {
  id: string
  type: string
  status: string
  cost: number
  createdAt: string
  brand: { name: string; slug: string }
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'brands' | 'services'>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.role !== 'ADMIN') {
      router.push('/')
      return
    }
    loadData()
  }, [user])

  async function loadData() {
    try {
      const [statsRes, brandsRes, servicesRes] = await Promise.all([
        api.get<{ success: boolean; data: Stats }>('/admin/stats'),
        api.get<{ success: boolean; data: Brand[] }>('/admin/brands'),
        api.get<{ success: boolean; data: Service[] }>('/admin/services'),
      ])
      setStats(statsRes.data)
      setBrands(brandsRes.data)
      setServices(servicesRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function approveBrand(id: string) {
    await api.patch(`/admin/brands/${id}/approve`, {})
    loadData()
  }

  async function rejectBrand(id: string) {
    await api.patch(`/admin/brands/${id}/reject`, {})
    loadData()
  }

  async function approveService(id: string) {
    await api.patch(`/admin/services/${id}/approve`, {})
    loadData()
  }

  async function rejectService(id: string) {
    await api.patch(`/admin/services/${id}/reject`, {})
    loadData()
  }

  async function completeService(id: string) {
    await api.patch(`/admin/services/${id}/complete`, {})
    loadData()
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F3F3F3] flex items-center justify-center">
      <p className="text-black/40 font-semibold">Chargement...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F3F3F3]">

      {/* Header admin */}
      <div className="w-full bg-black text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/">
            <img src="/icons/logo.png" alt="CRX" className="h-10 w-10 object-contain" />
          </Link>
          <span className="text-sm font-bold tracking-widest text-white/60">ADMIN</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">{user?.email}</span>
          <button onClick={logout} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <div className="w-full bg-white border-b border-black/10">
        <div className="flex px-8 gap-8 text-sm font-semibold">
          {[
            { key: 'dashboard', label: 'DASHBOARD' },
            { key: 'brands', label: `MARQUES (${brands.filter(b => b.status === 'PENDING').length} en attente)` },
            { key: 'services', label: `SERVICES (${services.filter(s => s.status === 'PENDING').length} en attente)` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-4 border-b-2 transition ${activeTab === tab.key ? 'border-[#6A00FF] text-[#6A00FF]' : 'border-transparent text-black/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-10">

        {/* ── DASHBOARD ── */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <h1 className="text-2xl font-black mb-8">Vue d&apos;ensemble</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-black/50 text-sm">Marques totales</p>
                <p className="text-4xl font-black mt-1">{stats.totalBrands}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-black/50 text-sm">Marques actives</p>
                <p className="text-4xl font-black mt-1 text-green-600">{stats.activeBrands}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-black/50 text-sm">En attente</p>
                <p className="text-4xl font-black mt-1 text-orange-500">{stats.pendingBrands}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-black/50 text-sm">Commandes</p>
                <p className="text-4xl font-black mt-1">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-black/50 text-sm">Produits</p>
                <p className="text-4xl font-black mt-1">{stats.totalProducts}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <p className="text-black/50 text-sm">Services en attente</p>
                <p className="text-4xl font-black mt-1 text-[#6A00FF]">{stats.pendingServices}</p>
              </div>
              <div className="bg-[#6A00FF] rounded-2xl p-6 shadow-sm col-span-2">
                <p className="text-white/70 text-sm">Chiffre d&apos;affaires total</p>
                <p className="text-4xl font-black mt-1 text-white">{stats.totalRevenue.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        )}

        {/* ── MARQUES ── */}
        {activeTab === 'brands' && (
          <div>
            <h1 className="text-2xl font-black mb-8">Gestion des marques</h1>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-6 font-semibold text-sm px-6 py-4 border-b bg-gray-50">
                <span>Marque</span>
                <span>Email</span>
                <span>Crédits</span>
                <span>Statut</span>
                <span>Date</span>
                <span className="text-right">Actions</span>
              </div>

              {brands.map(brand => (
                <div key={brand.id} className="grid grid-cols-6 px-6 py-4 border-b text-sm items-center">
                  <div>
                    <p className="font-bold">{brand.name}</p>
                    <p className="text-xs text-black/40">{brand.slug}</p>
                  </div>
                  <span className="text-black/60 text-xs">{brand.user?.email}</span>
                  <span className="font-semibold">{brand.credits}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                    brand.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    brand.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {brand.status}
                  </span>
                  <span className="text-black/40 text-xs">
                    {new Date(brand.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  <div className="flex gap-2 justify-end">
                    {brand.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => approveBrand(brand.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80"
                        >
                          Approuver
                        </button>
                        <button
                          onClick={() => rejectBrand(brand.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80"
                        >
                          Rejeter
                        </button>
                      </>
                    )}
                    {brand.status !== 'PENDING' && (
                      <span className="text-black/30 text-xs">Traité</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SERVICES ── */}
        {activeTab === 'services' && (
          <div>
            <h1 className="text-2xl font-black mb-8">Gestion des services</h1>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="grid grid-cols-5 font-semibold text-sm px-6 py-4 border-b bg-gray-50">
                <span>Marque</span>
                <span>Service</span>
                <span>Coût</span>
                <span>Statut</span>
                <span className="text-right">Actions</span>
              </div>

              {services.map(service => (
                <div key={service.id} className="grid grid-cols-5 px-6 py-4 border-b text-sm items-center">
                  <span className="font-bold">{service.brand?.name}</span>
                  <span className="text-black/60">{service.type.replace(/_/g, ' ')}</span>
                  <span className="font-semibold">{service.cost} crédits</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                    service.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    service.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                    service.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {service.status}
                  </span>
                  <div className="flex gap-2 justify-end">
                    {service.status === 'PENDING' && (
                      <>
                        <button onClick={() => approveService(service.id)} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80">
                          Approuver
                        </button>
                        <button onClick={() => rejectService(service.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80">
                          Rejeter
                        </button>
                      </>
                    )}
                    {service.status === 'APPROVED' && (
                      <button onClick={() => completeService(service.id)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:opacity-80">
                        Compléter
                      </button>
                    )}
                    {(service.status === 'COMPLETED' || service.status === 'REJECTED') && (
                      <span className="text-black/30 text-xs">Traité</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}