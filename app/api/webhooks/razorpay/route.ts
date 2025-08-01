/**
 * Razorpay Webhook Handler
 * CRITICAL for production - ensures payment status updates even if user closes browser
 * Handles: payment.captured, payment.failed, order.paid events
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { updatePaymentStatusByRazorpayId } from '@/lib/firebase/orders'
import { updatePaymentStatusByRazorpayId as updatePaymentLogByRazorpayId } from '@/lib/firebase/payments'
import * as Sentry from '@sentry/nextjs'

interface WebhookPayment {
  id: string
  order_id: string
  status: 'captured' | 'failed' | 'authorized'
  amount: number
  currency: string
  method: string
  captured_at?: number
  created_at: number
  error_code?: string
  error_description?: string
}

interface WebhookOrder {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'attempted' | 'created'
}

interface WebhookEvent {
  event: string
  account_id: string
  entity: string
  contains: string[]
  payload: {
    payment?: {
      entity: WebhookPayment
    }
    order?: {
      entity: WebhookOrder
    }
  }
  created_at: number
}

// Store processed webhook IDs to prevent duplicate processing (simple in-memory store)
// In production, consider using Redis or database for persistence across deployments
const processedWebhooks = new Set<string>()

export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Get request body and signature
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')
    
    if (!signature) {
      console.error('Missing webhook signature')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      Sentry.captureMessage('Invalid Razorpay webhook signature', 'warning')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Parse webhook payload
    const webhookData: WebhookEvent = JSON.parse(body)
    
    // Create unique webhook ID for idempotency
    const webhookId = `${webhookData.event}_${webhookData.created_at}_${webhookData.payload.payment?.entity.id || webhookData.payload.order?.entity.id}`
    
    // Check if already processed (idempotency)
    if (processedWebhooks.has(webhookId)) {
      console.log(`Webhook ${webhookId} already processed, skipping`)
      return NextResponse.json({ status: 'already_processed' }, { status: 200 })
    }

    console.log(`Processing webhook: ${webhookData.event}`)

    let updateResult = null

    // Handle different webhook events
    switch (webhookData.event) {
      case 'payment.captured':
        {
          const payment = webhookData.payload.payment?.entity
          if (payment) {
            console.log(`Payment captured: ${payment.id} for order: ${payment.order_id}`)
            
            // Update order payment status
            updateResult = await updatePaymentStatusByRazorpayId(payment.order_id, {
              razorpayPaymentId: payment.id,
              paymentStatus: 'paid',
              paymentMethod: payment.method
            })

            // Update payment log
            await updatePaymentLogByRazorpayId(payment.order_id, 'success', {
              razorpayPaymentId: payment.id
            })

            // Track successful payment in Sentry
            Sentry.addBreadcrumb({
              message: 'Payment captured via webhook',
              category: 'payment',
              data: {
                payment_id: payment.id,
                order_id: payment.order_id,
                amount: payment.amount
              }
            })
          }
        }
        break

      case 'payment.failed':
        {
          const payment = webhookData.payload.payment?.entity
          if (payment) {
            console.log(`Payment failed: ${payment.id} for order: ${payment.order_id}`)
            
            // Update order payment status
            updateResult = await updatePaymentStatusByRazorpayId(payment.order_id, {
              razorpayPaymentId: payment.id,
              paymentStatus: 'failed'
            })

            // Update payment log
            await updatePaymentLogByRazorpayId(payment.order_id, 'failed', {
              razorpayPaymentId: payment.id,
              errorDetails: {
                errorCode: payment.error_code || 'unknown',
                errorDescription: payment.error_description || 'Payment failed',
                failureReason: 'webhook_notification'
              }
            })

            // Track failed payment in Sentry
            Sentry.captureException(new Error(`Payment failed: ${payment.error_description || 'Unknown error'}`), {
              tags: {
                payment_id: payment.id,
                order_id: payment.order_id,
                error_code: payment.error_code
              }
            })
          }
        }
        break

      case 'order.paid':
        {
          const order = webhookData.payload.order?.entity
          if (order) {
            console.log(`Order paid: ${order.id}`)
            
            updateResult = await updatePaymentStatusByRazorpayId(order.id, {
              razorpayPaymentId: order.id,
              paymentStatus: 'paid'
            })

            // Track successful order completion
            Sentry.addBreadcrumb({
              message: 'Order paid via webhook',
              category: 'order',
              data: {
                order_id: order.id,
                amount: order.amount
              }
            })
          }
        }
        break

      case 'payment.authorized':
        {
          const payment = webhookData.payload.payment?.entity
          if (payment) {
            console.log(`Payment authorized: ${payment.id} for order: ${payment.order_id}`)
            
            updateResult = await updatePaymentStatusByRazorpayId(payment.order_id, {
              razorpayPaymentId: payment.id,
              paymentStatus: 'pending',
              paymentMethod: payment.method
            })
          }
        }
        break

      default:
        console.log(`Unhandled webhook event: ${webhookData.event}`)
        return NextResponse.json({ status: 'unhandled_event', event: webhookData.event }, { status: 200 })
    }

    // Mark webhook as processed
    processedWebhooks.add(webhookId)

    // Clean up old webhook IDs (keep only last 1000 to prevent memory leaks)
    if (processedWebhooks.size > 1000) {
      const webhookArray = Array.from(processedWebhooks)
      processedWebhooks.clear()
      // Keep last 500
      webhookArray.slice(-500).forEach(id => processedWebhooks.add(id))
    }

    console.log(`Webhook processed successfully: ${webhookData.event}`)
    
    return NextResponse.json({ 
      status: 'success', 
      event: webhookData.event,
      processed_at: new Date().toISOString(),
      update_result: updateResult
    }, { status: 200 })

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    // Capture error in Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'webhook',
        service: 'razorpay'
      }
    })

    return NextResponse.json({ 
      error: 'Webhook processing failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Handle GET requests for webhook URL verification
export async function GET() {
  return NextResponse.json({ 
    status: 'Razorpay webhook endpoint active',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  }, { status: 200 })
}
