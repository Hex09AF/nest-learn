// Import the functions you need from the SDKs you need
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export default function initFirebase(configService: ConfigService) {
  const firebaseConfig = {
    apiKey: configService.get<string>('FIREBASE_API_KEY'),
    authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
    projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: configService.get<string>('FIREBASE_SENDER_ID'),
    appId: configService.get<string>('FIREBASE_APP_ID'),
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return app;
}
