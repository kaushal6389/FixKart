// ===== MODAL & UI MANAGEMENT =====
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-section')) {
    e.target.style.display = 'none';
    e.target.classList.remove('active');
  }
});

// ===== NAVIGATION =====
function showHome() {
  // Close all modals
  const modals = document.querySelectorAll('.modal-section');
  modals.forEach(modal => {
    modal.style.display = 'none';
    modal.classList.remove('active');
  });
  
  // Show hero section
  const sections = document.querySelectorAll('section:not(.modal-section)');
  sections.forEach(section => section.style.display = 'none');
  
  const heroSection = document.getElementById('heroSection');
  if (heroSection) {
    heroSection.style.display = 'block';
  }
  
  window.scrollTo(0, 0);
}

function scrollToFeatures() {
  // Close any open modals first
  const modals = document.querySelectorAll('.modal-section');
  modals.forEach(modal => {
    modal.style.display = 'none';
    modal.classList.remove('active');
  });
  
  // Show main sections
  const heroSection = document.getElementById('heroSection');
  const featuresSection = document.getElementById('featuresSection');
  
  if (heroSection) heroSection.style.display = 'block';
  if (featuresSection) {
    featuresSection.style.display = 'block';
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function scrollToHowItWorks() {
  // Close any open modals first
  const modals = document.querySelectorAll('.modal-section');
  modals.forEach(modal => {
    modal.style.display = 'none';
    modal.classList.remove('active');
  });
  
  // Show main sections
  const heroSection = document.getElementById('heroSection');
  const featuresSection = document.getElementById('featuresSection');
  
  if (heroSection) heroSection.style.display = 'block';
  if (featuresSection) {
    featuresSection.style.display = 'block';
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function showExperts() {
  showModal('expertsSection');
  loadExperts();
}

function showPostRequest() {
  showModal('postRequestSection');
}

// ===== FORM HANDLERS =====
document.addEventListener('DOMContentLoaded', () => {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      
      // Validation
      if (!username || username.length < 3) {
        alert('⚠️ Username must be at least 3 characters long');
        return;
      }
      
      if (!password || password.length < 6) {
        alert('⚠️ Password must be at least 6 characters long');
        return;
      }
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Logging in...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
          // Store user session
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          
          // Update UI
          updateNavbarForLoggedInUser(data.user);
          
          alert(`✅ Welcome back, ${data.user.username}!`);
          closeModal('loginSection');
          loginForm.reset();
        } else {
          alert('❌ ' + (data.message || 'Login failed. Please check your credentials.'));
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('❌ Network error. Please check your connection and try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Request form
  const requestForm = document.getElementById('requestForm');
  console.log('Request form element:', requestForm);
  if (requestForm) {
    console.log('Request form event listener added');
    requestForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      console.log('Request form submitted');
      
      const serviceTypeEl = document.getElementById('serviceType');
      const descriptionEl = document.getElementById('projectDescription');
      const locationEl = document.getElementById('userLocation');
      const emailEl = document.getElementById('userEmail');
      const budgetEl = document.getElementById('userBudget');
      
      console.log('Elements found:', {
        serviceType: serviceTypeEl,
        description: descriptionEl,
        location: locationEl,
        email: emailEl,
        budget: budgetEl
      });
      
      if (!serviceTypeEl || !descriptionEl || !locationEl || !emailEl) {
        alert('⚠️ Form elements not found. Please try again.');
        return;
      }
      
      const serviceType = serviceTypeEl.value;
      const description = descriptionEl.value.trim();
      const location = locationEl.value.trim();
      const email = emailEl.value.trim();
      
      console.log('Form values:', { serviceType, description, location, email });
      
      // Validation
      if (!serviceType) {
        alert('⚠️ Please select a service type');
        return;
      }
      
      if (!description || description.length < 20) {
        alert('⚠️ Please provide a detailed description (minimum 20 characters)');
        return;
      }
      
      if (!location) {
        alert('⚠️ Please provide your location');
        return;
      }
      
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('⚠️ Please provide a valid email address');
        return;
      }
      
      const requestData = {
        title: serviceType + ' Service Required',
        category: serviceType,
        description: description,
        location: location,
        budget: budgetEl?.value || 'Not specified',
        email: email
      };
      
      console.log('Request data:', requestData);
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
      submitBtn.disabled = true;
      
      try {
        console.log('Sending request to /api/requests');
        const response = await fetch('/api/requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (response.ok && data.success) {
          alert(`✅ Request Posted Successfully!\n\nRequest ID: ${data.request?.id || 'Pending'}\n\nExperts will start sending quotes shortly. Check your email for updates.`);
          closeModal('postRequestSection');
          requestForm.reset();
        } else {
          alert('❌ ' + (data.message || 'Failed to post request. Please try again.'));
        }
      } catch (error) {
        console.error('Request error:', error);
        alert('❌ Network error: ' + error.message + '\n\nPlease check your connection and try again.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Expert signup form
  const expertForm = document.getElementById('expertSignupForm');
  if (expertForm) {
    expertForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('emailAddress').value.trim();
      const phone = document.getElementById('phoneNumber').value.trim();
      const city = document.getElementById('cityLocation').value.trim();
      const category = document.getElementById('serviceCategory').value;
      const experience = document.getElementById('experienceLevel').value;
      const rate = document.getElementById('hourlyRate').value;
      const bio = document.getElementById('expertDescription').value.trim();
      
      // Validation
      if (!fullName || fullName.length < 3) {
        alert('⚠️ Please provide your full name');
        return;
      }
      
      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        alert('⚠️ Please provide a valid email address');
        return;
      }
      
      if (!phone || !phone.match(/^\d{10}$/)) {
        alert('⚠️ Please provide a valid 10-digit phone number');
        return;
      }
      
      if (!city) {
        alert('⚠️ Please provide your city');
        return;
      }
      
      if (!category) {
        alert('⚠️ Please select a service category');
        return;
      }
      
      if (!experience) {
        alert('⚠️ Please select your experience level');
        return;
      }
      
      if (!rate || rate < 100) {
        alert('⚠️ Please provide a valid hourly rate (minimum ₹100)');
        return;
      }
      
      if (!bio || bio.length < 50) {
        alert('⚠️ Please provide a detailed description of your work (minimum 50 characters)');
        return;
      }
      
      if (!document.getElementById('agreeTerms').checked) {
        alert('⚠️ Please agree to the terms and conditions');
        return;
      }
      
      const expertData = {
        name: fullName,
        category: category,
        experience: experience,
        email: email,
        phone: phone,
        city: city,
        rate: rate,
        bio: bio
      };
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting Application...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('/api/experts/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expertData)
        });
        const data = await response.json();
        if (response.ok) {
          alert('✅ Expert Application Submitted!\n\nYour profile is under review. We\'ll contact you within 24-48 hours.');
          closeModal('joinExpertSection');
          expertForm.reset();
        } else {
          alert('❌ ' + (data.message || 'Failed to create profile. Please try again.'));
        }
      } catch (error) {
        console.error('Expert error:', error);
        alert('❌ Network error. Please check your connection and try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      
      if (password !== confirmPassword) {
        alert('⚠️ Passwords do not match!');
        return;
      }
      
      if (password.length < 6) {
        alert('⚠️ Password must be at least 6 characters long');
        return;
      }
      
      const userData = {
        fullName: document.getElementById('signupFullName').value.trim(),
        username: document.getElementById('signupUsername').value.trim(),
        email: document.getElementById('signupEmail').value.trim(),
        phone: document.getElementById('signupPhone').value.trim(),
        password: password,
        city: document.getElementById('signupCity').value.trim()
      };
      
      const submitBtn = e.target.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Creating Account...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (response.ok) {
          alert('✅ Account created successfully! Please login.');
          closeModal('signupSection');
          showModal('loginSection');
          signupForm.reset();
        } else {
          alert('❌ ' + (data.message || 'Signup failed. Please try again.'));
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('❌ Error creating account. Please try again.');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Load experts
  loadExperts();
  
  // Check if user is already logged in
  checkUserSession();

  // Initialize Firebase handlers if Firebase is loaded
  if (typeof initializeFirebaseHandlers === 'function') {
    initializeFirebaseHandlers();
  }

  // Button event listeners - Auth/Expert
  const authBtn = document.getElementById('authBtn');
  if (authBtn) authBtn.addEventListener('click', () => showModal('authSection'));

  const joinExpertBtn = document.getElementById('joinExpertBtn');
  if (joinExpertBtn) joinExpertBtn.addEventListener('click', () => showModal('joinExpertSection'));

  // Profile dropdown toggle
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      profileMenu.classList.remove('show');
    });
  }

  // Logo click to go home
  const logo = document.querySelector('.logo');
  if (logo) logo.addEventListener('click', showHome);

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
  }
});

// Store all experts globally for filtering
let allExperts = [];
let currentFilter = 'all';

// ===== LOAD EXPERTS =====
async function loadExperts() {
  try {
    const response = await fetch('/api/experts');
    const experts = await response.json();
    allExperts = experts;
    displayExperts(experts);
  } catch (error) {
    console.error('Error loading experts:', error);
    const container = document.getElementById('expertsContainer');
    if (container) {
      container.innerHTML = '<div class="error-message">Failed to load experts. Please try again.</div>';
    }
  }
}

// ===== DISPLAY EXPERTS =====
function displayExperts(experts) {
  const expertsContainer = document.getElementById('expertsContainer');
  if (!expertsContainer) return;
  
  if (experts.length === 0) {
    expertsContainer.innerHTML = '<div class="no-results">No experts found for this category.</div>';
    return;
  }
  
  expertsContainer.innerHTML = '';
  experts.forEach(expert => {
    const expertCard = document.createElement('div');
    expertCard.className = 'expert-card';
    expertCard.innerHTML = `
      <div class="expert-header">
        <div class="expert-avatar">${expert.name.charAt(0)}</div>
        <div class="expert-info">
          <h3>${expert.name}</h3>
          <p class="expert-category">${expert.category}</p>
          <p class="expert-location">📍 ${expert.city}</p>
        </div>
      </div>
      <div class="expert-stats">
        <span class="rating">⭐ ${expert.rating}</span>
        <span class="rate">${expert.rate}</span>
      </div>
      <button class="btn-primary" onclick="hireExpert(${expert.id}, '${expert.name}')">Hire Now</button>
    `;
    expertsContainer.appendChild(expertCard);
  });
}

// ===== FILTER EXPERTS =====
function filterExperts(category, event) {
  currentFilter = category;
  
  // Update active filter button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  if (event && event.target) {
    event.target.classList.add('active');
  } else {
    // Find and activate the correct button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      if (btn.textContent.toLowerCase() === category.toLowerCase() || 
          (category === 'all' && btn.textContent.toLowerCase() === 'all')) {
        btn.classList.add('active');
      }
    });
  }
  
  // Filter experts
  if (category === 'all') {
    displayExperts(allExperts);
  } else {
    const filtered = allExperts.filter(expert => expert.category === category);
    displayExperts(filtered);
  }
}

