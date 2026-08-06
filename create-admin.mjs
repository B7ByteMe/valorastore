import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCbdxEPz_EHcP9Byoi6VBh7SpZ6eWRY_4E",
  authDomain: "valora-store-c24d0.firebaseapp.com",
  projectId: "valora-store-c24d0",
  storageBucket: "valora-store-c24d0.firebasestorage.app",
  messagingSenderId: "462023576839",
  appId: "1:462023576839:web:11752450216a1ee12f09a2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createAdmin() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, 'admin@valora.com', 'adminadmin');
    const user = userCredential.user;
    
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      name: 'Super Admin',
      email: 'admin@valora.com',
      role: 'admin',
      joinDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'active',
      developerStatus: 'approved',
      developerStudioName: 'Valora Official',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`
    });
    console.log('Admin user document created in Firestore successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    // If user already exists, let's just update their role to admin
    if (err.message.includes('email-already-in-use')) {
        console.log("Account already exists. Please login with admin@valora.com and password adminadmin.");
    }
    process.exit(1);
  }
}
createAdmin();
