/* =============================================
   BIRYANI GRILL — Shared Components (Header/Footer/Loader)
   Injected by each page via <script>
   ============================================= */

(function () {
  'use strict';

  /* ---- Cursor HTML ---- */
  var cursorHTML = `
    <div class="custom-cursor"></div>
    <div class="custom-cursor-follower"></div>
  `;

  /* ---- Drawer Overlay ---- */
  var overlayHTML = `<div class="drawer-overlay"></div>`;

  /* ---- Mobile Drawer ---- */
  var drawerHTML = `
    <nav class="mobile-drawer">
      <a class="mobile-drawer-link" href="/index.html">Home</a>
      <a class="mobile-drawer-link" href="/index.html#menu-preview">Menu</a>
      <a class="mobile-drawer-link" href="/index.html#catering">Catering</a>
      <a class="mobile-drawer-link" href="/index.html#about">About</a>
      <a class="mobile-drawer-link" href="/index.html#locations">Contact Us</a>
      <a class="mobile-drawer-link" href="/careers.html">Careers</a>
      <a class="mobile-drawer-link" href="/index.html#contact">Franchise</a>
      <div class="mt-8">
        <a href="https://order.toasttab.com/online/biryanigrill" target="_blank" rel="noopener" class="btn-order mobile-drawer-cta">Order Now</a>
      </div>
    </nav>
  `;

  /* ---- Header HTML ---- */
  var headerHTML = `
    <header id="navbar">
      <div class="header-inner container-wide flex items-center justify-between gap-4">
        <a href="/index.html" class="nav-logo">
          <img class="brand-logo" src="https://quseprdus1.blob.core.windows.net/kora-business-images/user-media/e6f0d2d3-84e2-43df-84f0-ff2c4bc6a031/de8c94d8-887e-4625-825f-ec262dbc28df/1777052452_epglpm.png" alt="Biryani Grill Logo" />
        </a>
        <ul class="nav-links top-nav">
          <li><a href="/index.html">Home</a></li>
          <li><a href="/index.html#about">About</a></li>
          <li><a href="/index.html#menu-preview">Menu</a></li>
          <li><a href="/index.html#locations">Locations</a></li>
          <li><a href="/index.html#catering">Catering</a></li>
          <li><a href="/careers.html">Careers</a></li>
          <li><a href="/index.html#contact">Franchise</a></li>
        </ul>
        <div class="flex items-center gap-4">
          <a href="#locations" class="btn-order">Order Now</a>
          <button class="nav-hamburger" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  `;

  /* ---- Footer HTML ---- */
  var footerHTML = `
    <footer id="footer">
      <div class="container">
        <div class="footer-main">
          <div>
            <div class="footer-brand">
              <img src="https://quseprdus1.blob.core.windows.net/kora-business-images/user-media/e6f0d2d3-84e2-43df-84f0-ff2c4bc6a031/de8c94d8-887e-4625-825f-ec262dbc28df/1777052452_epglpm.png"
                   alt="Biryani Grill"
                   class="footer-logo-img"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='block';"
              />
              <div class="footer-logo-fallback">Biryani <span>Grill</span></div>
            </div>
            <p class="footer-brand-desc">
              Serving authentic high quality Indian cuisine with passion and tradition since 1998. Every dish tells a story of flavour, heritage, and love.
            </p>
            <div class="footer-social">
              <a href="https://www.facebook.com/biryanigrill" target="_blank" rel="noopener" class="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.instagram.com/biryanigrill" target="_blank" rel="noopener" class="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="https://wa.me/17035704766" target="_blank" rel="noopener" class="social-btn" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.552 4.116 1.522 5.845L.057 23.882l6.213-1.449A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.815 9.815 0 01-5.007-1.37l-.36-.213-3.686.859.901-3.584-.236-.375A9.82 9.82 0 012.182 12C2.182 6.56 6.56 2.182 12 2.182c5.44 0 9.818 4.378 9.818 9.818 0 5.44-4.378 9.818-9.818 9.818z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 class="footer-heading">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="/index.html">Home</a></li>
              <li><a href="/index.html#menu-preview">Menu</a></li>
              <li><a href="/index.html#about">About Us</a></li>
              <li><a href="/index.html#locations">Locations</a></li>
              <li><a href="/index.html#catering">Catering</a></li>
              <li><a href="/careers.html">Careers</a></li>
              <li><a href="/index.html#contact">Franchise</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-heading">Contact</h4>
            <div class="footer-hours">
              <span class="day">Aldie</span><span><a href="tel:7035704766" class="text-[#C7C7C7] no-underline">(703) 570-4766</a></span>
              <span class="day">Ashburn</span><span><a href="tel:7034800788" class="text-[#C7C7C7] no-underline">(703) 480-0788</a></span>
              <span class="day">Chantilly</span><span><a href="tel:7036378999" class="text-[#C7C7C7] no-underline">(703) 637-8999</a></span>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 Biryani Grill. All rights reserved.</p>
          <ul class="footer-bottom-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Accessibility</a></li>
          </ul>
        </div>
      </div>
    </footer>
  `;

  function injectSharedComponents() {
    if (document.getElementById('navbar') || document.getElementById('footer')) {
      return;
    }

    document.body.insertAdjacentHTML('afterbegin', cursorHTML + overlayHTML + drawerHTML + headerHTML);

    var main = document.querySelector('main');
    if (main) {
      main.insertAdjacentHTML('afterend', footerHTML);
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    document.body.classList.add('grain');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSharedComponents);
  } else {
    injectSharedComponents();
  }

})();
