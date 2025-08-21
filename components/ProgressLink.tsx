'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import { MouseEvent, ReactNode } from 'react'

interface ProgressLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  [key: string]: any
}

export default function ProgressLink({ href, children, onClick, ...props }: ProgressLinkProps) {
  const router = useRouter()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Don't start progress for external links or if default prevented
    if (e.defaultPrevented || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return
    }

    // Check if we're navigating to the same page
    const currentPath = window.location.pathname
    const targetPath = href.startsWith('/') ? href : `/${href}`
    
    if (currentPath === targetPath) {
      return
    }

    // Start progress with realistic simulation
    NProgress.start()
    
    // Simulate realistic loading progress
    let progress = 0.1
    const progressInterval = setInterval(() => {
      progress += Math.random() * 0.1 // Random increment for realism
      
      if (progress < 0.7) {
        NProgress.set(progress)
      } else {
        clearInterval(progressInterval)
        // Let the NProgressProvider handle completion based on actual page readiness
      }
    }, 100)

    // Cleanup interval if navigation is cancelled
    const cleanup = () => {
      clearInterval(progressInterval)
    }

    // Store cleanup function globally so NProgressProvider can access it
    ;(window as any).__progressCleanup = cleanup

    // Fallback cleanup after 5 seconds
    setTimeout(cleanup, 5000)
  }

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
