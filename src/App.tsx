import { useEffect } from 'react'
import Header from './components/Header'
import Experience from './components/Experience'
import Work from './components/Work'
import Contact from './components/Contact'
import { startSmoothScroll } from './smoothScroll'

export default function App() {
  useEffect(() => startSmoothScroll(), [])

  return (
    <>
      <Header />
      <main id="top">
        <Experience />
        <Work />
      </main>
      <Contact />
    </>
  )
}
