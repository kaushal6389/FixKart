// Firebase Configuration for Frontend
// ✅ CONFIGURED - Project: fixkart-5ae0b

const firebaseConfig = {
  apiKey: "AIzaSyAOWktmvJCBxjrfKE4Hou6CrzcdN0sjIHY",
  authDomain: "fixkart-5ae0b.firebaseapp.com",
  projectId: "fixkart-5ae0b",
  storageBucket: "fixkart-5ae0b.firebasestorage.app",
  messagingSenderId: "789867719362",
  appId: "1:789867719362:web:bd49b19d440c4a2130a95b",
  measurementId: "G-M4DGPTYV7X"
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized successfully!');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Get Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Auth state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL
    };
    
    // Store in localStorage for quick access
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update navbar
    if (typeof updateNavbarForLoggedInUser === 'function') {
      updateNavbarForLoggedInUser(userData);
    }
  } else {
    // User is signed out
    localStorage.removeItem('user');
    
    // Reset navbar
    const navButtons = document.getElementById('navButtons');
    const userProfile = document.getElementById('userProfile');
    
    if (navButtons && userProfile) {
      navButtons.style.display = 'flex';
      userProfile.style.display = 'none';
    }
  }
});

console.log('🔥 Firebase config loaded!');
