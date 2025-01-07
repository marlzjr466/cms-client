import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { ReduxMeta } from '@opensource-dev/redux-meta';

// css
import '@assets/css/style.css'

// views
import App from '@views/App'

// components
import AuthProvider from '@components/AuthProvider';

// modules
import modules from '@modules';

// register all modules
ReduxMeta.registerModules(modules());

// Save the original methods
const originalWarn = console.warn;

// Override console.warn
console.warn = (...args) => {
  // Suppress specific warnings
  if (args[0]?.includes('Selector unknown returned the root state')) {
    return; // Ignore this warning
  }
  originalWarn(...args) // Allow other warnings
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ReduxMeta.Provider store={ReduxMeta.store}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ReduxMeta.Provider>
    </BrowserRouter>
  </StrictMode>,
)
