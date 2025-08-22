'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Filter, Star, ShoppingCart, Plus, Minus, X, SortAscIcon, SortDesc, Eye, InfoIcon, ChevronLeft, ChevronRight, Tag, Gift, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SizeChart from '@/components/SizeChart'
import Image from 'next/image'
import { categories, sizes, Product } from '@/lib/products'
import Select from 'react-select'
import { select } from 'framer-motion/client'
import { toast } from 'sonner'
import { getProducts, getBanners, Banner, getCollections, Collection } from '@/integrations/firebase/firestoreCollections'

const sortOptions = [
   { value: 'name', label: 'Sort by Name' },
   { value: 'price-low', label: 'Price: Low to High' },
   { value: 'price-high', label: 'Price: High to Low' },
   { value: 'rating', label: 'Highest Rated' },
]

export default function Products() {
   const [selectedCategory, setSelectedCategory] = useState('All')
   const [selectedCollection, setSelectedCollection] = useState('All')
   const [showSaleOnly, setShowSaleOnly] = useState(false) // New state for sale filter
   const [searchQuery, setSearchQuery] = useState('')
   const [sortBy, setSortBy] = useState('name')
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [selectedSize, setSelectedSize] = useState<string>('')
   const [showCount, setShowCount] = useState(8)
   const [cartItems, setCartItems] = useState<any[]>([])
   const [productsList, setProductsList] = useState<Product[]>([])
   const [collections, setCollections] = useState<Collection[]>([])
   const [loading, setLoading] = useState(true)
   const [mainImage, setMainImage] = useState<string>('')
   const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({}) // Track size per product
   const [shakeProduct, setShakeProduct] = useState<string>('') // Track which product to shake
   const [customNames, setCustomNames] = useState<{ [key: string]: string }>({}) // Track custom names per product
   
   // Banner state
   const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
   const [isAutoplaying, setIsAutoplaying] = useState(true)
   const [touchStart, setTouchStart] = useState<number | null>(null)
   const [touchEnd, setTouchEnd] = useState<number | null>(null)
   const [autoplayProgress, setAutoplayProgress] = useState(0)
   const [banners, setBanners] = useState<Banner[]>([])
   const [loadingBanners, setLoadingBanners] = useState(true)
   const bannerIntervalRef = useRef<NodeJS.Timeout | null>(null)
   const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

   // Minimum swipe distance (in px)
   const minSwipeDistance = 50

   // Helper function to check if any products are on sale
   const hasProductsOnSale = useMemo(() => {
      return productsList.some(product => product.onSale === true && (product.saleQuantity || 0) > 0)
   }, [productsList])

   // Helper function to get price for specific size
   const getPriceForSize = (product: Product, size?: string) => {
      if (!size || !product.sizePricing || product.sizePricing.length === 0) {
         return { price: product.price, originalPrice: product.originalPrice }
      }
      
      const sizePrice = product.sizePricing.find(sp => sp.size === size)
      if (sizePrice) {
         return { price: sizePrice.price, originalPrice: sizePrice.originalPrice }
      }
      
      return { price: product.price, originalPrice: product.originalPrice }
   }

   // Helper function to get current pricing for display
   const getCurrentPricing = (product: Product, productId: string) => {
      const selectedSize = selectedSizes[productId]
      return getPriceForSize(product, selectedSize)
   }

   // Helper function to get price range for display
   const getPriceRange = (product: Product) => {
      if (!product.sizePricing || product.sizePricing.length === 0) {
         return { minPrice: product.price, maxPrice: product.price, minOriginalPrice: product.originalPrice || 0, maxOriginalPrice: product.originalPrice || 0 }
      }
      
      const prices = product.sizePricing.filter(sp => sp.price > 0).map(sp => sp.price)
      const originalPrices = product.sizePricing.filter(sp => sp.originalPrice && sp.originalPrice > 0).map(sp => sp.originalPrice!)
      
      return {
         minPrice: Math.min(...prices),
         maxPrice: Math.max(...prices),
         minOriginalPrice: originalPrices.length > 0 ? Math.min(...originalPrices) : 0,
         maxOriginalPrice: originalPrices.length > 0 ? Math.max(...originalPrices) : 0
      }
   }

   // Load cart items on component mount
   useEffect(() => {
      if (typeof window !== 'undefined') {
         const cart = JSON.parse(localStorage.getItem('cart') || '[]')
         setCartItems(cart)
      }

      //Loading products from Firestore
      setLoading(true)
      getProducts()
         .then((fetchedProducts) => {
            setProductsList(fetchedProducts)
            setLoading(false)
            // if (fetchedProducts.length > 0) {
            //    toast.success('Products loaded successfully', {
            //       description: `${fetchedProducts.length} products found in your catalog`,
            //       duration: 3000,
            //    })
            // }
         })
         .catch((error) => {
            setLoading(false)
            console.error('Error fetching products:', error)
            toast.error('Failed to load products', {
               description: 'There was an issue loading your products from the database',
               duration: 4000,
            })
         })

      // Load collections from Firestore
      getCollections()
         .then((fetchedCollections) => {
            setCollections(fetchedCollections)
         })
         .catch((error) => {
            console.error('Error fetching collections:', error)
         })
   }, [])

   // Load banners from Firebase
   const loadBanners = async () => {
      try {
         setLoadingBanners(true)
         const fetchedBanners = await getBanners()
         const activeBanners = fetchedBanners.filter(banner => banner.isActive)
         setBanners(activeBanners.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      } catch (error) {
         console.error('Error loading banners:', error)
         // Fall back to dummy data if fetch fails
         setBanners([])
      } finally {
         setLoadingBanners(false)
      }
   }

   // Load banners on component mount
   useEffect(() => {
      loadBanners()
   }, [])

   // Reset banner index if current index is out of bounds
   useEffect(() => {
      if (banners.length > 0 && currentBannerIndex >= banners.length) {
         setCurrentBannerIndex(0)
      }
   }, [banners.length, currentBannerIndex])

   // Helper function to get banner styling and icon based on type
   const getBannerStyle = (type: Banner['type']) => {
      switch (type) {
         case 'festival':
            return {
               background: 'bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500',
               icon: Gift,
               cta: 'Shop Festival Collection'
            }
         case 'new-launch':
            return {
               background: 'bg-gradient-to-r from-blue-500 via-teal-500 to-green-500',
               icon: Sparkles,
               cta: 'Explore New Arrivals'
            }
         case 'sale':
            return {
               background: 'bg-gradient-to-r from-red-500 via-pink-500 to-rose-500',
               icon: Tag,
               cta: 'Shop Sale Items'
            }
         default:
            return {
               background: 'bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700',
               icon: Sparkles,
               cta: 'Explore Collection'
            }
      }
   }

   const filteredProducts = useMemo(() => {
      let filtered = productsList

      // Filter by category
      if (selectedCategory !== 'All') {
         filtered = filtered.filter((product) => product.category === selectedCategory)
      }

      // Filter by collection
      if (selectedCollection !== 'All') {
         filtered = filtered.filter((product) => product.collection === selectedCollection)
      }

      // Filter by sale status
      if (showSaleOnly) {
         filtered = filtered.filter((product) => product.onSale === true && (product.saleQuantity || 0) > 0)
      }

      // Filter by search query
      if (searchQuery) {
         filtered = filtered.filter(
            (product) =>
               product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               product.description.toLowerCase().includes(searchQuery.toLowerCase())
         )
      }

      // Sort products
      filtered.sort((a, b) => {
         switch (sortBy) {
            case 'price-low': {
               // Get minimum price for products with size-based pricing
               const aMinPrice = a.sizePricing && a.sizePricing.length > 0 
                  ? Math.min(...a.sizePricing.map(sp => sp.price)) 
                  : a.price
               const bMinPrice = b.sizePricing && b.sizePricing.length > 0 
                  ? Math.min(...b.sizePricing.map(sp => sp.price)) 
                  : b.price
               return aMinPrice - bMinPrice
            }
            case 'price-high': {
               // Get maximum price for products with size-based pricing
               const aMaxPrice = a.sizePricing && a.sizePricing.length > 0 
                  ? Math.max(...a.sizePricing.map(sp => sp.price)) 
                  : a.price
               const bMaxPrice = b.sizePricing && b.sizePricing.length > 0 
                  ? Math.max(...b.sizePricing.map(sp => sp.price)) 
                  : b.price
               return bMaxPrice - aMaxPrice
            }
            case 'rating':
               return b.rating - a.rating
            default:
               return a.title.localeCompare(b.title)
         }
      })

      return filtered
   }, [productsList, selectedCategory, selectedCollection, showSaleOnly, searchQuery, sortBy])

   const displayedProducts = filteredProducts.slice(0, showCount)
   const hasMoreProducts = filteredProducts.length > showCount

   const isInCart = (productId: string) => {
      return cartItems.some((item) => item.id === productId)
   }

   const addToCart = (product: Product, size?: string, quantity: number = 1) => {
      const sizeToUse = size || selectedSizes[product.id] || selectedSize

      if (!sizeToUse) {
         toast.error('Please select a size first', {
            description: 'Choose a size before adding to cart',
            duration: 3000,
         })

         // Trigger shake animation
         setShakeProduct(product.id)
         setTimeout(() => setShakeProduct(''), 600)
         return
      }

      // Check if Treat Jar requires custom name
      if (product.category === 'Treat Jars' && !customNames[product.id]?.trim()) {
         toast.error('Please enter a custom name for the treat jar', {
            description: 'Custom name is required for treat jars',
            duration: 3000,
         })
         return
      }

      // Get the correct pricing for the selected size
      const { price: sizePrice, originalPrice: sizeOriginalPrice } = getPriceForSize(product, sizeToUse)

      if (typeof window !== 'undefined') {
         const cart = JSON.parse(localStorage.getItem('cart') || '[]')
         const existingItem = cart.find((item: any) => 
            item.id === product.id && 
            item.size === sizeToUse && 
            item.customName === (customNames[product.id] || '')
         )

         if (existingItem) {
            existingItem.quantity += quantity
         } else {
            const cartItem = { 
               ...product, 
               size: sizeToUse, 
               quantity, 
               price: sizePrice, // Use size-specific price
               originalPrice: sizeOriginalPrice, // Use size-specific original price
               customName: product.category === 'Treat Jars' ? customNames[product.id] || '' : undefined
            }
            cart.push(cartItem)
         }

         localStorage.setItem('cart', JSON.stringify(cart))
         window.dispatchEvent(new Event('cartUpdated'))
         setCartItems(cart)

         const customNameText = product.category === 'Treat Jars' && customNames[product.id] 
            ? ` with custom name "${customNames[product.id]}"` 
            : ''

         toast.success('Added to cart!', {
            description: `${product.title} (Size: ${sizeToUse})${customNameText} added to your cart`,
            duration: 3000,
         })
      }

      if (selectedProduct) {
         setSelectedProduct(null)
         setSelectedSize('')
      }
   }

   const showMoreProducts = () => {
      setShowCount((prev) => prev + 8)
   }

   // Initialize main image when selected product changes
   useEffect(() => {
      if (selectedProduct) {
         const allImages = [selectedProduct.image, ...(selectedProduct.images?.filter(Boolean) || [])]
         setMainImage(allImages[0])
         // Set the modal size to the product's already selected size if any
         if (selectedSizes[selectedProduct.id]) {
            setSelectedSize(selectedSizes[selectedProduct.id])
         }
      }
   }, [selectedProduct, selectedSizes])

   // Banner auto-scroll logic
   useEffect(() => {
      if (isAutoplaying) {
         setAutoplayProgress(0)
         
         // Progress bar animation
         progressIntervalRef.current = setInterval(() => {
            setAutoplayProgress(prev => {
               if (prev >= 100) {
                  return 0
               }
               return prev + 2 // Increase by 2% every 100ms (5 seconds total)
            })
         }, 100)

         // Banner change interval
         bannerIntervalRef.current = setInterval(() => {
            setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
            setAutoplayProgress(0)
         }, 5000) // Change banner every 5 seconds
      } else {
         setAutoplayProgress(0)
      }

      return () => {
         if (bannerIntervalRef.current) {
            clearInterval(bannerIntervalRef.current)
         }
         if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current)
         }
      }
   }, [isAutoplaying, banners.length])

   // Keyboard navigation for banner
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         switch (event.key) {
            case 'ArrowLeft':
               event.preventDefault()
               goToPrevBanner()
               break
            case 'ArrowRight':
               event.preventDefault()
               goToNextBanner()
               break
            case ' ': // Spacebar
               event.preventDefault()
               setIsAutoplaying(!isAutoplaying)
               break
            case 'Enter':
               event.preventDefault()
               handleBannerClick(banners[currentBannerIndex])
               break
            default:
               break
         }
      }

      // Only add event listener when banner is visible
      window.addEventListener('keydown', handleKeyDown)
      
      return () => {
         window.removeEventListener('keydown', handleKeyDown)
      }
   }, [currentBannerIndex, isAutoplaying, banners]) // eslint-disable-line react-hooks/exhaustive-deps

   // Banner navigation functions
   const goToPrevBanner = () => {
      setIsAutoplaying(false)
      setAutoplayProgress(0)
      setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length)
      // Resume autoplay after 10 seconds of inactivity
      setTimeout(() => setIsAutoplaying(true), 10000)
   }

   const goToNextBanner = () => {
      setIsAutoplaying(false)
      setAutoplayProgress(0)
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length)
      // Resume autoplay after 10 seconds of inactivity
      setTimeout(() => setIsAutoplaying(true), 10000)
   }

   const goToBanner = (index: number) => {
      setIsAutoplaying(false)
      setAutoplayProgress(0)
      setCurrentBannerIndex(index)
      // Resume autoplay after 10 seconds of inactivity
      setTimeout(() => setIsAutoplaying(true), 10000)
   }

   // Touch/Swipe handlers for mobile
   const onTouchStart = (e: React.TouchEvent) => {
      setTouchEnd(null) // Reset touchEnd
      setTouchStart(e.targetTouches[0].clientX)
   }

   const onTouchMove = (e: React.TouchEvent) => {
      setTouchEnd(e.targetTouches[0].clientX)
   }

   const onTouchEnd = () => {
      if (!touchStart || !touchEnd) return
      
      const distance = touchStart - touchEnd
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      if (isLeftSwipe) {
         goToNextBanner()
      } else if (isRightSwipe) {
         goToPrevBanner()
      }
   }

   // Handle banner click actions
   const handleBannerClick = (banner: Banner) => {
      if (banner.linkUrl) {
         // If banner has a custom link, navigate to it
         window.open(banner.linkUrl, '_blank')
      } else {
         // Default behavior based on banner type
         switch (banner.type) {
            case 'festival':
               setSelectedCategory('All')
               toast.success('Welcome to Festival Collection!', {
                  description: 'Explore our special festival offers below.',
                  duration: 3000,
               })
               break
            case 'new-launch':
               setSelectedCategory('All')
               toast.success('Check out our New Arrivals!', {
                  description: 'Fresh styles just added to our collection.',
                  duration: 3000,
               })
               break
            case 'sale':
               setSelectedCategory('All')
               toast.success('Flash Sale Active!', {
                  description: 'Don\'t miss out on these amazing discounts.',
                  duration: 3000,
               })
               break
            default:
               setSelectedCategory('All')
               toast.success('Explore our Collection!', {
                  description: 'Discover amazing products for your pets.',
                  duration: 3000,
               })
               break
         }
      }
   }

   return (
      <>
         <Navbar />
         <main className='gradient-bg min-h-screen'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
               {/* Header */}
               <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className='text-center mb-12'
               >
                  <h1 className='text-4xl md:text-5xl font-heading font-extrabold text-text-dark mb-4 leading-tight tracking-wide'>
                     Our <span className='text-primary-pink'>Products</span>
                  </h1>
                  <p className='text-xl font-body text-text-body max-w-2xl mx-auto'>
                     Discover our carefully curated collection of premium pet accessories
                  </p>
               </motion.div>

               {/* Banner Carousel */}
               {!loadingBanners && banners.length > 0 && (
                  <motion.div
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className='relative mb-12 rounded-2xl overflow-hidden shadow-2xl'
                  >
                     {/* Main Banner Display */}
                     <div 
                        className='relative h-64 md:h-80 lg:h-96 cursor-pointer'
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                        onClick={() => banners[currentBannerIndex] && handleBannerClick(banners[currentBannerIndex])}
                     >
                        <AnimatePresence mode='wait'>
                           {banners[currentBannerIndex] && (
                              <motion.div
                                 key={currentBannerIndex}
                                 initial={{ opacity: 0, x: 100 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 exit={{ opacity: 0, x: -100 }}
                                 transition={{ duration: 0.5 }}
                                 className={`absolute inset-0 ${getBannerStyle(banners[currentBannerIndex].type).background}`}
                              >
                                 {/* Banner Content */}
                                 <div className='relative h-full flex items-center justify-between px-6 md:px-12 lg:px-16'>
                                    {/* Text Content */}
                                    <div className='flex-1 text-white z-10'>
                                       <div className='flex items-center gap-3 mb-4'>
                                          {(() => {
                                             const IconComponent = getBannerStyle(banners[currentBannerIndex].type).icon
                                             return <IconComponent className='w-8 h-8 text-white' />
                                          })()}
                                          <span className='text-sm md:text-base font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full'>
                                             {banners[currentBannerIndex].type.replace('-', ' ')}
                                          </span>
                                       </div>
                                       <h2 className='text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4'>
                                          {banners[currentBannerIndex].title}
                                       </h2>
                                       <h3 className='text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4 text-white/90'>
                                          {banners[currentBannerIndex].subtitle}
                                       </h3>
                                       <p className='text-base md:text-lg mb-6 text-white/80 max-w-md'>
                                          {banners[currentBannerIndex].description}
                                       </p>
                                       <button 
                                          onClick={(e) => {
                                             e.stopPropagation() // Prevent banner click event
                                             banners[currentBannerIndex] && handleBannerClick(banners[currentBannerIndex])
                                          }}
                                          className='bg-white text-gray-800 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg'
                                       >
                                          {getBannerStyle(banners[currentBannerIndex].type).cta}
                                       </button>
                                    </div>

                                    {/* Banner Image/Logo */}
                                    <div className='hidden md:flex items-center justify-center w-48 lg:w-64 h-48 lg:h-64 relative'>
                                       <div className='w-32 lg:w-40 h-32 lg:h-40 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm banner-floating-element'>
                                          <Image
                                             src={banners[currentBannerIndex].imageUrl}
                                             alt={banners[currentBannerIndex].title}
                                             width={100}
                                             height={100}
                                             className='w-20 lg:w-24 h-20 lg:h-24 object-contain'
                                          />
                                       </div>
                                       {/* Floating decorative elements */}
                                       <div className='absolute -top-4 -right-4 w-8 h-8 bg-white/30 rounded-full animate-pulse banner-floating-element'></div>
                                       <div className='absolute -bottom-4 -left-4 w-6 h-6 bg-white/20 rounded-full animate-bounce'></div>
                                       <div className='absolute top-1/2 -left-8 w-4 h-4 bg-white/25 rounded-full animate-ping'></div>
                                    </div>
                                 </div>

                                 {/* Gradient Overlay */}
                                 <div className='absolute inset-0 bg-black/10'></div>
                                 
                                 {/* Click indicator for mobile */}
                                 {/* <div className='absolute top-4 left-4 md:hidden'>
                                    <div className='bg-white/20 px-2 py-1 rounded-full text-white text-xs font-medium backdrop-blur-sm'>
                                       Tap to explore
                                    </div>
                                 </div> */}
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                  {/* Navigation Controls */}
                  <div className='absolute inset-y-0 left-4 flex items-center'>
                     <button
                        onClick={(e) => {
                           e.stopPropagation()
                           goToPrevBanner()
                        }}
                        className='bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 banner-nav-btn'
                        aria-label='Previous banner'
                     >
                        <ChevronLeft className='w-6 h-6' />
                     </button>
                  </div>
                  <div className='absolute inset-y-0 right-4 flex items-center'>
                     <button
                        onClick={(e) => {
                           e.stopPropagation()
                           goToNextBanner()
                        }}
                        className='bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 banner-nav-btn'
                        aria-label='Next banner'
                     >
                        <ChevronRight className='w-6 h-6' />
                     </button>
                  </div>

                  {/* Dots Indicator */}
                  <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3'>
                     {banners.map((banner, index) => (
                        <button
                           key={index}
                           onClick={(e) => {
                              e.stopPropagation()
                              goToBanner(index)
                           }}
                           className={`w-3 h-3 rounded-full transition-all duration-300 banner-dot ${
                              index === currentBannerIndex
                                 ? 'bg-white scale-125'
                                 : 'bg-white/50 hover:bg-white/70'
                           }`}
                           aria-label={`Go to ${banner.title} banner`}
                        />
                     ))}
                  </div>

                  {/* Auto-play indicator with pause/play functionality */}
                  <div className='absolute top-4 right-4'>
                     <button
                        onClick={(e) => {
                           e.stopPropagation()
                           setIsAutoplaying(!isAutoplaying)
                        }}
                        className='w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all duration-300'
                        aria-label={isAutoplaying ? 'Pause autoplay' : 'Resume autoplay'}
                     >
                        <div className={`w-2 h-2 rounded-full ${isAutoplaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}>
                        </div>
                     </button>
                  </div>

                  {/* Swipe indicator for mobile */}
                  <div className='absolute bottom-16 right-4 md:hidden'>
                     <div className='bg-white/20 px-2 py-1 rounded-full text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1'>
                        <ChevronLeft className='w-3 h-3' />
                        Swipe
                        <ChevronRight className='w-3 h-3' />
                     </div>
                  </div>

                  {/* Keyboard navigation hint for desktop */}
                  {/* <div className='absolute bottom-16 left-4 hidden md:block'>
                     <div className='bg-white/20 px-2 py-1 rounded-full text-white text-xs font-medium backdrop-blur-sm'>
                        Use ← → keys or spacebar to control
                     </div>
                  </div> */}

                  {/* Progress Bar */}
                  {isAutoplaying && (
                     <div className='absolute bottom-0 left-0 w-full h-1 bg-white/20'>
                        <div 
                           className='h-full bg-white transition-all duration-100 ease-linear'
                           style={{ width: `${autoplayProgress}%` }}
                        />
                     </div>
                  )}
                  </motion.div>
               )}

               {/* Filters */}
               <div className='mb-8 space-y-4'>
                  {/* Category Pills */}
                  <div className='flex flex-wrap gap-3 justify-center'>
                     {categories.map((category) => (
                        <button
                           key={category}
                           onClick={() => setSelectedCategory(category)}
                           className={`category-pill font-body font-medium ${
                              selectedCategory === category ? 'active' : ''
                           }`}
                        >
                           {category}
                        </button>
                     ))}
                  </div>

                  {/* Collection Pills - Smaller and differentiated */}
                  {collections.length > 0 && (
                     <div className='bg-gradient-to-r from-pink-50 to-pink-50 rounded-lg p-3 border border-pink-100'>
                        <div className='flex flex-wrap gap-2 justify-center items-center'>
                           <span className='text-base font-semibold text-pink-600 flex items-center gap-1'>
                              <Gift className='w-3 h-3' />
                              Collections:
                           </span>
                           <button
                              onClick={() => setSelectedCollection('All')}
                              className={`px-2 py-1 text-base font-medium rounded-lg transition-all duration-200 ${
                                 selectedCollection === 'All' 
                                    ? 'bg-pink-500 text-white shadow-md' 
                                    : 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-100'
                              }`}
                           >
                              All
                           </button>
                           {collections.map((collection) => (
                              <button
                                 key={collection.id}
                                 onClick={() => setSelectedCollection(collection.name)}
                                 className={`px-2 py-1 text-base font-medium rounded-lg transition-all duration-200 ${
                                    selectedCollection === collection.name 
                                       ? 'bg-pink-500 text-white shadow-md' 
                                       : 'bg-white text-pink-600 border border-pink-200 hover:bg-pink-100'
                                 }`}
                              >
                                 {collection.name}
                              </button>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Sale Filter - Only show if products are on sale */}
                  {hasProductsOnSale && (
                     <div className='bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border border-red-100'>
                        <div className='flex flex-wrap gap-2 justify-center items-center'>
                           <span className='text-base font-semibold text-red-600 flex items-center gap-1'>
                              <Tag className='w-3 h-3' />
                              Sale Items:
                           </span>
                           <button
                              onClick={() => setShowSaleOnly(false)}
                              className={`px-2 py-1 text-base font-medium rounded-lg transition-all duration-200 ${
                                 !showSaleOnly 
                                    ? 'bg-red-500 text-white shadow-md' 
                                    : 'bg-white text-red-600 border border-red-200 hover:bg-red-100'
                              }`}
                           >
                              All Products
                           </button>
                           <button
                              onClick={() => setShowSaleOnly(true)}
                              className={`px-2 py-1 text-base font-medium rounded-lg transition-all duration-200 ${
                                 showSaleOnly 
                                    ? 'bg-red-500 text-white shadow-md' 
                                    : 'bg-white text-red-600 border border-red-200 hover:bg-red-100'
                              }`}
                           >
                              🔥 Clearance Sale
                           </button>
                        </div>
                     </div>
                  )}

                  {/* Search and Sort */}
                  <div className='flex flex-row gap-4 items-center justify-between'>
                     <div className='relative flex-1 max-w-md'>
                        <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-text-light w-5 h-5' />
                        <input
                           type='text'
                           placeholder='Search products...'
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className='w-full pl-10 sm:pl-12 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue font-body'
                        />
                     </div>

                     <div className='flex items-center space-x-2'>
                        {/* <SortDesc className='w-5 h-5 text-text-light' /> */}
                        {/* <select
                           value={sortBy}
                           onChange={(e) => setSortBy(e.target.value)}
                           className='px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue'
                        >
                           <option value='name'>Sort by Name</option>
                           <option value='price-low'>Price: Low to High</option>
                           <option value='price-high'>Price: High to Low</option>
                           <option value='rating'>Highest Rated</option>
                        </select> */}
                        <Select
                           value={sortOptions.find((o) => o.value === sortBy)}
                           onChange={(option) => {
                              if (option) setSortBy(option.value)
                           }}
                           options={sortOptions}
                           isSearchable={false}
                           className='w-44 sm:w-56'
                           styles={{
                              control: (base, state) => ({
                                 ...base,
                                 borderRadius: '9999px',
                                 borderColor: state.isFocused ? '#4ecdc4' : '#e5e7eb',
                                 boxShadow: state.isFocused ? '0 0 0 2px #4ecdc4' : 'none',
                                 padding: '0.25rem 0.5rem',
                                 minHeight: '2.5rem',
                                 background: 'white',
                                 fontWeight: 500,
                              }),
                              option: (base, state) => ({
                                 ...base,
                                 background: state.isSelected ? '#ff6b9d' : state.isFocused ? '#fef7f0' : 'white',
                                 color: state.isSelected ? 'white' : '#2d3436',
                                 fontWeight: state.isSelected ? 600 : 400,
                                 fontSize: '1rem',
                              }),
                              menu: (base) => ({
                                 ...base,
                                 borderRadius: '1rem',
                                 boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                 zIndex: 20,
                              }),
                              singleValue: (base) => ({
                                 ...base,
                                 color: '#2d3436',
                              }),
                              indicatorSeparator: () => ({ display: 'none' }),
                              dropdownIndicator: (base, state) => ({
                                 ...base,
                                 color: state.isFocused ? '#4ecdc4' : '#636e72',
                              }),
                           }}
                        />
                     </div>
                  </div>
               </div>

               {/* Products Grid */}
               <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
                  {displayedProducts.map((product, index) => (
                     <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        className='bg-white rounded-2xl overflow-hidden shadow-lg card-hover flex sm:flex-col'
                     >
                        <div className='relative group my-auto sm:my-0 w-2/5 sm:w-full'>
                           <Image
                              src={product.image}
                              alt={product.title}
                              width={600}
                              height={192}
                              className='w-full h-full sm:h-48 object-contain'
                           />
                           {/* Hover overlay with eye icon */}
                           <div
                              className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center'
                              onClick={() => setSelectedProduct(product)}
                           >
                              <div className='bg-white rounded-full p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300 cursor-pointer mb-2'>
                                 <Eye className='w-6 h-6 text-pink-500' />
                              </div>
                              <span className='text-white text-sm font-medium bg-black bg-opacity-30 px-3 py-1 rounded-full'>
                                 View Details
                              </span>
                           </div>
                           
                           {/* Sale Badge - Top Left */}
                           {product.onSale && (product.saleQuantity || 0) > 0 && (
                              <div className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse'>
                                 🔥 SALE
                              </div>
                           )}
                           
                           {/* Quantity Badge - Top Left (below sale badge) */}
                           {product.onSale && (product.saleQuantity || 0) > 0 && (
                              <div className='absolute top-10 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold'>
                                 {product.saleQuantity} left
                              </div>
                           )}
                           
                           {(() => {
                              // Only show discount badge when a size is selected
                              if (selectedSizes[product.id]) {
                                 const currentPricing = getCurrentPricing(product, product.id)
                                 return currentPricing.originalPrice === 0 ? '' :
                                 <>
                                 {currentPricing.originalPrice && currentPricing.originalPrice > currentPricing.price && (
                                    <div className='absolute top-2 right-2 bg-primary-pink text-white px-2 py-1 rounded-full text-xs font-bold'>
                                       {Math.round(((currentPricing.originalPrice - currentPricing.price) / currentPricing.originalPrice) * 100)}%
                                       OFF
                                    </div>
                                 )}
                                 </>
                              }
                              return null
                           })()}
                           
                        </div>

                        <div className='p-4 w-3/5 sm:w-full'>
                           <div
                              className='group cursor-pointer mb-3 p-2 -m-2 rounded-lg hover:bg-pink-50 transition-colors duration-200'
                              onClick={() => setSelectedProduct(product)}
                           >
                              <h3 className='text-lg sm:text-xl font-heading font-bold text-text-dark line-clamp-2 group-hover:underline transition-all duration-400 flex items-start gap-2 mb-1'>
                                 <span className='flex-1'>{product.title}</span>
                                 {/* <Eye className='w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:scale-110 transition-all duration-200 flex-shrink-0 mt-1 eye-pulse' /> */}
                              </h3>
                              <span className='text-xs sm:text-sm text-pink-500 group-hover:text-pink-700 transition-colors duration-200 font-medium flex items-center gap-1'>
                                 <span>Click to view details</span>
                                 <span className='group-hover:translate-x-1 transition-transform duration-200'>→</span>
                              </span>
                           </div>

                           {/* Reviews and Ratings Section - removing for now */}
                           {/* <div className='flex items-center mb-2'>
                              <div className='flex items-center'>
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       className={`w-4 h-4 ${
                                          i < Math.floor(product.rating)
                                             ? 'text-soft-yellow fill-current'
                                             : 'text-gray-300'
                                       }`}
                                    />
                                 ))}
                              </div>
                              <span className='text-sm font-body text-text-light ml-2'>({product.reviews})</span>
                           </div> */}

                           <div className='flex items-center justify-between mb-4 gap-2 md:gap-4'>
                              <div className='flex items-center space-x-2'>
                                 {selectedSizes[product.id] ? (
                                    // Show specific price when size is selected
                                    <>
                                       <span className='text-lg font-accent font-bold text-primary-pink'>
                                          ₹{getCurrentPricing(product, product.id).price}
                                       </span>
                                       {getCurrentPricing(product, product.id).originalPrice === 0 ? '' :
                                          <>
                                          {getCurrentPricing(product, product.id).originalPrice && (
                                             <span className='text-text-light line-through text-sm'>
                                                ₹{getCurrentPricing(product, product.id).originalPrice}
                                             </span>
                                          )}
                                          </>
                                       }
                                    </>
                                 ) : (
                                    // Show price range when no size is selected (no original prices shown)
                                    (() => {
                                       const { minPrice, maxPrice } = getPriceRange(product)
                                       return (
                                          <div className='flex flex-col'>
                                             <div className='flex items-center space-x-2'>
                                                <span className='text-xl font-accent font-bold text-primary-pink'>
                                                   {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                                                </span>
                                             </div>
                                             {product.sizePricing && product.sizePricing.length > 1 && (
                                                <span className='text-xs text-text-light'>
                                                   {product.sizePricing.length} sizes available
                                                </span>
                                             )}
                                          </div>
                                       )
                                    })()
                                 )}
                              </div> 
                              {/* <span>Name</span> */}
                              {product.category === 'Treat Jars' && (
                                 <div className='mt-4'>
                                    <label className='block text-xs font-medium text-text-dark mb-2'>
                                       Custom Name for Jar *
                                    </label>
                                    <input 
                                       name='customName'
                                       type='text'
                                       value={customNames[product.id] || ''}
                                       onChange={(e) => setCustomNames(prev => ({
                                          ...prev,
                                          [product.id]: e.target.value
                                       }))}
                                       className='border border-gray-300 rounded-md p-2 w-36 text-sm focus:ring-2 focus:ring-primary-pink focus:border-transparent'
                                       placeholder='Snuggle&apos;s Treats'
                                       maxLength={20}
                                    />
                                    <p className='text-xs text-text-light mt-1'>
                                       Max 20 characters. This will be printed on your jar.
                                    </p>
                                 </div>
                              )}
                           </div>

                           {/* Size Selection */}
                           <div className='mb-6'>
                              {product.category !== 'Treat Jars' && 
                              <>
                              <div className='flex items-center gap-2 mb-3'>
                                 <h3 className='font-heading font-bold text-text-dark'>Select Size:</h3>
                                 <SizeChart/>
                              </div>
                              {/* <div className='block md:hidden mb-2'>
                                 <SizeChart />
                              </div> */}
                              </>
                              }
                              <div className='flex flex-wrap gap-1'>
                                 {product.sizePricing && product.sizePricing.length > 0 
                                    ? product.sizePricing.filter(sp => sp.price > 0).map((sizePricing) => {
                                       const size = sizePricing.size
                                       const sizePrice = getPriceForSize(product, size)
                                       return (
                                          <button
                                             key={size}
                                             onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                                             className={`px-2 py-1 text-sm border rounded-md font-medium transition-all duration-200 ${
                                                selectedSizes[product.id] === size
                                                   ? 'bg-primary-pink text-white border-primary-pink'
                                                   : 'bg-white text-text-dark border-gray-300 hover:border-primary-pink'
                                             } ${shakeProduct === product.id ? 'animate-shake border-red-500 border-2' : ''}`}
                                          >
                                             <div className='flex flex-col items-center'>
                                                <span className='text-xs'>{size}</span>
                                                <span className='text-xs opacity-80'>₹{sizePrice.price}</span>
                                             </div>
                                          </button>
                                       )
                                    })
                                    : sizes.map((size) => {
                                       const sizePrice = getPriceForSize(product, size)
                                       return (
                                          <button
                                             key={size}
                                             onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: size }))}
                                             className={`px-2 py-1 text-sm border rounded-md font-medium transition-all duration-200 ${
                                                selectedSizes[product.id] === size
                                                   ? 'bg-primary-pink text-white border-primary-pink'
                                                   : 'bg-white text-text-dark border-gray-300 hover:border-primary-pink'
                                             } ${shakeProduct === product.id ? 'animate-shake border-red-500 border-2' : ''}`}
                                          >
                                             <div className='flex flex-col items-center'>
                                                <span>{size}</span>
                                                <span className='text-xs opacity-80'>₹{sizePrice.price}</span>
                                             </div>
                                          </button>
                                       )
                                    })
                                 }
                              </div>
                           </div>

                           <button
                              className={`w-full flex items-center justify-center space-x-2 ${
                                 isInCart(product.id)
                                    ? 'bg-primary-blue text-white px-4 py-3 rounded-full font-semibold cursor-default'
                                    : 'btn-primary'
                              }`}
                              onClick={(e) => {
                                 e.stopPropagation()
                                 addToCart(product)
                              }}
                              disabled={!product.inStock}
                           >
                              <ShoppingCart className='w-4 h-4' />
                              <span>{isInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
                           </button>
                        </div>
                     </motion.div>
                  ))}
               </div>

               {/* Show More Button */}
               {hasMoreProducts && (
                  <div className='text-center mb-8'>
                     <button
                        onClick={showMoreProducts}
                        className='btn-secondary px-8 py-3'
                     >
                        Show More Products
                     </button>
                  </div>
               )}

               {loading ? (
                  <div className='text-center py-12'>
                     <p className='text-xl text-text-light'>Loading products...</p>
                  </div>
               ) : (
                  displayedProducts.length === 0 &&
                  productsList.length > 0 && (
                     <div className='text-center py-12'>
                        <p className='text-xl text-text-light'>No products found matching your criteria.</p>
                     </div>
                  )
               )}
            </div>

            {/* Product Modal */}
            <AnimatePresence>
               {selectedProduct && (
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='modal-overlay'
                     onClick={() => {
                        setSelectedProduct(null)
                        setSelectedSize('')
                     }}
                  >
                     <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className='modal-content'
                        onClick={(e) => e.stopPropagation()}
                     >
                        <button
                           onClick={() => {
                              setSelectedProduct(null)
                              setSelectedSize('')
                           }}
                           className='absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg'
                        >
                           <X className='w-5 h-5' />
                        </button>

                        <Image
                           src={mainImage || selectedProduct.image}
                           alt={selectedProduct.title}
                           width={600}
                           height={256}
                           className='w-full h-80 object-contain rounded-t-2xl'
                        />

                        {/* Thumbnail Gallery */}
                        {(() => {
                           const allImages = [selectedProduct.image, ...(selectedProduct.images?.filter(Boolean) || [])]
                           return allImages.length > 1 ? (
                              <div className='px-6 py-4 bg-gray-50'>
                                 <div className='flex gap-2 overflow-x-auto pb-2'>
                                    {allImages.map((img, idx) => (
                                       <button
                                          key={img + idx}
                                          onClick={() => setMainImage(img)}
                                          className={`flex-shrink-0 border-2 rounded-lg p-1 transition-all ${
                                             mainImage === img
                                                ? 'border-primary-blue'
                                                : 'border-transparent hover:border-gray-300'
                                          }`}
                                       >
                                          <Image
                                             src={img}
                                             alt={`Thumbnail ${idx + 1}`}
                                             width={60}
                                             height={60}
                                             className='w-15 h-15 rounded-md object-cover bg-white'
                                          />
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           ) : null
                        })()}

                        <div className='p-6'>
                           <div className='flex items-start justify-between mb-2'>
                              <h2 className='text-2xl font-heading font-bold text-text-dark flex-1'>
                                 {selectedProduct.title}
                              </h2>
                              {/* Sale indicators for modal */}
                              {selectedProduct.onSale && (selectedProduct.saleQuantity || 0) > 0 && (
                                 <div className='flex flex-col gap-1 ml-4'>
                                    <div className='bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse text-center'>
                                       🔥 ON SALE
                                    </div>
                                    <div className='bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold text-center'>
                                       {selectedProduct.saleQuantity} left
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* Reviews and Ratings Section */}
                           {/* <div className='flex items-center mb-4'>
                              <div className='flex items-center'>
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       className={`w-4 h-4 ${
                                          i < Math.floor(selectedProduct.rating)
                                             ? 'text-soft-yellow fill-current'
                                             : 'text-gray-300'
                                       }`}
                                    />
                                 ))}
                              </div>
                              <span className='text-sm text-text-light ml-2'>({selectedProduct.reviews} reviews)</span>
                           </div> */}

                           <p className='text-text-light mb-4'>{selectedProduct.description}</p>

                           <div className='mb-4'>
                              {selectedProduct.details.length > 0 && <h3 className='font-heading font-bold text-text-dark mb-2'>Features:</h3>}
                              <ul className='list-disc list-inside space-y-1'>
                                 {selectedProduct.details.map((detail, index) => (
                                    <li
                                       key={index}
                                       className='text-text-light text-sm'
                                    >
                                       {detail}
                                    </li>
                                 ))}
                              </ul>
                           </div>

                           <div className='flex items-center justify-between mb-6'>
                              <div className='flex items-center space-x-2'>
                                 {selectedSize ? (
                                    // Show specific price when size is selected (same as product card)
                                    <>
                                       <span className='text-2xl font-bold text-primary-pink'>
                                          ₹{getPriceForSize(selectedProduct, selectedSize).price}
                                       </span>
                                       {(() => {
                                          const currentPricing = getPriceForSize(selectedProduct, selectedSize)
                                          return currentPricing.originalPrice === 0 ? "" : (
                                             <>
                                             {currentPricing.originalPrice && (
                                                <span className='text-text-light line-through'>
                                                   ₹{currentPricing.originalPrice}
                                                </span>
                                             )}
                                             </>
                                          )
                                       })()}
                                    </>
                                 ) : (
                                    // Show price range when no size is selected (same as product card)
                                    (() => {
                                       const { minPrice, maxPrice } = getPriceRange(selectedProduct)
                                       return (
                                          <div className='flex flex-col'>
                                             <div className='flex items-center space-x-2'>
                                                <span className='text-2xl font-bold text-primary-pink'>
                                                   {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                                                </span>
                                             </div>
                                             {selectedProduct.sizePricing && selectedProduct.sizePricing.length > 1 && (
                                                <span className='text-sm text-text-light'>
                                                   {selectedProduct.sizePricing.length} sizes available
                                                </span>
                                             )}
                                          </div>
                                       )
                                    })()
                                 )}
                              </div>
                              <span className='text-sm text-primary-blue font-semibold'>
                                 {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                           </div>

                           {/* Size Selection in Modal */}
                           <div className='mb-6'>
                              <div className='flex items-center gap-2 mb-3'>
                                 <h3 className='font-heading font-bold text-text-dark'>Select Size:</h3>
                                 <SizeChart className='hidden md:block' />
                              </div>
                              <div className='block md:hidden mb-2'>
                                 <SizeChart />
                              </div>
                              <div className='flex flex-wrap gap-2'>
                                 {selectedProduct.sizePricing && selectedProduct.sizePricing.length > 0 
                                    ? selectedProduct.sizePricing.filter(sp => sp.price > 0).map((sizePricing) => {
                                       const size = sizePricing.size
                                       const sizePrice = getPriceForSize(selectedProduct, size)
                                       return (
                                          <button
                                             key={size}
                                             onClick={() => {
                                                setSelectedSize(size)
                                                setSelectedSizes((prev) => ({ ...prev, [selectedProduct.id]: size }))
                                             }}
                                             className={`px-3 py-2 text-sm border rounded-lg font-medium transition-colors ${
                                                selectedSize === size
                                                   ? 'bg-primary-pink text-white border-primary-pink'
                                                   : 'bg-white text-text-dark border-gray-300 hover:border-primary-pink'
                                             }`}
                                          >
                                             <div className='flex flex-col items-center'>
                                                <span>{size}</span>
                                                <span className='text-xs opacity-80'>₹{sizePrice.price}</span>
                                             </div>
                                          </button>
                                       )
                                    })
                                    : sizes.map((size) => {
                                       const sizePrice = getPriceForSize(selectedProduct, size)
                                       return (
                                          <button
                                             key={size}
                                             onClick={() => {
                                                setSelectedSize(size)
                                                setSelectedSizes((prev) => ({ ...prev, [selectedProduct.id]: size }))
                                             }}
                                             className={`px-3 py-2 text-sm border rounded-lg font-medium transition-colors ${
                                                selectedSize === size
                                                   ? 'bg-primary-pink text-white border-primary-pink'
                                                   : 'bg-white text-text-dark border-gray-300 hover:border-primary-pink'
                                             }`}
                                          >
                                             <div className='flex flex-col items-center'>
                                                <span>{size}</span>
                                                <span className='text-xs opacity-80'>₹{sizePrice.price}</span>
                                             </div>
                                          </button>
                                       )
                                    })
                                 }
                              </div>
                           </div>

                           {/* Custom Name for Treat Jars in Modal */}
                           {selectedProduct.category === 'Treat Jars' && (
                              <div className='mb-6'>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Custom Name for Jar *
                                 </label>
                                 <input 
                                    name='customName'
                                    type='text'
                                    value={customNames[selectedProduct.id] || ''}
                                    onChange={(e) => setCustomNames(prev => ({
                                       ...prev,
                                       [selectedProduct.id]: e.target.value
                                    }))}
                                    className='border border-gray-300 rounded-md p-3 w-full text-sm focus:ring-2 focus:ring-primary-pink focus:border-transparent'
                                    placeholder='Enter custom name for the jar'
                                    maxLength={20}
                                 />
                                 <p className='text-xs text-text-light mt-1'>
                                    Max 20 characters. This will be printed on your jar.
                                 </p>
                              </div>
                           )}

                           <button
                              onClick={() => addToCart(selectedProduct, selectedSize)}
                              disabled={!selectedProduct.inStock}
                              className='btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                           >
                              <ShoppingCart className='w-5 h-5' />
                              <span>Add to Cart</span>
                           </button>
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
