'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import NavigationLink from '@/components/NavigationLink'
import { 
  ArrowLeft, 
  ShoppingCart, 
  Share2, 
  Star,
  Plus,
  Minus,
  Check,
  Info,
  X
} from 'lucide-react'
import { Product } from '@/lib/products'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SizeChart from '@/components/SizeChart'
import { toast } from 'sonner'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  size: string
  image: string
  category: string
  customName?: string
  bowStyle?: number
  bowStyleName?: string
  hasMatchingBowTie?: boolean
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  // State management
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [customName, setCustomName] = useState('')
  const [selectedBowStyle, setSelectedBowStyle] = useState<number | null>(null)
  const [hasMatchingBowTie, setHasMatchingBowTie] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  console.log('Related products:', relatedProducts)

  // Bow tie styles
  const bowTieStyles = [
    {
      id: 1,
      name: 'Elastic Slip-On',
      description: 'Elastic bands at back that slips over existing collar',
      details: 'Easy to attach, slips over existing collar'
    },
    {
      id: 2,
      name: 'Adjustable Strap', 
      description: 'Attached adjustable black strap with buckles',
      details: 'Standalone design with adjustable buckle'
    }
  ]

  // Load cart on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    }
  }, [])

  // Listen for cart changes from localStorage (for cross-tab updates)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        const newCart = e.newValue ? JSON.parse(e.newValue) : []
        setCartItems(newCart)
      }
    }

    const handleCartUpdated = () => {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleCartUpdated)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdated)
    }
  }, [])

  // Check if current product is in cart (any size/configuration)
  const getCartItemQuantity = () => {
    // If no size is selected, check if product exists in cart with any configuration
    if (!selectedSize) {
      const cartItem = cartItems.find(item => item.id === product.id)
      return cartItem?.quantity || 0
    }
    
    // If size is selected, check for exact match with current configuration
    const cartItem = cartItems.find(item => 
      item.id === product.id && 
      item.size === selectedSize &&
      item.customName === (customName || undefined) &&
      item.bowStyle === (selectedBowStyle || undefined) &&
      item.hasMatchingBowTie === (hasMatchingBowTie || undefined)
    )
    
    return cartItem?.quantity || 0
  }

  // Get total quantity of this product in cart (all configurations)
  const getTotalCartQuantity = () => {
    return cartItems
      .filter(item => item.id === product.id)
      .reduce((total, item) => total + item.quantity, 0)
  }

  // Handle cart indicator click - navigate to cart page
  const handleCartIndicatorClick = () => {
    window.location.href = '/cart'
  }

  // Helper function to get price for specific size
  const getPriceForSize = (size?: string, includeBowTie: boolean = false) => {
    let basePrice = product.price
    let originalPrice = product.originalPrice

    if (product.sizePricing && size) {
      const sizePrice = product.sizePricing.find(sp => sp.size === size)
      if (sizePrice) {
        basePrice = sizePrice.price
        originalPrice = sizePrice.originalPrice
      }
    }

    // Add bow tie cost if selected
    if (includeBowTie) {
      basePrice += 100
      if (originalPrice) originalPrice += 100
    }

    return { price: basePrice, originalPrice }
  }

  // Get price range for display when no size is selected
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

  // Get current pricing for display
  const getCurrentPricing = () => {
    return getPriceForSize(selectedSize, hasMatchingBowTie)
  }

  // Get display price - shows range when no size selected, specific price when size selected
  const getDisplayPriceText = () => {
    if (!selectedSize && product.sizePricing && product.sizePricing.length > 0) {
      return getDisplayPrice(product)
    }
    const { price } = getCurrentPricing()
    return `₹${price}`
  }

  // Get available images
  const getProductImages = () => {
    // Start with the main image
    const images = [product.image]
    // Add additional images if they exist
    if (product.images && product.images.length > 0) {
      images.push(...product.images)
    }
    return images
  }

  // Check if product is in cart
  const isInCart = () => {
    return cartItems.some(item => 
      item.id === product.id && 
      item.size === selectedSize &&
      item.customName === customName &&
      item.bowStyle === selectedBowStyle &&
      item.hasMatchingBowTie === hasMatchingBowTie
    )
  }

  // Add to cart function
  const addToCart = async () => {
    // Check stock availability first
    if (!product.inStock) {
      toast.error('This product is currently out of stock')
      return
    }

    // Validation
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }

    if (product.category === 'Bow ties' && selectedBowStyle === null) {
      toast.error('Please select a bow tie style')
      return
    }

    if (product.category === 'Treat Jars' && !customName.trim()) {
      toast.error('Please enter a custom name for the treat jar')
      return
    }

    setIsAddingToCart(true)

    try {
      const pricing = getCurrentPricing()
      const bowStyleData = selectedBowStyle ? bowTieStyles.find(bs => bs.id === selectedBowStyle) : null

      // Create cart item - include onSale status for cart validation
      const cartItem = {
        ...product,
        price: pricing.price,
        quantity,
        size: selectedSize,
        customName: customName || undefined,
        bowStyle: selectedBowStyle || undefined,
        bowStyleName: bowStyleData?.name || undefined,
        hasMatchingBowTie: hasMatchingBowTie || undefined
      }

      // Get current cart
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]')
      
      // Check if identical item exists
      const existingItemIndex = currentCart.findIndex((item: any) =>
        item.id === cartItem.id &&
        item.size === cartItem.size &&
        item.customName === cartItem.customName &&
        item.bowStyle === cartItem.bowStyle &&
        item.hasMatchingBowTie === cartItem.hasMatchingBowTie
      )

      if (existingItemIndex > -1) {
        // Update quantity
        currentCart[existingItemIndex].quantity += quantity
        toast.success(`Updated quantity in cart`)
      } else {
        // Add new item
        currentCart.push(cartItem)
        let message = `${product.title} added to cart`
        if (customName) message += ` with custom name "${customName}"`
        if (bowStyleData) message += ` (${bowStyleData.name})`
        toast.success(message)
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(currentCart))
      setCartItems(currentCart)
      
      // Dispatch cart updated event
      window.dispatchEvent(new Event('cartUpdated'))

    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  // Handle native share functionality
  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this amazing ${product.category.toLowerCase()}: ${product.title}`,
      url: window.location.href,
    }

    try {
      // Check if native sharing is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success('Product shared successfully!')
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard!')
      }
    } catch (error) {
      // If sharing fails or is cancelled, try clipboard fallback
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard!')
      } catch (clipboardError) {
        console.error('Share/clipboard error:', error, clipboardError)
        toast.error('Unable to share. Please copy the URL manually.')
      }
    }
  }

  // Get display price for related products (shows price range)
  const getRelatedProductDisplayPrice = (product: Product) => {
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

  const images = getProductImages()
  const { price, originalPrice } = getCurrentPricing()
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <>
      <Navbar />
      
      <main className="gradient-bg min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <NavigationLink href="/" className="text-text-light hover:text-primary-pink">
              Home
            </NavigationLink>
            <span className="text-text-light">/</span>
            <NavigationLink href="/products" className="text-text-light hover:text-primary-pink">
              Products
            </NavigationLink>
            <span className="text-text-light">/</span>
            <NavigationLink href={`/products?category=${product.category}`} className="text-text-light hover:text-primary-pink">
              {product.category}
            </NavigationLink>
            <span className="text-text-light">/</span>
            <span className="text-text-dark font-medium">{product.title}</span>
          </nav>

          {/* Back Button */}
          <NavigationLink 
            href="/products"
            className="inline-flex items-center space-x-2 text-text-light hover:text-primary-pink mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </NavigationLink>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
                {product.onSale && product.saleQuantity && product.saleQuantity > 0 ? (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      SALE
                    </span>
                  </div>
                ): null}
                {!product.inStock && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gray-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold border border-gray-300 shadow-md">
                      OUT OF STOCK
                    </span>
                  </div>
                )}
                {discount > 0 && selectedSize && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {discount}% OFF
                    </span>
                  </div>
                )}
                <Image
                  src={images[selectedImageIndex]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Thumbnail Images Gallery */}
              {images.length > 1 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-text-dark">Product Images</h4>
                  <div className="flex space-x-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                          selectedImageIndex === index 
                            ? 'border-primary-pink shadow-lg transform scale-105' 
                            : 'border-gray-200 hover:border-primary-pink hover:shadow-md'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${product.title} image ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                        {/* Active indicator */}
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-primary-pink bg-opacity-10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-primary-pink rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-text-light">
                    Click images to view larger version ({selectedImageIndex + 1} of {images.length})
                  </p>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Share */}
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-heading font-bold text-text-dark">
                  {product.title}
                </h1>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Share Product"
                >
                  <Share2 className="w-6 h-6 text-gray-600 hover:text-primary-pink" />
                </button>
              </div>
              
              {/* Price */}
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-primary-pink">
                    {getDisplayPriceText()}
                  </span>
                  {originalPrice && originalPrice > price && selectedSize ? (
                    <span className="text-xl text-text-light line-through">
                      ₹{originalPrice}
                    </span>
                  ) : null}
                  {discount > 0 && selectedSize && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      Save {discount}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-heading font-semibold text-text-dark mb-2">Description</h3>
                  <p className="text-text-light">{product.description}</p>
                </div>
              )}

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-text-dark">Size</h3>
                  <SizeChart />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(product.sizePricing?.map(sp => sp.size) || ['One Size']).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary-pink bg-primary-pink text-white'
                          : 'border-gray-300 hover:border-primary-pink'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bow Tie Style Selection for Bow ties */}
              {product.category === 'Bow ties' && (
                <div>
                  <h3 className="font-heading font-semibold text-text-dark mb-3">Bow Tie Style</h3>
                  <div className="space-y-3">
                    {bowTieStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedBowStyle === style.id
                            ? 'border-primary-pink bg-primary-pink/5'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedBowStyle(style.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedBowStyle === style.id
                              ? 'border-primary-pink bg-primary-pink'
                              : 'border-gray-300'
                          }`}>
                            {selectedBowStyle === style.id && (
                              <Check className="w-2 h-2 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-text-dark">{style.name}</h4>
                            <p className="text-sm text-text-light">{style.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Bow Tie for Collars */}
              {product.category === 'Collars' && (
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMatchingBowTie}
                      onChange={(e) => setHasMatchingBowTie(e.target.checked)}
                      className="w-4 h-4 text-primary-pink border-gray-300 rounded focus:ring-primary-pink"
                    />
                    <span className="text-text-dark">
                      Add Matching Bow Tie (+₹100)
                    </span>
                  </label>
                </div>
              )}

              {/* Custom Name for Treat Jars */}
              {product.category === 'Treat Jars' && (
                <div>
                  <label className="block font-heading font-semibold text-text-dark mb-2">
                    Custom Name *
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Enter pet's name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink"
                  />
                </div>
              )}

              {/* Quantity */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <h3 className="font-heading font-semibold text-text-dark">Quantity</h3>
                  {getTotalCartQuantity() > 0 && (
                    <button
                      onClick={handleCartIndicatorClick}
                      className="bg-primary-pink hover:bg-primary-pink/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md cursor-pointer"
                      title="Click to view cart"
                    >
                      🛒 In Cart ({getTotalCartQuantity()})
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                {!product.inStock && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 text-xl">⚠️</span>
                      <div>
                        <p className="text-red-800 font-semibold">Out of Stock</p>
                        <p className="text-red-700 text-sm">This item is currently unavailable.</p>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={addToCart}
                  disabled={!product.inStock || isAddingToCart || isInCart()}
                  className={`w-full py-4 px-6 rounded-lg font-heading font-semibold text-white transition-colors flex items-center justify-center space-x-2 ${
                    !product.inStock
                      ? 'bg-gray-400 cursor-not-allowed'
                      : isInCart()
                      ? 'bg-green-500 cursor-not-allowed'
                      : isAddingToCart
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-pink hover:bg-primary-pink/90'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>
                    {!product.inStock 
                      ? 'Out of Stock' 
                      : isInCart() 
                      ? 'In Cart' 
                      : isAddingToCart 
                      ? 'Adding...' 
                      : 'Add to Cart'
                    }
                  </span>
                </button>
              </div>

              {/* Product Details */}
              {product.details && product.details.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-text-dark mb-3">Product Details</h3>
                  <ul className="space-y-2">
                    {product.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-primary-pink rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-text-light">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Express Delivery Notice */}
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Info className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <p className="text-pink-800 font-medium">
                    For Express Delivery Contact Us
                  </p>
                </div>
                <p className="text-pink-700 text-sm mt-1 ml-7">
                  Need your order faster? Get in touch with us for express delivery options.
                </p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-heading font-bold text-text-dark mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedDisplayPrice = getRelatedProductDisplayPrice(relatedProduct)
                  // Get first size pricing for discount calculation (if exists)
                  const firstSizePricing = relatedProduct.sizePricing?.[0]
                  const relatedDiscount = firstSizePricing?.originalPrice 
                    ? Math.round(((firstSizePricing.originalPrice - firstSizePricing.price) / firstSizePricing.originalPrice) * 100)
                    : relatedProduct.originalPrice 
                    ? Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100)
                    : 0

                  return (
                    <NavigationLink 
                      key={relatedProduct.id}
                      href={`/products/${relatedProduct.id}`}
                      className="group"
                    >
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative aspect-square">
                          {relatedProduct.onSale && relatedProduct.saleQuantity && relatedProduct.saleQuantity > 0 && relatedProduct.inStock ? (
                            <div className="absolute top-2 left-2 z-10">
                              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                SALE
                              </span>
                            </div>
                          ): null}
                          {!relatedProduct.inStock && (
                            <div className="absolute top-2 left-2 z-10">
                              <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-xs font-bold border border-gray-300 shadow-md">
                                OUT OF STOCK
                              </span>
                            </div>
                          )}
                          {relatedDiscount > 0 && relatedProduct.inStock && (
                            <div className="absolute top-2 right-2 z-10">
                              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                {relatedDiscount}% OFF
                              </span>
                            </div>
                          )}
                          <Image
                            src={relatedProduct.image}
                            alt={relatedProduct.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-heading font-medium text-text-dark mb-2 group-hover:text-primary-pink transition-colors">
                            {relatedProduct.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-primary-pink">{relatedDisplayPrice}</span>
                            {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && !relatedProduct.sizePricing ? (
                              <span className="text-sm text-text-light line-through">₹{relatedProduct.originalPrice}</span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </NavigationLink>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}