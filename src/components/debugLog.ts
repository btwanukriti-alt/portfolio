// Temporary: open the page with ?debug to see which pinch events the device actually sends.
export type DebugLog = ((line: string) => void) & { remove: () => void }

export function createDebugLog(): DebugLog {
  if (!new URLSearchParams(window.location.search).has('debug')) {
    return Object.assign(() => {}, { remove: () => {} })
  }

  const box = document.createElement('pre')
  box.style.cssText =
    'position:fixed;top:8px;left:8px;z-index:9999;margin:0;padding:8px 10px;max-width:90vw;' +
    'background:#000c;color:#7CFC9A;font:12px/1.4 monospace;border-radius:6px;pointer-events:none'
  box.textContent = 'focus-pull debug: waiting for pinch events...'
  document.body.append(box)

  const lines: string[] = []
  return Object.assign(
    (line: string) => {
      lines.unshift(line)
      box.textContent = lines.slice(0, 8).join('\n')
    },
    { remove: () => box.remove() },
  )
}
