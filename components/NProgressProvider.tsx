'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'

// Configure NProgress for real progress tracking
NProgress.configure({ 
  showSpinner: true,
  speed: 400,        // Slower for more realistic feel
  minimum: 0.08,     // Lower minimum for gradual start
  easing: 'ease',
  trickleSpeed: 300, // Slower trickling
  trickle: false     // Disable automatic trickling - we'll control it manually
})

export default function NProgressProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Real progress tracking based on page readiness
    const handlePageLoadComplete = () => {
      // Clean up any ongoing progress intervals from ProgressLink
      if ((window as any).__progressCleanup) {
        (window as any).__progressCleanup()
        delete (window as any).__progressCleanup
      }

      // Wait for images, fonts, and all resources to load
      if (document.readyState === 'complete') {
        // Additional check for React hydration/rendering
        const checkPageReady = () => {
          // Check if main content is rendered
          const mainContent = document.querySelector('main') || document.querySelector('[data-page-content]')
          if (mainContent && mainContent.children.length > 0) {
            // Final progress update before completion
            NProgress.set(0.9)
            setTimeout(() => {
              NProgress.done()
            }, 50)
          } else {
            // Retry after a short delay
            setTimeout(checkPageReady, 50)
          }
        }
        
        // Small delay to ensure React components have rendered
        setTimeout(checkPageReady, 100)
      } else {
        // Page still loading, wait for it
        window.addEventListener('load', handlePageLoadComplete, { once: true })
      }
    }

    // Start checking page readiness
    handlePageLoadComplete()

    // Fallback: Complete after 3 seconds to prevent infinite loading
    const fallbackTimer = setTimeout(() => {
      if ((window as any).__progressCleanup) {
        (window as any).__progressCleanup()
        delete (window as any).__progressCleanup
      }
      NProgress.done()
    }, 3000)

    return () => {
      clearTimeout(fallbackTimer)
      window.removeEventListener('load', handlePageLoadComplete)
      if ((window as any).__progressCleanup) {
        (window as any).__progressCleanup()
        delete (window as any).__progressCleanup
      }
    }
  }, [pathname, searchParams])

  // Handle browser navigation events and page lifecycle
  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', handleStart)
    
    // Handle page visibility changes (tab switching, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Check if we need to complete progress when returning to tab
        if (document.readyState === 'complete') {
          setTimeout(() => {
            NProgress.done()
          }, 100)
        }
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Handle page load completion for initial load
    const handleLoad = () => {
      // Don't auto-complete on load event, let the pathname effect handle it
    }
    
    window.addEventListener('load', handleLoad)

    // Ensure progress is completed on component mount if page already loaded
    if (document.readyState === 'complete') {
      setTimeout(() => {
        NProgress.done()
      }, 100)
    }

    return () => {
      window.removeEventListener('popstate', handleStart)
      window.removeEventListener('load', handleLoad)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      NProgress.done()
    }
  }, [])

  return null
}
