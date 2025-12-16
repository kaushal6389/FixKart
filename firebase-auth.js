// ===============================================
// FIREBASE AUTHENTICATION & FORM HANDLERS
// ===============================================

// Auth tab switching function
window.switchAuthTab = function(tab) {
  const loginContainer = document.getElementById('loginFormContainer');
  const signupContainer = document.getElementById('signupFormContainer');
  const tabs = document.querySelectorAll('.auth-tab');
  
  tabs.forEach(t => t.classList.remove('active'));
  
  if (tab === 'login') {
    loginContainer.style.display = 'block';
    signupContainer.style.display = 'none';
    tabs[0].classList.add('active');
  } else {
    loginContainer.style.display = 'none';
    signupContainer.style.display = 'block';
    tabs[1].classList.add('active');
  }
};

// Logout function with Firebase
window.logout = function() {
  if (confirm('Are you sure you want to logout?')) {
    auth.signOut().then(() => {
      alert('Logged out successfully!');
      showHome();
    }).catch((error) => {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    });
  }
};

// Update navbar for logged in user
function updateNavbarForLoggedInUser(user) {
  const navButtons = document.getElementById('navButtons');
  const userProfile = document.getElementById('userProfile');
  const profileName = document.getElementById('profileName');
  const userEmail = document.getElementById('userEmail');
  
  if (navButtons && userProfile && profileName) {
    // Hide auth button
    navButtons.style.display = 'none';
    
    // Show user profile
    userProfile.style.display = 'flex';
    profileName.textContent = user.displayName || user.email.split('@')[0];
    
    if (userEmail) {
      userEmail.textContent = user.email;
    }
  }
}

// Initialize Firebase handlers
function initializeFirebaseHandlers() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      submitBtn.disabled = true;
      
      try {
        await auth.signInWithEmailAndPassword(email, password);
        alert('✅ Login successful!');
        closeModal('authSection');
        loginForm.reset();
      } catch (error) {
        console.error('Login error:', error);
        let msg = 'Login failed. ';
        if (error.code === 'auth/user-not-found') msg += 'No account found.';
        else if (error.code === 'auth/wrong-password') msg += 'Incorrect password.';
        else msg += error.message;
        alert('❌ ' + msg);
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fullName = document.getElementById('signupFullName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const phone = document.getElementById('signupPhone').value.trim();
      const city = document.getElementById('signupCity').value.trim();
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      
      if (password !== confirmPassword) {
        alert('⚠️ Passwords do not match!');
        return;
      }
      
      if (!document.getElementById('agreeSignupTerms').checked) {
        alert('⚠️ Please agree to the terms');
        return;
      }
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      submitBtn.disabled = true;
      
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await user.updateProfile({ displayName: fullName });
        
        await db.collection('users').doc(user.uid).set({
          fullName, email, phone, city,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          userType: 'customer'
        });
        
        alert('✅ Account created successfully!');
        closeModal('authSection');
        signupForm.reset();
      } catch (error) {
        console.error('Signup error:', error);
        let msg = 'Signup failed. ';
        if (error.code === 'auth/email-already-in-use') msg += 'Email already registered.';
        else msg += error.message;
        alert('❌ ' + msg);
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    });
  }
}

// Make functions globally available
window.initializeFirebaseHandlers = initializeFirebaseHandlers;
window.updateNavbarForLoggedInUser = updateNavbarForLoggedInUser;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFirebaseHandlers);
} else {
  // DOM is already loaded
  initializeFirebaseHandlers();
}

console.log('🔥 Firebase authentication module loaded!');
