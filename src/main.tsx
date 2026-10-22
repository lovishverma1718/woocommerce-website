import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionGlobalConfig } from 'framer-motion'
import { App } from './App'
import './styles/index.css'

const rootEl = document.getElementById('root')!

// Static pages arrive prerendered (see scripts/prerender.mjs), so their content is
// already visible. Skip entrance animations on this first mount, otherwise the text
// would vanish and fade back in. Animations work as normal right after.
if (rootEl.hasChildNodes()) {
  MotionGlobalConfig.skipAnimations = true
  window.setTimeout(() => {
    MotionGlobalConfig.skipAnimations = false
  }, 1200)
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
