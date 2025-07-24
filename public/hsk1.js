document.addEventListener('DOMContentLoaded', function() {
    // Initialize all app modules
    App.init();
});

const App = {
    // Main initialization function
    init: function() {
        this.initTabs();
        this.initSpeech();
        this.initModal();
        this.initVocabularyTab();
        this.initGrammarTab();
        this.initStoryTab();
        this.initVideoTab();
        this.setupEventDelegation();
    },

    // Tab switching functionality
    initTabs: function() {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    },

    // Speech synthesis setup
    initSpeech: function() {
        this.synth = window.speechSynthesis;
    },

    // Modal dialog setup
initModal: function() {
    this.lessonModal = document.getElementById('lesson-modal');
    this.lessonModalBody = document.getElementById('lesson-modal-body');
    this.closeBtn = this.lessonModal.querySelector('.close-btn');

    // Set up lesson items
    document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', () => {
            const lessonNum = item.getAttribute('data-lesson');
            this.showLesson(lessonNum);
        });
    });

    // Close button handler
    this.closeBtn.addEventListener('click', () => this.closeModal());

    // Click outside modal to close
    this.lessonModal.addEventListener('click', (e) => {
        if (e.target === this.lessonModal) this.closeModal();
    });
},

// Show modal with lesson content
showLesson: function(lessonNum) {
    this.lessonModalBody.innerHTML = this.getLessonData(lessonNum);
    this.lessonModal.style.display = 'block';
    this.attachModalButtons();
},

// Close modal and stop speech
closeModal: function() {
    this.lessonModal.style.display = 'none';
    if (this.synth.speaking) this.synth.cancel();
},

// Attach event handlers to modal buttons
attachModalButtons: function() {
    // Speak buttons
    this.lessonModalBody.querySelectorAll('.speak-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text') || btn.innerText;
            const lang = btn.getAttribute('data-lang') || 'zh-CN';
            this.speak(text, lang);
        });
    });

    // Read entire lesson button
    const readEntireBtn = this.lessonModalBody.querySelector('.read-entire-btn');
    if (readEntireBtn) {
        readEntireBtn.addEventListener('click', () => {
            const text = this.lessonModalBody.innerText;
            this.speak(text, 'zh-CN');
        });
    }

    // Add Cancel button at the end if not already present
    if (!this.lessonModalBody.querySelector('.cancel-lesson-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn secondary cancel-lesson-btn';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.marginTop = '1rem';
        cancelBtn.addEventListener('click', () => this.closeModal());
        this.lessonModalBody.appendChild(cancelBtn);
    }
},

