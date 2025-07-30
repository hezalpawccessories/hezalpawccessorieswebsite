/**
 * Razorpay Payment Verification API
 * This endpoint verifies the payment signature and confirms the transaction
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
   try {
      const body = await request.json()
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerDetails, cartItems, amount } = body

      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
         return NextResponse.json({ error: 'Missing payment verification data' }, { status: 400 })
      }

      // Create signature for verification
      const body_string = razorpay_order_id + '|' + razorpay_payment_id
      const expected_signature = crypto
         .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
         .update(body_string)
         .digest('hex')

      // Verify signature
      const is_authentic = expected_signature === razorpay_signature

      if (is_authentic) {
         // Payment is verified and successful
         console.log('Payment verified successfully:', razorpay_payment_id)

         // Here you can:
         // 1. Save order to database
         // 2. Send confirmation emails
         // 3. Update inventory
         // 4. Trigger webhooks

         return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            orderDetails: {
               orderId: razorpay_order_id,
               paymentId: razorpay_payment_id,
               amount: amount,
               status: 'paid',
               customerDetails,
               cartItems,
               timestamp: new Date().toISOString(),
            },
         })
      } else {
         // Invalid signature
         console.error('Payment verification failed - invalid signature')
         return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
      }
   } catch (error) {
      console.error('Error verifying payment:', error)
      return NextResponse.json({ error: 'Payment verification error' }, { status: 500 })
   }
}
