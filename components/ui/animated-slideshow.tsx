"use client"

import * as React from 'react'
import Image from 'next/image'
import { HTMLMotionProps, MotionConfig, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Slide {
  title: string
  image: string
}

interface HoverSliderContextValue {
  activeSlide: number
  changeSlide: (index: number) => void
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(undefined)
function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) throw new Error('useHoverSliderContext must be used within a HoverSliderProvider')
  return context
}

export function HoverSlider({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children: React.ReactNode }) {
  const [activeSlide, setActiveSlide] = React.useState<number>(0)
  const changeSlide = React.useCallback((index: number) => setActiveSlide(index), [])
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div className={cn(className || '', 'w-full')} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  )
}

export const TextStaggerHover = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { text: string; index: number }>(({
  text,
  index,
  className,
  ...props
}, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const characters = text.split('').map((c) => c)
  const isActive = activeSlide === index
  const handleMouse = () => changeSlide(index)

  return (
    <span
      className={cn('relative inline-block origin-bottom overflow-hidden cursor-pointer', className)}
      {...props}
      ref={ref as any}
      onMouseEnter={handleMouse}
      onFocus={handleMouse}
      aria-label={text}
    >
      {characters.map((char, i) => {
        const key = `char-${i}`
        // render visible spacer for whitespace so spaces are preserved visually
        if (char === ' ' || char === '\u00A0') {
          return <span key={key} className='inline-block w-3 md:w-4' aria-hidden='true' />
        }

        return (
          <span key={key} className='relative inline-block overflow-hidden leading-none'>
            <MotionConfig transition={{ delay: i * 0.02, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <motion.span className='inline-block opacity-20' initial={{ y: '0%' }} animate={isActive ? { y: '-110%' } : { y: '0%' }}>
                {char}
              </motion.span>

              <motion.span className='absolute left-0 top-0 inline-block opacity-100' initial={{ y: '110%' }} animate={isActive ? { y: '0%' } : { y: '110%' }}>
                {char}
              </motion.span>
            </MotionConfig>
          </span>
        )
      })}
    </span>
  )
})
TextStaggerHover.displayName = 'TextStaggerHover'

export const HoverSliderImageWrap = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1', className)} {...props} />
  )
})
HoverSliderImageWrap.displayName = 'HoverSliderImageWrap'

export const HoverSliderImage = React.forwardRef<HTMLImageElement, HTMLMotionProps<'img'> & { index: number }>(({
  index,
  className,
  ...props
}, ref) => {
  const { activeSlide } = useHoverSliderContext()
  const clipPathVariants = {
    visible: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
    hidden: { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)' },
  }

  return (
    <motion.img
      className={cn('inline-block align-middle w-full h-full object-cover', className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={activeSlide === index ? 'visible' : 'hidden'}
      ref={ref as any}
      {...props}
    />
  )
})
HoverSliderImage.displayName = 'HoverSliderImage'

export default function AnimatedSlideshow({ slides }: { slides: Slide[] }) {
  // Use context to read active slide and update UI
  return (
    <HoverSlider className='min-h-[40vh] place-content-center p-6 md:px-12 bg-transparent text-gray-900'>
      {/* <div className='mb-4 text-sm font-medium text-pink-500 uppercase tracking-wide'>Categories</div> */}

  <div className='flex flex-col md:flex-row items-start md:items-between max-w-6xl mx-auto'>
        {/* Titles column: visible on left for md+, stacked above on mobile */}
           <div className='w-full md:w-1/3 flex flex-col space-y-4 items-start '>
          {slides.map((s, i) => (
            <div key={s.title} className=''>
              <TitleButton title={s.title} index={i} />
            </div>
          ))}
        </div>

        {/* Image area (taller aspect ratio) */}
        <div className='w-full md:w-2/3 max-w-4xl'>
          <div className='relative w-full h-auto min-h-[24rem] md:min-h-[22rem] rounded-lg overflow-hidden'>
            {/* Render images stacked; we keep Image elements so Next optimizes them */}
            <ActiveImages slides={slides} />
          </div>
        </div>
      </div>
    </HoverSlider>
  )
}

function TitleButton({ title, index }: { title: string; index: number }) {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const isActive = activeSlide === index
  return (
    <button
      onClick={() => changeSlide(index)}
      className={cn(
        'text-left w-full px-1 py-1 md:py-2 rounded transition-colors',
        isActive ? 'text-primary-pink font-bold' : 'text-gray-700 hover:text-gray-900'
      )}
    >
  <TextStaggerHover index={index} text={title} className='text-2xl md:text-3xl font-bold tracking-tight uppercase' />
    </button>
  )
}

function ActiveImages({ slides }: { slides: Slide[] }) {
  const { activeSlide } = useHoverSliderContext()
  return (
    <>
      {slides.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-700 ${i === activeSlide ? 'opacity-100 z-30' : 'opacity-0 z-0'}`}
          aria-hidden={i !== activeSlide}
        >
          <Image src={s.image} alt={s.title} fill className='object-contain pb-8' sizes='(max-width: 768px) 100vw, 50vw' priority={i === activeSlide} />
        </div>
      ))}
    </>
  )
}

