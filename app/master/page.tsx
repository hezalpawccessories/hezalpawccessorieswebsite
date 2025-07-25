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
} from 'lucide-react'
import { products as initialProducts, Product } from '@/lib/products'
import ProductModal from '../../components/ProductModal'
import { addProduct, deleteProduct, updateProduct, getProducts } from '@/integrations/firebase/firestoreCollections'
import { v4 as uuidv4 } from 'uuid'
import { get } from 'node:http'
import { toast } from 'sonner'
import Link from 'next/link'
import { link } from 'node:fs'

// Declare cloudinary widget
declare global {
   interface Window {
      cloudinary: any
   }
}

interface Order {
   id: string
   customerName: string
   email: string
   phone: string
   address: string
   items: any[]
   total: number
   status: 'Not Initiated' | 'Progress' | 'Completed'
   date: string
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
   const [showAddModal, setShowAddModal] = useState(false)
   const [showEditModal, setShowEditModal] = useState(false)
   const [showOrderModal, setShowOrderModal] = useState(false)
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
   const [searchQuery, setSearchQuery] = useState('')

   const [newProduct, setNewProduct] = useState({
      title: '',
      price: 0,
      originalPrice: 0,
      image: '',
      images: [''], // Array for multiple images
      category: 'Collars',
      description: '',
      details: [''],
      inStock: true,
      rating: 4.5,
      reviews: 0,
   })

   const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

   const [uploadedImages, setUploadedImages] = useState<string[]>([]) // Store uploaded image URLs
   const [openProductModal, setOpenProductModal] = useState(false)

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

   useEffect(() => {
      // Load orders from localStorage
      if (typeof window !== 'undefined') {
         const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
         setOrders(savedOrders)
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
      const product: Product = {
         ...newProduct,
         id: uuidv4(),
         details: newProduct.details.filter((detail) => detail.trim() !== ''),
         images: newProduct.images.filter((imageUrl) => imageUrl.trim() !== ''),
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
         image: '',
         images: [''],
         category: 'Collars',
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
         const updatedProduct = {
            ...selectedProduct,
            images: selectedProduct.images?.filter((imageUrl) => imageUrl.trim() !== '') || [],
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

   const updateOrderStatus = (orderId: string, status: Order['status']) => {
      const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status } : order))
      setOrders(updatedOrders)
      if (typeof window !== 'undefined') {
         localStorage.setItem('orders', JSON.stringify(updatedOrders))
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
               <Link
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
               </Link>
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
                  <h1 className='text-2xl font-nunito font-extrabold text-text-dark leading-tight tracking-wide'>
                     Admin Dashboard
                  </h1>
                  <Link
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
                  </Link>
               </div>
            </div>
         </div>

         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 '>
            {/* Tabs */}
            <div className='flex space-x-1 bg-white p-1 rounded-lg mb-8 shadow-lg w-full sm:justify-center justify-around'>
               {[
                  { id: 'products', label: 'Products', icon: <Package className='w-5 h-5' /> },
                  { id: 'add-product', label: 'Add Product', icon: <Plus className='w-5 h-5' /> },
                  { id: 'orders', label: 'Orders', icon: <ShoppingBag className='w-5 h-5' /> },
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
               <Link
                  href='/'
                  className='flex items-center space-x-2 px-6 py-3 rounded-lg font-medium   bg-primary-pink text-white text-center  shadow-md hover:bg-primary-pink/80 transition-all hover:scale-95 duration-200 sm:text-base text-sm'
               >
                  Website
               </Link>
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
                                    <span className='text-lg font-bold text-primary-pink'>₹{product.price}</span>
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

                           <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>Price *</label>
                                 <input
                                    type='number'
                                    required
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 />
                              </div>
                              <div>
                                 <label className='block text-sm font-medium text-text-dark mb-2'>
                                    Original Price (Optional)
                                 </label>
                                 <input
                                    type='number'
                                    value={newProduct.originalPrice}
                                    onChange={(e) =>
                                       setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) })
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                                 />
                              </div>
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
                                 ₹{orders.reduce((sum, order) => sum + order.total, 0)}
                              </p>
                           </div>
                           <div className='bg-white rounded-lg shadow-lg p-6'>
                              <h3 className='text-lg font-semibold text-text-dark mb-2'>Completed Orders</h3>
                              <p className='text-3xl font-bold text-light-purple'>
                                 {orders.filter((order) => order.status === 'Completed').length}
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
                                          <h3 className='font-bold text-text-dark'>Order #{order.id}</h3>
                                          <p className='text-text-light'>
                                             {order.customerName} • {order.date}
                                          </p>
                                       </div>
                                       <div className='flex items-center space-x-4'>
                                          <select
                                             value={order.status}
                                             onChange={(e) =>
                                                updateOrderStatus(order.id, e.target.value as Order['status'])
                                             }
                                             className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                order.status === 'Not Initiated'
                                                   ? 'bg-gray-100 text-gray-800'
                                                   : order.status === 'Progress'
                                                   ? 'bg-yellow-100 text-yellow-800'
                                                   : 'bg-green-100 text-green-800'
                                             }`}
                                          >
                                             <option value='Not Initiated'>Not Initiated</option>
                                             <option value='Progress'>Progress</option>
                                             <option value='Completed'>Completed</option>
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
                                       <span className='text-xl font-bold text-primary-pink'>₹{order.total}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        )}
                     </motion.div>
                  </>
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
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Price *</label>
                              <input
                                 type='number'
                                 required
                                 value={selectedProduct.price}
                                 onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })
                                 }
                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                              />
                           </div>
                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>
                                 Original Price (Optional)
                              </label>
                              <input
                                 type='number'
                                 value={selectedProduct.originalPrice}
                                 onChange={(e) =>
                                    setSelectedProduct({ ...selectedProduct, originalPrice: Number(e.target.value) })
                                 }
                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue font-dm-sans'
                              />
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
                        <h2 className='text-2xl font-bold text-text-dark mb-6'>Order Details #{selectedOrder.id}</h2>

                        <div className='space-y-4 mb-6'>
                           <div>
                              <h3 className='font-semibold text-text-dark'>Customer Information</h3>
                              <p className='text-text-light'>Name: {selectedOrder.customerName}</p>
                              <p className='text-text-light'>Email: {selectedOrder.email}</p>
                              <p className='text-text-light'>Phone: {selectedOrder.phone}</p>
                              <p className='text-text-light'>Address: {selectedOrder.address}</p>
                           </div>

                           <div>
                              <h3 className='font-semibold text-text-dark'>Order Items</h3>
                              <div className='space-y-2'>
                                 {selectedOrder.items.map((item, index) => (
                                    <div
                                       key={index}
                                       className='flex justify-between items-center p-2 bg-soft-gray rounded'
                                    >
                                       <span>
                                          {item.title} (Size: {item.size})
                                       </span>
                                       <span>
                                          Qty: {item.quantity} × ₹{item.price}
                                       </span>
                                    </div>
                                 ))}
                              </div>
                           </div>

                           <div className='flex justify-between items-center text-lg font-bold'>
                              <span>Total Amount:</span>
                              <span className='text-primary-pink'>₹{selectedOrder.total}</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}
