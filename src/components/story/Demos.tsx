'use client'

import { useId, useRef, useState, type ReactNode } from 'react'
import type { Demo } from '@/data/stories'

// Code-rendered examples on the case-study pages. The recovery states are proposed portfolio refinements (the
// section says so); every control here only switches local, illustrative UI state. Nothing is sent, saved, charged
// or connected.

const card = 'rounded-2xl border bg-white p-5'
const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2'

function Example({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`flex min-w-0 flex-col ${className}`}>
      <p className="m-0 mb-2 text-[14px] leading-[1.4] font-semibold text-ink">{label}</p>
      {children}
    </div>
  )
}

/* ---------------- Pulsefit ---------------- */

const PF = { blue: '#0058DB', ink: '#0F1222', t2: '#454B60', line: '#D7DBE4', red: '#C62828', green: '#0B7A52' }
const pfButton = `inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 text-[14px] font-semibold ${focusRing} focus-visible:outline-[#0058DB]`

function PulsefitDemo() {
  const phoneId = useId()
  const [phone, setPhone] = useState('+91 78798 63288')
  const [phoneState, setPhoneState] = useState<'idle' | 'error' | 'saved'>('idle')
  const [rule, setRule] = useState(false)
  const save = () => {
    const digits = phone.replace(/\D/g, '')
    const valid = digits.length === 10 || (digits.length === 12 && digits.startsWith('91'))
    setPhoneState(valid ? 'saved' : 'error')
  }
  return (
    <div className="grid grid-cols-1 gap-6 font-body md:grid-cols-3" style={{ color: PF.ink }}>
      <Example label="Illustrative payment error">
        <div className={card} style={{ borderColor: PF.line }}>
          <span aria-hidden="true" className="grid size-9 place-items-center rounded-full text-[18px] font-bold" style={{ background: '#FDECEC', color: PF.red }}>!</span>
          <p className="m-0 mt-3 text-[17px] leading-[1.35] font-semibold">Payment could not be completed</p>
          <p className="m-0 mt-2 text-[15px] leading-[1.55]" style={{ color: PF.t2 }}>
            Review the payment details before trying again. The entered membership details are still available.
          </p>
          {/* Static: this example shows the message only. */}
          <div className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
            <span className={pfButton} style={{ background: PF.blue, color: '#fff' }}>Review payment</span>
            <span className={pfButton} style={{ border: `1px solid ${PF.line}`, color: PF.ink }}>Back to member details</span>
          </div>
          <p className="sr-only">Actions shown: Review payment, Back to member details.</p>
        </div>
      </Example>

      <Example label="Editable imported field">
        <div className={card} style={{ borderColor: PF.line }}>
          <span className="inline-flex items-center rounded-md px-2 py-1 text-[13px] font-semibold" style={{ background: '#E8F0FF', color: PF.blue }}>Imported from lead</span>
          <label htmlFor={phoneId} className="mt-3 block text-[14px] font-semibold">Phone number</label>
          <input
            id={phoneId}
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              setPhoneState('idle')
            }}
            aria-invalid={phoneState === 'error'}
            aria-describedby={`${phoneId}-help ${phoneId}-msg`}
            className={`mt-2 block min-h-11 w-full rounded-[10px] border bg-white px-3 text-[16px] ${focusRing} focus-visible:outline-[#0058DB]`}
            style={{ borderColor: phoneState === 'error' ? PF.red : '#8C93A6' }}
          />
          <p id={`${phoneId}-help`} className="m-0 mt-2 text-[14px] leading-[1.5]" style={{ color: PF.t2 }}>You can edit this before creating the membership.</p>
          <p id={`${phoneId}-msg`} role="status" className="m-0 mt-1 min-h-[22px] text-[14px] font-medium" style={{ color: phoneState === 'error' ? PF.red : PF.green }}>
            {phoneState === 'error' ? 'Enter a valid phone number.' : phoneState === 'saved' ? 'Phone number updated.' : ''}
          </p>
          <button type="button" onClick={save} className={`${pfButton} mt-2`} style={{ background: PF.blue, color: '#fff' }}>Save changes</button>
        </div>
      </Example>

      <Example label="Automated email rule">
        <div className={card} style={{ borderColor: PF.line }}>
          <div className="flex items-start justify-between gap-4">
            <p className="m-0 text-[16px] leading-[1.4] font-semibold" id="pf-rule">Subscription expiry reminder</p>
            <button
              type="button"
              role="switch"
              aria-checked={rule}
              aria-labelledby="pf-rule"
              onClick={() => setRule((r) => !r)}
              className={`relative h-11 w-14 shrink-0 rounded-full ${focusRing} focus-visible:outline-[#0058DB]`}
            >
              <span className="absolute inset-x-1 top-[10px] h-6 rounded-full transition-colors motion-reduce:transition-none" style={{ background: rule ? PF.blue : '#8C93A6' }} />
              <span className="absolute top-[13px] size-[18px] rounded-full bg-white transition-[left] motion-reduce:transition-none" style={{ left: rule ? 31 : 7 }} />
            </button>
          </div>
          <p role="status" className="m-0 mt-3 min-h-[22px] text-[14px] font-medium" style={{ color: PF.green }}>
            {rule ? 'Subscription expiry reminder enabled.' : ''}
          </p>
          <span aria-hidden="true" className={`${pfButton} mt-2`} style={{ border: `1px solid ${PF.line}`, color: PF.ink }}>Review rule</span>
          <p className="sr-only">Secondary action shown: Review rule.</p>
        </div>
      </Example>
    </div>
  )
}

