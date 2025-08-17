'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ShippingPolicy() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
              Shipping Policy
            </h1>
            
            <div className='prose prose-gray max-w-none'>
              <p className='text-gray-600 mb-6'>
                We deliver pet accessories throughout India using Shiprocket after receiving payment.
              </p>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Order Processing</h3>
                  <p className='text-gray-600'>
                    Orders are dispatched within 2–4 business days after payment.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Shipping Time</h3>
                  <p className='text-gray-600'>
                    Delivery usually takes 3–7 business days from dispatch, depending on location.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Shipping Charges</h3>
                  <p className='text-gray-600'>
                    Calculated and shown at checkout; charges vary by order size and location.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Tracking</h3>
                  <p className='text-gray-600'>
                    You will receive a tracking link via email or SMS after dispatch.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Delays</h3>
                  <p className='text-gray-600'>
                    Delivery may be delayed due to unforeseen circumstances; we strive to keep you informed.
                  </p>
                </div>
              </div>

              <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='p-4 bg-pink-50 rounded-lg border border-pink-100'>
                  <h4 className='font-semibold text-gray-800 mb-2'>Processing Time</h4>
                  <p className='text-pink-700 font-medium'>2–4 Business Days</p>
                </div>
                <div className='p-4 bg-green-50 rounded-lg border border-green-100'>
                  <h4 className='font-semibold text-gray-800 mb-2'>Delivery Time</h4>
                  <p className='text-green-700 font-medium'>3–7 Business Days</p>
                </div>
              </div>

              <div className='mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100'>
                <p className='text-gray-700 font-medium'>
                  For any shipping queries, contact: 
                  <a href='mailto:hezalpawccessories@gmail.com' className='text-pink-600 hover:text-pink-700 ml-2'>
                    hezalpawccessories@gmail.com
                  </a>
                  <span className='mx-2'>/</span>
                  <a href='tel:+917060266900' className='text-pink-600 hover:text-pink-700'>
                    +91 70602 66900
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