// Speak text using speech synthesis
speak: function(text, lang = 'zh-CN') {
    if (this.synth.speaking) {
        this.synth.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    this.synth.speak(utterance);
},

    // Vocabulary tab
    initVocabularyTab: function() {
        const vocabContainer = document.getElementById('vocabulary');
        if (!vocabContainer) return;

        const vocabData = this.getVocabularyData();
        let html = `
            <h2>HSK 1 Vocabulary (${vocabData.length} words)</h2>
            <div class="vocab-controls">
                <input type="text" id="vocab-search" placeholder="Search vocabulary...">
                <button id="shuffle-btn" class="shuffle-btn">Shuffle</button>
            </div>
            <div class="vocab-table-container">
                <table class="vocab-table">
                    <thead>
                        <tr>
                            <th>Chinese</th>
                            <th>Pinyin</th>
                            <th>English</th>
                            <th>Myanmar</th>
                            <th>Audio</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        vocabData.forEach(word => {
            html += `
                <tr>
                    <td>${word.chinese}</td>
                    <td>${word.pinyin}</td>
                    <td>${word.english}</td>
                    <td>${word.myanmar}</td>
                    <td>
                        <audio controls preload="none">
                            <source src="${word.audio}" type="audio/mpeg">
                            Your browser does not support the audio element.
                        </audio>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        vocabContainer.innerHTML = html;

        // Shuffle functionality
        document.getElementById('shuffle-btn')?.addEventListener('click', () => {
            const tbody = document.querySelector('.vocab-table tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            rows.sort(() => Math.random() - 0.5);
            rows.forEach(row => tbody.appendChild(row));
        });

        // Search functionality
        document.getElementById('vocab-search')?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.vocab-table tbody tr').forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display =  text.includes(searchTerm) ? '' : 'none';
            });
        });
    },

    // Vocabulary data
    getVocabularyData: function() {
        return [
            { chinese: "你好", pinyin: "nǐ hǎo", english: "Hello", myanmar: "မင်္ဂလာပါ", audio: "audio/nihao.mp3" },
            { chinese: "您好", pinyin: "nín hǎo", english: "Hello (polite)", myanmar: "မင်္ဂလာပါ (ရိုသေစွာ)", audio: "audio/ninhao.mp3" },
            { chinese: "谢谢", pinyin: "xiè xiè", english: "Thank you", myanmar: "ကျေးဇူးတင်ပါတယ်", audio: "audio/xiexie.mp3" },
            // Add more vocabulary items here
        ];
    },

    // Grammar tab
    initGrammarTab: function() {
        const grammarContainer = document.getElementById('grammar');
        if (!grammarContainer) return;
        
        const grammarData = this.getGrammarData();
        let html = `<h2>HSK 1 Grammar Points</h2><div class="grammar-list">`;
        
        grammarData.forEach(point => {
            html += `
                <div class="grammar-point">
                    <h3>${point.title}</h3>
                    <p>${point.explanation}</p>
                    <div class="grammar-pattern">Pattern: ${point.pattern}</div>
                    <div class="example">
                        <p>${point.example}</p>
                        <p class="myanmar-translation">${point.myanmar}</p>
                    </div>
                    <button class="speak-btn" data-text="${point.example.split('(')[0].trim()}" data-lang="zh-CN">
                        <i class="fas fa-volume-up"></i> Pronounce
                    </button>
                </div>
            `;
        });
        
        grammarContainer.innerHTML = html + '</div>';
    },

    // Grammar data
    getGrammarData: function() {
        return [
            { 
                title: "是 (shì) - To Be", 
                explanation: "Used to link nouns and pronouns. Structure: Subject + 是 + Object",
                example: "我是学生。 (Wǒ shì xuéshēng) - I am a student.",
                myanmar: "ငါကျောင်းသားဖြစ်တယ်။",
                pattern: "Noun 1 + 是 + Noun 2"
            },
            // Add more grammar points here
        ];
    },

    // Story tab
    initStoryTab: function() {
        const storyContainer = document.getElementById('story');
        if (!storyContainer) return;
        
        const stories = this.getStoryData();
        let html = `<h2>HSK 1 Stories</h2><div class="story-list">`;
        
        stories.forEach(story => {
            html += `
                <div class="story-card" style="background-color: #ffe9d2ff; padding:15px; border-radius: 10px;" >
                    <h3>${story.title}</h3>
                    <div class="story-content">
                        <div class="chinese-text" >${story.content}</div>
                        <div class="myanmar-translation">${story.translation}</div>
                    </div>
                    <div class="story-vocab">
                        <h4>Vocabulary:</h4>
                        <div class="vocab-tags">
                            ${story.vocabulary.map(word => `
                                <span class="vocab-tag">
                                    ${word}
                                    <button class="speak-btn small" data-text="${word}" data-lang="zh-CN">
                                        
                                    </button>
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    <button class="speak-btn" data-text="${story.content.replace(/<[^>]*>/g, '')}" data-lang="zh-CN">
                        <i class="fas fa-volume-up"></i> Read Aloud
                    </button>
                </div>
            `;
        });
        
        storyContainer.innerHTML = html + '</div>';
    },

    // Story data
    getStoryData: function() {
        return [
            {
                title: "My First Day in China",
                content: `
                    <div class="chinese-text-with-pinyin">
  <p class="pinyin">nǐ hǎo！ wǒ jiào xiǎo míng。 wǒ shì xué shēng。 wǒ shì měi guó rén。</p>
  <p>你好！我叫小明。我是学生。我是美国人。</p>
  
  <p class="pinyin">jīn tiān shì wǒ zài zhōng guó de dì yī tiān。 wǒ hěn gāo xìng！</p>
  <p>今天是我在中国的第一天。我很高兴！</p>
  
  <p class="pinyin">wǒ rèn shí le yī gè xīn péng you。 tā shuō："nǐ hǎo！" wǒ shuō："nǐ hǎo！"</p>
  <p>我认识了一个新朋友。他说："你好！" 我说："你好！"</p>
  
  <p class="pinyin">zhōng guó hěn hǎo！</p>
  <p>中国很好！</p>
</div>
                `,
                translation: `
<div class="burmese-text-container">
  <p>မင်္ဂလာပါ။ ကျွန်တော့်နာမည်က <em>Xiao Ming</em> ပါ။ ကျွန်တော်ကျောင်းသားပါ။ ကျွန်တော်အမေရိကန်လူမျိုးပါ။</p>
  <p>ဒီနေ့ဟာကျွန်တော်တရုတ်ပြည်မှာပထမဆုံးနေ့ပါ။ ကျွန်တော်အရမ်းပျော်ပါတယ်။</p>
  <p>ကျွန်တော်သူငယ်ချင်းအသစ်တစ်ယောက်နဲ့တွေ့ပါတယ်။ သူက "မင်္ဂလာပါ" လို့ပြောတယ်။ ကျွန်တော်လည်း "မင်္ဂလာပါ" လို့ပြန်ပြောတယ်။</p>
  <p>တရုတ်ပြည်ကအရမ်းကောင်းတယ်။</p>
</div>
                `,
                vocabulary: ["你好", "叫", "是", "学生", "美国人", "今天", "中国", "天", "高兴", "认识", "新", "朋友", "说"]
            },
            // Add more stories here
        ];
    },

    // Video tab
    initVideoTab: function() {
        const videoContainer = document.getElementById('video');
        if (!videoContainer) return;
        
        const videos = this.getVideoData();
        let html = `
            <h2>HSK 1 Video Lessons</h2>
            <div class="video-controls">
                <input type="text" id="video-search" placeholder="Search videos...">
            </div>
            <div class="video-grid">
        `;
        
        videos.forEach(video => {
            html += `
                <div class="video-card">
                    <h3><a href="${video.url}" target="_blank">${video.title}</a></h3>
                    <p>${video.description}</p>
                    <div class="video-wrapper">
                        <iframe src="${video.embedUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>
                    <a href="${video.url}" target="_blank" class="watch-link">
                        Watch on YouTube
                    </a>
                </div>
            `;
        });
        
        videoContainer.innerHTML = html + '</div>';
        
        // Add search functionality
        document.getElementById('video-search')?.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.video-card').forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    },

    // Video data
    getVideoData: function() {
        return [
            {
                title: "HSK 1 Full Course",
                description: "Complete HSK 1 course from YaYa Mandarin channel",
                url: "https://youtu.be/URfKUa1ic3E",
                embedUrl: "https://www.youtube.com/embed/URfKUa1ic3E"
            },
            // Add more videos here
        ];
    },

    // Lesson data
    getLessonData: function(lessonNum) {
        const lessons = this.getLessonsData();
        
        if (lessons[lessonNum]) {
            const lesson = lessons[lessonNum];
            let html = `
                <div class="lesson-content">
                    <div class="lesson-header">
                        <h2 class="lesson-title">${lesson.title}</h2>
                        <div class="lesson-audio">
                            <button class="play-all-btn" data-audio="${lesson.audio}">
                                <i class="fas fa-play"></i> Play Full Lesson
                            </button>
                        </div>
                    </div>
            `;
            
            lesson.sections.forEach(section => {
                html += `
                    <div class="lesson-section">
                        <h3>${section.title}</h3>
                        <div class="lesson-text">
                            ${section.content}
                        </div>
                        <div class="lesson-vocab">
                            <h4>New Words</h4>
                            ${section.vocabulary.join('')}
                        </div>
                    </div>
                `;
            });
            
            // Add overall voice button at the end
            html += `
                <div class="lesson-footer">
                    <button class="speak-all-btn" data-text="${lesson.fullText}">
                        <i class="fas fa-volume-up"></i> Read Entire Lesson
                    </button>
                </div>
                </div>
            `;
            
            return html;
        }
        
        return `<div class="lesson-content"><p>Lesson content will be displayed here.</p></div>`;
    },

    // Lessons data
    getLessonsData: function() {
        return {
            '1': {
                title: "Lesson 1: Greetings",
                audio: "lessons/lesson1.mp3",
                sections: [
                    {
                        title: "你好 Hello",
                        content: `
                            <h4>课文 Text</h4>
                            <div class="dialogue">
                                <div class="dialogue-line">
                                    <strong>A:</strong> 你好！ (Nǐ hǎo!)
                                    <button class="speak-btn" data-text="你好" data-lang="zh-CN">
                                        <i class="fas fa-volume-up"></i>
                                    </button>
                                </div>
                                <div class="dialogue-line">
                                    <strong>B:</strong> 你好！ (Nǐ hǎo!)
                                    <button class="speak-btn" data-text="你好" data-lang="zh-CN">
                                        <i class="fas fa-volume-up"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="myanmar-translation">
                                <div>A: မင်္ဂလာပါ</div>
                                <div>B: မင်္ဂလာပါ</div>
                            </div>
                        `,
                        vocabulary: [
                            this.createVocabItem("你", "nǐ", "pron. you", "မင်း"),
                            this.createVocabItem("好", "hǎo", "adj. good", "ကောင်းတယ်"),
                            this.createVocabItem("您", "nín", "pron. you (polite)", "ခင်ဗျား")
                        ]
                    },
                    // Add more sections here
                ],
                fullText: "你好！你好！你好吗？我很好，谢谢！"
            },
            // Add more lessons here
        };
    },

    // Helper to create vocabulary items
    createVocabItem: function(chinese, pinyin, english, myanmar) {
        return `
            <div class="vocab-item">
                <div class="vocab-chinese">${chinese}</div>
                <div class="vocab-pinyin">${pinyin}</div>
                <div class="vocab-meaning">
                    <div>${english}</div>
                    <div class="myanmar-translation">${myanmar}</div>
                </div>
                <button class="speak-btn" data-text="${chinese}" data-lang="zh-CN">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
        `;
    },

    // Event delegation setup
    setupEventDelegation: function() {
        document.addEventListener('click', (e) => {
            // Speak button handler
            if (e.target.closest('.speak-btn')) {
                const btn = e.target.closest('.speak-btn');
                const text = btn.getAttribute('data-text');
                const lang = btn.getAttribute('data-lang') || 'zh-CN';
                this.speak(text, lang);
            }
            
            // "Read Entire Lesson" button
            if (e.target.closest('.speak-all-btn')) {
                const btn = e.target.closest('.speak-all-btn');
                const text = btn.getAttribute('data-text');
                this.speak(text, 'zh-CN');
            }
            
            // "Play Full Lesson" button
            if (e.target.closest('.play-all-btn')) {
                const btn = e.target.closest('.play-all-btn');
                const audioFile = btn.getAttribute('data-audio');
                this.playAudio(audioFile);
            }
        });
    },

    // Play audio file
    playAudio: function(filePath) {
        const audio = new Audio(filePath);
        audio.play().catch(e => console.error("Audio playback failed:", e));
    }
};


