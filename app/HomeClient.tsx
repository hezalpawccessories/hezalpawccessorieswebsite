'use client'

import React from 'react'
import NavigationLink from '@/components/NavigationLink'
import { ArrowRight, Star, Shield, Truck, Heart, Gift } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react'
import { getBanners, Banner } from '@/integrations/firebase/firestoreCollections'
import SEOHead from '@/components/SEO/SEOHead'

// Dynamic imports for heavy components to reduce initial bundle size
const ImageAutoSlider = lazy(() => import('@/components/ui/image-auto-slider'))
const AnimatedSlideshow = lazy(() => import('@/components/ui/animated-slideshow'))
const LightweightSlideshow = lazy(() => import('@/components/ui/lightweight-slideshow'))
const ScrollBaseAnimation = lazy(() => import('@/components/ui/text-marquee'))
const PerformanceMotion = lazy(() => import('@/components/ui/PerformanceMotion'))

interface Props {
  landingImageUrl: string | null
}

export default function HomeClient({ landingImageUrl }: Props) {
  // Simplified - no complex state management for LCP optimization

  // Structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hezal Accessories",
    "url": "https://www.hezalaccessories.com",
    "logo": "https://www.hezalaccessories.com/logom.png",
    "description": "Premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Handcrafted with love for your furry friends.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.instagram.com/hezal_accessories/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  }

  const features = [
    { icon: <Shield className='w-8 h-8' />, title: 'Premium Quality', description: 'Only the finest materials for your beloved pets' },
    { icon: <Truck className='w-8 h-8' />, title: 'Fast Delivery', description: 'Quick and safe delivery to your doorstep' },
    { icon: <Heart className='w-8 h-8' />, title: 'Made with Love', description: 'Every product crafted with care and attention' },
    { icon: <Gift className='w-8 h-8' />, title: 'Special Offers', description: 'Regular discounts and exclusive deals' },
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

  // Banner state (client-side fetch still used for banners)
  const [banners, setBanners] = useState<Banner[]>([])
  const [loadingBanners, setLoadingBanners] = useState(true)

  const loadBanners = async () => {
    try {
      setLoadingBanners(true)
      const fetchedBanners = await getBanners()
      setBanners(fetchedBanners.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
      console.error('Error loading banners:', error)
      setBanners([])
    } finally {
      setLoadingBanners(false)
    }
  }

  useEffect(() => { loadBanners() }, [])

  return (
    <>
      <SEOHead
        title="Hezal Accessories - Premium Pet Accessories & Custom Dog Collars"
        description="Discover premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Handcrafted with love for your furry friends. Free shipping on orders over ₹999."
        keywords={['pet accessories', 'dog collars', 'custom pet products', 'dog leashes', 'pet bow ties', 'bandanas', 'premium pet gear', 'handcrafted pet accessories', 'pet fashion', 'dog fashion']}
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Hezal Accessories",
          "description": "Premium pet accessories seller specializing in custom dog collars, leashes, and stylish pet gear. Your pet deserves only the best!",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.hezalaccessories.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.hezalaccessories.com"}/products?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Navbar />
      {!loadingBanners && banners.length > 0 && (
   <div className='w-full bg-gradient-to-l from-transparent via-pink-500/20 to-transparent overflow-hidden'>
      {/* Horizontal inline marquee: all banners shown one after another */}
      <div className='h-12 md:h-12 flex items-center'>
         <Suspense fallback={
           <div className='flex items-center justify-center w-full h-12'>
             <div className='text-base font-bold animate-pulse'>Loading banners...</div>
           </div>
         }>
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
         </Suspense>
      </div>
   </div>
)}
      <main className='pet-pattern-bg '>
        <section className='relative overflow-hidden hero-bg'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24 relative z-10'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='order-2 lg:order-1'>
                <h1 className='text-4xl md:text-5xl lg:text-6xl hero-title mb-6 leading-tight'>Your Pet Deserves Only the <span className='hero-accent'>BEST</span></h1>
                <p className='text-lg lg:text-xl font-body text-gray-600 mb-8 leading-relaxed max-w-lg'>Discover premium pet accessories that combine style, comfort, and quality. From adorable collars to treat jars, we have everything your furry baby needs.</p>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <NavigationLink href='/products'><button className='btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto'><span>Shop Now</span><ArrowRight className='w-5 h-5' /></button></NavigationLink>
                  <NavigationLink href='/about'><button className='btn-secondary w-full sm:w-auto'>About Us</button></NavigationLink>
                </div>
              </div>

              <div className='relative order-1 lg:order-2'>
                <div className='bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-8 shadow-sm relative'>
                  <div className='absolute -top-2 -right-2 w-4 h-4 bg-pink-300 rounded-full opacity-60'></div>
                  <div className='absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full opacity-40'></div>

                  <div className='relative w-full h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-orange-50'>
                    <Image 
                      fill 
                      src={landingImageUrl || 'https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_800,h_600,q_60,f_webp/v1755786569/kdqtrcjjxdkdeak97rwx.jpg'} 
                      alt='Happy puppy with accessories' 
                      className='object-cover transition-opacity duration-300' 
                      quality={60} 
                      sizes='(max-width: 640px) 400px, (max-width: 1024px) 600px, 800px' 
                      priority={true}
                      fetchPriority="high"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDzX1Hidazp0nVLV0Va2ASj3Lev+EOAEZ5/9k="
                    />
                  </div>

                </div>
                <div className='absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 bg-pink-500 text-white p-4 rounded-xl shadow-lg cursor-pointer' onClick={() => { const el = document.getElementById('happy-pets'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                  <p className='font-body font-semibold'>🐕 Happy Pets</p>
                  <p className='text-sm font-body opacity-90'>1000+ Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the page: features, slideshow, products preview, testimonials, etc. */}
        <section className='py-16 lg:py-20 bg-white relative'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className='text-center mb-0'>
              <h2 className='text-3xl md:text-4xl section-title text-gray-900 mb-2 leading-tight'>Pet Accessories</h2>
              <p className='text-lg font-body text-gray-600'>Adorable Finds, One Category at a Time</p>
            </motion.div>

            <Suspense fallback={
              <div className='flex items-center justify-center h-64 bg-gray-50 rounded-lg'>
                <div className='text-center'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-pink mx-auto mb-4'></div>
                  <p className='text-gray-600'>Loading slideshow...</p>
                </div>
              </div>
            }>
              <LightweightSlideshow slides={[
                { image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757081273/WhatsApp_Image_2025-09-04_at_19.27.12_5e2bcfa4_qxqxbn.png', title: 'Bandana/Neck Scarf' },
                { image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757082005/WhatsApp_Image_2025-09-04_at_19.28.45_0db24edb_qgcyy9.png', title: 'Bow Ties' },
                { image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078385/WhatsApp_Image_2025-09-04_at_19.37.44_52689dd9_s2twm9.jpg', title: 'Collars' },
                { image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078384/WhatsApp_Image_2025-09-04_at_19.33.09_20740e7c_n08afc.jpg', title: 'Collar-Leash Set' },
                { image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078385/WhatsApp_Image_2025-09-04_at_19.34.56_e1ff4a5d_vur11d.jpg', title: 'Treat Jars' },
              ]} />
            </Suspense>

            <div className='text-center mt-12'>
              <NavigationLink href='/products'><button className='btn-primary font-body font-medium'>View All Products</button></NavigationLink>
            </div>
          </div>
        </section>

        {/* Testimonials + Happy Pets slider + CTA trimmed for brevity */}
{/* Testimonials */}
            <section className='py-16 lg:py-20 features-bg'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
                  <Suspense fallback={
                    <div className='text-center mb-12'>
                      <h2 className='text-3xl md:text-4xl section-title text-gray-900 mb-4 leading-tight'>
                        What Pet Parents Say
                      </h2>
                      <p className='text-lg font-body text-gray-600'>Don&apos;t just take our word for it</p>
                    </div>
                  }>
                    <PerformanceMotion
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      className='text-center mb-12'
                    >
                      <h2 className='text-3xl md:text-4xl section-title text-gray-900 mb-4 leading-tight'>
                        What Pet Parents Say
                      </h2>
                      <p className='text-lg font-body text-gray-600'>Don&apos;t just take our word for it</p>
                    </PerformanceMotion>
                  </Suspense>

                  {/* Bento-style responsive testimonials using CSS columns for a masonry feel */}
                  <div className='bento-container'>
                     {testimonials.map((testimonial, index) => (
                        <Suspense key={index} fallback={
                          <div className='testimonial-card mb-6 break-inside-avoid'>
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
                          </div>
                        }>
                          <PerformanceMotion
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            className='testimonial-card mb-6 break-inside-avoid'
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
                          </PerformanceMotion>
                        </Suspense>
                     ))}
                  </div>
               </div>
            </section>

            {/* Our Happy Pets Auto Slider */}
            <section id='happy-pets' className='py-16 lg:py-20 bg-white'>
               <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                  <div className='text-center mb-6'>
                     <h3 className='text-3xl md:text-4xl section-title text-gray-900 mb-4 leading-tight'>Our Happy Pets 🐾</h3>
                     <p className='text-lg font-body text-gray-600'>A few snaps from our lovely customers</p>
                     
                  </div>
                  <Suspense fallback={
                    <div className='flex items-center justify-center h-40 bg-gray-50 rounded-lg'>
                      <div className='text-center'>
                        <div className='animate-pulse text-gray-600'>Loading happy pets gallery...</div>
                      </div>
                    </div>
                  }>
                    <ImageAutoSlider />
                  </Suspense>
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
                  <Suspense fallback={
                    <div>
                      <h2 className='text-3xl md:text-4xl section-title text-white mb-4 leading-tight'>
                        Ready to Spoil Your Pet?
                      </h2>
                      <p className='text-lg font-body text-white/90 mb-8 max-w-2xl mx-auto'>
                        Join thousands of happy pet parents who trust Hezal Accessories for their four legged babies.
                      </p>
                      <NavigationLink href='/products'>
                        <button className='bg-white text-pink-500 px-8 py-4 rounded-md font-body font-semibold text-lg hover:bg-gray-200 transition-colors'>
                          Start Shopping Now
                        </button>
                      </NavigationLink>
                    </div>
                  }>
                    <PerformanceMotion
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
                      <NavigationLink href='/products'>
                        <button className='bg-white text-pink-500 px-8 py-4 rounded-md font-body font-semibold text-lg hover:bg-gray-200 transition-colors'>
                          Start Shopping Now
                        </button>
                      </NavigationLink>
                    </PerformanceMotion>
                  </Suspense>
               </div>
            </section>
         
         
      </main>
      <Footer />
    </>
  )
}
