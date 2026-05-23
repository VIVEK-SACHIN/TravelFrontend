import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { initTheme } from './theme/initTheme'
import './styles/themes.css'
import './styles/color-mode.css'
import './styles/layout.css'
import './styles/responsive.css'

initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
