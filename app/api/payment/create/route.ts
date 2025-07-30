import { NextRequest, NextResponse } from 'next/server'

// Simple order creation without Razorpay server SDK for now
export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { amount, customerDetails, items } = body

      if (!amount || !customerDetails) {
         return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      // For demo purposes, we'll create a mock order
      // In production, you should use Razorpay server SDK
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return NextResponse.json({
         orderId: orderId,
         amount: amount * 100, // Convert to paise
         currency: 'INR',
         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      })
   } catch (error) {
      console.error('Payment creation error:', error)
      return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
   }
}
