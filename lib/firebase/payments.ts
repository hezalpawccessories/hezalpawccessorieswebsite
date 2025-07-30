import { db } from '../../integrations/firebase/firebaseconfig'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  limit,
  Timestamp 
} from 'firebase/firestore'

// Payment interfaces
export interface PaymentLog {
  id?: string
  transactionId: string // Unique transaction identifier
  razorpayOrderId: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  
  // Customer information
  customerDetails: {
    name: string
    email: string
    phone: string
  }
  
  // Payment details
  amount: number
  currency: string
  paymentMethod?: 'card' | 'upi' | 'netbanking' | 'wallet' | 'emi'
  
  // Payment status tracking
  paymentStatus: 'not_initiated' | 'initiated' | 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
  
  // Error tracking
  errorDetails?: {
    errorCode?: string
    errorDescription?: string
    failureReason?: string
    retryAttempt?: number
  }
  
  // Order reference
  orderReference?: {
    orderId: string
    orderNumber: string
    items: Array<{
      id: string
      title: string
      quantity: number
      price: number
    }>
  }
  
  // Timestamps
  timestamps: {
    createdAt: Timestamp
    updatedAt: Timestamp
    initiatedAt?: Timestamp
    completedAt?: Timestamp
    failedAt?: Timestamp
  }
  
  // Additional metadata
  metadata?: {
    userAgent?: string
    ipAddress?: string
    deviceInfo?: string
    browserInfo?: string
  }
  
  // Razorpay response data
  razorpayResponse?: any
  
  // Internal notes
  notes?: string
}

// Payments collection reference
const paymentsCollection = collection(db, 'payments')

