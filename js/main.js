/* =============================================
   BIRYANI GRILL — Core JS
   ============================================= */

(function () {
  'use strict';

  /* ---- Custom Cursor ---- */
  var cursor = document.querySelector('.custom-cursor');
  var follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower && window.innerWidth > 768) {
    var cx = 0, cy = 0, fx = 0, fy = 0;

    document.addEventListener('mousemove', function (e) {
      cx = e.clientX;
      cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
    });

    function animateFollower() {
      fx += (cx - fx) * 0.12;
      fy += (cy - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, [data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ---- Navbar scroll ---- */
  function initNavbarScroll() {
    if (window.__navbarScrollBound) return true;
    var navbar = document.getElementById('navbar');
    if (!navbar) return false;

    function handleScroll() {
      if (window.scrollY > 16) {
        navbar.classList.add('scrolled');
        document.body.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
        document.body.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    window.__navbarScrollBound = true;
    return true;
  }

  if (!initNavbarScroll()) {
    var tries = 0;
    var navbarRetryTimer = setInterval(function () {
      tries += 1;
      if (initNavbarScroll() || tries > 50) {
        clearInterval(navbarRetryTimer);
      }
    }, 100);
  }

  /* ---- Mobile Drawer ---- */
  function initMobileDrawer() {
    if (window.__mobileDrawerBound) return true;

    var hamburger = document.querySelector('.nav-hamburger');
    var drawer = document.querySelector('.mobile-drawer');
    var overlay = document.querySelector('.drawer-overlay');
    if (!hamburger || !drawer || !overlay) return false;

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      hamburger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function () {
      drawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
    overlay.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeDrawer);
    });

    window.__mobileDrawerBound = true;
    return true;
  }

  if (!initMobileDrawer()) {
    var drawerTries = 0;
    var drawerRetryTimer = setInterval(function () {
      drawerTries += 1;
      if (initMobileDrawer() || drawerTries > 50) {
        clearInterval(drawerRetryTimer);
      }
    }, 100);
  }

  /* ---- Location Menu Modal ---- */
  function initLocationModal() {
    var modal = document.getElementById('location-modal');
    if (!modal) return;

    function openModal() {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-open-locations]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openModal();
      });
    });

    modal.querySelectorAll('[data-close]').forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }
  initLocationModal();

  /* ---- Active nav link ---- */
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-drawer a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href) return;
    var normalized = href.replace(/\/$/, '') || '/';
    if (normalized === currentPath || (currentPath === '' && normalized === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ---- Scroll Reveal ---- */
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }
  initReveal();

  /* ---- Counter Animation ---- */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var duration = 1800;
    var start = performance.now();

    function update(time) {
      var elapsed = time - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;
      el.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ---- Menu Tabs ---- */
  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var target = tab.dataset.tab;
      var panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---- Testimonials Slider ---- */
  var track = document.querySelector('.testimonials-track');
  var dots = document.querySelectorAll('.testimonial-dot');
  var totalSlides = 0;
  var currentSlide = 0;

  if (track) {
    var cards = track.querySelectorAll('.testimonial-card');
    totalSlides = Math.max(0, cards.length - (window.innerWidth > 768 ? 3 : 1));

    function goToSlide(idx) {
      currentSlide = Math.max(0, Math.min(idx, totalSlides));
      var cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 0;
      track.style.transform = 'translateX(-' + (currentSlide * cardWidth) + 'px)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToSlide(i); });
    });

    // Auto-slide
    setInterval(function () {
      goToSlide(currentSlide >= totalSlides ? 0 : currentSlide + 1);
    }, 5000);
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---- Form Submission (demo) ---- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }
      setTimeout(function () {
        var msg = form.querySelector('.form-success');
        if (msg) { msg.style.display = 'block'; }
        form.reset();
        if (btn) { btn.textContent = 'Sent!'; }
        setTimeout(function () {
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
          if (msg) { msg.style.display = 'none'; }
        }, 4000);
      }, 1200);
    });
  });

  /* ---- Parallax on hero bg ---- */
  var heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      heroBg.style.transform = 'scale(1.08) translateY(' + (scrolled * 0.18) + 'px)';
    }, { passive: true });
  }

  /* ---- Location Gallery Slider ---- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var slides = gallery.querySelectorAll('.gallery-slide');
    var prev = gallery.querySelector('.gallery-nav.prev');
    var next = gallery.querySelector('.gallery-nav.next');
    if (!slides.length) return;

    var current = 0;
    var intervalId;

    function render(index) {
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      render(current);
    }

    function startAuto() {
      intervalId = setInterval(function () {
        goTo(current + 1);
      }, 3500);
    }

    function resetAuto() {
      if (intervalId) clearInterval(intervalId);
      startAuto();
    }

    if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

    render(current);
    startAuto();
  });

})();
