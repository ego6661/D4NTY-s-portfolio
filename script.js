// Lucide icons (initial)
lucide.createIcons();

/* =========================
   Theme Toggle (Light/Dark)
   ========================= */
const themeToggle = document.getElementById("themeToggle");
const themeIconWrap = document.getElementById("themeIcon");

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  // Update icon: dark => sun, light => moon
  if (themeIconWrap) {
    const icon = theme === "dark" ? "sun" : "moon";
    themeIconWrap.innerHTML = `<i data-lucide="${icon}" class="i"></i>`;
    lucide.createIcons(); // re-render lucide icons after changing data-lucide
  }
}

// Load saved theme OR system preference
(function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    applyTheme(saved);
    return;
  }

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(prefersDark ? "dark" : "light");
})();

themeToggle?.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);
});

/* =========================
   Mobile nav toggle
   ========================= */
const toggle = document.querySelector(".nav__toggle");
const links = document.getElementById("navLinks");

toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

// Close menu when clicking a link (mobile)
document.querySelectorAll(".nav__link").forEach((a) => {
  a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

/* =========================
   Scroll reveal animation
   ========================= */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => io.observe(el));

/* =========================
   Active nav link on scroll
   ========================= */
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav__link")];

const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((l) =>
        l.classList.toggle("is-active", l.getAttribute("href") === `#${id}`)
      );
    });
  },
  { rootMargin: "-35% 0px -60% 0px" }
);

sections.forEach((s) => spy.observe(s));

/* =========================
   Soft parallax for hero glow
   ========================= */
const wrap = document.getElementById("portraitWrap");
const glow = document.getElementById("glow");

if (wrap && glow) {
  wrap.addEventListener("mousemove", (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width; // 0..1
    const y = (e.clientY - r.top) / r.height; // 0..1

    const tx = (x - 0.5) * 16;
    const ty = (y - 0.5) * 16;

    glow.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  });

  wrap.addEventListener("mouseleave", () => {
    glow.style.transform = "translate3d(0,0,0)";
  });
}

/* =========================
   Contact form (Formspree)
   ========================= */
const form = document.getElementById("contactForm");
const note = document.getElementById("formNote");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form || !note) return;

  note.textContent = "Sending...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      note.textContent = "Message sent. Thanks for reaching out!";
      form.reset();
      return;
    }

    note.textContent = "Something went wrong. Please try again.";
  } catch (err) {
    note.textContent = "Network error. Please try again.";
  }
});
