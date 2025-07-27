const htmlEl = document.documentElement;
const btnHamb = document.querySelector(".hamburger");
const drawer = document.getElementById("mobileMenu");
const scrim = document.querySelector(".scrim");
const btnClose = document.querySelector(".drawer-close");
let lastFocused = null;

function toggleDrawer(open) {
  htmlEl.classList.toggle("drawer-open", open);
  btnHamb.setAttribute("aria-expanded", open);
  drawer.setAttribute("aria-hidden", !open);
  document.body.style.overflow = open ? "hidden" : "";

  if (open) {
    lastFocused = document.activeElement;
    drawer.querySelector("a,button").focus();
  } else {
    lastFocused?.focus();
  }
}

btnHamb.addEventListener("click", () => toggleDrawer(true));
btnClose.addEventListener("click", () => toggleDrawer(false));
scrim.addEventListener("click", () => toggleDrawer(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && htmlEl.classList.contains("drawer-open")) {
    toggleDrawer(false);
  }
});
