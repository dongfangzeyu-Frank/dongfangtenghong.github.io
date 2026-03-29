/**
 * Artist Portfolio - Main JavaScript
 * Dark gallery aesthetic with smooth animations and interactions
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function to limit execution frequency
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function using requestAnimationFrame
 */
function throttleRAF(func) {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => {
        func(...args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

/**
 * Smooth scroll to target element
 */
function smoothScrollToTarget(target) {
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Get element offset from top
 */
function getOffset(element) {
  const rect = element.getBoundingClientRect();
  return rect.top + window.scrollY;
}

// ============================================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '-60px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Stagger children with reveal-stagger class
        const staggerChildren = entry.target.querySelectorAll('.reveal-stagger');
        staggerChildren.forEach((child, index) => {
          child.style.animationDelay = `${index * 0.1}s`;
          child.classList.add('visible');
        });

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => observer.observe(element));
}

// ============================================================================
// NAVIGATION SCROLL EFFECT
// ============================================================================

function initNavScrollEffect() {
  const siteNav = document.querySelector('.site-nav');

  if (!siteNav) return;

  const handleNavScroll = throttleRAF(() => {
    if (window.scrollY > 100) {
      siteNav.classList.add('nav-scrolled');
    } else {
      siteNav.classList.remove('nav-scrolled');
    }
  });

  window.addEventListener('scroll', handleNavScroll);
}

// ============================================================================
// PARALLAX EFFECT ON ARTWORK BREAKS
// ============================================================================

function initParallax() {
  const artworkBreaks = document.querySelectorAll('.artwork-break img');

  if (!artworkBreaks.length) return;

  const parallaxFactor = 0.15;

  const handleParallax = throttleRAF(() => {
    const scrollY = window.scrollY;

    artworkBreaks.forEach((img) => {
      const rect = img.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementBottom = elementTop + rect.height;

      // Only apply parallax if element is in viewport
      if (elementBottom > scrollY && elementTop < scrollY + window.innerHeight) {
        const distanceFromTop = scrollY - elementTop;
        const translateY = distanceFromTop * parallaxFactor;
        img.style.transform = `translateY(${translateY}px)`;
      }
    });
  });

  window.addEventListener('scroll', handleParallax);
}

// ============================================================================
// GALLERY LIGHTBOX
// ============================================================================

function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!galleryItems.length) return;

  let currentIndex = 0;
  let lightboxOpen = false;

  // Create lightbox HTML
  const lightboxHTML = `
    <div class="lightbox-overlay" id="lightboxOverlay">
      <div class="lightbox-container">
        <button class="lightbox-close" id="lightboxClose">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="lightbox-content">
          <div class="lightbox-spinner" id="lightboxSpinner">
            <div class="spinner-ring"></div>
          </div>
          <img id="lightboxImage" src="" alt="">

          <div class="lightbox-info">
            <h2 id="lightboxTitle"></h2>
            <p id="lightboxDescription"></p>
          </div>
        </div>

        <div class="lightbox-nav">
          <button class="lightbox-prev" id="lightboxPrev">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button class="lightbox-next" id="lightboxNext">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="lightbox-counter">
          <span id="lightboxCounter">1 / 1</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const overlay = document.getElementById('lightboxOverlay');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDescription = document.getElementById('lightboxDescription');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxSpinner = document.getElementById('lightboxSpinner');

  // Get filtered gallery items (respecting any active filters)
  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => {
      if (item.style.display === 'none') return false;
      if (item.getAttribute('data-hidden') === 'true') return false;
      return true;
    });
  }

  function openLightbox(index) {
    const visibleItems = getVisibleItems();
    const item = visibleItems[index];

    if (!item) return;

    currentIndex = index;
    lightboxOpen = true;

    const img = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-item-title');
    const yearEl = item.querySelector('.gallery-item-year');
    const mediumEl = item.querySelector('.gallery-item-medium');
    const dimensionsEl = item.querySelector('.gallery-item-dimensions');
    const title = titleEl ? titleEl.textContent : (item.getAttribute('data-title') || '');
    const description = [
      yearEl ? yearEl.textContent : '',
      mediumEl ? mediumEl.textContent : '',
      dimensionsEl ? dimensionsEl.textContent : ''
    ].filter(Boolean).join(' · ') || (item.getAttribute('data-description') || '');

    // Determine best image source: data-full (lg WebP) > original src
    const fullSrc = img.dataset.full || img.src;

    // Show loading state
    lightboxSpinner.style.display = 'flex';
    lightboxImage.style.opacity = '0';

    // Preload the full image
    const preloader = new Image();
    preloader.onload = function() {
      lightboxImage.src = fullSrc;
      lightboxImage.style.opacity = '1';
      lightboxSpinner.style.display = 'none';
    };
    preloader.onerror = function() {
      // Fallback: try the thumbnail src directly
      lightboxImage.src = img.src;
      lightboxImage.style.opacity = '1';
      lightboxSpinner.style.display = 'none';
    };
    preloader.src = fullSrc;

    // If image is already cached, onload fires synchronously
    if (preloader.complete) {
      lightboxImage.src = fullSrc;
      lightboxImage.style.opacity = '1';
      lightboxSpinner.style.display = 'none';
    }

    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightboxCounter.textContent = `${index + 1} / ${visibleItems.length}`;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    lightboxOpen = false;
  }

  function nextImage() {
    const visibleItems = getVisibleItems();
    let nextIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(nextIndex);
  }

  function prevImage() {
    const visibleItems = getVisibleItems();
    let prevIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(prevIndex);
  }

  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      const visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('lightbox-container')) {
      closeLightbox();
    }
  });

  prevBtn.addEventListener('click', prevImage);
  nextBtn.addEventListener('click', nextImage);

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!lightboxOpen) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });
}

// ============================================================================
// MOBILE HAMBURGER MENU
// ============================================================================

function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (!navToggle) return;

  navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const nav = document.querySelector('nav');
    if (nav && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      document.body.classList.remove('nav-open');
    }
  });
}

// ============================================================================
// HERO KEN BURNS EFFECT
// ============================================================================

function initKenBurns() {
  const heroBgImg = document.querySelector('.hero-bg-img');

  if (!heroBgImg) return;

  // Start animation immediately
  heroBgImg.style.animation = 'kenBurns 20s ease-in-out infinite';
}

// ============================================================================
// INTERNATIONALIZATION (i18n)
// ============================================================================
// Now handled by unified js/i18n.js module
// initI18n() is kept as a no-op for backward compatibility
function initI18n() {
  // Delegated to i18n.js - do nothing here
}

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================

function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');

    if (!link) return;

    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);

    if (target) {
      e.preventDefault();
      smoothScrollToTarget(target);
    }
  });
}

// ============================================================================
// GALLERY FILTERING
// ============================================================================

function initGalleryFiltering() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterButtons.length || !galleryItems.length) return;

  // Apply filter by value
  function applyFilter(filterValue) {
    filterButtons.forEach(btn => {
      if (btn.getAttribute('data-filter') === filterValue) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    galleryItems.forEach(item => {
      const itemSeries = item.getAttribute('data-series');

      if (filterValue === 'all' || itemSeries === filterValue) {
        item.style.display = '';
        item.setAttribute('data-hidden', 'false');
        item.classList.add('visible');
      } else {
        item.style.display = 'none';
        item.setAttribute('data-hidden', 'true');
        item.classList.remove('visible');
      }
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.getAttribute('data-filter');
      applyFilter(filterValue);
    });
  });

  // Auto-filter from URL parameter ?series=xxx
  const urlParams = new URLSearchParams(window.location.search);
  const seriesParam = urlParams.get('series');
  if (seriesParam) {
    applyFilter(seriesParam);
    // Scroll to the gallery section
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
      setTimeout(() => { filterBar.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    }
  }
}

// ============================================================================
// NEWSLETTER FORM
// ============================================================================

function initNewsletterForm() {
  const newsletterForm = document.querySelector('.newsletter-form');

  if (!newsletterForm) return;

  const emailInput = newsletterForm.querySelector('input[type="email"]');
  const submitBtn = newsletterForm.querySelector('button[type="submit"]');

  if (!emailInput) return;

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
      emailInput.classList.add('error');
      return;
    }

    emailInput.classList.remove('error');

    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'newsletter-success';
    successMsg.textContent = '✓ Thank you for subscribing!';

    newsletterForm.appendChild(successMsg);

    // Reset form
    emailInput.value = '';
    submitBtn.disabled = true;

    // Remove success message after 3 seconds
    setTimeout(() => {
      successMsg.remove();
      submitBtn.disabled = false;
    }, 3000);
  });

  // Remove error class on input
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('error');
  });
}

// ============================================================================
// CONTACT FORM CATEGORY ROUTER
// ============================================================================

function initContactFormRouter() {
  const contactForm = document.querySelector('.contact-form');
  const categorySelect = contactForm?.querySelector('[name="category"]');

  if (!contactForm || !categorySelect) return;

  const formSections = {
    '策展': '.contact-curating',
    '收藏': '.contact-collecting',
    '媒体': '.contact-media',
    '通用': '.contact-general'
  };

  function showRelevantFields(category) {
    // Hide all sections first
    Object.values(formSections).forEach(selector => {
      const section = contactForm.querySelector(selector);
      if (section) section.style.display = 'none';
    });

    // Show relevant section
    if (formSections[category]) {
      const section = contactForm.querySelector(formSections[category]);
      if (section) section.style.display = 'block';
    }
  }

  categorySelect.addEventListener('change', (e) => {
    showRelevantFields(e.target.value);
  });

  // Initialize with default value
  showRelevantFields(categorySelect.value);
}

// ============================================================================
// PAGE TRANSITIONS
// ============================================================================

function initPageTransitions() {
  const navigationLinks = document.querySelectorAll('a:not([href^="#"]):not([target])');

  navigationLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Skip external links, mailto, tel, javascript, etc.
      if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('javascript')) {
        return; // Let browser handle normally
      }

      // Apply fade-out transition for internal navigation only
      e.preventDefault();
      const body = document.body;
      body.style.transition = 'opacity 0.3s ease-out';
      body.style.opacity = '0';

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });
}

// ============================================================================
// ARTWORK HOVER EFFECT
// ============================================================================

function initArtworkHoverEffect() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!galleryItems.length) return;

  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const parent = item.parentElement;
      parent.classList.add('gallery-dimmed');
      item.classList.add('gallery-highlighted');
    });

    item.addEventListener('mouseleave', () => {
      const parent = item.parentElement;
      parent.classList.remove('gallery-dimmed');
      item.classList.remove('gallery-highlighted');
    });
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavScrollEffect();
  initParallax();
  initGalleryLightbox();
  initMobileMenu();
  initKenBurns();
  initI18n();
  initSmoothScroll();
  initGalleryFiltering();
  initNewsletterForm();
  initContactFormRouter();
  initPageTransitions();
  initArtworkHoverEffect();
});

// ============================================================================
// WINDOW LOAD
// ============================================================================

window.addEventListener('load', () => {
  // Trigger reveal animations for elements already visible
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      element.classList.add('visible');
    }
  });
});
