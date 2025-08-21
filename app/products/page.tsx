'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, Star, ShoppingCart, Plus, Minus, X, SortAscIcon, SortDesc, Eye, InfoIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { categories, sizes, Product } from '@/lib/products'
import Select from 'react-select'
import { select } from 'framer-motion/client'
import { toast } from 'sonner'
import { getProducts } from '@/integrations/firebase/firestoreCollections'

const sortOptions = [
   { value: 'name', label: 'Sort by Name' },
   { value: 'price-low', label: 'Price: Low to High' },
   { value: 'price-high', label: 'Price: High to Low' },
   { value: 'rating', label: 'Highest Rated' },
]

export default function Products() {
   const [selectedCategory, setSelectedCategory] = useState('All')
   const [searchQuery, setSearchQuery] = useState('')
   const [sortBy, setSortBy] = useState('name')
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [selectedSize, setSelectedSize] = useState<string>('')
   const [showCount, setShowCount] = useState(8)
   const [cartItems, setCartItems] = useState<any[]>([])
   const [productsList, setProductsList] = useState<Product[]>([])
   const [loading, setLoading] = useState(true)
   const [mainImage, setMainImage] = useState<string>('')
   const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({}) // Track size per product
   const [shakeProduct, setShakeProduct] = useState<string>('') // Track which product to shake
   const [customNames, setCustomNames] = useState<{ [key: string]: string }>({}) // Track custom names per product

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
   }, [])

   const filteredProducts = useMemo(() => {
      let filtered = productsList

      // Filter by category
      if (selectedCategory !== 'All') {
         filtered = filtered.filter((product) => product.category === selectedCategory)
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
   }, [productsList, selectedCategory, searchQuery, sortBy])

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
                                 <Eye className='w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:scale-110 transition-all duration-200 flex-shrink-0 mt-1 eye-pulse' />
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
                              <h3 className='font-heading font-bold text-text-dark mb-3'>Select Size:</h3>
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
                           <h2 className='text-2xl font-heading font-bold text-text-dark mb-2'>
                              {selectedProduct.title}
                           </h2>

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
                              </div>
                              <span className='text-sm text-primary-blue font-semibold'>
                                 {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                           </div>

                           {/* Size Selection in Modal */}
                           <div className='mb-6'>
                              <h3 className='font-heading font-bold text-text-dark mb-3'>Select Size:</h3>
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
