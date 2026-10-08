import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "../i18n"
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify';
import { AuthContextProvider } from './api/context/authContext/AuthContext.tsx'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },

  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer />
      </QueryClientProvider>
    </AuthContextProvider>
  </StrictMode>,
)
