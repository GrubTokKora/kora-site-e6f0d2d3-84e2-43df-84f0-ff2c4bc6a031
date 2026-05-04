window.KORA_SITE_CONFIG = {
  apiBaseUrl: 'https://kora-agent.grubtok.com',
  businessId: 'e6f0d2d3-84e2-43df-84f0-ff2c4bc6a031',
  recaptchaSiteKey: '6LcsdJYsAAAAAAur-h7cYlZuGJTmijNHmOi5kFH7',
  skipRecaptcha: false,
};

window.BIRYANI_BRAND = {
  logo: 'https://biryanigrill.com/assets/BiryaniGrillLogo-5ByDJZLV.png',
  social: {
    facebook: 'https://www.facebook.com/biryanigrillva',
    instagram: 'https://www.instagram.com/biryanigrill_va/?igsh=MXY0OG0zMWxxcHZ1aA%3D%3D',
    whatsapp: 'https://chat.whatsapp.com/EGfuwJYxzVyHRtXM91cHdn',
  },
  order: {
    aldie: 'https://aldie.biryanigrill.com/',
    ashburn: 'https://ashburn.biryanigrill.com',
    chantilly: 'https://cash.app/order/$chantillybiryanigril',
  },
};

(function initKoraPublicForms() {
  var config = window.KORA_SITE_CONFIG || {};
  var apiBaseUrl = (config.apiBaseUrl || 'https://kora-agent.grubtok.com').replace(/\/+$/, '');
  var businessId = config.businessId || 'e6f0d2d3-84e2-43df-84f0-ff2c4bc6a031';
  var recaptchaSiteKey = config.recaptchaSiteKey || '6LcsdJYsAAAAAAur-h7cYlZuGJTmijNHmOi5kFH7';
  var skipRecaptcha = config.skipRecaptcha === true;
  var recaptchaScriptPromise = null;

  function setStatus(form, text, kind) {
    var statusEl = form.querySelector('.form-status');
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.add('is-visible');
    statusEl.classList.remove('form-status--error', 'form-status--success', 'form-status--neutral');
    if (kind === 'error') statusEl.classList.add('form-status--error');
    else if (kind === 'success') statusEl.classList.add('form-status--success');
    else statusEl.classList.add('form-status--neutral');
  }

  function clearStatus(form) {
    var statusEl = form.querySelector('.form-status');
    if (!statusEl) return;
    statusEl.textContent = '';
    statusEl.classList.remove('is-visible', 'form-status--error', 'form-status--success', 'form-status--neutral');
  }

  function setSubmittingState(form, isSubmitting) {
    var submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    if (isSubmitting) {
      submitBtn.dataset.originalText = submitBtn.textContent || 'Submit';
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      return;
    }
    submitBtn.textContent = submitBtn.dataset.originalText || 'Submit';
    submitBtn.disabled = false;
  }

  function collectFormData(form) {
    var data = {};
    var formData = new FormData(form);
    formData.forEach(function (value, key) {
      if (value && typeof File !== 'undefined' && value instanceof File) return;
      data[key] = typeof value === 'string' ? value.trim() : value;
    });
    if (!data.full_name && (data.first_name || data.last_name)) {
      data.full_name = ((data.first_name || '') + ' ' + (data.last_name || '')).trim();
    }
    return data;
  }

  function getFileInput(form) {
    var fileInput = form.querySelector('input[type="file"]');
    if (!fileInput || !fileInput.files || !fileInput.files.length) return null;
    return fileInput.files[0];
  }

  function validateClient(form, formType, data) {
    if (formType === 'catering_quote') {
      if (!data.name || !data.email || !data.phone || !data.location || !data.serviceType || !data.occasion || !data.eventDate || !data.eventTime || !data.guests) {
        setStatus(form, 'Please fill all required catering fields.', 'error');
        return false;
      }
    } else if (formType === 'franchise_inquiry') {
      if (!data.fullName || !data.email || !data.phone || !data.city || !data.state || !data.investmentCapacity) {
        setStatus(form, 'Please fill all required franchise fields.', 'error');
        return false;
      }
    } else if (formType === 'job_application') {
      if (!data.position || !data.fullName || !data.email || !data.phone || !data.experience) {
        setStatus(form, 'Please fill all required application fields.', 'error');
        return false;
      }
      if (!getFileInput(form)) {
        setStatus(form, 'Please attach your resume (PDF, DOC, or DOCX).', 'error');
        return false;
      }
    } else if (formType === 'newsletter') {
      if (!data.email) {
        setStatus(form, 'Please enter your email address.', 'error');
        return false;
      }
    } else if (!data.email) {
      setStatus(form, 'Please enter your email.', 'error');
      return false;
    }
    return true;
  }

  function ensureRecaptchaScript() {
    if (skipRecaptcha || !recaptchaSiteKey) return Promise.resolve();
    if (typeof window.grecaptcha !== 'undefined') return Promise.resolve();
    if (recaptchaScriptPromise) return recaptchaScriptPromise;
    recaptchaScriptPromise = new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-kora-recaptcha="true"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(); }, { once: true });
        existing.addEventListener('error', function () { reject(new Error('Failed to load reCAPTCHA script')); }, { once: true });
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.dataset.koraRecaptcha = 'true';
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error('Failed to load reCAPTCHA script')); };
      document.head.appendChild(script);
    });
    return recaptchaScriptPromise;
  }

  function getRecaptchaToken(form) {
    if (skipRecaptcha || !recaptchaSiteKey || typeof window.grecaptcha === 'undefined') return '';
    var recaptchaEl = form.querySelector('.g-recaptcha');
    if (!recaptchaEl) return '';
    return window.grecaptcha.getResponse() || '';
  }

  function resetRecaptcha(form) {
    var hasCaptchaEl = !!form.querySelector('.g-recaptcha');
    if (!skipRecaptcha && hasCaptchaEl && typeof window.grecaptcha !== 'undefined') {
      window.grecaptcha.reset();
    }
  }

  function submitNewsletter(form) {
    var formPayload = collectFormData(form);
    var newsletterPayload = {
      business_id: businessId,
      email: formPayload.email || null,
      phone_number: formPayload.phone || null,
      first_name: formPayload.first_name || null,
      last_name: formPayload.last_name || null,
      email_opt_in: !!formPayload.email,
      sms_opt_in: !!formPayload.phone,
      metadata: {
        page_path: window.location.pathname,
        referrer: document.referrer || '',
      },
      source: 'static_website_widget',
    };

    if (!businessId) {
      setStatus(form, 'Newsletter is not configured for this site.', 'error');
      return;
    }

    setSubmittingState(form, true);
    setStatus(form, 'Subscribing...', 'neutral');
    fetch(apiBaseUrl + '/api/v1/public/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newsletterPayload),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Newsletter subscription failed');
        return response.json().catch(function () { return {}; });
      })
      .then(function (json) {
        form.reset();
        setStatus(form, (json && json.message) || 'Subscribed to newsletter.', 'success');
      })
      .catch(function (error) {
        console.error('Newsletter subscribe error:', error);
        setStatus(form, 'Could not subscribe right now. Please try again.', 'error');
      })
      .finally(function () {
        setSubmittingState(form, false);
      });
  }

  function submitPublicForm(form) {
    var formType = form.dataset.formType || 'contact';
    if (formType === 'newsletter') {
      submitNewsletter(form);
      return;
    }

    var formPayload = collectFormData(form);
    var submitterEmail = formPayload.email || null;
    var hasCaptchaEl = !!form.querySelector('.g-recaptcha');
    var captchaToken = getRecaptchaToken(form);
    var file = getFileInput(form);

    if (!businessId) {
      setStatus(form, 'Form submission is not configured for this site.', 'error');
      return;
    }
    if (!skipRecaptcha && hasCaptchaEl && !recaptchaSiteKey) {
      setStatus(form, 'Security check is not configured. Please try again later.', 'error');
      return;
    }
    if (!skipRecaptcha && hasCaptchaEl && !captchaToken) {
      setStatus(form, 'Please complete the reCAPTCHA.', 'error');
      return;
    }

    setSubmittingState(form, true);
    setStatus(form, 'Sending...', 'neutral');

    var url = apiBaseUrl + '/api/v1/public/forms/submit';
    var fetchOpts = { method: 'POST' };

    if (file) {
      var fd = new FormData();
      fd.append('business_id', businessId);
      fd.append('form_type', formType);
      fd.append('form_data', JSON.stringify(formPayload));
      fd.append('submitter_email', submitterEmail || '');
      fd.append('captcha_token', captchaToken || '');
      fd.append('attachment', file, file.name);
      fetchOpts.body = fd;
      url = apiBaseUrl + '/api/v1/public/forms/submit-with-file';
    } else {
      fetchOpts.headers = { 'Content-Type': 'application/json' };
      fetchOpts.body = JSON.stringify({
        business_id: businessId,
        form_type: formType,
        form_data: formPayload,
        submitter_email: submitterEmail,
        captcha_token: captchaToken || '',
      });
    }

    fetch(url, fetchOpts)
      .then(function (response) {
        if (!response.ok) throw new Error('Submission failed');
        return response.json().catch(function () { return {}; });
      })
      .then(function () {
        form.reset();
        resetRecaptcha(form);
        setStatus(form, 'Thank you! Your submission has been received.', 'success');
      })
      .catch(function (error) {
        console.error('Form submit error:', error);
        setStatus(form, 'Something went wrong. Please try again or call your nearest Biryani Grill location.', 'error');
      })
      .finally(function () {
        setSubmittingState(form, false);
      });
  }

  function prepareRecaptchaWidgets(form) {
    if (skipRecaptcha) {
      form.querySelectorAll('.g-recaptcha').forEach(function (el) {
        el.style.display = 'none';
      });
      return;
    }
    form.querySelectorAll('.g-recaptcha').forEach(function (el) {
      if (recaptchaSiteKey) el.setAttribute('data-sitekey', recaptchaSiteKey);
    });
  }

  function bindFormSubmit(form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      clearStatus(form);
      var formType = form.dataset.formType || 'contact';
      var data = collectFormData(form);
      if (!validateClient(form, formType, data)) return;
      submitPublicForm(form);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var forms = document.querySelectorAll('form[data-form-type]');
    if (!forms.length) return;
    Array.prototype.forEach.call(forms, prepareRecaptchaWidgets);
    var hasRecaptchaForm = Array.prototype.some.call(forms, function (f) {
      return !!f.querySelector('.g-recaptcha');
    });
    function bindAll() {
      Array.prototype.forEach.call(forms, bindFormSubmit);
    }
    if (hasRecaptchaForm && recaptchaSiteKey && !skipRecaptcha) {
      ensureRecaptchaScript().then(bindAll).catch(function (error) {
        console.warn('reCAPTCHA script load failed:', error);
        bindAll();
      });
    } else {
      bindAll();
    }
  });
})();

