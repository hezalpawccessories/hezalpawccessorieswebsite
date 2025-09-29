'use client'

import { useState, useEffect } from 'react'
import { LazyMotion, domAnimation, m } from 'framer-motion'

interface PerformanceMotionProps {
  children: React.ReactNode
  className?: string
  initial?: any
  whileInView?: any
  transition?: any
  [key: string]: any
}

export const PerformanceMotion = ({ 
  children, 
  className,
  initial,
  whileInView,
  transition,
  ...rest
}: PerformanceMotionProps) => {
  const [shouldLoadAnimations, setShouldLoadAnimations] = useState(false)

  useEffect(() => {
    // Load animations only after initial page load and when user starts interacting
    const loadAnimations = () => {
      setShouldLoadAnimations(true)
    }

    // Delay animation loading to prioritize critical content
    const timer = setTimeout(loadAnimations, 800)
    
    // Or load on first interaction
    const handleInteraction = () => {
      setShouldLoadAnimations(true)
      clearTimeout(timer)
    }

    // Listen for user interactions to load animations
    const events = ['scroll', 'touchstart', 'click', 'mousemove']
    events.forEach(event => {
      window.addEventListener(event, handleInteraction, { once: true, passive: true })
    })

    return () => {
      clearTimeout(timer)
      events.forEach(event => {
        window.removeEventListener(event, handleInteraction)
      })
    }
  }, [])

  if (!shouldLoadAnimations) {
    // Return non-animated version for faster initial load
    return <div className={className}>{children}</div>
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        initial={initial}
        whileInView={whileInView}
        transition={transition}
        className={className}
        {...rest}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}

export default PerformanceMotion