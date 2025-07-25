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
                    <div class="welcome-section" style="
    background: rgba(255, 255, 255, 0.85);
    padding: 1.75rem;
    margin-bottom: 2rem;
    border-radius: 10px;
    backdrop-filter: blur(0.5px);
    -webkit-backdrop-filter: blur(6px);
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
    border-left: 4px solid #4a90e2;
    position: relative;
    overflow: hidden;
">
    <!-- Frosted glass overlay effect -->
    <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.4);
        z-index: -1;
    "></div>
    
    <h2 style="
        color: #2c3e50;
        font-size: 1.8rem;
        margin-bottom: 0.6rem;
        font-weight: 650;
        padding-bottom: 0.4rem;
        border-bottom: 2px solid rgba(74, 144, 226, 0.3);
    ">
        Welcome back, ${user.username}!
    </h2>
    
    <p style="
        color: #5a6a7a;
        font-size: 1.05rem;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.8rem;
        background: rgba(74, 144, 226, 0.12);
        border-radius: 5px;
        width: fit-content;
        backdrop-filter: blur(2px);
    ">
        <span style="color: #4a90e2; font-size: 1.1rem;">📅</span>
        Member since ${user.joined_date}
    </p>
</div>
                    <h3 style="
    display: inline-block;
    background-color: #1F2937; /* dark gray */
    color: #FCD34D; /* warm gold for contrast */
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    text-align: center;
">
    Your HSK Progress
</h3>

                    <div class="hsk-levels-grid">
                        ${hskLevels.map(level => `
                            <div class="hsk-level-card" data-level="${level}">
                                <div class="hsk-level-header">
                                    <div class="hsk-level-badge">${level}</div>
                                    <div class="hsk-level-title">HSK Level ${level}</div>
                                </div>
                                <p class="hsk-level-description">${hskDescriptions[level].description}</p>
                                
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
