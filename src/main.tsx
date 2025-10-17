import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { BarberContextProvider } from './context/BarberContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BarberContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>  
    </BarberContextProvider>
  </StrictMode>,
)
