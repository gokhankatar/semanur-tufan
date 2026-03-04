import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


export default defineNuxtPlugin({
  name: 'firebase',
  order: -10,
  setup() {
    const config = useRuntimeConfig();

    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: "semanur-tufan-a85df.firebaseapp.com",
      projectId: "semanur-tufan-a85df",
      storageBucket: "semanur-tufan-a85df.firebasestorage.app",
      messagingSenderId: "833906374319",
      appId: "1:833906374319:web:58c886d1dfeabe492b065a"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    return {
      provide: {
        firebase: app,
        auth,
        firestore,
      },
    }
  },
})