/**
 * SAJITH S - PORTFOLIO INTERACTIVITY SCRIPT
 * Vanilla JavaScript (No external framework dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initBackgroundCanvas();
  initTypewriter();
  initNavigation();
  initTiltEffect();
  initQuizSimulationTimer();
  initProjectModal();
  initGmailAndContact();
  initScrollReveal();
});

/* ==========================================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('sajith_theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('sajith_theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CANVAS BACKGROUND (PARTICLE CONSTELLATION)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 16000), 55);

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2.5;
          this.y -= (dy / distance) * force * 2.5;
        }
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? '99, 102, 241' : '79, 70, 229';

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. HERO TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const phrases = [
    'Second Year KGCAS Student',
    'Java Capstone Developer',
    'Problem Solver from Mettupalayam',
    'Tech & Coding Enthusiast'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 80;
  const deletingSpeed = 45;
  const pauseEnd = 1800;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typedTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      setTimeout(() => {
        isDeleting = true;
        type();
      }, pauseEnd);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }

    const nextTimeout = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, nextTimeout);
  }

  type();
}

/* ==========================================================================
   4. NAVIGATION, SCROLLSPY & MOBILE DRAWER
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.nav-link');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const sections = document.querySelectorAll('section[id]');

  // Navbar shrink on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link tracker
    let currentSectionId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-nav') === currentSectionId);
      });
      drawerLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('data-nav') === currentSectionId);
      });
    }
  });

  // Mobile toggle
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        mobileDrawer.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileDrawer.classList.add('open');
        mobileBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close drawer when clicking a link
    drawerLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* ==========================================================================
   5. 3D CARD TILT EFFECT (HERO PHOTO & CARDS)
   ========================================================================== */
function initTiltEffect() {
  const tiltCard = document.getElementById('photo-card');
  if (!tiltCard) return;

  const innerCard = tiltCard.querySelector('.photo-card-inner');

  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    innerCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  tiltCard.addEventListener('mouseleave', () => {
    innerCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ==========================================================================
   6. QUIZ SIMULATION TIMER (FLAGSHIP CARD ACCENT)
   ========================================================================== */
function initQuizSimulationTimer() {
  const timerElement = document.getElementById('sim-timer');
  if (!timerElement) return;

  let totalSeconds = 9 * 60 + 42; // 09:42 initial

  setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      totalSeconds = 15 * 60; // Reset simulation loop
    }
  }, 1000);
}

/* ==========================================================================
   7. PROJECT DEEP-DIVE MODAL
   ========================================================================== */
function initProjectModal() {
  const openBtn = document.getElementById('preview-modal-open');
  const closeBtn = document.getElementById('modal-close');
  const modal = document.getElementById('project-modal');

  if (!openBtn || !closeBtn || !modal) return;

  const openModal = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   8. GMAIL TOGGLE, CLIPBOARD COPY & QUICK COMPOSER
   ========================================================================== */
function initGmailAndContact() {
  const TARGET_EMAIL = 'sajithsappu21.09@gmail.com';
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const contactForm = document.getElementById('contact-form');
  const fallbackBtn = document.getElementById('mailto-fallback-btn');
  const formFeedback = document.getElementById('form-feedback');

  // Copy Email to Clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(TARGET_EMAIL);
        if (copyBtnText) copyBtnText.textContent = 'Copied ✓';
        showToast(`Email copied: ${TARGET_EMAIL}`);
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy Email';
        }, 2500);
      } catch (err) {
        // Fallback prompt if clipboard API is restricted
        prompt('Copy Sajith\'s email:', TARGET_EMAIL);
      }
    });
  }

  // Quick Form submission -> Construct Direct Gmail Compose URL
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name')?.value.trim() || 'Visitor';
      const subject = document.getElementById('sender-subject')?.value.trim() || 'Portfolio Collaboration';
      const rawMessage = document.getElementById('sender-message')?.value.trim() || '';

      if (!rawMessage) {
        if (formFeedback) {
          formFeedback.textContent = 'Please enter your message before sending.';
          formFeedback.style.color = '#ef4444';
        }
        return;
      }

      // Format Body nicely with sender signature
      const fullBody = `Hi Sajith,\n\n${rawMessage}\n\nBest regards,\n${name}`;
      
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(fullBody);

      // Direct Web Gmail Compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${TARGET_EMAIL}&su=${encodedSubject}&body=${encodedBody}`;

      // Open Gmail in new tab
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');

      if (formFeedback) {
        formFeedback.textContent = '🚀 Opening Gmail with your pre-filled message...';
        formFeedback.className = 'form-feedback success';
      }

      showToast('Redirecting to Gmail with your draft!');
    });
  }

  // Fallback to mailto link
  if (fallbackBtn) {
    fallbackBtn.addEventListener('click', () => {
      const name = document.getElementById('sender-name')?.value.trim() || 'Visitor';
      const subject = document.getElementById('sender-subject')?.value.trim() || 'Portfolio Collaboration';
      const rawMessage = document.getElementById('sender-message')?.value.trim() || 'Hello Sajith,';

      const fullBody = `Hi Sajith,\n\n${rawMessage}\n\nBest regards,\n${name}`;
      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;

      window.location.href = mailtoUrl;
    });
  }
}

/* ==========================================================================
   9. SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   10. TOAST NOTIFICATION HELPER
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
