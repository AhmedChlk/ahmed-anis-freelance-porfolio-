// Toggle mobile drawer & focus management
const htmlEl = document.documentElement;
const btnHamb = document.querySelector(".hamburger");
const scrim = document.querySelector(".scrim");
const drawer = document.querySelector(".mobile-drawer");
const btnClose = document.querySelector(".drawer-close");
let lastFocus = null;

function openDrawer() {
  lastFocus = document.activeElement;
  htmlEl.classList.add("drawer-open");
  btnHamb.setAttribute("aria-expanded", "true");
  drawer.setAttribute("aria-hidden", "false");
  drawer.querySelector("a, button").focus();
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  htmlEl.classList.remove("drawer-open");
  btnHamb.setAttribute("aria-expanded", "false");
  drawer.setAttribute("aria-hidden", "true");
  lastFocus?.focus();
  document.body.style.overflow = "";
}

btnHamb.addEventListener("click", openDrawer);
btnClose.addEventListener("click", closeDrawer);
scrim.addEventListener("click", closeDrawer);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && htmlEl.classList.contains("drawer-open")) {
    closeDrawer();
  }
});

// IntersectionObserver pour l'animation fadeInUp des cartes
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
document.querySelectorAll(".card").forEach((card) => {
  observer.observe(card);
});
