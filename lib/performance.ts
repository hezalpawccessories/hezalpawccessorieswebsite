// Performance optimization utilities
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap'
    fontLink.as = 'style'
    fontLink.onload = () => {
      fontLink.rel = 'stylesheet'
    }
    document.head.appendChild(fontLink)

    // Preconnect to external domains
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://vitals.vercel-insights.com'
    ]

    preconnects.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }
}

// Lazy load images intersection observer
export const createImageObserver = () => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src || img.src
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    return imageObserver
  }
  return null
}

// Optimize Core Web Vitals
export const optimizeWebVitals = () => {
  if (typeof window !== 'undefined') {
    // Optimize LCP by preloading hero images
    const heroImages = document.querySelectorAll('img[data-priority="true"]')
    heroImages.forEach((img) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = (img as HTMLImageElement).src
      document.head.appendChild(link)
    })

    // Reduce CLS by setting image dimensions
    const images = document.querySelectorAll('img:not([width]):not([height])')
    images.forEach((img) => {
      const aspectRatio = (img as HTMLImageElement).naturalHeight / (img as HTMLImageElement).naturalWidth
      if (!isNaN(aspectRatio)) {
        (img as HTMLImageElement).style.aspectRatio = `1 / ${aspectRatio}`
      }
    })
  }
}

// Critical CSS inlining for above-the-fold content
export const inlineCriticalCSS = () => {
  return `
    /* Critical CSS for above-the-fold content */
    .gradient-bg {
      background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #f9fafb 50%, #f3f4f6 100%);
    }
    
    .font-heading {
      font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
    }
    
    .text-primary-pink {
      color: #ec4899;
    }
    
    .bg-primary-pink {
      background-color: #ec4899;
    }
    
    /* Loading placeholder */
    .loading-placeholder {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
}

// Resource hints for better loading
export const addResourceHints = () => {
  if (typeof window !== 'undefined') {
    const hints = [
      { rel: 'dns-prefetch', href: '//firestore.googleapis.com' },
      { rel: 'dns-prefetch', href: '//storage.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ]

    hints.forEach(hint => {
      const link = document.createElement('link')
      Object.assign(link, hint)
      document.head.appendChild(link)
    })
  }
}

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully:', registration)
    } catch (error) {
      console.log('Service Worker registration failed:', error)
    }
  }
}

// Bundle size optimization utilities
export const createDynamicImport = (modulePath: string) => {
  return () => import(modulePath)
}

// Prefetch critical routes
export const prefetchCriticalRoutes = () => {
  if (typeof window !== 'undefined') {
    const criticalRoutes = ['/products', '/about', '/contact']
    
    criticalRoutes.forEach(route => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = route
      document.head.appendChild(link)
    })
  }
}