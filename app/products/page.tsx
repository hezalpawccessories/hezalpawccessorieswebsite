// This is now a server component for SEO optimization
import { Suspense } from 'react'
import { Metadata } from 'next'
import { collection as firestoreCollection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/integrations/firebase/firebaseconfig'
import { Product } from '@/lib/products'
import ProductsPageClient from './ProductsPageClient'
import Loader from '@/components/Loader'

// Enable ISR - revalidate every 5 minutes (300 seconds)
export const revalidate = 300

interface Collection {
  id: string
  name: string
  description?: string
}

interface SearchParams {
  category?: string
  collection?: string
  sale?: string
  search?: string
  sort?: string
  page?: string
}

const PRODUCTS_PER_PAGE = 12

export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const { category, collection, sale, search } = resolvedSearchParams
  
  let title = 'Premium Pet Accessories - Shop Dog Collars, Leashes & More'
  let description = 'Shop stylish and comfortable pet accessories for your furry friends. Premium dog collars, leashes, bow ties, bandanas, and treat jars. Handcrafted with love. Free shipping on orders above ₹799.'
  let keywords = 'pet accessories, dog collars, pet leashes, dog bow ties, pet bandanas, treat jars, premium pet gear, handcrafted pet products, custom dog accessories, hezal accessories'
  
  if (category && category !== 'All') {
    title = `${category} - Premium Pet Accessories | Hezal Accessories`
    description = `Shop premium ${category.toLowerCase()} for your pets. High-quality, stylish, and comfortable ${category.toLowerCase()}. Handcrafted designs with free shipping on orders above ₹799.`
    keywords = `${category.toLowerCase()}, pet ${category.toLowerCase()}, dog ${category.toLowerCase()}, cat ${category.toLowerCase()}, premium ${category.toLowerCase()}, buy ${category.toLowerCase()}, ${keywords}`
  }
  
  if (collection) {
    title = `${collection} Collection - Premium Pet Accessories | Hezal Accessories`
    description = `Explore our ${collection} collection of premium pet accessories. Curated designs with handcrafted quality for your beloved pets. Free shipping on orders above ₹799.`
    keywords = `${collection} collection, ${collection} pet accessories, premium ${collection} products, ${keywords}`
  }
  
  if (sale === 'true') {
    title = 'Sale - Discounted Pet Accessories | Hezal Accessories'
    description = 'Shop discounted pet accessories with amazing deals. Limited time offers on premium collars, leashes, bow ties, and more. Free shipping on orders above ₹799.'
    keywords = `pet accessories sale, discounted pet products, pet accessories deals, cheap pet collars, affordable pet leashes, ${keywords}`
  }
  
  if (search) {
    title = `Search: ${search} - Pet Accessories | Hezal Accessories`
    description = `Search results for "${search}". Find the perfect pet accessories including collars, leashes, bow ties, and more for your furry friends.`
    keywords = `${search}, search ${search}, ${keywords}`
  }

  // Build dynamic canonical URL based on active filters
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'
  let canonicalPath = '/products'
  const params = new URLSearchParams()
  
  // Add query parameters that affect the content
  if (category && category !== 'All') {
    params.append('category', category)
  }
  if (collection) {
    params.append('collection', collection)
  }
  if (sale === 'true') {
    params.append('sale', 'true')
  }
  // Note: We don't include 'search', 'sort', or 'page' in canonical URL
  // as they don't create unique content worth indexing separately
  
  const queryString = params.toString()
  if (queryString) {
    canonicalPath += `?${queryString}`
  }

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Hezal Accessories' }],
    openGraph: {
      title,
      description,
      url: `${baseUrl}${canonicalPath}`,
      images: [
        {
          url: `${baseUrl}/logom.png`,
          width: 1200,
          height: 630,
          alt: 'Hezal Accessories - Premium Pet Products',
        }
      ],
      type: 'website',
      siteName: 'Hezal Accessories',
    },
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
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
}

