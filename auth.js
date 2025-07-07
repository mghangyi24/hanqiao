document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    const defaultHSKLevels = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'];
    const adminEmail = 'admin@hsk.com';

    // Initialize users if not exists
    let storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (!storedUsers.some(user => user.email === adminEmail)) {
        storedUsers.push({
            name: 'Admin',
            email: adminEmail,
            password: 'admin123',
            hskLevels: defaultHSKLevels,
            paidLevels: defaultHSKLevels,
            role: 'admin'
        });
        localStorage.setItem('users', JSON.stringify(storedUsers));
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email.toLowerCase() === email && u.password === password);

        if (!user) {
            alert('Invalid email or password.');
            return;
        }

        // Ensure user has required properties
        user.hskLevels = Array.isArray(user.hskLevels) ? user.hskLevels : [];
        user.paidLevels = Array.isArray(user.paidLevels) ? user.paidLevels : [];

        // Store user session
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');

        // Redirect based on role
        window.location.href = user.role === 'admin' ? 'admin.html' : 'main.html';
    });
});