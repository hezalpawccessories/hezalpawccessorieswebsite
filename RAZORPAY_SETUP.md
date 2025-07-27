# Razorpay Payment Integration

This project includes a complete Razorpay payment integration for the pet accessories store.

## Setup Instructions

### 1. Get Razorpay API Keys

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings → API Keys
3. Generate Test/Live API Keys
4. Copy the Key ID and Key Secret

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Replace the demo values with your actual Razorpay keys:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_secret_key
```

### 3. Payment Flow

The payment integration includes:

1. **Cart Management**: Add/remove items with size selection
2. **Checkout Form**: Customer details validation
3. **Razorpay Payment**: Secure payment processing
4. **Order Confirmation**: Success/failure handling
5. **Order Storage**: Local storage (can be extended to database)

### 4. Features Implemented

- ✅ Cart functionality with quantity management
- ✅ Checkout form with validation
- ✅ Razorpay payment gateway integration
- ✅ Payment success/failure handling
- ✅ Order confirmation modal
- ✅ Responsive design
- ✅ Loading states and error handling
- ✅ Toast notifications

### 5. API Endpoints

- `POST /api/payment/create` - Creates payment order
- `POST /api/payment/verify` - Verifies payment signature

### 6. Test the Integration

1. Add items to cart
2. Go to cart page
3. Click "Proceed to Checkout"
4. Fill in customer details
5. Click "Place Order"
6. Complete payment on Razorpay checkout
7. See success confirmation

### 7. Production Considerations

For production deployment:

1. Use live Razorpay keys
2. Implement proper signature verification
3. Add database integration for orders
4. Set up webhooks for payment status updates
5. Add email notifications
6. Implement proper error logging

### 8. Security Notes

- Never expose your Razorpay secret key to the frontend
- Always verify payment signatures on the server
- Implement proper input validation
- Use HTTPS in production
