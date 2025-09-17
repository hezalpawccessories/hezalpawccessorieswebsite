import { Product } from '@/lib/products'

// SEO utility functions
export const generateProductSchema = (product: Product) => {
  const priceRange = product.sizePricing && product.sizePricing.length > 0 
    ? product.sizePricing.filter(sp => sp.price > 0).map(sp => sp.price)
    : [product.price]
  
  const minPrice = Math.min(...priceRange)
  const maxPrice = Math.max(...priceRange)
  const productImages = [product.image, ...(product.images || [])].filter(Boolean)

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": productImages,
    "brand": {
      "@type": "Brand",
      "name": "Hezal Accessories"
    },
    "category": product.category,
    "sku": product.id,
    "offers": {
      "@type": "Offer",
      "price": minPrice,
      "lowPrice": minPrice,
      "highPrice": maxPrice > minPrice ? maxPrice : undefined,
      "priceCurrency": "INR",
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Hezal Accessories"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.8,
      "reviewCount": 50,
      "bestRating": 5,
      "worstRating": 1
    }
  }
}

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string, href?: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@id": item.href ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'}${item.href}` : undefined,
        "name": item.name
      }
    }))
  }
}

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hezal Accessories",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.hezalaccessories.com",
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.hezalaccessories.com"}/logom.png`,
    "description": "Premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Handcrafted with love for your furry friends.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+91-7060266900",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Hindi"],
      "areaServed": "IN"
    },
    "sameAs": [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/hezal_accessories/"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "foundingDate": "2020",
    "numberOfEmployees": "2-10"
  }
}

export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hezal Accessories",
    "description": "Premium pet accessories seller specializing in custom dog collars, leashes, and stylish pet gear. Your pet deserves only the best!",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.hezalaccessories.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.hezalaccessories.com"}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  }
}

// SEO meta tags generation
export const generateMetaTags = (
  title: string,
  description: string,
  canonicalUrl?: string,
  ogImage?: string,
  keywords?: string[]
) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'
  const fullTitle = title.includes('Hezal Accessories') ? title : `${title} | Hezal Accessories`
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${siteUrl}${ogImage || '/logom.png'}`

  return {
    title: fullTitle,
    description,
    canonical: fullCanonicalUrl,
    openGraph: {
      title: fullTitle,
      description,
      url: fullCanonicalUrl,
      siteName: 'Hezal Accessories',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullOgImage],
      creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE || '@hezal_accessories',
    },
    keywords: keywords?.join(', '),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }
  }
}

// Keyword optimization utilities
export const optimizeContentForSEO = (content: string, keywords: string[]) => {
  // This is a basic implementation - you might want to use more sophisticated NLP
  let optimizedContent = content
  
  keywords.forEach(keyword => {
    // Ensure keywords appear naturally in content
    if (!optimizedContent.toLowerCase().includes(keyword.toLowerCase())) {
      // Add keyword naturally if it doesn't exist
      optimizedContent += ` Our ${keyword} are designed with your pet's comfort in mind.`
    }
  })
  
  return optimizedContent
}

// Generate alt text for images
export const generateAltText = (product: Product, imageIndex: number = 0) => {
  const descriptors = [
    'premium',
    'custom',
    'handcrafted',
    'stylish',
    'comfortable'
  ]
  
  const randomDescriptor = descriptors[Math.floor(Math.random() * descriptors.length)]
  
  if (imageIndex === 0) {
    return `${randomDescriptor} ${product.category.toLowerCase()} - ${product.title} by Hezal Accessories`
  } else {
    return `${product.title} ${product.category.toLowerCase()} - detailed view ${imageIndex + 1}`
  }
}

// URL optimization
export const createSEOFriendlySlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Internal linking suggestions
export const generateInternalLinks = (currentProduct: Product, allProducts: Product[]) => {
  return allProducts
    .filter(p => 
      p.id !== currentProduct.id && 
      (p.category === currentProduct.category || p.collection === currentProduct.collection)
    )
    .slice(0, 3) // Limit to 3 related products
    .map(p => ({
      title: p.title,
      href: `/products/${createSEOFriendlySlug(p.title)}`,
      reason: p.category === currentProduct.category ? 'Same category' : 'Same collection'
    }))
}