(() => {
  // --- Typing effect ---
  const ROLES = ['풀스택 개발자', 'Problem Solver', 'Full Stack Developer', '보안 전문가'];
  const typingEl = document.getElementById('typing-role');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = ROLES[roleIndex];
    const displayed = isDeleting
      ? current.slice(0, charIndex--)
      : current.slice(0, charIndex++);

    typingEl.textContent = displayed;

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex > current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex < 0) {
      isDeleting = false;
      charIndex = 0;
      roleIndex = (roleIndex + 1) % ROLES.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  // --- Scroll fade-in with Intersection Observer ---
  function initFadeIn() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
  }

  // --- Active nav link on scroll ---
  function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.getElementById('navbar');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((s) => observer.observe(s));

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
      nav.classList.toggle('bg-slate-900/95', window.scrollY > 20);
      nav.classList.toggle('backdrop-blur-sm', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile menu toggle ---
  function initMobileMenu() {
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');

    btn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open', !isOpen);
      menu.classList.toggle('hidden', isOpen);
      iconOpen.classList.toggle('hidden', !isOpen);
      iconClose.classList.toggle('hidden', isOpen);
    });

    // Close on link click
    menu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        menu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
      });
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', () => {
    type();
    initFadeIn();
    initNavHighlight();
    initMobileMenu();
  });
})();
