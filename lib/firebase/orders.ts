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

// Order interfaces
export interface OrderItem {
  id: string
  title: string
  price: number
  quantity: number
  size: string
  image: string
  category: string
}

export interface CustomerDetails {
  name: string
  email: string
  phone: string
  address: string
  pincode: string
  alternatePhone?: string
}

export interface Order {
  id?: string
  orderId: string // Unique order identifier (e.g., ORD_2024_001)
  customerDetails: CustomerDetails
  items: OrderItem[]
  orderSummary: {
    subtotal: number
    shipping: number
    total: number
  }
  paymentDetails: {
    razorpayOrderId: string
    razorpayPaymentId?: string
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
    paymentMethod?: string
    paymentAmount: number
  }
  orderStatus: 'placed' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  timestamps: {
    createdAt: Timestamp
    updatedAt: Timestamp
    paidAt?: Timestamp
    shippedAt?: Timestamp
    deliveredAt?: Timestamp
  }
  trackingInfo?: {
    trackingNumber?: string
    carrier?: string
    estimatedDelivery?: Timestamp
  }
  notes?: string
}

// Orders collection reference
const ordersCollection = collection(db, 'orders')

// Create a new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'timestamps'>) => {
  try {
    // Generate unique order ID
    const orderNumber = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    const order: Omit<Order, 'id'> = {
      ...orderData,
      orderId: orderNumber,
      timestamps: {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    }

    const docRef = await addDoc(ordersCollection, order)
    console.log('Order created with ID:', docRef.id)
    
    return {
      success: true,
      orderId: docRef.id,
      orderNumber: orderNumber,
      data: { ...order, id: docRef.id }
    }
  } catch (error) {
    console.error('Error creating order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: Order['orderStatus'],
  additionalData?: Partial<Order>
) => {
  try {
    const orderRef = doc(ordersCollection, orderId)
    
    const updateData: any = {
      orderStatus: status,
      'timestamps.updatedAt': Timestamp.now(),
      ...additionalData
    }

    // Add specific timestamps based on status
    if (status === 'shipped') {
      updateData['timestamps.shippedAt'] = Timestamp.now()
    } else if (status === 'delivered') {
      updateData['timestamps.deliveredAt'] = Timestamp.now()
    }

    await updateDoc(orderRef, updateData)
    
    console.log('Order status updated:', orderId, status)
    return { success: true }
  } catch (error) {
    console.error('Error updating order status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Update payment status
export const updatePaymentStatus = async (
  orderId: string,
  paymentData: {
    razorpayPaymentId: string
    paymentStatus: Order['paymentDetails']['paymentStatus']
    paymentMethod?: string
  }
) => {
  try {
    const orderRef = doc(ordersCollection, orderId)
    
    const updateData: any = {
      'paymentDetails.razorpayPaymentId': paymentData.razorpayPaymentId,
      'paymentDetails.paymentStatus': paymentData.paymentStatus,
      'timestamps.updatedAt': Timestamp.now()
    }

    if (paymentData.paymentMethod) {
      updateData['paymentDetails.paymentMethod'] = paymentData.paymentMethod
    }

    if (paymentData.paymentStatus === 'paid') {
      updateData['timestamps.paidAt'] = Timestamp.now()
    }

    await updateDoc(orderRef, updateData)
    
    console.log('Payment status updated:', orderId, paymentData.paymentStatus)
    return { success: true }
  } catch (error) {
    console.error('Error updating payment status:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get all orders (for admin)
export const getOrders = async () => {
  try {
    const q = query(ordersCollection, orderBy('timestamps.createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const orders: Order[] = []
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order)
    })
    
    console.log('Retrieved orders:', orders.length)
    return { success: true, orders }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      orders: []
    }
  }
}

// Get order by Razorpay Order ID
export const getOrderByRazorpayId = async (razorpayOrderId: string) => {
  try {
    const q = query(
      ordersCollection, 
      where('paymentDetails.razorpayOrderId', '==', razorpayOrderId),
      limit(1)
    )
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Order not found', order: null }
    }

    const doc = querySnapshot.docs[0]
    const order = { id: doc.id, ...doc.data() } as Order
    
    return { success: true, order }
  } catch (error) {
    console.error('Error fetching order by Razorpay ID:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      order: null
    }
  }
}

// Update payment status by Razorpay Order ID
export const updatePaymentStatusByRazorpayId = async (
  razorpayOrderId: string,
  paymentData: {
    razorpayPaymentId: string
    paymentStatus: Order['paymentDetails']['paymentStatus']
    paymentMethod?: string
  }
) => {
  try {
    // First find the order
    const orderResult = await getOrderByRazorpayId(razorpayOrderId)
    if (!orderResult.success || !orderResult.order) {
      return { success: false, error: 'Order not found' }
    }

    // Update the order
    return await updatePaymentStatus(orderResult.order.id!, paymentData)
  } catch (error) {
    console.error('Error updating payment status by Razorpay ID:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Get orders by customer email
export const getOrdersByCustomer = async (customerEmail: string) => {
  try {
    const q = query(
      ordersCollection,
      where('customerDetails.email', '==', customerEmail),
      orderBy('timestamps.createdAt', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const orders: Order[] = []
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order)
    })
    
    return { success: true, orders }
  } catch (error) {
    console.error('Error fetching customer orders:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      orders: []
    }
  }
}

// Get recent orders (admin function)
export const getRecentOrders = async (limitCount: number = 10) => {
  try {
    const q = query(
      ordersCollection,
      orderBy('timestamps.createdAt', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    const orders: Order[] = []
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order)
    })
    
    return { success: true, orders }
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      orders: []
    }
  }
}

// Add tracking information
export const addTrackingInfo = async (
  orderId: string,
  trackingData: {
    trackingNumber: string
    carrier: string
    estimatedDelivery?: Date
  }
) => {
  try {
    const orderRef = doc(ordersCollection, orderId)
    
    const updateData: any = {
      'trackingInfo.trackingNumber': trackingData.trackingNumber,
      'trackingInfo.carrier': trackingData.carrier,
      orderStatus: 'shipped',
      'timestamps.updatedAt': Timestamp.now(),
      'timestamps.shippedAt': Timestamp.now()
    }

    if (trackingData.estimatedDelivery) {
      updateData['trackingInfo.estimatedDelivery'] = Timestamp.fromDate(trackingData.estimatedDelivery)
    }

    await updateDoc(orderRef, updateData)
    
    console.log('Tracking info added:', orderId, trackingData.trackingNumber)
    return { success: true }
  } catch (error) {
    console.error('Error adding tracking info:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
