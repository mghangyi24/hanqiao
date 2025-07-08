// In login.js (or your login script)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('error-message');

    // Load users from localStorage or initialize with sample data if empty
    let allUsers = JSON.parse(localStorage.getItem('hskUsers'));
    
    // If no users exist, initialize with sample data
    if (!allUsers || allUsers.length === 0) {
        allUsers = [
            { 
                id: 1, 
                username: 'user1', 
                password: '123123', 
                joinedDate: '2023-01-15', 
                hskLevels: [1],  // Only HSK 1 and 2 for user1
                currentLevel: 1
            },
            { 
                id: 2, 
                username: 'user2', 
                password: 'pass456', 
                joinedDate: '2023-02-20', 
                hskLevels: [2, 3],  // Only HSK 2 for user2
                currentLevel: 3
            },
            { 
                id: 3, 
                username: 'admin', 
                password: 'admin123', 
                joinedDate: '2023-01-01', 
                hskLevels: [1, 2, 3, 4, 5, 6],  // All levels for admin
                currentLevel: 6,
                isAdmin: true
            }
        ];
        localStorage.setItem('hskUsers', JSON.stringify(allUsers));
    }

    const user = allUsers.find(u => u.username === username && u.password === password);

    if (user) {
        // Store user session data
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            username: user.username,
            joinedDate: user.joinedDate,
            currentLevel: user.currentLevel,
            hskLevels: user.hskLevels,  // Make sure to include hskLevels
            isAdmin: user.isAdmin || false
        }));

        // Redirect based on admin status
        window.location.href = user.isAdmin ? 'admin.html' : 'main.html';
    } else {
        if (errorMessage) {
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        } else {
            alert('Invalid username or password');
        }
    }
});