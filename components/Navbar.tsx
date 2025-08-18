'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'

export default function Navbar() {
   const [isAuthenticated, setIsAuthenticated] = useState(
      (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true') || false
   )
   const [cartItemsCount, setCartItemsCount] = useState(0)
   const pathname = usePathname()

   // Check if we should show the cart button (not on landing page or master page)
   const showCartButton = pathname !== '/' && pathname !== '/master'

   // Load cart items count
   useEffect(() => {
      const updateCartCount = () => {
         if (typeof window !== 'undefined') {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]')
            const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
            setCartItemsCount(totalItems)
         }
      }

      // Initial load
      updateCartCount()

      // Listen for cart updates
      const handleCartUpdate = () => updateCartCount()
      if (typeof window !== 'undefined') {
         window.addEventListener('cartUpdated', handleCartUpdate)
         return () => window.removeEventListener('cartUpdated', handleCartUpdate)
      }
   }, [])

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
                     <h1 className='text-base sm:text-xl font-heading font-bold text-gray-800 leading-tight'>
                        Hezal Accessories
                     </h1>
                     <p className='text-xs font-body text-gray-500 -mt-0.5 hidden sm:block'>
                        Your pet deserves only the BEST
                     </p>
                  </div>
               </Link>

               {/* Navigation Actions */}
               <div className='flex items-center space-x-3'>
                  {/* Cart Button - Only show when not on landing or master page */}
                  {showCartButton && (
                     <Link href='/cart'>
                        <button 
                           className='relative p-2 sm:p-3 text-gray-600 hover:text-pink-500 transition-colors duration-200 rounded-full hover:bg-pink-50'
                           title={`Cart (${cartItemsCount} items)`}
                           aria-label={`Shopping cart with ${cartItemsCount} items`}
                        >
                           <ShoppingCart className='w-5 h-5 sm:w-6 sm:h-6' />
                           {cartItemsCount > 0 && (
                              <span className='absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] animate-pulse'>
                                 {cartItemsCount > 99 ? '99+' : cartItemsCount}
                              </span>
                           )}
                        </button>
                     </Link>
                  )}

                  {/* Shop Now Button */}
                  <Link href='/products'>
                     <button className='bg-pink-500 text-white hover:bg-pink-600 font-body font-medium transition-colors duration-200 px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base'>
                        Shop Now
                     </button>
                  </Link>
                  
                  {/* Admin Button */}
                  {isAuthenticated && (
                     <Link
                        href='/master'
                        className='font-body font-medium transition-colors duration-200 bg-gray-800 text-white hover:bg-gray-700 py-2 px-3 sm:px-4 rounded-md text-sm sm:text-base'
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
