# Perseus Bot

Perseus Bot is a full-stack platform managing automated customer conversations, real-time message broadcasting, dynamic credit balances, and secure multi-user role management linked with Meta Facebook Graph API and Google Cloud Firestore.

## Required Environment Variables (set these on Render/Railway/etc)

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-api-key  
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_APP_ID=your-app-id
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_FIRESTORE_DATABASE_ID=your-database-id
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_REDIRECT_URI=https://your-domain.com/auth/facebook/callback
SESSION_SECRET=your-random-secret-key
NODE_ENV=production
```

These variables must be set in your hosting dashboard (Render → Environment, Railway → Variables). The app reads them on every startup. Your Firestore data is stored in Google Firebase cloud — it is NEVER deleted by redeployment. Only wrong/missing env vars cause data to appear lost.
