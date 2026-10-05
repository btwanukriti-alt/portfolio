import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-svh max-w-[var(--max)] flex-col justify-center gap-6 px-[var(--gutter)]">
        <p className="m-0 text-[15px] leading-none font-medium text-muted">404</p>
        <h1 className="m-0 max-w-[14ch] text-[clamp(44px,6.6vw,112px)] leading-[0.98] font-medium tracking-[-0.045em] text-ink">
          This page isn&apos;t here.
        </h1>
        <Link href="/" className="text-[17px] font-medium text-ink underline underline-offset-4">
          Back to the home page
        </Link>
      </main>
    </>
  )
}
