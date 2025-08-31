/**
 * useRazorpay Hook
 * Custom React hook to handle Razorpay payment integration
 */

import { useState } from 'react'
import { toast } from 'sonner'
import { RAZORPAY_CONFIG, PaymentData, CheckoutDetails, CartItem } from '@/lib/razorpay-config'

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any
  }
}

interface UseRazorpayProps {
  onSuccess: (data: {
    success: boolean
    orderDetails: {
      orderId: string
      paymentId: string
      amount: number
      status: string
      customerDetails: CheckoutDetails
      cartItems: CartItem[]
      timestamp: string
    }
  }) => void
  onFailure: (error: Error) => void
}

export const useRazorpay = ({ onSuccess, onFailure }: UseRazorpayProps) => {
  const [loading, setLoading] = useState(false)

  const initiatePayment = async (
    amount: number,
    customerDetails: CheckoutDetails,
    cartItems: CartItem[]
  ) => {
    try {
      setLoading(true)

      // Step 1: Create order on our server
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          customerDetails,
          cartItems,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Step 2: Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: RAZORPAY_CONFIG.company_name,
        description: RAZORPAY_CONFIG.description,
        image: RAZORPAY_CONFIG.image,
        order_id: orderData.order.id,
        handler: async (response: PaymentData) => {
          // Step 3: Verify payment on our server
          await verifyPayment(response, customerDetails, cartItems, amount)
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        notes: {
          address: customerDetails.address,
          pincode: customerDetails.pincode,
        },
        theme: RAZORPAY_CONFIG.theme,
        modal: {
          ondismiss: () => {
            setLoading(false)
            toast.error('Payment cancelled')
          },
        },
      }

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment initiation error:', error)
      setLoading(false)
      toast.error('Failed to initiate payment')
      onFailure(error as Error)
    }
  }

  const verifyPayment = async (
    paymentData: PaymentData,
    customerDetails: CheckoutDetails,
    cartItems: CartItem[],
    amount: number
  ) => {
    try {
      // Verify payment signature on server
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          customerDetails,
          cartItems,
          amount,
        }),
      })

      const verifyData = await verifyResponse.json()

      if (verifyData.success) {
        toast.success('Payment successful!')
        onSuccess(verifyData)
      } else {
        throw new Error(verifyData.error || 'Payment verification failed')
      }

    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Payment verification failed')
      onFailure(error as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    initiatePayment,
    loading,
  }
}
