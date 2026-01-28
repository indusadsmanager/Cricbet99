// Show tab
function showTab(tab) {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const tabs = document.querySelectorAll('.premium-tab');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginSection.classList.add('active');
        registerSection.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
        tabs[1].classList.add('active');
    }
}

// Tab switching
function switchTab(tab) {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));

    if (tab === 'login') {
        loginSection.classList.add('active');
        registerSection.classList.remove('active');
        tabBtns[0].classList.add('active');
    } else {
        loginSection.classList.remove('active');
        registerSection.classList.add('active');
        tabBtns[1].classList.add('active');
    }
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check admin login
    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('admin', 'true');
        alert('Admin login successful!');
        window.location.href = 'admin.html';
        return;
    }
    
    // Check user login
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        sessionStorage.setItem('user', 'true');
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        }
        
        alert('Login successful!');
        window.location.href = 'casino.html';
    } else {
        showError('loginError', 'Invalid credentials. Please try again.');
    }
}

// Handle registration
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showError('registerError', 'Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showError('registerError', 'Password must be at least 6 characters!');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showError('registerError', 'Username already exists!');
        return;
    }
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showError('registerError', 'Email already registered!');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        email,
        phone,
        password,
        balance: 0,
        status: 'active',
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Also add to registrations for admin approval
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(newUser);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    alert('Registration successful! Please login.');
    showTab('login');
    
    // Clear form
    document.getElementById('registerForm').reset();
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorElement.style.display = 'block';
    
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 3000);
}

// Show forgot password
function showForgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);
        
        if (user) {
            alert(`Your password is: ${user.password}`);
        } else {
            alert('Email not found!');
        }
    }
}

// Show admin login
function showAdminLogin() {
    const username = prompt('Enter admin username:');
    const password = prompt('Enter admin password:');
    
    if (username === 'admin' && password === 'admin123') {
        sessionStorage.setItem('admin', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid admin credentials!');
    }
}

// Get new ID via WhatsApp
function getNewIdViaWhatsApp() {
    const whatsappNumber = localStorage.getItem('whatsappNumber') || '919876543210';
    const message = 'Hello, I want to get a new gaming ID for Ravan365 Casino.';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Check remembered user
function checkRememberedUser() {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('rememberMe').checked = true;
        document.getElementById('loginUsername').value = rememberedUser;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    checkRememberedUser();
    
    // Add Enter key support for login
    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLogin(e);
        }
    });
});
