// ============================================================
// 📘 LESSON: VITE CONFIG
//
// This is Vite's configuration file.
// We add plugins here to extend Vite's capabilities.
//
// @tailwindcss/vite is the official Tailwind CSS v4 plugin for Vite.
// It automatically processes your CSS and generates the Tailwind
// utility classes used in your JSX components.
// ============================================================
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← Tailwind CSS v4 Vite plugin
  ],
})
