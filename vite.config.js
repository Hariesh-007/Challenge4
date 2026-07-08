import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isRootHosting = env.VITE_FIREBASE_PROJECT_ID || process.env.VERCEL;
  
  return {
    base: isRootHosting ? '/' : '/Challenge4/',
    plugins: [react()]
  }
})
