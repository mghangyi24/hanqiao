document.addEventListener('DOMContentLoaded', function() {
    // Sample user data with multiple HSK levels
    

    // Current selected user ID
    let selectedUserId = null;

    // Populate user table
    const tableBody = document.querySelector('#userTable tbody');
    function renderUserTable() {
        tableBody.innerHTML = '';
        users.forEach(user => {
            const row = document.createElement('tr');
            row.dataset.userId = user.id;
            
            row.innerHTML = `
                <td>${user.username}</td>
                <td class="password-field" data-password="${user.password}">•••••••</td>
                <td>${user.joinedDate}</td>
                <td>${user.hskLevels.join(', ')} (Current: HSK ${user.currentLevel})</td>
                <td>
                    <button class="show-password" data-id="${user.id}">Show</button>
                    <button class="edit-btn" data-id="${user.id}">Edit</button>
                    <button class="delete-btn" data-id="${user.id}">Delete</button>
                    <button class="manage-levels" data-id="${user.id}">Manage Levels</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Initial render
    renderUserTable();

    // User selection handler
    function selectUser(userId) {
        selectedUserId = userId;
        const user = users.find(u => u.id == userId);
        if (user) {
            document.getElementById('levelSelect').value = user.currentLevel;
            updateUserLevelsDisplay(user);
        }
    }

    // Get selected user
    function getSelectedUser() {
        return users.find(u => u.id == selectedUserId);
    }

    // Update levels display
    function updateUserLevelsDisplay(user) {
        const levelsContainer = document.getElementById('userLevels');
        if (!user) return;
        
        levelsContainer.innerHTML = `
            <h4>${user.username}'s HSK Levels</h4>
            <p><strong>All Levels:</strong> ${user.hskLevels.join(', ')}</p>
            <p><strong>Current Level:</strong> HSK ${user.currentLevel}</p>
        `;
    }

    // Event delegation for user table
    tableBody.addEventListener('click', function(e) {
        const target = e.target;
        const userId = target.closest('tr')?.dataset.userId;
        
        if (target.classList.contains('manage-levels')) {
            selectUser(userId);
            return;
        }
        
        // Other button handlers...
    });

    // Add level to user
    document.getElementById('addLevel').addEventListener('click', function() {
        const selectedLevel = parseInt(document.getElementById('levelSelect').value);
        const user = getSelectedUser();
        
        if (user && !user.hskLevels.includes(selectedLevel)) {
            user.hskLevels.push(selectedLevel);
            user.hskLevels.sort((a, b) => a - b);
            updateUserLevelsDisplay(user);
            renderUserTable();
        }
    });

    // Set current level
    document.getElementById('setCurrent').addEventListener('click', function() {
        const selectedLevel = parseInt(document.getElementById('levelSelect').value);
        const user = getSelectedUser();
        
        if (user && user.hskLevels.includes(selectedLevel)) {
            user.currentLevel = selectedLevel;
            updateUserLevelsDisplay(user);
            renderUserTable();
        }
    });

    // Add new user functionality
    document.getElementById('addUser').addEventListener('click', function() {
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const newUser = {
            id: newId,
            username: `user${newId}`,
            password: `pass${Math.floor(100 + Math.random() * 900)}`,
            joinedDate: new Date().toISOString().split('T')[0],
            hskLevels: [1],
            currentLevel: 1
        };
        
        users.push(newUser);
        renderUserTable();
    });

    // Other existing event listeners...
    // At the end of admin.js, add this:
function saveUsersToLocalStorage() {
    localStorage.setItem('hskUsers', JSON.stringify(users));
}

// Call this function whenever user data changes:
// After users.push(newUser);
// After modifying hskLevels or currentLevel
});