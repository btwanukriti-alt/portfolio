import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StoryPage from '@/components/story/StoryPage'
import { PROJECTS, projectBySlug } from '@/data/projects'
import { storyBySlug } from '@/data/stories'

// One static page per project, built at deploy time.
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const project = projectBySlug(slug)
  const story = storyBySlug(slug)
  if (!project || !story) return {}
  return {
    title: story.title,
    description: story.summary,
    openGraph: { title: story.title, description: story.summary, images: [{ url: project.card }] },
  }
}

export default async function Page({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params
  const story = storyBySlug(slug)
  if (!story) notFound()
  return <StoryPage story={story} />
}