// ===== HIRE EXPERT =====
function hireExpert(expertId, expertName) {
  // Show hire modal
  const modal = document.createElement('div');
  modal.className = 'modal-section active';
  modal.id = 'hireModal';
  modal.style.display = 'flex';
  modal.innerHTML = `
    <button class="close-modal" onclick="closeHireModal()">✕</button>
    <div class="modal-header">
      <h2>Hire ${expertName}</h2>
      <p>Complete the details to hire this expert</p>
    </div>
    <form id="hireForm" class="hire-form">
      <div class="form-group">
        <label>Your Name *</label>
        <input type="text" id="hireName" required>
      </div>
      <div class="form-group">
        <label>Phone Number *</label>
        <input type="tel" id="hirePhone" required>
      </div>
      <div class="form-group">
        <label>Service Location *</label>
        <input type="text" id="hireLocation" placeholder="City, Area" required>
      </div>
      <div class="form-group">
        <label>Service Requirements</label>
        <textarea id="hireRequirement" rows="4" placeholder="Describe what you need..."></textarea>
      </div>
      <div class="form-group">
        <label>Preferred Date</label>
        <input type="date" id="hireDate" min="${new Date().toISOString().split('T')[0]}">
      </div>
      <button type="submit" class="btn-primary btn-large">Confirm Booking</button>
    </form>
  `;
  
  document.body.appendChild(modal);
  
  // Handle hire form submission
  document.getElementById('hireForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const hireData = {
      expert: expertName,
      expertId: expertId,
      name: document.getElementById('hireName').value,
      phone: document.getElementById('hirePhone').value,
      location: document.getElementById('hireLocation').value,
      requirement: document.getElementById('hireRequirement').value,
      date: document.getElementById('hireDate').value
    };
    
    try {
      const response = await fetch('/api/hires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hireData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert(`✅ Booking Confirmed!\n\nExpert: ${expertName}\nBooking ID: ${data.id}\n\nThe expert will contact you shortly.`);
        closeHireModal();
      } else {
        alert('Failed to book. Please try again.');
      }
    } catch (error) {
      console.error('Hire error:', error);
      alert('Error booking expert. Please try again.');
    }
  });
}

