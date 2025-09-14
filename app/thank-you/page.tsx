'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Heart, Mail, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface OrderDetails {
   orderId: string
   paymentId: string
   amount: number
   customerName: string
   customerEmail: string
   customerPhone: string
   customerAddress: string
   customerLandmark?: string
   customerCity: string
   customerState: string
   customerPincode: string
}

function ThankYouContent() {
   const searchParams = useSearchParams()
   const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

   useEffect(() => {
      // Get order details from URL parameters
      const orderId = searchParams.get('orderId')
      const paymentId = searchParams.get('paymentId')
      const amount = searchParams.get('amount')
      const customerName = searchParams.get('customerName')
      const customerEmail = searchParams.get('customerEmail')
      const customerPhone = searchParams.get('customerPhone')
      const customerAddress = searchParams.get('customerAddress')
      const customerLandmark = searchParams.get('customerLandmark')
      const customerCity = searchParams.get('customerCity')
      const customerState = searchParams.get('customerState')
      const customerPincode = searchParams.get('customerPincode')

      if (orderId && paymentId && amount) {
         setOrderDetails({
            orderId,
            paymentId,
            amount: parseInt(amount),
            customerName: customerName || '',
            customerEmail: customerEmail || '',
            customerPhone: customerPhone || '',
            customerAddress: customerAddress || '',
            customerLandmark: customerLandmark || '',
            customerCity: customerCity || '',
            customerState: customerState || '',
            customerPincode: customerPincode || ''
         })
      }
   }, [searchParams])

   return (
      <>
         <Navbar />
         <main className='gradient-bg min-h-screen'>
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
               {/* Success Animation */}
               <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className='text-center mb-12'
               >
                  <div className='relative inline-block mb-6'>
                     <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'
                     >
                        <CheckCircle className='w-12 h-12 text-green-600' />
                     </motion.div>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className='absolute -top-2 -right-2'
                     >
                        <Sparkles className='w-8 h-8 text-primary-pink animate-pulse' />
                     </motion.div>
                  </div>

                  <motion.h1
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4, duration: 0.6 }}
                     className='text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-text-dark mb-4 leading-tight tracking-wide'
                  >
                     Thank You for Shopping at{' '}
                     <span className='text-primary-pink whitespace-nowrap'>Hezal Accessories</span>! 🐾
                  </motion.h1>

                  <motion.p
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.6, duration: 0.6 }}
                     className='text-xl font-body text-text-body mb-8'
                  >
                     Your order has been placed successfully !
