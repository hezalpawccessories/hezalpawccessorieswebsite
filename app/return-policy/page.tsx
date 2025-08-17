'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ReturnPolicy() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
              Return & Cancellation Policy
            </h1>
            
            <div className='prose prose-gray max-w-none'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 mb-8'>
                <h2 className='text-xl font-bold text-red-800 mb-4'>
                  Important Notice
                </h2>
                <p className='text-red-700 font-medium'>
                  We do not allow returns, cancellations, or refunds on any products sold.
                </p>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Final Sale Policy</h3>
                  <p className='text-gray-600'>
                    All purchases are final. Once your order is placed and payment is received, it is processed immediately for shipping.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>No Cancellations</h3>
                  <p className='text-gray-600'>
                    No cancellations will be entertained after payment.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>No Refunds</h3>
                  <p className='text-gray-600'>
                    No refunds are provided under any circumstances.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Damaged or Incorrect Orders</h3>
                  <p className='text-gray-600'>
                    If your order arrives damaged or incorrect, please email hezalpawccessories@gmail.com or call +91 70602 66900 within 24 hours of delivery. We will review on a case-by-case basis.
                  </p>
                </div>
              </div>

              <div className='mt-8 p-4 bg-pink-50 rounded-lg border border-pink-100'>
                <p className='text-gray-700 font-medium text-center'>
                  Thank you for your understanding.
                </p>
              </div>

              <div className='mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100'>
                <p className='text-gray-700 font-medium'>
                  For any questions, contact: 
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
