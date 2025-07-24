document.addEventListener('DOMContentLoaded', () => {
    const profileContainer = document.getElementById('profileContainer');
    const logoutButton = document.getElementById('logoutButton');

    const hskDescriptions = {
        "1": {
            description: "Master 150 words and basic phrases for everyday communication. Perfect for beginners starting their Chinese journey.",
            progress: 15
        },
        "2": {
            description: "Expand to 300 words for elementary conversations. You can now handle simple daily interactions.",
            progress: 30
        },
        "3": {
            description: "Reach 600 words and intermediate grammar. Discuss familiar topics and understand simple texts.",
            progress: 45
        },
        "4": {
            description: "Learn 1200 words for fluent daily conversations. Read newspapers and express opinions.",
            progress: 60
        },
        "5": {
            description: "Advanced level with 2500 words. Understand complex texts and express ideas precisely.",
            progress: 75
        },
        "6": {
            description: "Near-native fluency with 5000+ words. Comprehend abstract concepts and nuanced meanings.",
            progress: 90
        }
    };

    async function loadUserProfile() {
        try {
            createBackgroundElements();

            const res = await fetch('get_user_profile.php');
            const data = await res.json();

            if (data.status === 'success') {
                const user = data.user;
                const hskLevels = user.hsk_level.split(',').map(l => l.trim()).filter(l => l);

                profileContainer.innerHTML = `
                    <div class="welcome-section">
                        <h2>Welcome back, ${user.username}!</h2>
                        <p>Member since ${user.joined_date}</p>
                    </div>
                    <h3>Your HSK Progress</h3>
                    <div class="hsk-levels-grid">
                        ${hskLevels.map(level => `
                            <div class="hsk-level-card" data-level="${level}">
                                <div class="hsk-level-header">
                                    <div class="hsk-level-badge">${level}</div>
                                    <div class="hsk-level-title">HSK Level ${level}</div>
                                </div>
                                <p class="hsk-level-description">${hskDescriptions[level].description}</p>
                                <div class="progress-container">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${hskDescriptions[level].progress}%"></div>
                                    </div>
                                    <div class="progress-label">${hskDescriptions[level].progress}% complete</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                // Animate progress bars
                setTimeout(() => {
                    document.querySelectorAll('.progress-fill').forEach(bar => {
                        const targetWidth = bar.style.width;
                        bar.style.width = '0';
                        void bar.offsetWidth; // trigger reflow
                        bar.style.transition = 'width 1.5s ease-in-out';
                        bar.style.width = targetWidth;
                    });
                }, 300);

                // Correctly handle navigation on card click
                document.querySelectorAll('.hsk-level-card').forEach(card => {
                    card.addEventListener('click', () => {
                        const level = card.getAttribute('data-level');
                        if (confirm(`Go to HSK ${level} page?`)) {
                            window.location.href = `./hsk${level}.html`;
                        }
                    });
                });

            } else {
                profileContainer.innerHTML = `<p>${data.message || 'Failed to load profile.'}</p>`;
            }
        } catch (err) {
            console.error(err);
            profileContainer.innerHTML = `<p>Server error loading profile.</p>`;
        }
    }

    function createBackgroundElements() {
        const circle1 = document.createElement('div');
        circle1.className = 'background-circle circle-1';
        document.body.appendChild(circle1);

        const circle2 = document.createElement('div');
        circle2.className = 'background-circle circle-2';
        document.body.appendChild(circle2);
    }

    logoutButton.addEventListener('click', async () => {
        try {
            await fetch('logout.php');
            window.location.href = 'login.html';
        } catch (err) {
            console.error(err);
            alert('Logout failed.');
        }
    });

    loadUserProfile();
});
