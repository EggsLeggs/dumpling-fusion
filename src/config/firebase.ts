
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableMultiTabIndexedDbPersistence, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db: Firestore = getFirestore(app);

// Enable multi-tab offline persistence
enableMultiTabIndexedDbPersistence(db, { cacheSizeBytes: CACHE_SIZE_UNLIMITED })
  .then(() => {
    console.log("Offline persistence enabled for Firestore across multiple tabs.");
  })
  .catch((err: any) => { 
    if (err.code === 'failed-precondition') {
      console.warn(
        "Firestore offline persistence: failed-precondition. This may be due to multiple tabs attempting to initialize persistence, persistence already being enabled, or attempting to enable after Firestore usage. Details: ", err.message
      );
    } else if (err.code === 'unimplemented') {
      console.warn(
        "Firestore offline persistence failed: The current browser does not support all of the features required to enable persistence."
      );
    } else {
      console.error("Firestore offline persistence failed with error: ", err);
    }
  });

export { app, db };

// Note: You need to create a .env.local file in the root of your project
// and add your Firebase configuration there. For example:
// NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
// ... and so on.

