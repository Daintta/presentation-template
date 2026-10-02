/**
 * PRESENTATION RUNTIME ENGINE
 * Standalone, zero-dependency engine for 16:9 executive decks
 */

(function () {
  'use strict';

  class PresentationEngine {
    constructor() {
      this.viewport = document.getElementById('deck-viewport');
      this.stage = document.getElementById('deck-stage');
      this.slides = Array.from(document.querySelectorAll('.slide'));
      this.counterCurrent = document.getElementById('deck-counter-current');
      this.counterTotal = document.getElementById('deck-counter-total');
      this.progressBar = document.getElementById('deck-progress-bar');
      this.shortcutsModal = document.getElementById('shortcuts-modal');

      this.currentIndex = 0;
      this.totalSlides = this.slides.length;
      this.isOverview = false;
      this.isShortcutsOpen = false;

      // Base design canvas dimensions (16:9)
      this.BASE_WIDTH = 1920;
      this.BASE_HEIGHT = 1080;

      // Touch gesture tracking
      this.touchStartX = 0;
      this.touchStartY = 0;

      this.init();
    }

    init() {
      if (this.totalSlides === 0) return;

      // Initialize slide indices and accessibility attributes
      this.slides.forEach((slide, idx) => {
        slide.setAttribute('data-slide-index', idx);
        slide.setAttribute('role', 'region');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', `Slide ${idx + 1} of ${this.totalSlides}`);
        
        // Add click listener for overview mode
        slide.addEventListener('click', (e) => {
          if (this.isOverview) {
            e.stopPropagation();
            this.toggleOverview(false);
            this.goToSlide(idx);
          }
        });
      });

      if (this.counterTotal) {
        this.counterTotal.textContent = this.formatNumber(this.totalSlides);
      }

      // Check URL hash for initial slide
      const initialIndex = this.getSlideIndexFromHash();
      this.goToSlide(initialIndex, false);

      // Event bindings
      this.bindEvents();

      // Initialize theme from localStorage or system preference
      try {
        const savedTheme = localStorage.getItem('deck-theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          document.body.setAttribute('data-theme', savedTheme);
        } else if (!document.body.hasAttribute('data-theme')) {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.setAttribute('data-theme', 'light');
          } else {
            document.body.setAttribute('data-theme', 'dark');
          }
        }
      } catch (e) {}

      // Initial scaling calculation
      this.updateScale();
    }

    bindEvents() {
      // Window resize and orientation change
      window.addEventListener('resize', () => this.updateScale());
      window.addEventListener('orientationchange', () => setTimeout(() => this.updateScale(), 100));

      // Keyboard navigation
      window.addEventListener('keydown', (e) => this.handleKeydown(e));

      // Hash change (browser back/forward)
      window.addEventListener('hashchange', () => {
        const hashIdx = this.getSlideIndexFromHash();
        if (hashIdx !== this.currentIndex) {
          this.goToSlide(hashIdx, false);
        }
      });

      // UI Control Buttons
      const btnPrev = document.getElementById('deck-btn-prev');
      const btnNext = document.getElementById('deck-btn-next');
      const btnOverview = document.getElementById('deck-btn-overview');
      const btnFullscreen = document.getElementById('deck-btn-fullscreen');
      const btnTheme = document.getElementById('deck-btn-theme');
      const btnHelp = document.getElementById('deck-btn-help');

      if (btnPrev) btnPrev.addEventListener('click', () => this.prev());
      if (btnNext) btnNext.addEventListener('click', () => this.next());
      if (btnOverview) btnOverview.addEventListener('click', () => this.toggleOverview());
      if (btnFullscreen) btnFullscreen.addEventListener('click', () => this.toggleFullscreen());
      if (btnTheme) btnTheme.addEventListener('click', () => this.toggleTheme());
      if (btnHelp) btnHelp.addEventListener('click', () => this.toggleShortcuts());

      // Shortcuts Modal Close
      if (this.shortcutsModal) {
        this.shortcutsModal.addEventListener('click', (e) => {
          if (e.target === this.shortcutsModal || e.target.closest('.modal-close-btn')) {
            this.toggleShortcuts(false);
          }
        });
      }

      // Touch events for mobile/tablet presentations
      window.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      window.addEventListener('touchend', (e) => {
        const diffX = e.changedTouches[0].screenX - this.touchStartX;
        const diffY = e.changedTouches[0].screenY - this.touchStartY;
        // Require horizontal swipe threshold > 50px and larger than vertical
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX < 0) {
            this.next();
          } else {
            this.prev();
          }
        }
      }, { passive: true });
    }

    /**
     * Responsive 16:9 aspect-ratio scaler
     * Computes optimal transform scale to fit within viewport with letterboxing
     */
    updateScale() {
      if (this.isOverview) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Calculate uniform scale factor to contain 1920x1080 inside current window
      const scaleX = viewportWidth / this.BASE_WIDTH;
      const scaleY = viewportHeight / this.BASE_HEIGHT;
      const scale = Math.min(scaleX, scaleY);

      // Apply scale to CSS custom property
      document.documentElement.style.setProperty('--deck-scale', scale.toFixed(4));
    }

    goToSlide(index, updateHash = true) {
      if (index < 0 || index >= this.totalSlides) return;

      this.slides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.add('active');
          slide.setAttribute('aria-hidden', 'false');
        } else {
          slide.classList.remove('active');
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      this.currentIndex = index;

      // Update counter UI
      if (this.counterCurrent) {
        this.counterCurrent.textContent = this.formatNumber(index + 1);
      }

      // Update progress bar
      if (this.progressBar) {
        const progress = ((index + 1) / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;
      }

      // Update URL hash
      if (updateHash) {
        window.location.hash = `#${index + 1}`;
      }
    }

    next() {
      if (this.isOverview) return;
      if (this.currentIndex < this.totalSlides - 1) {
        this.goToSlide(this.currentIndex + 1);
      }
    }

    prev() {
      if (this.isOverview) return;
      if (this.currentIndex > 0) {
        this.goToSlide(this.currentIndex - 1);
      }
    }

    first() {
      this.goToSlide(0);
    }

    last() {
      this.goToSlide(this.totalSlides - 1);
    }

    toggleOverview(forceState) {
      this.isOverview = typeof forceState === 'boolean' ? forceState : !this.isOverview;
      
      if (this.isOverview) {
        document.body.classList.add('overview-mode');
        // Scroll to current active slide in grid
        const activeSlide = this.slides[this.currentIndex];
        if (activeSlide) {
          setTimeout(() => activeSlide.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
        }
      } else {
        document.body.classList.remove('overview-mode');
        this.updateScale();
      }
    }

    toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    toggleTheme() {
      const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', next);
      try {
        localStorage.setItem('deck-theme', next);
      } catch (e) {}
    }

    toggleShortcuts(forceState) {
      this.isShortcutsOpen = typeof forceState === 'boolean' ? forceState : !this.isShortcutsOpen;
      if (this.shortcutsModal) {
        this.shortcutsModal.classList.toggle('open', this.isShortcutsOpen);
      }
    }

    handleKeydown(e) {
      // If modal is open, Esc closes modal
      if (this.isShortcutsOpen) {
        if (e.key === 'Escape') {
          this.toggleShortcuts(false);
          e.preventDefault();
        }
        return;
      }

      // If in overview mode, Esc exits overview
      if (this.isOverview) {
        if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') {
          this.toggleOverview(false);
          e.preventDefault();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Space
        case 'j':
        case 'l':
          e.preventDefault();
          this.next();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
        case 'k':
        case 'h':
          e.preventDefault();
          this.prev();
          break;

        case 'Home':
          e.preventDefault();
          this.first();
          break;

        case 'End':
          e.preventDefault();
          this.last();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        case 't':
        case 'T':
          e.preventDefault();
          this.toggleTheme();
          break;

        case 'o':
        case 'O':
          e.preventDefault();
          this.toggleOverview();
          break;

        case '?':
          e.preventDefault();
          this.toggleShortcuts();
          break;

        case 'Escape':
          if (this.isOverview) {
            this.toggleOverview(false);
          }
          break;

        default:
          // Numeric direct jump (1-9)
          if (!e.metaKey && !e.ctrlKey && !e.altKey) {
            const digit = parseInt(e.key, 10);
            if (!isNaN(digit) && digit >= 1 && digit <= this.totalSlides) {
              e.preventDefault();
              this.goToSlide(digit - 1);
            }
          }
          break;
      }
    }

    getSlideIndexFromHash() {
      const hash = window.location.hash.replace('#', '');
      const num = parseInt(hash, 10);
      if (!isNaN(num) && num >= 1 && num <= this.totalSlides) {
        return num - 1;
      }
      return 0;
    }

    formatNumber(num) {
      return num < 10 ? `0${num}` : `${num}`;
    }
  }

  // Initialize after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    window.Deck = new PresentationEngine();
  });
})();
