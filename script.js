// ===== RECAPTCHA EXPLICIT RENDERING =====
// Renders each visible .g-recaptcha widget and stores its ID on the parent form.
// The job-apply modal widget is skipped here and rendered when the modal opens.
window.initRecaptchas = function() {
  document.querySelectorAll('.g-recaptcha').forEach(function(div) {
    const form = div.closest('form');
    if (!form || form.id === 'applyForm') return; // applyForm handled on modal open
    const widgetId = grecaptcha.render(div, { sitekey: div.dataset.sitekey });
    form.dataset.recaptchaWidget = widgetId;
  });
};

// ===== LOGO LIGHTBOX =====
document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('logo-lightbox');
  if (!lightbox) return;
  document.querySelectorAll('.logo-preview-trigger').forEach(img => {
    // Attach to the parent <a> if present — prevents anchor navigation reliably
    const el = img.closest('a') || img;
    el.style.cursor = 'zoom-in';
    img.style.cursor = 'zoom-in';
    el.addEventListener('click', (e) => {
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
}, { passive: true }); // passive: no preventDefault called — improves scroll performance

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
    // On desktop: allow default link navigation
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
// Cinematic staggered fade-up using Intersection Observer — no external libraries.
// Elements with class "reveal" slide up and fade in when entering the viewport.
// Sibling .reveal elements inside the same parent get an incremental delay for a
// stagger effect (e.g. card grids, feature lists).
const STAGGER_MS = 80; // delay between consecutive siblings

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;

      // Calculate stagger: count preceding .reveal siblings already seen or intersecting
      const siblings = el.parentElement
        ? Array.from(el.parentElement.querySelectorAll(':scope > .reveal'))
        : [];
      const idx = siblings.indexOf(el);
      const stagger = idx > 0 ? idx * STAGGER_MS : 0;

      // Apply delay then mark visible (CSS transition handles the animation)
      if (stagger > 0) {
        el.style.transitionDelay = `${stagger}ms`;
      }
      // rAF ensures the delay style is painted before the class triggers the transition
      requestAnimationFrame(() => {
        el.classList.add('visible');
        el.classList.add('is-visible'); // support both class names used in legacy markup
      });

      observer.unobserve(el);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function attachRevealObserver() {
  document.querySelectorAll('.reveal:not(.visible):not(.is-visible)').forEach(el => observer.observe(el));
}
attachRevealObserver();

// Re-attach after wizard page switches (single-page app navigation)
document.addEventListener('pageSwitch', attachRevealObserver);

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

// ===== FILE UPLOAD MIME VALIDATION =====
// Client-side guard against wrong file types on upload fields.
// Note: server-side validation is also required for full security.
const ALLOWED_UPLOAD_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const ALLOWED_UPLOAD_EXTS = /\.(pdf|doc|docx)$/i;

function validateFileInputs(form) {
  const fileInputs = form.querySelectorAll('input[type="file"]');
  for (const input of fileInputs) {
    for (const file of input.files) {
      const typeOk = ALLOWED_UPLOAD_TYPES.has(file.type);
      const extOk = ALLOWED_UPLOAD_EXTS.test(file.name);
      if (!typeOk && !extOk) {
        return `"${file.name}" is not allowed. Please upload a PDF, DOC, or DOCX file.`;
      }
    }
  }
  return null; // valid
}

// ===== FORM SUBMIT (Netlify Forms AJAX) =====
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Validate file types before submitting
    const fileError = validateFileInputs(form);
    if (fileError) {
      btn.textContent = fileError;
      btn.style.background = '#dc2626';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 4000);
      return;
    }

    // Validate reCAPTCHA using per-form widget ID (avoids multi-widget conflict)
    if (form.querySelector('.g-recaptcha')) {
      const widgetId = form.dataset.recaptchaWidget !== undefined ? parseInt(form.dataset.recaptchaWidget) : 0;
      if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse(widgetId)) {
        btn.textContent = 'Please complete the reCAPTCHA';
        btn.style.background = '#dc2626';
        setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 3000);
        return;
      }
    }

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
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // Render applyForm reCAPTCHA widget on first open
  const applyForm = document.getElementById('applyForm');
  if (applyForm && applyForm.dataset.recaptchaWidget === undefined && typeof grecaptcha !== 'undefined') {
    const div = applyForm.querySelector('.g-recaptcha');
    if (div) {
      const widgetId = grecaptcha.render(div, { sitekey: div.dataset.sitekey });
      applyForm.dataset.recaptchaWidget = widgetId;
    }
  }
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

  // Validate file types (resume + cover letter attachment)
  const fileError = validateFileInputs(e.target);
  if (fileError) {
    btn.textContent = fileError;
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 4000);
    return;
  }

  // Validate reCAPTCHA using per-form widget ID
  const applyWidgetId = e.target.dataset.recaptchaWidget !== undefined ? parseInt(e.target.dataset.recaptchaWidget) : undefined;
  if (typeof grecaptcha === 'undefined' || !grecaptcha.getResponse(applyWidgetId)) {
    btn.textContent = 'Please complete the reCAPTCHA';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 3000);
    return;
  }

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

// Freeze the policy content object — prevents runtime mutation of this developer-controlled HTML.
// IMPORTANT: policyId must always come from a hardcoded onclick value, never from URL params or
// user input. If that ever changes, switch to DOMPurify sanitization before innerHTML assignment.
Object.freeze(policyContent);

function openPolicyModal(policyId) {
  // Validate policyId is a known key — defence-in-depth against unexpected calls
  if (!Object.prototype.hasOwnProperty.call(policyContent, policyId)) return;
  const content = policyContent[policyId];
  document.getElementById('policyModalContent').innerHTML = content; // developer-controlled static HTML
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

// ===== IMAGE ERROR FALLBACKS =====
// Replaces inline onerror="" attributes — avoids unsafe-inline pattern.
document.addEventListener('DOMContentLoaded', () => {
  // Logo images (navbar + footer) — show text placeholder on error
  document.querySelectorAll('.navbar__logo-img, .footer__logo-img').forEach(img => {
    img.addEventListener('error', () => {
      const div = document.createElement('div');
      div.className = img.classList.contains('navbar__logo-img')
        ? 'navbar__logo-icon'
        : 'footer__logo-icon';
      div.textContent = '+';
      img.replaceWith(div);
    });
  });

  // Hero / content photos — hide on error
  document.querySelectorAll('.hero__img-wrap img, .why__img').forEach(img => {
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });

  // Team member photos — show emoji placeholder on error
  document.querySelectorAll('.team-card__photo img').forEach(img => {
    img.addEventListener('error', () => {
      const span = document.createElement('span');
      span.textContent = '👨‍⚕️';
      img.parentElement.replaceChildren(span);
    });
  });
});

// ===== NETLIFY IDENTITY — CMS ADMIN REDIRECT =====
// Moved from inline script to allow removing unsafe-inline from CSP
if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', user => {
    if (!user) {
      window.netlifyIdentity.on('login', () => { document.location.href = '/admin/'; });
    }
  });
}

// ── Intersection Observer — scroll reveal (is-visible) ───────────────────────
(function() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;
  var io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(function(el) { io.observe(el); });
})();

// ── Page fade-in on load ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('page-fade-in');
});

// ===== BACK TO TOP =====
(function () {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  function scrolled() {
    return (window.pageYOffset || window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0);
  }
  function checkScroll() {
    if (scrolled() > 1) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  document.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== ACCESSIBILITY WIDGET =====
(function () {
  var widget  = document.getElementById('a11yWidget');
  var panel   = document.getElementById('a11yPanel');
  var close   = document.getElementById('a11yClose');
  var fontUp  = document.getElementById('a11yFontUp');
  var fontDn  = document.getElementById('a11yFontDown');
  var contrast= document.getElementById('a11yContrast');
  var reset   = document.getElementById('a11yReset');
  if (!widget || !panel) return;

  var fontSize   = parseInt(localStorage.getItem('tc-a11y-font') || '0', 10);
  var highContrast = localStorage.getItem('tc-a11y-contrast') === '1';

  function applyFont() {
    document.documentElement.style.fontSize = fontSize === 0 ? '' : (16 + fontSize * 2) + 'px';
    localStorage.setItem('tc-a11y-font', fontSize);
  }
  function applyContrast() {
    document.body.classList.toggle('high-contrast', highContrast);
    if (contrast) contrast.classList.toggle('active', highContrast);
    localStorage.setItem('tc-a11y-contrast', highContrast ? '1' : '0');
  }

  // Restore saved settings on load
  applyFont();
  applyContrast();

  function togglePanel() {
    var isHidden = panel.hasAttribute('hidden');
    if (isHidden) { panel.removeAttribute('hidden'); widget.setAttribute('aria-expanded', 'true'); }
    else          { panel.setAttribute('hidden', '');  widget.setAttribute('aria-expanded', 'false'); }
  }

  widget.addEventListener('click', togglePanel);
  close.addEventListener('click',  function () { panel.setAttribute('hidden', ''); widget.setAttribute('aria-expanded', 'false'); });

  fontUp.addEventListener('click', function () { if (fontSize < 4) { fontSize++; applyFont(); } });
  fontDn.addEventListener('click', function () { if (fontSize > -2) { fontSize--; applyFont(); } });
  contrast.addEventListener('click', function () { highContrast = !highContrast; applyContrast(); });
  reset.addEventListener('click', function () {
    fontSize = 0; highContrast = false;
    applyFont(); applyContrast();
  });

  // Close panel on outside click
  document.addEventListener('click', function (e) {
    if (!panel.hasAttribute('hidden') && !panel.contains(e.target) && e.target !== widget) {
      panel.setAttribute('hidden', '');
      widget.setAttribute('aria-expanded', 'false');
    }
  });
})();
