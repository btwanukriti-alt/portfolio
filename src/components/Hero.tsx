import { useEffect, useMemo, useRef, useSyncExternalStore, type CSSProperties } from 'react'
import Nav from './Nav'
import Glasses, { LENS_MASK_URL } from './Glasses'
import LineBackground from './LineBackground'
import Mosaic from './Mosaic'
import { useFocusPull } from './useFocusPull'
import arrow from '../assets/hero/arrow.svg'
import styles from './Hero.module.css'

// Storyboard boards: 6 x 5 at 2.8x on desktop, 3 x 6 at 1.6x on mobile.
const MOBILE_QUERY = '(max-width: 640px)'
const DESKTOP_BOARD = { columns: 6, rows: 5, zoom: 2.8 }
const MOBILE_BOARD = { columns: 3, rows: 6, zoom: 1.6 }

function useIsMobile() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(MOBILE_QUERY)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(MOBILE_QUERY).matches,
  )
}

export default function Hero() {
  const stage = useRef<HTMLElement>(null)
  const lens = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const glassesButton = useRef<HTMLButtonElement>(null)
  const refs = useMemo(() => ({ stage, lens, board }), [])

  const layout = useIsMobile() ? MOBILE_BOARD : DESKTOP_BOARD
  const { open, setOpen } = useFocusPull(refs, layout.zoom)

  // The page below mustn't scroll away while the glasses are on.
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = ''
    }
  }, [open])

  // Hand focus back to the glasses once the page is interactive again (click or Esc).
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open) glassesButton.current?.focus()
    wasOpen.current = open
  }, [open])

  return (
    <main
      id="welcome"
      ref={stage}
      className={styles.hero}
      data-open={open || undefined}
      style={{ '--hole-image': `url("${LENS_MASK_URL}")` } as CSSProperties}
    >
      <div className={styles.mosaicLayer}>
        <Mosaic ref={board} columns={layout.columns} rows={layout.rows} />
      </div>

      <div className={styles.curtain}>
        <LineBackground />
      </div>

      <div className={styles.canvas} inert={open}>
        <header className={`${styles.header} ${styles.fades}`}>
          <a href="#welcome" className={styles.name}>
            Anukriti
            <br />
            Mishra
          </a>
          <Nav />
        </header>

        <div className={styles.stage}>
          <div className={styles.glassesWrap}>
            <p className={`${styles.note} ${styles.fades}`}>
              Borrow my glasses.
              <br />
              <span className={styles.noteAccent}>See what I've been designing</span>
            </p>
            <img
              className={`${styles.arrow} ${styles.fades}`}
              src={arrow}
              width={52.4944}
              height={66.3139}
              alt=""
            />
            <button
              ref={glassesButton}
              type="button"
              className={styles.glassesRig}
              aria-label="Borrow my glasses: see what I've been designing"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Glasses lensRef={lens} />
            </button>
          </div>
        </div>

        <h1 className={`${styles.tagline} ${styles.fades}`}>I spot what's confusing and design it clear.</h1>
      </div>

      <p className={styles.hint} aria-hidden={!open}>
        Pinch to zoom out and see more
      </p>

      {open && (
        // Takes the glasses off (Esc does too).
        <button type="button" className={styles.close} onClick={() => setOpen(false)} autoFocus>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Close
        </button>
      )}
    </main>
  )
}
