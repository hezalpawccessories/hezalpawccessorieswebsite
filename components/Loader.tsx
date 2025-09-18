'use client'

import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface LoaderProps {
   className?: string
   style?: React.CSSProperties
}

const Loader: React.FC<LoaderProps> = ({ className = '', style = {} }) => {
   return (
      <div
         className={`fixed inset-0 z-[9999] flex items-center justify-center w-full h-full transition-all ease-in-out duration-300 ${className}`}
         style={style}
      >
         {/* Subtle backdrop */}
         <div className="absolute inset-0 bg-white/90"></div>
         
         {/* Minimal loading content */}
         <div className="relative z-10 flex flex-col items-center justify-center">
           {/* Clean loader animation */}
           <DotLottieReact
             src='https://lottie.host/3ed8ca50-b4e1-4546-ba54-c662996bde12/KPG5PNfMOu.lottie'
             loop
             autoplay
             style={{ width: 280, height: 280, transform: 'scaleX(-1)' }}
           />
           
           {/* Simple loading indicator */}
           <div className="mt-2 flex items-center space-x-2">
             <div className="flex space-x-1">
               <div className="w-2 h-2 bg-primary-pink rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-primary-pink rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
               <div className="w-2 h-2 bg-primary-pink rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
             </div>
           </div>
         </div>
      </div>
   )
}

export default Loader
