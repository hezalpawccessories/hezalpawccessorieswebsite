"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  baseVelocity?: number // relative speed multiplier (higher = faster)
  delay?: number
  clasname?: string
}

export default function ScrollBaseAnimation({ children, baseVelocity = 2, delay = 0, clasname, className, ...props }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [slideWidth, setSlideWidth] = React.useState<number>(0)

  // measure width of one content block
  React.useEffect(() => {
    function measure() {
      const el = contentRef.current
      if (!el || !containerRef.current) return
      // width of single block (first child)
      const first = el.children[0] as HTMLElement | undefined
      const w = first ? first.getBoundingClientRect().width : el.getBoundingClientRect().width
      setSlideWidth(w)
    }

    measure()
    const ro = new ResizeObserver(() => measure())
    if (containerRef.current) ro.observe(containerRef.current)
    if (contentRef.current) ro.observe(contentRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [children])

  // Determine pixels per second from baseVelocity; tune constants as needed
  const pixelsPerSecond = Math.max(40, Math.abs(baseVelocity) * 120)
  const duration = slideWidth > 0 ? Math.max(2, slideWidth / pixelsPerSecond) : 8

  // If slideWidth is zero, don't animate; when measured it will start.
  return (
    <div
      ref={containerRef}
      className={cn('w-full overflow-hidden', className)}
      {...props}
    >
      <motion.div
        // animate x from 0 to -slideWidth, then loop
        animate={slideWidth ? { x: [0, -slideWidth] } : { x: 0 }}
        transition={slideWidth ? { repeat: Infinity, duration, ease: 'linear', repeatType: 'loop', delay: delay / 1000 } : {}}
        className={cn('flex items-center whitespace-nowrap', clasname)}
        style={{ willChange: 'transform' }}
      >
        <div ref={contentRef} className='flex items-center space-x-8'>
          <div className='inline-flex items-center whitespace-nowrap'>{children}</div>
          {/* duplicate once for seamless looping */}
          <div className='inline-flex items-center whitespace-nowrap'>{children}</div>
        </div>
      </motion.div>
    </div>
  )
}