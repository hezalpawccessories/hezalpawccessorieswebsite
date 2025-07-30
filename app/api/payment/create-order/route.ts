/**
 * Razorpay Order Creation API
 * This endpoint creates a new payment order in Razorpay
 */

import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { createOrder } from '@/lib/firebase/orders'
import { createPaymentLog } from '@/lib/firebase/payments'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  size: string
  image: string
  category: string
}

interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  pincode: string
  alternatePhone: string
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, customerDetails, cartItems }: {
      amount: number
      customerDetails: CustomerDetails
      cartItems: CartItem[]
    } = body

    // Validate required fields
    if (!amount || !customerDetails || !cartItems) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create order receipt (unique identifier)
    const receipt = `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency: 'INR',
      receipt: receipt,
    })

    console.log('Order created:', order.id)

    // Create order in Firebase
    try {
      const firebaseOrderData = {
        orderId: receipt,
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          pincode: customerDetails.pincode,
          alternatePhone: customerDetails.alternatePhone
        },
        items: cartItems.map((item: CartItem) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          image: item.image,
          category: item.category
        })),
        orderSummary: {
          subtotal: amount,
          shipping: 0,
          total: amount
        },
        paymentDetails: {
          razorpayOrderId: order.id,
          paymentStatus: 'pending' as const,
          paymentAmount: amount
        },
        orderStatus: 'placed' as const
      }

      const firebaseOrderResult = await createOrder(firebaseOrderData)
      if (firebaseOrderResult.success) {
        console.log('Order saved to Firebase:', firebaseOrderResult.orderId)
      } else {
        console.error('Failed to save order to Firebase:', firebaseOrderResult.error)
      }

      // Create payment log in Firebase
      const paymentLogData = {
        transactionId: `TXN_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        razorpayOrderId: order.id,
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone
        },
        amount: amount,
        currency: 'INR',
        paymentStatus: 'initiated' as const,
        orderReference: {
          orderId: firebaseOrderResult.orderId || 'unknown',
          orderNumber: receipt,
          items: cartItems.map((item: CartItem) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }

      const paymentLogResult = await createPaymentLog(paymentLogData)
      if (paymentLogResult.success) {
        console.log('Payment log created in Firebase:', paymentLogResult.paymentLogId)
      } else {
        console.error('Failed to create payment log:', paymentLogResult.error)
      }
    } catch (firebaseError) {
      console.error('Firebase operation failed:', firebaseError)
      // Continue with payment creation even if Firebase fails
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      customerDetails,
      cartItems,
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
