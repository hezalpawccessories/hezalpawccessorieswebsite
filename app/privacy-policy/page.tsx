'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
              Privacy Policy
            </h1>
            
            <div className='prose prose-gray max-w-none'>
              <p className='text-gray-600 mb-6'>
                Your privacy matters to us at Hezal Accessories.
              </p>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Information We Collect</h3>
                  <p className='text-gray-600'>
                    We collect your name, address, contact details, and payment info only for order fulfillment and notifications.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Use of Information</h3>
                  <p className='text-gray-600'>
                    We use your info exclusively to process your orders and provide order updates.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Data Security</h3>
                  <p className='text-gray-600'>
                    We take reasonable measures to protect your information. Data is never shared with third parties except Shiprocket for shipping and Razorpay for payments.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Communication</h3>
                  <p className='text-gray-600'>
                    You may receive emails about your order status. We do not send promotional emails.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Cookies</h3>
                  <p className='text-gray-600'>
                    Our website may use cookies to enhance your shopping experience.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Legal Compliance</h3>
                  <p className='text-gray-600'>
                    We comply with all applicable Indian privacy regulations.
                  </p>
                </div>
              </div>

              <div className='mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                <h4 className='font-semibold text-blue-800 mb-2'>Third Party Services</h4>
                <div className='space-y-2'>
                  <p className='text-blue-700'><strong>Shiprocket:</strong> For shipping and delivery</p>
                  <p className='text-blue-700'><strong>Razorpay:</strong> For secure payment processing</p>
                </div>
              </div>

              <div className='mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100'>
                <p className='text-gray-700 font-medium'>
                  For privacy queries, contact: 
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
