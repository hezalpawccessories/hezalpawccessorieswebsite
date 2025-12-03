'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Package, Shield, Truck, Award, Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Footer from '@/components/Footer'
import ScrollBaseAnimation from '@/components/ui/text-marquee'
import NavigationLink from '@/components/NavigationLink'
import SEOHead from '@/components/SEO/SEOHead'
import Navbar from '@/components/Navbar'

interface Props {
    landingImageUrl: string | null
}

export default function NewLayout( {landingImageUrl}: Props) {

    // Structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hezal Accessories",
    "url": "https://www.hezalaccessories.com",
    "logo": "https://www.hezalaccessories.com/logom.png",
    "description": "Premium pet accessories including collars, leashes, bow ties, collar-leash matching sets, custom treat-jars and bandanas. Handcrafted with love for your furry baby.",
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

    const [isAuthenticated, setIsAuthenticated] = useState(
          (typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true') || false
       )

    const testimonials = [
    {
         name: '@victor_labrador_doggo',
         rating: 5,
         comment:
            "I absolutely love Hezal Accessories, the best brand for my dog's outfits! 💕 Their products are stylish, well-made, and super comfortable for pets. The fabric quality is excellent – soft, durable, and gentle on the skin. The designs are creative and available in all sizes, making it easy to find the perfect fit. I have a reversible bandana (Mickey Mouse + polka dots), a festive Christmas bandana, and an army-style bowtie – all of them look amazing on my dog and fit perfectly. Stylish, comfy, and always bringing compliments. Highly recommend! 🐾✨We absolutely love you guys ♥ Keep growing and shining always ✨"
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
         name: '@sparkle.shiro',
         rating: 5,
         comment:
            'I was looking for bandanas for my furbaby for festive occasions and while scrolling through Instagram, I came across Hezal accessories profile and instantly liked their products. Hezal accessories has a wide collection for all occasions with exquisite designs. Also, the quality is top-notch. Service is good and products are delivered on time without requiring any follow up, glad to be their customer.',
      },
   ]

   const happyPetItems = useMemo(() => [
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963914/287312017_440724157868763_8123535573385101371_n_gbsokk.jpg', title: '@bruno_the.golden.boy_' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963914/241312174_534383720955271_3438449773866577894_n_zzvg77.jpg', title: '@pawfully.yours' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800//v1757077947/WhatsApp_Image_2025-09-04_at_19.49.01_16785791_od8tnd.jpg', title: '@lexie_quinn_maben' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963916/327548327_3177782035866949_179112891589676750_n_o9jcdi.jpg', title: '@thewhiskeypatootie' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963915/322924510_142221248631298_4512437418189425826_n_dhm5me.jpg', title: '@lexie_quinn_maben' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963915/290007258_179777054478160_4353043592713499427_n_rg9yaq.jpg', title: '@the_pooch_patisserie' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/239541482_215300797205090_6848654758273246870_n_jifkin.jpg', title: '@_buzzoo_19' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/283434743_153422697190659_4480803216439245309_n_mo28gg.jpg', title: '@uno_golden_boy' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/278460836_1513183882416940_690120010142730407_n_cz83fa.jpg', title: '@zolathechonkygal' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/266275373_624245152032151_9028644669941105180_n_pjddcu.jpg', title: '@sparkey_the_golden_retriever' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/q_auto,f_auto,c_fill,g_auto,w_800,h_800/v1756963913/272174770_614123276361632_1171529176954943132_n_zehqi5.jpg', title: '@shiro.barked' },
       { src: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757077947/WhatsApp_Image_2025-09-05_at_12.42.55_528d0761_lhqqyh.jpg', title: '@happy.dog.rumi' },
     ], [])

     const features = [
         { icon: Package, title: 'Handcrafted', description: 'Each product is carefully crafted with attention to detail and premium materials.' },
         { icon: Shield, title: 'Pet-Safe Materials', description: 'Only non-toxic, pet-friendly materials that are gentle on your pet skin.' },
         { icon: Truck, title: 'Fast Delivery', description: 'Quick and reliable shipping across India. Free shipping on orders over ₹799.' },
         { icon: Award, title: 'Trusted by 1000+', description: 'Join thousands of satisfied pet parents who love our products.' }
       ]

    return (
        <>
        
        <SEOHead
        title="Hezal Accessories - Pet Accessories | Dog Accessories"
        description="Your pet deserves only the best! Discover premium pet accessories including dog collars, leashes, bow ties, collar-leash sets, custom treat-jars and bandanas. Quality products for your furry baby. Free shipping on orders over ₹799."
        keywords={['pet accessories', 'dog collars', 'custom pet products', 'dog leashes', 'pet bow ties', 'bandanas', 'premium pet gear', 'handcrafted pet accessories', 'pet fashion', 'dog fashion']}
        canonicalUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'}
        ogType="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Hezal Accessories",
          "description": "Pet accessories seller specializing in dog collars, leashes, bandanas, custom treat-jars and more. Your pet deserves only the best!",
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
        <div className="min-h-screen selection:bg-pink-200">
       
        <header><Navbar /></header>

        <main>
            {/* /* Section 1: Hero Section */}
             <section className='relative min-h-screen relative flex flex-col justify-center overflow-hidden pb-20 bg-gradient-to-b from-white to-pink-100'
            >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full'>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                          <div className='order-2 lg:order-1'>
                            <h1 className='text-4xl md:text-5xl lg:text-7xl hero-title mb-6 leading-tight'>Your Pet Deserves Only the <span className='hero-accent'>BEST</span></h1>
                            <p className='text-lg lg:text-xl font-body text-gray-600 mb-8 leading-relaxed max-w-lg'>Discover premium pet accessories that combine style, comfort, and quality. From adorable collars to treat jars, we have everything your furry baby needs.</p>
                            <div className='flex gap-4'>
                              <NavigationLink href='/products'><button className='btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto'><span>Shop Now</span><ArrowRight className='w-5 h-5' /></button></NavigationLink>
                              <NavigationLink href='/about'><button className='btn-secondary w-full sm:w-auto'>About Us</button></NavigationLink>
                            </div>
            
                          </div>
            
                          <div className='relative order-1 lg:order-2 pt-4'>
                            <div className='bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-2xl p-8 shadow-sm relative'>
                              <div className='absolute -top-2 -right-2 w-4 h-4 bg-pink-300 rounded-full opacity-60'></div>
                              <div className='absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full opacity-40'></div>
            
                              <div className='relative h-80 sm:h-96 w-full sm:max-w-[400px] sm:mx-auto rounded-xl overflow-hidden'>
                                <Image 
                                  fill 
                                  src={landingImageUrl || 'https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_800,h_600,q_60,f_webp/v1755786569/kdqtrcjjxdkdeak97rwx.jpg'} 
                                  alt='Happy dog with comfortable pet accessories' 
                                  className='object-cover transition-opacity duration-500 ease-out' 
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
                      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 lg:mt-16 w-full'>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
                          {features.map((f, i) => {const IC = f.icon; return (<motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className='text-center'>
                        <div className='w-14 h-14 mx-auto mb-4 bg-pink-50 rounded-xl flex items-center justify-center'>
                          <IC className='w-7 h-7 text-pink-600' />
                      </div>
                      <h3 className='text-lg font-bold text-gray-900 mb-2'>{f.title}</h3>
                      <p className='text-sm text-gray-600'>{f.description}</p></motion.div>
                    )})}
                      </div>
                      </div>
             </section>
                     
            {/* Section 2: What We Have */}
            <section className='min-h-screen bg-gradient-to-b from-pink-100 to-pink-50 relative pb-20'>
                
                {/* 1. Offers Marquee */}
                <div className="bg-pink-500 text-white py-3 mb-20 shadow-lg overflow-hidden">
                    <ScrollBaseAnimation baseVelocity={-1}>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">✨ Use Code WELCOME10 for 10% Off</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">🐾</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">Free Shipping on orders above ₹799</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">🐾</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">Handcrafted with Love in India</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">🐾</span>
                         <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">✨ Use Code WELCOME10 for 10% Off</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">🐾</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">Free Shipping on orders above ₹799</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">🐾</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">Handcrafted with Love in India</span>
                        <span className="text-base lg:text-lg font-bold mx-6 tracking-wider uppercase">🐾</span>
                    </ScrollBaseAnimation>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                    
                    {/* 2. Most Loved Products */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-end px-4">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">Most Loved</h2>
                                <p className="text-lg text-gray-600 font-medium">Favorites chosen by pet parents like you.</p>
                            </div>
                            <Link href="/products" className="hidden md:flex items-center gap-2 text-pink-600 font-bold hover:text-pink-700 transition-colors">
                                View All <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="relative -mx-4 sm:mx-0">
                            <ScrollBaseAnimation baseVelocity={-0.5} className="py-8">
                                <div className="flex gap-8 px-4">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <article key={item} className="w-[280px] md:w-[320px] flex-shrink-0 group cursor-pointer">
                                            <Link href="/products">
                                                <div className="relative h-[320px] md:h-[380px] rounded-3xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                                                    <Image 
                                                        src={`https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_600,h_800,q_80/v1755786569/kdqtrcjjxdkdeak97rwx.jpg`}
                                                        alt="Festive Bandana Red"
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                    <div className="absolute bottom-6 right-6 lg:right-4 lg:bottom-4 bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                                        <ArrowRight className="w-5 h-5 text-gray-900" />
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-1">Festive Bandana Red</h3>
                                                <div className="flex items-center gap-1 mb-2">
                                                     {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                                     <span className="text-xs text-gray-500 ml-1">(45)</span>
                                                </div>
                                                
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            </ScrollBaseAnimation>
                        </div>
                    </div>

                    {/* 3. Shop by Collection */}
                    <div className="space-y-8">
                        <div className="text-center max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Curated Collections</h2>
                            <p className="text-lg text-gray-600">Designed for every mood and occasion.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'Birthday/Barkday Collection', link: '/products?collection=Birthday%2FBarkday+collection', image:'/birthdaycollection.png', alt: 'Unique Birthday/Barkday Collection for pets' },
                                { name: 'Christmas Collection', link: '/products?collection=Christmas', image:'https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_1000,h_800,q_80/v1755786569/kdqtrcjjxdkdeak97rwx.jpg', alt: 'Unique Christmas Collection for pets' },
                                { name: 'Classic Print', link: '/products?collection=Classic+Prints', image:'/classicprintcollage.png', alt: 'Unique Classic Print Collection for pets' },
                                { name: 'Festive Collection', link: '/products?collection=Festive', image:'https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_1000,h_800,q_80/v1755786569/kdqtrcjjxdkdeak97rwx.jpg', alt: 'Unique Festive Collection for pets' }
                            ].map((collection, idx) => (
                                <Link key={idx} href={collection.link} className="block">
                                    <article className="group relative h-[400px] rounded-[2.5rem] overflow-hidden cursor-pointer">
                                        <Image 
                                            src={collection.image}
                                            alt={collection.alt}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-10 left-10 text-white">
                                            <h3 className="text-3xl font-bold mb-2">{collection.name}</h3>
                                            <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest border-b-2 border-white pb-1">
                                                Explore Collection <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                        <div className="text-center">
                             <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all">
                                View All Collections
                            </Link>
                        </div>
                    </div>

                    {/* 4. Shop by Category */}
                    <div className="space-y-12">
                         <div className="flex justify-between items-end">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
                            <Link href="/products" className="hidden md:flex items-center gap-2 text-pink-600 font-bold hover:text-pink-700 transition-colors">
                                View All <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[
                                { name: 'Bandana/Neck Scarf', link: '/products?category=Bandana%2Fneck+scarf', image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078384/WhatsApp_Image_2025-09-04_at_19.27.12_5e2bcfa4_v6ppiw.jpg' },
                                { name: 'Bow Ties', link: '/products?category=Bow+ties', image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757386309/boo5x68anbketijwrakj.jpg' },
                                { name: 'Collar-Leash Set', link: '/products?category=Collar-leash+set', image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757082004/WhatsApp_Image_2025-09-04_at_19.33.09_20740e7c_kmrhlb.png' },
                                { name: 'Collars', link: '/products?category=Collars', image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078385/WhatsApp_Image_2025-09-04_at_19.37.44_52689dd9_s2twm9.jpg' },
                                { name: 'Treat Jars', link: '/products?category=Treat+Jars', image: 'https://res.cloudinary.com/dt2qyj4lj/image/upload/v1757078385/WhatsApp_Image_2025-09-04_at_19.34.56_e1ff4a5d_vur11d.jpg' }
                            ].map((cat, idx) => (
                                <Link key={idx} href={cat.link} className="block">
                                    <article className="group cursor-pointer">
                                        <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4 bg-white">
                                             <Image 
                                                src={cat.image}
                                                alt={cat.name}
                                                fill
                                                className="object-contain group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Hover Arrow Overlay */}
                                            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300 z-10">
                                                <ArrowRight className="w-5 h-5 text-gray-900" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 text-center group-hover:text-pink-600 transition-colors">{cat.name}</h3>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
            
            {/* Section 3: Why Us & Social Proof */}
            <section className='min-h-screen bg-gradient-to-b from-pink-50 to-white py-20'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                    
                    {/* 1. Testimonials */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Pet Parents Love Us</h2>
                            <p className="text-lg text-gray-600">Don&apos;t just take our word for it.</p>
                        </div>

                        {/* Mobile View: Scrollable Carousel (All Testimonials) */}
                        <div className="md:hidden flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {testimonials.map((testimonial, i) => (
                                <article key={i} className="max-w-[300px] flex-shrink-0 snap-center bg-white p-8 rounded-[2rem] shadow-sm relative flex flex-col h-full border border-gray-50">
                                    <Quote className="w-10 h-10 text-pink-200 absolute top-4 left-8" />
                                    <div className="relative z-10 pt-8 flex-grow">
                                        <p className="text-gray-700 font-medium mb-6 leading-relaxed line-clamp-6">
                                            &quot;{testimonial.comment}&quot;
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">
                                            {testimonial.name.charAt(1).toUpperCase()}
                                        </div>
                                        <div>
                                            <a 
                                                href={`https://instagram.com/${testimonial.name.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-gray-900 text-sm hover:text-pink-600 hover:underline transition-colors block"
                                            >
                                                {testimonial.name}
                                            </a>
                                            <div className="flex text-yellow-400 mt-1">
                                                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Desktop View: Grid of 3 */}
                        <div className="hidden md:grid md:grid-cols-3 gap-8">
                            {testimonials.slice(0, 3).map((testimonial, i) => (
                                <article key={i} className="bg-white p-8 rounded-[2rem] shadow-sm relative flex flex-col h-full border border-gray-50">
                                    <Quote className="w-10 h-10 text-pink-200 absolute top-4 left-6" />
                                    <div className="relative z-10 pt-8 flex-grow">
                                        <p className="text-gray-700 font-medium mb-6 leading-relaxed line-clamp-6">
                                            &quot;{testimonial.comment}&quot;
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 font-bold text-xl">
                                            {testimonial.name.charAt(1).toUpperCase()}
                                        </div>
                                        <div>
                                            <a 
                                                href={`https://instagram.com/${testimonial.name.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-gray-900 text-sm hover:text-pink-600 hover:underline transition-colors block"
                                            >
                                                {testimonial.name}
                                            </a>
                                            <div className="flex text-yellow-400 mt-1">
                                                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* 2. Happy Pets Gallery */}
                    <div className="space-y-12">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Our Happy Family 🐾</h2>
                            <p className="text-lg text-gray-600">Join the pack on Instagram <a href="https://www.instagram.com/hezal_accessories/" target="_blank" rel="noopener noreferrer" className="font-bold text-pink-600 hover:underline">@hezal_accessories</a></p>
                        </div>
                        
                        {/* Masonry-style Grid */}
                        <div className="columns-2 md:columns-4 gap-4 space-y-4">
                            {happyPetItems.map((pet, i) => (
                                <div key={i} className="relative rounded-2xl overflow-hidden break-inside-avoid group">
                                    <Image 
                                        src={pet.src}
                                        alt={pet.title}
                                        width={400}
                                        height={400} // Approximate height, actual will be determined by image aspect ratio
                                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                                        <span className="flex items-center gap-2 text-sm text-center px-2">{pet.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            {/* Final CTA Banner */}
            <section className="px-4">
                <div className="max-w-3xl mx-auto rounded-[3rem] overflow-hidden relative text-center py-12 md:py-24 px-6 shadow-2xl bg-[url('/ctabg.jpg')] bg-[length:100%_100%] md:bg-cover bg-no-repeat bg-center">
                    
                    <div className="relative z-10 space-y-4 md:space-y-8 pt-8 md:pt-10 px-4 md:px-0 pb-12 md:pb-4">
                        <h2 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tight">
                            Ready to Spoil Your Pup?
                        </h2>
                        <p className="text-base text-gray-700 max-w-md mx-auto font-medium">
                            Join thousands of happy pet parents and give your furry friend the style they deserve.
                        </p>
                        <button className="bg-gray-900 text-white px-6 py-3 md:px-10 md:py-5 rounded-full text-lg font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-12 md:mb-0">
                            Shop All Accessories
                        </button>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
        </div>
        
        </>
    )
}
