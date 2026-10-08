import type { Metadata, Viewport } from 'next'
import { Architects_Daughter, Hanken_Grotesk, Inter_Tight, JetBrains_Mono, Montserrat, Outfit, Poppins, Rubik_Mono_One } from 'next/font/google'
import SmoothScroll from '@/components/SmoothScroll'
import { SITE_URL } from '@/lib/site'
import './globals.css'

// Self-hosted at build time by next/font: no layout shift, no request to Google at runtime.
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-hanken' })
const rubikMono = Rubik_Mono_One({ subsets: ['latin'], weight: '400', variable: '--font-rubik-mono' })
// Figma Hand isn't a public web font; Architects Daughter is the closest match.
const architects = Architects_Daughter({ subsets: ['latin'], weight: '400', variable: '--font-architects' })
// Used by the slide counter patch, to match the Poppins in the presentation slides.
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-poppins' })
// The intro hero (Figma-style type and UI labels).
const interTight = Inter_Tight({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-inter-tight' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: '400', variable: '--font-jetbrains' })

// The SSH client title on its case study page (the product UI is set in Outfit).
const outfit = Outfit({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-outfit' })

// The Zync wordmark on its case study page.
const montserrat = Montserrat({ subsets: ['latin'], weight: '700', variable: '--font-montserrat' })

const DESCRIPTION = 'Anukriti Mishra, experience designer for SaaS. The app. The website. The brand. The motion. One designer.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Anukriti Mishra | Experience Designer', template: '%s | Anukriti Mishra' },
  description: DESCRIPTION,
  icons: { icon: '/favicon.svg' },
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
    <html lang="en" className={`${hanken.variable} ${rubikMono.variable} ${architects.variable} ${poppins.variable} ${interTight.variable} ${jetbrainsMono.variable} ${montserrat.variable} ${outfit.variable}`}>
      <body>
        <div id="top" />
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
