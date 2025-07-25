const htmlEl = document.documentElement;
const btnHamb = document.querySelector(".hamburger");
const drawer = document.querySelector(".drawer-top");
const scrim = document.querySelector(".scrim");
const btnClose = document.querySelector(".drawer-close");

function toggleDrawer(open) {
  htmlEl.classList.toggle("drawer-open", open);
  btnHamb.setAttribute("aria-expanded", open);
  drawer.setAttribute("aria-hidden", !open);
}

btnHamb.addEventListener("click", () => toggleDrawer(true));
btnClose.addEventListener("click", () => toggleDrawer(false));
scrim.addEventListener("click", () => toggleDrawer(false));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && htmlEl.classList.contains("drawer-open")) {
    toggleDrawer(false);
  }
});
