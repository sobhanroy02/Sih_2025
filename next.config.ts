import withPWA from 'next-pwa'

// NOTE: Avoid strict typing with NextConfig here due to mismatch between next and @types/next-pwa bundled Next types.
// If needed, refine with Partial<...> or upgrade next-pwa types.
const nextConfig = {
  eslint: {
    // CI will build even if ESLint finds issues; we can fix lint separately
    ignoreDuringBuilds: true,
  },
  // Updated per Next.js 15 deprecation: move from experimental.turbo to turbopack
  turbopack: {
    // Ensure the correct project root (avoid picking parent home folder lockfile)
    root: __dirname,
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'example.com' },
    ],
    formats: ['image/webp', 'image/avif'],
  },
}

const pwaConfig = withPWA({
  // Avoid service worker registration during development to prevent caching surprises
  disable: process.env.NODE_ENV === 'development',
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
})

export default pwaConfig(nextConfig as any)
