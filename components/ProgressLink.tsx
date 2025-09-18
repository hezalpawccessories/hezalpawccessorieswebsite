'use client'

// DEPRECATED: This component has been replaced by NavigationLink
// This is kept for backwards compatibility but redirects to NavigationLink

import NavigationLink from './NavigationLink'
import { MouseEvent, ReactNode } from 'react'

interface ProgressLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  [key: string]: any
}

export default function ProgressLink({ href, children, onClick, ...props }: ProgressLinkProps) {
  console.warn('ProgressLink is deprecated. Please use NavigationLink instead.')
  
  // Simply redirect to NavigationLink
  return (
    <NavigationLink href={href} onClick={onClick} {...props}>
      {children}
    </NavigationLink>
  )
}
