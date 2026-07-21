import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import './styles/global.css'
import { applyUrlState } from './app/bootstrap'

const root = document.getElementById('root')

if (!root) throw new Error('Application root was not found')

applyUrlState(window.location.search)
const sceneEnabled = new URLSearchParams(window.location.search).get('scene') !== 'off'

createRoot(root).render(
  <StrictMode>
    <App sceneEnabled={sceneEnabled} />
  </StrictMode>,
)
