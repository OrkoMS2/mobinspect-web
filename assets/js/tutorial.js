// ============================================
// Tutorial Page - Visual Effects & Animations
// ============================================

// Visual Effects - Particles
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 15 + 's';
    p.style.animationDuration = (Math.random() * 10 + 10) + 's';
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.width = (Math.random() * 4 + 2) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);
  }
}

// Visual Effects - Data Stream
function createDataStream() {
  const container = document.getElementById('dataStream');
  if (!container) return;

  const chars = '01アイウエオカキクケコサシスセソ';
  for (let i = 0; i < 30; i++) {
    const char = document.createElement('div');
    char.className = 'data-char';
    char.textContent = chars[Math.floor(Math.random() * chars.length)];
    char.style.left = (i * (100 / 30)) + '%';
    char.style.animationDelay = Math.random() * 8 + 's';
    char.style.animationDuration = (Math.random() * 5 + 5) + 's';
    container.appendChild(char);
  }
}

// Scroll Animations for Tutorial Steps
function initScrollAnimations() {
  const steps = document.querySelectorAll('.tutorial-step[data-step]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  steps.forEach(s => observer.observe(s));
}

// Video Frame Glow Effect on Hover
function initVideoEffects() {
  const videoFrame = document.getElementById('videoFrame');
  if (!videoFrame) return;

  videoFrame.addEventListener('mouseenter', () => {
    videoFrame.classList.add('video-playing');
  });
  videoFrame.addEventListener('mouseleave', () => {
    videoFrame.classList.remove('video-playing');
  });
}

// Initialize all tutorial effects
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createDataStream();
  initScrollAnimations();
  initVideoEffects();
});