async function getProductsData(searchParams: SearchParams) {
  const { category, collection, sale, search, sort = 'name', page = '1' } = searchParams
  const currentPage = parseInt(page, 10)
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE

  console.log('Server-side filtering with params:', { category, collection, sale, search, sort, page })

  try {
    // For now, let's use a simpler approach to avoid Firestore composite index issues
    // We'll get all products and filter client-side until indexes are set up
    console.log('Fetching all products for client-side filtering...')
    
    const allProductsQuery = query(firestoreCollection(db, 'products'))
    const snapshot = await getDocs(allProductsQuery)
    
    let allProducts = snapshot.docs.map(doc => {
      const data = doc.data() as any
      // Convert Firestore timestamps to serializable format
      // const product = {
      //   id: doc.id,
      //   ...data,
      //   createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      //   updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      // }
      
      // // Debug log for the specific product we're tracking
      // if (product.title?.includes('woof you')) {
      //   console.log('Found "I woof you" product:', {
      //     title: product.title,
      //     onSale: product.onSale,
      //     saleQuantity: product.saleQuantity,
      //     id: product.id
      //   })
      // }
      
      // return product
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
    }) as Product[]

    // Apply client-side filters
    let filteredProducts = allProducts

    // Apply category filter
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(product => product.category === category)
    }

    // Apply collection filter
    if (collection) {
      filteredProducts = filteredProducts.filter(product => product.collection === collection)
    }

    // Apply sale filter
    if (sale === 'true') {
      filteredProducts = filteredProducts.filter(product => product.onSale === true && (product.saleQuantity || 0) > 0)
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      switch (sort) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0)
        case 'price-high':
          return (b.price || 0) - (a.price || 0)
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'name':
        default:
          return a.title.localeCompare(b.title)
      }
    })

    // Calculate pagination
    const totalProducts = filteredProducts.length
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
    const paginatedProducts = filteredProducts.slice(offset, offset + PRODUCTS_PER_PAGE)

    // Get categories from all products to show all available categories
    const uniqueCategories = new Set<string>()
    allProducts.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category)
      }
    })
    const categories = ['All', ...Array.from(uniqueCategories).sort()]

    // Get collections from all products
    const uniqueCollections = new Set<string>()
    allProducts.forEach(product => {
      if (product.collection) {
        uniqueCollections.add(product.collection)
      }
    })
    const collections = Array.from(uniqueCollections).map(name => ({ 
      id: name, 
      name,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })).sort((a, b) => a.name.localeCompare(b.name))

    // Check if there are products on sale
    const hasProductsOnSale = allProducts.some(product => product.onSale === true && (product.saleQuantity || 0) > 0)

    console.log(`Filtered ${totalProducts} products from ${allProducts.length} total products`)

    return {
      products: paginatedProducts,
      totalProducts,
      totalPages,
      currentPage,
      categories,
      collections,
      hasProductsOnSale
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    
    // Fallback: try to get products without complex filtering
    try {
      console.log('Attempting fallback query without ordering...')
      const fallbackQuery = query(firestoreCollection(db, 'products'))
      const fallbackSnapshot = await getDocs(fallbackQuery)
      let fallbackProducts = fallbackSnapshot.docs.map(doc => {
        const data = doc.data() as any
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        }
      }) as Product[]

      // Apply client-side filtering for category
      if (category && category !== 'All') {
        fallbackProducts = fallbackProducts.filter(product => product.category === category)
      }

      // Apply client-side filtering for collection
      if (collection) {
        fallbackProducts = fallbackProducts.filter(product => product.collection === collection)
      }

      // Apply client-side filtering for sale
      if (sale === 'true') {
        fallbackProducts = fallbackProducts.filter(product => (product.saleQuantity || 0) > 0)
      }

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase()
        fallbackProducts = fallbackProducts.filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        )
      }

      // Apply client-side sorting
      fallbackProducts.sort((a, b) => {
        switch (sort) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0)
          case 'price-high':
            return (b.price || 0) - (a.price || 0)
          case 'rating':
            return (b.rating || 0) - (a.rating || 0)
          case 'name':
          default:
            return a.title.localeCompare(b.title)
        }
      })

      // Calculate pagination
      const totalProducts = fallbackProducts.length
      const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
      const paginatedProducts = fallbackProducts.slice(offset, offset + PRODUCTS_PER_PAGE)

      // Get categories and collections
      const uniqueCategories = new Set<string>()
      const uniqueCollections = new Set<string>()
      fallbackSnapshot.docs.forEach(doc => {
        const data = doc.data() as any
        if (data.category) uniqueCategories.add(data.category)
        if (data.collection) uniqueCollections.add(data.collection)
      })

      const categories = ['All', ...Array.from(uniqueCategories).sort()]
      const collections = Array.from(uniqueCollections).map(name => ({ id: name, name })).sort((a, b) => a.name.localeCompare(b.name))

      // Check for sale products
      const hasProductsOnSale = fallbackSnapshot.docs.some(doc => {
        const data = doc.data() as any
        return data.onSale === true && (data.saleQuantity || 0) > 0
      })

      console.log('Fallback query successful, returning filtered results')
      return {
        products: paginatedProducts,
        totalProducts,
        totalPages,
        currentPage,
        categories,
        collections,
        hasProductsOnSale
      }
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError)
      return {
        products: [],
        totalProducts: 0,
        totalPages: 0,
        currentPage: 1,
        categories: ['All'],
        collections: [],
        hasProductsOnSale: false
      }
    }
  }
}

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<SearchParams> 
}) {
  const resolvedSearchParams = await searchParams
  const {
    products,
    totalProducts,
    totalPages,
    currentPage,
    categories,
    collections,
    hasProductsOnSale
  } = await getProductsData(resolvedSearchParams)

  return (
    <Suspense fallback={<Loader />}>
      <ProductsPageClient
        initialProducts={products}
        totalProducts={totalProducts}
        categories={categories}
        collections={collections}
        currentPage={currentPage}
        totalPages={totalPages}
        hasProductsOnSale={hasProductsOnSale}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  )
}
