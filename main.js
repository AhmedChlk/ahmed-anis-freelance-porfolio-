/* NAVIGATION & DRAWER */
const htmlEl = document.documentElement;
const ham = document.querySelector(".hamburger");
const scrim = document.querySelector(".scrim");
const drawer = document.querySelector(".mobile-drawer");
const closeBtn = document.querySelector(".drawer-close");

ham.addEventListener("click", () => openDrawer());
closeBtn.addEventListener("click", () => closeDrawer());
scrim.addEventListener("click", () => closeDrawer());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDrawer();
});

function openDrawer() {
  drawer.classList.add("drawer--open");
  scrim.classList.add("scrim--show");
  ham.setAttribute("aria-expanded", "true");
  htmlEl.style.overflow = "hidden";
  drawer.querySelector("a").focus();
}
function closeDrawer() {
  drawer.classList.remove("drawer--open");
  scrim.classList.remove("scrim--show");
  ham.setAttribute("aria-expanded", "false");
  htmlEl.style.overflow = "";
}

/* NAV underline */
const links = document.querySelectorAll(".nav-links a");
const underline = document.querySelector(".nav-underline");
links.forEach((l) => {
  l.addEventListener("mouseenter", (e) => {
    underline.style.left = e.target.offsetLeft + "px";
    underline.style.width = e.target.offsetWidth + "px";
  });
});
document
  .querySelector(".nav-links ul")
  .addEventListener("mouseleave", () => (underline.style.width = "0"));

/* SCROLL observer (cards, why items) */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll(".card, .why li").forEach((el) => io.observe(el));

/* CTA float — hide when form open */
const btnFloat = document.querySelector(".btn-float");
const formSection = document.querySelector("#reservation");
const ctaToggle = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      btnFloat.style.display = e.isIntersecting ? "none" : "inline-flex";
    });
  },
  { threshold: 0.4 }
);
ctaToggle.observe(formSection);

/* MULTI‑STEP FORM */
const form = document.getElementById("demoForm");
const steps = [...form.querySelectorAll(".form-step")];
const nextBtns = form.querySelectorAll(".btn-next");
const prevBtns = form.querySelectorAll(".btn-prev");
const progressEl = form.querySelector(".progress");
const labelEl = form.querySelector(".form-progress__label");
let currentStep = 0;

nextBtns.forEach((btn) => btn.addEventListener("click", () => changeStep(1)));
prevBtns.forEach((btn) => btn.addEventListener("click", () => changeStep(-1)));
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.classList.add("form--complete");
});

function changeStep(dir) {
  if (!validateStep()) return;
  steps[currentStep].classList.remove("form-step--current");
  currentStep += dir;
  steps[currentStep].classList.add("form-step--current");
  updateProgress();
}
function validateStep() {
  const fields = steps[currentStep].querySelectorAll("input,select,textarea");
  return [...fields].every((f) => f.reportValidity());
}
function updateProgress() {
  const percent = ((currentStep + 1) / steps.length) * 100;
  progressEl.style.strokeDashoffset = 339 - 339 * (percent / 100);
  labelEl.textContent = `${currentStep + 1} / ${steps.length}`;
}

/* CONFETTI (motion‑safe) */
form.addEventListener("animationend", (e) => {
  if (e.animationName === "formSuccess") {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      import("https://cdn.skypack.dev/canvas-confetti").then((mod) => {
        mod.default({ particleCount: 120, spread: 90, origin: { y: 0.7 } });
      });
    }
  }
});
