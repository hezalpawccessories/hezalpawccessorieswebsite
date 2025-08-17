'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
   const [isAuthenticated, setIsAuthenticated] = useState(
      (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true') || false
   )

   return (
      <nav className='bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50'>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16 sm:h-20'>
               {/* Logo */}
               <Link
                  href='/'
                  className='flex items-center space-x-2 sm:space-x-3'
               >
                  <div className='bg-pink-50 rounded-full p-1.5 sm:p-2'>
                     <Image
                        src='/logom.png'
                        alt='Hezal Accessories Logo'
                        width={24}
                        height={24}
                        className='rounded-full sm:w-7 sm:h-7'
                     />
                  </div>

                  <div>
                     <h1 className='text-base sm:text-xl font-nunito font-bold text-gray-800 leading-tight'>
                        Hezal Accessories
                     </h1>
                     <p className='text-xs font-dm-sans text-gray-500 -mt-0.5 hidden sm:block'>
                        Your pet deserves only the BEST
                     </p>
                  </div>
               </Link>

               {/* Shop Now Button */}
               <div className='flex items-center space-x-3'>
                  <Link href='/products'>
                     <button className='bg-pink-500 text-white hover:bg-pink-600 font-dm-sans font-medium transition-colors duration-200 px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base'>
                        Shop Now
                     </button>
                  </Link>
                  {isAuthenticated && (
                     <Link
                        href='/master'
                        className='font-dm-sans font-medium transition-colors duration-200 bg-gray-800 text-white hover:bg-gray-700 py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base'
                     >
                        Admin
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </nav>
   )
}
