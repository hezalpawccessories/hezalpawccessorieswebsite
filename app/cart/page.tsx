'use client'

import { useState, useEffect } from 'react'
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Product } from '@/lib/products'

interface CartItem extends Product {
   quantity: number
   size: string
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
   const [checkoutForm, setCheckoutForm] = useState<CheckoutForm>({
      name: '',
      email: '',
      phone: '',
      address: '',
      pincode: '',
      alternatePhone: '',
   })

   useEffect(() => {
      const loadCart = () => {
         const cart = JSON.parse(localStorage.getItem('cart') || '[]')
         setCartItems(cart)
      }

      loadCart()
      window.addEventListener('cartUpdated', loadCart)
      return () => window.removeEventListener('cartUpdated', loadCart)
   }, [])

   const updateQuantity = (id: string, newQuantity: number) => {
      if (newQuantity <= 0) {
         removeItem(id)
         return
      }

      const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      setCartItems(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))
   }

   const removeItem = (id: string) => {
      const updatedCart = cartItems.filter((item) => item.id !== id)
      setCartItems(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('cartUpdated'))
   }

   const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
   const shipping = subtotal > 1000 ? 0 : 99
   const total = subtotal + shipping

   const handleCheckout = (e: React.FormEvent) => {
      e.preventDefault()
      // Here you would typically process the order
      alert('Order placed successfully! You will receive a confirmation email shortly.')
      setCartItems([])
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))
      setShowCheckout(false)
      setCheckoutForm({
         name: '',
         email: '',
         phone: '',
         address: '',
         pincode: '',
         alternatePhone: '',
      })
   }

   if (cartItems.length === 0) {
      return (
         <>
            <Navbar />
            <main className='gradient-bg min-h-screen'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                  <div className='text-center'>
                     <ShoppingBag className='w-24 h-24 text-text-light mx-auto mb-6' />
                     <h1 className='text-3xl font-bold text-text-dark mb-4'>Your Cart is Empty</h1>
                     <p className='text-xl text-text-light mb-8'>
                        Looks like you haven't added any items to your cart yet.
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
         <Navbar />
         <main className='gradient-bg min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className='mb-8'
               >
                  <h1 className='text-4xl md:text-5xl font-bold text-text-dark mb-4'>
                     Shopping <span className='text-primary-pink'>Cart</span>
                  </h1>
                  <p className='text-xl text-text-light'>Review your items and proceed to checkout</p>
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
                              <img
                                 src={item.image}
                                 alt={item.title}
                                 className='w-24 h-24 object-cover rounded-xl'
                              />

                              <div className='flex-1 text-center md:text-left'>
                                 <h3 className='text-lg font-bold text-text-dark mb-1'>{item.title}</h3>
                                 <p className='text-text-light text-sm mb-2'>
                                    {item.category} • Size: {item.size}
                                 </p>
                                 <div className='flex items-center justify-center md:justify-start space-x-2'>
                                    <span className='text-xl font-bold text-primary-pink'>₹{item.price}</span>
                                    {item.originalPrice && (
                                       <span className='text-text-light line-through text-sm'>
                                          ₹{item.originalPrice}
                                       </span>
                                    )}
                                 </div>
                              </div>

                              <div className='flex items-center space-x-4'>
                                 <div className='flex items-center space-x-2'>
                                    <button
                                       onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                       className='quantity-btn'
                                    >
                                       <Minus className='w-4 h-4' />
                                    </button>
                                    <span className='w-8 text-center font-semibold'>{item.quantity}</span>
                                    <button
                                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                       className='quantity-btn'
                                    >
                                       <Plus className='w-4 h-4' />
                                    </button>
                                 </div>

                                 <button
                                    onClick={() => removeItem(item.id)}
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
                     <h2 className='text-2xl font-bold text-text-dark mb-6'>Order Summary</h2>

                     <div className='space-y-4 mb-6'>
                        <div className='flex justify-between'>
                           <span className='text-text-light'>Subtotal</span>
                           <span className='font-semibold'>₹{subtotal}</span>
                        </div>
                        <div className='flex justify-between'>
                           <span className='text-text-light'>Shipping</span>
                           <span className='font-semibold'>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                        </div>
                        {shipping === 0 && (
                           <p className='text-sm text-primary-blue'>🎉 Free shipping on orders over ₹1000!</p>
                        )}
                        <hr />
                        <div className='flex justify-between text-lg font-bold'>
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
                           <h2 className='text-2xl font-bold text-text-dark mb-6'>Checkout Details</h2>

                           <form
                              onSubmit={handleCheckout}
                              className='space-y-4'
                           >
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                 <div>
                                    <label className='block text-sm font-medium text-text-dark mb-1'>Full Name *</label>
                                    <input
                                       type='text'
                                       required
                                       value={checkoutForm.name}
                                       onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                    />
                                 </div>
                                 <div>
                                    <label className='block text-sm font-medium text-text-dark mb-1'>Email *</label>
                                    <input
                                       type='email'
                                       required
                                       value={checkoutForm.email}
                                       onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                    />
                                 </div>
                              </div>

                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                 <div>
                                    <label className='block text-sm font-medium text-text-dark mb-1'>
                                       Phone Number *
                                    </label>
                                    <input
                                       type='tel'
                                       required
                                       value={checkoutForm.phone}
                                       onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                    />
                                 </div>
                                 <div>
                                    <label className='block text-sm font-medium text-text-dark mb-1'>
                                       Alternate Phone
                                    </label>
                                    <input
                                       type='tel'
                                       value={checkoutForm.alternatePhone}
                                       onChange={(e) =>
                                          setCheckoutForm({ ...checkoutForm, alternatePhone: e.target.value })
                                       }
                                       className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                    />
                                 </div>
                              </div>

                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-1'>Address *</label>
                                 <textarea
                                    required
                                    rows={3}
                                    value={checkoutForm.address}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 />
                              </div>

                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-1'>Pin Code *</label>
                                 <input
                                    type='text'
                                    required
                                    value={checkoutForm.pincode}
                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 />
                              </div>

                              <div className='bg-soft-yellow/20 p-4 rounded-lg'>
                                 <p className='text-sm text-text-dark'>
                                    <strong>Note:</strong> After payment is done, you will receive a receipt of payment.
                                    When your product is dispatched, you will receive a mail from there you can track
                                    your order. For any queries, contact{' '}
                                    <a
                                       href='mailto:hezal.accessories@gmail.com'
                                       className='text-primary-blue font-semibold'
                                    >
                                       hezal.accessories@gmail.com
                                    </a>
                                 </p>
                              </div>

                              <div className='border-t pt-4'>
                                 <div className='flex justify-between text-lg font-bold mb-4'>
                                    <span>Total Amount:</span>
                                    <span className='text-primary-pink'>₹{total}</span>
                                 </div>
                                 <button
                                    type='submit'
                                    className='btn-primary w-full'
                                 >
                                    Place Order
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
