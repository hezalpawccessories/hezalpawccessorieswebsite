import './globals.css'
import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import { Suspense } from 'react'
import NProgressProvider from '@/components/NProgressProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@/components/Analytics/GoogleTagManager'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'),
  title: 'Hezal Accessories - Premium Pet Accessories & Custom Dog Collars',
  description: 'Discover premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Handcrafted with love for your furry friends. Free shipping on orders over ₹999.',
  keywords: ['pet accessories', 'dog collars', 'custom pet products', 'dog leashes', 'pet bow ties', 'bandanas', 'premium pet gear', 'handcrafted pet accessories'],
  authors: [{ name: 'Hezal Accessories' }],
  creator: 'Hezal Accessories',
  publisher: 'Hezal Accessories',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com',
    siteName: 'Hezal Accessories',
    title: 'Hezal Accessories - Premium Pet Accessories & Custom Dog Collars',
    description: 'Discover premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Handcrafted with love for your furry friends.',
    images: [
      {
        url: '/logom.png',
        width: 800,
        height: 600,
        alt: 'Hezal Accessories Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hezal Accessories - Premium Pet Accessories',
    description: 'Premium pet accessories including custom dog collars, leashes, and stylish pet gear.',
    images: ['/logom.png'],
    creator: '@hezal_accessories', // Updated Twitter handle
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com',
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html
         lang='en'
         suppressHydrationWarning
         className={`${inter.variable} ${dmSans.variable}`}
      >
         <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/logom.png" />
            <meta name="theme-color" content="#ec4899" />
            <meta name="msapplication-TileColor" content="#ec4899" />
         </head>
         <body className={inter.className}>
            <GoogleTagManager />
            <Suspense fallback={null}>
               <GoogleAnalytics />
            </Suspense>
            <SpeedInsights />
            <Analytics />
            <Suspense fallback={null}>
               <NProgressProvider />
            </Suspense>
            <Toaster
               position="top-right"
               expand={true}
               richColors
               closeButton
               theme="light"
               toastOptions={{
                  style: {
                     background: 'white',
                     border: '1px solid #e2e8f0',
                     borderRadius: '12px',
                     fontSize: '14px',
                     fontWeight: '500',
                     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  },
                  className: 'font-medium',
               }}
               icons={{
                  success: '✅',
                  error: '❌',
                  warning: '⚠️',
                  info: 'ℹ️',
               }}
            />
            {children}
         </body>
      </html>
   )
}
