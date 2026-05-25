import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

const isCustomDomain = 
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1' &&
  !window.location.hostname.endsWith('.run.app');

const targetBaseURL = isCustomDomain 
  ? 'https://ais-dev-fuut53ns3svspgq6wvd6oi-286885900807.asia-southeast1.run.app' 
  : '';

if (isCustomDomain) {
  axios.defaults.baseURL = targetBaseURL;
  console.log('[API] Custom domain detected, API routed to:', targetBaseURL);
}

// Save globally for socket connection or direct anchor redirects in client
(window as any).__BACKEND_URL__ = targetBaseURL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
