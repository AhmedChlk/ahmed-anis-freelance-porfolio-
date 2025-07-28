/* -------- Navigation drawer -------- */
const html = document.documentElement,
  ham = document.querySelector(".hamburger"),
  scrim = document.querySelector(".scrim"),
  drawer = document.querySelector(".mobile-drawer");

ham?.addEventListener("click", toggleDrawer);
scrim?.addEventListener("click", toggleDrawer);
document.addEventListener(
  "keydown",
  (e) => e.key === "Escape" && drawerOpen(false)
);

function toggleDrawer() {
  drawerOpen(!drawer.classList.contains("drawer--open"));
}
function drawerOpen(open) {
  drawer.classList.toggle("drawer--open", open);
  scrim.toggleAttribute("hidden", !open);
  html.style.overflow = open ? "hidden" : "";
  if (open) drawer.querySelector("a")?.focus();
}

/* -------- Nav underline -------- */
const underline = document.querySelector(".nav-underline");
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("mouseenter", (e) => {
    underline.style.left = e.target.offsetLeft + "px";
    underline.style.width = e.target.offsetWidth + "px";
  })
);
document
  .querySelector(".nav-links ul")
  ?.addEventListener("mouseleave", () => (underline.style.width = 0));

/* -------- Reveal on scroll -------- */
const revealIO = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        revealIO.unobserve(en.target);
      }
    }),
  { threshold: 0.2 }
);
document
  .querySelectorAll(".card, .why-grid li, .cases-grid li")
  .forEach((el) => revealIO.observe(el));

/* -------- Floating CTA visibility -------- */
const floatBtn = document.querySelector(".btn-float");
const formSection = document.querySelector("#reservation");
new IntersectionObserver(
  (entries) => {
    floatBtn.style.display = entries[0].isIntersecting ? "none" : "inline-flex";
  },
  { threshold: 0.4 }
).observe(formSection);

/* -------- Multi‑step form -------- */
const form = document.getElementById("demoForm");
if (form) {
  const steps = [...form.querySelectorAll(".form-step")];
  const progress = form.querySelector(".progress");
  const label = form.querySelector(".form-progress__label");
  let idx = 0;

  form.addEventListener("click", (e) => {
    if (e.target.matches(".btn-next")) changeStep(1);
    if (e.target.matches(".btn-prev")) changeStep(-1);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    completeForm();
  });

  function changeStep(dir) {
    if (
      ![...steps[idx].querySelectorAll("input,select,textarea")].every((f) =>
        f.reportValidity()
      )
    )
      return;
    steps[idx].classList.remove("form-step--current");
    idx += dir;
    steps[idx].classList.add("form-step--current");
    updateProgress();
  }
  function updateProgress() {
    const total = steps.length;
    const pct = ((idx + 1) / total) * 100;
    progress.style.strokeDashoffset = 339 - 339 * (pct / 100);
    label.textContent = `${idx + 1} / ${total}`;
  }
  function completeForm() {
    form.classList.add("form--complete");
    form.querySelector(".form-success").hidden = false;

    /* optional confetti */
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      import(
        "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
      ).then((m) =>
        m.default({ particleCount: 120, spread: 90, origin: { y: 0.7 } })
      );
    }
  }
}

/* -------- Testimonials auto‑slider (desktop) -------- */
const track = document.querySelector(".testimonials-track");
if (track && track.children.length > 1) {
  let i = 0;
  setInterval(() => {
    i = (i + 1) % track.children.length;
    track.scrollTo({
      left: i * (track.firstElementChild.offsetWidth + 24),
      behavior: "smooth",
    });
  }, 5000);
}
