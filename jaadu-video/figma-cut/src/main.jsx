import { createRoot } from 'react-dom/client'
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/geist-sans/latin-400.css'
import '@fontsource/geist-sans/latin-500.css'
import '@fontsource/geist-sans/latin-600.css'
import '@fontsource/geist-mono/latin-400.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
// Render once the fonts are in, so the first frame isn't laid out in a fallback face.
;(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => root.render(<App />))
