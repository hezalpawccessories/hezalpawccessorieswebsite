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
  customName?: string
  bowStyle?: number
  bowStyleName?: string
}

interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  pincode: string
  alternatePhone: string
}

// Initialize Razorpay instance (conditionally to avoid build errors)
const razorpay = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  : null

export async function POST(request: NextRequest) {
  try {
    // Helper to recursively remove undefined values (Firestore doesn't accept undefined)
    const removeUndefined = (value: any): any => {
      if (value === undefined) return undefined
      if (value === null) return null
      if (Array.isArray(value)) {
        return value
          .map((v) => removeUndefined(v))
          .filter((v) => v !== undefined)
      }
      if (typeof value === 'object') {
        const out: any = {}
        Object.keys(value).forEach((k) => {
          const v = removeUndefined(value[k])
          if (v !== undefined) out[k] = v
        })
        return out
      }
      return value
    }
    // TEMPORARY: masked logging to help debug deployed env values (safe)
    try {
      const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
      const secretKey = process.env.RAZORPAY_KEY_SECRET || ''
      const mask = (s: string) => s ? `${s.slice(0,4)}...${s.slice(-4)}` : '(not set)'
      console.log('Masked Razorpay envs - NEXT_PUBLIC_RAZORPAY_KEY_ID:', mask(publicKey), ' RAZORPAY_KEY_SECRET length:', secretKey ? secretKey.length : '(not set)')
    } catch (logErr) {
      console.error('Masked env logging failed', logErr)
    }

    // Check if Razorpay is properly configured
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

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
      // Diagnostic: find any undefined paths in order data (helps track unsupported undefined fields)
      const findUndefinedPaths = (obj: any, prefix = ''): string[] => {
        if (obj === undefined) return [prefix || '(root)']
        if (obj === null) return []
        if (Array.isArray(obj)) {
          return obj.flatMap((v, i) => findUndefinedPaths(v, `${prefix}[${i}]`))
        }
        if (typeof obj === 'object') {
          return Object.keys(obj).flatMap((k) => findUndefinedPaths(obj[k], prefix ? `${prefix}.${k}` : k))
        }
        return []
      }
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
          category: item.category,
      customName: item.customName,
      bowStyle: item.bowStyle,
      bowStyleName: item.bowStyleName
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

      // Log any undefined fields (diagnostic)
      const undefinedPaths = findUndefinedPaths(firebaseOrderData)
      if (undefinedPaths.length > 0) {
        console.warn('Detected undefined fields in firebaseOrderData:', undefinedPaths)
      }

      // Clean undefined values before sending to Firestore
      const cleanedOrderData = removeUndefined(firebaseOrderData)

      const firebaseOrderResult = await createOrder(cleanedOrderData)
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

  // Clean undefined values before creating payment log
  const cleanedPaymentLog = removeUndefined(paymentLogData)

  const paymentLogResult = await createPaymentLog(cleanedPaymentLog)
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
    // Include server error message in response during development to aid debugging
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to create order', message },
      { status: 500 }
    )
  }
}
