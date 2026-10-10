import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Lets phones/tablets on the same Wi-Fi load the dev server (dev only; no effect on builds).
  allowedDevOrigins: ['192.168.29.186'],
  images: {
    // Stills are pre-sized JPEG exports; serve them as they are.
    unoptimized: true,
  },
  // Old project links, from before the short slugs, keep working.
  async redirects() {
    return [
      ['bosch-customer-experience', 'gym-crm'],
      ['college-management', 'college-erp'],
      ['fitness-tracker', 'zync'],
      ['jaadu-2', 'jaadu'],
    ].map(([from, to]) => ({ source: `/work/${from}`, destination: `/work/${to}`, permanent: true }))
  },
  async headers() {
    return [
      {
        // Showcase embeds and images never change in place (rebuilt files keep their paths but
        // are re-deployed), so a day's caching is safe and keeps repeat visits fast.
        source: '/:dir(showcase|case-studies|mosaic|work|hero)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ]
  },
}

export default nextConfig