/* ---------------- College ERP ---------------- */

const CE = { navy: '#0B1F3A', blue: '#1D4ED8', t2: '#475569', line: '#CBD5E1', bad: '#B91C1C', good: '#047857' }
const ceButton = `inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 text-[14px] font-semibold ${focusRing} focus-visible:outline-[#1D4ED8]`
// BA LLB batches and the Vertex Law College programmes, from the redesign's sample data: [name, expected, received] in ₹ Cr.
const BATCHES: [string, number, number][] = [['BA LLB · 2022 batch', 1.7, 1.5], ['BA LLB · 2023 batch', 1.8, 1.2], ['BA LLB · 2024 batch', 1.9, 1.0], ['BA LLB · 2025 batch', 2.1, 0.7]]
const PROGRAMMES: [string, number, number][] = [['LLB', 6.0, 4.5], ['BA LLB', 7.5, 4.4], ['LLM', 3.0, 2.1], ['PhD (Law)', 1.5, 1.1]]
const pct = (exp: number, rec: number) => (rec / exp) * 100

function CollegeDemo() {
  return (
    <div className="grid grid-cols-1 gap-8 font-body lg:grid-cols-2 lg:gap-6" style={{ color: CE.navy }}>
      <Example label="Return path">
        <ReturnPath />
        <p className="m-0 mt-3 text-[16px] leading-[1.6] text-ink">Closing a detail drawer returns to the same college, search and filters instead of resetting the list.</p>
      </Example>
      <Example label="No results">
        <NoResults />
      </Example>
    </div>
  )
}

function CollegeChip() {
  return (
    <span className="inline-flex min-h-8 items-center rounded-lg px-3 text-[13px] font-semibold" style={{ background: '#E6EDF9', color: CE.navy }}>
      College: Vertex Law College
    </span>
  )
}

