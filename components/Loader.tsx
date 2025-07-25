import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface LoaderProps {
   className?: string
   style?: React.CSSProperties
}

const Loader: React.FC<LoaderProps> = ({ className = '', style = {} }) => {
   return (
      <div
         className={`fixed inset-0 z-[9999] flex items-center justify-center w-full h-full 
            bg-white/30 backdrop-blur-md transition-all ease-in-out duration-1000 ${className}`}
         style={style}
      >
         <DotLottieReact
            src='https://lottie.host/3ed8ca50-b4e1-4546-ba54-c662996bde12/KPG5PNfMOu.lottie'
            loop
            autoplay
            style={{ width: 280, height: 280, transform: 'scaleX(-1)' }}
         />
      </div>
   )
}

export default Loader
