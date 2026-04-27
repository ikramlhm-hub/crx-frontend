import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function CommandeConfirmeePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-3xl font-black mb-4">Commande confirmée !</h1>
        <p className="text-black/50 text-lg mb-10 max-w-md">
          Merci pour ta commande. Tu recevras un email de confirmation très bientôt.
        </p>
        <Link href="/">
          <button className="bg-black text-white px-10 py-4 rounded-xl font-bold text-base">
            Retour à l&apos;accueil
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  )
}