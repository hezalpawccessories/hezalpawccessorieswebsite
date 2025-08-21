'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Ruler } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SizeChartProps {
   trigger?: React.ReactNode
   className?: string
}

export default function SizeChart({ trigger, className = '' }: SizeChartProps) {
   const [isOpen, setIsOpen] = useState(false)
   const [imageLoaded, setImageLoaded] = useState(false)

   const defaultTrigger = (
      <button 
         className={`inline-flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800 transition-colors bg-sky-300 rounded-2xl px-2 py-1 text-xs ${className}`}
         onClick={() => setIsOpen(true)}
      >
         {/* <Ruler className="w-4 h-4" /> */}
         Size Chart
      </button>
   )

   return (
      <>
         {trigger ? (
            <div onClick={() => setIsOpen(true)}>
               {trigger}
            </div>
         ) : (
            defaultTrigger
         )}

         <AnimatePresence>
            {isOpen && (
               <>
                  {/* Backdrop */}
                  <motion.div
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
                     onClick={() => setIsOpen(false)}
                  />

                  {/* Modal */}
                  <motion.div
                     initial={{ opacity: 0, scale: 0.8, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.8, y: 20 }}
                     transition={{ type: "spring", damping: 25, stiffness: 300 }}
                     className="fixed top-1/2 left-1/2 transform z-[9999] md:w-[10vw] max-w-md max-h-[50vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
                  >
                     {/* Header */}
                     <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                        <div className="flex items-center gap-2">
                           <Ruler className="w-4 h-4 text-blue-600" />
                           <h3 className="text-xs font-bold text-gray-800">Size Chart</h3>
                        </div>
                        <button
                           onClick={() => setIsOpen(false)}
                           className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                           <X className="w-4 h-4 text-gray-500" />
                        </button>
                     </div>

                     {/* Content */}
                     <div className="p-3 overflow-auto max-h-[calc(70vh-60px)]">
                        <div className="relative">
                           {!imageLoaded && (
                              <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
                                 <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                              </div>
                           )}
                           <Image
                              src="/sizechart.jpg"
                              alt="Size Chart"
                              width={800}
                              height={600}
                              className={`w-full h-auto max-h-72 object-contain rounded-lg transition-opacity duration-300 ${
                                 imageLoaded ? 'opacity-100' : 'opacity-0'
                              }`}
                              onLoad={() => setImageLoaded(true)}
                              priority
                              quality={50}
                              
                           />
                        </div>
                        
                        {/* <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                           <h4 className="font-semibold text-blue-800 mb-1 text-xs">Quick Tips:</h4>
                           <ul className="text-xs text-blue-700 space-y-1">
                              <li>• Measure when pet is standing naturally</li>
                              <li>• Add 1-2 inches for comfort</li>
                              <li>• If between sizes, choose larger</li>
                           </ul>
                        </div> */}
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>
   )
}
