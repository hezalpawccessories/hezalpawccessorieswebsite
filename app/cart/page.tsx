'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Minus, ShoppingBag, X, CheckCircle, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Product } from '@/lib/products'
import Image from 'next/image'
import { useRazorpay } from '@/hooks/useRazorpay'
import { CheckoutDetails } from '@/lib/razorpay-config'
import { toast } from 'sonner'
import Script from 'next/script'

interface CartItem extends Product {
   quantity: number
   size: string
   customName?: string
}

interface CheckoutForm {
   name: string
   email: string
   phone: string
   address: string
   pincode: string
   alternatePhone: string
}

export default function Cart() {
   const [cartItems, setCartItems] = useState<CartItem[]>([])
   const [showCheckout, setShowCheckout] = useState(false)
   const [orderSuccess, setOrderSuccess] = useState(false)
   const [orderDetails, setOrderDetails] = useState<any>(null)
   const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      alternatePhone: '',
   })

   // Razorpay payment integration
   const { initiatePayment, loading: paymentLoading } = useRazorpay({
      onSuccess: (data) => {
         setOrderDetails(data.orderDetails)
         setOrderSuccess(true)
         setShowCheckout(false)
         // Clear cart after successful payment
         localStorage.removeItem('cart')
         setCartItems([])
         window.dispatchEvent(new Event('cartUpdated'))
         toast.success('Order placed successfully!')
      },
      onFailure: (error: Error) => {
         console.error('Payment failed:', error)
         toast.error('Payment failed. Please try again.')
      },
   })

   useEffect(() => {
      const loadCart = () => {
         if (typeof window !== 'undefined') {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]')
            setCartItems(cart)
         }
      }

      loadCart()
      if (typeof window !== 'undefined') {
         window.addEventListener('cartUpdated', loadCart)
      }

      return () => {
         if (typeof window !== 'undefined') {
            window.removeEventListener('cartUpdated', loadCart)
         }
      }
   }, [])

   const updateQuantity = (id: string, size: string, customName: string | undefined, newQuantity: number) => {
      if (newQuantity <= 0) {
         removeItem(id, size, customName)
         return
      }

      const updatedCart = cartItems.map((item) => 
         (item.id === id && item.size === size && item.customName === customName) 
            ? { ...item, quantity: newQuantity } 
            : item
      )
      setCartItems(updatedCart)
      if (typeof window !== 'undefined') {
         localStorage.setItem('cart', JSON.stringify(updatedCart))
         window.dispatchEvent(new Event('cartUpdated'))
      }
   }

   const removeItem = (id: string, size: string, customName: string | undefined) => {
      const updatedCart = cartItems.filter((item) => 
         !(item.id === id && item.size === size && item.customName === customName)
      )
      setCartItems(updatedCart)
      if (typeof window !== 'undefined') {
         localStorage.setItem('cart', JSON.stringify(updatedCart))
         window.dispatchEvent(new Event('cartUpdated'))
      }
   }

   const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
   const shipping = subtotal > 799 ? 0 : 75
   const total = subtotal + shipping

   const handleCheckout = async (e: React.FormEvent) => {
      e.preventDefault()
      
      // Validate form
      if (!checkoutForm.name || !checkoutForm.email || !checkoutForm.phone || !checkoutForm.address || !checkoutForm.pincode) {
         toast.error('Please fill in all required fields')
         return
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(checkoutForm.email)) {
         toast.error('Please enter a valid email address')
         return
      }

      // Validate phone
      const phoneRegex = /^[0-9]{10}$/
      if (!phoneRegex.test(checkoutForm.phone)) {
         toast.error('Please enter a valid 10-digit phone number')
         return
      }

      // Initiate Razorpay payment
      await initiatePayment(total, checkoutForm, cartItems)
   }

   if (cartItems.length === 0) {
      return (
         <>
            <Navbar />
            <main className='gradient-bg min-h-screen'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                  <div className='text-center'>
                     <ShoppingBag className='w-24 h-24 text-text-light mx-auto mb-6' />
                     <h1 className='text-3xl font-heading font-extrabold text-text-dark mb-4 leading-tight tracking-wide'>Your Cart is Empty</h1>
                     <p className='text-xl font-body text-text-light mb-8'>
                        Looks like you haven&apos;t added any items to your cart yet.
                     </p>
                     <a
                        href='/products'
                        className='btn-primary'
                     >
                        Continue Shopping
                     </a>
                  </div>
               </div>
            </main>
            <Footer />
         </>
      )
   }

   return (
      <>
         {/* Load Razorpay checkout script */}
         <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="lazyOnload"
         />
         <Navbar />
         <main className='gradient-bg min-h-screen'>
            {/* Order Success Modal */}
            <AnimatePresence>
               {orderSuccess && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
                  >
                     <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className='bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center'
                     >
                        <div className='mb-6'>
                           <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
                           <h2 className='text-2xl font-heading font-bold text-text-dark mb-2'>Order Placed Successfully!</h2>
                           <p className='font-body text-text-light'>
                              Your payment has been processed and order has been placed. You will receive a confirmation email shortly.
                           </p>
                        </div>

                        {orderDetails && (
                           <div className='bg-gray-50 rounded-lg p-4 mb-6 text-left'>
                              <h3 className='font-heading font-semibold text-text-dark mb-2'>Order Details:</h3>
                              <p className='text-sm font-body text-text-light mb-1'>
                                 <span className='font-medium'>Order ID:</span> {orderDetails.orderId}
                              </p>
                              <p className='text-sm font-body text-text-light mb-1'>
                                 <span className='font-medium'>Payment ID:</span> {orderDetails.paymentId}
                              </p>
                              <p className='text-sm font-body text-text-light'>
                                 <span className='font-medium'>Amount:</span> ₹{orderDetails.amount}
                              </p>
                           </div>
                        )}

                        <div className='space-y-3'>
                           <button
                              onClick={() => setOrderSuccess(false)}
                              className='btn-primary w-full'
                           >
                              Continue Shopping
                           </button>
                           <button
                              onClick={() => {
                                 setOrderSuccess(false)
                                 window.location.href = '/'
                              }}
                              className='w-full px-4 py-2 font-body text-primary-pink border border-primary-pink rounded-lg hover:bg-primary-pink hover:text-white transition-colors'
                           >
                              Go to Home
                           </button>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className='mb-8'
               >
                  <h1 className='text-4xl md:text-5xl font-heading font-extrabold text-text-dark mb-4 leading-tight tracking-wide'>
                     Shopping <span className='text-primary-pink'>Cart</span>
                  </h1>
                  <p className='text-xl font-body text-text-body'>Review your items and proceed to checkout</p>
               </motion.div>

               <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                  {/* Cart Items */}
                  <div className='lg:col-span-2 space-y-4'>
                     {cartItems.map((item, index) => (
                        <motion.div
                           key={item.id}
                           initial={{ opacity: 0, x: -50 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-white rounded-2xl p-6 shadow-lg'
                        >
                           <div className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6'>
                              <Image
                                 src={item.image}
                                 alt={item.title}
                                 width={96}
                                 height={96}
                                 className='w-24 h-24 object-cover rounded-xl'
                              />

                              <div className='flex-1 text-center md:text-left'>
                                 <h3 className='text-lg font-heading font-bold text-text-dark mb-1'>{item.title}</h3>
                                 <p className='font-body text-text-light text-sm mb-2'>
                                    {item.category} • Size: {item.size}
                                 </p>
                                 {item.customName && (
                                    <p className='font-body text-primary-pink text-sm mb-2 italic'>
                                       Custom Name: &quot;{item.customName}&quot;
                                    </p>
                                 )}
                                 <div className='flex items-center justify-center md:justify-start space-x-2'>
                                    <span className='text-xl font-accent font-bold text-primary-pink'>₹{item.price}</span>
                                    {item.originalPrice === 0 ? '' : (
                                       <>
                                       {item.originalPrice && (
                                       <span className='font-body text-text-light line-through text-sm'>
                                          ₹{item.originalPrice}
                                       </span>
                                    )}
                                       </>
                                    )}
                                    
                                 </div>
                              </div>

                              <div className='flex items-center space-x-4'>
                                 <div className='flex items-center space-x-2'>
                                    <button
                                       onClick={() => updateQuantity(item.id, item.size, item.customName, item.quantity - 1)}
                                       className='quantity-btn'
                                    >
                                       <Minus className='w-4 h-4' />
                                    </button>
                                    <span className='w-8 text-center font-heading font-semibold'>{item.quantity}</span>
                                    <button
                                       onClick={() => updateQuantity(item.id, item.size, item.customName, item.quantity + 1)}
                                       className='quantity-btn'
                                    >
                                       <Plus className='w-4 h-4' />
                                    </button>
                                 </div>

                                 <button
                                    onClick={() => removeItem(item.id, item.size, item.customName)}
                                    className='text-red-500 hover:text-red-700 p-2'
                                 >
                                    <Trash2 className='w-5 h-5' />
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                     ))}
                  </div>

                  {/* Order Summary */}
                  <motion.div
                     initial={{ opacity: 0, x: 50 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className='bg-white rounded-2xl p-6 shadow-lg h-fit'
                  >
                     <h2 className='text-2xl font-heading font-bold text-text-dark mb-6'>Order Summary</h2>

                     <div className='space-y-4 mb-6'>
                        <div className='flex justify-between'>
                           <span className='font-body text-text-light'>Subtotal</span>
                           <span className='font-heading font-semibold'>₹{subtotal}</span>
                        </div>
                        <div className='flex justify-between'>
                           <span className='font-body text-text-light'>Shipping</span>
                           <span className='font-heading font-semibold'>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                        </div>
                        {shipping === 0 && (
                           <p className='text-sm font-body text-primary-blue'>🎉 Free shipping on orders over ₹1000!</p>
                        )}
                        <hr />
                        <div className='flex justify-between text-lg font-heading font-bold'>
                           <span>Total</span>
                           <span className='text-primary-pink'>₹{total}</span>
                        </div>
                     </div>

                     <button
                        onClick={() => setShowCheckout(true)}
                        className='btn-primary w-full'
                     >
                        Proceed to Checkout
                     </button>
                  </motion.div>
               </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
               {showCheckout && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='modal-overlay'
                     onClick={() => setShowCheckout(false)}
                  >
                     <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className='modal-content max-w-2xl'
                        onClick={(e) => e.stopPropagation()}
                     >
                        <button
                           onClick={() => setShowCheckout(false)}
                           className='absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg'
                        >
                           <X className='w-5 h-5' />
                        </button>

                        <div className='p-6'>
                           <h2 className='text-2xl font-heading font-bold text-text-dark mb-6'>
                              Checkout Details
                           </h2>

                           <form
                              onSubmit={handleCheckout}
                              className='space-y-4'
                           >
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                 <div>
                                    <label className='block text-sm font-heading font-medium text-text-dark mb-1'>Full Name *</label>
                                    <input
                                       type='text'
                                       required
                                       value={checkoutForm.name}
                                       onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                                    />
                                 </div>
                                 <div>
                                    <label className='block text-sm font-heading font-medium text-text-dark mb-1'>Email *</label>
                                    <input
                                       type='email'
                                       required
                                       value={checkoutForm.email}
                                       onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                                    />
                                 </div>
                              </div>

                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                 <div>
                                    <label className='block text-sm font-heading font-medium text-text-dark mb-1'>
                                       Phone Number *
                                    </label>
                                    <input
                                       type='tel'
                                       required
                                       value={checkoutForm.phone}
                                       onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                                    />
                                 </div>
                                 <div>
                                    <label className='block text-sm font-heading font-medium text-text-dark mb-1'>
                                       Alternate Phone
                                    </label>
                                    <input
                                       type='tel'
                                       value={checkoutForm.alternatePhone}
                                       onChange={(e) =>
                                          setCheckoutForm({ ...checkoutForm, alternatePhone: e.target.value })
                                       }
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                                    />
                                 </div>
                              </div>

                              <div>
                                 <label className='block text-sm font-heading font-medium text-text-dark mb-1'>Address *</label>
                                 <textarea
                                    required
                                    rows={3}
                                    value={checkoutForm.address}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                                 />
                              </div>

                              <div>
                                 <label className='block text-sm font-heading font-medium text-text-dark mb-1'>Pin Code *</label>
                                 <input
                                    type='text'
                                    required
                                    value={checkoutForm.pincode}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                                 />
                              </div>

                              <div className='bg-blue-50 p-4 rounded-lg'>
                                 <p className='text-sm font-body text-text-dark'>
                                    <strong>Note:</strong> After payment is done, you will receive a receipt of payment.
                                    When your product is dispatched, you will receive a mail from there you can track
                                    your order. For any queries, contact{' '}
                                    <a
                                       href='mailto:hezal.accessories@gmail.com'
                                       className='text-primary-blue font-heading font-semibold'
                                    >
                                       hezal.accessories@gmail.com
                                    </a>
                                 </p>
                              </div>

                              <div className='border-t pt-4'>
                                 <div className='flex justify-between text-lg font-heading font-bold mb-4'>
                                    <span>Total Amount:</span>
                                    <span className='text-primary-pink'>₹{total}</span>
                                 </div>
                                 <button
                                    type='submit'
                                    disabled={paymentLoading}
                                    className='btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                                 >
                                    {paymentLoading ? (
                                       <>
                                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                          <span>Processing Payment...</span>
                                       </>
                                    ) : (
                                       <span className='font-body'>Place Order</span>
                                    )}
                                 </button>
                              </div>
                           </form>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>
         </main>
         <Footer />
      </>
   )
}