function closeHireModal() {
  const modal = document.getElementById('hireModal');
  if (modal) {
    modal.remove();
  }
}

// ===== VIEW MY REQUESTS =====
async function showMyRequests() {
  try {
    const response = await fetch('/api/requests');
    const requests = await response.json();
    
    const modal = document.createElement('div');
    modal.className = 'modal-section active';
    modal.id = 'myRequestsModal';
    modal.style.display = 'flex';
    
    let requestsHTML = '';
    if (requests.length === 0) {
      requestsHTML = '<div class="no-results">No requests found. Post a service request to get started!</div>';
    } else {
      requestsHTML = requests.map(req => `
        <div class="request-card">
          <div class="request-header">
            <h3>${req.title || req.category + ' Service'}</h3>
            <span class="status-badge status-${req.status}">${req.status || 'pending'}</span>
          </div>
          <p class="request-description">${req.description}</p>
          <div class="request-meta">
            <span>📍 ${req.location}</span>
            <span>📅 ${new Date(req.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      `).join('');
    }
    
    modal.innerHTML = `
      <button class="close-modal" onclick="closeMyRequestsModal()">✕</button>
      <div class="modal-header">
        <h2>My Service Requests</h2>
        <p>Track your posted service requests</p>
      </div>
      <div class="requests-container">
        ${requestsHTML}
      </div>
      <button class="btn-primary" onclick="closeMyRequestsModal(); showPostRequest();">Post New Request</button>
    `;
    
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error loading requests:', error);
    alert('Failed to load requests. Please try again.');
  }
}

