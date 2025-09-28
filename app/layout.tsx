import './globals.css'
import type { Metadata } from 'next'
import { Inter, DM_Sans, Nunito, Quicksand, Baloo_2 } from 'next/font/google'
import { Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@/components/Analytics/GoogleAnalytics'
import { GoogleTagManager } from '@/components/Analytics/GoogleTagManager'

// Optimized font loading with preload only for critical fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: false,
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  preload: false,
})

// Critical fonts for above-the-fold content - optimized loading
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-nunito',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-baloo2',
  preload: true,
  fallback: ['cursive', 'system-ui'],
})

// Non-critical font - defer loading
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-quicksand',
  preload: false,
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
         className={`${inter.variable} ${dmSans.variable} ${nunito.variable} ${quicksand.variable} ${baloo2.variable}`}
      >
         <head>
            {/* Inline critical CSS for above-the-fold content - Expanded for landing page */}
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
                html { font-size: 16px; }
                body {
                  font-family: var(--font-nunito), system-ui, -apple-system, sans-serif;
                  color: var(--text-body);
                  background: var(--cream);
                  line-height: 1.6;
                  font-size: 16px;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                .hero-bg {
                  background: linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(255, 247, 250, 0.8) 50%, rgba(255, 255, 255, 1) 100%);
                  position: relative;
                  overflow: hidden;
                }
                .hero-title {
                  font-family: var(--font-baloo2), cursive;
                  font-weight: 700;
                  background: linear-gradient(135deg, var(--primary-gray) 0%, #1a1a1a 100%);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  background-clip: text;
                  line-height: 1.1;
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
                  text-decoration: none;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  transition: transform 0.2s ease;
                }
                .btn-primary:hover { transform: translateY(-1px); }
                .btn-secondary {
                  background: transparent;
                  color: var(--primary-pink);
                  padding: 12px 24px;
                  border: 2px solid var(--primary-pink);
                  border-radius: 12px;
                  font-weight: 600;
                  cursor: pointer;
                  text-decoration: none;
                  display: inline-block;
                  transition: all 0.2s ease;
                  text-align: center;
                }
                .btn-secondary:hover { background: var(--primary-pink); color: white; }
                /* Critical layout styles for immediate render */
                .max-w-7xl { max-width: 80rem; margin: 0 auto; }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .py-12 { padding-top: 3rem; padding-bottom: 3rem; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                .gap-12 { gap: 3rem; }
                .items-center { align-items: center; }
                .relative { position: relative; }
                .z-10 { z-index: 10; }
                .text-4xl { font-size: 2.25rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .text-lg { font-size: 1.125rem; }
                .leading-relaxed { line-height: 1.625; }
                .flex { display: flex; }
                .flex-col { flex-direction: column; }
                .space-x-2 > * + * { margin-left: 0.5rem; }
                .space-y-4 > * + * { margin-top: 1rem; }
                .w-5 { width: 1.25rem; }
                .h-5 { height: 1.25rem; }
                /* Responsive breakpoints for hero */
                @media (min-width: 1024px) {
                  .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                  .lg\\:py-24 { padding-top: 6rem; padding-bottom: 6rem; }
                  .lg\\:text-6xl { font-size: 3.75rem; }
                  .lg\\:text-xl { font-size: 1.25rem; }
                  .lg\\:order-1 { order: 1; }
                  .lg\\:order-2 { order: 2; }
                }
                @media (min-width: 768px) {
                  .md\\:text-5xl { font-size: 3rem; }
                  .md\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                }
                @media (min-width: 640px) {
                  .sm\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                  .sm\\:flex-row { flex-direction: row; }
                  .sm\\:w-auto { width: auto; }
                }
              `
            }} />
            
            {/* Resource hints for performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://res.cloudinary.com" />
            <link rel="dns-prefetch" href="https://vercel.com" />
            
            {/* Critical CSS loading optimization */}
            <script dangerouslySetInnerHTML={{
              __html: `
                // Defer non-critical CSS to prevent render blocking
                (function() {
                  const loadCSS = function(href, before, media) {
                    const doc = window.document;
                    const ss = doc.createElement('link');
                    let ref;
                    if (before) {
                      ref = before;
                    } else {
                      const refs = (doc.body || doc.getElementsByTagName('head')[0]).childNodes;
                      ref = refs[refs.length - 1];
                    }
                    const sheets = doc.styleSheets;
                    ss.rel = 'stylesheet';
                    ss.href = href;
                    ss.media = 'only x';
                    function ready(cb) {
                      if (doc.body) {
                        return cb();
                      }
                      setTimeout(function() {
                        ready(cb);
                      });
                    }
                    ready(function() {
                      ref.parentNode.insertBefore(ss, (before ? ref : ref.nextSibling));
                    });
                    const onloadcssdefined = function(cb) {
                      let resolvedHref = ss.href;
                      let i = sheets.length;
                      while (i--) {
                        if (sheets[i].href === resolvedHref) {
                          return cb();
                        }
                      }
                      setTimeout(function() {
                        onloadcssdefined(cb);
                      });
                    };
                    function loadCB() {
                      if (ss.addEventListener) {
                        ss.removeEventListener('load', loadCB);
                      }
                      ss.media = media || 'all';
                    }
                    if (ss.addEventListener) {
                      ss.addEventListener('load', loadCB);
                    }
                    ss.onloadcssdefined = onloadcssdefined;
                    onloadcssdefined(loadCB);
                    return ss;
                  };
                  
                  // Load non-critical CSS after page load
                  window.addEventListener('load', function() {
                    // Add any additional non-critical stylesheets here
                    console.log('Non-critical CSS loaded after page render');
                  });
                })();
              `
            }} />
            
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/logom.png" />
            <meta name="theme-color" content="#ec4899" />
            <meta name="msapplication-TileColor" content="#ec4899" />
         </head>
         <body className={`${nunito.className} ${inter.variable} ${dmSans.variable} ${quicksand.variable} ${baloo2.variable}`} suppressHydrationWarning={true}>
            <GoogleTagManager />
            <Suspense fallback={null}>
               <GoogleAnalytics />
            </Suspense>
            <SpeedInsights />
            <Analytics />
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
