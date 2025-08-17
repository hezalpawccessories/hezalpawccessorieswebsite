'use client'

import Link from 'next/link'
import { ArrowRight, Star, Shield, Truck, Heart, Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

export default function Home() {
   const features = [
      {
         icon: <Shield className='w-8 h-8' />,
         title: 'Premium Quality',
         description: 'Only the finest materials for your beloved pets',
      },
      {
         icon: <Truck className='w-8 h-8' />,
         title: 'Fast Delivery',
         description: 'Quick and safe delivery to your doorstep',
      },
      {
         icon: <Heart className='w-8 h-8' />,
         title: 'Made with Love',
         description: 'Every product crafted with care and attention',
      },
      {
         icon: <Gift className='w-8 h-8' />,
         title: 'Special Offers',
         description: 'Regular discounts and exclusive deals',
      },
   ]

   const testimonials = [
      {
         name: 'Sarah Johnson',
         rating: 5,
         comment: 'Amazing quality! My dog loves the new collar and leash set.',
      },
      {
         name: 'Mike Chen',
         rating: 5,
         comment: 'Fast delivery and excellent customer service. Highly recommended!',
      },
      {
         name: 'Emily Davis',
         rating: 5,
         comment: 'Beautiful accessories at great prices. Will definitely order again!',
      },
   ]

   return (
      <>
         <Navbar />
         <main className='minimal-bg'>
            {/* Hero Section */}
            <section className='relative overflow-hidden bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='order-2 lg:order-1'
                     >
                        <h1 className='text-4xl md:text-5xl lg:text-6xl font-nunito font-bold text-gray-900 mb-6 leading-tight'>
                           Your Pet Deserves Only the <span className='text-pink-500'>BEST</span>
                        </h1>
                        <p className='text-lg lg:text-xl font-dm-sans text-gray-600 mb-8 leading-relaxed max-w-lg'>
                           Discover premium pet accessories that combine style, comfort, and quality. From adorable
                           collars to cozy beds, we have everything your furry friend needs.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                           <Link href='/products'>
                              <button className='btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto'>
                                 <span>Shop Now</span>
                                 <ArrowRight className='w-5 h-5' />
                              </button>
                           </Link>
                           <Link href='/about'>
                              <button className='btn-secondary w-full sm:w-auto'>About Us</button>
                           </Link>
                        </div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='relative order-1 lg:order-2'
                     >
                        <div className='bg-pink-50 rounded-2xl p-8 shadow-sm'>
                           <Image
                              width={600}
                              height={400}
                              src='https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'
                              alt='Happy puppy with accessories'
                              className='w-full h-80 object-cover rounded-xl'
                           />
                        </div>
                        <div className='absolute -bottom-4 -right-4 bg-pink-500 text-white p-4 rounded-xl shadow-lg'>
                           <p className='font-dm-sans font-semibold'>🐕 Happy Pets</p>
                           <p className='text-sm font-dm-sans opacity-90'>1000+ Satisfied Customers</p>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Features Section */}
            <section className='py-16 lg:py-20 bg-gray-50'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-12'
                  >
                     <h2 className='text-3xl md:text-4xl font-nunito font-bold text-gray-900 mb-4 leading-tight'>
                        Why Choose Hezal Accessories?
                     </h2>
                     <p className='text-lg font-dm-sans text-gray-600 max-w-2xl mx-auto'>
                        We&apos;re committed to providing the best for your pets with our carefully curated collection
                     </p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                     {features.map((feature, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-white p-6 rounded-xl shadow-sm card-hover text-center border border-gray-100'
                        >
                           <div className='text-pink-500 mb-4 flex justify-center'>{feature.icon}</div>
                           <h3 className='text-xl font-nunito font-semibold text-gray-900 mb-2'>{feature.title}</h3>
                           <p className='font-dm-sans text-gray-600'>{feature.description}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Featured Products Preview */}
            <section className='py-16 lg:py-20 bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-12'
                  >
                     <h2 className='text-3xl md:text-4xl font-nunito font-bold text-gray-900 mb-4 leading-tight'>
                        Pet Accessories
                     </h2>
                     <p className='text-lg font-dm-sans text-gray-600'>Discover our most popular pet accessories</p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                     {[
                        {
                           image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Bandana/Neck Scarf',
                           description: 'Stylish bandanas and neck scarfs to make your pet look adorable.',
                        },
                        {
                           image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Bow Ties',
                           description: 'Elegant bow ties perfect for special occasions and formal events.',
                        },
                        {
                           image: 'https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Collars',
                           description: 'Premium quality collars for comfort, style, and safety.',
                        },
                        {
                           image: 'https://images.pexels.com/photos/7210758/pexels-photo-7210758.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Collar-Leash Set',
                           description: 'Complete matching sets for convenient and stylish walks.',
                        },
                        {
                           image: 'https://images.pexels.com/photos/5731838/pexels-photo-5731838.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Treat Jars',
                           description: 'Beautiful jars to keep your pet treats fresh and organized.',
                        },
                     ].map((product, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-gray-50 rounded-xl overflow-hidden shadow-sm card-hover border border-gray-100'
                        >
                           <Image
                              width={300}
                              height={200}
                              src={product.image}
                              alt={product.title}
                              className='w-full h-48 object-cover'
                           />
                           <div className='p-6'>
                              <h3 className='text-lg font-nunito font-semibold text-gray-900 mb-2'>{product.title}</h3>
                              <p className='font-dm-sans text-gray-600 text-sm leading-relaxed'>{product.description}</p>
                           </div>
                        </motion.div>
                     ))}
                  </div>

                  <div className='text-center mt-12'>
                     <Link href='/products'>
                        <button className='btn-primary font-dm-sans font-medium'>View All Products</button>
                     </Link>
                  </div>
               </div>
            </section>

            {/* Testimonials */}
            <section className='py-16 lg:py-20 bg-gray-50'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-12'
                  >
                     <h2 className='text-3xl md:text-4xl font-nunito font-bold text-gray-900 mb-4 leading-tight'>
                        What Pet Parents Say
                     </h2>
                     <p className='text-lg font-dm-sans text-gray-600'>Don&apos;t just take our word for it</p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                     {testimonials.map((testimonial, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-white p-6 rounded-xl shadow-sm border border-gray-100'
                        >
                           <div className='flex items-center mb-4'>
                              {[...Array(testimonial.rating)].map((_, i) => (
                                 <Star
                                    key={i}
                                    className='w-5 h-5 text-pink-500'
                                    fill='currentColor'
                                 />
                              ))}
                           </div>
                           <p className='font-dm-sans text-gray-600 mb-4 italic'>&quot;{testimonial.comment}&quot;</p>
                           <p className='font-dm-sans font-semibold text-gray-900'>- {testimonial.name}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section className='py-16 lg:py-20 bg-pink-500'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                  >
                     <h2 className='text-3xl md:text-4xl font-nunito font-bold text-white mb-4 leading-tight'>
                        Ready to Spoil Your Pet?
                     </h2>
                     <p className='text-lg font-dm-sans text-white/90 mb-8 max-w-2xl mx-auto'>
                        Join thousands of happy pet parents who trust Hezal Accessories for their furry friends
                     </p>
                     <Link href='/products'>
                        <button className='bg-white text-pink-500 px-8 py-4 rounded-md font-dm-sans font-semibold text-lg hover:bg-gray-50 transition-colors'>
                           Start Shopping Now
                        </button>
                     </Link>
                  </motion.div>
               </div>
            </section>
         </main>
         <Footer />
      </>
   )
}
