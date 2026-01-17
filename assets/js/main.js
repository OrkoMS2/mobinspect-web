// ============================================
// MobInspect Website - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavbar();
  initMobileMenu();
  initFAQ();
  initAnimations();
  initCounters();
  initComingSoon();
  initContactForm();
});

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Check if navbar should always be scrolled (inner pages)
  const isInnerPage = navbar.classList.contains('scrolled');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when page is scrolled
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else if (!isInnerPage) {
      // Only remove scrolled class on home page
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');

    // Animate hamburger to X
    const spans = menuToggle.querySelectorAll('span');
    if (menuToggle.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('active');
    });
  });
}

// ============================================
// FAQ Accordion
// ============================================
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
        }
      });

      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// ============================================
// Scroll Animations (Intersection Observer)
// ============================================
function initAnimations() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  const animatableElements = document.querySelectorAll(
    '.feature-card, .step, .stat-item, .team-member, .content-card'
  );

  // Group elements by their parent section for stagger effect within sections only
  const sections = new Map();
  animatableElements.forEach(el => {
    const section = el.closest('section') || el.closest('.container') || document.body;
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section).push(el);
  });

  // Apply animations with faster timing and section-based stagger
  sections.forEach(elements => {
    elements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      // Faster animation (0.3s) with minimal stagger (0.03s) capped at 0.15s max delay
      const delay = Math.min(index * 0.03, 0.15);
      el.style.transition = `opacity 0.3s ease ${delay}s, transform 0.3s ease ${delay}s`;
      observer.observe(el);
    });
  });
}

// Add CSS for animated elements
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ============================================
// Counter Animation
// ============================================
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const text = element.textContent;
  const hasPlus = text.includes('+');
  const hasK = text.includes('K');
  const hasPercent = text.includes('%');

  let target = parseInt(text.replace(/[^0-9]/g, ''));
  if (hasK) target = target; // Keep as is for display

  const duration = 2000;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    let displayValue = current.toString();
    if (hasK) displayValue += 'K';
    if (hasPlus) displayValue += '+';
    if (hasPercent) displayValue += '%';

    element.textContent = displayValue;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ============================================
// Form Validation & Submission
// ============================================
function initContactForm() {
  // Check for success parameter (after FormSubmit redirect)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('success') === 'true') {
    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    // Clean up URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const form = document.querySelector('.contact-form');
  if (!form) return;

  // Add visual feedback on form submission
  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 0.5rem;">Sending... <span class="spinner"></span></span>';
      submitBtn.disabled = true;
    }
  });

  // Add validation styling
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        input.style.borderColor = 'var(--danger)';
      } else {
        input.style.borderColor = 'var(--success)';
      }
    });

    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.style.borderColor = 'var(--success)';
      }
    });
  });
}

// Add spinner styles
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(spinnerStyle);

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'info') {
  // Remove existing notification of same type
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;

  // Add styles if not already added
  if (!document.querySelector('#notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'notification-styles';
    styles.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 9999;
        animation: slideInTop 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      }
      .notification-success { border-color: var(--success); background: rgba(0, 255, 136, 0.1); }
      .notification-error { border-color: var(--danger); background: rgba(255, 51, 102, 0.1); }
      .notification-warning { border-color: var(--warning); background: rgba(255, 184, 0, 0.1); }
      .notification-info { border-color: var(--primary); background: rgba(0, 245, 255, 0.1); }
      .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
      .notification-close:hover {
        color: var(--text-primary);
      }
      @keyframes slideInTop {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideOutTop {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
      }
    `;
    document.head.appendChild(styles);
  }

  document.body.appendChild(notification);

  // Close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.style.animation = 'slideOutTop 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  });

  // Auto remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = 'slideOutTop 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 4000);
}

// ============================================
// Coming Soon Handler for Placeholder Links
// ============================================
function initComingSoon() {
  // Select all links with href="#" that are not anchor scroll links
  const placeholderLinks = document.querySelectorAll('a[href="#"]:not([href^="#download"]):not([href^="#features"])');

  placeholderLinks.forEach(link => {
    // Skip links that have meaningful IDs/anchors
    const href = link.getAttribute('href');
    if (href && href.length > 1) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('Coming Soon! This feature is under development.', 'warning');
    });
  });

  // Also handle social media links that are placeholders
  const socialLinks = document.querySelectorAll('.social-links a[href="#"]');
  socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showNotification('Social media links coming soon!', 'warning');
    });
  });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// Active Nav Link Highlight
// ============================================
function highlightActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  // Only select anchor links (starting with #) for scroll highlighting
  const anchorLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  // Don't run on subpages - only on home page
  if (window.location.pathname.includes('tutorial') ||
      window.location.pathname.includes('help') ||
      window.location.pathname.includes('about') ||
      window.location.pathname.includes('contact') ||
      window.location.pathname.includes('privacy')) {
    return;
  }

  window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    // Only modify anchor links, not page links
    anchorLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Initialize if there are sections with IDs
if (document.querySelectorAll('section[id]').length > 0) {
  highlightActiveNavLink();
}
