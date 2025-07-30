/**
 * Razorpay Payment Verification API
 * This endpoint verifies the payment signature and confirms the transaction
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { updatePaymentStatusByRazorpayId } from '@/lib/firebase/orders'
import { updatePaymentStatusByRazorpayId as updatePaymentLogByRazorpayId } from '@/lib/firebase/payments'

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

export async function POST(request: NextRequest) {
   let razorpay_order_id: string | undefined

   try {
      const body = await request.json()
      const { 
         razorpay_order_id: orderIdFromBody, 
         razorpay_payment_id, 
         razorpay_signature, 
         customerDetails, 
         cartItems, 
         amount 
      }: {
         razorpay_order_id: string
         razorpay_payment_id: string
         razorpay_signature: string
         customerDetails: CustomerDetails
         cartItems: CartItem[]
         amount: number
      } = body

      razorpay_order_id = orderIdFromBody

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

         // Update payment status in Firebase Orders collection
         try {
            // Find and update order by razorpay order ID
            const paymentUpdateResult = await updatePaymentStatusByRazorpayId(razorpay_order_id, {
               razorpayPaymentId: razorpay_payment_id,
               paymentStatus: 'paid',
               paymentMethod: 'razorpay' // You can get actual method from Razorpay API if needed
            })

            if (paymentUpdateResult.success) {
               console.log('Order payment status updated in Firebase')
            } else {
               console.error('Failed to update order payment status:', paymentUpdateResult.error)
            }

            // Update payment log status
            const paymentLogUpdateResult = await updatePaymentLogByRazorpayId(
               razorpay_order_id, 
               'success',
               {
                  razorpayPaymentId: razorpay_payment_id,
                  razorpaySignature: razorpay_signature
               }
            )
            if (paymentLogUpdateResult.success) {
               console.log('Payment log updated in Firebase')
            } else {
               console.error('Failed to update payment log:', paymentLogUpdateResult.error)
            }

         } catch (firebaseError) {
            console.error('Firebase update failed:', firebaseError)
            // Continue with response even if Firebase update fails
         }

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
         // Invalid signature - mark as failed
         console.error('Payment verification failed - invalid signature')
         
         // Update payment status to failed in Firebase
         try {
            const paymentLogUpdateResult = await updatePaymentLogByRazorpayId(
               razorpay_order_id, 
               'failed',
               {
                  errorDetails: {
                     errorCode: 'SIGNATURE_VERIFICATION_FAILED',
                     errorDescription: 'Payment signature verification failed',
                     failureReason: 'Invalid payment signature'
                  }
               }
            )
            
            if (paymentLogUpdateResult.success) {
               console.log('Payment failure logged in Firebase')
            }
         } catch (firebaseError) {
            console.error('Failed to log payment failure:', firebaseError)
         }
         
         return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
      }
   } catch (error) {
      console.error('Error verifying payment:', error)
      
      // Log error to Firebase if we have razorpay_order_id
      if (razorpay_order_id) {
         try {
            await updatePaymentLogByRazorpayId(
               razorpay_order_id, 
               'failed',
               {
                  errorDetails: {
                     errorCode: 'VERIFICATION_ERROR',
                     errorDescription: error instanceof Error ? error.message : 'Unknown verification error',
                     failureReason: 'Payment verification process failed'
                  }
               }
            )
         } catch (firebaseError) {
            console.error('Failed to log verification error:', firebaseError)
         }
      }
      
      return NextResponse.json({ error: 'Payment verification error' }, { status: 500 })
   }
}
