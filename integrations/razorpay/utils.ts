import Razorpay from 'razorpay'
import { RAZORPAY_CONFIG, Order, PaymentDetails } from './config'

// Initialize Razorpay instance (server-side only)
let razorpay: Razorpay | null = null

if (typeof window === 'undefined') {
   razorpay = new Razorpay({
      key_id: RAZORPAY_CONFIG.key_id,
      key_secret: RAZORPAY_CONFIG.key_secret,
   })
}

// Create Razorpay order
export async function createRazorpayOrder(amount: number, customerDetails: any) {
   if (!razorpay) {
      throw new Error('Razorpay not initialized')
   }

   try {
      const options = {
         amount: amount * 100, // Convert to paise
         currency: RAZORPAY_CONFIG.currency,
         receipt: `order_${Date.now()}`,
         notes: {
            customer_name: customerDetails.name,
            customer_email: customerDetails.email,
            customer_phone: customerDetails.phone,
         },
      }

      const order = await razorpay.orders.create(options)
      return order
   } catch (error) {
      console.error('Error creating Razorpay order:', error)
      throw error
   }
}

// Verify payment signature
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
   const crypto = require('crypto')
   const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_CONFIG.key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex')

   return expectedSignature === signature
}

// Save order to localStorage (you can replace this with database integration)
export function saveOrder(order: Order): void {
   if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(order)
      localStorage.setItem('orders', JSON.stringify(orders))
   }
}

// Get orders from localStorage
export function getOrders(): Order[] {
   if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('orders') || '[]')
   }
   return []
}

// Update order status
export function updateOrderStatus(orderId: string, status: any, paymentDetails?: PaymentDetails): void {
   if (typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const orderIndex = orders.findIndex((order: Order) => order.id === orderId)

      if (orderIndex !== -1) {
         orders[orderIndex].status = status
         orders[orderIndex].updatedAt = new Date().toISOString()

         if (paymentDetails) {
            orders[orderIndex].paymentDetails = paymentDetails
         }

         localStorage.setItem('orders', JSON.stringify(orders))
      }
   }
}
