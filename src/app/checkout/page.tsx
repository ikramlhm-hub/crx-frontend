'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../hooks/useAuth'
import { api } from '../../lib/api'
import Link from 'next/link'

type Step = 1 | 2 | 3 | 4

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<Step>(2)
  const [loading, setLoading] = useState(false)

  // Rediriger si pas connectée
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout')
    }
  }, [user, router])

  // Livraison
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [country, setCountry] = useState('France')
  const [deliveryType, setDeliveryType] = useState('domicile')

  // Paiement
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('carte')

  const TAX = 4
  const PROMO = -25
  const orderTotal = total + TAX + PROMO

async function handleConfirm() {
  setLoading(true)
  try {
    await api.post('/orders', {
      items: items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity
      })),
      address: {
        firstName,
        lastName,
        email,
        phone,
        street: address,
        zipCode,
        country,
        deliveryType
      }
    })
    clear()
    setStep(4)
  } catch {
    alert('Erreur lors de la commande.')
  } finally {
    setLoading(false)
  }
}
  // Ne rien afficher si pas connectée
  if (!user) return null

  const steps = [
    { num: 1, label: 'DETAILS DE LA COMMANDE' },
    { num: 2, label: 'LIVRAISON' },
    { num: 3, label: 'PAIEMENT' },
    { num: 4, label: 'CONFIRMATION' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="px-6 md:px-20 py-6 flex items-center gap-6 flex-wrap">
        {steps.map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <span className={`text-xs font-bold ${step === s.num ? 'text-[#6A00FF]' : 'text-black/40'}`}>
              <span className="inline-flex items-center gap-1">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step === s.num ? 'bg-[#6A00FF] text-white' : 'border border-black/30 text-black/40'}`}>
                  {s.num}
                </span>
                {s.label}
              </span>
            </span>
          </div>
        ))}
      </div>

      <div className="px-6 md:px-20 pb-20">

        {step === 2 && (
          <div>
            <h1 className="text-3xl font-black mb-8">Livraison</h1>

            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex gap-6 mb-8 flex-wrap">
                {['domicile', 'retrait', 'boutique'].map(type => (
                  <label key={type} className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={deliveryType === type} onChange={() => setDeliveryType(type)} className="mt-1" />
                    <div>
                      <p className="font-semibold text-sm">
                        {type === 'domicile' ? 'Livraison à domicile' : type === 'retrait' ? 'Envoi à un point de retrait' : 'Retrait en boutique'}
                      </p>
                      <p className="text-xs text-black/50">
                        {type === 'domicile' ? 'Reçoit ta commande chez toi' : type === 'retrait' ? 'Récupère ta commande à un point de retrait' : 'Récupère ta commande directement en boutique'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Prénom</label>
                  <div className="flex gap-2">
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} className="flex-1 h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="Prénom" />
                    <button className="border border-black rounded-lg px-4 text-sm font-semibold">Modifier</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Nom</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="Nom" />
                </div>
              </div>

              <p className="font-bold mb-4">Contact</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs text-black/50 mb-1">Adresse mail</label>
                  <div className="flex gap-2">
                    <input value={email} onChange={e => setEmail(e.target.value)} className="flex-1 h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="email@exemple.fr" />
                    <button className="border border-black rounded-lg px-4 text-sm font-semibold">Modifier</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-black/50 mb-1">Téléphone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="06 XX XX XX XX" />
                </div>
              </div>

              <p className="font-bold mb-4">Adresse de livraison</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-black/50 mb-1">Adresse</label>
                  <div className="flex gap-2">
                    <input value={address} onChange={e => setAddress(e.target.value)} className="flex-1 h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="12 rue de la Paix" />
                    <button className="border border-black rounded-lg px-4 text-sm font-semibold">Modifier</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-black/50 mb-1">Code postal</label>
                    <input value={zipCode} onChange={e => setZipCode(e.target.value)} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="75001" />
                  </div>
                  <div>
                    <label className="block text-xs text-black/50 mb-1">Pays</label>
                    <input value={country} onChange={e => setCountry(e.target.value)} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" />
                Définir comme adresse par défaut
              </label>
            </div>

            <h2 className="text-2xl font-black mb-4">Montant total de la commande</h2>
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex justify-between text-sm font-bold mb-2 border-b pb-2">
                <span>Source du montant</span><span>Prix</span>
              </div>
              <div className="flex justify-between text-sm py-2"><span>Montant total des articles</span><span className="font-semibold">{total.toFixed(0)}€</span></div>
              <div className="flex justify-between text-sm py-2"><span>Livraison</span><span className="font-semibold">0€</span></div>
              <div className="flex justify-between text-sm py-2 text-[#6A00FF]"><span>Coupon / Promotion</span><span className="font-semibold">-25€</span></div>
              <div className="flex justify-between text-sm py-2"><span>Taxe</span><span className="font-semibold">4€</span></div>
              <div className="flex justify-between font-black text-base pt-4 border-t mt-2">
                <span>Montant total de la commande</span><span>{orderTotal.toFixed(0)}€</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button onClick={() => setStep(3)} className="w-64 bg-[#6A00FF] text-white py-3 rounded-xl font-bold text-sm">Continuer</button>
              <Link href="/panier"><button className="w-64 border-2 border-black py-3 rounded-xl font-bold text-sm">Retour au panier</button></Link>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-3xl font-black mb-8">Moyen de paiement</h1>

            <div className="border border-gray-100 rounded-2xl p-8 shadow-sm mb-8">
              <div className="flex gap-8 mb-8 justify-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={paymentMethod === 'carte'} onChange={() => setPaymentMethod('carte')} />
                  <span className="font-semibold text-sm">Carte bancaire</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={paymentMethod === 'paypal'} onChange={() => setPaymentMethod('paypal')} />
                  <span className="font-semibold text-sm">Paypal</span>
                </label>
              </div>

              <p className="font-bold mb-6">Détails de la carte</p>
              <div className="mb-4">
                <label className="block text-xs text-black/50 mb-1">Numéro de carte</label>
                <input value={cardNumber} onChange={e => setCardNumber(e.target.value)} maxLength={19} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-black/50 mb-1">Date d&apos;expiration</label>
                  <input value={expiry} onChange={e => setExpiry(e.target.value)} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="MM/AA" />
                </div>
                <div>
                  <label className="block text-xs text-black/50 mb-1">Cryptogramme</label>
                  <input value={cvv} onChange={e => setCvv(e.target.value)} maxLength={3} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="CVV" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs text-black/50 mb-1">Nom du titulaire de la carte</label>
                <input value={cardName} onChange={e => setCardName(e.target.value)} className="w-full h-12 bg-[#E8E8F0] rounded-lg px-4 outline-none text-sm" placeholder="NOM Prénom" />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" />
                Définir comme carte par défaut
              </label>
            </div>

            <h2 className="text-2xl font-black mb-4">Montant total de la commande</h2>
            <div className="border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
              <div className="flex justify-between text-sm font-bold mb-2 border-b pb-2">
                <span>Source du montant</span><span>Prix</span>
              </div>
              <div className="flex justify-between text-sm py-2"><span>Montant total des articles</span><span className="font-semibold">{total.toFixed(0)}€</span></div>
              <div className="flex justify-between text-sm py-2"><span>Livraison</span><span className="font-semibold">0€</span></div>
              <div className="flex justify-between text-sm py-2 text-[#6A00FF]"><span>Coupon / Promotion</span><span className="font-semibold">-25€</span></div>
              <div className="flex justify-between text-sm py-2"><span>Taxe</span><span className="font-semibold">4€</span></div>
              <div className="flex justify-between font-black text-base pt-4 border-t mt-2">
                <span>Montant total de la commande</span><span>{orderTotal.toFixed(0)}€</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <button onClick={handleConfirm} disabled={loading} className="w-64 bg-[#6A00FF] text-white py-3 rounded-xl font-bold text-sm disabled:opacity-50">
                {loading ? 'Traitement...' : 'Continuer'}
              </button>
              <button onClick={() => setStep(2)} className="w-64 border-2 border-black py-3 rounded-xl font-bold text-sm">Retour au panier</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h1 className="text-4xl font-black mb-6 max-w-md leading-tight">
              Votre commande a bien été enregistrée !
            </h1>
            <p className="text-black/50 text-base mb-12 max-w-md">
              Elle a été ajoutée aux commandes dans votre espace personnel.<br />
              Vous allez également recevoir un email de confirmation
            </p>
            <div className="flex flex-col items-center gap-4">
              <Link href="/"><button className="w-64 bg-[#6A00FF] text-white py-3 rounded-xl font-bold text-sm">Continuer</button></Link>
              <Link href="/panier"><button className="w-64 border-2 border-black py-3 rounded-xl font-bold text-sm">Retour au panier</button></Link>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}