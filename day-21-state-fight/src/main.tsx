import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './refresh.css'
import App from './App.tsx'

declare global {
  interface Window {
    render_game_to_text?: () => string
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