Thanks for choosing us, and we&apos;re so grateful to be part of your pet&apos;s journey.
                  </motion.p>
               </motion.div>

               {/* Order Details Card */}
               {orderDetails && (
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.8, duration: 0.6 }}
                     className='bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8'
                  >
                     <div className='flex items-center mb-4 sm:mb-6'>
                        <ShoppingBag className='w-5 h-5 sm:w-6 sm:h-6 text-primary-blue mr-2 sm:mr-3' />
                        <h2 className='text-xl sm:text-2xl font-heading font-bold text-text-dark'>Order Details</h2>
                     </div>

                     <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6'>
                        {/* Order Information */}
                        <div className='space-y-4'>
                           <div className='bg-primary-pink/10 rounded-lg p-3 sm:p-4'>
                              <h3 className='font-heading font-semibold text-text-dark mb-2 sm:mb-3 text-sm sm:text-base'>Order Information</h3>
                              <div className='space-y-2 text-xs sm:text-sm'>
                                 <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0'>
                                    <span className='text-text-light'>Order ID:</span>
                                    <span className='font-medium text-text-dark break-all'>{orderDetails.orderId}</span>
                                 </div>
                                 <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0'>
                                    <span className='text-text-light'>Payment ID:</span>
                                    <span className='font-medium text-text-dark break-all'>{orderDetails.paymentId}</span>
                                 </div>
                                 <div className='flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0'>
                                    <span className='text-text-light'>Amount Paid:</span>
                                    <span className='font-bold text-primary-pink text-base sm:text-lg'>₹{orderDetails.amount}</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Customer Details */}
                        <div className='space-y-4'>
                           <div className='bg-primary-blue/10 rounded-lg p-3 sm:p-4'>
                              <h3 className='font-heading font-semibold text-text-dark mb-2 sm:mb-3 text-sm sm:text-base'>Shipping Details</h3>
                              <div className='space-y-2 text-xs sm:text-sm'>
                                 <div>
                                    <span className='text-text-light'>Name:</span>
                                    <p className='font-medium text-text-dark break-words'>{orderDetails.customerName}</p>
                                 </div>
                                 <div>
                                    <span className='text-text-light'>Email:</span>
                                    <p className='font-medium text-text-dark break-all'>{orderDetails.customerEmail}</p>
                                 </div>
                                 <div>
                                    <span className='text-text-light'>Phone:</span>
                                    <p className='font-medium text-text-dark'>{orderDetails.customerPhone}</p>
                                 </div>
                                 <div>
                                    <span className='text-text-light'>Address:</span>
                                    <p className='font-medium text-text-dark break-words'>{orderDetails.customerAddress}</p>
                                 </div>
                                 {orderDetails.customerLandmark && (
                                    <div>
                                       <span className='text-text-light'>Landmark:</span>
                                       <p className='font-medium text-text-dark break-words'>{orderDetails.customerLandmark}</p>
                                    </div>
                                 )}
                                 <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                    <div>
                                       <span className='text-text-light'>City:</span>
                                       <p className='font-medium text-text-dark'>{orderDetails.customerCity}</p>
                                    </div>
                                    <div>
                                       <span className='text-text-light'>State:</span>
                                       <p className='font-medium text-text-dark'>{orderDetails.customerState}</p>
                                    </div>
                                 </div>
                                 <div>
                                    <span className='text-text-light'>Pincode:</span>
                                    <p className='font-medium text-text-dark'>{orderDetails.customerPincode}</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}

               {/* Important Note */}
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                  className='bg-gradient-to-r from-warm-orange/20 to-primary-pink/20 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 border border-primary-pink/20'
               >
                  <div className='flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4'>
                     <div className='flex-shrink-0 mx-auto sm:mx-0'>
                        <Mail className='w-6 h-6 sm:w-8 sm:h-8 text-primary-blue' />
                     </div>
                     <div className='flex-1'>
                        <h3 className='text-lg sm:text-xl font-heading font-bold text-text-dark mb-3 flex items-center justify-center sm:justify-start'>
                           Important Information 📧
                        </h3>
                        <div className='space-y-3 font-body text-text-body text-sm sm:text-base'>
                           <p className='flex items-start'>
                              <span className='inline-block w-2 h-2 bg-primary-pink rounded-full mt-2 mr-3 flex-shrink-0'></span>
                              <span>
                                 Within <strong>24 hours</strong>, you will receive a confirmation email from{' '}
                                 <strong className='text-primary-blue break-all sm:break-normal'>hezal.accessories@gmail.com</strong>{' '}
                                 regarding the status and tracking details of your order.
                              </span>
                           </p>
                           <p className='flex items-start'>
                              <span className='inline-block w-2 h-2 bg-primary-pink rounded-full mt-2 mr-3 flex-shrink-0'></span>
                              <span>
                                 Your order will be carefully packaged with love and dispatched within{' '}
                                 <strong>2-3 business days</strong>.
                              </span>
                           </p>
                           <p className='flex items-start'>
                              <span className='inline-block w-2 h-2 bg-primary-pink rounded-full mt-2 mr-3 flex-shrink-0'></span>
                              <span>
                                 You&apos;ll receive tracking details via email & whatsapp once your order is shipped.
                              </span>
                           </p>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* Pet-themed Message */}
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className='text-center bg-white rounded-2xl p-8 shadow-lg mb-8'
               >
                  <div className='mb-6'>
                     <div className='inline-flex items-center space-x-2 text-2xl mb-4'>
                        <span>🐕</span>
                        <Heart className='w-6 h-6 text-red-500 animate-pulse' />
                        <span>🐱</span>
                     </div>
                     <h3 className='text-2xl font-heading font-bold text-text-dark mb-4'>
                        Your Pet&apos;s Style Journey Begins! 🌟
                     </h3>
                     <p className='text-lg font-body text-text-body leading-relaxed'>
                        We&apos;re thrilled to be part of your pet&apos;s fashion adventure! Every accessory is crafted with love 
                        and care to make your furry baby look absolutely adorable. 
                        <br />
                        <span className='text-primary-pink font-semibold'>Keep Shopping, Stay Happy! 💜</span>
                     </p>
                  </div>

                  <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                     <a
                        href='/products'
                        className='btn-primary inline-flex items-center space-x-2'
                     >
                        <ShoppingBag className='w-5 h-5' />
                        <span>Continue Shopping</span>
                        <ArrowRight className='w-4 h-4' />
                     </a>
                     <a
                        href='https://instagram.com/hezal_accessories'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='btn-secondary inline-flex items-center space-x-2'
                     >
                        <span>📱</span>
                        <span>Follow us on Instagram</span>
                     </a>
                  </div>
               </motion.div>

               {/* Footer Message */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className='text-center text-text-light'
               >
                  <p className='font-body'>
                     Need help? Contact us at{' '}
                     <a
                        href='mailto:hezal.accessories@gmail.com'
                        className='text-primary-blue font-semibold hover:underline'
                     >
                        hezal.accessories@gmail.com
                     </a>
                     {' '}or call{' '}
                     <a
                        href='tel:+917060266900'
                        className='text-primary-blue font-semibold hover:underline'
                     >
                        +91-7060266900
                     </a>
                  </p>
               </motion.div>
            </div>
         </main>
         <Footer />
      </>
   )
}

export default function ThankYou() {
   return (
      <Suspense fallback={
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-pink"></div>
         </div>
      }>
         <ThankYouContent />
      </Suspense>
   )
}