// Create a new payment log entry
export const createPaymentLog = async (paymentData: Omit<PaymentLog, 'id' | 'timestamps'>) => {
  try {
    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    
    const paymentLog: Omit<PaymentLog, 'id'> = {
      ...paymentData,
      transactionId,
      timestamps: {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    }

    const docRef = await addDoc(paymentsCollection, paymentLog)
    console.log('Payment log created with ID:', docRef.id)
    
    return {
      success: true,
      paymentLogId: docRef.id,
      transactionId,
      data: { ...paymentLog, id: docRef.id }
    }
  } catch (error) {
    console.error('Error creating payment log:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Update payment status
export const updatePaymentStatus = async (
  paymentLogId: string,
  status: PaymentLog['paymentStatus'],
  additionalData?: {
    razorpayPaymentId?: string
    razorpaySignature?: string
    paymentMethod?: string
    errorDetails?: PaymentLog['errorDetails']
    razorpayResponse?: any
  }
) => {
  try {
    const paymentRef = doc(paymentsCollection, paymentLogId)
    
    const updateData: any = {
      paymentStatus: status,
      'timestamps.updatedAt': Timestamp.now()
    }

    // Add additional data if provided
    if (additionalData?.razorpayPaymentId) {
      updateData.razorpayPaymentId = additionalData.razorpayPaymentId
    }
    
    if (additionalData?.razorpaySignature) {
      updateData.razorpaySignature = additionalData.razorpaySignature
    }
    
    if (additionalData?.paymentMethod) {
      updateData.paymentMethod = additionalData.paymentMethod
    }
    
    if (additionalData?.errorDetails) {
      updateData.errorDetails = additionalData.errorDetails
    }
    
    if (additionalData?.razorpayResponse) {
      updateData.razorpayResponse = additionalData.razorpayResponse
    }

    // Add specific timestamps based on status
    if (status === 'initiated') {
      updateData['timestamps.initiatedAt'] = Timestamp.now()
    } else if (status === 'success') {
      updateData['timestamps.completedAt'] = Timestamp.now()
    } else if (status === 'failed') {
      updateData['timestamps.failedAt'] = Timestamp.now()
    }

    await updateDoc(paymentRef, updateData)
    
    console.log('Payment status updated:', paymentLogId, status)
    return { success: true }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get all payments (for admin)
export const getPayments = async () => {
  try {
    const q = query(paymentsCollection, orderBy('timestamps.createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const payments: PaymentLog[] = []
    querySnapshot.forEach((doc) => {
      payments.push({
        id: doc.id,
        ...doc.data()
      } as PaymentLog)
    })
    
    console.log('Retrieved payments:', payments.length)
    return { success: true, payments }
  } catch (error) {
    console.error('Error fetching payments:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      payments: []
    }
  }
}

// Get payment logs by customer email
export const getPaymentsByCustomer = async (customerEmail: string) => {
  try {
    const q = query(
      paymentsCollection,
      where('customerDetails.email', '==', customerEmail),
      orderBy('timestamps.createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const payments: PaymentLog[] = []
    
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() } as PaymentLog)
    })
    
    return { success: true, payments }
  } catch (error) {
    console.error('Error fetching customer payments:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      payments: []
    }
  }
}

// Get payment logs by status
export const getPaymentsByStatus = async (status: PaymentLog['paymentStatus'], limitCount: number = 50) => {
  try {
    const q = query(
      paymentsCollection,
      where('paymentStatus', '==', status),
      orderBy('timestamps.createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const payments: PaymentLog[] = []
    
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() } as PaymentLog)
    })
    
    return { success: true, payments }
  } catch (error) {
    console.error('Error fetching payments by status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      payments: []
    }
  }
}

// Get failed payments for analysis
export const getFailedPayments = async (limitCount: number = 20) => {
  return getPaymentsByStatus('failed', limitCount)
}

// Get recent payments (admin function)
export const getRecentPayments = async (limitCount: number = 10) => {
  try {
    const q = query(
      paymentsCollection,
      orderBy('timestamps.createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const payments: PaymentLog[] = []
    
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() } as PaymentLog)
    })
    
    return { success: true, payments }
  } catch (error) {
    console.error('Error fetching recent payments:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      payments: []
    }
  }
}

// Add retry attempt to failed payment
export const addRetryAttempt = async (paymentLogId: string, errorDetails?: PaymentLog['errorDetails']) => {
  try {
    const paymentRef = doc(paymentsCollection, paymentLogId)
    
    const updateData: any = {
      'timestamps.updatedAt': Timestamp.now(),
      paymentStatus: 'pending'
    }

    if (errorDetails) {
      updateData.errorDetails = {
        ...errorDetails,
        retryAttempt: (errorDetails.retryAttempt || 0) + 1
      }
    }

    await updateDoc(paymentRef, updateData)
    
    console.log('Retry attempt added:', paymentLogId)
    return { success: true }
  } catch (error) {
    console.error('Error adding retry attempt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get payment analytics
export const getPaymentAnalytics = async (days: number = 30) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const q = query(
      paymentsCollection,
      where('timestamps.createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamps.createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const payments: PaymentLog[] = []
    
    querySnapshot.forEach((doc) => {
      payments.push({ id: doc.id, ...doc.data() } as PaymentLog)
    })
    
    // Calculate analytics
    const analytics = {
      totalPayments: payments.length,
      successfulPayments: payments.filter(p => p.paymentStatus === 'success').length,
      failedPayments: payments.filter(p => p.paymentStatus === 'failed').length,
      pendingPayments: payments.filter(p => p.paymentStatus === 'pending').length,
      totalAmount: payments
        .filter(p => p.paymentStatus === 'success')
        .reduce((sum, p) => sum + p.amount, 0),
      averageAmount: 0,
      successRate: 0,
      failureRate: 0,
      paymentMethods: {} as Record<string, number>
    }
    
    if (analytics.successfulPayments > 0) {
      analytics.averageAmount = analytics.totalAmount / analytics.successfulPayments
    }
    
    if (analytics.totalPayments > 0) {
      analytics.successRate = (analytics.successfulPayments / analytics.totalPayments) * 100
      analytics.failureRate = (analytics.failedPayments / analytics.totalPayments) * 100
    }
    
    // Count payment methods
    payments.forEach(payment => {
      if (payment.paymentMethod) {
        analytics.paymentMethods[payment.paymentMethod] = 
          (analytics.paymentMethods[payment.paymentMethod] || 0) + 1
      }
    })
    
    return { success: true, analytics, payments }
  } catch (error) {
    console.error('Error fetching payment analytics:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      analytics: null,
      payments: []
    }
  }
}
