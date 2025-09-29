// @type {import('next').NextConfig}

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Sentry disabled for performance optimization
// const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  
  // Performance optimizations
  poweredByHeader: false,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Bundle optimization for reducing unused JavaScript
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enhanced tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        splitChunks: {
          chunks: 'all',
          minSize: 10000,
          maxSize: 244000,
          cacheGroups: {
            // Critical UI libraries
            ui: {
              test: /[\\/]node_modules[\\/](lucide-react|sonner)/,
              name: 'ui',
              chunks: 'all',
              priority: 30,
            },
            // Firebase - already modular v9
            firebase: {
              test: /[\\/]node_modules[\\/]@?firebase/,
              name: 'firebase',
              chunks: 'all',
              priority: 25,
            },
            // Animation libraries - load separately to avoid blocking
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion)/,
              name: 'animations',
              chunks: 'async', // Load only when needed
              priority: 20,
            },
            // Vercel analytics - separate chunk
            vercel: {
              test: /[\\/]node_modules[\\/]@vercel/,
              name: 'vercel',
              chunks: 'async',
              priority: 15,
            },
            // React core
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)/,
              name: 'react',
              chunks: 'all',
              priority: 40,
            },
            // Default vendor chunk
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
            },
          }
        }
      }

      // Mark certain modules as having no side effects for better tree shaking
      config.module.rules.push({
        test: /[\\/]node_modules[\\/](lodash|date-fns)/,
        sideEffects: false,
      })
    }
    
    return config
  },

  // Output file tracing for build optimization
  outputFileTracingRoot: process.cwd(),
  
  // Experimental features for performance
  experimental: {
    // Modern features can be added here if needed
  },
}

// Export config with bundle analyzer only (Sentry disabled)
module.exports = withBundleAnalyzer(nextConfig)

// Sentry configuration disabled for performance optimization
// If you need to re-enable Sentry, uncomment the code below:
/*
// const { withSentryConfig } = require('@sentry/nextjs')
module.exports = withBundleAnalyzer(nextConfig)
// module.exports = withSentryConfig(withBundleAnalyzer(nextConfig), {
  org: 'hezal-pawccessories',
  project: 'javascript-nextjs',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
})
*/
