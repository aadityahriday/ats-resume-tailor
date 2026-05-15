import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'

// Lazy load components for better Core Web Vitals
const App = lazy(() => import('./App.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-bg">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-amber border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-muted text-sm">Loading ResumeCopy...</p>
            </div>
          </div>
        }>
          <App />
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
