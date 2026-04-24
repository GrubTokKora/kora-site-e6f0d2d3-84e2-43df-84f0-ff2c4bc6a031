const BRAND = {
  logo: "https://biryanigrill.com/assets/BiryaniGrillLogo-5ByDJZLV.png",
  social: {
    facebook: "https://www.facebook.com/biryanigrillva",
    instagram: "https://www.instagram.com/biryanigrill_va/?igsh=MXY0OG0zMWxxcHZ1aA%3D%3D",
    whatsapp: "https://chat.whatsapp.com/EGfuwJYxzVyHRtXM91cHdn",
  },
  order: {
    aldie: "https://aldie.biryanigrill.com/",
    ashburn: "https://ashburn.biryanigrill.com",
    chantilly: "https://cash.app/order/$chantillybiryanigril",
  },
  forms: {
    cateringFranchise: "https://lek4cfkplhafxig3u3gxjm3wjm0frqxr.lambda-url.us-east-1.on.aws/",
    careers: "https://rim7kluksqczykyyh23imslpve0vkquk.lambda-url.us-east-1.on.aws/",
  },
};

function header(active = "") {
  const links = [
    ["Home", "index.html"],
    ["Menu", "index.html#menu"],
    ["Catering", "index.html#catering"],
    ["About", "index.html#about"],
    ["Contact Us", "index.html#locations"],
    ["Careers", "index.html#careers"],
    ["Franchise", "index.html#franchise"],
  ];
  return `<header class="site-header">
    <div class="header-inner max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
      <a href="index.html" class="shrink-0"><img src="${BRAND.logo}" alt="Biryani Grill Logo" class="brand-logo" loading="eager"></a>
      <nav class="top-nav hidden md:flex items-center gap-6 text-sm font-medium">
        ${links.map(([n, h]) => `<a class="${active === n ? "active" : "text-zinc-100 hover:text-yellow-300"}" href="${h}">${n}</a>`).join("")}
      </nav>
      <a href="index.html#location-modal" data-open-locations class="btn-gold px-4 py-2 rounded-lg text-sm">Order Now</a>
    </div>
  </header>`;
}

function footer() {
  return `<footer class="bg-black border-t border-yellow-500/20 mt-10">
    <div class="max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-3 gap-8 text-sm">
      <div><img src="${BRAND.logo}" alt="Biryani Grill Logo" class="h-12 mb-4"><p class="text-zinc-300">Serving authentic high quality Indian cuisine with passion and tradition.</p></div>
      <div><h4 class="text-yellow-300 font-semibold mb-3">Quick Links</h4><div class="space-y-2"><a href="index.html">Home</a><br><a href="index.html#about">About</a><br><a href="index.html#catering">Catering</a><br><a href="index.html#franchise">Franchise</a><br><a href="index.html#careers">Careers</a></div></div>
      <div><h4 class="text-yellow-300 font-semibold mb-3">Hours</h4><p class="text-zinc-300">Mon - Thu: 11:30AM - 2:30PM, 5:00PM - 12:00AM<br>Fri - Sun: 11:30AM - 12:00AM</p><div class="mt-4 flex gap-4"><a href="${BRAND.social.facebook}" target="_blank" rel="noopener">Facebook</a><a href="${BRAND.social.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${BRAND.social.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></div></div>
    </div><div class="max-w-7xl mx-auto px-4 py-4 border-t border-zinc-800 text-xs text-zinc-500">© 2026 Biryani Grill. All rights reserved.</div>
  </footer>`;
}

function mountChrome(active) {
  document.getElementById("site-header").innerHTML = header(active);
  document.getElementById("site-footer").innerHTML = footer();
}

function initFadeIns() {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("in-view")), { threshold: 0.12 });
  document.querySelectorAll(".fade-up").forEach((el) => io.observe(el));
}

function initLocationModal() {
  const modal = document.getElementById("location-modal");
  if (!modal) return;
  document.querySelectorAll("[data-open-locations]").forEach((btn) => btn.addEventListener("click", (e) => { e.preventDefault(); modal.classList.add("open"); }));
  modal.querySelectorAll("[data-close]").forEach((btn) => btn.addEventListener("click", () => modal.classList.remove("open")));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") modal.classList.remove("open"); });
}

function initHeaderScrollFx() {
  const update = () => document.body.classList.toggle("scrolled", window.scrollY > 16);
  update();
  window.addEventListener("scroll", update, { passive: true });
}

async function postJson(url, payload, okEl) {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error("Submission failed");
  okEl.textContent = "Thanks! Your request was submitted successfully.";
}

async function postFormData(url, payload, okEl) {
  const res = await fetch(url, { method: "POST", body: payload });
  if (!res.ok) throw new Error("Submission failed");
  okEl.textContent = "Thanks! Your request was submitted successfully.";
}

document.addEventListener("DOMContentLoaded", () => {
  mountChrome(document.body.dataset.page || "");
  initFadeIns();
  initLocationModal();
  initHeaderScrollFx();

  const catering = document.getElementById("catering-form");
  if (catering) catering.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = document.getElementById("catering-msg");
    ok.textContent = "";
    await postJson(BRAND.forms.cateringFranchise, Object.fromEntries(new FormData(catering).entries()), ok).catch(() => (ok.textContent = "Unable to submit right now."));
  });

  const franchise = document.getElementById("franchise-form");
  if (franchise) franchise.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = document.getElementById("franchise-msg");
    ok.textContent = "";
    await postJson(BRAND.forms.cateringFranchise, { type: "Franchise", ...Object.fromEntries(new FormData(franchise).entries()) }, ok).catch(() => (ok.textContent = "Unable to submit right now."));
  });

  const careers = document.getElementById("careers-form");
  if (careers) careers.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ok = document.getElementById("careers-msg");
    ok.textContent = "";
    await postFormData(BRAND.forms.careers, new FormData(careers), ok).catch(() => (ok.textContent = "Unable to submit right now."));
  });
});
