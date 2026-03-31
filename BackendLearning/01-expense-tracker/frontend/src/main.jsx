// ============================================================
// 📘 LESSON: main.jsx — THE ENTRY POINT OF YOUR REACT APP
//
// This file is WHERE React starts. Think of it as the "ignition key"
// for your app. Here's what happens step by step:
//
// 1. Vite reads index.html → finds <script src="main.jsx">
// 2. main.jsx runs → finds the <div id="root"> in index.html
// 3. createRoot() takes control of that div
// 4. .render(<App />) puts our entire app INSIDE that div
//
// WHAT IS StrictMode?
// StrictMode is a development-only wrapper that:
//   - Warns you about unsafe practices
//   - Runs some functions TWICE to detect side effects
//   - Has NO effect in production
// It's like a linter for your React components.
//
// WHY DO WE IMPORT index.css HERE?
// Because main.jsx is the root. Any CSS imported here applies
// GLOBALLY to the entire app. It's like putting a <link> tag
// in your HTML <head>.
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 📘 document.getElementById('root') grabs the <div id="root">
// from index.html. React will render EVERYTHING inside this div.
// The entire app lives here — React controls everything inside it.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
