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

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {

      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Separate vendor libraries
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            // Separate Firebase/Firestore
            firebase: {
              test: /[\\/]node_modules[\\/]@?firebase/,
              name: 'firebase',
              chunks: 'all',
              priority: 20,
            },
            // Sentry disabled - no need for separate chunk
            // sentry: {
            //   test: /[\\/]node_modules[\\/]@sentry/,
            //   name: 'sentry', 
            //   chunks: 'all',
            //   priority: 15,
            // },
            // Separate animation libraries
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion|@lottiefiles)/,
              name: 'animations',
              chunks: 'all',
              priority: 12,
            },
            // Common components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            }
          }
        }
      }
    }

    // Tree shaking is handled by Next.js automatically
    // Remove manual optimization settings that conflict with Next.js
    
    return config
  },

  // Output file tracing for build optimization
  outputFileTracingRoot: process.cwd(),
  
  // Experimental features for performance
  experimental: {
    optimizeCss: true,  
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
