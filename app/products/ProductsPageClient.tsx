'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Product } from '@/lib/products'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

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

  // Update URL and trigger server-side filtering
  const updateURL = (newParams: Record<string, string | undefined>) => {
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
    router.push(`/products${query}`)
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
      
      <main className="gradient-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-heading font-bold text-text-dark mb-4">
              Premium Pet Accessories
            </h1>
            <p className="text-xl text-text-light">
              Stylish and comfortable accessories for your furry friends
            </p>
          </div>

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

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Collections with Clear Filter */}
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

                {/* Sale Filter and Sort on same line */}
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
            </div>
          </div>

          {/* Categories Row */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-colors ${
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

          {/* Results Count */}
          <div className="mb-6">
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
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {initialProducts.map((product) => {
              const discount = getDiscountPercentage(product)
              const displayPrice = getDisplayPrice(product)

              return (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  {/* Image Container - Fixed Height */}
                  <div className="relative h-64 bg-gray-100">
                    {product.saleQuantity && product.saleQuantity > 0 ? (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          SALE
                        </span>
                      </div>
                    ): <> </>}
                    {discount > 0 && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {discount}% OFF
                        </span>
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content Container - Fixed Layout */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Product Name - Single Line with Ellipsis */}
                    <h3 className="font-heading font-medium text-text-dark mb-3 truncate text-lg leading-tight" title={product.title}>
                      {product.title}
                    </h3>

                    {/* Price and Button Container - Fixed at Bottom */}
                    <div className="mt-auto flex items-center justify-between">
                      {/* Price */}
                      <div className="flex flex-col">
                        <span className="font-bold text-primary-pink text-lg">
                          {displayPrice}
                        </span>
                        {/* {product.originalPrice && product.originalPrice > product.price && !product.sizePricing && (
                          <span className="text-sm text-text-light line-through">
                            ₹{product.originalPrice}
                          </span>
                        )} */}
                      </div>

                      {/* View Button */}
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-primary-pink text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-pink/90 transition-colors shadow-sm"
                      >
                        View
                      </Link>
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
              <Link
                href="/products"
                className="inline-flex items-center px-4 py-2 bg-primary-pink text-white rounded-lg hover:bg-primary-pink/90 transition-colors"
              >
                View All Products
              </Link>
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