document.addEventListener('DOMContentLoaded', () => {
  const adminNameEl = document.getElementById('admin-name');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const userListEl = document.getElementById('user-list');
  const totalUsersEl = document.getElementById('total-users');
  const activeTodayEl = document.getElementById('active-today');

  const manageModal = document.getElementById('manage-user-modal');
  const manageContent = document.getElementById('manage-user-content');
  const closeManageModal = document.getElementById('close-manage-modal');
  const saveUserBtn = document.getElementById('save-user-btn');
  const deleteUserBtn = document.getElementById('delete-user-btn');
  const addUserBtn = document.getElementById('add-user-btn');

  let selectedUserEmail = null;
  let isAddMode = false;

  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.role !== 'admin') {
    alert('Please log in as admin.');
    window.location.href = 'admin-login.html';
    return;
  }

  adminNameEl.textContent = `Welcome, ${currentUser.name || 'Admin'}`;

  function renderUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    userListEl.innerHTML = '';

    if (users.length === 0) {
      userListEl.textContent = 'No users found.';
    } else {
      users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';

        const userInfo = document.createElement('div');
        userInfo.textContent = `${user.name} (${user.email}) - ${user.hskLevel || 'No HSK'}`;

        const joinedDate = document.createElement('div');
        joinedDate.className = 'user-joined-date';
        joinedDate.textContent = `Joined: ${user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}`;

        const manageBtn = document.createElement('button');
        manageBtn.className = 'admin-btn manage-user-btn';
        manageBtn.dataset.email = user.email;
        manageBtn.textContent = 'Manage';

        userCard.appendChild(userInfo);
        userCard.appendChild(joinedDate);
        userCard.appendChild(manageBtn);
        userListEl.appendChild(userCard);
      });
    }

    totalUsersEl.textContent = users.length;
    activeTodayEl.textContent = users.filter(u => u.activeToday).length;
  }

  function openModal(user = null) {
    isAddMode = !user;
    selectedUserEmail = user?.email || null;
    deleteUserBtn.style.display = user ? 'inline-block' : 'none';
    manageContent.innerHTML = '';

    // Name
    const labelName = document.createElement('label');
    labelName.textContent = 'Name: ';
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.id = 'modal-user-name';
    inputName.value = user?.name || '';
    labelName.appendChild(inputName);

    // Email
    const labelEmail = document.createElement('label');
    labelEmail.textContent = 'Email: ';
    const inputEmail = document.createElement('input');
    inputEmail.type = 'email';
    inputEmail.id = 'modal-user-email';
    inputEmail.value = user?.email || '';
    if (user) inputEmail.disabled = true;
    labelEmail.appendChild(inputEmail);

    // Password
    const labelPassword = document.createElement('label');
    labelPassword.textContent = 'Password: ';
    if (user) {
      const spanPass = document.createElement('span');
      spanPass.id = 'modal-user-password';
      spanPass.textContent = user.password || 'N/A';
      spanPass.className = 'blurred';

      const showPassBtn = document.createElement('button');
      showPassBtn.className = 'small-btn';
      showPassBtn.textContent = 'Show';

      showPassBtn.addEventListener('click', () => {
        const adminPass = prompt('Enter admin password to view user password:');
        if (adminPass === currentUser.password) {
          spanPass.classList.remove('blurred');
        } else {
          alert('Incorrect admin password.');
        }
      });

      labelPassword.appendChild(spanPass);
      labelPassword.appendChild(showPassBtn);
    } else {
      const inputPass = document.createElement('input');
      inputPass.type = 'password';
      inputPass.id = 'modal-user-password';
      labelPassword.appendChild(inputPass);
    }

    // Role
    const labelRole = document.createElement('label');
    labelRole.textContent = 'Role: ';
    const selectRole = document.createElement('select');
    selectRole.id = 'modal-user-role';
    ['user', 'admin'].forEach(r => {
      const opt = document.createElement('option');
      opt.value = r;
      opt.textContent = r.charAt(0).toUpperCase() + r.slice(1);
      if (user?.role === r) opt.selected = true;
      selectRole.appendChild(opt);
    });
    labelRole.appendChild(selectRole);

    // HSK Level
    const labelHSK = document.createElement('label');
    labelHSK.textContent = 'HSK Level: ';
    const selectHSK = document.createElement('select');
    selectHSK.id = 'modal-user-hskLevel';
    ['', 'HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6'].forEach(level => {
      const opt = document.createElement('option');
      opt.value = level;
      opt.textContent = level || 'None';
      if (user?.hskLevel === level) opt.selected = true;
      selectHSK.appendChild(opt);
    });
    labelHSK.appendChild(selectHSK);

    // Active Today
    const labelActive = document.createElement('label');
    const inputActive = document.createElement('input');
    inputActive.type = 'checkbox';
    inputActive.id = 'modal-user-activeToday';
    inputActive.checked = user?.activeToday || false;
    labelActive.appendChild(inputActive);
    labelActive.appendChild(document.createTextNode(' Active Today'));

    manageContent.appendChild(labelName);
    manageContent.appendChild(labelEmail);
    manageContent.appendChild(labelPassword);
    manageContent.appendChild(labelRole);
    manageContent.appendChild(labelHSK);
    manageContent.appendChild(labelActive);

    manageModal.classList.remove('hidden');
  }

  addUserBtn.addEventListener('click', () => openModal());

  userListEl.addEventListener('click', e => {
    if (e.target.classList.contains('manage-user-btn')) {
      const email = e.target.dataset.email;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === email);
      if (!user) {
        alert('User not found.');
        return;
      }
      openModal(user);
    }
  });

  closeManageModal.addEventListener('click', () => {
    manageModal.classList.add('hidden');
    selectedUserEmail = null;
  });

  saveUserBtn.addEventListener('click', () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const name = document.getElementById('modal-user-name').value.trim();
    const email = document.getElementById('modal-user-email').value.trim();
    const role = document.getElementById('modal-user-role').value;
    const hskLevel = document.getElementById('modal-user-hskLevel').value;
    const activeToday = document.getElementById('modal-user-activeToday').checked;

    if (!name || !email) {
      alert('Name and email are required.');
      return;
    }

    if (isAddMode) {
      const password = document.getElementById('modal-user-password').value.trim();
      if (!password) {
        alert('Password is required.');
        return;
      }
      if (users.some(u => u.email === email)) {
        alert('User with this email already exists.');
        return;
      }
      users.push({
        name,
        email,
        password,
        role,
        hskLevel,
        activeToday,
        joinedDate: new Date().toISOString()
      });
      alert('User added successfully.');
    } else {
      const index = users.findIndex(u => u.email === selectedUserEmail);
      if (index === -1) {
        alert('User not found.');
        return;
      }
      users[index].name = name;
      users[index].role = role;
      users[index].hskLevel = hskLevel;
      users[index].activeToday = activeToday;
      alert('User updated successfully.');
    }

    localStorage.setItem('users', JSON.stringify(users));
    manageModal.classList.add('hidden');
    selectedUserEmail = null;
    isAddMode = false;
    renderUsers();
  });

  deleteUserBtn.addEventListener('click', () => {
    if (!selectedUserEmail) return;
    if (confirm('Are you sure you want to delete this user?')) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(u => u.email !== selectedUserEmail);
      localStorage.setItem('users', JSON.stringify(users));
      alert('User deleted successfully.');
      manageModal.classList.add('hidden');
      selectedUserEmail = null;
      renderUsers();
    }
  });

  logoutBtn?.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !manageModal.classList.contains('hidden')) {
      manageModal.classList.add('hidden');
      selectedUserEmail = null;
    }
  });

  renderUsers();
});
