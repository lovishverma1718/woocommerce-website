import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { setFirstPrerenderedLoad } from './lib/prerender'
import { installContactClickTracking } from './lib/analytics'
import './styles/index.css'

installContactClickTracking()

const rootEl = document.getElementById('root')!
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Static pages arrive prerendered (see scripts/prerender.mjs). Hydrate them, so React keeps
// the existing DOM (loaded images, scroll position, running CSS animations) instead of
// replacing it. Their first render matches the static HTML exactly (see src/lib/prerender.ts).
if (rootEl.hasChildNodes()) {
  setFirstPrerenderedLoad(true)
  ReactDOM.hydrateRoot(rootEl, app)
} else {
  ReactDOM.createRoot(rootEl).render(app)
}
