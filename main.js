document.addEventListener('DOMContentLoaded', () => {
  // 👇 Set page-specific filter:
  const PAGE_STATUS = 'In Progress'; // Use 'Completed' for completed page

  // --- SECURITY CHECK: Validate login before loading content ---
  const userJSON = localStorage.getItem('currentUser');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Important: This client-side check can be bypassed by users.
  // For real security, validate login token/session on backend before serving this page.

  if (!userJSON || !isLoggedIn) {
    alert('Please log in first.');
    window.location.href = 'index.html';  // Redirect to login page
    return; // Stop further execution if not logged in
  }

  const user = JSON.parse(userJSON);

  // ---- Your existing code ----
  const courseCards = document.querySelectorAll('.course-card');
  const searchInput = document.querySelector('.search-input');
  const resumeButton = document.querySelector('.resume-button');
  const sectionTitle = document.querySelector('.section-title');
  const logoutButton = document.querySelector('.logout-button');
  const header = document.querySelector('.dashboard-header');

  const normalize = str => str.replace(/\s+/g, '').toLowerCase();

  function extractHSKLevel(title) {
    const match = title.match(/hsk\s*(\d+)/i);
    return match ? `hsk${match[1]}`.toLowerCase() : '';
  }

  function filterAccessibleCourses() {
    const paidLevels = (user.paidLevels || []).map(level => normalize(level));

    courseCards.forEach(card => {
      const titleText = card.querySelector('.course-title')?.textContent || '';
      const titleNormalized = normalize(titleText);
      const courseLevel = extractHSKLevel(titleText);

      const hasAccess =
        paidLevels.includes('all') ||
        paidLevels.includes(courseLevel) ||
        titleNormalized.includes('free') ||
        titleNormalized.includes('hsklearning-english');

      if (hasAccess) {
        card.dataset.hasAccess = 'true';
        if (!card.dataset.status) {
          card.dataset.status = 'To do';
        }
      } else {
        card.dataset.hasAccess = 'false';
      }
    });
  }

  function filterByPageStatus() {
    if (sectionTitle) {
      sectionTitle.textContent = `HSK Learning - ${PAGE_STATUS}`;
    }

    courseCards.forEach(card => {
      const hasAccess = card.dataset.hasAccess === 'true';
      const status = card.dataset.status || 'To do';

      if (hasAccess && (PAGE_STATUS === 'All' || status === PAGE_STATUS)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  function setupSearch() {
    if (!searchInput) return;
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const term = normalize(searchInput.value);

        courseCards.forEach(card => {
          if (card.dataset.hasAccess !== 'true') {
            card.style.display = 'none';
            return;
          }

          const status = card.dataset.status || 'To do';
          if (PAGE_STATUS !== 'All' && status !== PAGE_STATUS) {
            card.style.display = 'none';
            return;
          }

          const title = normalize(card.querySelector('.course-title')?.textContent || '');
          const lessons = Array.from(card.querySelectorAll('.course-item')).map(item =>
            normalize(item.textContent)
          );

          const matches = title.includes(term) || lessons.some(text => text.includes(term));
          card.style.display = matches ? '' : 'none';
        });
      }, 300);
    });
  }

  function setupInteractions() {
    courseCards.forEach(card => {
      card.addEventListener('click', e => {
        if (!e.target.classList.contains('course-item')) {
          console.log(`Selected course: ${card.querySelector('.course-title')?.textContent || ''}`);
        }
      });

      card.querySelectorAll('.course-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.style.transform = 'translateY(-2px)';
          item.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        item.addEventListener('mouseleave', () => {
          item.style.transform = '';
          item.style.boxShadow = '';
        });
        item.addEventListener('click', e => {
          e.stopPropagation();
          console.log(`Selected lesson: ${item.textContent}`);
        });
      });
    });
  }

  function showToast(message, color = '#333') {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: color,
      color: '#fff',
      padding: '10px 20px',
      borderRadius: '5px',
      zIndex: '1000',
      opacity: '1',
      transition: 'opacity 0.5s ease',
    });
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 2500);
  }

  function updateHeader() {
    if (!header) return;
    const hour = new Date().getHours();
    header.style.background =
      hour >= 6 && hour < 18
        ? 'linear-gradient(135deg, #f5f7fa, #e4e8eb)'
        : 'linear-gradient(135deg, #2c3e50, #1a2530)';
  }

  function setupLogoutButton() {
    if (!logoutButton) return;
    logoutButton.addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        logoutButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging out...';
        logoutButton.disabled = true;
        setTimeout(() => {
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('currentUser');
          window.location.href = 'index.html';
        }, 1000);
      }
    });
  }

  function setupResume() {
    if (!resumeButton) return;
    resumeButton.addEventListener('click', function () {
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resuming...';
      this.disabled = true;
      setTimeout(() => {
        this.innerHTML = 'Resume course';
        this.disabled = false;
        showToast('Course resumed successfully!', '#43a047');
      }, 1500);
    });
  }

  function setupAnimations() {
    if (typeof gsap === 'undefined') return;
    gsap.from('.dashboard-header', { duration: 0.8, y: -50, opacity: 0, ease: 'power2.out' });
    gsap.from('.course-card', {
      duration: 0.5,
      y: 20,
      opacity: 0,
      stagger: 0.1,
      delay: 0.3,
      ease: 'power1.out',
    });
  }

  // --- Initialization ---
  filterAccessibleCourses();
  filterByPageStatus();
  setupSearch();
  setupInteractions();
  setupResume();
  setupLogoutButton();
  updateHeader();
  setupAnimations();
});
