// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardStats();
    loadRegistrations();
    loadUsers();
    loadDeposits();
    loadWithdrawals();
    loadGames();
    loadPaymentSettings();
    loadSettings();
    updateNotificationCount();
});

// Sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav item
    event.currentTarget.classList.add('active');
    
    // Close sidebar on mobile
    if (window.innerWidth <= 1024) {
        toggleSidebar();
    }
}

// Load dashboard stats
function loadDashboardStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    
    // Calculate total balance
    const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0);
    
    // Calculate pending deposits
    const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
    
    // Calculate pending withdrawals
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
    
    // Update UI
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalBalance').textContent = `₹${totalBalance.toLocaleString()}`;
    document.getElementById('pendingDeposits').textContent = pendingDeposits;
    document.getElementById('pendingWithdrawals').textContent = pendingWithdrawals;
    
    // Load recent activity
    loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    // Combine all activities
    const activities = [
        ...deposits.map(d => ({ ...d, type: 'deposit' })),
        ...withdrawals.map(w => ({ ...w, type: 'withdrawal' })),
        ...registrations.map(r => ({ ...r, type: 'registration' }))
    ];
    
    // Sort by date (newest first) and take last 10
    activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentActivities = activities.slice(0, 10);
    
    const activityContainer = document.getElementById('recentActivity');
    
    if (recentActivities.length === 0) {
        activityContainer.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No recent activity</p>';
        return;
    }
    
    activityContainer.innerHTML = recentActivities.map(activity => {
        const date = new Date(activity.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        let icon, text, color;
        
        if (activity.type === 'deposit') {
            icon = 'fa-arrow-down';
            text = `Deposit of ₹${activity.amount} by ${activity.username}`;
            color = '#10b981';
        } else if (activity.type === 'withdrawal') {
            icon = 'fa-arrow-up';
            text = `Withdrawal of ₹${activity.amount} by ${activity.username}`;
            color = '#ef4444';
        } else {
            icon = 'fa-user-plus';
            text = `New registration: ${activity.username}`;
            color = '#00d9ff';
        }
        
        return `
            <div style="display: flex; align-items: center; gap: 15px; padding: 12px; border-bottom: 1px solid #24306a;">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${color}20; display: flex; justify-content: center; align-items: center;">
                    <i class="fas ${icon}" style="color: ${color};"></i>
                </div>
                <div style="flex: 1;">
                    <p style="font-size: 14px; margin-bottom: 3px;">${text}</p>
                    <p style="font-size: 12px; color: #94a3b8;">${date}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Load registrations
function loadRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const tableBody = document.getElementById('registrationsTable');
    
    if (registrations.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8;">No new registrations</td></tr>';
        return;
    }
    
    tableBody.innerHTML = registrations.map(reg => {
        const date = new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        return `
            <tr>
                <td>${reg.username}</td>
                <td>${reg.email || 'N/A'}</td>
                <td>${reg.phone || 'N/A'}</td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="approveRegistration(${reg.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="rejectRegistration(${reg.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Approve registration
function approveRegistration(id) {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const regIndex = registrations.findIndex(r => r.id === id);
    
    if (regIndex !== -1) {
        // User is already in users array from registration
        alert('User approved successfully!');
        
        // Remove from registrations
        registrations.splice(regIndex, 1);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        loadRegistrations();
        loadDashboardStats();
    }
}

// Reject registration
function rejectRegistration(id) {
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const regIndex = registrations.findIndex(r => r.id === id);
    
    if (regIndex !== -1) {
        // Remove from users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === id);
        
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Remove from registrations
        registrations.splice(regIndex, 1);
        localStorage.setItem('registrations', JSON.stringify(registrations));
        
        alert('Registration rejected successfully!');
        loadRegistrations();
        loadDashboardStats();
    }
}

// Clear registrations
function clearRegistrations() {
    if (confirm('Are you sure you want to clear all registrations?')) {
        localStorage.setItem('registrations', JSON.stringify([]));
        loadRegistrations();
        loadDashboardStats();
    }
}

// Filter registrations
function filterRegistrations() {
    const searchTerm = document.getElementById('searchRegistrations').value.toLowerCase();
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    const filtered = registrations.filter(reg => 
        reg.username.toLowerCase().includes(searchTerm) ||
        (reg.email && reg.email.toLowerCase().includes(searchTerm)) ||
        (reg.phone && reg.phone.includes(searchTerm))
    );
    
    const tableBody = document.getElementById('registrationsTable');
    
    if (filtered.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #94a3b8;">No registrations found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = filtered.map(reg => {
        const date = new Date(reg.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        return `
            <tr>
                <td>${reg.username}</td>
                <td>${reg.email || 'N/A'}</td>
                <td>${reg.phone || 'N/A'}</td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="approveRegistration(${reg.id})">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="rejectRegistration(${reg.id})">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load users
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const tableBody = document.getElementById('usersTable');
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">No users found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = users.map(user => {
        return `
            <tr>
                <td>${user.username}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>₹${user.balance || 0}</td>
                <td><span class="status-badge ${user.status || 'active'}">${user.status || 'active'}</span></td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn ${user.status === 'banned' ? 'btn-success' : 'btn-danger'}" style="padding: 6px 12px; font-size: 11px;" onclick="toggleUserStatus(${user.id})">
                        <i class="fas ${user.status === 'banned' ? 'fa-unlock' : 'fa-ban'}"></i> ${user.status === 'banned' ? 'Unban' : 'Ban'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Edit user
function editUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === id);
    
    if (user) {
        const newBalance = prompt(`Current balance: ₹${user.balance}\nEnter new balance:`, user.balance);
        
        if (newBalance !== null) {
            user.balance = parseFloat(newBalance) || 0;
            
            const userIndex = users.findIndex(u => u.id === id);
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('User balance updated successfully!');
            loadUsers();
            loadDashboardStats();
        }
    }
}

// Toggle user status
function toggleUserStatus(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex !== -1) {
        users[userIndex].status = users[userIndex].status === 'banned' ? 'active' : 'banned';
        localStorage.setItem('users', JSON.stringify(users));
        
        alert(`User ${users[userIndex].status === 'banned' ? 'banned' : 'unbanned'} successfully!`);
        loadUsers();
    }
}

// Filter users
function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const statusFilter = document.getElementById('userStatusFilter').value;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (searchTerm) {
        users = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm) ||
            (user.email && user.email.toLowerCase().includes(searchTerm)) ||
            (user.phone && user.phone.includes(searchTerm))
        );
    }
    
    if (statusFilter !== 'all') {
        users = users.filter(user => user.status === statusFilter);
    }
    
    const tableBody = document.getElementById('usersTable');
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #94a3b8;">No users found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = users.map(user => {
        return `
            <tr>
                <td>${user.username}</td>
                <td>${user.email || 'N/A'}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>₹${user.balance || 0}</td>
                <td><span class="status-badge ${user.status || 'active'}">${user.status || 'active'}</span></td>
                <td>
                    <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn ${user.status === 'banned' ? 'btn-success' : 'btn-danger'}" style="padding: 6px 12px; font-size: 11px;" onclick="toggleUserStatus(${user.id})">
                        <i class="fas ${user.status === 'banned' ? 'fa-unlock' : 'fa-ban'}"></i> ${user.status === 'banned' ? 'Unban' : 'Ban'}
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load deposits
function loadDeposits() {
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    const tableBody = document.getElementById('depositsTable');
    
    if (deposits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #94a3b8;">No deposits found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = deposits.map(deposit => {
        const date = new Date(deposit.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        let detailsText = deposit.details;
        
        if (typeof deposit.details === 'object') {
            detailsText = Object.values(deposit.details).join(', ');
        }
        
        return `
            <tr>
                <td>#${deposit.id.toString().slice(-6)}</td>
                <td>${deposit.username}</td>
                <td>${deposit.method}</td>
                <td>₹${deposit.amount}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${detailsText}</td>
                <td><span class="status-badge ${deposit.status}">${deposit.status}</span></td>
                <td>
                    ${deposit.status === 'pending' ? `
                        <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="approveDeposit(${deposit.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="rejectDeposit(${deposit.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
}

// Approve deposit
function approveDeposit(id) {
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    const depositIndex = deposits.findIndex(d => d.id === id);
    
    if (depositIndex !== -1) {
        const deposit = deposits[depositIndex];
        deposit.status = 'completed';
        deposits[depositIndex] = deposit;
        localStorage.setItem('deposits', JSON.stringify(deposits));
        
        // Update user balance
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === deposit.userId);
        
        if (userIndex !== -1) {
            users[userIndex].balance = (users[userIndex].balance || 0) + deposit.amount;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('Deposit approved successfully!');
        loadDeposits();
        loadDashboardStats();
    }
}

// Reject deposit
function rejectDeposit(id) {
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    const depositIndex = deposits.findIndex(d => d.id === id);
    
    if (depositIndex !== -1) {
        deposits[depositIndex].status = 'rejected';
        localStorage.setItem('deposits', JSON.stringify(deposits));
        
        alert('Deposit rejected successfully!');
        loadDeposits();
    }
}

// Filter deposits
function filterDeposits() {
    const searchTerm = document.getElementById('searchDeposits').value.toLowerCase();
    const statusFilter = document.getElementById('depositStatusFilter').value;
    
    let deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    
    if (searchTerm) {
        deposits = deposits.filter(deposit => 
            deposit.username.toLowerCase().includes(searchTerm) ||
            deposit.method.toLowerCase().includes(searchTerm) ||
            deposit.transactionId.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        deposits = deposits.filter(deposit => deposit.status === statusFilter);
    }
    
    const tableBody = document.getElementById('depositsTable');
    
    if (deposits.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #94a3b8;">No deposits found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = deposits.map(deposit => {
        const date = new Date(deposit.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        let detailsText = deposit.details;
        
        if (typeof deposit.details === 'object') {
            detailsText = Object.values(deposit.details).join(', ');
        }
        
        return `
            <tr>
                <td>#${deposit.id.toString().slice(-6)}</td>
                <td>${deposit.username}</td>
                <td>${deposit.method}</td>
                <td>₹${deposit.amount}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${detailsText}</td>
                <td><span class="status-badge ${deposit.status}">${deposit.status}</span></td>
                <td>
                    ${deposit.status === 'pending' ? `
                        <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="approveDeposit(${deposit.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="rejectDeposit(${deposit.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
}

// Load withdrawals
function loadWithdrawals() {
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const tableBody = document.getElementById('withdrawalsTable');
    
    if (withdrawals.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #94a3b8;">No withdrawals found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = withdrawals.map(withdrawal => {
        const date = new Date(withdrawal.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        let detailsText = withdrawal.details;
        
        if (typeof withdrawal.details === 'object') {
            detailsText = Object.values(withdrawal.details).join(', ');
        }
        
        return `
            <tr>
                <td>#${withdrawal.id.toString().slice(-6)}</td>
                <td>${withdrawal.username}</td>
                <td>${withdrawal.method}</td>
                <td>₹${withdrawal.amount}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${detailsText}</td>
                <td><span class="status-badge ${withdrawal.status}">${withdrawal.status}</span></td>
                <td>
                    ${withdrawal.status === 'pending' ? `
                        <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="approveWithdrawal(${withdrawal.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="rejectWithdrawal(${withdrawal.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
}

// Approve withdrawal
function approveWithdrawal(id) {
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const withdrawalIndex = withdrawals.findIndex(w => w.id === id);
    
    if (withdrawalIndex !== -1) {
        const withdrawal = withdrawals[withdrawalIndex];
        withdrawal.status = 'completed';
        withdrawals[withdrawalIndex] = withdrawal;
        localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
        
        // Deduct from user balance
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.id === withdrawal.userId);
        
        if (userIndex !== -1) {
            users[userIndex].balance = (users[userIndex].balance || 0) - withdrawal.amount;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('Withdrawal approved successfully!');
        loadWithdrawals();
        loadDashboardStats();
    }
}

// Reject withdrawal
function rejectWithdrawal(id) {
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const withdrawalIndex = withdrawals.findIndex(w => w.id === id);
    
    if (withdrawalIndex !== -1) {
        withdrawals[withdrawalIndex].status = 'rejected';
        localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
        
        alert('Withdrawal rejected successfully!');
        loadWithdrawals();
    }
}

// Filter withdrawals
function filterWithdrawals() {
    const searchTerm = document.getElementById('searchWithdrawals').value.toLowerCase();
    const statusFilter = document.getElementById('withdrawalStatusFilter').value;
    
    let withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    
    if (searchTerm) {
        withdrawals = withdrawals.filter(withdrawal => 
            withdrawal.username.toLowerCase().includes(searchTerm) ||
            withdrawal.method.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter !== 'all') {
        withdrawals = withdrawals.filter(withdrawal => withdrawal.status === statusFilter);
    }
    
    const tableBody = document.getElementById('withdrawalsTable');
    
    if (withdrawals.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #94a3b8;">No withdrawals found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = withdrawals.map(withdrawal => {
        const date = new Date(withdrawal.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        let detailsText = withdrawal.details;
        
        if (typeof withdrawal.details === 'object') {
            detailsText = Object.values(withdrawal.details).join(', ');
        }
        
        return `
            <tr>
                <td>#${withdrawal.id.toString().slice(-6)}</td>
                <td>${withdrawal.username}</td>
                <td>${withdrawal.method}</td>
                <td>₹${withdrawal.amount}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${detailsText}</td>
                <td><span class="status-badge ${withdrawal.status}">${withdrawal.status}</span></td>
                <td>
                    ${withdrawal.status === 'pending' ? `
                        <button class="btn btn-success" style="padding: 6px 12px; font-size: 11px;" onclick="approveWithdrawal(${withdrawal.id})">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-danger" style="padding: 6px 12px; font-size: 11px;" onclick="rejectWithdrawal(${withdrawal.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : '-'}
                </td>
            </tr>
        `;
    }).join('');
}

// Load games
function loadGames() {
    const games = [
        { id: 1, name: 'Dragon Tiger', category: 'Live Casino', provider: 'Evolution', minBet: 100, maxBet: 50000, winRatio: 95, status: 'active' },
        { id: 2, name: 'Roulette', category: 'Table Games', provider: 'Evolution', minBet: 50, maxBet: 100000, winRatio: 97, status: 'active' },
        { id: 3, name: 'Blackjack', category: 'Table Games', provider: 'Pragmatic', minBet: 100, maxBet: 75000, winRatio: 99, status: 'active' },
        { id: 4, name: 'Sweet Bonanza', category: 'Slots', provider: 'Pragmatic', minBet: 10, maxBet: 25000, winRatio: 96, status: 'active' },
        { id: 5, name: 'Andar Bahar', category: 'Live Casino', provider: 'Evolution', minBet: 50, maxBet: 100000, winRatio: 95, status: 'active' },
        { id: 6, name: 'Baccarat', category: 'Table Games', provider: 'Evolution', minBet: 100, maxBet: 50000, winRatio: 98, status: 'active' },
        { id: 7, name: 'Starlight Princess', category: 'Slots', provider: 'Pragmatic', minBet: 10, maxBet: 20000, winRatio: 95, status: 'active' },
        { id: 8, name: 'Cricket Betting', category: 'Sports', provider: 'Sportsbook', minBet: 100, maxBet: 200000, winRatio: 92, status: 'active' },
        { id: 9, name: 'Football Betting', category: 'Sports', provider: 'Sportsbook', minBet: 100, maxBet: 150000, winRatio: 93, status: 'active' },
        { id: 10, name: 'Teen Patti', category: 'Live Casino', provider: 'Evolution', minBet: 50, maxBet: 100000, winRatio: 95, status: 'active' }
    ];
    
    const tableBody = document.getElementById('gamesTable');
    
    tableBody.innerHTML = games.map(game => `
        <tr>
            <td>${game.name}</td>
            <td>${game.category}</td>
            <td>${game.provider}</td>
            <td>₹${game.minBet}</td>
            <td>₹${game.maxBet}</td>
            <td>
                <div class="win-ratio-container">
                    <div class="win-ratio-header">
                        <span class="win-ratio-value">${game.winRatio}%</span>
                        <i class="fas fa-sliders-h" style="color: #94a3b8; cursor: pointer;"></i>
                    </div>
                    <input type="range" min="0" max="100" value="${game.winRatio}" onchange="updateWinRatio(${game.id}, this.value)">
                </div>
            </td>
            <td><span class="status-badge ${game.status}">${game.status}</span></td>
            <td>
                <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="editGame(${game.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn ${game.status === 'active' ? 'btn-danger' : 'btn-success'}" style="padding: 6px 12px; font-size: 11px;" onclick="toggleGameStatus(${game.id})">
                    <i class="fas ${game.status === 'active' ? 'fa-pause' : 'fa-play'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update win ratio
function updateWinRatio(gameId, value) {
    alert(`Win ratio for game ${gameId} updated to ${value}%`);
}

// Edit game
function editGame(id) {
    alert(`Edit game ${id} - This feature would open a modal to edit game details`);
}

// Toggle game status
function toggleGameStatus(id) {
    alert(`Toggle status for game ${id} - This feature would activate/deactivate the game`);
}

// Load payment settings
function loadPaymentSettings() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    
    document.getElementById('upiQrUrl').value = settings.upiQrUrl || '';
    document.getElementById('upiId').value = settings.upiId || '';
    document.getElementById('upiEnabled').checked = settings.upiEnabled !== false;
    
    document.getElementById('bankHolderName').value = settings.bankHolderName || '';
    document.getElementById('bankAccountNumber').value = settings.bankAccountNumber || '';
    document.getElementById('bankIfsc').value = settings.bankIfsc || '';
    document.getElementById('bankName').value = settings.bankName || '';
    document.getElementById('bankEnabled').checked = settings.bankEnabled !== false;
    
    document.getElementById('usdtQrUrl').value = settings.usdtQrUrl || '';
    document.getElementById('usdtWalletAddress').value = settings.usdtWalletAddress || '';
    document.getElementById('usdtEnabled').checked = settings.usdtEnabled !== false;
}

// Save payment settings
function savePaymentSettings() {
    const settings = {
        upiQrUrl: document.getElementById('upiQrUrl').value,
        upiId: document.getElementById('upiId').value,
        upiEnabled: document.getElementById('upiEnabled').checked,
        
        bankHolderName: document.getElementById('bankHolderName').value,
        bankAccountNumber: document.getElementById('bankAccountNumber').value,
        bankIfsc: document.getElementById('bankIfsc').value,
        bankName: document.getElementById('bankName').value,
        bankEnabled: document.getElementById('bankEnabled').checked,
        
        usdtQrUrl: document.getElementById('usdtQrUrl').value,
        usdtWalletAddress: document.getElementById('usdtWalletAddress').value,
        usdtEnabled: document.getElementById('usdtEnabled').checked
    };
    
    localStorage.setItem('paymentSettings', JSON.stringify(settings));
    alert('Payment settings saved successfully!');
}

// Load settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('platformSettings') || '{}');
    
    document.getElementById('platformName').value = settings.platformName || 'Ravan365';
    document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    document.getElementById('minDeposit').value = settings.minDeposit || 100;
    document.getElementById('maxWithdraw').value = settings.maxWithdraw || 50000;
    document.getElementById('withdrawalTime').value = settings.withdrawalTime || 24;
}

// Save settings
function saveSettings() {
    const settings = {
        platformName: document.getElementById('platformName').value,
        whatsappNumber: document.getElementById('whatsappNumber').value,
        minDeposit: parseInt(document.getElementById('minDeposit').value),
        maxWithdraw: parseInt(document.getElementById('maxWithdraw').value),
        withdrawalTime: parseInt(document.getElementById('withdrawalTime').value)
    };
    
    localStorage.setItem('platformSettings', JSON.stringify(settings));
    localStorage.setItem('whatsappNumber', settings.whatsappNumber);
    
    alert('Platform settings saved successfully!');
}

// Update notification count
function updateNotificationCount() {
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    
    const count = deposits.filter(d => d.status === 'pending').length +
                  withdrawals.filter(w => w.status === 'pending').length +
                  registrations.length;
    
    document.getElementById('notificationCount').textContent = count;
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}
