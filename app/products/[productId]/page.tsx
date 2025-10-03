/**
 * Product Detail Page - Optimized for Build Performance
 * 
 * Build Strategy:
 * - Pre-renders only the first 12 products at build time (generateStaticParams)
 * - All other products use ISR (Incremental Static Regeneration) 
 * - ISR revalidates every 60 seconds for fresh data
 * - This reduces build time from ~166 pages to just 12 pages
 * 
 * Performance Benefits:
 * - Faster builds (12 vs 166 pages)
 * - Popular products still get SSG benefits
 * - Less popular products load on-demand with caching
 * - Fresh data every 60 seconds via ISR
 */

import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getProducts } from '@/integrations/firebase/firestoreCollections'
import { Product } from '@/lib/products'

// Enable ISR - revalidate every 60 seconds for fresh product data
export const revalidate = 60

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ productId: string }> 
}): Promise<Metadata> {
  try {
    const { productId } = await params
    const products = await getProducts()
    const product = products.find(p => p.id === productId)
    
    if (!product) {
      return {
        title: 'Product Not Found | Hezal Accessories',
        description: 'The requested product could not be found.'
      }
    }

    const priceRange = product.sizePricing 
      ? `₹${Math.min(...product.sizePricing.map(p => p.price))} - ₹${Math.max(...product.sizePricing.map(p => p.price))}`
      : `₹${product.price}`

    const minPrice = product.sizePricing 
      ? Math.min(...product.sizePricing.map(p => p.price))
      : product.price

    const maxPrice = product.sizePricing 
      ? Math.max(...product.sizePricing.map(p => p.price))
      : product.price

    // Generate comprehensive keywords
    const keywords = [
      product.title,
      product.category,
      'pet accessories',
      'dog accessories',
      'cat accessories',
      'premium pet products',
      'hezal accessories',
      'buy ' + product.title.toLowerCase(),
      product.category.toLowerCase() + ' for pets',
      product.collection || '',
      'handcrafted pet accessories',
      'custom pet products'
    ].filter(Boolean)

    const description = product.description 
      ? `${product.description.substring(0, 155)}... Available in multiple sizes. ${priceRange}. Free shipping on orders above ₹799.`
      : `Buy ${product.title} for your pet. High-quality ${product.category.toLowerCase()} from Hezal Accessories. ${priceRange}. Free shipping on orders above ₹799.`

    // Get additional images safely
    const additionalImages = (product as any).images || []

    return {
      title: `${product.title} - ${priceRange} | Premium Pet ${product.category} | Hezal Accessories`,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: 'Hezal Accessories' }],
      openGraph: {
        title: `${product.title} | Hezal Accessories`,
        description: description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'}/products/${product.id}`,
        images: [
          {
            url: product.image,
            width: 1200,
            height: 630,
            alt: product.title,
          },
          ...(Array.isArray(additionalImages) ? additionalImages.slice(0, 3).map((img: string) => ({
            url: img,
            width: 1200,
            height: 630,
            alt: `${product.title} - Additional view`,
          })) : [])
        ],
        type: 'website',
        siteName: 'Hezal Accessories',
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'}/products/${product.id}`,
      },
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
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product | Hezal Accessories',
      description: 'Premium pet accessories for your furry friends.'
    }
  }
}

// Generate static params for build-time optimization
// Only pre-build first 12 products, rest will be generated on-demand with ISR
export async function generateStaticParams() {
  try {
    const products = await getProducts()
    
    // Sort products by creation date (newest first) or by title for consistency
    const sortedProducts = products.sort((a, b) => {
      // Try to sort by creation date if available, otherwise by title
      const aDate = (a as any).createdAt
      const bDate = (b as any).createdAt
      
      if (aDate && bDate) {
        const aTime = aDate?.toDate?.()?.getTime() || new Date(aDate).getTime()
        const bTime = bDate?.toDate?.()?.getTime() || new Date(bDate).getTime()
        return bTime - aTime // Newest first
      }
      
      // Fallback to alphabetical sorting by title
      return a.title.localeCompare(b.title)
    })
    
    // Only return first 12 products for build-time pre-rendering
    const preRenderProducts = sortedProducts.slice(0, 12)
    
    console.log(`Pre-rendering ${preRenderProducts.length} out of ${products.length} product pages at build time`)
    
    return preRenderProducts.map((product) => ({
      productId: product.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return empty array so no pages are pre-built if there's an error
    return []
  }
}

// Server component to fetch data - optimized for ISR
async function getProductData(productId: string): Promise<{ product: Product | null, relatedProducts: Product[] }> {
  try {
    console.log(`Fetching product data for: ${productId}`)
    const products = await getProducts()
    
    // Convert products to plain objects without Firestore timestamps
    const serializedProducts = products.map(p => {
      const productData = p as any
      return {
        ...p,
        createdAt: productData.createdAt?.toDate?.()?.toISOString() || productData.createdAt,
        updatedAt: productData.updatedAt?.toDate?.()?.toISOString() || productData.updatedAt,
      }
    })
    
    const product = serializedProducts.find(p => p.id === productId)
    
    if (!product) {
      console.log(`Product not found: ${productId}`)
      return { product: null, relatedProducts: [] }
    }

    // Get related products from same category (exclude current product)
    const relatedProducts = serializedProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)

    console.log(`Successfully fetched product: ${product.title} with ${relatedProducts.length} related products`)
    return { product, relatedProducts }
  } catch (error) {
    console.error(`Error fetching product data for ${productId}:`, error)
    return { product: null, relatedProducts: [] }
  }
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ productId: string }> 
}) {
  const { productId } = await params
  
  // Fetch product data with error handling for ISR
  const { product, relatedProducts } = await getProductData(productId)

  // If product not found, show 404
  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-pink mx-auto mb-4"></div>
          <p className="text-text-light">Loading product details...</p>
        </div>
      </div>
    }>
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts}
      />
    </Suspense>
  )
}