function ReturnPath() {
  const below60 = BATCHES.filter(([, e, r]) => pct(e, r) < 60)
  const [open, setOpen] = useState<string | null>('BA LLB · 2025 batch')
  const [returned, setReturned] = useState(false)
  const back = useRef<HTMLButtonElement>(null)
  const rows = useRef<Record<string, HTMLButtonElement | null>>({})
  const batch = BATCHES.find((b) => b[0] === open)
  return (
    <div className={`${card} relative overflow-hidden`} style={{ borderColor: CE.line }}>
      <CollegeChip />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="flex min-h-11 items-center rounded-[10px] border px-3 text-[14px]" style={{ borderColor: CE.line }}>
          <span style={{ color: CE.t2 }}>Search:&nbsp;</span>BA LLB
        </div>
        <div className="flex min-h-11 items-center rounded-[10px] border px-3 text-[14px]" style={{ borderColor: CE.line }}>
          <span style={{ color: CE.t2 }}>Filter:&nbsp;</span>Below 60% collected
        </div>
      </div>
      <ul className="m-0 mt-3 list-none p-0">
        {below60.map(([name, e, r]) => (
          <li key={name} className="border-t" style={{ borderColor: '#E2E8F0' }}>
            <button
              type="button"
              ref={(el) => {
                rows.current[name] = el
              }}
              onClick={() => {
                setOpen(name)
                setReturned(false)
                requestAnimationFrame(() => back.current?.focus())
              }}
              className={`flex min-h-11 w-full items-center justify-between gap-3 px-1 text-left text-[14px] font-semibold ${focusRing} focus-visible:outline-[#1D4ED8]`}
              style={{ color: CE.blue }}
            >
              {name}
              <span style={{ color: CE.bad }}>{pct(e, r).toFixed(1)}%</span>
            </button>
          </li>
        ))}
      </ul>
      <p role="status" className="m-0 mt-2 min-h-[22px] text-[14px] font-medium" style={{ color: CE.good }}>
        {returned ? 'Your search and filters are unchanged.' : ''}
      </p>

      {batch && (
        <div className="absolute inset-y-0 right-0 left-[12%] sm:left-[36%] flex flex-col border-l bg-white p-4 shadow-[-24px_0_40px_-24px_rgba(11,31,58,0.45)]" style={{ borderColor: CE.line }} role="region" aria-label={`${batch[0]} detail`}>
          <nav aria-label="Level">
            <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-[13px]" style={{ color: CE.t2 }}>
              {['Group', 'College', 'Programme', 'Batch'].map((l, k) => (
                <li key={l} className="flex items-center gap-1">
                  {k > 0 && <span aria-hidden="true">›</span>}
                  <span aria-current={l === 'Batch' ? 'location' : undefined} className={l === 'Batch' ? 'font-semibold' : ''} style={l === 'Batch' ? { color: CE.navy } : undefined}>{l}</span>
                </li>
              ))}
            </ol>
          </nav>
          <p className="m-0 mt-3 text-[16px] font-semibold">{batch[0]}</p>
          <p className="m-0 mt-1 text-[14px]" style={{ color: CE.t2 }}>
            ₹{batch[2].toFixed(1)} Cr received of ₹{batch[1].toFixed(1)} Cr · {pct(batch[1], batch[2]).toFixed(1)}% collected
          </p>
          <button
            ref={back}
            type="button"
            onClick={() => {
              const name = batch[0]
              setOpen(null)
              setReturned(true)
              requestAnimationFrame(() => rows.current[name]?.focus())
            }}
            className={`${ceButton} mt-auto self-start border`}
            style={{ borderColor: CE.line, color: CE.navy }}
          >
            ← Back to college
          </button>
        </div>
      )}
    </div>
  )
}

