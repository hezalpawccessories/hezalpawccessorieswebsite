import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getProducts } from '@/integrations/firebase/firestoreCollections'
import { Product } from '@/lib/products'

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

    return {
      title: `${product.title} - ${priceRange} | Hezal Accessories`,
      description: product.description || `Buy ${product.title} for your pet. High-quality ${product.category.toLowerCase()} from Hezal Accessories. ${priceRange}. Free shipping on orders above ₹799.`,
      keywords: [
        product.title,
        product.category,
        'pet accessories',
        'dog accessories',
        'cat accessories',
        'hezal accessories',
        product.collection || ''
      ].filter(Boolean).join(', '),
      openGraph: {
        title: `${product.title} | Hezal Accessories`,
        description: product.description || `Buy ${product.title} for your pet. High-quality ${product.category.toLowerCase()} starting from ${priceRange}.`,
        images: [
          {
            url: product.image,
            width: 800,
            height: 600,
            alt: product.title,
          }
        ],
        type: 'website',
        siteName: 'Hezal Accessories',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | Hezal Accessories`,
        description: product.description || `Buy ${product.title} for your pet. High-quality ${product.category.toLowerCase()}.`,
        images: [product.image],
      },
      alternates: {
        canonical: `/products/${product.id}`,
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

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const products = await getProducts()
    return products.map((product) => ({
      productId: product.id,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Server component to fetch data
async function getProductData(productId: string): Promise<{ product: Product | null, relatedProducts: Product[] }> {
  try {
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
      return { product: null, relatedProducts: [] }
    }

    // Get related products from same category (exclude current product)
    const relatedProducts = serializedProducts
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)

    return { product, relatedProducts }
  } catch (error) {
    console.error('Error fetching product data:', error)
    return { product: null, relatedProducts: [] }
  }
}

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ productId: string }> 
}) {
  const { productId } = await params
  const { product, relatedProducts } = await getProductData(productId)

  if (!product) {
    notFound()
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-pink"></div>
      </div>
    }>
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts}
      />
    </Suspense>
  )
}