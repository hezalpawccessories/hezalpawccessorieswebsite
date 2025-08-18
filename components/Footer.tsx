import Link from 'next/link'
import { Heart, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
   return (
      <footer className='bg-text-dark text-white mt-20'>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
               {/* Brand */}
               <div className='col-span-1 md:col-span-2'>
                  <div className='flex items-center space-x-2 mb-4'>
                     {/* <div className='w-10 h-10 bg-gradient-to-br from-primary-pink to-warm-orange rounded-full flex items-center justify-center'>
                        <Heart
                           className='w-6 h-6 text-white'
                           fill='currentColor'
                        />
                     </div> */}
                     <Image
                        src='/logom.png'
                        alt='Hezal Accessories Logo'
                        width={40}
                        height={40}
                        className='rounded-full'
                     />
                     <div>
                        <h3 className='text-xl font-nunito font-bold text-primary-pink'>Hezal Accessories</h3>
                        <p className='text-sm font-dm-sans text-gray-300'>Your pet deserves only the BEST</p>
                     </div>
                  </div>
                  <p className='font-dm-sans text-gray-300 mb-4'>
                     We provide premium quality pet accessories to keep your furry friends happy, healthy, and stylish.
                  </p>
                  <div className='flex items-center space-x-2 text-sm text-gray-300'>
                     <Mail className='w-4 h-4' />
                     <span>hezalpawccessories@gmail.com</span>
                  </div>
               </div>

               {/* Quick Links */}
               <div >
                  <h4 className='text-lg font-dm-sans font-semibold mb-4 text-pink-500'>Quick Links</h4>
                  <ul className='space-y-2'>
                     <li>
                        <Link
                           href='/'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Home
                        </Link>
                     </li>
                     <li>
                        <Link
                           href='/about'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           About
                        </Link>
                     </li>
                     <li>
                        <Link
                           href='/owner'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Owner
                        </Link>
                     </li>
                     <li>
                        <Link
                           href='/contact'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Contact
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Policies */}
               <div>
                  <h4 className='text-lg font-dm-sans font-semibold mb-4 text-pink-500'>Policies</h4>
                  <ul className='space-y-2'>
                     <li>
                        <Link
                           href='/privacy-policy'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Privacy Policy
                        </Link>
                     </li>
                     <li>
                        <Link
                           href='/terms'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Terms & Conditions
                        </Link>
                     </li>
                     <li>
                        <Link
                           href='/return-policy'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Return & Cancellation
                        </Link>
                     </li>
                     <li>
                        <Link
                           href='/shipping-policy'
                           className='text-gray-300 hover:text-primary-pink transition-colors'
                        >
                           Shipping Policy
                        </Link>
                     </li>
                  </ul>
               </div>
            </div>

            <div className='border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-2'>
               <p className='text-gray-300 text-sm'>© 2025 Hezal Accessories. All rights reserved.</p>
               {/* <p className='text-gray-300 text-sm mt-2 md:mt-0'>Developed with ❤️ for pet lovers</p> */}
               <a
                  href='https://www.instagram.com/hezal_accessories/?hl=en'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center space-x-1 text-gray-300 hover:text-primary-pink transition-colors text-sm font-semibold mt-2 md:mt-0'
                  title='Follow us on Instagram'
               >
                  <svg
                     xmlns='http://www.w3.org/2000/svg'
                     width='20'
                     height='20'
                     viewBox='0 0 14 14'
                  >
                     <g
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                     >
                        <path d='M10.333 3.644a.25.25 0 1 1 0-.5m0 .5a.25.25 0 1 0 0-.5' />
                        <path d='M.858 3.431A2.573 2.573 0 0 1 3.431.858h6.862a2.573 2.573 0 0 1 2.573 2.573v6.862a2.573 2.573 0 0 1-2.573 2.573H3.43a2.573 2.573 0 0 1-2.573-2.573V3.43Z' />
                        <path d='M4.312 6.862a2.55 2.55 0 1 0 5.1 0a2.55 2.55 0 1 0-5.1 0' />
                     </g>
                  </svg>
                  <span>Instagram</span>
               </a>
            </div>
         </div>
      </footer>
   )
}
