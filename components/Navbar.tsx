'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Heart, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import NProgress from 'nprogress'
import Image from 'next/image'

export default function Navbar() {
   const pathname = usePathname()
   const router = useRouter()
   const [isMenuOpen, setIsMenuOpen] = useState(false)
   const [cartCount, setCartCount] = useState(0)

   useEffect(() => {
      const updateCartCount = () => {
         if (typeof window !== 'undefined') {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]')
            const count = cart.reduce((total: number, item: any) => total + item.quantity, 0)
            setCartCount(count)
         }
      }

      updateCartCount()
      if (typeof window !== 'undefined') {
         window.addEventListener('storage', updateCartCount)
         window.addEventListener('cartUpdated', updateCartCount)

         return () => {
            window.removeEventListener('storage', updateCartCount)
            window.removeEventListener('cartUpdated', updateCartCount)
         }
      }
   }, [])

   const navItems = [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About' },
      { href: '/owner', label: 'Owner' },
      { href: '/products', label: 'Products' },
      { href: '/contact', label: 'Contact' },
   ]

   const handleNavigation = (href: string) => {
      if (href !== pathname) {
         NProgress.start()
         router.push(href)
      }
      setIsMenuOpen(false)
   }

   return (
      <nav className='bg-white shadow-lg sticky top-0 z-50'>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
               {/* Logo */}
               <Link
                  href='/'
                  className='flex items-center justify-center space-x-2'
               >
                  {/* <div className="w-10 h-10 bg-gradient-to-br from-primary-pink to-warm-orange rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div> */}
                  <Image
                     src='/logo3.png'
                     alt='Hezal Accessories Logo'
                     width={50}
                     height={50}
                     className='rounded-full mb-1'
                  />
                  <div>
                     <h1 className='text-xl font-nunito font-extrabold text-primary-pink leading-tight tracking-wide'>
                        Hezal Accessories
                     </h1>
                     <p className='text-xs font-dm-sans text-text-light -mt-1 tracking-wide'>
                        Your pet deserves only the BEST
                     </p>
                  </div>
               </Link>

               {/* Desktop Navigation */}
               <div className='hidden md:flex items-center space-x-8'>
                  {navItems.map((item) => (
                     <button
                        key={item.href}
                        onClick={() => handleNavigation(item.href)}
                        className={`font-dm-sans font-medium transition-colors duration-200 ${
                           pathname === item.href
                              ? 'text-primary-pink border-b-2 border-primary-pink pb-1'
                              : 'text-text-dark hover:text-primary-pink'
                        }`}
                     >
                        {item.label}
                     </button>
                  ))}
               </div>

               {/* Cart and Mobile Menu */}
               <div className='flex items-center space-x-4'>
                  <button
                     onClick={() => handleNavigation('/cart')}
                     className='relative'
                  >
                     <ShoppingCart className='w-6 h-6 text-text-dark hover:text-primary-pink transition-colors' />
                     {cartCount > 0 && (
                        <span className='absolute -top-2 -right-2 bg-primary-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                           {cartCount}
                        </span>
                     )}
                  </button>

                  {/* Mobile menu button */}
                  <button
                     className='md:hidden'
                     onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                     {isMenuOpen ? (
                        <X className='w-6 h-6 text-text-dark' />
                     ) : (
                        <Menu className='w-6 h-6 text-text-dark' />
                     )}
                  </button>
               </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
               <div className='md:hidden'>
                  <div className='px-2 pt-2 pb-3 space-y-1 bg-white border-t'>
                     {navItems.map((item) => (
                        <button
                           key={item.href}
                           onClick={() => handleNavigation(item.href)}
                           className={`block w-full text-left px-3 py-2 rounded-md text-base font-dm-sans font-medium transition-colors duration-200 ${
                              pathname === item.href
                                 ? 'text-primary-pink bg-pink-50'
                                 : 'text-text-dark hover:text-primary-pink hover:bg-pink-50'
                           }`}
                        >
                           {item.label}
                        </button>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </nav>
   )
}
