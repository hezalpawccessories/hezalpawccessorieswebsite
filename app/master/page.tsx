'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
   Eye,
   EyeOff,
   Lock,
   Package,
   Plus,
   ShoppingBag,
   BarChart3,
   Edit,
   Trash2,
   X,
   Save,
   Search,
   Filter,
   ExternalLink,
   CreditCard,
   CheckCircle,
   XCircle,
   Clock,
   Image as ImageIcon,
   Copy,
} from 'lucide-react'
import { products as initialProducts, Product, sizes, SizePricing } from '@/lib/products'
import ProductModal from '../../components/ProductModal'
import { 
   addProduct, 
   deleteProduct, 
   updateProduct, 
   getProducts,
   Banner,
   addBanner,
   getBanners,
   updateBanner,
   deleteBanner,
   Collection,
   addCollection,
   getCollections,
   updateCollection,
   deleteCollection
} from '@/integrations/firebase/firestoreCollections'
import { getOrders, updateOrderStatus as updateOrderStatusFirebase, Order } from '@/lib/firebase/orders'
import { getPayments, PaymentLog } from '@/lib/firebase/payments'
import { v4 as uuidv4 } from 'uuid'
import { get } from 'node:http'
import { toast } from 'sonner'
import ProgressLink from '@/components/ProgressLink'
import { link } from 'node:fs'

// Declare cloudinary widget
declare global {
   interface Window {
      cloudinary: any
   }
}

