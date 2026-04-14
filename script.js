/* ═══════════════════════════════════════
   UDIT FRESH FOODS — Interactions
═══════════════════════════════════════ */

/* ─── Navbar scroll effect ─────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── Mobile hamburger ──────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Scroll Reveal ─────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ─── Smooth active nav link ─────────── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(link => {
        link.classList.toggle(
          'active-link',
          link.getAttribute('href') === `#${id}`
        );
      });
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(s => sectionObserver.observe(s));

/* ─── Counter animation for hero stats ─ */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isYear = target > 2000;

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = isYear
      ? Math.floor(1970 + (target - 1970) * eased)
      : Math.floor(target * eased);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent.trim();
        const match = text.match(/^(\d+)(.*)$/);
        if (match) {
          const val = parseInt(match[1]);
          const suffix = match[2] || '';
          animateCounter(num, val, suffix);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ─── Form validation helpers ───────── */
function showError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  field.classList.add('input-error');
  let err = field.parentElement.querySelector('.field-error');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-error';
    field.parentElement.appendChild(err);
  }
  err.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  document.querySelectorAll('.field-error').forEach(el => el.remove());
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) {
    showError('name', 'Please enter your name.');
    valid = false;
  }

  if (!email) {
    showError('email', 'Please enter your email address.');
    valid = false;
  } else if (!emailRegex.test(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  return valid;
}

/* ─── Contact form ──────────────────── */
async function handleSubmit(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      form.style.display = 'none';
      success.style.display = 'block';
    } else {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      alert('Something went wrong. Please try again or email us directly.');
    }
  } catch {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    alert('Could not send message. Please check your connection and try again.');
  }
}

/* ─── Parallax on hero shapes ────────── */
document.addEventListener('mousemove', (e) => {
  const shapes = document.querySelectorAll('.shape');
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  shapes.forEach((shape, i) => {
    const factor = (i + 1) * 0.4;
    shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

/* ─── Clear field error on input ────── */
['name', 'email'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('input-error');
    const err = el.parentElement.querySelector('.field-error');
    if (err) err.remove();
  });
});

/* ─── Add active-link style dynamically ─ */
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active-link {
    background: var(--green-light);
    color: var(--green);
  }
`;
document.head.appendChild(style);
