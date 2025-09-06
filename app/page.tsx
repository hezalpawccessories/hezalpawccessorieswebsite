"use client"

import React from 'react'
import ProgressLink from '@/components/ProgressLink'
import { ArrowRight, Star, Shield, Truck, Heart, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import ImageAutoSlider from '@/components/ui/image-auto-slider'
import AnimatedSlideshow from '@/components/ui/animated-slideshow'
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from 'react'
import { getBanners, Banner } from '@/integrations/firebase/firestoreCollections'
import ScrollBaseAnimation from '@/components/ui/text-marquee'

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
         name: '@sparkle.shiro',
         rating: 5,
         comment:
            'I was looking for bandanas for my furbaby for festive occasions and while scrolling through Instagram, I came across Hezal accessories profile and instantly liked their products. Hezal accessories has a wide collection for all occasions with exquisite designs. Also, the quality is top-notch. Service is good and products are delivered on time without requiring any follow up, glad to be their customer.',
      },
      {
         name: '@lexie_quinn_maben',
         rating: 5,
         comment:
            "Hezal accessories is my favourite small business. The person handling the business is a kind and a generous person. The accessories from here is a top tier. Every single accessory is made with the best quality and materials. Every print here is unique and adorable. I have purchased a lot of accessories and I was always satisfied with the products. My fur babies look very stunning with your accessories.",
      },
      {
         name: '@boozo_boi',
         rating: 5,
         comment:
            "I had tried from different brand they had just provided a strap to attach which wasn't looking that great. And the collar is also of a nice length. All the products are not only adorable but durable as well.",
      },
      {
         name: '@bing_nova',
         rating: 5,
         comment:
            "We ordered our first ever bandana from Hezal, the quality was absolutely amazing, everything from the fabric to the pattern was just spectacular. Now we're the proud owners of easily 20 HA pieces 😍",
      },
      {
         name: '@victor_labrador_doggo',
         rating: 5,
         comment:
            "I absolutely love Hezal Accessories, the best brand for my dog's outfits! 💕 Their products are stylish, well-made, and super comfortable for pets. The fabric quality is excellent – soft, durable, and gentle on the skin. The designs are creative and available in all sizes, making it easy to find the perfect fit. I have a reversible bandana (Mickey Mouse + polka dots), a festive Christmas bandana, and an army-style bowtie – all of them look amazing on my dog and fit perfectly. Stylish, comfy, and always bringing compliments. Highly recommend! 🐾✨We absolutely love you guys ♥ Keep growing and shining always ✨"
      }
   ]

   // Banner state
   const [banners, setBanners] = useState<Banner[]>([])
   const [loadingBanners, setLoadingBanners] = useState(true)

   // Load banners from Firebase
   const loadBanners = async () => {
      try {
         setLoadingBanners(true)
         const fetchedBanners = await getBanners()
         // Show all banners since we're using continuous scrolling now
         setBanners(fetchedBanners.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      } catch (error) {
         console.error('Error loading banners:', error)
         setBanners([])
      } finally {
         setLoadingBanners(false)
      }
   }

   // Load banners on component mount
   useEffect(() => {
      loadBanners()
   }, [])

   // The previous mini-carousel state/logic was removed in favor of ImageAutoSlider component above.

   return (
      <>
         <Navbar />

         {/* Prominent Landing Page Banner */}
         {/* {!loadingBanners && banners.length > 0 && (
            <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className='relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 overflow-hidden'
            > */}
               {/* Background Pattern */}
               {/* <div className='absolute inset-0 bg-black/10'></div>
               <div className='absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5'></div> */}
               
               {/* Floating Decorative Elements */}
               {/* <div className='absolute top-2 left-10 animate-bounce'>
                  <Heart className='w-4 h-4 text-white/60' />
               </div>
               <div className='absolute bottom-2 right-16 animate-pulse'>
                  <Gift className='w-5 h-5 text-white/60' />
               </div>
               <div className='absolute top-3 right-32 animate-bounce' style={{ animationDelay: '0.5s' }}>
                  <Star className='w-3 h-3 text-white/60' />
               </div> */}
               
               {/* <div className='relative z-10 py-4 px-4'>
                  
                  <div className='max-w-7xl mx-auto'>
                     <div className='flex items-center justify-center space-x-8 overflow-hidden'>
                        <div className='flex animate-marquee-continuous-landing space-x-24'> */}
                           {/* Repeat banners for seamless scrolling */}
                           {/* {Array.from({ length: 3 }, (_, repeatIndex) => 
                              banners.map((banner, bannerIndex) => (
                                 <div key={`${repeatIndex}-${bannerIndex}`} className='flex items-center space-x-4 whitespace-nowrap'>
                                    
                                    <span className='text-white font-bold text-base sm:text-lg lg:text-xl tracking-wide'>
                                       {banner.title}
                                    </span>
                                    
                                    {banner.subtitle && (
                                       <>
                                          <span className='text-white/80 text-base lg:text-lg mx-2'>•</span>
                                          <span className='text-white/90 font-medium text-base lg:text-lg'>
                                             {banner.subtitle}
                                          </span>
                                       </>
                                    )} */}
                                    {/* <span className='text-2xl'>✨</span> */}
                                 {/* </div>
                              ))
                           ).flat()}
                        </div>
                     </div>
                  </div>
               </div> */}
               
               {/* Bottom gradient fade */}
               {/* <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent'></div>
            </motion.div>
         )} */}

{!loadingBanners && banners.length > 0 && (
   <div className='w-full bg-gradient-to-l from-transparent via-pink-500/20 to-transparent overflow-hidden'>
      {/* Horizontal inline marquee: all banners shown one after another */}
      <div className='h-12 md:h-12 flex items-center'>
         <ScrollBaseAnimation
            delay={0}
            baseVelocity={-1}
            className='font-bold tracking-[-0.02em]'
         >
            <div className='flex items-center space-x-12'>
                      {Array.from({ length: 3 }, (_, repeatIndex) =>
                           banners.map((banner, bannerIndex) => (
                               <React.Fragment key={`${repeatIndex}-${bannerIndex}`}>
                                  <span className='inline-block text-base md:text-lg font-bold'>
                                     {banner.title}
                                     {banner.subtitle ? <span className='mx-2 text-base md:text-lg font-normal'>• {banner.subtitle}</span> : null}
                                  </span>
                                  <span className='text-xl'>🐾</span>
                               </React.Fragment>
                           ))
                      )}
            </div>
         </ScrollBaseAnimation>
      </div>
   </div>
)}

        
              
         <main className='pet-pattern-bg'>
            

            <section className='relative overflow-hidden hero-bg'>
               {/* Floating Pet Icons */}
               <div className='absolute inset-0 pointer-events-none'>
                  <div className='absolute top-20 left-10 floating-icon pulse-glow'>
                     <Heart className='w-8 h-8 text-pink-400' />
                  </div>
                  <div className='absolute top-40 right-20 floating-icon-delayed pulse-glow'>
                     <svg className='w-10 h-10 text-pink-400' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 2c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm-7 8c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm11 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-8 6c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm8 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z'/>
                     </svg>
                  </div>
                  <div className='absolute bottom-40 left-20 floating-icon pulse-glow'>
                     <svg className='w-6 h-6 text-pink-400' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M4.5 12a7.5 7.5 0 0015 0 7.5 7.5 0 00-15 0zM12 2.5a.5.5 0 01.5.5v1a.5.5 0 01-1 0V3a.5.5 0 01.5-.5zM21 12.5a.5.5 0 010-1h1a.5.5 0 010 1h-1zM12 21.5a.5.5 0 01-.5-.5v-1a.5.5 0 011 0v1a.5.5 0 01-.5.5zM3 12.5a.5.5 0 010-1H2a.5.5 0 010 1h1z'/>
                     </svg>
                  </div>
                  <div className='absolute top-60 right-40 floating-icon-delayed pulse-glow'>
                     <Gift className='w-7 h-7 text-pink-400' />
                  </div>
               </div>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='order-2 lg:order-1'
                     >
                        <h1 className='text-4xl md:text-5xl lg:text-6xl hero-title mb-6 leading-tight'>
                           Your Pet Deserves Only the <span className='hero-accent'>BEST</span>
                        </h1>
                        <p className='text-lg lg:text-xl font-body text-gray-600 mb-8 leading-relaxed max-w-lg'>
                           Discover premium pet accessories that combine style, comfort, and quality. From adorable
                           collars to treat jars, we have everything your furry baby needs.
                        </p>
                        <div className='flex flex-col sm:flex-row gap-4'>
                           <ProgressLink href='/products'>
                              <button className='btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto'>
                                 <span>Shop Now</span>
                                 <ArrowRight className='w-5 h-5' />
                              </button>
                           </ProgressLink>
                           <ProgressLink href='/about'>
                              <button className='btn-secondary w-full sm:w-auto'>About Us</button>
                           </ProgressLink>
                        </div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className='relative order-1 lg:order-2'
                     >
                        <div className='bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-8 shadow-sm relative'>
                           {/* Decorative elements */}
                           <div className='absolute -top-2 -right-2 w-4 h-4 bg-pink-300 rounded-full opacity-60'></div>
                           <div className='absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full opacity-40'></div>
                           <Image
                              width={500}
                              height={320}
                              src='https://res.cloudinary.com/dt2qyj4lj/image/upload/v1755786569/kdqtrcjjxdkdeak97rwx.jpg'
                              alt='Happy puppy with accessories'
                              className='w-full h-96 object-cover rounded-xl'
                              quality={75}
                              sizes="(max-width: 768px) 100vw, 50vw"
                           />
                        </div>
                        <div className='absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-pink-500 text-white p-4 rounded-xl shadow-lg'>
                           <p className='font-body font-semibold'>🐕 Happy Pets</p>
                           <p className='text-sm font-body opacity-90'>1000+ Satisfied Customers</p>
                        </div>
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Features Section */}
            {/* <section className='py-16 lg:py-20 features-bg'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-12'
                  >
                     <h2 className='text-3xl md:text-4xl section-title text-gray-900 mb-4 leading-tight'>
                        Why Choose Hezal Accessories?
                     </h2>
                     <p className='text-lg font-body text-gray-600 max-w-2xl mx-auto'>
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
                           <h3 className='text-xl subheading text-gray-900 mb-2'>{feature.title}</h3>
                           <p className='font-body text-gray-600'>{feature.description}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section> */}

            {/* Featured Products Preview */}
            <section className='py-16 lg:py-20 bg-white relative'>
               {/* Subtle background pattern */}
               <div className='absolute inset-0 opacity-5'>
                  <svg className='w-full h-full' xmlns='http://www.w3.org/2000/svg'>
                     <defs>
                        <pattern id='pet-pattern' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'>
                           <circle cx='50' cy='50' r='2' fill='#ff69b4'/>
                           <path d='M30 30 Q35 25 40 30 Q35 35 30 30 M60 70 Q65 65 70 70 Q65 75 60 70' fill='#ff69b4'/>
                        </pattern>
                     </defs>
                     <rect width='100%' height='100%' fill='url(#pet-pattern)'/>
                  </svg>
               </div>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-12'
                  >
                     <h2 className='text-3xl md:text-4xl section-title text-gray-900 mb-2 leading-tight'>
                        Pet Accessories
                     </h2>
                     <p className='text-lg font-body text-gray-600'>Adorable Finds, One Category at a Time</p>
                  </motion.div>


                  {/* Animated categories slideshow */}
                  <AnimatedSlideshow
                     slides={[
                        {
                           image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757081273/WhatsApp_Image_2025-09-04_at_19.27.12_5e2bcfa4_qxqxbn.png',
                           title: 'Bandana/Neck Scarf',
                        },
                        {
                           image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757082005/WhatsApp_Image_2025-09-04_at_19.28.45_0db24edb_qgcyy9.png',
                           title: 'Bow Ties',
                        },
                        {
                           image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078385/WhatsApp_Image_2025-09-04_at_19.37.44_52689dd9_s2twm9.jpg',
                           title: 'Collars',
                        },
                        {
                           image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078384/WhatsApp_Image_2025-09-04_at_19.33.09_20740e7c_n08afc.jpg',
                           title: 'Collar-Leash Set',
                        },
                        {
                           image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078385/WhatsApp_Image_2025-09-04_at_19.34.56_e1ff4a5d_vur11d.jpg',
                           title: 'Treat Jars',
                        },
                     ]}
                  />

                  <div className='text-center mt-12'>
                     <ProgressLink href='/products'>
                        <button className='btn-primary font-body font-medium'>View All Products</button>
                     </ProgressLink>
                  </div>
               </div>
            </section>

            {/* Testimonials */}
            <section className='py-16 lg:py-20 features-bg'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                     className='text-center mb-12'
                  >
                     <h2 className='text-3xl md:text-4xl section-title text-gray-900 mb-4 leading-tight'>
                        What Pet Parents Say
                     </h2>
                     <p className='text-lg font-body text-gray-600'>Don&apos;t just take our word for it</p>
                  </motion.div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                     {testimonials.map((testimonial, index) => (
                        <motion.div
                           key={index}
                           initial={{ opacity: 0, y: 50 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: index * 0.1 }}
                           className='testimonial-card'
                        >
                           <div className='flex items-center mb-4'>
                              {Array.from({ length: testimonial.rating }).map((_, i) => (
                                 <Star
                                    key={i}
                                    className='w-5 h-5 text-pink-500'
                                    fill='currentColor'
                                 />
                              ))}
                           </div>
                           <p className='font-body text-gray-600 mb-4 italic'>&quot;{testimonial.comment}&quot;</p>
                           <p className='font-body font-semibold text-gray-900'>- {testimonial.name}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Our Happy Pets Auto Slider */}
            <section className='py-8 lg:py-12 bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <div className='text-center mb-6'>
                     <h3 className='text-2xl font-semibold'>Our Happy Pets 🐾</h3>
                     <p className='text-sm text-gray-500'>A few snaps from our lovely customers</p>
                  </div>
                  <ImageAutoSlider />
               </div>
            </section>

            

            {/* CTA Section */}
            <section className='py-16 lg:py-20 bg-gradient-to-r from-pink-500 to-pink-600 relative overflow-hidden'>
               {/* Playful background elements */}
               <div className='absolute inset-0 pointer-events-none'>
                  <div className='absolute top-5 left-5 md:top-10 md:left-10 opacity-20 animate-pulse'>
                     <svg className='w-12 h-12 text-white' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 2c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3zm-7 8c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm11 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm-8 6c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3zm8 0c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z'/>
                     </svg>
                  </div>
                  <div className='absolute bottom-10 right-10 opacity-20 animate-pulse' style={{ animationDelay: '1s' }}>
                     <Heart className='w-10 h-10 text-white' />
                  </div>
                  <div className='absolute top-2/3 left-10 md:top-1/2 md:left-1/4 opacity-10 animate-pulse' style={{ animationDelay: '2s' }}>
                     <Gift className='w-8 h-8 text-white' />
                  </div>
               </div>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10'>
                  <motion.div
                     initial={{ opacity: 0, y: 50 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.8 }}
                  >
                     <h2 className='text-3xl md:text-4xl section-title text-white mb-4 leading-tight'>
                        Ready to Spoil Your Pet?
                     </h2>
                     <p className='text-lg font-body text-white/90 mb-8 max-w-2xl mx-auto'>
                        Join thousands of happy pet parents who trust Hezal Accessories for their four legged babies.
                     </p>
                     <ProgressLink href='/products'>
                        <button className='bg-white text-pink-500 px-8 py-4 rounded-md font-body font-semibold text-lg hover:bg-gray-50 transition-colors'>
                           Start Shopping Now
                        </button>
                     </ProgressLink>
                  </motion.div>
               </div>
            </section>
         </main>
         <Footer />
      </>
   )
}



