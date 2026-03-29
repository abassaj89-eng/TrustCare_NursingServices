// ===== LOGO LIGHTBOX =====
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('logo-lightbox');
  document.querySelectorAll('.logo-preview-trigger').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      lightbox.style.display = 'flex';
    });
  });
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.style.display = 'none';
  });
});

// ===== NAVBAR SCROLL =====
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== NAVBAR DROPDOWNS (hover desktop, tap mobile) =====
const dropdownWraps = document.querySelectorAll('.navbar__dropdown-wrap');
const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

dropdownWraps.forEach(wrap => {
  const toggle = wrap.querySelector('.navbar__dropdown-toggle');

  // Mobile: tap to toggle dropdown; Desktop: allow navigation
  toggle?.addEventListener('click', (e) => {
    if (isTouchDevice()) {
      e.preventDefault();
      const isOpen = wrap.classList.contains('open');
      dropdownWraps.forEach(w => w.classList.remove('open'));
      if (!isOpen) wrap.classList.add('open');
    }
    // On desktop: allow default navigation via data-wizard-page
  });
});

// Close mobile dropdowns on outside tap
document.addEventListener('click', (e) => {
  if (!e.target.closest('.navbar__dropdown-wrap')) {
    dropdownWraps.forEach(w => w.classList.remove('open'));
  }
});

// ===== MOBILE MENU =====
const toggle = document.querySelector('.navbar__toggle');
const mobileMenu = document.querySelector('.mobile-menu');

toggle?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = toggle.querySelectorAll('span');
  const isOpen = mobileMenu.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity  = isOpen ? '0' : '1';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
});

// ===== ACCORDION =====
document.querySelectorAll('.accordion__header').forEach(header => {
  header.addEventListener('click', () => {
    const item = header.closest('.accordion__item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion__item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Open first accordion item by default
const firstAccordion = document.querySelector('.accordion__item');
if (firstAccordion) firstAccordion.classList.add('open');

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

function attachRevealObserver() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}
attachRevealObserver();

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = '1';
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

function attachCounterObserver() {
  document.querySelectorAll('[data-target]:not([data-animated])').forEach(el => counterObserver.observe(el));
}
attachCounterObserver();

// ===== FORM SUBMIT (Formspree AJAX) =====
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (res.ok) {
        btn.textContent = 'Sent ✓';
        btn.style.background = '#014B11';
        form.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.textContent = 'Error — please try again';
      btn.style.background = '#dc2626';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
});

// ========================================================
//  WIZARD + TAB NAVIGATION
// ========================================================

const PAGES = [
  { id: 'page-home',       label: 'Home' },
  { id: 'page-services',   label: 'Services' },
  { id: 'page-hi',         label: 'High Intensity' },
  { id: 'page-about',      label: 'About' },
  { id: 'page-blog',       label: 'Resources' },
  { id: 'page-work',       label: 'Work With Us' },
  { id: 'page-refer',      label: 'Refer' },
  { id: 'page-contact',    label: 'Contact' },
  { id: 'page-complaints', label: 'Complaints' },
  { id: 'page-feedback',   label: 'Feedback' },
];

let currentPage = 0;

function goToPage(index, anchorId) {
  if (index < 0 || index >= PAGES.length) return;

  // Hide current
  const prev = document.querySelector('.wizard-page.active');
  if (prev) { prev.classList.remove('active'); prev.setAttribute('aria-hidden', 'true'); }

  // Show new
  const next = document.getElementById(PAGES[index].id);
  if (!next) return;
  next.classList.add('active');
  next.removeAttribute('aria-hidden');

  currentPage = index;

  // Update active navbar link
  document.querySelectorAll('.navbar__nav a[data-wizard-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.wizardPage === PAGES[index].id);
  });

  // Update wizard nav
  document.getElementById('wizLabel').textContent = PAGES[index].label;
  updateDots();
  updateNavButtons();

  // Close any open navbar dropdowns
  dropdownWraps.forEach(w => w.classList.remove('open'));
  // Close mobile menu
  mobileMenu && mobileMenu.classList.remove('open');

  // Scroll
  if (anchorId) {
    requestAnimationFrame(() => {
      const el = document.getElementById(anchorId);
      if (el) {
        const offset = 88; // navbar only
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Re-attach observers and force-animate counters in newly visible page
  setTimeout(() => {
    attachRevealObserver();
    attachCounterObserver();
    // Force animate any counters in the active page that haven't run yet
    next.querySelectorAll('[data-target]:not([data-animated])').forEach(el => {
      animateCounter(el);
    });
  }, 100);
}

// ===== DOT GENERATION =====
function generateDots() {
  const container = document.getElementById('wizDots');
  if (!container) return;
  container.innerHTML = PAGES.map((p, i) =>
    `<button class="wiz-dot${i === 0 ? ' active' : ''}" data-index="${i}" title="${p.label}" aria-label="Go to ${p.label}"></button>`
  ).join('');
  container.querySelectorAll('.wiz-dot').forEach(dot => {
    dot.addEventListener('click', () => goToPage(parseInt(dot.dataset.index)));
  });
}

function updateDots() {
  document.querySelectorAll('.wiz-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentPage);
  });
}

function updateNavButtons() {
  const prev = document.getElementById('wizPrev');
  const next = document.getElementById('wizNext');
  if (prev) prev.disabled = currentPage === 0;
  if (next) next.disabled = currentPage === PAGES.length - 1;
}

// ===== WIZARD PREV / NEXT =====
document.getElementById('wizPrev')?.addEventListener('click', () => {
  if (currentPage > 0) goToPage(currentPage - 1);
});
document.getElementById('wizNext')?.addEventListener('click', () => {
  if (currentPage < PAGES.length - 1) goToPage(currentPage + 1);
});

// ===== data-wizard-page LINKS (navbar, footer, cards, buttons, legal pages) =====
document.querySelectorAll('[data-wizard-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.dataset.wizardPage;
    const anchor = el.dataset.anchor || null;
    const idx = PAGES.findIndex(p => p.id === pageId);
    if (idx >= 0) {
      goToPage(idx, anchor);
    } else {
      // Legal / supplementary page not in PAGES — show directly without touching wizard nav
      const prev = document.querySelector('.wizard-page.active');
      if (prev) { prev.classList.remove('active'); prev.setAttribute('aria-hidden', 'true'); }
      const target = document.getElementById(pageId);
      if (target) {
        target.classList.add('active');
        target.removeAttribute('aria-hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(currentPage + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(currentPage - 1);
});

// ===== INIT =====
generateDots();
updateNavButtons();
// Set initial active navbar link
document.querySelectorAll('.navbar__nav a[data-wizard-page]').forEach(a => {
  a.classList.toggle('active', a.dataset.wizardPage === PAGES[0].id);
});
// Force-animate counters visible on the initial home page
setTimeout(() => {
  document.getElementById('page-home')?.querySelectorAll('[data-target]:not([data-animated])').forEach(el => {
    animateCounter(el);
  });
}, 300);

// ===== BLOG: SEARCH + CATEGORIES + READ MORE =====
function toggleBlog(btn) {
  const full = btn.previousElementSibling;
  const isOpen = full.style.display === 'block';
  full.style.display = isOpen ? 'none' : 'block';
  btn.textContent = isOpen ? 'Read More ↓' : 'Read Less ↑';
}

function searchBlogs() {
  const query = document.getElementById('blogSearch')?.value.toLowerCase() || '';
  document.querySelectorAll('.blog-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(query) ? '' : 'none';
  });
}

document.getElementById('blogSearch')?.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') searchBlogs();
});

document.querySelectorAll('.blog-cat').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.blog-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.blog-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
    // Reset search
    const searchEl = document.getElementById('blogSearch');
    if (searchEl) searchEl.value = '';
  });
});

