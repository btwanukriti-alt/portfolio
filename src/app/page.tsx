import SiteHeader from '@/components/SiteHeader'
import IntroHero from '@/components/intro-hero/IntroHero'
import Work from '@/components/Work'
import About from '@/components/About'
import Contact from '@/components/Contact'

export default function Home() {
  return (
    <>
      <SiteHeader afterHero />
      <main>
        <IntroHero />
        <Work />
        <About />
      </main>
      <Contact />
    </>
  )
}
