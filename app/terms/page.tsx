'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />
      <main className='min-h-screen bg-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-8'>
            <h1 className='text-3xl font-heading font-bold text-gray-800 mb-8 text-center'>
              Terms & Conditions
            </h1>
            
            <div className='prose prose-gray max-w-none'>
              <p className='font-body text-gray-600 mb-6'>
                Welcome to Hezal Accessories. By using our website or purchasing products, you agree to these Terms & Conditions.
              </p>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-heading font-semibold text-gray-800 mb-2'>Business Details</h3>
                  <p className='font-body text-gray-600'>
                    Proprietorship registered as Hezal Accessories, B65 Surya Nagar, behind LIC building, Saket, Meerut, UP, 250001.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-heading font-semibold text-gray-800 mb-2'>Products</h3>
                  <p className='font-body text-gray-600'>
                    We sell pet accessories, as described on product pages. Actual colours and dimensions may differ slightly.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-heading font-semibold text-gray-800 mb-2'>Pricing</h3>
                  <p className='font-body text-gray-600'>
                    All prices are subject to change without notice.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-heading font-semibold text-gray-800 mb-2'>Orders</h3>
                  <p className='font-body text-gray-600'>
                    Orders are confirmed after payment is received. We reserve the right to decline or cancel orders at our discretion.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Payments Accepted</h3>
                  <p className='text-gray-600'>
                    All modes provided by Razorpay for Indian customers—UPI, debit/credit cards, net banking, wallets, EMI (subject to Razorpay availability).
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Prohibited Use</h3>
                  <p className='text-gray-600'>
                    Please do not misuse the website in any way, including fraudulent activity.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Intellectual Property</h3>
                  <p className='text-gray-600'>
                    All site content is the property of Hezal Accessories.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Limitation of Liability</h3>
                  <p className='text-gray-600'>
                    We are not liable for any direct, indirect, or consequential damages arising from use of products or site.
                  </p>
                </div>

                <div>
                  <h3 className='text-lg font-semibold text-gray-800 mb-2'>Governing Law</h3>
                  <p className='text-gray-600'>
                    These Terms & Conditions are governed by Indian law.
                  </p>
                </div>
              </div>

              <div className='mt-8 p-4 bg-pink-50 rounded-lg border border-pink-100'>
                <p className='text-gray-700 font-medium text-sm sm:text-base break-words'>
                  <span className='block sm:inline'>For any questions, contact:</span>
                  <span className='block sm:inline mt-2 sm:mt-0'>
                    <a href='mailto:hezalpawccessories@gmail.com' className='text-pink-600 hover:text-pink-700 ml-0 sm:ml-2 break-all'>
                      hezalpawccessories@gmail.com
                    </a>
                  </span>
                  <span className='block sm:inline mt-2 sm:mt-0'>
                    <span className='mx-0 sm:mx-2 hidden sm:inline'>/</span>
                    <a href='tel:+917060266900' className='text-pink-600 hover:text-pink-700'>
                      +91 70602 66900
                    </a>
                  </span>
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
