'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@id": item.href ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'}${item.href}` : undefined,
        "name": item.name
      }
    }))
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-primary-pink transition-colors"
          aria-label="Home"
        >
          <Home className="w-4 h-4" />
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-primary-pink transition-colors"
              >
                {item.name}
              </Link>
            ) : (
              <span
                className={`${
                  item.current 
                    ? 'text-primary-pink font-medium' 
                    : 'text-gray-500'
                }`}
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}