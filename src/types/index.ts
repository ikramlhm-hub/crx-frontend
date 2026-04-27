export type Role = 'CONSUMER' | 'BRAND' | 'ADMIN'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export type ServiceType =
  | 'HOMEPAGE_HIGHLIGHT'
  | 'SOCIAL_POST'
  | 'PHYSICAL_STORE'
  | 'PHOTO_SHOOT'
  | 'EVENT'
  | 'NEWSLETTER'

export type ServiceStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED'

export interface User {
  id: string
  email: string
  role: Role
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  story?: string
  banner?: string
  logo?: string
  credits: number
  isActive: boolean
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export interface Product {
  id: string
  brandId: string
  name: string
  description?: string
  price: number
  stock: number
  images: string[]
  sizes: string[]
  colors: string[]
  isActive: boolean
  brand?: {
    name: string
    slug: string
    logo?: string
  }
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: {
    name: string
    images: string[]
    brand?: {
      name: string
      slug: string
    }
  }
}

export interface Order {
  id: string
  status: OrderStatus
  total: number
  address: {
    street: string
    city: string
    zipCode: string
    country: string
  }
  items: OrderItem[]
  createdAt: string
}

export interface CreditLog {
  id: string
  amount: number
  description: string
  createdAt: string
}

export interface ServiceRequest {
  id: string
  type: ServiceType
  status: ServiceStatus
  cost: number
  details?: Record<string, unknown>
  createdAt: string
}

export interface AuthResponse {
  success: boolean
  data: {
    accessToken: string
    refreshToken: string
    user: User
  }
}