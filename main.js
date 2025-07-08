document.addEventListener('DOMContentLoaded', function() {
    const allUsers = JSON.parse(localStorage.getItem('hskUsers')) || [];
    const currentUserStored = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUserStored) {
        window.location.href = 'index.html';
        return;
    }

    const currentUser = allUsers.find(u => u.id === currentUserStored.id);
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    document.getElementById('welcome-message').textContent = `Welcome, ${currentUser.username}!`;
    document.getElementById('joined-date').textContent = `Member since ${currentUser.joinedDate || 'unknown date'}`;

    const hskLevelsData = [
        { id: 1, name: 'HSK 1', color: 'hsk1', description: '150 words, basic phrases' },
        { id: 2, name: 'HSK 2', color: 'hsk2', description: '300 words, simple conversations' },
        { id: 3, name: 'HSK 3', color: 'hsk3', description: '600 words, daily communication' },
        { id: 4, name: 'HSK 4', color: 'hsk4', description: '1200 words, discussing various topics' },
        { id: 5, name: 'HSK 5', color: 'hsk5', description: '2500 words, reading newspapers' },
        { id: 6, name: 'HSK 6', color: 'hsk6', description: '5000+ words, academic/professional' }
    ];

    const userLevels = hskLevelsData
        .filter(level => currentUser.hskLevels.includes(level.id))
        .map(level => ({
            ...level,
            progress: level.id === currentUser.currentLevel ? 75 : 100
        }));

    const levelsContainer = document.getElementById('allLevels');
    levelsContainer.innerHTML = '';

    userLevels.forEach(level => {
        const levelCard = document.createElement('div');
        levelCard.className = `level-card ${level.color} ${level.id === currentUser.currentLevel ? 'active' : ''}`;
        levelCard.innerHTML = `
            <h3>${level.name}</h3>
            <p>${level.description}</p>
            <div class="progress">
                <div class="progress-bar" style="width: ${level.progress}%"></div>
            </div>
            <small>${level.progress}% complete</small>
        `;
        levelCard.addEventListener('click', () => openLevelModal(level));
        levelsContainer.appendChild(levelCard);
    });

    const hskDescriptions = {
        1: "HSK 1: Basic understanding with 150 words.",
        2: "HSK 2: Simple communication with 300 words.",
        3: "HSK 3: Daily communication with 600 words.",
        4: "HSK 4: Discussing various topics with 1200 words.",
        5: "HSK 5: Reading newspapers with 2500 words.",
        6: "HSK 6: Fluent comprehension with 5000+ words."
    };

    const currentLevelContainer = document.getElementById('currentLevel');
    currentLevelContainer.innerHTML = `
        <h3>Current Focus: HSK ${currentUser.currentLevel}</h3>
        <div class="level-badge">HSK ${currentUser.currentLevel}</div>
        <p>${hskDescriptions[currentUser.currentLevel]}</p>
        <small>${userLevels.find(l => l.id === currentUser.currentLevel)?.progress || 0}% complete</small>
    `;

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    function openLevelModal(level) {
        const modal = document.createElement('div');
        modal.className = 'level-modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${level.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${level.description}</p>
                    <p>This level covers ${
                        level.id === 1 ? '150' :
                        level.id === 2 ? '300' :
                        level.id === 3 ? '600' :
                        level.id === 4 ? '1200' :
                        level.id === 5 ? '2500' : '5000+'
                    } words and essential grammar.</p>
                    <div class="progress-container">
                        <p>Your progress: ${level.progress}%</p>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${level.progress}%"></div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn secondary close-modal">Close</button>
                    <button class="modal-btn primary">${level.id === currentUser.currentLevel ? 'Continue Learning' : 'Review Level'}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });
        });

        modal.querySelector('.modal-btn.primary').addEventListener('click', () => {
            // Navigate to corresponding lesson page
            window.location.href = `hsk${level.id}.html`;
        });
    }
});
