'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Shot } from '@/data/stories'
import { getLenis } from '../SmoothScroll'

// The full-size image viewer shared by every figure on a case-study page: a modal <dialog> (the browser keeps focus
// inside it), with a visible Close button, Escape to close, and focus back on the button that opened it. Zoom shows
// the image at its own size, so a wide desktop screen can be panned on a phone.

type Open = (shot: Shot, from: HTMLElement) => void
const ViewerContext = createContext<Open>(() => {})

export function ViewerProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const pane = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [shot, setShot] = useState<Shot | null>(null)
  // The zoomed width in CSS px, or 0 when the image fits the screen.
  const [zoom, setZoom] = useState(0)
  const zoomed = zoom > 0

  const open = useCallback<Open>((next, from) => {
    opener.current = from
    setZoom(0)
    setShot(next)
  }, [])

  useEffect(() => {
    const d = dialog.current
    if (!shot || !d || d.open) return
    d.showModal()
    getLenis()?.stop()
    document.documentElement.style.overflow = 'hidden'
    closeButton.current?.focus()
  }, [shot])

  const onClose = () => {
    getLenis()?.start()
    document.documentElement.style.overflow = ''
    setShot(null)
    opener.current?.focus()
  }

  // Zoomed: the image at its own size (2x exports at half their pixels), and never narrower than 1.6 times the
  // pane, so there is always something to pan.
  const toggleZoom = () => {
    if (zoomed || !shot) return setZoom(0)
    setZoom(Math.max(shot.width >= 1800 ? shot.width / 2 : shot.width, (pane.current?.clientWidth ?? 0) * 1.6))
  }

  return (
    <ViewerContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        onClose={onClose}
        aria-labelledby="viewer-title"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-[#0B0B0F] p-0 text-white backdrop:bg-black/70"
      >
        {shot && (
          <div className="flex h-full flex-col">
            <div className="flex flex-wrap items-center gap-3 border-b border-white/15 px-4 py-2 md:px-6">
              <h2 id="viewer-title" className="m-0 min-w-0 flex-1 truncate text-[15px] leading-[1.4] font-medium">
                {shot.label ?? 'Full-size screen'}
              </h2>
              <button
                type="button"
                onClick={toggleZoom}
                aria-pressed={zoomed}
                className="min-h-11 rounded-lg border border-white/30 px-4 text-[15px] font-medium text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {zoomed ? 'Fit to screen' : 'Zoom in'}
              </button>
              <button
                ref={closeButton}
                type="button"
                onClick={() => dialog.current?.close()}
                className="min-h-11 rounded-lg bg-white px-4 text-[15px] font-semibold text-ink hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Close
              </button>
            </div>
            <div
              ref={pane}
              data-lenis-prevent
              tabIndex={0}
              aria-label="Image, scroll to pan"
              className={`min-h-0 flex-1 overflow-auto overscroll-contain p-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white md:p-6 ${zoomed ? '' : 'grid place-items-center'}`}
            >
              { }
              <img
                src={shot.src}
                width={shot.width}
                height={shot.height}
                alt={shot.alt}
                className={zoomed ? 'block h-auto max-w-none' : 'block h-auto max-h-full w-auto max-w-full object-contain'}
                style={zoomed ? { width: zoom } : undefined}
              />
            </div>
          </div>
        )}
      </dialog>
    </ViewerContext.Provider>
  )
}

export function ViewButton({ shot }: { shot: Shot }) {
  const open = useContext(ViewerContext)
  return (
    <button
      type="button"
      onClick={(e) => open(shot, e.currentTarget)}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-2 text-[14px] leading-none font-medium text-[var(--accent)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
      View full size<span className="sr-only">: {shot.label ?? shot.alt}</span>
    </button>
  )
}
