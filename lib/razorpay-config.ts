/**
 * Razorpay Configuration
 * This file contains all Razorpay-related types and configuration
 */

// TypeScript interfaces for type safety
export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
}

export interface PaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface CheckoutDetails {
  name: string
  email: string
  phone: string
  address: string
  pincode: string
  alternatePhone?: string
}

export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  size: string
  image: string
  category?: string
  description?: string
  details?: string[]
  inStock?: boolean
  originalPrice?: number
}

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  currency: 'INR',
  company_name: 'Hezal Pet Accessories',
  description: 'Pet accessories order payment',
  image: '/logom.png', // Your company logo
  theme: {
    color: '#ec4899' // Your primary color
  }
}
