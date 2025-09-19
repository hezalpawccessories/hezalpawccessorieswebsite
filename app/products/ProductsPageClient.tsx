'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import NavigationLink from '@/components/NavigationLink'
import Image from 'next/image'
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/products'
import { getBanners, Banner } from '@/integrations/firebase/firestoreCollections'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'

interface Collection {
  id: string
  name: string
  description?: string
}

interface ProductsPageClientProps {
  initialProducts: Product[]
  totalProducts: number
  categories: string[]
  collections: Collection[]
  currentPage: number
  totalPages: number
  hasProductsOnSale: boolean
  searchParams: {
    category?: string
    collection?: string
    sale?: string
    search?: string
    sort?: string
    page?: string
  }
}

export default function ProductsPageClient({
  initialProducts,
  totalProducts,
  categories,
  collections,
  currentPage,
  totalPages,
  hasProductsOnSale,
  searchParams
}: ProductsPageClientProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '')
  const [showFilters, setShowFilters] = useState(false)
  
  // Banner state
  const [banners, setBanners] = useState<Banner[]>([])
  const [loadingBanners, setLoadingBanners] = useState(true)

  // Load banners from Firebase
  useEffect(() => {
    const loadBanners = async () => {
      try {
        setLoadingBanners(true)
        const fetchedBanners = await getBanners()
        const allBanners = fetchedBanners.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        console.log('Loaded all banners:', allBanners) // Debug log
        setBanners(allBanners)
      } catch (error) {
        console.error('Error loading banners:', error)
        setBanners([])
      } finally {
        setLoadingBanners(false)
      }
    }

    loadBanners()
  }, [])

  // Show loading state for filters
  const [isFilterLoading, setIsFilterLoading] = useState(false)

  // Hide filter loader when component updates (new products loaded)
  useEffect(() => {
    setIsFilterLoading(false)
  }, [initialProducts, searchParams])

  // Update URL and trigger server-side filtering with loader
  const updateURL = (newParams: Record<string, string | undefined>) => {
    setIsFilterLoading(true)
    
    const current = new URLSearchParams(urlSearchParams.toString())
    
    // Update or remove parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'All') {
        current.set(key, value)
      } else {
        current.delete(key)
      }
    })

    // Always reset to page 1 when filters change (except when explicitly setting page)
    if (!newParams.page) {
      current.delete('page')
    }

    const search = current.toString()
    const query = search ? `?${search}` : ''
    
    // Use timeout to show loader briefly before navigation
    setTimeout(() => {
      router.push(`/products${query}`)
    }, 100)
  }

  // Handle category selection - preserve other filters
  const handleCategoryChange = (category: string) => {
    updateURL({ 
      category: category === 'All' ? undefined : category,
      // Preserve existing filters
      collection: searchParams.collection,
      sale: searchParams.sale,
      search: searchParams.search,
      sort: searchParams.sort
    })
  }

  // Handle collection selection - preserve other filters  
  const handleCollectionChange = (collection: string) => {
    updateURL({ 
      collection: collection === '' ? undefined : collection,
      // Preserve existing filters
      category: searchParams.category,
      sale: searchParams.sale,
      search: searchParams.search,
      sort: searchParams.sort
    })
  }

  // Handle sale filter - preserve other filters
  const handleSaleToggle = () => {
    const newSaleValue = searchParams.sale === 'true' ? undefined : 'true'
    updateURL({ 
      sale: newSaleValue,
      // Preserve existing filters
      category: searchParams.category,
      collection: searchParams.collection,
      search: searchParams.search,
      sort: searchParams.sort
    })
  }

  // Handle sort change - preserve other filters
  const handleSortChange = (sort: string) => {
    updateURL({ 
      sort,
      // Preserve existing filters
      category: searchParams.category,
      collection: searchParams.collection,
      sale: searchParams.sale,
      search: searchParams.search
    })
  }

  // Handle search - preserve other filters
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL({ 
      search: searchQuery || undefined,
      // Preserve existing filters
      category: searchParams.category,
      collection: searchParams.collection,
      sale: searchParams.sale,
      sort: searchParams.sort
    })
  }

  // Handle search clear - preserve other filters
  const handleClearSearch = () => {
    setSearchQuery('')
    updateURL({ 
      search: undefined,
      // Preserve existing filters
      category: searchParams.category,
      collection: searchParams.collection,
      sale: searchParams.sale,
      sort: searchParams.sort
    })
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() })
  }

  // Get price for display (handles size pricing)
  const getDisplayPrice = (product: Product) => {
    if (product.sizePricing && product.sizePricing.length > 0) {
      const prices = product.sizePricing.map(sp => sp.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      
      if (minPrice === maxPrice) {
        return `₹${minPrice}`
      } else {
        return `₹${minPrice} - ₹${maxPrice}`
      }
    }
    
    return `₹${product.price}`
  }

  // Get discount percentage for display
  const getDiscountPercentage = (product: Product) => {
    if (product.sizePricing && product.sizePricing.length > 0) {
      // Use the first size pricing for discount calculation
      const pricing = product.sizePricing[0]
      if (pricing.originalPrice && pricing.originalPrice > pricing.price) {
        return Math.round(((pricing.originalPrice - pricing.price) / pricing.originalPrice) * 100)
      }
    } else if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    }
    
    return 0
  }

  return (
    <>
      <Navbar />
      
      {/* Filter Loading Overlay */}
      {isFilterLoading && <Loader />}
      
      <main className="gradient-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8 ">
            <div className="mb-4 flex sm:flex-row mx-auto items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-dark ">
              Premium 
            </h1>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary-pink">Pet Accessories</h1>
            </div>
            <p className="text-xl text-text-light">
              Stylish and comfortable accessories for your furry friends
            </p>
          </div>

          {/* Banner Section */}
          {!loadingBanners && banners.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 bg-gradient-to-r from-teal-400/90 via-blue-400/90 to-pink-300/90 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm"
            >
              <div className="relative h-12 flex items-center bg-white/10">
                <div className="flex-1 overflow-hidden whitespace-nowrap">
                  {/* Debug info - remove in production */}
                  {/* {process.env.NODE_ENV === 'development' && (
                    <div className="absolute top-0 right-0 bg-black/20 text-white text-xs px-2 py-1 rounded-bl">
                      {banners.length} banner{banners.length !== 1 ? 's' : ''}
                    </div>
                  )} */}
                  <div className="hidden sm:flex animate-marquee-continuous space-x-8">
                    {/* Repeat banners multiple times for seamless scrolling */}
                    {Array.from({ length: 3 }, (_, repeatIndex) => 
                      banners.map((banner, bannerIndex) => (
                        <div key={`${repeatIndex}-${bannerIndex}`} className="flex items-center space-x-4 px-6">
                          <span className="text-xl">🐾</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-800 font-bold text-base">
                              {banner.title}
                            </span>
                            {banner.subtitle && (
                              <>
                                <span className="text-gray-700">•</span>
                                <span className="text-gray-700 font-medium text-sm">
                                  {banner.subtitle}
                                </span>
                              </>
                            )}
                            {/* {banner.description && (
                              <>
                                <span className="text-gray-700">•</span>
                                <span className="text-gray-600 text-sm">
                                  {banner.description}
                                </span>
                              </>
                            )} */}
                          </div>
                          <span className="text-xl">🐾</span>
                        </div>
                      ))
                    ).flat()}
                  </div>
                  <div className="flex sm:hidden animate-marquee-continuous-smalls space-x-6">
                    {/* Repeat banners multiple times for seamless scrolling on mobile */}
                    {Array.from({ length: 3 }, (_, repeatIndex) => 
                      banners.map((banner, bannerIndex) => (
                        <div key={`${repeatIndex}-${bannerIndex}`} className="flex items-center space-x-3 px-4">
                          <span className="text-lg">🐾</span>
                          <div className="flex flex-col">
                            <span className="text-gray-800 font-bold text-sm">
                              {banner.title}
                            </span>
                            {/* {banner.subtitle && (
                              <span className="text-gray-700 font-medium text-xs">
                                {banner.subtitle}
                              </span>
                            )} */}
                          </div>
                          <span className="text-lg">🐾</span>
                        </div>
                      ))
                    ).flat()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Search and Filters Row */}
          <div className="mb-6">
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              {/* Search Bar */}
              <div className="w-full lg:flex-1 lg:max-w-md">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className={`w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink text-sm ${
                        searchQuery ? 'pr-32' : 'pr-24'
                      }`}
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    
                    {/* Clear button - show when there's search text */}
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full p-1.5 transition-colors duration-200 border border-gray-300 hover:border-red-300 bg-white"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-pink text-white px-3 py-1 rounded-md text-sm hover:bg-primary-pink/90 transition-colors duration-200"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </div>

              {/* Desktop Filters Row - Collections, Sale, and Sort */}
              <div className="hidden sm:flex sm:flex-row gap-3 w-full lg:w-auto">
                {/* Collections with Clear Filter - Desktop only */}
                {collections.length > 0 && (
                  <div className="flex items-center gap-2">
                    <select
                      value={searchParams.collection || ''}
                      onChange={(e) => handleCollectionChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink text-sm min-w-0 flex-1 sm:flex-initial"
                    >
                      <option value="">All Collections</option>
                      {collections.map((collection) => (
                        <option key={collection.id} value={collection.name}>
                          {collection.name}
                        </option>
                      ))}
                    </select>
                    
                    {/* Clear Collection Filter - only show when collection is selected */}
                    {searchParams.collection && (
                      <button
                        onClick={() => handleCollectionChange('')}
                        className="px-3 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-sm"
                        title="Clear collection filter"
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                )}

                {/* Sale Filter and Sort on same line - Desktop */}
                <div className="flex items-center gap-3">
                  {/* Sale Filter */}
                  {hasProductsOnSale && (
                    <button
                      onClick={handleSaleToggle}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 sm:flex-initial ${
                        searchParams.sale === 'true'
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-text-dark hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      On Sale
                    </button>
                  )}

                  {/* Sort */}
                  <select
                    value={searchParams.sort || 'name'}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink text-sm min-w-0 flex-1 sm:flex-initial"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Mobile Sort Only Row */}
              <div className="sm:hidden">
                <select
                  value={searchParams.sort || 'name'}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Row */}
          <div className="mb-4">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 sm:px-5 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    (searchParams.category || 'All') === category
                      ? 'bg-primary-pink text-white shadow-lg'
                      : 'bg-white text-text-dark hover:bg-gray-100 border border-gray-300 hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Collections and Sale Row - Show only on small screens, below categories */}
          <div className="mb-8 sm:hidden">
            {/* Subtle separator line */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-auto mb-4"></div>
            
            <div className="flex flex-col gap-3">
              {/* Collections Row - Mobile */}
              {collections.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={searchParams.collection || ''}
                    onChange={(e) => handleCollectionChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink focus:border-primary-pink text-sm flex-1"
                  >
                    <option value="">All Collections</option>
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.name}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Clear Collection Filter - only show when collection is selected */}
                  {searchParams.collection && (
                    <button
                      onClick={() => handleCollectionChange('')}
                      className="px-3 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-sm"
                      title="Clear collection filter"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {/* Sale Filter Row - Mobile, less prominent */}
              {hasProductsOnSale && (
                <div className="flex justify-center">
                  <button
                    onClick={handleSaleToggle}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      searchParams.sale === 'true'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-md transform scale-105'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {searchParams.sale === 'true' ? '✓ On Sale' : 'View Sale Items'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          {/* <div className="mb-6">
            <p className="text-text-light">
              Showing {initialProducts.length} of {totalProducts} products
              {searchParams.category && searchParams.category !== 'All' && (
                <span> in {searchParams.category}</span>
              )}
              {searchParams.collection && (
                <span> from {searchParams.collection} collection</span>
              )}
              {searchParams.sale === 'true' && (
                <span> on sale</span>
              )}
            </p>
          </div> */}

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-12">
            {initialProducts.map((product) => {
              const discount = getDiscountPercentage(product)
              const displayPrice = getDisplayPrice(product)

              return (
                <div key={product.id} className={`group bg-white rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl hover:border-primary-pink/30 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1 ${!product.inStock ? 'opacity-75' : ''}`}>
                  {/* Image Container - Responsive Height */}
                  <div className="relative h-64 sm:h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    {product.onSale && product.saleQuantity && product.saleQuantity > 0 && product.inStock ? (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                          SALE
                        </span>
                      </div>
                    ): <> </>}
                    {discount > 0 && product.inStock && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                          {discount}% OFF
                        </span>
                      </div>
                    )}
                    {/* Image Overlay for Better Contrast */}
                    <div className="absolute inset-0 bg-white group-hover:bg-white/60 transition-colors duration-300"></div>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className={`object-contain group-hover:scale-110 transition-transform duration-500 relative z-10 ${!product.inStock ? 'grayscale opacity-60' : ''}`}
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-20">
                        <div className="bg-white bg-opacity-95 px-3 py-2 rounded-lg">
                          <p className="text-gray-800 font-semibold text-xs sm:text-sm">Out of Stock</p>
                        </div>
                      </div>
                    )}
                    {/* Decorative Corners - Hidden on mobile */}
                    <div className="hidden sm:block absolute bottom-0 right-0 w-8 h-8 bg-primary-pink/10 rounded-tl-full"></div>
                    <div className="hidden sm:block absolute top-0 left-0 w-8 h-8 bg-primary-pink/10 rounded-br-full"></div>
                  </div>

                  {/* Content Container - Mobile Optimized Layout */}
                  <div className="p-3 sm:p-5 flex flex-col flex-grow bg-gradient-to-b from-white to-gray-50/30">
                    {/* Product Name - Mobile Optimized Typography */}
                    <h3 className="font-heading font-semibold text-text-dark mb-2 sm:mb-4 truncate text-sm sm:text-lg leading-tight group-hover:text-primary-pink transition-colors duration-300" title={product.title}>
                      {product.title}
                    </h3>

                    {/* Mobile-First Price and Button Layout */}
                    <div className="mt-auto">
                      {/* Mobile Layout - Stacked */}
                      <div className="sm:hidden space-y-2">
                        {/* Price */}
                        <div className="text-center">
                          <span className="font-bold text-primary-pink text-sm tracking-tight">
                            {displayPrice}
                          </span>
                        </div>
                        {/* Button */}
                        <NavigationLink
                          href={`/products/${product.id}`}
                          className={`w-full py-2 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-1 ${
                            !product.inStock 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : 'bg-gradient-to-r from-primary-pink to-pink-600 text-white hover:from-pink-600 hover:to-primary-pink'
                          }`}
                        >
                          <span>View</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </NavigationLink>
                      </div>

                      {/* Desktop Layout - Side by Side */}
                      <div className="hidden sm:flex items-center justify-between">
                        {/* Price */}
                        <div className="flex flex-col">
                          <span className="font-bold text-primary-pink text-lg tracking-tight">
                            {displayPrice}
                          </span>
                        </div>

                        {/* Enhanced View Button */}
                        <NavigationLink
                          href={`/products/${product.id}`}
                          className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 ${
                            !product.inStock 
                              ? 'bg-gray-400 text-white cursor-not-allowed' 
                              : 'bg-gradient-to-r from-primary-pink to-pink-600 text-white hover:from-pink-600 hover:to-primary-pink'
                          }`}
                        >
                          <span>View</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </NavigationLink>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {initialProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
                <Filter className="w-full h-full" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-dark mb-2">
                No products found
              </h3>
              <p className="text-text-light mb-6">
                Try adjusting your filters or search terms
              </p>
              <NavigationLink
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
              >
                View All Products
              </NavigationLink>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-text-dark hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                const isCurrentPage = page === currentPage
                
                // Show first page, last page, current page, and 2 pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-lg ${
                        isCurrentPage
                          ? 'bg-primary-pink text-white'
                          : 'text-text-dark hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 3 ||
                  page === currentPage + 3
                ) {
                  return <span key={page} className="px-2 text-gray-400">...</span>
                }
                
                return null
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-text-dark hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}