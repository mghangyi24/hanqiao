document.addEventListener('DOMContentLoaded', () => {
    let passwordsVisible = false;

    // Load users initially without passwords
    loadUsers();

    // Add user form submit
    document.getElementById('addUserForm').addEventListener('submit', async e => {
        e.preventDefault();

        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        const hsk_level_raw = document.getElementById('newHSKLevel').value.trim();
        const isAdmin = document.getElementById('newIsAdmin').checked ? 1 : 0;

        if (!username || !password || !hsk_level_raw) {
            showMessage('Please fill all fields correctly.', true);
            return;
        }

        // Validate HSK Level: must be 1-6 or comma-separated like "1,2"
        const hskLevels = hsk_level_raw.split(',').map(s => s.trim());
        const isValidHSK = hskLevels.every(level => {
            const n = parseInt(level, 10);
            return !isNaN(n) && n >= 1 && n <= 6;
        });

        if (!isValidHSK) {
            showMessage('HSK Level must be numbers between 1 and 6 (e.g., "1,2").', true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('hsk_level', hsk_level_raw);
            formData.append('is_admin', isAdmin);

            const res = await fetch('add_user.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.status === 'success') {
                showMessage('User added successfully.');
                document.getElementById('addUserForm').reset();
                loadUsers(passwordsVisible);
            } else {
                showMessage(data.message || 'Failed to add user.', true);
            }
        } catch (err) {
            console.error(err);
            showMessage('Server error.', true);
        }
    });

    // Show passwords button click
    document.getElementById('showPasswordsBtn').addEventListener('click', () => {
        document.getElementById('adminPasswordPrompt').style.display = 'block';
        document.getElementById('passwordMessage').innerText = '';
    });

    // Confirm admin password to show user passwords
    document.getElementById('confirmAdminPasswordBtn').addEventListener('click', async () => {
        const adminPassword = document.getElementById('adminPasswordInput').value.trim();
        if (!adminPassword) {
            document.getElementById('passwordMessage').innerText = "Please enter admin password.";
            return;
        }

        try {
            const formData = new FormData();
            formData.append('admin_password', adminPassword);

            const res = await fetch('verify_admin_password.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.status === 'success' && data.verified) {
                document.getElementById('passwordMessage').innerText = "Access granted.";
                passwordsVisible = true;
                loadUsers(true);
                document.getElementById('adminPasswordPrompt').style.display = 'none';
                document.getElementById('adminPasswordInput').value = '';
            } else {
                document.getElementById('passwordMessage').innerText = "Wrong admin password.";
            }
        } catch (err) {
            console.error(err);
            document.getElementById('passwordMessage').innerText = "Server error during verification.";
        }
    });

    window.deleteUser = async function(userId) {
        if (!confirm('Delete user with ID ' + userId + '?')) return;

        try {
            const formData = new FormData();
            formData.append('id', userId);

            const res = await fetch('delete_user.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.status === 'success') {
                showMessage('User deleted successfully.');
                loadUsers(passwordsVisible);
            } else {
                showMessage(data.message || 'Failed to delete user.', true);
            }
        } catch (err) {
            console.error(err);
            showMessage('Server error.', true);
        }
    };

    async function loadUsers(showPasswords = false) {
        try {
            let url = 'getuser.php';
            if (showPasswords) {
                url += '?show_passwords=1';
            }
            const res = await fetch(url);
            const data = await res.json();

            if (data.status !== 'success') {
                showMessage(data.message || "Failed to load users.", true);
                return;
            }

            const tbody = document.querySelector('#userTable tbody');
            tbody.innerHTML = '';

            const theadRow = document.querySelector('#userTable thead tr');
            if (showPasswords && !document.getElementById('passwordHeader')) {
                const th = document.createElement('th');
                th.id = 'passwordHeader';
                th.textContent = 'Password';
                theadRow.insertBefore(th, theadRow.children[5]);
            } else if (!showPasswords && document.getElementById('passwordHeader')) {
                document.getElementById('passwordHeader').remove();
            }

            data.users.forEach(user => {
                const tr = document.createElement('tr');
                const passwordCell = showPasswords
                    ? `<td>${user.password_plain || 'N/A'}</td>`
                    : '';

                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.joined_date}</td>
                    <td>${user.hsk_level}</td>
                    <td>${user.is_admin == 1 ? 'Yes' : 'No'}</td>
                    ${passwordCell}
                    <td><button onclick="deleteUser(${user.id})">Delete</button></td>
                `;

                tbody.appendChild(tr);
            });

        } catch (err) {
            console.error(err);
            showMessage("Server error while loading users.", true);
        }
    }

    function showMessage(msg, isError = false) {
        const messageEl = document.getElementById('message');
        messageEl.style.color = isError ? 'red' : 'green';
        messageEl.textContent = msg;
        setTimeout(() => { messageEl.textContent = ''; }, 4000);
    }
});
