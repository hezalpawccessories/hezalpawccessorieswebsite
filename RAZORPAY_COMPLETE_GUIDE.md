# 🚀 Complete Razorpay Integration Guide for Beginners

**A Simple, Step-by-Step Guide to Integrate Razorpay Payment Gateway**

This guide will help you understand how Razorpay is implemented in this website and how you can set it up from scratch.

---

## 📚 Table of Contents

1. [What is Razorpay?](#what-is-razorpay)
2. [How Payment Flow Works](#how-payment-flow-works)
3. [Pre-Requirements](#pre-requirements)
4. [Step 1: Get Razorpay Account & Keys](#step-1-get-razorpay-account--keys)
5. [Step 2: Install Dependencies](#step-2-install-dependencies)
6. [Step 3: Configure Environment Variables](#step-3-configure-environment-variables)
7. [Step 4: Understanding the Code Structure](#step-4-understanding-the-code-structure)
8. [Step 5: Backend API Routes](#step-5-backend-api-routes)
9. [Step 6: Frontend Integration](#step-6-frontend-integration)
10. [Step 7: Webhooks (Important!)](#step-7-webhooks-important)
11. [Step 8: Testing Your Integration](#step-8-testing-your-integration)
12. [Step 9: Going Live (Production)](#step-9-going-live-production)
13. [Common Issues & Solutions](#common-issues--solutions)
14. [Security Best Practices](#security-best-practices)
15. [What to Change for Your Website](#what-to-change-for-your-website)

---

## 🤔 What is Razorpay?

**Razorpay** is a payment gateway that allows you to accept online payments in India. Think of it like a digital cash register that:
- Accepts credit/debit cards, UPI, net banking, wallets
- Handles the complex security stuff
- Transfers money to your bank account
- Provides payment tracking and reports

**Why use Razorpay?**
- ✅ Easy to integrate
- ✅ Supports all major payment methods in India
- ✅ Secure and PCI compliant
- ✅ Good documentation and support
- ✅ No setup fees (only transaction fees)

---

## 🔄 How Payment Flow Works

Here's what happens when a customer makes a payment:

```
Customer Side:
1. User adds items to cart
2. Clicks "Proceed to Checkout"
3. Fills in delivery details
4. Clicks "Place Order"
5. Razorpay payment popup opens
6. User completes payment (UPI/Card/etc)
7. Gets confirmation and order details

Behind the Scenes:
1. Your website creates an order with Razorpay
2. Razorpay returns an order ID
3. Order is saved to Firebase database
4. Razorpay payment window opens
5. User makes payment
6. Razorpay sends payment response
7. Your website verifies the payment
8. Order status is updated to "Paid"
9. Razorpay sends webhook confirmation
10. Email/SMS confirmation sent to customer
```

---

## 📋 Pre-Requirements

Before starting, make sure you have:

1. **A Next.js Project** (you already have this ✓)
2. **Node.js installed** (v18 or higher)
3. **A Razorpay Account** (free to create)
4. **Firebase Account** (for storing orders)
5. **Basic understanding of:**
   - JavaScript/TypeScript
   - React
   - API routes
   - Environment variables

---

## 📝 Step 1: Get Razorpay Account & Keys

### 1.1 Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up" button
3. Fill in your details:
   - Business name
   - Email address
   - Phone number
4. Verify your email and phone
5. Complete KYC (business verification) - **Required for live mode**

### 1.2 Get API Keys

**For Testing (Test Mode):**

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Make sure you're in **Test Mode** (see toggle at top)
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Keys**
5. You'll get two keys:
   - **Key ID** (starts with `rzp_test_`) - This is PUBLIC, can be shown in frontend
   - **Key Secret** - This is PRIVATE, NEVER share or show this

**For Production (Live Mode):**

1. Complete KYC verification (submit business documents)
2. Wait for approval (1-3 business days)
3. Switch to **Live Mode** toggle
4. Go to **Settings** → **API Keys**
5. Click **Generate Live Keys**
6. You'll get:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

### 1.3 Webhook Secret (Important!)

1. Go to **Settings** → **Webhooks**
2. Click **Create Webhook**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
4. Select events to track:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
   - ✅ payment.authorized
5. Click **Create Webhook**
6. Copy the **Webhook Secret** (starts with `whsec_`)

---

## 🔧 Step 2: Install Dependencies

Open your terminal and run:

```bash
npm install razorpay
```

This installs the Razorpay SDK which helps you:
- Create payment orders
- Verify payment signatures
- Interact with Razorpay API

**Already installed in this project!** ✓ (check `package.json`)

---

## 🔐 Step 3: Configure Environment Variables

### 3.1 Create `.env.local` file

In your project root folder, create a file named `.env.local`:

```env
# Razorpay Configuration
# Public key (safe to expose to frontend)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE

# Secret key (NEVER expose to frontend)
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE

# Webhook Secret (for verifying webhook calls)
RAZORPAY_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

### 3.2 Replace with Your Keys

Replace the placeholder values:
- `rzp_test_YOUR_KEY_ID_HERE` → Your actual Key ID from Razorpay dashboard
- `YOUR_SECRET_KEY_HERE` → Your actual Key Secret
- `whsec_YOUR_WEBHOOK_SECRET_HERE` → Your webhook secret

### 3.3 Important Notes About Environment Variables

**NEXT_PUBLIC_ prefix:**
- Variables with `NEXT_PUBLIC_` are accessible in browser (frontend)
- Use for: Key ID (it's okay if users see this)

**No prefix:**
- Variables without prefix are server-side ONLY
- Use for: Secret keys (never let users see this)

**Security Rule:**
```
✅ NEXT_PUBLIC_RAZORPAY_KEY_ID = OK to show in frontend
❌ RAZORPAY_KEY_SECRET = NEVER show in frontend
❌ RAZORPAY_WEBHOOK_SECRET = NEVER show in frontend
```

### 3.4 Add to `.gitignore`

Make sure `.env.local` is in your `.gitignore` file:

```
# .gitignore
.env.local
.env*.local
```

This prevents accidentally uploading secrets to GitHub.

---

## 📂 Step 4: Understanding the Code Structure

This website uses a well-organized structure for Razorpay integration:

```
your-project/
│
├── app/
│   └── api/
│       ├── payment/
│       │   ├── create-order/
│       │   │   └── route.ts          # Creates Razorpay order
│       │   └── verify/
│       │       └── route.ts          # Verifies payment signature
│       └── webhooks/
│           └── razorpay/
│               └── route.ts          # Handles webhook events
│
├── hooks/
│   └── useRazorpay.ts                # Custom React hook for payments
│
├── lib/
│   ├── razorpay-config.ts            # Configuration & types
│   └── firebase/
│       ├── orders.ts                 # Order management
│       └── payments.ts               # Payment logging
│
├── .env.local                        # Your secret keys (DON'T COMMIT!)
└── package.json                      # Dependencies
```

### Key Files Explained:

1. **`create-order/route.ts`** - Creates a payment order when user clicks "Place Order"
2. **`verify/route.ts`** - Checks if payment is real and not tampered with
3. **`webhooks/razorpay/route.ts`** - Receives updates from Razorpay (even if user closes browser)
4. **`useRazorpay.ts`** - React hook that makes frontend integration easy
5. **`razorpay-config.ts`** - Configuration like company name, logo, colors

---

## 🔌 Step 5: Backend API Routes

### 5.1 Create Order API (`/api/payment/create-order`)

**What it does:**
- Creates a payment order with Razorpay
- Saves order details to Firebase
- Returns order ID to frontend

**Location:** `app/api/payment/create-order/route.ts`

**Key Code Explained:**

```typescript
// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Create order
const order = await razorpay.orders.create({
  amount: amount * 100,  // Convert rupees to paise (₹100 = 10000 paise)
  currency: 'INR',       // Indian Rupees
  receipt: `order_${Date.now()}`, // Unique order ID
})
```

**Why multiply by 100?**
Razorpay works in the smallest currency unit (paise for INR). So ₹100 = 10,000 paise.

**How to use:**
```javascript
// Frontend sends POST request
const response = await fetch('/api/payment/create-order', {
  method: 'POST',
  body: JSON.stringify({
    amount: 1500,              // ₹1500
    customerDetails: { ... },  // Customer info
    cartItems: [ ... ]         // What they're buying
  })
})
```

### 5.2 Verify Payment API (`/api/payment/verify`)

**What it does:**
- Verifies that payment signature is genuine
- Updates order status to "paid" in database
- Prevents fraud/tampering

**Location:** `app/api/payment/verify/route.ts`

**Key Code Explained:**

```typescript
// Create signature from order ID and payment ID
const body_string = razorpay_order_id + '|' + razorpay_payment_id

// Generate expected signature using your secret key
const expected_signature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
  .update(body_string)
  .digest('hex')

// Compare with signature from Razorpay
const is_authentic = expected_signature === razorpay_signature
```

**Why is this important?**
Anyone could fake a "payment successful" message. This verification ensures the payment actually came from Razorpay and wasn't tampered with.

### 5.3 Webhook Handler (`/api/webhooks/razorpay`)

**What it does:**
- Receives payment updates from Razorpay servers
- Updates order status even if user closed the browser
- Handles edge cases (payment captured after delay, failures, etc.)

**Location:** `app/api/webhooks/razorpay/route.ts`

**Key Events Handled:**

1. **`payment.captured`** - Payment successful, money received
2. **`payment.failed`** - Payment attempt failed
3. **`order.paid`** - Order marked as paid
4. **`payment.authorized`** - Payment authorized but not captured yet

**Important Security:**

```typescript
// Verify webhook signature
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex')

if (signature !== expectedSignature) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
}
```

This prevents fake webhook calls from hackers.

---

## 💻 Step 6: Frontend Integration

### 6.1 Load Razorpay Script

Add Razorpay checkout script to your page:

```tsx
// In your cart/checkout page
<Script 
  src="https://checkout.razorpay.com/v1/checkout.js" 
  strategy="lazyOnload"
/>
```

This loads Razorpay's payment popup library.

### 6.2 Use the Custom Hook

**Location:** `hooks/useRazorpay.ts`

This hook makes integration super easy:

```typescript
const { initiatePayment, loading } = useRazorpay({
  onSuccess: (data) => {
    // Payment successful! Redirect to thank you page
    console.log('Payment successful!', data)
  },
  onFailure: (error) => {
    // Payment failed, show error
    console.error('Payment failed', error)
  }
})
```

### 6.3 Trigger Payment

When user clicks "Place Order":

```typescript
const handlePlaceOrder = async () => {
  await initiatePayment(
    totalAmount,          // Amount in rupees
    customerDetails,      // Name, email, phone, address
    cartItems            // Products being purchased
  )
}
```

### 6.4 Payment Flow in Detail

1. **User clicks "Place Order"**
   ```typescript
   handlePlaceOrder() called
   ```

2. **Create order on your server**
   ```typescript
   fetch('/api/payment/create-order', { ... })
   ```

3. **Open Razorpay checkout**
   ```typescript
   const razorpay = new window.Razorpay({
     key: 'rzp_test_...',
     amount: 150000,  // ₹1500 in paise
     order_id: 'order_xxx',
     handler: async (response) => {
       // Payment successful, verify it
     }
   })
   razorpay.open()
   ```

4. **User completes payment**
   - Chooses payment method (UPI/Card/etc.)
   - Enters details
   - Confirms payment

5. **Razorpay calls handler with response**
   ```typescript
   {
     razorpay_order_id: 'order_xxx',
     razorpay_payment_id: 'pay_yyy',
     razorpay_signature: 'abc123...'
   }
   ```

6. **Verify payment on server**
   ```typescript
   fetch('/api/payment/verify', {
     body: JSON.stringify(response)
   })
   ```

7. **Show success message**
   - Clear cart
   - Redirect to thank you page
   - Send confirmation email

---

## 🔔 Step 7: Webhooks (Important!)

### 7.1 Why Webhooks?

**Problem:** What if user closes browser after payment?
**Solution:** Webhooks! Razorpay sends payment updates directly to your server.

**Example scenarios webhooks handle:**
- User pays but closes browser immediately
- Payment takes time to process (net banking)
- Payment fails after initial authorization
- User's internet disconnects

### 7.2 Setup Webhook URL

1. **Deploy your website first** (webhooks need a public URL)
2. Go to Razorpay Dashboard → Settings → Webhooks
3. Click "Create Webhook"
4. Enter URL: `https://yourdomain.com/api/webhooks/razorpay`
5. Select events:
   - ✅ payment.captured
   - ✅ payment.failed
   - ✅ order.paid
6. Save and copy the **Webhook Secret**

### 7.3 Test Webhooks Locally

**Problem:** Webhooks need a public URL, but you're developing locally (localhost)

**Solution:** Use ngrok or similar tools

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Run your Next.js app:
   ```bash
   npm run dev
   ```

3. In another terminal, start ngrok:
   ```bash
   ngrok http 3000
   ```

4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. In Razorpay dashboard, set webhook URL to: `https://abc123.ngrok.io/api/webhooks/razorpay`
6. Test payments - webhook events will reach your local server!

### 7.4 Webhook Security

Always verify webhook signature:

```typescript
const signature = request.headers.get('x-razorpay-signature')
const expectedSignature = crypto
  .createHmac('sha256', webhookSecret)
  .update(body)
  .digest('hex')

if (signature !== expectedSignature) {
  // REJECT - this is a fake webhook call
}
```

---

## 🧪 Step 8: Testing Your Integration

### 8.1 Test Mode Payments

Razorpay provides test cards and UPI IDs:

**Test Cards (Success):**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
Name: Any name
```

**Test Cards (Failure):**
```
Card Number: 4111 1111 1111 1112
This will fail the payment
```

**Test UPI:**
```
UPI ID: success@razorpay
Status: Will succeed

UPI ID: failure@razorpay
Status: Will fail
```

### 8.2 Testing Checklist

Test these scenarios:

- [ ] **Successful Payment**
  - Add items to cart
  - Checkout with test card
  - Verify order created in Firebase
  - Check payment log updated
  - Confirm webhook received

- [ ] **Failed Payment**
  - Try with failure test card
  - Verify order marked as failed
  - Check error logged properly

- [ ] **User Closes Browser**
  - Start payment
  - Close browser before completing
  - Check if webhook updates order status

- [ ] **Multiple Items in Cart**
  - Add 3-4 different products
  - Verify all items saved in order

- [ ] **Different Payment Methods**
  - Test with Card
  - Test with UPI
  - Test with Net Banking
  - Verify payment method saved

### 8.3 Check Razorpay Dashboard

After each test:
1. Go to Razorpay Dashboard → Payments
2. Check if payment appears
3. Verify amount is correct
4. Check status (Success/Failed)
5. View webhook logs

### 8.4 Check Firebase Database

1. Open Firebase Console
2. Go to Firestore Database
3. Check `orders` collection - verify order details
4. Check `payments` collection - verify payment log
5. Confirm all data is accurate

---

## 🚀 Step 9: Going Live (Production)

### 9.1 Complete KYC

Before going live, complete Razorpay KYC:

1. Go to Dashboard → Settings → Account
2. Upload required documents:
   - Business PAN card
   - Business registration certificate
   - Bank account details
   - Address proof
   - Identity proof
3. Wait for verification (1-3 days)

### 9.2 Get Live API Keys

1. Once KYC approved
2. Switch to **Live Mode** in dashboard
3. Go to Settings → API Keys
4. Generate Live Keys
5. Generate Live Webhook Secret

### 9.3 Update Production Environment Variables

In your production environment (Vercel/AWS/etc.):

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_LIVE_WEBHOOK_SECRET
```

**For Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add the above variables
3. Redeploy your site

### 9.4 Update Webhook URL

1. Go to Razorpay Dashboard (Live Mode)
2. Settings → Webhooks
3. Create new webhook with your production URL
4. `https://yourdomain.com/api/webhooks/razorpay`

### 9.5 Production Checklist

Before launching:

- [ ] KYC completed and approved
- [ ] Live API keys generated
- [ ] Environment variables updated in production
- [ ] Webhook URL configured with production domain
- [ ] SSL certificate installed (HTTPS)
- [ ] Test real payment with small amount
- [ ] Verify order creation in production database
- [ ] Check webhook delivery in production
- [ ] Test payment success email/SMS
- [ ] Test payment failure handling
- [ ] Monitor error logs

### 9.6 First Real Payment Test

1. Create a test order with small amount (₹1)
2. Complete real payment from your own account
3. Verify entire flow works:
   - Order created ✓
   - Payment captured ✓
   - Webhook received ✓
   - Database updated ✓
   - Email sent ✓
4. Refund the test payment from dashboard

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Razorpay is not defined"

**Error:**
```
ReferenceError: Razorpay is not defined
```

**Solution:**
Add Razorpay script to your page:
```tsx
<Script src="https://checkout.razorpay.com/v1/checkout.js" />
```

---

### Issue 2: "Payment verification failed"

**Error:**
```
Payment verification failed - Invalid signature
```

**Possible causes:**
1. Wrong `RAZORPAY_KEY_SECRET` in `.env.local`
2. Using test secret with live keys (or vice versa)
3. Signature tampering

**Solution:**
1. Check `.env.local` has correct secret key
2. Verify you're using matching test/live keys
3. Restart your development server after changing env variables

---

### Issue 3: Webhook not receiving events

**Error:**
Payments work but webhooks never trigger

**Solution:**
1. Check webhook URL is correct and public (not localhost)
2. Verify webhook secret is correct
3. Check Razorpay Dashboard → Webhooks → Logs for delivery errors
4. Ensure your server is responding with 200 status
5. Check SSL certificate is valid (webhooks require HTTPS)

---

### Issue 4: "Amount mismatch"

**Error:**
Razorpay shows different amount than expected

**Cause:**
Forgot to multiply by 100 (convert to paise)

**Solution:**
```typescript
// ❌ Wrong
amount: 1500  // Razorpay will treat this as ₹15 (1500 paise)

// ✅ Correct
amount: 1500 * 100  // ₹1500 (150000 paise)
```

---

### Issue 5: Environment variables not working

**Error:**
```
process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID is undefined
```

**Solution:**
1. Restart development server after adding `.env.local`
2. Check file name is exactly `.env.local` (not `.env.local.txt`)
3. Verify variables have `NEXT_PUBLIC_` prefix for client-side use
4. Check no extra spaces around `=` sign:
   ```env
   # ❌ Wrong
   NEXT_PUBLIC_RAZORPAY_KEY_ID = rzp_test_xxx
   
   # ✅ Correct
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
   ```

---

### Issue 6: CORS errors

**Error:**
```
Access to fetch blocked by CORS policy
```

**Solution:**
This usually means you're calling Razorpay API directly from frontend. Don't do that!

```typescript
// ❌ Wrong - calling from frontend
const order = await razorpay.orders.create({ ... })

// ✅ Correct - call your API route
const response = await fetch('/api/payment/create-order', { ... })
```

---

### Issue 7: Firebase permission denied

**Error:**
```
FirebaseError: Missing or insufficient permissions
```

**Solution:**
Check Firebase security rules. For testing:
```javascript
// Firestore Rules (Firebase Console)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow read, write: if true;  // Only for testing!
    }
  }
}
```

**For production:** Add proper authentication rules!

---

## 🔒 Security Best Practices

### 1. Environment Variables

```env
# ✅ DO
RAZORPAY_KEY_SECRET=your_secret_here  # Server-side only

# ❌ DON'T
NEXT_PUBLIC_RAZORPAY_KEY_SECRET=...  # NEVER make secret public!
```

### 2. Always Verify Payment Server-Side

```typescript
// ✅ DO - Verify on server
// api/payment/verify/route.ts
const is_authentic = verifySignature(...)

// ❌ DON'T - Trust frontend data
// Frontend can be manipulated!
```

### 3. Use HTTPS in Production

```
✅ https://yourdomain.com
❌ http://yourdomain.com  // Insecure!
```

### 4. Validate Webhook Signatures

```typescript
// ✅ Always verify webhook signature
if (signature !== expectedSignature) {
  return 400 // Reject fake webhooks
}
```

### 5. Store Sensitive Data Securely

```typescript
// ✅ DO - Hash/encrypt sensitive data
// ❌ DON'T - Store credit card details (against PCI compliance)
```

### 6. Rate Limiting

Implement rate limiting on payment APIs:

```typescript
// Prevent spam payment creation
// Use libraries like 'express-rate-limit'
```

### 7. Log Everything

```typescript
// Log all payment attempts for debugging
console.log('Payment initiated:', orderId)
console.log('Payment verified:', paymentId)
console.log('Webhook received:', event)
```

### 8. Handle Errors Gracefully

```typescript
try {
  // Payment logic
} catch (error) {
  console.error('Payment error:', error)
  // Log to monitoring service (Sentry, etc.)
  // Show user-friendly error message
  return { error: 'Payment failed. Please try again.' }
}
```

---

## 🔧 What to Change for Your Website

If you're copying this code for your own website, here's what to modify:

### 1. Update Razorpay Config

**File:** `lib/razorpay-config.ts`

```typescript
export const RAZORPAY_CONFIG = {
  currency: 'INR',
  company_name: 'Your Company Name',        // ← Change this
  description: 'Your product description',  // ← Change this
  image: '/your-logo.png',                  // ← Change this
  theme: {
    color: '#ec4899',                       // ← Change to your brand color
  },
}
```

### 2. Update Firebase Configuration

**File:** `integrations/firebase/firebaseconfig.ts`

Replace with your Firebase project credentials:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",              // ← Change
  authDomain: "your-domain",           // ← Change
  projectId: "your-project-id",        // ← Change
  storageBucket: "your-bucket",        // ← Change
  messagingSenderId: "your-id",        // ← Change
  appId: "your-app-id"                 // ← Change
}
```

### 3. Customize Email Notifications

Add email sending after successful payment:

```typescript
// In api/payment/verify/route.ts
if (is_authentic) {
  // Send email to customer
  await sendOrderConfirmationEmail({
    to: customerDetails.email,
    orderId: razorpay_order_id,
    amount: amount,
    items: cartItems
  })
}
```

### 4. Customize Order ID Format

**File:** `app/api/payment/create-order/route.ts`

```typescript
// Current format: ORD_1699999999_ABC123
const orderNumber = `ORD_${Date.now()}_${Math.random()...}`

// Change to your format:
const orderNumber = `YOURCOMPANY_${Date.now()}`
// or
const orderNumber = `INV-${new Date().getFullYear()}-${incrementalId}`
```

### 5. Modify Cart Structure

If your products have different fields:

**File:** `lib/razorpay-config.ts`

```typescript
export interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  size: string        // Remove if not applicable
  image: string
  
  // Add your custom fields:
  color?: string      // Example: product color
  variant?: string    // Example: product variant
  sku?: string        // Example: SKU code
}
```

### 6. Add Tax/Shipping Calculations

**File:** `app/cart/page.tsx`

```typescript
const calculateTotal = () => {
  const subtotal = cartItems.reduce(...)
  const tax = subtotal * 0.18        // 18% GST
  const shipping = subtotal > 500 ? 0 : 50  // Free shipping above ₹500
  return subtotal + tax + shipping
}
```

### 7. Customize Success Page

**File:** `app/thank-you/page.tsx`

Modify the order confirmation page with your branding, add:
- Estimated delivery date
- Download invoice button
- Track order button
- Contact support information

### 8. Add Refund Functionality

Create new API route for refunds:

```typescript
// app/api/payment/refund/route.ts
import Razorpay from 'razorpay'

export async function POST(request) {
  const { paymentId, amount } = await request.json()
  
  const refund = await razorpay.payments.refund(paymentId, {
    amount: amount * 100  // Partial or full refund
  })
  
  return NextResponse.json({ success: true, refund })
}
```

### 9. Update Currency (if not INR)

If you're not in India:

```typescript
// lib/razorpay-config.ts
export const RAZORPAY_CONFIG = {
  currency: 'USD',  // or 'EUR', 'GBP', etc.
  // Note: Check Razorpay supported currencies
}
```

### 10. Modify Payment Methods

Restrict payment methods if needed:

```typescript
// hooks/useRazorpay.ts
const options = {
  // ... other options
  config: {
    display: {
      blocks: {
        banks: {
          name: 'Pay via Bank',
          instruments: [
            { method: 'upi' },
            { method: 'netbanking' },
          ],
        },
      },
      sequence: ['block.banks'],
      preferences: {
        show_default_blocks: false,  // Hide cards, wallets
      },
    },
  },
}
```

---

## 📊 Monitoring & Analytics

### 1. Razorpay Dashboard

Monitor daily:
- Total payments
- Success rate
- Failed payments
- Settlement status
- Customer disputes

### 2. Firebase Analytics

Track in Firebase:
- Order creation rate
- Average order value
- Payment completion rate
- Drop-off points

### 3. Error Tracking

Implement error monitoring:

```typescript
// Use Sentry or similar service
import * as Sentry from '@sentry/nextjs'

try {
  // Payment code
} catch (error) {
  Sentry.captureException(error, {
    tags: { component: 'payment' }
  })
}
```

### 4. Custom Metrics

Track important metrics:

```typescript
// Track conversion rate
const conversionRate = (successfulPayments / totalAttempts) * 100

// Track average order value
const avgOrderValue = totalRevenue / successfulOrders

// Track payment method preferences
const upiPercentage = (upiPayments / totalPayments) * 100
```

---

## 🎓 Learning Resources

### Official Documentation
- [Razorpay Docs](https://razorpay.com/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)

### Video Tutorials
- Search "Razorpay integration Next.js" on YouTube
- Razorpay official YouTube channel

### Community Support
- [Razorpay Support](https://razorpay.com/support/)
- Stack Overflow (tag: razorpay)
- Razorpay Discord community

---

## 🆘 Need Help?

### Razorpay Support

- Email: support@razorpay.com
- Phone: +91 8069-1111-44
- Dashboard → Support → Create Ticket

### This Codebase

Check these files if something breaks:

1. **Payment not creating?** → `app/api/payment/create-order/route.ts`
2. **Verification failing?** → `app/api/payment/verify/route.ts`
3. **Webhooks not working?** → `app/api/webhooks/razorpay/route.ts`
4. **Frontend issues?** → `hooks/useRazorpay.ts`
5. **Database not updating?** → `lib/firebase/orders.ts` or `lib/firebase/payments.ts`

### Common Debug Steps

1. **Check logs:**
   ```bash
   # In terminal running Next.js
   # Look for console.log messages
   ```

2. **Check Razorpay Dashboard:**
   - Payments tab - see if payment created
   - Webhooks tab - check delivery status

3. **Check Firebase Console:**
   - Firestore - verify data is being saved
   - Rules - ensure permissions are correct

4. **Check Network tab in browser:**
   - Open DevTools (F12)
   - Network tab
   - Look for failed requests (red)

5. **Verify environment variables:**
   ```bash
   # Restart server after changing .env.local
   npm run dev
   ```

---

## 🎉 Conclusion

You now have a complete understanding of Razorpay integration! 

**Key Takeaways:**

✅ Always verify payments server-side  
✅ Use webhooks for reliable order updates  
✅ Test thoroughly before going live  
✅ Never expose secret keys  
✅ Monitor payments regularly  
✅ Keep security as top priority  

**Next Steps:**

1. Set up test mode and play around
2. Implement in your project
3. Test all scenarios
4. Complete KYC for live mode
5. Deploy and monitor
6. Iterate based on customer feedback

Good luck with your payment integration! 🚀

---

**Last Updated:** November 18, 2025  
**Version:** 1.0  
**Author:** Complete Razorpay Integration Guide