(function () {
  'use strict';

  /* ---- Optional layout from legacy main.js (#site-header / #site-footer) ---- */
  function header(active) {
    var B = window.BIRYANI_BRAND;
    var links = [
      ['Home', 'index.html'],
      ['Menu', 'index.html#menu'],
      ['Catering', 'index.html#catering'],
      ['About', 'index.html#about'],
      ['Contact Us', 'index.html#locations'],
      ['Careers', 'index.html#careers'],
      ['Franchise', 'index.html#franchise'],
    ];
    return (
      '<header class="site-header">' +
      '<div class="header-inner max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">' +
      '<a href="index.html" class="shrink-0"><img src="' + B.logo + '" alt="Biryani Grill Logo" class="brand-logo" loading="eager"></a>' +
      '<nav class="top-nav hidden md:flex items-center gap-6 text-sm font-medium">' +
      links.map(function (pair) {
        var n = pair[0];
        var h = pair[1];
        var cls = active === n ? 'active' : 'text-zinc-100 hover:text-yellow-300';
        return '<a class="' + cls + '" href="' + h + '">' + n + '</a>';
      }).join('') +
      '</nav>' +
      '<a href="index.html#location-modal" data-open-locations class="btn-gold px-4 py-2 rounded-lg text-sm">Order Now</a>' +
      '</div></header>'
    );
  }

  function footer() {
    var B = window.BIRYANI_BRAND;
    return (
      '<footer class="bg-black border-t border-yellow-500/20 mt-10">' +
      '<div class="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-8 text-sm">' +
      '<div><img src="' + B.logo + '" alt="Biryani Grill Logo" class="h-12 mb-4"><p class="text-zinc-300">Serving authentic high quality Indian cuisine with passion and tradition.</p></div>' +
      '<div><h4 class="text-yellow-300 font-semibold mb-3">Quick Links</h4><div class="space-y-2"><a href="index.html">Home</a><br><a href="index.html#about">About</a><br><a href="index.html#catering">Catering</a><br><a href="index.html#franchise">Franchise</a><br><a href="index.html#careers">Careers</a></div></div>' +
      '<div><h4 class="text-yellow-300 font-semibold mb-3">Hours</h4><p class="text-zinc-300">Mon - Thu: 11:30AM - 2:30PM, 5:00PM - 12:00AM<br>Fri - Sun: 11:30AM - 12:00AM</p><div class="mt-4 flex gap-4">' +
      '<a href="' + B.social.facebook + '" target="_blank" rel="noopener">Facebook</a>' +
      '<a href="' + B.social.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
      '<a href="' + B.social.whatsapp + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '</div></div></div>' +
      '<div class="max-w-7xl mx-auto px-4 py-4 border-t border-zinc-800 text-xs text-zinc-500">© 2026 Biryani Grill. All rights reserved.</div></footer>'
    );
  }

  function mountChromeIfPresent(active) {
    var elH = document.getElementById('site-header');
    var elF = document.getElementById('site-footer');
    if (elH) elH.innerHTML = header(active || '');
    if (elF) elF.innerHTML = footer();
  }

  function initFadeIns() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('in-view');
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.fade-up').forEach(function (el) {
      io.observe(el);
    });
  }

  function initBodyScrollClass() {
    function update() {
      document.body.classList.toggle('scrolled', window.scrollY > 16);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var page = (document.body && document.body.dataset && document.body.dataset.page) || '';
    mountChromeIfPresent(page);
    initFadeIns();
    initBodyScrollClass();
  });

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
