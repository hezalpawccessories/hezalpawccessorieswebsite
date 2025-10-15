import './globals.css'
import type { Metadata } from 'next'
import { Nunito, Quicksand, Baloo_2 } from 'next/font/google'
import { Suspense, lazy } from 'react'
import { Toaster } from 'sonner'

// Dynamic imports for analytics to reduce initial bundle size - Switch to lighter GA4 Direct
const Analytics = lazy(() => import('@vercel/analytics/next').then(m => ({ default: m.Analytics })))
const SpeedInsights = lazy(() => import('@vercel/speed-insights/next').then(m => ({ default: m.SpeedInsights })))
const GA4Direct = lazy(() => import('@/components/Analytics/GA4Direct').then(m => ({ default: m.default })))

// Optimized font loading - removed unused fonts (Inter, DM_Sans)

// Critical fonts - all preloaded for performance
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-nunito',
  preload: true,
})

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-baloo2',
  preload: true,
})

// Accent font - now preloaded for better performance
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-quicksand',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hezalaccessories.com'),
  title: 'Hezal Accessories - Premium Pet Accessories',
  description: "Your pet deserves only the best! Discover premium pet accessories including dog collars, leashes, bow ties, collar-leash sets, custom treat-jars and bandanas. Quality products for your furry baby. Free shipping on orders over ₹799.",
  keywords: ['pet accessories', 'dog collars', 'custom pet products', 'dog leashes', 'pet bow ties', 'bandanas', 'premium pet gear', 'handcrafted pet accessories'],
  authors: [{ name: 'Hezal Accessories' }],
  creator: 'Hezal Accessories',
  publisher: 'Hezal Accessories',
  icons: {
    icon: [
      { url: '/logom.png', sizes: 'any' },
      { url: '/logom.png', sizes: '32x32', type: 'image/png' },
      { url: '/logom.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/logom.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logom.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/logom.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
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
    description: 'Discover premium pet accessories including custom dog collars, leashes, bow ties, and bandanas. Handcrafted with love for your furry baby.',
    images: [
      {
        url: '/logom.png',
        width: 800,
        height: 600,
        alt: 'Hezal Accessories Logo',
      },
    ],
  },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'Hezal Accessories - Premium Pet Accessories',
  //   description: 'Premium pet accessories including custom dog collars, leashes, and stylish pet gear.',
  //   images: ['/logom.png'],
  //   creator: '@hezal_accessories', // Updated Twitter handle
  // },
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
         className={`${nunito.variable} ${quicksand.variable} ${baloo2.variable}`}
      >
         <head>
            {/* Single optimized preload for critical LCP image */}
            <link 
              rel="preload" 
              as="image" 
              href="https://res.cloudinary.com/dt2qyj4lj/image/upload/c_fill,w_800,h_600,q_60,f_webp/v1755786569/kdqtrcjjxdkdeak97rwx.jpg"
              fetchPriority="high"
            />
            
            {/* Inline critical CSS for above-the-fold content */}
            <style dangerouslySetInnerHTML={{
              __html: `
                :root {
                  --primary-pink: #FF69B4;
                  --primary-gray: #2F2F2F;
                  --cream: #FFFFFF;
                  --text-dark: #2F2F2F;
                  --text-body: #555555;
                }
                *,*::before,*::after { box-sizing: border-box; }
                * { margin: 0; padding: 0; }
                body {
                  font-family: var(--font-nunito), system-ui, sans-serif;
                  color: var(--text-body);
                  background: var(--cream);
                  line-height: 1.6;
                  font-size: 16px;
                }
                .hero-bg {
                  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 247, 250, 0.8) 50%, rgba(255, 255, 255, 1) 100%);
                  position: relative;
                }
                  .hero-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff69b4' fill-opacity='0.02'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 40px 40px;
  pointer-events: none;
}

                .hero-title {
                  font-family: var(--font-baloo2), cursive;
                  font-weight: 700;
                  background: linear-gradient(135deg, var(--primary-gray) 0%, #1a1a1a 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .hero-accent {
                  background: linear-gradient(135deg, var(--primary-pink) 0%, #E91E63 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                }
                .btn-primary {
                  background: linear-gradient(135deg, var(--primary-pink) 0%, #E91E63 100%);
                  color: white;
                  padding: 12px 24px;
                  border-radius: 12px;
                  font-weight: 600;
                  border: none;
                  cursor: pointer;
                  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
                }
                .btn-secondary {
                  background: transparent;
                  color: var(--primary-pink);
                  padding: 12px 24px;
                  border: 2px solid var(--primary-pink);
                  border-radius: 12px;
                  font-weight: 600;
                  cursor: pointer;
                }
                  .pet-pattern-bg {
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 105, 180, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 105, 180, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 105, 180, 0.02) 0%, transparent 50%);
  background-size: 800px 800px, 600px 600px, 400px 400px;
  background-position: 0 0, 100px 100px, 200px 200px;
  background-repeat: repeat;
}
  .features-bg {
  background: linear-gradient(135deg, 
    rgba(245, 245, 245, 1) 0%, 
    rgba(250, 250, 250, 0.8) 50%, 
    rgba(245, 245, 245, 1) 100%);
  position: relative;
}
  .features-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff69b4' fill-opacity='0.015'%3E%3Cpath d='M30 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15zm30 0c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15 15-6.716 15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  background-size: 60px 60px;
  pointer-events: none;
}

                  
              `
            }} />
            
            {/* Critical font preloading to break request chain */}
            <link rel="preload" href="https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshdQ.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            <link rel="preload" href="https://fonts.gstatic.com/s/baloo2/v22/wXKvE3kTposypRyd76Ay.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            
            {/* Resource hints for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://res.cloudinary.com" />
            <link rel="dns-prefetch" href="https://vercel.com" />
            
            <meta name="theme-color" content="#ec4899" />
            <meta name="msapplication-TileColor" content="#ec4899" />
            <meta name="msapplication-TileImage" content="/logom.png" />
         </head>
         <body className={`${nunito.className} ${quicksand.variable} ${baloo2.variable}`} suppressHydrationWarning={true}>
            <Suspense fallback={null}>
               <GA4Direct />
            </Suspense>
            <Suspense fallback={null}>
               <SpeedInsights />
            </Suspense>
            <Suspense fallback={null}>
               <Analytics />
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
