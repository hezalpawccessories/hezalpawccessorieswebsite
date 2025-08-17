// Razorpay Configuration
export const RAZORPAY_CONFIG = {
   key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_key_id', // Replace with your actual key
   key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret', // Replace with your actual secret
   currency: 'INR',
   company_name: 'Hezal Accessories',
   company_logo: '/logom.png',
   theme_color: '#ff6b9d',
}

// Order status types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'

// Payment interface
export interface PaymentDetails {
   razorpay_payment_id: string
   razorpay_order_id: string
   razorpay_signature: string
}

// Order interface
export interface Order {
   id: string
   customerId: string
   customerDetails: {
      name: string
      email: string
      phone: string
      address: string
      pincode: string
      alternatePhone?: string
   }
   items: Array<{
      id: string
      title: string
      price: number
      quantity: number
      size: string
      image: string
   }>
   total: number
   status: OrderStatus
   paymentDetails?: PaymentDetails
   createdAt: string
   updatedAt: string
}