function closeMyRequestsModal() {
  const modal = document.getElementById('myRequestsModal');
  if (modal) {
    modal.remove();
  }
}

// ===== VIEW MY HIRES =====
async function showMyHires() {
  try {
    const response = await fetch('/api/hires');
    const hires = await response.json();
    
    const modal = document.createElement('div');
    modal.className = 'modal-section active';
    modal.id = 'myHiresModal';
    modal.style.display = 'flex';
    
    let hiresHTML = '';
    if (hires.length === 0) {
      hiresHTML = '<div class="no-results">No bookings yet. Hire an expert to get started!</div>';
    } else {
      hiresHTML = hires.map(hire => `
        <div class="hire-card">
          <div class="hire-header">
            <h3>Hired: ${hire.expert}</h3>
            <span class="hire-id">ID: ${hire.id}</span>
          </div>
          <div class="hire-details">
            <p><strong>Customer:</strong> ${hire.name}</p>
            <p><strong>Phone:</strong> ${hire.phone}</p>
            <p><strong>Location:</strong> ${hire.location}</p>
            <p><strong>Requirements:</strong> ${hire.requirement || 'Not specified'}</p>
            <p><strong>Booked:</strong> ${new Date(hire.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      `).join('');
    }
    
    modal.innerHTML = `
      <button class="close-modal" onclick="closeMyHiresModal()">✕</button>
      <div class="modal-header">
        <h2>My Bookings</h2>
        <p>View your hired experts</p>
      </div>
      <div class="hires-container">
        ${hiresHTML}
      </div>
      <button class="btn-primary" onclick="closeMyHiresModal(); showExperts();">Find More Experts</button>
    `;
    
    document.body.appendChild(modal);
  } catch (error) {
    console.error('Error loading hires:', error);
    alert('Failed to load bookings. Please try again.');
  }
}

function closeMyHiresModal() {
  const modal = document.getElementById('myHiresModal');
  if (modal) {
    modal.remove();
  }
}

// ===== USER SESSION MANAGEMENT =====
function checkUserSession() {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      updateNavbarForLoggedInUser(user);
    } catch (e) {
      console.error('Error parsing user session:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
}

function updateNavbarForLoggedInUser(user) {
  const navButtons = document.getElementById('navButtons');
  const userProfile = document.getElementById('userProfile');
  const profileName = document.getElementById('profileName');
  const userEmail = document.getElementById('userEmail');
  
  if (navButtons && userProfile && profileName) {
    // Hide login/signup buttons
    navButtons.style.display = 'none';
    
    // Show user profile
    userProfile.style.display = 'flex';
    profileName.textContent = user.fullName || user.username;
    
    if (userEmail && user.email) {
      userEmail.textContent = user.email;
    }
  }
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    // Clear session
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Reset navbar
    const navButtons = document.getElementById('navButtons');
    const userProfile = document.getElementById('userProfile');
    
    if (navButtons && userProfile) {
      navButtons.style.display = 'flex';
      userProfile.style.display = 'none';
    }
    
    // Go to home
    showHome();
    alert('Logged out successfully!');
  }
}