// ===== JOB APPLICATION MODAL =====
function openApplyModal(jobTitle) {
  document.getElementById('applyJobTitle').textContent = jobTitle;
  document.getElementById('applySubject').value = 'Job Application — ' + jobTitle;
  // Pre-select role in dropdown
  const select = document.querySelector('#applyForm select[name="role"]');
  if (select) {
    Array.from(select.options).forEach(opt => {
      if (opt.text.includes(jobTitle.split('—')[0].trim()) || opt.value.includes(jobTitle.toLowerCase().replace(/\s/g,'-').slice(0,8))) {
        select.value = opt.value;
      }
    });
  }
  const modal = document.getElementById('applyModal');
  modal.style.display = 'flex';  // flex so centering works
  document.body.style.overflow = 'hidden';
}

function closeApplyModal() {
  document.getElementById('applyModal').style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeApplyModal();
});

document.getElementById('applyForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Sending...';
  try {
    const formData = new FormData(e.target);
    const res = await fetch('/', { method: 'POST', body: formData });
    if (res.ok) {
      btn.textContent = 'Application Sent ✓';
      btn.style.background = '#014B11';
      e.target.reset();
      setTimeout(() => { closeApplyModal(); btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
    } else { throw new Error(); }
  } catch {
    btn.textContent = 'Error — please try again';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
  }
});

// ===== CAREERS: SEARCH + FILTER =====
let activeJobFilter = 'all';

function setJobFilter(btn, filter) {
  document.querySelectorAll('.careers-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeJobFilter = filter;
  filterJobs();
}

function filterJobs() {
  const query = (document.getElementById('jobSearch')?.value || '').toLowerCase();
  const cards = document.querySelectorAll('.career-card');
  let visible = 0;
  cards.forEach(card => {
    const keywords = card.dataset.keywords || '';
    const title = card.querySelector('.career-card__title')?.textContent.toLowerCase() || '';
    const filterVal = card.dataset.filter || '';
    const matchFilter = activeJobFilter === 'all' || filterVal.includes(activeJobFilter);
    const matchSearch = !query || keywords.includes(query) || title.includes(query);
    const show = matchFilter && matchSearch;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  document.getElementById('noJobsMsg').style.display = visible === 0 ? 'block' : 'none';
  const sortEl = document.querySelector('.careers-list-sort');
  if (sortEl) sortEl.textContent = visible + ' role' + (visible !== 1 ? 's' : '') + ' available';
}
