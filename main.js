const htmlEl = document.documentElement;
const btnHamb = document.querySelector(".hamburger");
const drawer = document.querySelector(".drawer-top");
const scrim = document.querySelector(".scrim");
const btnClose = document.querySelector(".drawer-close");
let lastFocused;

/**
 * Ouvre/ferme le drawer en fullscreen,
 * gère aria-attributes, scroll-lock et focus-trap.
 */
function toggleDrawer(open) {
  htmlEl.classList.toggle("drawer-open", open);
  btnHamb.setAttribute("aria-expanded", open);
  drawer.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";

  if (open) {
    lastFocused = document.activeElement;
    drawer.querySelector("a,button")?.focus();
  } else {
    lastFocused?.focus();
  }
}

// Événements d’ouverture/fermeture
btnHamb.addEventListener("click", () => toggleDrawer(true));
btnClose.addEventListener("click", () => toggleDrawer(false));
scrim.addEventListener("click", () => toggleDrawer(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && htmlEl.classList.contains("drawer-open")) {
    toggleDrawer(false);
  }
});
