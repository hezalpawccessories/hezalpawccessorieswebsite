'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
      {/* Home */}
      <Link 
        href="/" 
        className="flex items-center text-gray-500 hover:text-primary-pink transition-colors duration-200"
        aria-label="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === items.length - 1 ? (
            // Last item - current page (no link)
            <span 
              className="text-gray-900 font-medium"
              aria-current="page"
            >
              {item.name}
            </span>
          ) : (
            // Intermediate items - links
            <Link 
              href={item.url}
              className="text-gray-500 hover:text-primary-pink transition-colors duration-200"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb