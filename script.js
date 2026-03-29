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

// ===== FORM SUBMIT (Netlify Forms AJAX) =====
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    try {
      // Use FormData directly for multipart forms (file uploads); URLSearchParams for text-only
      const isMultipart = form.enctype === 'multipart/form-data';
      const body = isMultipart
        ? new FormData(form)
        : new URLSearchParams(new FormData(form)).toString();
      const headers = isMultipart ? {} : { 'Content-Type': 'application/x-www-form-urlencoded' };
      const res = await fetch('/', { method: 'POST', headers, body });
      if (res.ok) {
        const successUrl = form.name === 'referral' ? '/referral-received' : '/thank-you';
        window.location.href = successUrl;
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
  { id: 'page-governance', label: 'Governance' },
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
      window.location.href = '/thank-you';
    } else { throw new Error(); }
  } catch {
    btn.textContent = 'Error — please try again';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 3000);
  }
});

// ===== GOVERNANCE: POLICY SEARCH =====
function filterPolicies() {
  const query = (document.getElementById('govSearch')?.value || '').toLowerCase();
  const cards = document.querySelectorAll('.gov-policy-card');
  let visible = 0;
  cards.forEach(card => {
    const keywords = (card.dataset.keywords || '') + ' ' + card.textContent.toLowerCase();
    const show = !query || keywords.includes(query);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const noMsg = document.getElementById('noPoliciesMsg');
  if (noMsg) noMsg.style.display = visible === 0 ? 'block' : 'none';
}

// ===== GOVERNANCE: POLICY MODAL =====
const policyContent = {
  cc101: `
    <div style="margin-bottom:8px;"><span style="font-size:11px;background:#e0e9ff;color:#266AFB;font-weight:700;padding:4px 12px;border-radius:999px;">Policy #CC-101</span></div>
    <h2 style="color:var(--navy);font-size:22px;margin:16px 0 8px;">Clinical Care & Service Delivery</h2>
    <p style="color:#64748b;font-size:13px;margin-bottom:24px;">Effective: January 2026 — TrustCare Support</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">1. Scope of Clinical Services</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;margin-bottom:8px;">TrustCare Support provides high-intensity nursing services to NDIS participants via registered providers. Services include:</p>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li>Complex Wound Management</li><li>Enteral Feeding &amp; Management</li><li>Tracheostomy Care</li>
      <li>Urinary Catheter Management (Indwelling &amp; Suprapubic)</li><li>Subcutaneous Injections (e.g., Insulin)</li>
      <li>Clinical Assessments &amp; Care Planning</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">2. Practitioner Qualifications</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;margin-bottom:20px;">All clinical tasks are performed exclusively by AHPRA-registered Division 1 Registered Nurses (RN) or Enrolled Nurses (EN) under RN supervision.</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">3. Service Workflow</h3>
    <ol style="font-size:14px;color:#4a5568;line-height:1.9;margin-left:20px;margin-bottom:20px;">
      <li><strong>Referral:</strong> Provider submits a clinical referral via the secure portal.</li>
      <li><strong>Triage:</strong> A clinical lead RN reviews the referral within 24 hours.</li>
      <li><strong>Quotation:</strong> A detailed quote is issued to the provider.</li>
      <li><strong>Payment &amp; Dispatch:</strong> Once payment is confirmed, a nurse is dispatched.</li>
      <li><strong>Reporting:</strong> A clinical service report is provided to the Support Coordinator within 48 hours of completion.</li>
    </ol>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">4. Documentation Standards</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;">All clinical documentation must adhere to NMBA standards for practice. Documents are signed digitally by the attending AHPRA-registered professional.</p>
  `,
  im202: `
    <div style="margin-bottom:8px;"><span style="font-size:11px;background:#fee2e2;color:#dc2626;font-weight:700;padding:4px 12px;border-radius:999px;">Procedure #IM-202</span></div>
    <h2 style="color:var(--navy);font-size:22px;margin:16px 0 8px;">Incident Management & Reporting</h2>
    <p style="color:#64748b;font-size:13px;margin-bottom:24px;">Effective: October 2025 — TrustCare Support</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">1. Purpose</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;margin-bottom:20px;">To ensure all incidents involving participants, staff, or third parties are identified, reported, investigated, and documented in compliance with the NDIS Quality and Safeguards Commission requirements.</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">2. Incident Classification</h3>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li><strong>Reportable Incident:</strong> Any event that causes harm or risk of harm to a participant.</li>
      <li><strong>Near Miss:</strong> Events that could have caused harm but did not.</li>
      <li><strong>Critical Incident:</strong> Unexpected death, serious injury, or abuse of a participant.</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">3. Reporting Timeline</h3>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li>Critical incidents must be reported to the NDIS Commission within 24 hours.</li>
      <li>All other reportable incidents within 5 business days.</li>
      <li>Internal documentation completed within 48 hours of incident.</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">4. Post-Incident Review</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;">A root-cause analysis is conducted for all critical incidents. Findings are documented and used to update clinical procedures and prevent recurrence.</p>
  `,
  st303: `
    <div style="margin-bottom:8px;"><span style="font-size:11px;background:#dcfce7;color:#059669;font-weight:700;padding:4px 12px;border-radius:999px;">Guidelines #ST-303</span></div>
    <h2 style="color:var(--navy);font-size:22px;margin:16px 0 8px;">Staff Competency & Training</h2>
    <p style="color:#64748b;font-size:13px;margin-bottom:24px;">Effective: November 2025 — TrustCare Support</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">1. Competency Framework</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;margin-bottom:20px;">TrustCare Support follows the NDIS High Intensity Support Skills Descriptors. No staff member (TrustCare or Provider-staff) may perform high-intensity tasks without a verified competency assessment.</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">2. Assessment Process</h3>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li>Assessments are conducted by an AHPRA-registered RN.</li>
      <li>Includes a theoretical component and practical demonstration of skills.</li>
      <li>A 'Staff Training Verified' badge is issued upon successful completion.</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">3. Re-assessment & Renewal</h3>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li>Clinical competencies must be renewed every 12 months.</li>
      <li>Earlier renewal required if there is a change in the participant's clinical needs.</li>
      <li>The portal provides automated alerts 30 days prior to competency expiry.</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">4. Records Management</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;">Competency records are stored securely in the provider's portal and are audit-ready for NDIS Quality and Safeguards Commission reviews.</p>
  `,
  dr404: `
    <div style="margin-bottom:8px;"><span style="font-size:11px;background:#e0e9ff;color:#266AFB;font-weight:700;padding:4px 12px;border-radius:999px;">Policy #DR-404</span></div>
    <h2 style="color:var(--navy);font-size:22px;margin:16px 0 8px;">Data Retention & Privacy</h2>
    <p style="color:#64748b;font-size:13px;margin-bottom:24px;">Effective: December 2025 — TrustCare Support</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">1. Data Collection</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;margin-bottom:20px;">TrustCare collects only the minimum personal and health information required to deliver safe clinical services. All collection is compliant with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).</p>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">2. Storage & Encryption</h3>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li>All participant records are stored on encrypted, Australian-hosted servers.</li>
      <li>Access is restricted to authorised clinical staff only.</li>
      <li>Data in transit is protected with TLS 1.3 encryption.</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">3. Retention Periods</h3>
    <ul style="font-size:14px;color:#4a5568;line-height:1.8;margin-left:20px;margin-bottom:20px;">
      <li>Clinical records: 7 years from last service date (or until participant turns 25 if a minor).</li>
      <li>Incident reports: 7 years.</li>
      <li>Staff records: 7 years from employment end.</li>
    </ul>
    <h3 style="color:var(--navy);font-size:15px;margin-bottom:10px;">4. Participant Rights</h3>
    <p style="font-size:14px;color:#4a5568;line-height:1.75;">Participants have the right to access, correct, or request deletion of their personal information. Requests are processed within 30 days. Contact: <a href="mailto:admin@trustcaresupport.com.au" style="color:var(--blue);">admin@trustcaresupport.com.au</a></p>
  `
};

function openPolicyModal(policyId) {
  const content = policyContent[policyId];
  if (!content) return;
  document.getElementById('policyModalContent').innerHTML = content;
  document.getElementById('policyModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePolicyModal() {
  document.getElementById('policyModal').style.display = 'none';
  document.body.style.overflow = '';
}

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

// ===== NETLIFY IDENTITY — CMS ADMIN REDIRECT =====
// Moved from inline script to allow removing unsafe-inline from CSP
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
    }
  });
}
