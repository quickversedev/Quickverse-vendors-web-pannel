import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { reduxStore } from './stores/reduxStore'
import './index.css'
import App from './App.tsx'

// Initialize theme on boot (applies 'dark' class to <html> if needed)
import './stores/useThemeStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={reduxStore}>
    <App />
    </Provider>
  </StrictMode>,
)
