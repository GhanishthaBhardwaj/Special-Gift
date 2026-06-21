/* =========================================================
   FATHER'S DAY TRIBUTE — script.js
   Vanilla JS only. No dependencies.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------
     1. LOADING SCREEN
  --------------------------------------------------- */
  const loader = document.getElementById('loader');

  function hideLoader() {
    loader.classList.add('is-hidden');
    document.body.style.overflow = '';
  }

  document.body.style.overflow = 'hidden';
  // Simulate a brief, elegant pause before the story begins
  window.setTimeout(() => {
    hideLoader();
  }, 2600);

  /* ---------------------------------------------------
     2. PARTICLE GENERATOR
     Creates small glowing dots inside a container.
  --------------------------------------------------- */
  function createParticles(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';

      const size = (Math.random() * 2.5 + 1).toFixed(1);
      const left = (Math.random() * 100).toFixed(2);
      const top = (Math.random() * 100).toFixed(2);
      const duration = (Math.random() * 10 + 8).toFixed(1);
      const delay = (Math.random() * 10).toFixed(1);

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.top = `${top}%`;
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${delay}s`;

      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  createParticles(document.getElementById('loaderParticles'), 28);
  createParticles(document.getElementById('heroParticles'), 22);
  createParticles(document.getElementById('quoteParticles'), 40);

  /* ---------------------------------------------------
     3. SCROLL PROGRESS BAR
  --------------------------------------------------- */
  const scrollBar = document.getElementById('scrollBar');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollBar) scrollBar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------------------------------------------------
     4. SCROLL REVEAL ANIMATIONS
     Elements with [data-reveal] fade & rise into view.
  --------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger children of the same container slightly
        const delay = entry.target.dataset.revealDelay || 0;
        window.setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach((el) => revealObserver.observe(el));

  // Stagger the gallery and "Things I Never Said" cards
  function staggerGroup(selector, step) {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.dataset.revealDelay = index * step;
    });
  }
  staggerGroup('.gallery__item', 110);
  staggerGroup('.say-envelope', 140);

  /* ---------------------------------------------------
     5. STORY INTRO — sequential line reveal
     The second line should appear after the first.
  --------------------------------------------------- */
  const line2 = document.querySelector('.story-intro__line--2');
  if (line2) line2.dataset.revealDelay = 700;

  /* ---------------------------------------------------
     6. BEGIN BUTTON — smooth scroll to memories
  --------------------------------------------------- */
  const beginBtn = document.getElementById('beginBtn');
  const memoriesSection = document.getElementById('memories');

  if (beginBtn && memoriesSection) {
    beginBtn.addEventListener('click', () => {
      memoriesSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------
     10. "LAST JUNE" ENVELOPE → LETTER
     Click the envelope: flap opens, seal fades, then the
     letter paper smoothly takes its place.
  --------------------------------------------------- */
  const letterEnvelope = document.getElementById('letterEnvelope');
  const letterPaper = document.getElementById('letterPaper');
  const letterClose = document.getElementById('letterClose');

  if (letterEnvelope && letterPaper) {
    function openLetter() {
      letterEnvelope.classList.add('is-open');
      letterEnvelope.setAttribute('aria-expanded', 'true');
      // Let the flap animation begin, then bring the paper in
      window.setTimeout(() => {
        letterPaper.classList.add('is-open');
        letterPaper.setAttribute('aria-hidden', 'false');
      }, 260);
    }

    function closeLetter() {
      letterPaper.classList.remove('is-open');
      letterPaper.setAttribute('aria-hidden', 'true');
      window.setTimeout(() => {
        letterEnvelope.classList.remove('is-open');
        letterEnvelope.setAttribute('aria-expanded', 'false');
      }, 200);
    }

    letterEnvelope.addEventListener('click', openLetter);
    if (letterClose) letterClose.addEventListener('click', closeLetter);
  }

  /* ---------------------------------------------------
     11. "THINGS I NEVER SAID" — small note envelopes
     Each one opens independently and can be closed again.
  --------------------------------------------------- */
  const sayEnvelopes = document.querySelectorAll('.say-envelope');

  sayEnvelopes.forEach((env) => {
    env.addEventListener('click', () => {
      const isOpen = env.classList.contains('is-open');
      env.classList.toggle('is-open', !isOpen);
      env.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---------------------------------------------------
     7. LIGHTBOX GALLERY
  --------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxMessage = document.getElementById('lightboxMessage');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('[data-lightbox-src]');

  function openLightbox(src, alt, message) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxMessage.textContent = message || '';
    lightboxMessage.style.display = message ? 'block' : 'none';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-lightbox-src');
      const message = item.getAttribute('data-message');
      const img = item.querySelector('img');
      openLightbox(src, img ? img.alt : '', message);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });

  /* ---------------------------------------------------
     8. GRACEFUL FALLBACK IF AN IMAGE IS MISSING
     Keeps the layout elegant even before assets are added.
  --------------------------------------------------- */
  /* ---------------------------------------------------
     9. BACKGROUND MUSIC TOGGLE
     Works only if a real mp3 exists in assets/.
     Button hides itself gracefully if no audio source loads.
  --------------------------------------------------- */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');

  if (bgMusic && musicToggle) {
    let hasValidSource = false;

    bgMusic.addEventListener('loadedmetadata', () => {
      hasValidSource = true;
    });

    // If nothing in assets/ resolves, quietly hide the button
    bgMusic.addEventListener('error', checkSources, true);
    function checkSources() {
      window.setTimeout(() => {
        if (!hasValidSource && bgMusic.readyState === 0) {
          musicToggle.classList.add('is-unavailable');
        }
      }, 1500);
    }
    bgMusic.load();
    checkSources();

    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          musicToggle.classList.add('is-playing');
          musicToggle.setAttribute('aria-pressed', 'true');
          musicToggle.setAttribute('aria-label', 'Pause background music');
        }).catch(() => {
          musicToggle.classList.add('is-unavailable');
        });
      } else {
        bgMusic.pause();
        musicToggle.classList.remove('is-playing');
        musicToggle.setAttribute('aria-pressed', 'false');
        musicToggle.setAttribute('aria-label', 'Play background music');
      }
    });
  }

});

