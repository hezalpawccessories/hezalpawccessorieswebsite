import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface Slide {
  title: string
  image: string
}

interface LightweightSlideshowProps {
  slides: Slide[]
  className?: string
}

export function LightweightSlideshow({ slides, className }: LightweightSlideshowProps) {
  const [activeSlide, setActiveSlide] = React.useState(0)

  return (
    <div className={cn('group relative w-full', className)}>
      <div className="flex flex-col items-center space-y-8">
        {/* Image Display */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100 shadow-xl">
          <Image
            src={slides[activeSlide]?.image || slides[0]?.image}
            alt={slides[activeSlide]?.title || slides[0]?.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 40vw"
            className="object-cover transition-all duration-500 ease-in-out"
            priority
          />
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-4">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full transition-all duration-300',
                'hover:scale-105 hover:shadow-md',
                activeSlide === index
                  ? 'bg-primary-pink text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              )}
            >
              {slide.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LightweightSlideshow