import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '../context/CartContext'

export const metadata: Metadata = {
  title: 'CRX - La marketplace des créateurs indépendants',
  description: 'Découvrez les meilleures marques de mode indépendante française',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}