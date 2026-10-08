import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseStudy from '@/components/CaseStudy'
import GalleryCaseStudy from '@/components/GalleryCaseStudy'
import { CASE_STUDIES } from '@/data/caseStudies'
import { GALLERIES } from '@/data/galleries'
import { PROJECTS, projectBySlug } from '@/data/projects'
import { slidesFor } from '@/lib/slides'

// One static page per project, built at deploy time.
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, description: project.description, images: [{ url: project.card }] },
  }
}

export default async function Page({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const project = projectBySlug(slug)
  if (!project) notFound()
  // Projects with a mockup gallery use the visual-first layout; the rest keep the slide carousel.
  const gallery = GALLERIES[slug]
  const study = gallery && CASE_STUDIES.find((s) => s.key === gallery.studyKey)
  if (gallery && study) return <GalleryCaseStudy project={project} study={study} brand={gallery.brand} note={gallery.note} images={gallery.images} sections={gallery.sections} />
  return <CaseStudy project={project} slides={slidesFor(slug)} />
}
