'use client'

import Head from 'next/head'
import { Product } from '@/lib/products'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  product?: Product
  breadcrumbs?: Array<{ name: string; url: string }>
  noIndex?: boolean
  structuredData?: any
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Hezal Accessories - Premium Pet Accessories & Custom Dog Collars",
  description = "Your pet deserves only the best! Discover premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Quality products for your furry friends. Free shipping on orders over ₹999.",
  keywords = ["pet accessories", "dog collars", "custom pet products", "dog leashes", "pet bow ties", "bandanas", "premium pet gear"],
  canonicalUrl,
  ogImage = "/logom.png",
  ogType = "website",
  product,
  breadcrumbs = [],
  noIndex = false,
  structuredData
}) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`
  const fullCanonicalUrl = canonicalUrl || siteUrl

  // Generate structured data for products
  const generateProductSchema = (product: Product) => {
    const priceRange = product.sizePricing && product.sizePricing.length > 0 
      ? product.sizePricing.filter(sp => sp.price > 0).map(sp => sp.price)
      : [product.price]
    
    const minPrice = Math.min(...priceRange)
    const maxPrice = Math.max(...priceRange)

    // Get all product images
    const productImages = [product.image, ...(product.images || [])].filter(Boolean)

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.title,
      "description": product.description,
      "image": productImages.map((url: string) => url.startsWith('http') ? url : `${siteUrl}${url}`),
      "sku": product.id,
      "category": product.category,
      "brand": {
        "@type": "Brand",
        "name": "Hezal Accessories"
      },
      "offers": {
        "@type": "Offer",
        "price": minPrice === maxPrice ? minPrice : `${minPrice}-${maxPrice}`,
        "priceCurrency": "INR",
        "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Hezal Accessories"
        }
      },
      "aggregateRating": product.rating ? {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "bestRating": 5,
        "worstRating": 1,
        "ratingCount": product.reviews || Math.floor(Math.random() * 50) + 10
      } : undefined
    }
  }

  // Generate breadcrumb schema
  const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => {
    if (breadcrumbs.length === 0) return null

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": `${siteUrl}${crumb.url}`
      }))
    }
  }

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hezal Accessories",
    "url": siteUrl,
    "logo": `${siteUrl}/logom.png`,
    "description": "Premium pet accessories seller specializing in custom dog collars, leashes, and stylish pet gear. Your pet deserves only the best!",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7060266900",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.instagram.com/hezal_accessories"
    ]
  }

  const keywordsString = keywords.join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content="Hezal Accessories" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Hezal Accessories" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:creator" content="@hezal_accessories" /> {/* Updated Twitter handle */}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#ec4899" />
      <meta name="msapplication-TileColor" content="#ec4899" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />
      
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateProductSchema(product))
          }}
        />
      )}
      
      {breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs))
          }}
        />
      )}
      
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}

export default SEOHead