function NoResults() {
  const searchId = useId()
  const filterId = useId()
  const [search, setSearch] = useState('MBA')
  const [below60, setBelow60] = useState(true)
  const input = useRef<HTMLInputElement>(null)
  const list = PROGRAMMES.filter(([n, e, r]) => n.toLowerCase().includes(search.trim().toLowerCase()) && (!below60 || pct(e, r) < 60))
  return (
    <div className={card} style={{ borderColor: CE.line }}>
      <CollegeChip />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <label htmlFor={searchId} className="block text-[13px] font-semibold" style={{ color: CE.t2 }}>Search programmes</label>
          <input
            ref={input}
            id={searchId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`mt-1 block min-h-11 w-full rounded-[10px] border bg-white px-3 text-[16px] ${focusRing} focus-visible:outline-[#1D4ED8]`}
            style={{ borderColor: '#64748B' }}
          />
        </div>
        <div>
          <label htmlFor={filterId} className="block text-[13px] font-semibold" style={{ color: CE.t2 }}>Collection</label>
          <select
            id={filterId}
            value={below60 ? 'below' : 'all'}
            onChange={(e) => setBelow60(e.target.value === 'below')}
            className={`mt-1 block min-h-11 w-full rounded-[10px] border bg-white px-3 text-[16px] ${focusRing} focus-visible:outline-[#1D4ED8]`}
            style={{ borderColor: '#64748B' }}
          >
            <option value="all">All</option>
            <option value="below">Below 60% collected</option>
          </select>
        </div>
      </div>
      <div role="status" className="mt-4">
        {list.length === 0 ? (
          <div className="rounded-xl px-4 py-5 text-center" style={{ background: '#F1F5F9' }}>
            <p className="m-0 text-[16px] font-semibold">No records match these filters</p>
            <p className="m-0 mt-1 text-[14px] leading-[1.5]" style={{ color: CE.t2 }}>Try a different search or clear the filters to see more records.</p>
          </div>
        ) : (
          <ul className="m-0 list-none p-0">
            {list.map(([n, e, r]) => (
              <li key={n} className="flex min-h-11 items-center justify-between border-t text-[14px] font-semibold" style={{ borderColor: '#E2E8F0' }}>
                {n}
                <span style={{ color: pct(e, r) < 60 ? CE.bad : CE.good }}>{pct(e, r).toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {list.length === 0 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setBelow60(false)
            }}
            className={ceButton}
            style={{ background: CE.navy, color: '#fff' }}
          >
            Clear filters
          </button>
          <button type="button" onClick={() => input.current?.select()} className={`${ceButton} border`} style={{ borderColor: CE.line, color: CE.navy }}>
            Edit search
          </button>
        </div>
      )}
    </div>
  )
}

/* ---------------- Zync ---------------- */

const ZY = { vio: '#5B3FC4', ink: '#12101C', t2: '#55526A', line: '#D9D5E8', pink: '#C93A60', mint: '#2DC6A0' }
const zyButton = `inline-flex min-h-11 items-center justify-center rounded-full px-5 text-[14px] font-semibold ${focusRing} focus-visible:outline-[#5B3FC4]`
const GOAL = 2250
// The food log's sample total before the example entry, as on the Food log screen.
const LOGGED = 1385
const SERVINGS = [
  { label: '1 medium (118 g)', cal: 105 },
  { label: '1 large (136 g)', cal: 121 },
]
type Entry = { food: string; serving: number; qty: number }
const kcal = (e: Entry) => SERVINGS[e.serving].cal * e.qty

function ZyncDemo() {
  const [entry, setEntry] = useState<Entry | null>(null)
  const [toast, setToast] = useState<{ text: string; undo?: boolean } | null>(null)
  const [menu, setMenu] = useState(false)
  const [editing, setEditing] = useState<Entry | null>(null)
  const [confirm, setConfirm] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const addButton = useRef<HTMLButtonElement>(null)
  const ids = useId()

  const total = LOGGED + (entry ? kcal(entry) : 0)
  const r = 52
  const C = 2 * Math.PI * r
  const remove = () => {
    setEntry(null)
    setMenu(false)
    setConfirm(false)
    setEditing(null)
    setToast({ text: 'Food entry removed.' })
    requestAnimationFrame(() => addButton.current?.focus())
  }

  return (
    <div className="grid grid-cols-1 gap-6 font-body md:grid-cols-[minmax(0,400px)_1fr] md:items-start" style={{ color: ZY.ink }}>
      <div className="relative rounded-[28px] border p-5" style={{ background: '#F6F5FA', borderColor: ZY.line }}>
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4">
          <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label={`${total.toLocaleString('en-IN')} of ${GOAL.toLocaleString('en-IN')} calories eaten`} className="shrink-0">
            <circle cx="60" cy="60" r={r} fill="none" stroke="#ECE8FA" strokeWidth="12" />
            <circle
              cx="60" cy="60" r={r} fill="none" stroke={ZY.mint} strokeWidth="12" strokeLinecap="round"
              strokeDasharray={`${(Math.min(total, GOAL) / GOAL) * C} ${C}`} transform="rotate(-90 60 60)"
              className="transition-[stroke-dasharray] duration-300 motion-reduce:transition-none"
            />
            <text x="60" y="58" textAnchor="middle" fontSize="20" fontWeight="700" fill={ZY.ink}>{total.toLocaleString('en-IN')}</text>
            <text x="60" y="78" textAnchor="middle" fontSize="11" fill={ZY.t2}>of {GOAL.toLocaleString('en-IN')} cal</text>
          </svg>
          <div>
            <p className="m-0 text-[15px] font-semibold">Today</p>
            <p className="m-0 mt-1 text-[14px]" style={{ color: ZY.pink }}>{(GOAL - total).toLocaleString('en-IN')} cal left</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4">
          <p className="m-0 text-[15px] font-semibold">Snacks</p>
          {entry ? (
            <div className="relative mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="m-0 text-[15px] font-semibold">{entry.food}</p>
                <p className="m-0 text-[13px]" style={{ color: ZY.t2 }}>{entry.qty} × {SERVINGS[entry.serving].label}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-semibold">{kcal(entry)} cal</span>
                <button
                  ref={menuButton}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menu}
                  aria-label={`Options for ${entry.food}`}
                  onClick={() => setMenu((m) => !m)}
                  className={`grid size-11 place-items-center rounded-full text-[18px] ${focusRing} focus-visible:outline-[#5B3FC4]`}
                >
                  ⋯
                </button>
              </div>
              {menu && (
                <div role="menu" className="absolute top-full right-0 z-10 mt-1 w-44 rounded-xl border bg-white p-1 shadow-lg" style={{ borderColor: ZY.line }}
                  onKeyDown={(e) => { if (e.key === 'Escape') { setMenu(false); menuButton.current?.focus() } }}>
                  <button type="button" role="menuitem" autoFocus onClick={() => { setMenu(false); setEditing(entry) }} className={`block min-h-11 w-full rounded-lg px-3 text-left text-[14px] hover:bg-[#F6F5FA] ${focusRing} focus-visible:outline-[#5B3FC4]`}>Edit entry</button>
                  <button type="button" role="menuitem" onClick={() => { setMenu(false); setConfirm(true) }} className={`block min-h-11 w-full rounded-lg px-3 text-left text-[14px] hover:bg-[#F6F5FA] ${focusRing} focus-visible:outline-[#5B3FC4]`} style={{ color: ZY.pink }}>Delete entry</button>
                </div>
              )}
            </div>
          ) : (
            <button
              ref={addButton}
              type="button"
              onClick={() => {
                setEntry({ food: 'Banana', serving: 0, qty: 1 })
                setToast({ text: 'Food added to today’s log.', undo: true })
              }}
              className={`${zyButton} mt-2 border`}
              style={{ borderColor: ZY.vio, color: ZY.vio }}
            >
              + Log a banana
            </button>
          )}
        </div>

        {editing && (
          <form
            className="mt-4 rounded-2xl bg-white p-4"
            aria-label="Edit food entry"
            onSubmit={(e) => {
              e.preventDefault()
              setEntry(editing)
              setEditing(null)
              setToast({ text: 'Food entry updated.' })
              requestAnimationFrame(() => menuButton.current?.focus())
            }}
          >
            <label htmlFor={`${ids}-food`} className="block text-[13px] font-semibold">Food</label>
            <input id={`${ids}-food`} value={editing.food} onChange={(e) => setEditing({ ...editing, food: e.target.value })} required
              className={`mt-1 block min-h-11 w-full rounded-xl border px-3 text-[16px] ${focusRing} focus-visible:outline-[#5B3FC4]`} style={{ borderColor: '#8C88A0' }} autoFocus />
            <div className="mt-3 grid grid-cols-[1fr_90px] gap-3">
              <div>
                <label htmlFor={`${ids}-size`} className="block text-[13px] font-semibold">Serving size</label>
                <select id={`${ids}-size`} value={editing.serving} onChange={(e) => setEditing({ ...editing, serving: +e.target.value })}
                  className={`mt-1 block min-h-11 w-full rounded-xl border bg-white px-2 text-[16px] ${focusRing} focus-visible:outline-[#5B3FC4]`} style={{ borderColor: '#8C88A0' }}>
                  {SERVINGS.map((s, k) => <option key={s.label} value={k}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={`${ids}-qty`} className="block text-[13px] font-semibold">Quantity</label>
                <input id={`${ids}-qty`} type="number" min={1} max={5} value={editing.qty} onChange={(e) => setEditing({ ...editing, qty: Math.min(5, Math.max(1, Math.round(+e.target.value) || 1)) })}
                  className={`mt-1 block min-h-11 w-full rounded-xl border px-3 text-[16px] ${focusRing} focus-visible:outline-[#5B3FC4]`} style={{ borderColor: '#8C88A0' }} />
              </div>
            </div>
            <p className="m-0 mt-2 text-[13px]" style={{ color: ZY.t2 }}>{kcal(editing)} cal</p>
            <button type="submit" className={`${zyButton} mt-3`} style={{ background: ZY.vio, color: '#fff' }}>Save changes</button>
          </form>
        )}

        {confirm && entry && (
          <div className="absolute inset-0 z-20 grid place-items-center rounded-[28px] bg-[rgba(18,16,28,0.45)] p-4">
            <div role="alertdialog" aria-modal="true" aria-labelledby={`${ids}-dt`} aria-describedby={`${ids}-db`} className="w-full max-w-[320px] rounded-2xl bg-white p-5"
              onKeyDown={(e) => { if (e.key === 'Escape') { setConfirm(false); menuButton.current?.focus() } }}>
              <p id={`${ids}-dt`} className="m-0 text-[17px] font-semibold">Delete this entry?</p>
              <p id={`${ids}-db`} className="m-0 mt-2 text-[14px] leading-[1.5]" style={{ color: ZY.t2 }}>This removes the entry from today’s food log.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={remove} className={zyButton} style={{ background: ZY.pink, color: '#fff' }}>Delete entry</button>
                <button type="button" autoFocus onClick={() => { setConfirm(false); requestAnimationFrame(() => menuButton.current?.focus()) }} className={`${zyButton} border`} style={{ borderColor: ZY.line, color: ZY.ink }}>Keep entry</button>
              </div>
            </div>
          </div>
        )}

        <div role="status" aria-live="polite" className="mt-4 min-h-14">
          {toast && (
            <div className="flex items-center justify-between gap-3 rounded-2xl px-4 py-2 text-[14px] text-white" style={{ background: ZY.ink }}>
              <span>{toast.text}</span>
              {toast.undo && entry && (
                <button type="button" onClick={remove} className={`min-h-11 rounded-full px-3 font-semibold ${focusRing} focus-visible:outline-white`} style={{ color: '#C9BCFF' }}>
                  Undo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="text-[15px] leading-[1.6] text-ink">
        <p className="m-0 font-semibold">Try it</p>
        <p className="m-0 mt-1">Log the sample entry, then undo it, edit it from its menu, or delete it. The ring and the calories left follow the total. Nothing is saved or connected to health records.</p>
      </div>
    </div>
  )
}

/* ---------------- SSH client ---------------- */

const SS = { bg: '#121216', card: '#18181D', card2: '#212128', edge: '#6E6E7A', tx: '#EDEDF0', t2: '#B4B4BE', vio: '#8B5CF6', amb: '#FBBF24', red: '#F87171' }
const ssButton = `inline-flex min-h-11 items-center justify-center rounded-[10px] px-4 text-[14px] font-semibold ${focusRing} focus-visible:outline-[#C4B5FD]`

function SshDemo() {
  const [verified, setVerified] = useState(false)
  const id = useId()
  const ctx: [string, string][] = [['Host', 'API Gateway · 10.0.1.12'], ['Username', 'ira'], ['Selected key', 'ira-laptop']]
  const box = 'rounded-2xl p-5'
  return (
    <div className="rounded-2xl p-4 font-body md:p-6" style={{ background: SS.bg, color: SS.tx }}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className={box} style={{ background: SS.card, boxShadow: `inset 0 0 0 1px ${SS.edge}` }}>
          <p className="m-0 text-[17px] font-semibold" style={{ color: SS.red }}>Authentication failed</p>
          <p className="m-0 mt-2 text-[14px] leading-[1.55]" style={{ color: SS.t2 }}>The server did not accept these credentials. Check the username and selected key before trying again.</p>
          <dl className="m-0 mt-4 flex flex-col gap-2 text-[14px]">
            {ctx.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 rounded-lg px-3 py-2" style={{ background: SS.card2 }}>
                <dt style={{ color: SS.t2 }}>{k}</dt>
                <dd className="m-0 text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
            <span className={ssButton} style={{ background: SS.vio, color: '#fff' }}>Edit connection</span>
            <span className={ssButton} style={{ boxShadow: `inset 0 0 0 1px ${SS.edge}` }}>Choose another key</span>
          </div>
          <p className="sr-only">Actions shown: Edit connection, Choose another key.</p>
        </div>

        <div className={box} style={{ background: SS.card, boxShadow: `inset 0 0 0 1px ${SS.edge}` }}>
          <p className="m-0 text-[17px] font-semibold" style={{ color: SS.amb }}>Verify this host before connecting</p>
          <p className="m-0 mt-2 text-[14px] leading-[1.55]" style={{ color: SS.t2 }}>This host is not in your trusted list. Compare its fingerprint with a trusted source before continuing.</p>
          <p className="m-0 mt-4 text-[13px] font-semibold" style={{ color: SS.t2 }}>Host fingerprint</p>
          <div className="mt-1 rounded-lg px-3 py-2" style={{ background: SS.card2 }}>
            <p className="m-0 text-[12px]" style={{ color: SS.t2 }}>Illustrative fingerprint</p>
            <p className="m-0 mt-1 font-mono text-[13px] break-all">SHA256:k3Xv9QpL2mR7tYw4Zc8NbH1sDfG6jEuA0oPiTqWxVyM</p>
          </div>
          <label htmlFor={id} className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 text-[14px] leading-[1.45]">
            <input id={id} type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="mt-[2px] size-5 shrink-0 accent-[#8B5CF6]" />
            I verified this fingerprint through a trusted source
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={ssButton} style={{ background: SS.vio, color: '#fff' }}>Cancel connection</button>
            <button
              type="button"
              disabled={!verified}
              className={`${ssButton} disabled:cursor-not-allowed`}
              style={{ boxShadow: `inset 0 0 0 1px ${SS.edge}`, color: verified ? SS.tx : '#8A8A94' }}
            >
              Trust and connect
            </button>
          </div>
        </div>

        <div className={box} style={{ background: SS.card, boxShadow: `inset 0 0 0 1px ${SS.red}` }}>
          <p className="m-0 text-[17px] font-semibold" style={{ color: SS.red }}>Host key has changed</p>
          <p className="m-0 mt-2 text-[14px] leading-[1.55]" style={{ color: SS.t2 }}>Stop and verify the new fingerprint with your server administrator. Do not replace the saved key until the change is confirmed.</p>
          <div className="mt-4" aria-hidden="true">
            <span className={ssButton} style={{ background: SS.vio, color: '#fff' }}>Cancel connection</span>
          </div>
          <p className="sr-only">Action shown: Cancel connection.</p>
        </div>
      </div>
      <p className="m-0 mt-4 text-[13px] leading-[1.5]" style={{ color: SS.t2 }}>Illustrative examples: no connection is made and no fingerprint is checked.</p>
    </div>
  )
}

/* ---------------- Jaadu ---------------- */

const SHORTLIST = [
  { title: 'MeanRev-VAL', type: 'Mean reversion', win: '58%', trades: '100', winners: '58', losers: '42' },
  { title: 'Breakout-ORB', type: 'Opening-range breakout', win: '52%', trades: '100', winners: '52', losers: '48' },
  { title: 'Trend-Pullback', type: 'Trend continuation', win: '61%', trades: '100', winners: '61', losers: '39' },
]

function JaaduShortlist() {
  return (
    <div className="font-body">
      <p className="m-0 mb-2 text-[14px] font-semibold text-ink">Illustrative shortlist</p>
      <div className="rounded-2xl p-4 md:p-6" style={{ background: 'linear-gradient(180deg,#0A1340,#00022B)', color: '#F1F4FF' }}>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-3">
          {SHORTLIST.map((c) => (
            <li key={c.title} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 0 1px #4A5A9A' }}>
              <p className="m-0 text-[17px] font-semibold">{c.title}</p>
              <p className="m-0 mt-1 text-[13px]" style={{ color: '#B9C4EE' }}>Type: {c.type}</p>
              <dl className="m-0 mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
                {[['Win rate', c.win], ['Trades', c.trades], ['Winners', c.winners], ['Losers', c.losers]].map(([k, v]) => (
                  <div key={k}>
                    <dt style={{ color: '#B9C4EE' }}>{k}</dt>
                    <dd className="m-0 mt-1 text-[18px] font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-4 text-[14px] leading-[1.5]" style={{ color: '#D5DCF7' }}>Illustrative candidates. Win rate alone does not describe risk or profitability.</p>
      </div>
    </div>
  )
}

function FootprintLegend() {
  const items: [string, string][] = [
    ['#3157E0', 'Blue cell: more volume bought than sold at that price'],
    ['#D2384F', 'Red cell: more volume sold than bought at that price'],
    ['#DE9C2E', 'Yellow cell: the price with the most volume in the candle'],
  ]
  return (
    <div className="max-w-[680px] font-body">
      <p className="m-0 text-[14px] font-semibold text-ink">Reading the cells</p>
      <ul className="m-0 mt-2 flex list-none flex-col gap-2 p-0 text-[15px] leading-[1.5] text-ink">
        {items.map(([c, t]) => (
          <li key={t} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-[4px] size-4 shrink-0 rounded-[4px]" style={{ background: c }} />
            {t}
          </li>
        ))}
        <li className="pl-7">In each pair, the left number is volume sold and the right is volume bought. Time runs along the bottom; price is on the right.</li>
      </ul>
    </div>
  )
}

const DEMOS: Record<Demo, () => ReactNode> = {
  pulsefit: PulsefitDemo,
  college: CollegeDemo,
  zync: ZyncDemo,
  ssh: SshDemo,
  'jaadu-shortlist': JaaduShortlist,
  'footprint-legend': FootprintLegend,
}

export function StoryDemo({ kind }: { kind: Demo }) {
  const Demo = DEMOS[kind]
  return <Demo />
}
