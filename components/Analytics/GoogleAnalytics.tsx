'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

// Your actual Google Analytics 4 measurement ID
const GA_MEASUREMENT_ID = 'G-0YQJMZVQ3G'

export const GoogleAnalytics = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return
    }

    // Load Google Analytics script
    const script1 = document.createElement('script')
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script1.async = true
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_title: document.title,
        page_location: window.location.href,
      });
    `
    document.head.appendChild(script2)

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [])

  useEffect(() => {
    if (!window.gtag || !GA_MEASUREMENT_ID) {
      return
    }

    const url = pathname + searchParams.toString()
    
    // Track page views
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: document.title,
    })
  }, [pathname, searchParams])

  return null
}

// Utility functions for tracking events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (!window.gtag || !GA_MEASUREMENT_ID) {
    return
  }

  window.gtag('event', eventName, {
    ...parameters,
  })
}

// E-commerce specific tracking functions
export const trackPurchase = (transactionId: string, value: number, currency: string = 'INR', items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: currency,
    items: items,
  })
}

export const trackAddToCart = (currency: string = 'INR', value: number, items: any[]) => {
  trackEvent('add_to_cart', {
    currency: currency,
    value: value,
    items: items,
  })
}

export const trackRemoveFromCart = (currency: string = 'INR', value: number, items: any[]) => {
  trackEvent('remove_from_cart', {
    currency: currency,
    value: value,
    items: items,
  })
}

export const trackViewItem = (currency: string = 'INR', value: number, items: any[]) => {
  trackEvent('view_item', {
    currency: currency,
    value: value,
    items: items,
  })
}

export const trackBeginCheckout = (currency: string = 'INR', value: number, items: any[]) => {
  trackEvent('begin_checkout', {
    currency: currency,
    value: value,
    items: items,
  })
}

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  })
}