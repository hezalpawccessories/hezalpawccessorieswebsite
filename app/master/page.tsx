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
} from 'lucide-react'
import { products as initialProducts, Product } from '@/lib/products'

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
   const [isAuthenticated, setIsAuthenticated] = useState(false)
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   const [activeTab, setActiveTab] = useState('products')
   const [products, setProducts] = useState<Product[]>(initialProducts)
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
      category: 'Collars',
      description: '',
      details: [''],
      inStock: true,
      rating: 4.5,
      reviews: 0,
   })

   useEffect(() => {
      // Load orders from localStorage
      if (typeof window !== 'undefined') {
         const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]')
         setOrders(savedOrders)
      }
   }, [])

   const handleLogin = (e: React.FormEvent) => {
      e.preventDefault()
      if (password === 'hezal2025') {
         setIsAuthenticated(true)
         setPassword('')
      } else {
         alert('Incorrect password!')
      }
   }

   const handleDeleteProduct = (productId: string) => {
      if (confirm('Are you sure you want to delete this product?')) {
         const updatedProducts = products.filter((p) => p.id !== productId)
         setProducts(updatedProducts)
      }
   }

   const handleAddProduct = (e: React.FormEvent) => {
      e.preventDefault()
      const product: Product = {
         ...newProduct,
         id: Date.now().toString(),
         details: newProduct.details.filter((detail) => detail.trim() !== ''),
      }
      setProducts([...products, product])
      setNewProduct({
         title: '',
         price: 0,
         originalPrice: 0,
         image: '',
         category: 'Collars',
         description: '',
         details: [''],
         inStock: true,
         rating: 4.5,
         reviews: 0,
      })
      setShowAddModal(false)
   }

   const handleEditProduct = (e: React.FormEvent) => {
      e.preventDefault()
      if (selectedProduct) {
         const updatedProducts = products.map((p) => (p.id === selectedProduct.id ? selectedProduct : p))
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
               className='bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4'
            >
               <div className='text-center mb-8'>
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

   return (
      <div className='min-h-screen bg-soft-gray'>
         {/* Header */}
         <div className='bg-white shadow-lg'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
               <div className='flex justify-between items-center h-16'>
                  <h1 className='text-2xl font-nunito font-extrabold text-text-dark leading-tight tracking-wide'>
                     Admin Dashboard
                  </h1>
                  <button
                     onClick={() => setIsAuthenticated(false)}
                     className='text-text-light hover:text-primary-pink'
                  >
                     Logout
                  </button>
               </div>
            </div>
         </div>

         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Tabs */}
            <div className='flex space-x-1 bg-white p-1 rounded-lg mb-8 shadow-lg'>
               {[
                  { id: 'products', label: 'Products', icon: <Package className='w-5 h-5' /> },
                  { id: 'add-product', label: 'Add Product', icon: <Plus className='w-5 h-5' /> },
                  { id: 'orders', label: 'Orders', icon: <ShoppingBag className='w-5 h-5' /> },
                  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className='w-5 h-5' /> },
               ].map((tab) => (
                  <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id ? 'bg-primary-blue text-white' : 'text-text-light hover:text-primary-blue'
                     }`}
                  >
                     {tab.icon}
                     <span>{tab.label}</span>
                  </button>
               ))}
            </div>

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
                        <h2 className='text-2xl font-nunito font-extrabold text-text-dark leading-tight tracking-wide'>
                           Products Management
                        </h2>
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

                     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredProducts.map((product) => (
                           <div
                              key={product.id}
                              className='bg-white rounded-lg shadow-lg overflow-hidden'
                           >
                              <Image
                                 src={product.image}
                                 alt={product.title}
                                 width={600}
                                 height={192}
                                 className='w-full h-48 object-cover'
                              />
                              <div className='p-4'>
                                 <h3 className='font-bold text-text-dark mb-2'>{product.title}</h3>
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
                                          setSelectedProduct(product)
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

                           <div>
                              <label className='block text-sm font-medium text-text-dark mb-2'>Image URL *</label>
                              <input
                                 type='url'
                                 required
                                 value={newProduct.image}
                                 onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                 className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue'
                              />
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
                        <h2 className='text-2xl font-bold text-text-dark mb-6'>Analytics Dashboard</h2>
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
                        <h2 className='text-2xl font-bold text-text-dark mb-6'>Orders Management</h2>
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
                     <h1 className='text-3xl font-bold text-primary-blue mb-6'>Vercel Analytics</h1>
                     {/* Vercel Analytics Preview */}
                     {/* You must have @vercel/analytics installed and set up in your project for this to work */}
                     {/* If using the new Vercel Analytics SDK for Next.js App Router: */}
                     {/*
                     import { Analytics } from '@vercel/analytics/react';
                     ...
                     <Analytics mode="dashboard" />
                     */}
                     {/* For now, we show a placeholder. Uncomment above if Analytics is set up. */}
                     <div className='bg-white rounded-lg shadow-lg p-8 text-center'>
                        <p className='text-xl text-text-light mb-4'>Analytics dashboard will appear here if enabled.</p>
                        <p className='text-sm text-text-light'>
                           Analytics Dashboard
                           {/* <Analytics mode="dashboard" /> */}
                        </p>
                     </div>
                  </div>
               )}
            </AnimatePresence>
         </div>

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
