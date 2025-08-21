import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import NProgressProvider from '@/components/NProgressProvider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
   title: 'Hezal Accessories - Your pet deserves only the BEST',
   description: 'Premium pet accessories for your beloved companions. Dog accessories, toys, treats and more.',
   keywords: 'pet accessories, dog accessories, pet toys, pet treats, pet care',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html
         lang='en'
         suppressHydrationWarning
      >
         <body className={inter.className}>
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
