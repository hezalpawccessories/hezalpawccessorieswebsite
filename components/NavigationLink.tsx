'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { MouseEvent, ReactNode, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Loader from './Loader'

interface NavigationLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  target?: string
  rel?: string
  [key: string]: any
}

export default function NavigationLink({ 
  href, 
  children, 
  onClick, 
  target,
  rel,
  ...props 
}: NavigationLinkProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')
  const isNewTab = target === '_blank'
  const shouldUseRouteSkeleton =
    href.startsWith('/products') || href.startsWith('/cart')

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e)
    }

    // Don't show loader for external links opening in new tab
    if (isExternal && isNewTab) {
      return
    }

    // Don't show loader if default prevented
    if (e.defaultPrevented) {
      return
    }

    // For external links in same tab, show loader briefly
    if (isExternal && !isNewTab) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 1000)
      return
    }

    // For internal navigation
    if (!isExternal) {
      // Check if we're navigating to the same page
      const currentPath = window.location.pathname + window.location.search
      const targetPath = href.startsWith('/') ? href : `/${href}`
      
      if (currentPath === targetPath) {
        return
      }

      // Let App Router loading.tsx handle skeletons for key commerce routes
      if (!shouldUseRouteSkeleton) {
        setIsLoading(true)
      }

      // Use Next.js router for internal navigation
      try {
        await router.push(href)
      } catch (error) {
        console.error('Navigation error:', error)
        setIsLoading(false)
      }
    }
  }

  // Render loader as portal to document body for full-screen coverage
  const renderLoader = () => {
    if (!isLoading || !mounted) return null
    return createPortal(<Loader />, document.body)
  }

  // Handle button children (extract className and content)
  if (React.isValidElement(children) && typeof children.type === 'string' && children.type.toLowerCase() === 'button') {
    const childProps: any = children.props || {}
    const childClass = childProps.className || ''
    const childContent = childProps.children
    // Merge classNames
    const mergedClass = [childClass, props.className || ''].filter(Boolean).join(' ')

    if (isExternal) {
      return (
        <>
          <a 
            href={href} 
            onClick={handleClick} 
            className={mergedClass}
            target={target}
            rel={rel}
            {...props}
          >
            {childContent}
          </a>
          {renderLoader()}
        </>
      )
    }

    return (
      <>
        <Link 
          href={href} 
          onClick={handleClick} 
          className={mergedClass}
          {...props}
        >
          {childContent}
        </Link>
        {renderLoader()}
      </>
    )
  }

  // For external links, use regular anchor tag
  if (isExternal) {
    return (
      <>
        <a 
          href={href} 
          onClick={handleClick} 
          target={target}
          rel={rel}
          {...props}
        >
          {children}
        </a>
        {renderLoader()}
      </>
    )
  }

  // For internal links, use Next.js Link
  return (
    <>
      <Link href={href} onClick={handleClick} {...props}>
        {children}
      </Link>
      {renderLoader()}
    </>
  )
}
