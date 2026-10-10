import type { Metadata, Viewport } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE_URL } from '@/lib/site'
import './globals.css'

// Two fonts, self-hosted at build time by next/font (no layout shift, no request to Google at
// runtime): Inter Tight for titles, Inter for running text.
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-inter-tight' })
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' })

const DESCRIPTION = 'Anukriti Mishra, experience designer for SaaS. The app. The website. The brand. The motion. One designer.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Anukriti Mishra | Experience Designer', template: '%s | Anukriti Mishra' },
  description: DESCRIPTION,
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Anukriti Mishra',
    title: 'Anukriti Mishra | Experience Designer',
    description: DESCRIPTION,
    images: [{ url: '/work/project-1.jpg' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <div id="top" />
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