export default function AdminDashboard() {
   const [isAuthenticated, setIsAuthenticated] = useState(
      (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true') || false
   )
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [activeTab, setActiveTab] = useState('products')
   const [products, setProducts] = useState<Product[]>([])
   const [orders, setOrders] = useState<Order[]>([])
   const [payments, setPayments] = useState<PaymentLog[]>([])
   const [showAddModal, setShowAddModal] = useState(false)
   const [showEditModal, setShowEditModal] = useState(false)
   const [showOrderModal, setShowOrderModal] = useState(false)
   const [showPaymentModal, setShowPaymentModal] = useState(false)
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
   const [selectedPayment, setSelectedPayment] = useState<PaymentLog | null>(null)
   const [searchQuery, setSearchQuery] = useState('')

   const [newProduct, setNewProduct] = useState({
      title: '',
      price: 0,
      originalPrice: 0,
      sizePricing: [{ size: 'XS', price: 0, originalPrice: 0 }], // Default size pricing
      image: '',
      images: [''], // Array for multiple images
      category: 'Collars',
      collection: '', // Add collection field
      description: '',
      details: [''],
      inStock: true,
      rating: 4.5,
      reviews: 0,
   })

   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

   const [uploadedImages, setUploadedImages] = useState<string[]>([]) // Store uploaded image URLs
   const [openProductModal, setOpenProductModal] = useState(false)

   // Collection management state
   const [collections, setCollections] = useState<Collection[]>([])
   const [newCollectionName, setNewCollectionName] = useState('')
   const [showAddCollection, setShowAddCollection] = useState(false)
   const [showManageCollections, setShowManageCollections] = useState(false)

   // Banner management state
   const [banners, setBanners] = useState<Banner[]>([])
   const [bannerForms, setBannerForms] = useState([{
      id: '',
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      type: 'general' as Banner['type'],
      isActive: true
   }])
   const [bannerImages, setBannerImages] = useState<string[]>([''])
   const [loadingBanners, setLoadingBanners] = useState(false)

   // Helper function to get price for specific size (same as Products page)
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

   // Helper function to get price range for display
   const getPriceRange = (product: Product) => {
      if (!product.sizePricing || product.sizePricing.length === 0) {
         return { minPrice: product.price, maxPrice: product.price, minOriginalPrice: product.originalPrice, maxOriginalPrice: product.originalPrice }
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

   useEffect(() => {
      // Only run on client side
      if (typeof window !== 'undefined') {
         // Load Cloudinary widget script
         const script = document.createElement('script')
         script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
         script.async = true
         document.head.appendChild(script)

         return () => {
            if (document.head.contains(script)) {
               document.head.removeChild(script)
            }
         }
      }
   }, [])

   const showUploadWidget = () => {
      if (typeof window !== 'undefined' && window.cloudinary) {
         window.cloudinary.openUploadWidget(
            {
               cloudName: 'dt2qyj4lj', // Replace with your cloudinary cloud name
               uploadPreset: 'product_images', // Replace with your upload preset
               sources: ['local', 'url', 'camera'],
               multiple: true,
               maxFiles: 10,
               resourceType: 'image',
               clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
               maxFileSize: 10000000, // 10MB
               styles: {
                  palette: {
                     window: '#FFFFFF',
                     windowBorder: '#90A0B3',
                     tabIcon: '#0078FF',
                     menuIcons: '#5A616A',
                     textDark: '#000000',
                     textLight: '#FFFFFF',
                     link: '#0078FF',
                     action: '#FF620C',
                     inactiveTabIcon: '#0E2F5A',
                     error: '#F44235',
                     inProgress: '#0078FF',
                     complete: '#20B832',
                     sourceBg: '#E4EBF1',
                  },
               },
            },
            (error: any, result: any) => {
               if (!error && result && result.event === 'success') {
                  console.log('Upload successful:', result.info)
                  setUploadedImages((prev) => [...prev, result.info.secure_url])
                  toast.success(`Image uploaded successfully!`, {
                     description: `${result.info.original_filename || 'New image'} is ready to use`,
                     duration: 3000,
                  })
               } else if (error) {
                  toast.error('Upload failed', {
                     description: 'Please try uploading the image again',
                     duration: 4000,
                  })
               }
            }
         )
      } else {
         toast.error('Upload widget not ready', {
            description: 'Please wait a moment and try again',
            duration: 3000,
         })
      }
   }

   const copyToClipboard = (text: string) => {
      if (typeof window !== 'undefined' && navigator.clipboard) {
         navigator.clipboard
            .writeText(text)
            .then(() => {
               toast.success('URL copied to clipboard!', {
                  duration: 2000,
               })
            })
            .catch(() => {
               toast.error('Failed to copy URL')
            })
      } else {
         toast.error('Clipboard not supported')
      }
   }

   const clearUploadedImages = () => {
      setUploadedImages([])
      toast.info('Uploaded images cleared', {
         description: 'All uploaded image URLs have been removed',
         duration: 2000,
      })
   }

   // Banner upload widget
   const showBannerUploadWidget = (bannerIndex: number) => {
      if (typeof window !== 'undefined' && window.cloudinary) {
         window.cloudinary.openUploadWidget(
            {
               cloudName: 'dt2qyj4lj',
               uploadPreset: 'product_images',
               sources: ['local', 'url', 'camera'],
               multiple: false,
               maxFiles: 1,
               resourceType: 'image',
               clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
               maxFileSize: 10000000, // 10MB
               styles: {
                  palette: {
                     window: '#FFFFFF',
                     windowBorder: '#90A0B3',
                     tabIcon: '#0078FF',
                     menuIcons: '#5A616A',
                     textDark: '#000000',
                     textLight: '#FFFFFF',
                     link: '#0078FF',
                     action: '#FF620C',
                     inactiveTabIcon: '#0E2F5A',
                     error: '#F44235',
                     inProgress: '#0078FF',
                     complete: '#20B832',
                     sourceBg: '#E4EBF1',
                  },
               },
            },
            (error: any, result: any) => {
               if (!error && result && result.event === 'success') {
                  const imageUrl = result.info.secure_url
                  setBannerImages(prev => {
                     const newImages = [...prev]
                     newImages[bannerIndex] = imageUrl
                     return newImages
                  })
                  setBannerForms(prev => {
                     const newForms = [...prev]
                     newForms[bannerIndex].imageUrl = imageUrl
                     return newForms
                  })
                  toast.success(`Banner image uploaded successfully!`, {
                     description: `${result.info.original_filename || 'Banner image'} is ready to use`,
                     duration: 3000,
                  })
               } else if (error) {
                  toast.error('Upload failed', {
                     description: 'Please try uploading the banner image again',
                     duration: 4000,
                  })
               }
            }
         )
      } else {
         toast.error('Upload widget not ready', {
            description: 'Please wait a moment and try again',
            duration: 3000,
         })
      }
   }

   // Banner management functions
   const addBannerForm = () => {
      setBannerForms(prev => [...prev, {
         id: '',
         title: '',
         subtitle: '',
         description: '',
         imageUrl: '',
         linkUrl: '',
         type: 'general',
         isActive: true
      }])
      setBannerImages(prev => [...prev, ''])
   }

   const removeBannerForm = (index: number) => {
      if (bannerForms.length > 1) {
         setBannerForms(prev => prev.filter((_, i) => i !== index))
         setBannerImages(prev => prev.filter((_, i) => i !== index))
      }
   }

   const updateBannerForm = (index: number, field: string, value: string | boolean) => {
      setBannerForms(prev => {
         const newForms = [...prev]
         newForms[index] = { ...newForms[index], [field]: value }
         return newForms
      })
   }

   const saveBanners = async () => {
      setLoadingBanners(true)
      try {
         const promises = bannerForms.map(async (banner) => {
            if (!banner.title || !banner.imageUrl) {
               throw new Error('Title and image are required for all banners')
            }

            const bannerId = banner.id || `banner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            const bannerData: Banner = {
               id: bannerId,
               title: banner.title,
               subtitle: banner.subtitle,
               description: banner.description,
               imageUrl: banner.imageUrl,
               linkUrl: banner.linkUrl,
               type: banner.type,
               isActive: banner.isActive,
               createdAt: new Date(),
               updatedAt: new Date()
            }

            return addBanner(bannerData)
         })

         await Promise.all(promises)
         await loadBanners()
         
         // Reset forms
         setBannerForms([{
            id: '',
            title: '',
            subtitle: '',
            description: '',
            imageUrl: '',
            linkUrl: '',
            type: 'general',
            isActive: true
         }])
         setBannerImages([''])

         toast.success('Banners saved successfully!', {
            description: `${bannerForms.length} banner(s) added to your collection`,
            duration: 3000,
         })
      } catch (error) {
         console.error('Error saving banners:', error)
         toast.error('Failed to save banners', {
            description: error instanceof Error ? error.message : 'Please try again',
            duration: 4000,
         })
      } finally {
         setLoadingBanners(false)
      }
   }

   const loadBanners = async () => {
      try {
         const fetchedBanners = await getBanners()
         setBanners(fetchedBanners.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      } catch (error) {
         console.error('Error loading banners:', error)
         toast.error('Failed to load banners', {
            description: 'There was an issue loading banners from the database',
            duration: 4000,
         })
      }
   }

   const deleteBannerById = async (bannerId: string) => {
      try {
         await deleteBanner(bannerId)
         await loadBanners()
         toast.success('Banner deleted successfully', {
            duration: 3000,
         })
      } catch (error) {
         console.error('Error deleting banner:', error)
         toast.error('Failed to delete banner', {
            description: 'Please try again',
            duration: 4000,
         })
      }
   }

   const toggleBannerStatus = async (bannerId: string, isActive: boolean) => {
      try {
         await updateBanner(bannerId, { isActive })
         await loadBanners()
         toast.success(`Banner ${isActive ? 'activated' : 'deactivated'} successfully`, {
            duration: 3000,
         })
      } catch (error) {
         console.error('Error updating banner status:', error)
         toast.error('Failed to update banner status', {
            description: 'Please try again',
            duration: 4000,
         })
      }
   }

   // Collection management functions
   const handleAddCollection = async () => {
      if (!newCollectionName.trim()) {
         toast.error('Please enter a collection name')
         return
      }

      try {
         const newCollection: Collection = {
            id: uuidv4(),
            name: newCollectionName.trim(),
            createdAt: new Date(),
            updatedAt: new Date()
         }

         await addCollection(newCollection)
         
         // Reload collections
         const fetchedCollections = await getCollections()
         setCollections(fetchedCollections)
         
         setNewCollectionName('')
         setShowAddCollection(false)
         
         toast.success('Collection added successfully', {
            description: `"${newCollection.name}" has been added to your collections`,
            duration: 3000,
         })
      } catch (error) {
         console.error('Error adding collection:', error)
         toast.error('Failed to add collection', {
            description: 'Please try again',
            duration: 4000,
         })
      }
   }

   const handleDeleteCollection = async (collectionId: string) => {
      try {
         await deleteCollection(collectionId)
         
         // Reload collections
         const fetchedCollections = await getCollections()
         setCollections(fetchedCollections)
         
         toast.success('Collection deleted successfully', {
            duration: 3000,
         })
      } catch (error) {
         console.error('Error deleting collection:', error)
         toast.error('Failed to delete collection', {
            description: 'Please try again',
            duration: 4000,
         })
      }
   }

   useEffect(() => {
      // Load orders from Firebase
      if (typeof window !== 'undefined') {
         getOrders()
            .then((result) => {
               if (result.success) {
                  setOrders(result.orders as Order[])
                  if (result.orders.length > 0) {
                     toast.success('Orders loaded successfully', {
                        description: `${result.orders.length} orders found`,
                        duration: 3000,
                     })
                  }
               }
            })
            .catch((error) => {
               console.error('Error fetching orders:', error)
               toast.error('Failed to load orders', {
                  description: 'There was an issue loading orders from the database',
                  duration: 4000,
               })
            })

         // Load payments from Firebase
         getPayments()
            .then((result) => {
               if (result.success) {
                  setPayments(result.payments)
                  console.log('Payments loaded:', result.payments.length)
               }
            })
            .catch((error) => {
               console.error('Error fetching payments:', error)
               toast.error('Failed to load payments', {
                  description: 'There was an issue loading payments from the database',
                  duration: 4000,
               })
            })
      }
      
      // Load products from Firestore
      getProducts()
         .then((fetchedProducts) => {
            setProducts(fetchedProducts)
            if (fetchedProducts.length > 0) {
               toast.success('Products loaded successfully', {
                  description: `${fetchedProducts.length} products found in your catalog`,
                  duration: 3000,
               })
            }
         })
         .catch((error) => {
            console.error('Error fetching products:', error)
            toast.error('Failed to load products', {
               description: 'There was an issue loading your products from the database',
               duration: 4000,
            })
         })

      // Load banners from Firestore
      loadBanners()

      // Load collections from Firestore
      getCollections()
         .then((fetchedCollections) => {
            setCollections(fetchedCollections)
         })
         .catch((error) => {
            console.error('Error fetching collections:', error)
         })
   }, [])

   const handleLogin = (e: React.FormEvent) => {
      e.preventDefault()
      if (password === '123') {
         setIsAuthenticated(true)
         setPassword('')
         if (typeof window !== 'undefined') {
            localStorage.setItem('isAuthenticated', 'true')
         }
         toast.success('Welcome to Admin Dashboard!', {
            description: 'You have successfully logged in',
            duration: 3000,
         })
      } else {
         toast.error('Access denied', {
            description: 'Incorrect password entered',
            duration: 3000,
         })
      }
   }

   const handleDeleteProduct = (productId: string) => {
      const productToDelete = products.find((p) => p.id === productId)
      if (confirm('Are you sure you want to delete this product?')) {
         deleteProduct(productId)
            .then(() => {
               console.log('Product deleted successfully')
               toast.success('Product deleted successfully!', {
                  description: `${productToDelete?.title || 'Product'} has been removed from your catalog`,
                  duration: 4000,
               })
            })
            .catch((error) => {
               console.error('Error deleting product:', error)
               toast.error('Failed to delete product', {
                  description: 'There was an issue deleting the product. Please try again.',
                  duration: 4000,
               })
            })
         const updatedProducts = products.filter((p) => p.id !== productId)
         setProducts(updatedProducts)
      }
   }

   const handleAddProduct = (e: React.FormEvent) => {
      e.preventDefault()
      
      // Validate that at least one size with pricing is added
      const validSizePricing = newProduct.sizePricing?.filter((sp) => sp.price > 0) || []
      if (validSizePricing.length === 0) {
         toast.error('Size-based pricing required', {
            description: 'Please add at least one size with pricing before saving the product.',
            duration: 4000,
         })
         return
      }
      
      const product: Product = {
         ...newProduct,
         id: uuidv4(),
         details: newProduct.details.filter((detail) => detail.trim() !== ''),
         images: newProduct.images.filter((imageUrl) => imageUrl.trim() !== ''),
         sizePricing: validSizePricing, // Only include sizes with prices
         price: 0, // Set to 0 since we're using size-based pricing only
         originalPrice: 0, // Set to 0 since we're using size-based pricing only
      }
      setProducts([...products, product])

      //~ adding product to Firestore
      addProduct(product)
         .then(() => {
            console.log('Product added successfully')
            toast.success('Product added successfully!', {
               description: `${product.title} has been added to your catalog`,
               duration: 4000,
            })
         })
         .catch((error) => {
            console.error('Error adding product:', error)
            toast.error('Failed to add product', {
               description: 'There was an issue saving the product. Please try again.',
               duration: 4000,
            })
         })

      setNewProduct({
         title: '',
         price: 0,
         originalPrice: 0,
         sizePricing: [{ size: 'XS', price: 0, originalPrice: 0 }],
         image: '',
         images: [''],
         category: 'Collars',
         collection: '',
         description: '',
         details: [''],
         inStock: true,
         rating: 4.5,
         reviews: 0,
      })
      setUploadedImages([]) // Clear uploaded images
      setShowAddModal(false)
   }

   const handleEditProduct = (e: React.FormEvent) => {
      e.preventDefault()
      if (selectedProduct) {
         // Validate that at least one size with pricing is added
         const validSizePricing = selectedProduct.sizePricing?.filter((sp) => sp.price > 0) || []
         if (validSizePricing.length === 0) {
            toast.error('Size-based pricing required', {
               description: 'Please add at least one size with pricing before saving the product.',
               duration: 4000,
            })
            return
         }
         
         const updatedProduct = {
            ...selectedProduct,
            images: selectedProduct.images?.filter((imageUrl) => imageUrl.trim() !== '') || [],
            sizePricing: validSizePricing, // Only include sizes with prices
            price: 0, // Set to 0 since we're using size-based pricing only
            originalPrice: 0, // Set to 0 since we're using size-based pricing only
         }
         const updatedProducts = products.map((p) => (p.id === selectedProduct.id ? updatedProduct : p))
         updateProduct(selectedProduct.id, updatedProduct)
            .then(() => {
               console.log('Product updated successfully')
               toast.success('Product updated successfully!', {
                  description: `${updatedProduct.title} has been updated`,
                  duration: 4000,
               })
            })
            .catch((error) => {
               console.error('Error updating product:', error)
               toast.error('Failed to update product', {
                  description: 'There was an issue updating the product. Please try again.',
                  duration: 4000,
               })
            })
         setProducts(updatedProducts)
         setShowEditModal(false)
         setSelectedProduct(null)
      }
   }

   const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
      try {
         const result = await updateOrderStatusFirebase(orderId, status)
         if (result.success) {
            const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, orderStatus: status } : order))
            setOrders(updatedOrders)
            toast.success('Order status updated', {
               description: `Order status changed to ${status}`,
               duration: 3000,
            })
         } else {
            toast.error('Failed to update order status', {
               description: result.error || 'Unknown error occurred',
               duration: 4000,
            })
         }
      } catch (error) {
         console.error('Error updating order status:', error)
         toast.error('Failed to update order status', {
            description: 'There was an issue updating the order',
            duration: 4000,
         })
      }
   }

   const filteredProducts = products.filter(
      (product) =>
         product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         product.category.toLowerCase().includes(searchQuery.toLowerCase())
   )

   if (!isAuthenticated) {
      return (
         <div className='min-h-screen bg-gradient-to-br from-primary-pink to-warm-orange flex items-center justify-center'>
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className='relative bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4'
            >
               <ProgressLink
                  href='/'
                  className='absolute top-8 left-8 rounded-lg bg-primary-pink text-white text-center p-2 font-semibold shadow-md hover:bg-primary-pink/80 transition-all hover:scale-95 duration-200 '
               >
                  <svg
                     xmlns='http://www.w3.org/2000/svg'
                     width='20'
                     height='20'
                     viewBox='0 0 20 20'
                  >
                     <path
                        fill='currentColor'
                        d='M18.178 11.373a.7.7 0 0 1 .7.7v5.874c.027.812-.071 1.345-.434 1.68c-.338.311-.828.4-1.463.366H3.144C2.5 19.961 2 19.7 1.768 19.173c-.154-.347-.226-.757-.226-1.228v-5.873a.7.7 0 0 1 1.4 0v5.873c0 .232.026.42.07.562l.036.098l-.003-.01c.001-.013.03-.008.132-.002h13.84c.245.014.401 0 .456-.001l.004-.001c-.013-.053.012-.27 0-.622v-5.897a.7.7 0 0 1 .701-.7ZM10.434 0c.264 0 .5.104.722.297l8.625 8.139a.7.7 0 1 1-.962 1.017l-8.417-7.944l-9.244 7.965a.7.7 0 0 1-.915-1.06L9.689.277l.086-.064c.214-.134.428-.212.66-.212Z'
                     />
                  </svg>
               </ProgressLink>
               <div className=' text-center mb-8'>
                  <Lock className='w-16 h-16 text-primary-pink mx-auto mb-4' />
                  <h1 className='text-2xl font-nunito font-extrabold text-text-dark leading-tight tracking-wide'>
                     Admin Access
                  </h1>
                  <p className='text-text-light'>Enter password to continue</p>
               </div>

               <form
                  onSubmit={handleLogin}
                  className='space-y-6'
               >
                  <div className='relative'>
                     <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter admin password'
                        className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue pr-12'
                        required
                     />
                     <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light'
                     >
                        {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                     </button>
                  </div>
                  <button
                     type='submit'
                     className='btn-primary w-full'
                  >
                     Access Dashboard
                  </button>
               </form>
            </motion.div>
         </div>
      )
   }

   const handleImageClick = (productId: string) => {
      const product = products.find((p) => p.id === productId)
      if (product) {
         setSelectedProduct(product)
         setOpenProductModal(true)
      }
   }

   return (
      <div className='min-h-screen gradient-bg'>
         {/* Header */}
         <div className='bg-white shadow-lg'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <div className='flex justify-between items-center h-16'>
                  <h1 className='text-3xl font-nunito font-extrabold text-text-dark leading-tight tracking-wide'>
                     Admin Dashboard
                  </h1>
                  <ProgressLink
                     href='/'
                     onClick={() => {
                        if (typeof window !== 'undefined') {
                           localStorage.setItem('isAuthenticated', 'false')
                        }
                        setIsAuthenticated(false)
                     }}
                     className='text-text-light hover:text-primary-pink'
                  >
                     Logout
                  </ProgressLink>
               </div>
            </div>
         </div>

         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 '>
            {/* Tabs */}
            <div className='flex space-x-1 bg-white p-1 rounded-lg mb-8 shadow-lg w-full sm:justify-center justify-around'>
               {[
                  { id: 'products', label: 'Products', icon: <Package className='w-5 h-5' /> },
                  { id: 'add-product', label: 'Add Product', icon: <Plus className='w-5 h-5' /> },
                  { id: 'add-banner', label: 'Add Banner', icon: <ImageIcon className='w-5 h-5' /> },
                  { id: 'orders', label: 'Orders', icon: <ShoppingBag className='w-5 h-5' /> },
                  { id: 'payments', label: 'Payments', icon: <CreditCard className='w-5 h-5' /> },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className='w-5 h-5' /> },
               ].map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center space-x-1 lg:space-x-2 px-3 py-1.5 lg:px-6 lg:py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id ? 'bg-primary-blue text-white' : 'text-text-light hover:text-primary-blue'
                     }`}
                  >
                     {tab.icon}
                     {!isMobile && <span>{tab.label}</span>}
                  </button>
               ))}
               <ProgressLink
                  href='/products'
                  className='flex items-center space-x-2 px-6 py-3 rounded-lg font-medium   bg-primary-pink text-white text-center  shadow-md hover:bg-primary-pink/80 transition-all hover:scale-95 duration-200 sm:text-base text-sm'
               >
                  Website
               </ProgressLink>
            </div>

            {openProductModal && selectedProduct && (
               <ProductModal
                  product={selectedProduct}
                  onClose={() => {
                     setOpenProductModal(false)
                     setSelectedProduct(null)
                  }}
               />
            )}

            {/* Tab Content */}
            <AnimatePresence mode='wait'>
               {activeTab === 'products' && (
                  <motion.div
                     key='products'
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className='space-y-6'
                  >
                     <div className='flex justify-between items-center'>
                        {!isMobile && (
                           <h2 className='text-2xl font-nunito font-extrabold text-text-dark leading-tight tracking-wide'>
                              Products Management
                           </h2>
                        )}
                        <div className='relative'>
                           <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light w-5 h-5' />
                           <input
                              type='text'
                              placeholder='Search products...'
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                           />
                        </div>
                     </div>

                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                        {filteredProducts.map((product) => (
                           <div
                              key={product.id}
                              className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105'
                           >
                              {/* {product.images && product.images.length > 0 ? (
                                 product.images.map((imageUrl) => (
                                    <Image
                                       key={imageUrl}
                                       src={imageUrl}
                                       alt={product.title}
                                       width={600}
                                       height={192}
                                       className='w-full h-48 object-cover hover:opacity-95 transition-all duration-400'
                                    />
                                 ))
                              ) : (
                                 <Image
                                    src={product.image}
                                    alt={product.title}
                                    width={600}
                                    height={192}
                                    className='w-full h-48 object-cover hover:opacity-95 transition-all duration-400'
                                 />
                              )} */}

                              <Image
                                 src={product.image}
                                 alt={product.title}
                                 width={600}
                                 height={192}
                                 className='w-full h-48 object-contain hover:opacity-95 transition-all duration-500 cursor-pointer'
                                 onClick={() => handleImageClick(product.id)}
                              />

                              <div className='p-4'>
                                 <h3 className='font-bold text-text-dark mb-2 hover:underline'>{product.title}</h3>
                                 <p className='text-text-light text-sm mb-2'>{product.category}</p>
                                 <div className='flex items-center justify-between mb-4'>
                                    <div className='flex flex-col'>
                                       {product.sizePricing && product.sizePricing.length > 0 ? (
                                          (() => {
                                             const { minPrice, maxPrice, minOriginalPrice, maxOriginalPrice } = getPriceRange(product)
                                             return (
                                                <div className='flex flex-col'>
                                                   <div className='flex items-center space-x-2'>
                                                      <span className='text-lg font-bold text-primary-pink'>
                                                         {minPrice === maxPrice ? `₹${minPrice}` : `₹${minPrice} - ₹${maxPrice}`}
                                                      </span>
                                                      {(minOriginalPrice === 0 && maxOriginalPrice === 0) ? "" : (
                                                         <>
                                                         {((minOriginalPrice && minOriginalPrice > 0) || (maxOriginalPrice && maxOriginalPrice > 0)) && (
                                                            <span className='text-sm text-text-light line-through'>
                                                               {minOriginalPrice === maxOriginalPrice && minOriginalPrice && minOriginalPrice > 0
                                                                  ? `₹${minOriginalPrice}`
                                                                  : minOriginalPrice && maxOriginalPrice && minOriginalPrice > 0 && maxOriginalPrice > 0
                                                                  ? `₹${minOriginalPrice} - ₹${maxOriginalPrice}`
                                                                  : ''}
                                                            </span>
                                                         )}
                                                         </>
                                                      )}
                                                   </div>
                                                   <span className='text-xs text-text-light'>
                                                      {product.sizePricing.length} size{product.sizePricing.length > 1 ? 's' : ''} available
                                                   </span>
                                                </div>
                                             )
                                          })()
                                       ) : (
                                          <span className='text-lg font-bold text-primary-pink'>₹{product.price}</span>
                                       )}
                                    </div>
                                    <span
                                       className={`px-2 py-1 rounded-full text-xs ${
                                          product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                       }`}
                                    >
                                       {product.inStock ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                 </div>

                                 <div className='flex space-x-2'>
                                    <button
                                       onClick={() => {
                                          setSelectedProduct({
                                             ...product,
                                             images: product.images || [''], // Ensure images array exists
                                          })
                                          setShowEditModal(true)
                                       }}
                                       className='flex-1 bg-primary-blue text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1'
                                    >
                                       <Edit className='w-4 h-4' />
                                       <span>Edit</span>
                                    </button>
                                    <button
                                       onClick={() => handleDeleteProduct(product.id)}
                                       className='flex-1 bg-red-500 text-white px-3 py-2 rounded-lg flex items-center justify-center space-x-1'
                                    >
                                       <Trash2 className='w-4 h-4' />
                                       <span>Delete</span>
                                    </button>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </motion.div>
               )}

               {activeTab === 'add-product' && (
                  <motion.div
                     key='add-product'
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                  >
                     <div className='bg-white rounded-lg shadow-lg p-6'>
                        <h2 className='text-2xl font-bold text-text-dark mb-6'>Add New Product</h2>
                        <form
                           onSubmit={handleAddProduct}
                           className='space-y-6'
                        >
                           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Product Title *
                                 </label>
                                 <input
                                    type='text'
                                    required
                                    value={newProduct.title}
                                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 />
                              </div>
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>Category *</label>
                                 <select
                                    required
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 >
                                    <option value='Bandana/neck scarf'>Bandana/neck scarf</option>
                                    <option value='Bow ties'>Bow ties</option>
                                    <option value='Collars'>Collars</option>
                                    <option value='Collar-leash set'>Collar-leash set</option>
                                    <option value='Treat Jars'>Treat Jars</option>
                                 </select>
                              </div>
                           </div>

                           {/* Collection Selection */}
                           <div className='space-y-4'>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Collection</label>
                              <div className='flex gap-2'>
                                 <select
                                    value={newProduct.collection || ''}
                                    onChange={(e) => setNewProduct({ ...newProduct, collection: e.target.value })}
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 >
                                    <option value=''>None</option>
                                    {collections.map((collection) => (
                                       <option key={collection.id} value={collection.name}>
                                          {collection.name}
                                       </option>
                                    ))}
                                 </select>
                                 <button
                                    type='button'
                                    onClick={() => setShowAddCollection(true)}
                                    className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2'
                                 >
                                    <Plus className='w-4 h-4' />
                                    Add Collection
                                 </button>
                                 {collections.length > 0 && (
                                    <button
                                       type='button'
                                       onClick={() => setShowManageCollections(!showManageCollections)}
                                       className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
                                    >
                                       <Edit className='w-4 h-4' />
                                       Manage
                                    </button>
                                 )}
                              </div>
                              
                              {/* Add Collection Modal */}
                              {showAddCollection && (
                                 <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
                                    <h4 className='text-sm font-medium text-text-dark mb-2'>Add New Collection</h4>
                                    <div className='flex gap-2'>
                                       <input
                                          type='text'
                                          placeholder='Collection name (e.g., Christmas, Independence Day)'
                                          value={newCollectionName}
                                          onChange={(e) => setNewCollectionName(e.target.value)}
                                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                          onKeyDown={(e) => {
                                             if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddCollection()
                                             }
                                          }}
                                       />
                                       <button
                                          type='button'
                                          onClick={handleAddCollection}
                                          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                                       >
                                          Add
                                       </button>
                                       <button
                                          type='button'
                                          onClick={() => {
                                             setShowAddCollection(false)
                                             setNewCollectionName('')
                                          }}
                                          className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                                       >
                                          Cancel
                                       </button>
                                    </div>
                                 </div>
                              )}
                              
                              {/* Manage Collections Section */}
                              {showManageCollections && collections.length > 0 && (
                                 <div className='p-4 border border-gray-200 rounded-lg bg-gray-50'>
                                    <h4 className='text-sm font-medium text-text-dark mb-3'>Manage Collections</h4>
                                    <div className='space-y-2 max-h-32 overflow-y-auto'>
                                       {collections.map((collection) => (
                                          <div key={collection.id} className='flex items-center justify-between bg-white p-3 rounded-lg shadow-sm'>
                                             <span className='text-sm font-medium text-text-dark'>{collection.name}</span>
                                             <button
                                                type='button'
                                                onClick={() => {
                                                   if (window.confirm(`Are you sure you want to delete the collection "${collection.name}"?`)) {
                                                      handleDeleteCollection(collection.id)
                                                   }
                                                }}
                                                className='px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center gap-1 text-xs'
                                             >
                                                <Trash2 className='w-3 h-3' />
                                                Delete
                                             </button>
                                          </div>
                                       ))}
                                    </div>
                                    <button
                                       type='button'
                                       onClick={() => setShowManageCollections(false)}
                                       className='mt-3 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm'
                                    >
                                       Close
                                    </button>
                                 </div>
                              )}
                           </div>

                           {/* Size-Based Pricing Section - Now Mandatory */}
                           <div className='space-y-4'>
                              <div className='flex items-center justify-between'>
                                 <label className='block text-sm font-medium text-text-dark'>Size-Based Pricing *</label>
                                 <button
                                    type='button'
                                    onClick={() => {
                                       const newSizePricing = [...(newProduct.sizePricing || [])]
                                       const availableSizes = sizes.filter(size => 
                                          !newSizePricing.some(sp => sp.size === size)
                                       )
                                       if (availableSizes.length > 0) {
                                          newSizePricing.push({ 
                                             size: availableSizes[0], 
                                             price: 0, 
                                             originalPrice: 0 
                                          })
                                          setNewProduct({ ...newProduct, sizePricing: newSizePricing })
                                       }
                                    }}
                                    className='px-3 py-1 bg-primary-blue text-white rounded-lg text-sm hover:bg-primary-blue/80'
                                 >
                                    Add Size
                                 </button>
                              </div>
                              
                              {newProduct.sizePricing && newProduct.sizePricing.length > 0 && (
                                 <div className='space-y-3'>
                                    {newProduct.sizePricing.map((sizePrice, index) => (
                                       <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                          <div className='flex-1'>
                                             <label className='block text-xs text-text-light mb-1'>Size</label>
                                             <select
                                                value={sizePrice.size}
                                                onChange={(e) => {
                                                   const newSizePricing = [...(newProduct.sizePricing || [])]
                                                   newSizePricing[index] = { ...newSizePricing[index], size: e.target.value }
                                                   setNewProduct({ ...newProduct, sizePricing: newSizePricing })
                                                }}
                                                className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-blue text-sm'
                                             >
                                                {sizes.map(size => (
                                                   <option key={size} value={size}>{size}</option>
                                                ))}
                                             </select>
                                          </div>
                                          <div className='flex-1'>
                                             <label className='block text-xs text-text-light mb-1'>Price</label>
                                             <input
                                                type='number'
                                                value={sizePrice.price}
                                                onChange={(e) => {
                                                   const newSizePricing = [...(newProduct.sizePricing || [])]
                                                   newSizePricing[index] = { ...newSizePricing[index], price: Number(e.target.value) }
                                                   setNewProduct({ ...newProduct, sizePricing: newSizePricing })
                                                }}
                                                className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-blue text-sm'
                                                placeholder='Price'
                                             />
                                          </div>
                                          <div className='flex-1'>
                                             <label className='block text-xs text-text-light mb-1'>Original Price</label>
                                             <input
                                                type='number'
                                                value={sizePrice.originalPrice || 0}
                                                onChange={(e) => {
                                                   const newSizePricing = [...(newProduct.sizePricing || [])]
                                                   newSizePricing[index] = { ...newSizePricing[index], originalPrice: Number(e.target.value) }
                                                   setNewProduct({ ...newProduct, sizePricing: newSizePricing })
                                                }}
                                                className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-blue text-sm'
                                                placeholder='Original Price'
                                             />
                                          </div>
                                          <button
                                             type='button'
                                             onClick={() => {
                                                const newSizePricing = (newProduct.sizePricing || []).filter((_, i) => i !== index)
                                                setNewProduct({ ...newProduct, sizePricing: newSizePricing })
                                             }}
                                             className='px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 self-end'
                                          >
                                             <X className='w-4 h-4' />
                                          </button>
                                       </div>
                                    ))}
                                 </div>
                              )}
                              
                              <p className='text-xs text-red-600 font-medium'>
                                 * At least one size with pricing is required. Please add size-specific pricing for your product.
                              </p>
                           </div>

                           {/* Image Upload Section */}
                           <div className='space-y-4'>
                              <div className='flex items-center justify-between'>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>Product Images</label>
                                 <div className='flex space-x-2'>
                                    <button
                                       type='button'
                                       onClick={showUploadWidget}
                                       className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                                    >
                                       Upload Images
                                    </button>
                                    {uploadedImages.length > 0 && (
                                       <button
                                          type='button'
                                          onClick={clearUploadedImages}
                                          className='px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                                       >
                                          Clear
                                       </button>
                                    )}
                                 </div>
                              </div>

                              {/* Display uploaded images */}
                              {uploadedImages.length > 0 && (
                                 <div className='bg-gray-50 p-4 rounded-lg'>
                                    <h4 className='text-sm font-medium text-text-dark mb-3'>
                                       Uploaded Images ({uploadedImages.length})
                                    </h4>
                                    <div className='space-y-3 max-h-60 overflow-y-auto'>
                                       {uploadedImages.map((url, index) => (
                                          <div
                                             key={index}
                                             className='flex items-center gap-3 bg-white p-3 rounded border shadow-sm'
                                          >
                                             {/* Image Preview */}
                                             <div className='flex-shrink-0'>
                                                <Image
                                                   src={url.replace(
                                                      '/upload/',
                                                      '/upload/w_64,h_64,c_fill,q_auto,f_auto/'
                                                   )}
                                                   alt={`Upload ${index + 1}`}
                                                   width={64}
                                                   height={64}
                                                   className='w-16 h-16 object-cover rounded-lg border-2 border-gray-200'
                                                   onError={(e) => {
                                                      const target = e.target as HTMLImageElement
                                                      target.style.display = 'none'
                                                   }}
                                                />
                                             </div>

                                             {/* URL and Controls */}
                                             <div className='flex-1 min-w-0'>
                                                <div className='flex items-center justify-between'>
                                                   <span className='text-sm font-medium text-gray-800 mb-1'>
                                                      Image {index + 1}
                                                   </span>
                                                   <button
                                                      type='button'
                                                      onClick={() => copyToClipboard(url)}
                                                      className='px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors'
                                                      title='Copy URL'
                                                   >
                                                      Copy URL
                                                   </button>
                                                </div>
                                                <p
                                                   className='text-xs text-gray-500 truncate'
                                                   title={url}
                                                >
                                                   {url}
                                                </p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* Main Image URL */}
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Main Image URL *
                                 </label>
                                 <input
                                    type='url'
                                    required
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                    placeholder='Paste main image URL here'
                                 />
                              </div>

                              {/* Additional Images */}
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Additional Images
                                 </label>
                                 {newProduct.images.map((imageUrl, index) => (
                                    <div
                                       key={index}
                                       className='flex space-x-2 mb-2'
                                    >
                                       <input
                                          type='url'
                                          value={imageUrl}
                                          onChange={(e) => {
                                             const newImages = [...newProduct.images]
                                             newImages[index] = e.target.value
                                             setNewProduct({ ...newProduct, images: newImages })
                                          }}
                                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                          placeholder='Additional image URL'
                                       />
                                       <button
                                          type='button'
                                          onClick={() => {
                                             const newImages = newProduct.images.filter((_, i) => i !== index)
                                             setNewProduct({ ...newProduct, images: newImages })
                                          }}
                                          className='px-3 py-2 bg-red-500 text-white rounded-lg'
                                       >
                                          <X className='w-4 h-4' />
                                       </button>
                                    </div>
                                 ))}
                                 <button
                                    type='button'
                                    onClick={() => setNewProduct({ ...newProduct, images: [...newProduct.images, ''] })}
                                    className='btn-secondary'
                                 >
                                    Add Image URL
                                 </button>
                              </div>
                           </div>

                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Description *</label>
                              <textarea
                                 required
                                 rows={3}
                                 value={newProduct.description}
                                 onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                              />
                           </div>

                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Product Details</label>
                              {newProduct.details.map((detail, index) => (
                                 <div
                                    key={index}
                                    className='flex space-x-2 mb-2'
                                 >
                                    <input
                                       type='text'
                                       value={detail}
                                       onChange={(e) => {
                                          const newDetails = [...newProduct.details]
                                          newDetails[index] = e.target.value
                                          setNewProduct({ ...newProduct, details: newDetails })
                                       }}
                                       className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                       placeholder='Product detail'
                                    />
                                    <button
                                       type='button'
                                       onClick={() => {
                                          const newDetails = newProduct.details.filter((_, i) => i !== index)
                                          setNewProduct({ ...newProduct, details: newDetails })
                                       }}
                                       className='px-3 py-2 bg-red-500 text-white rounded-lg'
                                    >
                                       <X className='w-4 h-4' />
                                    </button>
                                 </div>
                              ))}
                              <button
                                 type='button'
                                 onClick={() => setNewProduct({ ...newProduct, details: [...newProduct.details, ''] })}
                                 className='btn-secondary'
                              >
                                 Add Detail
                              </button>
                           </div>

                           <div className='flex items-center space-x-4'>
                              <label className='flex items-center'>
                                 <input
                                    type='checkbox'
                                    checked={newProduct.inStock}
                                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                                    className='mr-2'
                                 />
                                 In Stock
                              </label>
                           </div>

                           <button
                              type='submit'
                              className='btn-primary'
                           >
                              Add Product
                           </button>
                        </form>
                     </div>
                  </motion.div>
               )}

               {activeTab === 'add-banner' && (
                  <motion.div
                     key='add-banner'
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5 }}
                     className='bg-white rounded-xl shadow-lg p-6'
                  >
                     <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-heading font-bold text-text-dark'>Add Banner</h2>
                        <div className='flex gap-3'>
                           <button
                              onClick={addBannerForm}
                              className='btn-secondary px-4 py-2 flex items-center gap-2'
                           >
                              <Plus className='w-4 h-4' />
                              Add Another Banner
                           </button>
                           <button
                              onClick={saveBanners}
                              disabled={loadingBanners}
                              className='btn-primary px-6 py-2 flex items-center gap-2'
                           >
                              <Save className='w-4 h-4' />
                              {loadingBanners ? 'Saving...' : 'Save All Banners'}
                           </button>
                        </div>
                     </div>

                     <div className='space-y-8'>
                        {bannerForms.map((banner, index) => (
                           <div key={index} className='border border-gray-200 rounded-lg p-6 relative'>
                              {bannerForms.length > 1 && (
                                 <button
                                    onClick={() => removeBannerForm(index)}
                                    className='absolute top-4 right-4 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-full p-2 transition-colors'
                                 >
                                    <X className='w-4 h-4' />
                                 </button>
                              )}

                              <h3 className='text-lg font-semibold text-text-dark mb-4'>
                                 Banner {index + 1}
                              </h3>

                              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                 {/* Left Column - Basic Info */}
                                 <div className='space-y-4'>
                                    <div>
                                       <label className='block text-sm font-medium text-text-dark mb-2'>
                                          Banner Title *
                                       </label>
                                       <input
                                          type='text'
                                          value={banner.title}
                                          onChange={(e) => updateBannerForm(index, 'title', e.target.value)}
                                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent'
                                          placeholder='e.g., Festival Special'
                                          required
                                       />
                                    </div>

                                    <div>
                                       <label className='block text-sm font-medium text-text-dark mb-2'>
                                          Subtitle
                                       </label>
                                       <input
                                          type='text'
                                          value={banner.subtitle}
                                          onChange={(e) => updateBannerForm(index, 'subtitle', e.target.value)}
                                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent'
                                          placeholder='e.g., Get up to 40% OFF'
                                       />
                                    </div>

                                    <div>
                                       <label className='block text-sm font-medium text-text-dark mb-2'>
                                          Description
                                       </label>
                                       <textarea
                                          value={banner.description}
                                          onChange={(e) => updateBannerForm(index, 'description', e.target.value)}
                                          rows={3}
                                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent'
                                          placeholder='Brief description of the banner content'
                                       />
                                    </div>

                                    <div>
                                       <label className='block text-sm font-medium text-text-dark mb-2'>
                                          Banner Type
                                       </label>
                                       <select
                                          value={banner.type}
                                          onChange={(e) => updateBannerForm(index, 'type', e.target.value)}
                                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent'
                                       >
                                          <option value='general'>General</option>
                                          <option value='festival'>Festival</option>
                                          <option value='new-launch'>New Launch</option>
                                          <option value='sale'>Sale</option>
                                       </select>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                       <input
                                          type='checkbox'
                                          id={`active-${index}`}
                                          checked={banner.isActive}
                                          onChange={(e) => updateBannerForm(index, 'isActive', e.target.checked)}
                                          className='w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue'
                                       />
                                       <label htmlFor={`active-${index}`} className='text-sm font-medium text-text-dark'>
                                          Active Banner
                                       </label>
                                    </div>
                                 </div>

                                 {/* Right Column - Image & Link */}
                                 <div className='space-y-4'>
                                    <div>
                                       <label className='block text-sm font-medium text-text-dark mb-2'>
                                          Banner Image *
                                       </label>
                                       <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 text-center'>
                                          {bannerImages[index] ? (
                                             <div className='space-y-4'>
                                                <div className='relative'>
                                                   <Image
                                                      src={bannerImages[index]}
                                                      alt={`Banner ${index + 1}`}
                                                      width={400}
                                                      height={200}
                                                      className='w-full h-32 object-cover rounded-lg'
                                                   />
                                                </div>
                                                <div className='flex items-center gap-2 bg-gray-50 p-2 rounded'>
                                                   <input
                                                      type='text'
                                                      value={bannerImages[index]}
                                                      readOnly
                                                      className='flex-1 text-xs bg-transparent border-none focus:outline-none text-gray-600'
                                                   />
                                                   <button
                                                      onClick={() => copyToClipboard(bannerImages[index])}
                                                      className='text-primary-blue hover:text-primary-blue/80 p-1'
                                                      title='Copy URL'
                                                   >
                                                      <Copy className='w-4 h-4' />
                                                   </button>
                                                </div>
                                                <button
                                                   onClick={() => showBannerUploadWidget(index)}
                                                   className='btn-secondary w-full'
                                                >
                                                   Change Image
                                                </button>
                                             </div>
                                          ) : (
                                             <div className='space-y-4'>
                                                <ImageIcon className='w-12 h-12 text-gray-400 mx-auto' />
                                                <div>
                                                   <p className='text-gray-600 mb-4'>Upload a banner image</p>
                                                   <button
                                                      onClick={() => showBannerUploadWidget(index)}
                                                      className='btn-primary'
                                                   >
                                                      Upload Image
                                                   </button>
                                                </div>
                                             </div>
                                          )}
                                       </div>
                                    </div>

                                    <div>
                                       <label className='block text-sm font-medium text-text-dark mb-2'>
                                          Link URL (Optional)
                                       </label>
                                       <input
                                          type='url'
                                          value={banner.linkUrl}
                                          onChange={(e) => updateBannerForm(index, 'linkUrl', e.target.value)}
                                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent'
                                          placeholder='https://example.com/sale'
                                       />
                                       <p className='text-xs text-gray-500 mt-1'>
                                          URL to navigate when banner is clicked
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Existing Banners */}
                     {banners.length > 0 && (
                        <div className='mt-12'>
                           <h3 className='text-xl font-semibold text-text-dark mb-6'>Existing Banners</h3>
                           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                              {banners.map((banner) => (
                                 <div key={banner.id} className='border border-gray-200 rounded-lg overflow-hidden'>
                                    <div className='relative'>
                                       <Image
                                          src={banner.imageUrl}
                                          alt={banner.title}
                                          width={400}
                                          height={200}
                                          className='w-full h-32 object-cover'
                                       />
                                       <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                                          banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                       }`}>
                                          {banner.isActive ? 'Active' : 'Inactive'}
                                       </div>
                                    </div>
                                    <div className='p-4'>
                                       <h4 className='font-semibold text-text-dark mb-1'>{banner.title}</h4>
                                       <p className='text-sm text-gray-600 mb-2'>{banner.subtitle}</p>
                                       <div className='flex items-center justify-between'>
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                             banner.type === 'festival' ? 'bg-purple-100 text-purple-800' :
                                             banner.type === 'new-launch' ? 'bg-blue-100 text-blue-800' :
                                             banner.type === 'sale' ? 'bg-red-100 text-red-800' :
                                             'bg-gray-100 text-gray-800'
                                          }`}>
                                             {banner.type.replace('-', ' ')}
                                          </span>
                                          <div className='flex gap-2'>
                                             <button
                                                onClick={() => toggleBannerStatus(banner.id, !banner.isActive)}
                                                className={`p-1 rounded ${
                                                   banner.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                                                }`}
                                                title={banner.isActive ? 'Deactivate' : 'Activate'}
                                             >
                                                {banner.isActive ? <XCircle className='w-4 h-4' /> : <CheckCircle className='w-4 h-4' />}
                                             </button>
                                             <button
                                                onClick={() => deleteBannerById(banner.id)}
                                                className='p-1 text-red-600 hover:bg-red-50 rounded'
                                                title='Delete'
                                             >
                                                <Trash2 className='w-4 h-4' />
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </motion.div>
               )}

               {activeTab === 'orders' && (
                  <>
                     <motion.div
                        key='analytics'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                     >
                        <h2 className='text-2xl font-bold text-text-dark mb-6'>Orders Dashboard</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                           <div className='bg-white rounded-lg shadow-lg p-6'>
                              <h3 className='text-lg font-semibold text-text-dark mb-2'>Total Products</h3>
                              <p className='text-3xl font-bold text-primary-blue'>{products.length}</p>
                           </div>
                           <div className='bg-white rounded-lg shadow-lg p-6'>
                              <h3 className='text-lg font-semibold text-text-dark mb-2'>Total Orders</h3>
                              <p className='text-3xl font-bold text-primary-pink'>{orders.length}</p>
                           </div>
                           <div className='bg-white rounded-lg shadow-lg p-6'>
                              <h3 className='text-lg font-semibold text-text-dark mb-2'>Revenue</h3>
                              <p className='text-3xl font-bold text-warm-orange'>
                                 ₹{orders.reduce((sum, order) => sum + order.orderSummary.total, 0)}
                              </p>
                           </div>
                           <div className='bg-white rounded-lg shadow-lg p-6'>
                              <h3 className='text-lg font-semibold text-text-dark mb-2'>Delivered Orders</h3>
                              <p className='text-3xl font-bold text-light-purple'>
                                 {orders.filter((order) => order.orderStatus === 'delivered').length}
                              </p>
                           </div>
                        </div>
                     </motion.div>
                     <motion.div
                        key='orders'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                     >
                        <h2 className='text-2xl font-bold text-text-dark my-6'>Orders Management</h2>
                        {orders.length === 0 ? (
                           <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
                              <ShoppingBag className='w-16 h-16 text-text-light mx-auto mb-4' />
                              <p className='text-xl text-text-light'>No orders yet</p>
                           </div>
                        ) : (
                           <div className='space-y-4'>
                              {orders.map((order) => (
                                 <div
                                    key={order.id}
                                    className='bg-white rounded-lg shadow-lg p-6'
                                 >
                                    <div className='flex justify-between items-start mb-4'>
                                       <div>
                                          <h3 className='font-bold text-text-dark'>Order #{order.orderId}</h3>
                                          <p className='text-text-light'>
                                             {order.customerDetails.name} • {new Date(order.timestamps.createdAt.seconds * 1000).toLocaleDateString()}
                                          </p>
                                          <p className='text-text-light text-sm'>
                                             Payment: {order.paymentDetails.paymentStatus}
                                          </p>
                                       </div>
                                       <div className='flex items-center space-x-4'>
                                          <select
                                             value={order.orderStatus}
                                             onChange={(e) =>
                                                updateOrderStatus(order.id!, e.target.value as Order['orderStatus'])
                                             }
                                             className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                order.orderStatus === 'placed'
                                                   ? 'bg-blue-100 text-blue-800'
                                                   : order.orderStatus === 'confirmed'
                                                   ? 'bg-cyan-100 text-cyan-800'
                                                   : order.orderStatus === 'processing'
                                                   ? 'bg-yellow-100 text-yellow-800'
                                                   : order.orderStatus === 'shipped'
                                                   ? 'bg-purple-100 text-purple-800'
                                                   : order.orderStatus === 'delivered'
                                                   ? 'bg-green-100 text-green-800'
                                                   : 'bg-red-100 text-red-800'
                                             }`}
                                          >
                                             <option value='placed'>Placed</option>
                                             <option value='confirmed'>Confirmed</option>
                                             <option value='processing'>Processing</option>
                                             <option value='shipped'>Shipped</option>
                                             <option value='delivered'>Delivered</option>
                                             <option value='cancelled'>Cancelled</option>
                                          </select>
                                          <button
                                             onClick={() => {
                                                setSelectedOrder(order)
                                                setShowOrderModal(true)
                                             }}
                                             className='btn-secondary'
                                          >
                                             View Details
                                          </button>
                                       </div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                       <span className='text-text-light'>{order.items.length} items</span>
                                       <span className='text-xl font-bold text-primary-pink'>₹{order.orderSummary.total}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </motion.div>
                  </>
               )}

               {activeTab === 'payments' && (
                  <motion.div
                     key='payments'
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className='space-y-6'
                  >
                     <div className='flex justify-between items-center mb-6'>
                        <h2 className='text-2xl font-bold text-text-dark'>Payments Management</h2>
                        
                        {/* Payment Status Summary */}
                        <div className='flex space-x-4'>
                           <div className='flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full'>
                              <CheckCircle className='w-4 h-4 text-green-600' />
                              <span className='text-sm font-medium text-green-800'>
                                 Success: {payments.filter(p => p.paymentStatus === 'success').length}
                              </span>
                           </div>
                           <div className='flex items-center space-x-2 bg-red-100 px-3 py-1 rounded-full'>
                              <XCircle className='w-4 h-4 text-red-600' />
                              <span className='text-sm font-medium text-red-800'>
                                 Failed: {payments.filter(p => p.paymentStatus === 'failed').length}
                              </span>
                           </div>
                           <div className='flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full'>
                              <Clock className='w-4 h-4 text-yellow-600' />
                              <span className='text-sm font-medium text-yellow-800'>
                                 Pending: {payments.filter(p => p.paymentStatus === 'pending').length}
                              </span>
                           </div>
                        </div>
                     </div>

                     {payments.length === 0 ? (
                        <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
                           <CreditCard className='w-16 h-16 text-text-light mx-auto mb-4' />
                           <p className='text-xl text-text-light'>No payments yet</p>
                        </div>
                     ) : (
                        <div className='space-y-4'>
                           {payments.map((payment) => (
                              <div
                                 key={payment.id}
                                 className='bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow'
                              >
                                 <div className='flex justify-between items-start mb-4'>
                                    <div className='flex-1'>
                                       <div className='flex items-center space-x-3 mb-2'>
                                          <h3 className='font-bold text-text-dark'>#{payment.transactionId}</h3>
                                          <span
                                             className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                payment.paymentStatus === 'success'
                                                   ? 'bg-green-100 text-green-800'
                                                   : payment.paymentStatus === 'failed'
                                                   ? 'bg-red-100 text-red-800'
                                                   : payment.paymentStatus === 'pending'
                                                   ? 'bg-yellow-100 text-yellow-800'
                                                   : 'bg-gray-100 text-gray-800'
                                             }`}
                                          >
                                             {payment.paymentStatus.toUpperCase()}
                                          </span>
                                       </div>
                                       <p className='text-text-light text-sm'>
                                          {payment.customerDetails.name} • {payment.customerDetails.email}
                                       </p>
                                       <p className='text-text-light text-sm'>
                                          {new Date(payment.timestamps?.createdAt?.seconds * 1000).toLocaleString() || 'N/A'}
                                       </p>
                                       {payment.paymentMethod && (
                                          <p className='text-text-light text-sm capitalize'>
                                             Payment Method: {payment.paymentMethod}
                                          </p>
                                       )}
                                    </div>
                                    <div className='text-right'>
                                       <div className='text-2xl font-bold text-primary-pink mb-2'>
                                          ₹{payment.amount}
                                       </div>
                                       <button
                                          onClick={() => {
                                             setSelectedPayment(payment)
                                             setShowPaymentModal(true)
                                          }}
                                          className='btn-secondary text-sm px-4 py-2'
                                       >
                                          View Details
                                       </button>
                                    </div>
                                 </div>
                                 
                                 {payment.errorDetails && (
                                    <div className='mt-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                                       <p className='text-red-800 text-sm font-medium'>Error Details:</p>
                                       <p className='text-red-700 text-sm'>{payment.errorDetails.errorDescription}</p>
                                       {payment.errorDetails.failureReason && (
                                          <p className='text-red-700 text-sm'>Reason: {payment.errorDetails.failureReason}</p>
                                       )}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     )}
                  </motion.div>
               )}

               {activeTab === 'analytics' && (
                  <div className='py-12'>
                     <h1 className='text-3xl font-bold text-primary-blue mb-6'>Analytics</h1>
                     <p className='text-text-light mb-6'>
                        View your website analytics on Google Analytics. This includes real-time data on page views,
                        unique visitors, and more.
                     </p>
                     <div className='flex items-center justify-center mb-6 p-3 rounded-lg font-medium  bg-primary-blue text-white shadow-lg w-72 mx-auto'>
                        <a
                           href='https://analytics.google.com/analytics/web/?authuser=1&hl=en-US#/p497612222/reports/dashboard?r=firebase-overview'
                           target='_blank'
                           rel='noopener noreferrer'
                           className='flex items-center justify-center w-full h-full'
                           title='Open Google Analytics Dashboard'
                        >
                           Open Analytics Dashboard
                           <ExternalLink className='ml-2 mb-0.5 w-4 h-5' />
                        </a>
                     </div>
                  </div>
               )}
            </AnimatePresence>
         </div>

         {/* Edit Product Modal */}
         <AnimatePresence>
            {showEditModal && selectedProduct && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='modal-overlay'
                  onClick={() => setShowEditModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     className='modal-content max-w-2xl bg-white rounded-2xl shadow-2xl p-8 relative'
                     onClick={(e) => e.stopPropagation()}
                  >
                     <button
                        onClick={() => setShowEditModal(false)}
                        className='absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg'
                        title='Close'
                     >
                        <X className='w-5 h-5' />
                     </button>
                     <h2 className='text-2xl font-bold text-text-dark mb-6 font-nunito'>Edit Product</h2>
                     <form
                        onSubmit={handleEditProduct}
                        className='space-y-6'
                     >
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Product Title *</label>
                              <input
                                 type='text'
                                 required
                                 value={selectedProduct.title}
                                 onChange={(e) => setSelectedProduct({ ...selectedProduct, title: e.target.value })}
                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                              />
                           </div>
                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Category *</label>
                              <select
                                 required
                                 value={selectedProduct.category}
                                 onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                              >
                                 <option value='Bandana/neck scarf'>Bandana/neck scarf</option>
                                 <option value='Bow ties'>Bow ties</option>
                                 <option value='Collars'>Collars</option>
                                 <option value='Collar-leash set'>Collar-leash set</option>
                                 <option value='Treat Jars'>Treat Jars</option>
                              </select>
                           </div>
                        </div>

                        {/* Collection Selection in Edit Modal */}
                        <div className='space-y-4'>
                           <label className='block text-sm font-medium text-text-dark mb-2'>Collection</label>
                           <select
                              value={selectedProduct.collection || ''}
                              onChange={(e) => setSelectedProduct({ ...selectedProduct, collection: e.target.value })}
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                           >
                              <option value=''>None</option>
                              {collections.map((collection) => (
                                 <option key={collection.id} value={collection.name}>
                                    {collection.name}
                                 </option>
                              ))}
                           </select>
                        </div>

                        {/* Size-Based Pricing Section in Edit Modal - Now Mandatory */}
                        <div className='space-y-4'>
                           <div className='flex items-center justify-between'>
                              <label className='block text-sm font-medium text-text-dark'>Size-Based Pricing *</label>
                              <button
                                 type='button'
                                 onClick={() => {
                                    const newSizePricing = [...(selectedProduct.sizePricing || [])]
                                    const availableSizes = sizes.filter(size => 
                                       !newSizePricing.some(sp => sp.size === size)
                                    )
                                    if (availableSizes.length > 0) {
                                       newSizePricing.push({ 
                                          size: availableSizes[0], 
                                          price: 0, 
                                          originalPrice: 0 
                                       })
                                       setSelectedProduct({ ...selectedProduct, sizePricing: newSizePricing })
                                    }
                                 }}
                                 className='px-3 py-1 bg-primary-blue text-white rounded-lg text-sm hover:bg-primary-blue/80'
                              >
                                 Add Size
                              </button>
                           </div>
                           
                           {selectedProduct.sizePricing && selectedProduct.sizePricing.length > 0 && (
                              <div className='space-y-3'>
                                 {selectedProduct.sizePricing.map((sizePrice, index) => (
                                    <div key={index} className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                       <div className='flex-1'>
                                          <label className='block text-xs text-text-light mb-1'>Size</label>
                                          <select
                                             value={sizePrice.size}
                                             onChange={(e) => {
                                                const newSizePricing = [...(selectedProduct.sizePricing || [])]
                                                newSizePricing[index] = { ...newSizePricing[index], size: e.target.value }
                                                setSelectedProduct({ ...selectedProduct, sizePricing: newSizePricing })
                                             }}
                                             className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-blue text-sm'
                                          >
                                             {sizes.map(size => (
                                                <option key={size} value={size}>{size}</option>
                                             ))}
                                          </select>
                                       </div>
                                       <div className='flex-1'>
                                          <label className='block text-xs text-text-light mb-1'>Price</label>
                                          <input
                                             type='number'
                                             value={sizePrice.price}
                                             onChange={(e) => {
                                                const newSizePricing = [...(selectedProduct.sizePricing || [])]
                                                newSizePricing[index] = { ...newSizePricing[index], price: Number(e.target.value) }
                                                setSelectedProduct({ ...selectedProduct, sizePricing: newSizePricing })
                                             }}
                                             className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-blue text-sm'
                                             placeholder='Price'
                                          />
                                       </div>
                                       <div className='flex-1'>
                                          <label className='block text-xs text-text-light mb-1'>Original Price</label>
                                          <input
                                             type='number'
                                             value={sizePrice.originalPrice || 0}
                                             onChange={(e) => {
                                                const newSizePricing = [...(selectedProduct.sizePricing || [])]
                                                newSizePricing[index] = { ...newSizePricing[index], originalPrice: Number(e.target.value) }
                                                setSelectedProduct({ ...selectedProduct, sizePricing: newSizePricing })
                                             }}
                                             className='w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-blue text-sm'
                                             placeholder='Original Price'
                                          />
                                       </div>
                                       <button
                                          type='button'
                                          onClick={() => {
                                             const newSizePricing = (selectedProduct.sizePricing || []).filter((_, i) => i !== index)
                                             setSelectedProduct({ ...selectedProduct, sizePricing: newSizePricing })
                                          }}
                                          className='px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 self-end'
                                       >
                                          <X className='w-4 h-4' />
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           )}
                           
                           <p className='text-xs text-red-600 font-medium'>
                              * At least one size with pricing is required. Please add size-specific pricing for your product.
                           </p>
                        </div>

                        {/* Image Upload Section */}
                           <div className='space-y-4'>
                              <div className='flex items-center justify-between'>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>Product Images</label>
                                 <div className='flex space-x-2'>
                                    <button
                                       type='button'
                                       onClick={showUploadWidget}
                                       className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
                                    >
                                       Upload Images
                                    </button>
                                    {uploadedImages.length > 0 && (
                                       <button
                                          type='button'
                                          onClick={clearUploadedImages}
                                          className='px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
                                       >
                                          Clear
                                       </button>
                                    )}
                                 </div>
                              </div>

                              {/* Display uploaded images */}
                              {uploadedImages.length > 0 && (
                                 <div className='bg-gray-50 p-4 rounded-lg'>
                                    <h4 className='text-sm font-medium text-text-dark mb-3'>
                                       Uploaded Images ({uploadedImages.length})
                                    </h4>
                                    <div className='space-y-3 max-h-60 overflow-y-auto'>
                                       {uploadedImages.map((url, index) => (
                                          <div
                                             key={index}
                                             className='flex items-center gap-3 bg-white p-3 rounded border shadow-sm'
                                          >
                                             {/* Image Preview */}
                                             <div className='flex-shrink-0'>
                                                <Image
                                                   src={url.replace(
                                                      '/upload/',
                                                      '/upload/w_64,h_64,c_fill,q_auto,f_auto/'
                                                   )}
                                                   alt={`Upload ${index + 1}`}
                                                   width={64}
                                                   height={64}
                                                   className='w-16 h-16 object-cover rounded-lg border-2 border-gray-200'
                                                   onError={(e) => {
                                                      const target = e.target as HTMLImageElement
                                                      target.style.display = 'none'
                                                   }}
                                                />
                                             </div>

                                             {/* URL and Controls */}
                                             <div className='flex-1 min-w-0'>
                                                <div className='flex items-center justify-between'>
                                                   <span className='text-sm font-medium text-gray-800 mb-1'>
                                                      Image {index + 1}
                                                   </span>
                                                   <button
                                                      type='button'
                                                      onClick={() => copyToClipboard(url)}
                                                      className='px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors'
                                                      title='Copy URL'
                                                   >
                                                      Copy URL
                                                   </button>
                                                </div>
                                                <p
                                                   className='text-xs text-gray-500 truncate'
                                                   title={url}
                                                >
                                                   {url}
                                                </p>
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              )}

                              {/* Main Image URL */}
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Main Image URL *
                                 </label>
                                 <input
                                    type='url'
                                    required
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                    placeholder='Paste main image URL here'
                                 />
                              </div>

                              {/* Additional Images */}
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Additional Images
                                 </label>
                                 {newProduct.images.map((imageUrl, index) => (
                                    <div
                                       key={index}
                                       className='flex space-x-2 mb-2'
                                    >
                                       <input
                                          type='url'
                                          value={imageUrl}
                                          onChange={(e) => {
                                             const newImages = [...newProduct.images]
                                             newImages[index] = e.target.value
                                             setNewProduct({ ...newProduct, images: newImages })
                                          }}
                                          className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                          placeholder='Additional image URL'
                                       />
                                       <button
                                          type='button'
                                          onClick={() => {
                                             const newImages = newProduct.images.filter((_, i) => i !== index)
                                             setNewProduct({ ...newProduct, images: newImages })
                                          }}
                                          className='px-3 py-2 bg-red-500 text-white rounded-lg'
                                       >
                                          <X className='w-4 h-4' />
                                       </button>
                                    </div>
                                 ))}
                                 <button
                                    type='button'
                                    onClick={() => setNewProduct({ ...newProduct, images: [...newProduct.images, ''] })}
                                    className='btn-secondary'
                                 >
                                    Add Image URL
                                 </button>
                              </div>
                           </div>

                        {/* Images Section in Edit Modal */}
                        <div>
                           <label className='block text-sm font-medium text-text-dark mb-2'>Main Image URL *</label>
                           <input
                              type='url'
                              required
                              value={selectedProduct.image}
                              onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                           />
                        </div>

                        {/* Additional Images in Edit Modal */}
                        <div>
                           <label className='block text-sm font-medium text-text-dark mb-2'>Additional Images</label>
                           {(selectedProduct.images || ['']).map((imageUrl, index) => (
                              <div
                                 key={index}
                                 className='flex space-x-2 mb-2'
                              >
                                 <input
                                    type='url'
                                    value={imageUrl}
                                    onChange={(e) => {
                                       const newImages = [...(selectedProduct.images || [''])]
                                       newImages[index] = e.target.value
                                       setSelectedProduct({ ...selectedProduct, images: newImages })
                                    }}
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                                    placeholder='Additional image URL'
                                 />
                                 <button
                                    type='button'
                                    onClick={() => {
                                       const newImages = (selectedProduct.images || ['']).filter((_, i) => i !== index)
                                       setSelectedProduct({ ...selectedProduct, images: newImages })
                                    }}
                                    className='px-3 py-2 bg-red-500 text-white rounded-lg'
                                 >
                                    <X className='w-4 h-4' />
                                 </button>
                              </div>
                           ))}
                           <button
                              type='button'
                              onClick={() =>
                                 setSelectedProduct({
                                    ...selectedProduct,
                                    images: [...(selectedProduct.images || ['']), ''],
                                 })
                              }
                              className='btn-secondary mt-2'
                           >
                              Add Image URL
                           </button>
                        </div>

                        <div>
                           <label className='block text-sm font-medium text-text-dark mb-2'>Description *</label>
                           <textarea
                              required
                              rows={3}
                              value={selectedProduct.description}
                              onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                           />
                        </div>
                        <div>
                           <label className='block text-sm font-medium text-text-dark mb-2'>Product Details</label>
                           {selectedProduct.details.map((detail, index) => (
                              <div
                                 key={index}
                                 className='flex space-x-2 mb-2'
                              >
                                 <input
                                    type='text'
                                    value={detail}
                                    onChange={(e) => {
                                       const newDetails = [...selectedProduct.details]
                                       newDetails[index] = e.target.value
                                       setSelectedProduct({ ...selectedProduct, details: newDetails })
                                    }}
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                                    placeholder='Product detail'
                                 />
                                 <button
                                    type='button'
                                    onClick={() => {
                                       const newDetails = selectedProduct.details.filter((_, i) => i !== index)
                                       setSelectedProduct({ ...selectedProduct, details: newDetails })
                                    }}
                                    className='px-3 py-2 bg-red-500 text-white rounded-lg'
                                    title='Remove detail'
                                 >
                                    <X className='w-4 h-4' />
                                 </button>
                              </div>
                           ))}
                           <button
                              type='button'
                              onClick={() =>
                                 setSelectedProduct({ ...selectedProduct, details: [...selectedProduct.details, ''] })
                              }
                              className='btn-secondary mt-2'
                           >
                              Add Detail
                           </button>
                        </div>
                        <div className='flex items-center space-x-4'>
                           <label className='flex items-center'>
                              <input
                                 type='checkbox'
                                 checked={selectedProduct.inStock}
                                 onChange={(e) => setSelectedProduct({ ...selectedProduct, inStock: e.target.checked })}
                                 className='mr-2'
                              />
                              In Stock
                           </label>
                        </div>
                        <button
                           type='submit'
                           className='btn-primary w-full mt-4 flex items-center justify-center space-x-2'
                        >
                           <Save className='w-5 h-5' />
                           <span>Update Product</span>
                        </button>
                     </form>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Order Details Modal */}
         <AnimatePresence>
            {showOrderModal && selectedOrder && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='modal-overlay'
                  onClick={() => setShowOrderModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     className='modal-content max-w-2xl'
                     onClick={(e) => e.stopPropagation()}
                  >
                     <button
                        onClick={() => setShowOrderModal(false)}
                        className='absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg'
                     >
                        <X className='w-5 h-5' />
                     </button>

                     <div className='p-6'>
                        <h2 className='text-2xl font-bold text-text-dark mb-6'>Order Details #{selectedOrder.orderId}</h2>

                        <div className='space-y-4 mb-6'>
                           <div>
                              <h3 className='font-semibold text-text-dark'>Customer Information</h3>
                              <p className='text-text-light'>Name: {selectedOrder.customerDetails.name}</p>
                              <p className='text-text-light'>Email: {selectedOrder.customerDetails.email}</p>
                              <p className='text-text-light'>Phone: {selectedOrder.customerDetails.phone}</p>
                              <p className='text-text-light'>Address: {selectedOrder.customerDetails.address}</p>
                              <p className='text-text-light'>Pincode: {selectedOrder.customerDetails.pincode}</p>
                              {selectedOrder.customerDetails.alternatePhone && (
                                 <p className='text-text-light'>Alternate Phone: {selectedOrder.customerDetails.alternatePhone}</p>
                              )}
                           </div>

                           <div>
                              <h3 className='font-semibold text-text-dark'>Order Status & Timestamps</h3>
                              <p className='text-text-light'>Status: <span className='font-medium capitalize'>{selectedOrder.orderStatus}</span></p>
                              <p className='text-text-light'>Order Date: {new Date(selectedOrder.timestamps.createdAt.seconds * 1000).toLocaleString()}</p>
                              {selectedOrder.timestamps.paidAt && (
                                 <p className='text-text-light'>Paid At: {new Date(selectedOrder.timestamps.paidAt.seconds * 1000).toLocaleString()}</p>
                              )}
                              {selectedOrder.timestamps.shippedAt && (
                                 <p className='text-text-light'>Shipped At: {new Date(selectedOrder.timestamps.shippedAt.seconds * 1000).toLocaleString()}</p>
                              )}
                              {selectedOrder.timestamps.deliveredAt && (
                                 <p className='text-text-light'>Delivered At: {new Date(selectedOrder.timestamps.deliveredAt.seconds * 1000).toLocaleString()}</p>
                              )}
                           </div>

                           <div>
                              <h3 className='font-semibold text-text-dark'>Payment Information</h3>
                              <p className='text-text-light'>Payment Status: <span className='font-medium capitalize'>{selectedOrder.paymentDetails.paymentStatus}</span></p>
                              <p className='text-text-light'>Razorpay Order ID: {selectedOrder.paymentDetails.razorpayOrderId}</p>
                              {selectedOrder.paymentDetails.razorpayPaymentId && (
                                 <p className='text-text-light'>Payment ID: {selectedOrder.paymentDetails.razorpayPaymentId}</p>
                              )}
                              {selectedOrder.paymentDetails.paymentMethod && (
                                 <p className='text-text-light'>Payment Method: <span className='capitalize'>{selectedOrder.paymentDetails.paymentMethod}</span></p>
                              )}
                           </div>

                           <div>
                              <h3 className='font-semibold text-text-dark'>Order Items</h3>
                              <div className='space-y-2'>
                                 {selectedOrder.items.map((item, index) => (
                                    <div
                                       key={index}
                                       className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                                    >
                                       <div className='flex items-center space-x-3'>
                                          <Image 
                                             src={item.image} 
                                             alt={item.title}
                                             width={40}
                                             height={40}
                                             className='w-10 h-10 object-cover rounded'
                                          />
                                          <div>
                                             <span className='font-medium'>{item.title}</span>
                                             <p className='text-sm text-text-light'>Size: {item.size} • Category: {item.category}</p>
                                          </div>
                                       </div>
                                       <span className='font-medium'>
                                          Qty: {item.quantity} × ₹{item.price}
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className='bg-gray-50 p-4 rounded-lg'>
                              <div className='space-y-2'>
                                 <div className='flex justify-between'>
                                    <span>Subtotal:</span>
                                    <span>₹{selectedOrder.orderSummary.subtotal}</span>
                                 </div>
                                 <div className='flex justify-between'>
                                    <span>Shipping:</span>
                                    <span>₹{selectedOrder.orderSummary.shipping}</span>
                                 </div>
                                 <div className='flex justify-between items-center text-lg font-bold border-t pt-2'>
                                    <span>Total Amount:</span>
                                    <span className='text-primary-pink'>₹{selectedOrder.orderSummary.total}</span>
                                 </div>
                              </div>
                           </div>

                           {selectedOrder.trackingInfo && (
                              <div>
                                 <h3 className='font-semibold text-text-dark'>Tracking Information</h3>
                                 {selectedOrder.trackingInfo.trackingNumber && (
                                    <p className='text-text-light'>Tracking Number: {selectedOrder.trackingInfo.trackingNumber}</p>
                                 )}
                                 {selectedOrder.trackingInfo.carrier && (
                                    <p className='text-text-light'>Carrier: {selectedOrder.trackingInfo.carrier}</p>
                                 )}
                                 {selectedOrder.trackingInfo.estimatedDelivery && (
                                    <p className='text-text-light'>Estimated Delivery: {new Date(selectedOrder.trackingInfo.estimatedDelivery.seconds * 1000).toLocaleDateString()}</p>
                                 )}
                              </div>
                           )}

                           {selectedOrder.notes && (
                              <div>
                                 <h3 className='font-semibold text-text-dark'>Notes</h3>
                                 <p className='text-text-light'>{selectedOrder.notes}</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Payment Details Modal */}
         <AnimatePresence>
            {showPaymentModal && selectedPayment && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='modal-overlay'
                  onClick={() => setShowPaymentModal(false)}
               >
                  <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.8, opacity: 0 }}
                     className='modal-content max-w-3xl'
                     onClick={(e) => e.stopPropagation()}
                  >
                     <button
                        onClick={() => setShowPaymentModal(false)}
                        className='absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg'
                     >
                        <X className='w-5 h-5' />
                     </button>

                     <div className='p-6'>
                        <div className='flex items-center space-x-3 mb-6'>
                           <h2 className='text-2xl font-bold text-text-dark'>Payment Details</h2>
                           <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                 selectedPayment.paymentStatus === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : selectedPayment.paymentStatus === 'failed'
                                    ? 'bg-red-100 text-red-800'
                                    : selectedPayment.paymentStatus === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                           >
                              {selectedPayment.paymentStatus.toUpperCase()}
                           </span>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                           <div className='space-y-4'>
                              <div>
                                 <h3 className='font-semibold text-text-dark mb-2'>Transaction Information</h3>
                                 <div className='space-y-1 text-sm'>
                                    <p><span className='font-medium'>Transaction ID:</span> {selectedPayment.transactionId}</p>
                                    <p><span className='font-medium'>Razorpay Order ID:</span> {selectedPayment.razorpayOrderId}</p>
                                    {selectedPayment.razorpayPaymentId && (
                                       <p><span className='font-medium'>Payment ID:</span> {selectedPayment.razorpayPaymentId}</p>
                                    )}
                                    {selectedPayment.razorpaySignature && (
                                       <p><span className='font-medium'>Signature:</span> <span className='font-mono text-xs break-all'>{selectedPayment.razorpaySignature}</span></p>
                                    )}
                                 </div>
                              </div>

                              <div>
                                 <h3 className='font-semibold text-text-dark mb-2'>Payment Details</h3>
                                 <div className='space-y-1 text-sm'>
                                    <p><span className='font-medium'>Amount:</span> ₹{selectedPayment.amount}</p>
                                    <p><span className='font-medium'>Currency:</span> {selectedPayment.currency}</p>
                                    {selectedPayment.paymentMethod && (
                                       <p><span className='font-medium'>Payment Method:</span> <span className='capitalize'>{selectedPayment.paymentMethod}</span></p>
                                    )}
                                    <p><span className='font-medium'>Status:</span> <span className='capitalize'>{selectedPayment.paymentStatus}</span></p>
                                 </div>
                              </div>
                           </div>

                           <div className='space-y-4'>
                              <div>
                                 <h3 className='font-semibold text-text-dark mb-2'>Customer Information</h3>
                                 <div className='space-y-1 text-sm'>
                                    <p><span className='font-medium'>Name:</span> {selectedPayment.customerDetails.name}</p>
                                    <p><span className='font-medium'>Email:</span> {selectedPayment.customerDetails.email}</p>
                                    <p><span className='font-medium'>Phone:</span> {selectedPayment.customerDetails.phone}</p>
                                 </div>
                              </div>

                              <div>
                                 <h3 className='font-semibold text-text-dark mb-2'>Timestamps</h3>
                                 <div className='space-y-1 text-sm'>
                                    {selectedPayment.timestamps?.createdAt && (
                                       <p><span className='font-medium'>Created:</span> {new Date(selectedPayment.timestamps.createdAt.seconds * 1000).toLocaleString()}</p>
                                    )}
                                    {selectedPayment.timestamps?.updatedAt && (
                                       <p><span className='font-medium'>Updated:</span> {new Date(selectedPayment.timestamps.updatedAt.seconds * 1000).toLocaleString()}</p>
                                    )}
                                    {selectedPayment.timestamps?.completedAt && (
                                       <p><span className='font-medium'>Completed:</span> {new Date(selectedPayment.timestamps.completedAt.seconds * 1000).toLocaleString()}</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {selectedPayment.orderReference && (
                           <div className='mb-6'>
                              <h3 className='font-semibold text-text-dark mb-2'>Order Reference</h3>
                              <div className='bg-gray-50 p-4 rounded-lg'>
                                 <p className='text-sm'><span className='font-medium'>Order ID:</span> {selectedPayment.orderReference.orderId}</p>
                                 <p className='text-sm'><span className='font-medium'>Order Number:</span> {selectedPayment.orderReference.orderNumber}</p>
                                 {selectedPayment.orderReference.items && selectedPayment.orderReference.items.length > 0 && (
                                    <div className='mt-3'>
                                       <p className='text-sm font-medium mb-2'>Items:</p>
                                       <div className='space-y-1'>
                                          {selectedPayment.orderReference.items.map((item, index) => (
                                             <p key={index} className='text-xs text-gray-600'>
                                                {item.title} × {item.quantity} (₹{item.price})
                                             </p>
                                          ))}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           </div>
                        )}

                        {selectedPayment.errorDetails && (
                           <div className='mb-6'>
                              <h3 className='font-semibold text-text-dark mb-2'>Error Information</h3>
                              <div className='bg-red-50 border border-red-200 p-4 rounded-lg'>
                                 {selectedPayment.errorDetails.errorCode && (
                                    <p className='text-sm text-red-800'><span className='font-medium'>Error Code:</span> {selectedPayment.errorDetails.errorCode}</p>
                                 )}
                                 {selectedPayment.errorDetails.errorDescription && (
                                    <p className='text-sm text-red-800'><span className='font-medium'>Description:</span> {selectedPayment.errorDetails.errorDescription}</p>
                                 )}
                                 {selectedPayment.errorDetails.failureReason && (
                                    <p className='text-sm text-red-800'><span className='font-medium'>Failure Reason:</span> {selectedPayment.errorDetails.failureReason}</p>
                                 )}
                                 {selectedPayment.errorDetails.retryAttempt && (
                                    <p className='text-sm text-red-800'><span className='font-medium'>Retry Attempts:</span> {selectedPayment.errorDetails.retryAttempt}</p>
                                 )}
                              </div>
                           </div>
                        )}

                        {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                           <div className='mb-6'>
                              <h3 className='font-semibold text-text-dark mb-2'>Additional Information</h3>
                              <div className='bg-gray-50 p-4 rounded-lg'>
                                 <pre className='text-xs text-gray-700 whitespace-pre-wrap'>
                                    {JSON.stringify(selectedPayment.metadata, null, 2)}
                                 </pre>
                              </div>
                           </div>
                        )}
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}
