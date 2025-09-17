'use client'

import { useEffect } from 'react'

// Replace with your actual Google Tag Manager ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

export const GoogleTagManager = () => {
  useEffect(() => {
    if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
      return
    }

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []

    // Load GTM script
    const script = document.createElement('script')
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}

declare global {
  interface Window {
    dataLayer: any[]
  }
}

// Utility function to push events to dataLayer
export const pushToDataLayer = (event: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: event,
      ...data,
    })
  }
}

// E-commerce specific GTM events
export const pushPurchaseEvent = (transactionData: {
  transaction_id: string
  value: number
  currency: string
  items: any[]
}) => {
  pushToDataLayer('purchase', transactionData)
}

export const pushAddToCartEvent = (itemData: {
  currency: string
  value: number
  items: any[]
}) => {
  pushToDataLayer('add_to_cart', itemData)
}

export const pushRemoveFromCartEvent = (itemData: {
  currency: string
  value: number
  items: any[]
}) => {
  pushToDataLayer('remove_from_cart', itemData)
}

export const pushViewItemEvent = (itemData: {
  currency: string
  value: number
  items: any[]
}) => {
  pushToDataLayer('view_item', itemData)
}

export const pushBeginCheckoutEvent = (checkoutData: {
  currency: string
  value: number
  items: any[]
}) => {
  pushToDataLayer('begin_checkout', checkoutData)
}