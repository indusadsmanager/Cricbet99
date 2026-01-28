// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadGames();
    loadPaymentMethods();
    loadTransactionHistory();
    loadBetHistory();
    loadBankDetails();
    updateBalances();
});

// Load user data
function loadUserData() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    
    if (currentUser.username) {
        document.getElementById('profileUsername').textContent = currentUser.username;
        document.getElementById('profileEmail').textContent = currentUser.email || 'Not provided';
        document.getElementById('profilePhone').textContent = currentUser.phone || 'Not provided';
    }
}

// Update balances
function updateBalances() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser.id) || currentUser;
    
    const balance = user.balance || 0;
    document.getElementById('userBalance').innerHTML = `<i class="fas fa-wallet"></i> ₹${balance}`;
    document.getElementById('profileBalance').textContent = `₹${balance}`;
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav items
    document.querySelectorAll(`[onclick="showSection('${sectionId}')"]`).forEach(item => {
        item.classList.add('active');
    });
    
    // Update data when showing section
    if (sectionId === 'transactions') {
        loadTransactionHistory();
    } else if (sectionId === 'bets') {
        loadBetHistory();
    } else if (sectionId === 'profile') {
        loadUserData();
        loadBankDetails();
    }
}

// Load games
function loadGames() {
    const games = [
        { id: 1, name: 'Dragon Tiger', category: 'live', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=250&fit=crop', provider: 'Evolution' },
        { id: 2, name: 'Roulette', category: 'table', image: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=250&fit=crop', provider: 'Evolution' },
        { id: 3, name: 'Blackjack', category: 'table', image: 'https://images.unsplash.com/photo-1596838132731-3301c3fd4317?w=400&h=250&fit=crop', provider: 'Pragmatic' },
        { id: 4, name: 'Sweet Bonanza', category: 'slots', image: 'https://images.unsplash.com/photo-1605870445919-838d190e8e1b?w=400&h=250&fit=crop', provider: 'https://asset-navigator--tradebycandles.replit.app' },
        { id: 5, name: 'Andar Bahar', category: 'live', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=250&fit=crop', provider: 'Evolution' },
        { id: 6, name: 'Baccarat', category: 'table', image: 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?w=400&h=250&fit=crop', provider: 'Evolution' },
        { id: 7, name: 'Starlight Princess', category: 'slots', image: 'https://images.unsplash.com/photo-1606112210939-2db9e7d93745?w=400&h=250&fit=crop', provider: 'Pragmatic' },
        { id: 8, name: 'Cricket Betting', category: 'sports', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&h=250&fit=crop', provider: 'Sportsbook' },
        { id: 9, name: 'Football Betting', category: 'sports', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=250&fit=crop', provider: 'Sportsbook' },
        { id: 10, name: 'Teen Patti', category: 'live', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=250&fit=crop', provider: 'Evolution' },
        { id: 11, name: 'Gates of Olympus', category: 'slots', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&h=250&fit=crop', provider: 'Pragmatic' },
        { id: 12, name: 'Poker', category: 'table', image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&h=250&fit=crop', provider: 'Evolution' }
    ];
    
    const gamesGrid = document.getElementById('gamesGrid');
    gamesGrid.innerHTML = '';
    
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.name}" class="game-image" </link>="https://asset-navigator--tradebycandles.replit.app=${game.name}'">
            <div class="game-info">
                <h3 class="game-name">${game.name}</h3>
                <p class="game-category">${game.category} • ${game.provider}</p>
            </div>
        `;
        gameCard.onclick = () => openGame(game);
        gamesGrid.appendChild(gameCard);
    });
}

// Filter games
function filterGames(category) {
    const tabs = document.querySelectorAll('.category-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    const gamesGrid = document.getElementById('gamesGrid');
    const gameCards = gamesGrid.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const gameCategory = card.querySelector('.game-category').textContent.toLowerCase();
        if (category === 'all' || gameCategory.includes(category)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Open game
function openGame(game) {
    alert(`Opening ${game.name}...\n\nIn production, this would launch the actual game.`);
}

// Load payment methods
function loadPaymentMethods() {
    const depositMethods = [
        { id: 'upi', name: 'UPI Payment', icon: 'fas fa-qrcode', description: 'Instant transfer via UPI' },
        { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university', description: 'Direct bank transfer' },
        { id: 'usdt', name: 'USDT (TRC20)', icon: 'fab fa-bitcoin', description: 'Cryptocurrency payment' }
    ];
    
    const depositContainer = document.getElementById('depositPaymentMethods');
    depositContainer.innerHTML = '';
    
    depositMethods.forEach(method => {
        const methodCard = document.createElement('div');
        methodCard.className = 'payment-method-card';
        methodCard.innerHTML = `
            <i class="${method.icon}"></i>
            <h4>${method.name}</h4>
            <p>${method.description}</p>
        `;
        methodCard.onclick = () => selectDepositMethod(method.id);
        depositContainer.appendChild(methodCard);
    });
    
    const withdrawMethods = [
        { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university', description: 'Direct bank transfer' },
        { id: 'usdt', name: 'USDT (TRC20)', icon: 'fab fa-bitcoin', description: 'Cryptocurrency withdrawal' }
    ];
    
    const withdrawContainer = document.getElementById('withdrawPaymentMethods');
    withdrawContainer.innerHTML = '';
    
    withdrawMethods.forEach(method => {
        const methodCard = document.createElement('div');
        methodCard.className = 'payment-method-card';
        methodCard.innerHTML = `
            <i class="${method.icon}"></i>
            <h4>${method.name}</h4>
            <p>${method.description}</p>
        `;
        methodCard.onclick = () => selectWithdrawMethod(method.id);
        withdrawContainer.appendChild(methodCard);
    });
}

// Select deposit method
function selectDepositMethod(method) {
    const methodCards = document.querySelectorAll('#depositPaymentMethods .payment-method-card');
    methodCards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    document.getElementById('upiPaymentDetails').classList.remove('active');
    document.getElementById('bankPaymentDetails').classList.remove('active');
    document.getElementById('usdtPaymentDetails').classList.remove('active');
    
    if (method === 'upi') {
        document.getElementById('upiPaymentDetails').classList.add('active');
        loadUpiDetails();
    } else if (method === 'bank') {
        document.getElementById('bankPaymentDetails').classList.add('active');
        loadBankDetails();
    } else if (method === 'usdt') {
        document.getElementById('usdtPaymentDetails').classList.add('active');
        loadUsdtDetails();
    }
}

// Select withdraw method
function selectWithdrawMethod(method) {
    const methodCards = document.querySelectorAll('#withdrawPaymentMethods .payment-method-card');
    methodCards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    document.getElementById('bankWithdrawDetails').classList.remove('active');
    document.getElementById('usdtWithdrawDetails').classList.remove('active');
    
    if (method === 'bank') {
        document.getElementById('bankWithdrawDetails').classList.add('active');
    } else if (method === 'usdt') {
        document.getElementById('usdtWithdrawDetails').classList.add('active');
    }
}

// Load payment details from settings
function loadUpiDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    document.getElementById('upiQrImage').src = settings.upiQrUrl || 'https://via.placeholder.com/200';
    const upiId = settings.upiId || 'example@upi';
    document.getElementById('upiIdDisplay').textContent = upiId;
}

function loadBankDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    document.getElementById('bankHolderNameDisplay').textContent = settings.bankHolderName || 'N/A';
    document.getElementById('bankAccountNumberDisplay').textContent = settings.bankAccountNumber || 'N/A';
    document.getElementById('bankIfscDisplay').textContent = settings.bankIfsc || 'N/A';
    document.getElementById('bankNameDisplay').textContent = settings.bankName || 'N/A';
}

function loadUsdtDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    document.getElementById('usdtQrImage').src = settings.usdtQrUrl || 'https://via.placeholder.com/200';
    document.getElementById('usdtWalletAddressDisplay').textContent = settings.usdtWalletAddress || 'N/A';
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function copyBankDetails() {
    const settings = JSON.parse(localStorage.getItem('paymentSettings') || '{}');
    const bankDetails = `Account Holder: ${settings.bankHolderName}\nAccount Number: ${settings.bankAccountNumber}\nIFSC Code: ${settings.bankIfsc}\nBank Name: ${settings.bankName}`;
    navigator.clipboard.writeText(bankDetails).then(() => {
        alert('Bank details copied to clipboard!');
    });
}

// Submit deposit
function submitDeposit(method) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    let amount, transactionId, details;
    
    if (method === 'upi') {
        amount = document.getElementById('upiDepositAmount').value;
        transactionId = document.getElementById('upiTransactionId').value;
        details = `UPI ID: ${document.getElementById('upiIdDisplay').textContent}`;
    } else if (method === 'bank') {
        amount = document.getElementById('bankDepositAmount').value;
        transactionId = document.getElementById('bankTransactionId').value;
        details = `Bank Transfer`;
    } else if (method === 'usdt') {
        amount = document.getElementById('usdtDepositAmount').value;
        transactionId = document.getElementById('usdtTransactionHash').value;
        details = `USDT (TRC20)`;
    }
    
    if (!amount || !transactionId) {
        alert('Please fill in all fields!');
        return;
    }
    
    const deposit = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        method: method.toUpperCase(),
        amount: parseFloat(amount),
        transactionId,
        details,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]');
    deposits.push(deposit);
    localStorage.setItem('deposits', JSON.stringify(deposits));
    
    alert('Deposit request submitted successfully! Please wait for approval.');
    closeModal('deposit');
    loadTransactionHistory();
}

// Submit withdrawal
function submitWithdrawal(method) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    let amount, details;
    
    if (method === 'bank') {
        amount = document.getElementById('withdrawAmount').value;
        details = {
            holderName: document.getElementById('withdrawHolderName').value,
            accountNumber: document.getElementById('withdrawAccountNumber').value,
            ifsc: document.getElementById('withdrawIfsc').value,
            bankName: document.getElementById('withdrawBankName').value
        };
        
        // Save bank details for future use
        saveBankDetailsForWithdrawal(currentUser.id, details);
    } else if (method === 'usdt') {
        amount = document.getElementById('withdrawUsdtAmount').value;
        details = {
            walletAddress: document.getElementById('withdrawUsdtAddress').value
        };
    }
    
    if (!amount) {
        alert('Please enter amount!');
        return;
    }
    
    if (parseFloat(amount) > (users[userIndex].balance || 0)) {
        alert('Insufficient balance!');
        return;
    }
    
    const withdrawal = {
        id: Date.now(),
        userId: currentUser.id,
        username: currentUser.username,
        method: method.toUpperCase(),
        amount: parseFloat(amount),
        details,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]');
    withdrawals.push(withdrawal);
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
    
    alert('Withdrawal request submitted successfully! Please wait for approval.');
    closeModal('withdraw');
    loadTransactionHistory();
}

// Save bank details for withdrawal
function saveBankDetailsForWithdrawal(userId, details) {
    const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '[]');
    const existingIndex = bankDetails.findIndex(b => b.userId === userId);
    
    if (existingIndex === -1) {
        bankDetails.push({
            id: Date.now(),
            userId,
            ...details,
            createdAt: new Date().toISOString()
        });
    } else {
        bankDetails[existingIndex] = {
            ...bankDetails[existingIndex],
            ...details,
            updatedAt: new Date().toISOString()
        };
    }
    
    localStorage.setItem('bankDetails', JSON.stringify(bankDetails));
    loadBankDetails();
}

// Load bank details
function loadBankDetails() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '[]');
    const userBankDetails = bankDetails.filter(b => b.userId === currentUser.id);
    
    const bankDetailsList = document.getElementById('bankDetailsList');
    bankDetailsList.innerHTML = '';
    
    if (userBankDetails.length === 0) {
        bankDetailsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No bank details saved</p>';
        return;
    }
    
    userBankDetails.forEach((bank, index) => {
        const item = document.createElement('div');
        item.className = 'bank-detail-item';
        item.innerHTML = `
            <div class="bank-detail-info">
                <h4>${bank.holderName}</h4>
                <p>${bank.bankName} - ${bank.accountNumber}</p>
            </div>
            <div class="bank-detail-actions">
                <button class="action-btn btn-delete" onclick="deleteBankDetail(${bank.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        bankDetailsList.appendChild(item);
    });
}

// Save bank details
function saveBankDetails(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const details = {
        holderName: document.getElementById('bankHolderName').value,
        accountNumber: document.getElementById('bankAccountNumber').value,
        ifsc: document.getElementById('bankIfsc').value,
        bankName: document.getElementById('bankName').value
    };
    
    const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '[]');
    
    bankDetails.push({
        id: Date.now(),
        userId: currentUser.id,
        ...details,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('bankDetails', JSON.stringify(bankDetails));
    
    alert('Bank details saved successfully!');
    closeModal('bank');
    loadBankDetails();
    
    // Clear form
    document.getElementById('bankHolderName').value = '';
    document.getElementById('bankAccountNumber').value = '';
    document.getElementById('bankIfsc').value = '';
    document.getElementById('bankName').value = '';
}

// Delete bank detail
function deleteBankDetail(id) {
    if (confirm('Are you sure you want to delete this bank detail?')) {
        const bankDetails = JSON.parse(localStorage.getItem('bankDetails') || '[]');
        const updatedDetails = bankDetails.filter(b => b.id !== id);
        localStorage.setItem('bankDetails', JSON.stringify(updatedDetails));
        
        alert('Bank detail deleted successfully!');
        loadBankDetails();
    }
}

// Change password
function changePassword(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (users[userIndex].password !== currentPassword) {
        alert('Current password is incorrect!');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters!');
        return;
    }
    
    users[userIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Password changed successfully!');
    
    // Clear form
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
}

// Load transaction history
function loadTransactionHistory() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const deposits = JSON.parse(localStorage.getItem('deposits') || '[]').filter(d => d.userId === currentUser.id);
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]').filter(w => w.userId === currentUser.id);
    
    const transactions = [...deposits, ...withdrawals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No transactions found</p>';
        return;
    }
    
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const isDeposit = deposits.includes(transaction);
        const date = new Date(transaction.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${isDeposit ? 'Deposit' : 'Withdrawal'} • ${transaction.method}</h4>
                <p>${date} • ${transaction.status}</p>
            </div>
            <div class="transaction-amount ${isDeposit ? 'deposit' : 'withdrawal'}">
                ${isDeposit ? '+' : '-'}₹${transaction.amount}
            </div>
        `;
        transactionsList.appendChild(item);
    });
}

// Load bet history
function loadBetHistory() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const bets = JSON.parse(localStorage.getItem('bets') || '[]').filter(b => b.userId === currentUser.id);
    
    const betsList = document.getElementById('betsList');
    betsList.innerHTML = '';
    
    if (bets.length === 0) {
        betsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No bets found</p>';
        return;
    }
    
    bets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    bets.forEach(bet => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const date = new Date(bet.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${bet.game}</h4>
                <p>${date} • ${bet.result}</p>
            </div>
            <div class="transaction-amount ${bet.result === 'WIN' ? 'deposit' : 'withdrawal'}">
                ${bet.result === 'WIN' ? '+' : '-'}₹${bet.amount}
            </div>
        `;
        betsList.appendChild(item);
    });
}

// Filter transactions by date
function filterTransactions() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    let transactions = [...JSON.parse(localStorage.getItem('deposits') || '[]').filter(d => d.userId === currentUser.id),
                         ...JSON.parse(localStorage.getItem('withdrawals') || '[]').filter(w => w.userId === currentUser.id)];
    
    if (startDate) {
        transactions = transactions.filter(t => new Date(t.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
        transactions = transactions.filter(t => new Date(t.createdAt) <= new Date(endDate + 'T23:59:59'));
    }
    
    transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const transactionsList = document.getElementById('transactionsList');
    transactionsList.innerHTML = '';
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No transactions found for selected period</p>';
        return;
    }
    
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const isDeposit = transaction.method && !transaction.details?.holderName && !transaction.details?.walletAddress;
        const date = new Date(transaction.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${isDeposit ? 'Deposit' : 'Withdrawal'} • ${transaction.method}</h4>
                <p>${date} • ${transaction.status}</p>
            </div>
            <div class="transaction-amount ${isDeposit ? 'deposit' : 'withdrawal'}">
                ${isDeposit ? '+' : '-'}₹${transaction.amount}
            </div>
        `;
        transactionsList.appendChild(item);
    });
}

// Filter bets by date
function filterBets() {
    const startDate = document.getElementById('betStartDate').value;
    const endDate = document.getElementById('betEndDate').value;
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    let bets = JSON.parse(localStorage.getItem('bets') || '[]').filter(b => b.userId === currentUser.id);
    
    if (startDate) {
        bets = bets.filter(b => new Date(b.createdAt) >= new Date(startDate));
    }
    
    if (endDate) {
        bets = bets.filter(b => new Date(b.createdAt) <= new Date(endDate + 'T23:59:59'));
    }
    
    bets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const betsList = document.getElementById('betsList');
    betsList.innerHTML = '';
    
    if (bets.length === 0) {
        betsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 30px;">No bets found for selected period</p>';
        return;
    }
    
    bets.forEach(bet => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        const date = new Date(bet.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        item.innerHTML = `
            <div class="transaction-info">
                <h4>${bet.game}</h4>
                <p>${date} • ${bet.result}</p>
            </div>
            <div class="transaction-amount ${bet.result === 'WIN' ? 'deposit' : 'withdrawal'}">
                ${bet.result === 'WIN' ? '+' : '-'}₹${bet.amount}
            </div>
        `;
        betsList.appendChild(item);
    });
}

// Show history tab
function showHistoryTab(tab) {
    const tabs = document.querySelectorAll('.history-tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

// Modal functions
function openModal(type) {
    document.getElementById(type + 'Modal').classList.add('active');
}

function closeModal(type) {
    document.getElementById(type + 'Modal').classList.remove('active');
}

// Mobile menu
function toggleMobileMenu() {
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.style.display = mobileNav.style.display === 'none' ? 'block' : 'none';
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.clear();
        window.location.href = 'index.html';
    }
}

// Close modals on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
