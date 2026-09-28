import Hero from './components/Hero'
import Work from './components/Work'
import About from './components/About'
import Contact from './components/Contact'
import CaseStudy from './components/CaseStudy'
import { PROJECTS } from './data/projects'
import { useHashRoute } from './useHashRoute'

export default function App() {
  const { caseStudy } = useHashRoute()
  const project = caseStudy ? PROJECTS.find((p) => p.slug === caseStudy) : undefined

  if (project) return <CaseStudy key={project.slug} project={project} />

  return (
    <>
      <Hero />
      <Work />
      <About />
      <Contact />
    </>
  )
}
