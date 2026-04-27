'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product } from '../types'

interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number, size: string, color: string) => void
  removeItem: (index: number) => void
  increment: (index: number) => void
  decrement: (index: number) => void
  total: number
  count: number
  clear: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(product: Product, quantity: number, size: string, color: string) {
    setItems(prev => {
      const existingIndex = prev.findIndex(i =>
        i.product.id === product.id && i.size === size && i.color === color
      )
      if (existingIndex !== -1) {
        return prev.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity, size, color }]
    })
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function increment(index: number) {
    setItems(prev => prev.map((item, i) =>
      i === index
        ? { ...item, quantity: Math.min(item.quantity + 1, item.product.stock) }
        : item
    ))
  }

  function decrement(index: number) {
    setItems(prev => prev
      .map((item, i) => i === index ? { ...item, quantity: item.quantity - 1 } : item)
      .filter(item => item.quantity > 0)
    )
  }

  function clear() {
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, increment, decrement, total, count, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}