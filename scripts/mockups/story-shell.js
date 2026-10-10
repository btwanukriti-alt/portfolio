// Shared by every story.js: lays the shots out one under another and flags READY once fonts and images load.
window.SHOTS = []
window.shot = (name, html, opts = {}) => window.SHOTS.push({ name, html, ...opts })
window.mountShots = () => {
  const box = document.createElement('div')
  box.style.cssText = 'display:flex;flex-direction:column;align-items:flex-start;gap:40px;padding:40px'
  box.innerHTML = window.SHOTS.map(s => `<div data-shot="${s.name}" style="width:max-content;${s.style || ''}">${s.html}</div>`).join('')
  document.body.appendChild(box)
  Promise.all([document.fonts.ready, ...[...document.images].map(im => im.complete ? 0 : new Promise(r => { im.onload = im.onerror = r }))]).then(() => { window.READY = true })
}
