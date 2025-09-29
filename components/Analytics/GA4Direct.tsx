'use client'

import Script from 'next/script'

const GA_MEASUREMENT_ID = 'G-0YQJMZVQ3G'

export const GA4Direct = () => {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics 4 - Direct Implementation (Lighter than GTM) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
        id="gtag-base"
      />
      <Script 
        id="gtag-config" 
        strategy="lazyOnload"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
            // Privacy-friendly settings
            anonymize_ip: true,
            allow_ad_personalization_signals: false,
            allow_google_signals: false,
          });
        `}
      </Script>
    </>
  )
}

export default GA4Direct