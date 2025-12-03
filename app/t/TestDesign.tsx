'use client'

import React, { useEffect } from 'react'
import { ArrowRight, Star, Shield, Truck, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Lenis from 'lenis'

export default function TestDesign() {
  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#FFFBF5] font-sans selection:bg-pink-200">
      <Navbar />
      
      {/* Hero Section - 100vh on Desktop, Auto on Mobile */}
      <main className="relative flex flex-col lg:flex-row min-h-[calc(100vh-80px)] lg:h-screen pt-20 lg:pt-0">
        
        {/* Left Side: Editorial Content */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 sm:px-12 lg:pl-24 lg:pr-12 py-12 lg:py-0 relative z-10">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-pink-100/50 border border-pink-200 rounded-full px-4 py-1.5 w-fit mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-pink-800 tracking-wide uppercase">New Collection 2025</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight"
            >
              Your Pet <br />
              Deserves the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 italic pr-2">
                Very Best.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 mb-10 max-w-md leading-relaxed"
            >
              Handcrafted accessories that blend premium comfort with head-turning style. Because they aren&apos;t just pets, they&apos;re family.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button className="group relative px-8 py-4 bg-gray-900 text-white rounded-full font-medium text-lg overflow-hidden transition-all hover:shadow-xl hover:shadow-pink-500/20">
                <span className="relative z-10 flex items-center">
                  Shop Essentials
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-medium text-lg hover:border-gray-900 hover:text-gray-900 transition-colors">
                View Lookbook
              </button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 pt-8 border-t border-gray-200 flex items-center gap-8 text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Pet-Safe Materials</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                <span className="text-sm font-medium">Fast Shipping</span>
              </div>
            </motion.div>
        </div>

        {/* Right Side: Visual Drama */}
        <div className="w-full lg:w-[55%] relative h-[60vh] lg:h-auto bg-[#FDF2F8] lg:bg-transparent overflow-hidden">
            
            {/* The "Premium" Background Block */}
            <div className="absolute inset-0 lg:left-0 lg:right-0 bg-gradient-to-br from-pink-50 to-purple-50 lg:rounded-tl-[4rem] overflow-hidden">
                {/* Abstract Shapes for Texture */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pink-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
            </div>

            {/* The Image Container - Floating Card Effect */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-4 lg:inset-12 lg:left-8 shadow-2xl rounded-3xl overflow-hidden bg-white"
            >
               <Image 
                 src="https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_1200,h_1600,q_90,f_webp/v1755786569/kdqtrcjjxdkdeak97rwx.jpg"
                 alt="Happy dog wearing premium accessories"
                 fill
                 className="object-cover object-center hover:scale-105 transition-transform duration-700"
                 priority
               />
               
               {/* Floating Info Card */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.8 }}
                 className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50"
               >
                 <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">Featured</p>
                      <p className="text-gray-900 font-bold">The Festive Collection</p>
                    </div>
                    <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                      <ArrowRight className="w-5 h-5 -rotate-45" />
                    </div>
                 </div>
               </motion.div>
            </motion.div>

        </div>

      </main>
    </div>
  )
}
