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
         <main className='gradient-bg'>
            {/* Hero Section */}
            <section className='relative overflow-hidden'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                     >
                        <h1 className='text-4xl md:text-6xl font-bold text-text-dark mb-6'>
                           Your Pet Deserves Only the <span className='text-primary-pink'>BEST</span>
                        </h1>
                        <p className='text-xl text-text-light mb-8 leading-relaxed'>
                           Discover premium pet accessories that combine style, comfort, and quality. From adorable
                           collars to cozy beds, we have everything your furry friend needs.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                           <Link href='/products'>
                              <button className='btn-primary flex items-center space-x-2'>
                                 <span>Shop Now</span>
                                 <ArrowRight className='w-5 h-5' />
                              </button>
                           </Link>
                           <Link href='/about'>
                              <button className='btn-secondary'>Learn More</button>
                           </Link>
                        </div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='relative'
                     >
                        <div className='bg-gradient-to-br from-primary-blue to-light-purple rounded-3xl p-8 shadow-2xl'>
                           <Image
                              width={600}
                              height={384}
                              src='https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'
                              alt='Happy puppy with accessories'
                              className='w-full h-80 object-cover rounded-2xl'
                           />
                        </div>
                        <div className='absolute -bottom-4 -left-4 bg-soft-yellow p-4 rounded-2xl shadow-lg'>
                           <p className='font-bold text-text-dark'>🐕 Happy Pets</p>
                           <p className='text-sm text-text-light'>1000+ Satisfied Customers</p>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Features Section */}
            <section className='py-20'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-16'
                  >
                     <h2 className='text-3xl md:text-4xl font-bold text-text-dark mb-4'>
                        Why Choose Hezal Accessories?
                     </h2>
                     <p className='text-xl text-text-light max-w-2xl mx-auto'>
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
                           className='bg-white p-6 rounded-2xl shadow-lg card-hover text-center'
                        >
                           <div className='text-primary-blue mb-4 flex justify-center'>{feature.icon}</div>
                           <h3 className='text-xl font-bold text-text-dark mb-2'>{feature.title}</h3>
                           <p className='text-text-light'>{feature.description}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Featured Products Preview */}
            <section className='py-20 bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-16'
                  >
                     <h2 className='text-3xl md:text-4xl font-bold text-text-dark mb-4'>Featured Products</h2>
                     <p className='text-xl text-text-light'>Discover our most popular pet accessories</p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                     {[
                        {
                           image: 'https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Premium Dog Collar',
                           price: '₹899',
                           originalPrice: '₹1299',
                        },
                        {
                           image: 'https://images.pexels.com/photos/8434791/pexels-photo-8434791.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Cozy Pet Bed',
                           price: '₹1599',
                           originalPrice: '₹2199',
                        },
                        {
                           image: 'https://images.pexels.com/photos/7210758/pexels-photo-7210758.jpeg?auto=compress&cs=tinysrgb&w=600',
                           title: 'Interactive Toy Set',
                           price: '₹699',
                           originalPrice: '₹999',
                        },
                     ].map((product, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-soft-gray rounded-2xl overflow-hidden shadow-lg card-hover'
                        >
                           <Image
                              width={600}
                              height={384}
                              src={product.image}
                              alt={product.title}
                              className='w-full h-48 object-cover'
                           />
                           <div className='p-6'>
                              <h3 className='text-xl font-bold text-text-dark mb-2'>{product.title}</h3>
                              <div className='flex items-center space-x-2 mb-4'>
                                 <span className='text-2xl font-bold text-primary-pink'>{product.price}</span>
                                 <span className='text-text-light line-through'>{product.originalPrice}</span>
                              </div>
                              <button className='btn-primary w-full'>Add to Cart</button>
                           </div>
                        </motion.div>
                     ))}
                  </div>

                  <div className='text-center mt-12'>
                     <Link href='/products'>
                        <button className='btn-primary'>View All Products</button>
                     </Link>
                  </div>
               </div>
            </section>

            {/* Testimonials */}
            <section className='py-20'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-16'
                  >
                     <h2 className='text-3xl md:text-4xl font-bold text-text-dark mb-4'>What Pet Parents Say</h2>
                     <p className='text-xl text-text-light'>Don&apos;t just take our word for it</p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                     {testimonials.map((testimonial, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='bg-white p-6 rounded-2xl shadow-lg'
                        >
                           <div className='flex items-center mb-4'>
                              {[...Array(testimonial.rating)].map((_, i) => (
                                 <Star
                                    key={i}
                                    className='w-5 h-5 text-soft-yellow'
                                    fill='currentColor'
                                 />
                              ))}
                           </div>
                           <p className='text-text-light mb-4 italic'>&quot;{testimonial.comment}&quot;</p>
                           <p className='font-bold text-text-dark'>- {testimonial.name}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section className='py-20 bg-gradient-to-r from-primary-pink to-warm-orange'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                  >
                     <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>Ready to Spoil Your Pet?</h2>
                     <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
                        Join thousands of happy pet parents who trust Hezal Accessories for their furry friends
                     </p>
                     <Link href='/products'>
                        <button className='bg-white text-primary-pink px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors'>
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
