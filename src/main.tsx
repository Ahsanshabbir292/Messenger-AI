import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import axios from 'axios';
import App from './App.tsx';
import './index.css';

const isCustomDomain = 
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== '127.0.0.1' &&
  !window.location.hostname.endsWith('.run.app');

// For both development in AI Studio and custom domain production deployments, 
// the React app and Express backend run together on the same origin (same container/port).
// Therefore, we should use standard relative paths (empty string) so the client automatically 
// communicates with its own local server. This ensures robust session, cookie, and database isolation.
const targetBaseURL = '';

if (isCustomDomain) {
  // Let custom domain deployments operate self-contained
  console.log('[API] Custom domain detected, operating in self-contained production mode.');
}

// Save globally for socket connection or direct anchor redirects in client
(window as any).__BACKEND_URL__ = targetBaseURL;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
