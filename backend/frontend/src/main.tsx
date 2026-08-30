import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Suppress web vitals errors in development
if (import.meta.env.DEV) {
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Filter out web vitals startTime errors
    const errorMessage = args[0]?.toString() || '';
    if (errorMessage.includes('startTime') && errorMessage.includes('reportAllChanges')) {
      return; // Suppress this specific error
    }
    originalError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
