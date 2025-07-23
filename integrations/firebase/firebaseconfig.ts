// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
   apiKey: 'AIzaSyB1grwv76uNG7h741-eDFh3yciKbCvGvug',
   authDomain: 'hezal-pawccessories.firebaseapp.com',
   projectId: 'hezal-pawccessories',
   storageBucket: 'hezal-pawccessories.firebasestorage.app',
   messagingSenderId: '769639879184',
   appId: '1:769639879184:web:df6cf742361dd545af3095',
   measurementId: 'G-GC2SSKL312',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics only if supported (client-side)
let analytics: any = null
if (typeof window !== 'undefined') {
   isSupported().then((supported) => {
      if (supported) {
         analytics = getAnalytics(app)
      }
   })
}

export const db = getFirestore(app)
export { analytics }
