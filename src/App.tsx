import { useEffect } from 'react'
import Header from './components/Header'
import Story from './components/Story'
import Work from './components/Work'
import Contact from './components/Contact'
import { startSmoothScroll } from './smoothScroll'

export default function App() {
  useEffect(() => startSmoothScroll(), [])

  return (
    <>
      <Header />
      <main id="top">
        <Story />
        <Work />
      </main>
      <Contact />
    </>
  )
}
