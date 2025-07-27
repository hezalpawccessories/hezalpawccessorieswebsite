import { useState } from 'react'
import { toast } from 'sonner'
import { RAZORPAY_CONFIG } from '@/integrations/razorpay/config'
import { v4 as uuidv4 } from 'uuid'
import { saveOrder } from '@/integrations/razorpay/utils'

declare global {
  interface Window {
    Razorpay: any
  }
}

interface UseRazorpayProps {
  onSuccess: (paymentData: any) => void
  onFailure?: (error: any) => void
}

export const useRazorpay = ({ onSuccess, onFailure }: UseRazorpayProps) => {
  const [loading, setLoading] = useState(false)

  const initiatePayment = async (
    amount: number,
    customerDetails: any,
    cartItems: any[]
  ) => {
    setLoading(true)

    try {
      // Create order on backend
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          customerDetails,
          items: cartItems,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      // Generate order ID for our system
      const orderId = uuidv4()

      // Save order to localStorage first
      const order = {
        id: orderId,
        customerId: uuidv4(),
        customerDetails,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        })),
        total: amount,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveOrder(order)

      // Configure Razorpay options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: RAZORPAY_CONFIG.company_name,
        description: `Payment for ${cartItems.length} item(s)`,
        image: RAZORPAY_CONFIG.company_logo,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (verifyResponse.ok && verifyData.success) {
              toast.success('Payment Successful!', {
                description: 'Your order has been placed successfully',
                duration: 5000,
              })
              onSuccess({
                ...response,
                orderId,
                orderDetails: order,
              })
            } else {
              throw new Error(verifyData.error || 'Payment verification failed')
            }
          } catch (error) {
            console.error('Payment verification error:', error)
            toast.error('Payment Verification Failed', {
              description: 'Please contact customer support',
              duration: 5000,
            })
            onFailure?.(error)
          }
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
        theme: {
          color: RAZORPAY_CONFIG.theme_color,
        },
        modal: {
          ondismiss: function () {
            toast.error('Payment Cancelled', {
              description: 'You have cancelled the payment process',
              duration: 3000,
            })
            setLoading(false)
          },
        },
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options)
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error)
        toast.error('Payment Failed', {
          description: response.error.description || 'Payment was not successful',
          duration: 5000,
        })
        onFailure?.(response.error)
        setLoading(false)
      })

      rzp.open()
    } catch (error) {
      console.error('Payment initiation error:', error)
      toast.error('Payment Error', {
        description: 'Failed to initiate payment. Please try again.',
        duration: 5000,
      })
      onFailure?.(error)
      setLoading(false)
    }
  }

  return {
    initiatePayment,
    loading,
  }
}
