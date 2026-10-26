import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import '@fontsource/anton/400.css'
import '@fontsource-variable/rubik/wght.css'
import '@fontsource-variable/montserrat/wght.css'
import './styles/global.css'
import App from './App.tsx'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
ScrollTrigger.config({ ignoreMobileResize: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
