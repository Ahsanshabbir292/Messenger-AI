import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');

  // Safeguard Firebase Config so compilation works even when the json file is missing (e.g. on Render/GitHub deploys)
  let firebaseConfig: any = {
    apiKey: "dummy-api-key-placeholder",
    authDomain: "dummy-project.firebaseapp.com",
    projectId: "dummy-project-id",
    storageBucket: "dummy-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:dummy12345"
  };

  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    try {
      firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      console.error("Failed to parse firebase-applet-config.json on startup", e);
    }
  }

  // Override config keys with environment variables if available
  if (env.VITE_FIREBASE_API_KEY) firebaseConfig.apiKey = env.VITE_FIREBASE_API_KEY;
  if (env.VITE_FIREBASE_AUTH_DOMAIN) firebaseConfig.authDomain = env.VITE_FIREBASE_AUTH_DOMAIN;
  if (env.VITE_FIREBASE_PROJECT_ID) firebaseConfig.projectId = env.VITE_FIREBASE_PROJECT_ID;
  if (env.VITE_FIREBASE_STORAGE_BUCKET) firebaseConfig.storageBucket = env.VITE_FIREBASE_STORAGE_BUCKET;
  if (env.VITE_FIREBASE_MESSAGING_SENDER_ID) firebaseConfig.messagingSenderId = env.VITE_FIREBASE_MESSAGING_SENDER_ID;
  if (env.VITE_FIREBASE_APP_ID) firebaseConfig.appId = env.VITE_FIREBASE_APP_ID;
  if (env.VITE_FIREBASE_DATABASE_ID || env.FIREBASE_DATABASE_ID || env.FIREBASE_FIRESTORE_DATABASE_ID) {
    firebaseConfig.firestoreDatabaseId = env.VITE_FIREBASE_DATABASE_ID || env.FIREBASE_DATABASE_ID || env.FIREBASE_FIRESTORE_DATABASE_ID;
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_FIREBASE_CONFIG': JSON.stringify(firebaseConfig),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'vendor-charts': ['recharts'],
            'vendor-socket': ['socket.io-client'],
            'vendor-motion': ['motion'],
          }
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
