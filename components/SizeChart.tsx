'use client'

import { useState } from 'react'
import { X, Ruler } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SizeChartProps {
   trigger?: React.ReactNode
   className?: string
}

export default function SizeChart({ trigger, className = '' }: SizeChartProps) {
   const [isOpen, setIsOpen] = useState(false)

   const defaultTrigger = (
      <button 
         className={`inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 transition-colors bg-pink-100 hover:bg-pink-200 rounded-full px-3 py-1 font-medium ${className}`}
         onClick={() => setIsOpen(true)}
      >
         Size Chart
      </button>
   )

   // Size data for the chart
   const sizeData = [
      { size: 'XS', neckSize: 'up to 10 inches' },
      { size: 'S', neckSize: 'up to 13 inches' },
      { size: 'M', neckSize: 'up to 17 inches' },
      { size: 'L', neckSize: 'up to 20 inches' },
      { size: 'XL', neckSize: 'up to 25 inches' },
      { size: 'XXL', neckSize: 'up to 30 inches' },
   ]

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
                     className="fixed inset-4 z-[9999] w-auto h-fit max-w-[320px] sm:max-w-sm bg-white rounded-lg sm:rounded-xl shadow-xl overflow-hidden m-auto"
                  >
                     {/* Header */}
                     <div className="flex items-center justify-between p-2 sm:p-3 border-b bg-gradient-to-r from-pink-50 to-blue-50">
                        <div className="flex items-center gap-1 sm:gap-2">
                           <Ruler className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                           <h3 className="text-xs sm:text-sm font-bold text-gray-800">Size Chart</h3>
                        </div>
                        <button
                           onClick={() => setIsOpen(false)}
                           className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                           <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        </button>
                     </div>

                     {/* Content */}
                     <div className="p-3 sm:p-4">
                        {/* Compact Size Grid */}
                        <div className="space-y-1.5 sm:space-y-2">
                           {sizeData.map((item, index) => (
                              <div 
                                 key={item.size}
                                 className="flex justify-between items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-md sm:rounded-lg bg-gray-50 hover:bg-pink-50 transition-colors border border-gray-100"
                              >
                                 <span className="text-xs sm:text-sm font-bold text-pink-500">
                                    {item.size}
                                 </span>
                                 <span className="text-[10px] sm:text-xs text-gray-600">
                                    {item.neckSize}
                                 </span>
                              </div>
                           ))}
                        </div>

                        {/* Compact Tips */}
                        <div className="mt-2 sm:mt-3 p-2 bg-blue-50 rounded-md sm:rounded-lg border border-blue-100">
                           <p className="text-[10px] sm:text-xs text-blue-700 text-center">
                              💡 Measure naturally, add 1-2&quot; comfort
                           </p>
                        </div>
                     </div>
                  </motion.div>
               </>
            )}
         </AnimatePresence>
      </>
   )
}
