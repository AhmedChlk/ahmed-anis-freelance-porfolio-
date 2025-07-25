
// Charge focus‑trap en UMD, sinon ignore (le site reste fonctionnel)
let trapFocus = () => ({ deactivate: () => {} });
try {
  const mod = await import(
    'https://cdn.jsdelivr.net/npm/focus-trap@7/dist/focus-trap.esm.js'
  );
  trapFocus = mod.default || mod.trapFocus;
} catch (e) {
  console.warn('focus‑trap non chargé, fallback noop', e);
}

/* Progress bar */
window.addEventListener("scroll", () => {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  document.getElementById("progress").style.width = scrolled + "%";
  const header = document.querySelector("header");
  if (window.scrollY > 0) header.classList.add("navbar-shadow");
  else header.classList.remove("navbar-shadow");
});


/* Mobile menu */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("open");
  hamburger.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.classList.toggle("open");
  document.body.classList.toggle("modal-open", !isOpen);
});

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
      mobileMenu.classList.remove("open");
      document.body.classList.remove("modal-open");
    }
  });
});

/* Reveal */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* Projects */
const projectsGrid = document.querySelector(".projects-grid");
const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    [...projectsGrid.children].forEach((el) => {
      el.style.display =
        cat === "all" || el.getAttribute("data-cat") === cat ? "" : "none";
    });
  })
);

/* Project modal */
const projectCards = [...document.querySelectorAll(".card-project")];
const projectModal = document.getElementById("projectModal");
const projTitle = document.getElementById("projTitle");
const projDesc = document.getElementById("projDesc");
const projMedia = document.getElementById("projMedia");
const projKpi = document.getElementById("projKpi");
const closeProject = document.getElementById("closeProject");
const projPrevBtn = document.getElementById("projModalPrev");
const projNextBtn = document.getElementById("projModalNext");
let currentIndex = 0;
let modalTrap = null;

function visibleCards() {
  return projectCards.filter((c) => c.style.display !== "none");
}
function openProject(i) {
  const cards = visibleCards();
  currentIndex = i;
  const card = cards[i];
  if (!card) return;
  document.title = card.dataset.title + " | PyDevStudio";
  const media = JSON.parse(card.getAttribute("data-media") || "[]");
  projTitle.textContent = card.getAttribute("data-title");
  projDesc.textContent = card.getAttribute("data-desc");
  projKpi.textContent = card.dataset.kpi || "";
  projMedia.innerHTML = "";
  media.forEach((m) => {
    if (m.type === "img") {
      const im = document.createElement("img");
      im.src = m.src;
      im.alt = m.alt || "";
      projMedia.appendChild(im);
    } else if (m.type === "video") {
      const v = document.createElement("video");
      v.src = m.src;
      v.controls = true;
      projMedia.appendChild(v);
    }
  });
  projectModal.style.display = "flex";
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalTrap && modalTrap.deactivate();
  modalTrap = trapFocus(projectModal, { escapeDeactivates: true });
}
projectCards.forEach((card) => {
  const btn = card.querySelector(".see-more");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openProject(visibleCards().indexOf(card));
  });
  card.addEventListener("keypress", (e) => {
    if (e.key === "Enter") openProject(visibleCards().indexOf(card));
  });
  card.addEventListener("click", () =>
    openProject(visibleCards().indexOf(card))
  );
});
function closeProjModal() {
  modalTrap && modalTrap.deactivate();
  modalTrap = null;
  projectModal.style.display = "none";
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  document.title = "PyDevStudio – Back‑end Python & data";
}
closeProject.addEventListener('click', () => {
  modalTrap && modalTrap.deactivate();
  modalTrap = null;
  closeProjModal();
});
projectModal.addEventListener("click", (e) => {
  if (e.target === projectModal) closeProjModal();
});
projPrevBtn.addEventListener("click", () => {
  const cards = visibleCards();
  currentIndex = (currentIndex - 1 + cards.length) % cards.length;
  openProject(currentIndex);
});
projNextBtn.addEventListener("click", () => {
  const cards = visibleCards();
  currentIndex = (currentIndex + 1) % cards.length;
  openProject(currentIndex);
});



/* Contact modal */
const modal = document.getElementById("contactModal");
const openBtns = [
  document.getElementById("contactOpen"),
  document.getElementById("contactOpenMobile"),
  document.getElementById("ctaContact"),
  document.getElementById("ctaContactTop"),
  document.getElementById("ctaSticky"),
];
const closeModal = document.getElementById("closeModal");
function openContact() {
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}
openBtns.forEach(
  (b) =>
    b &&
    b.addEventListener("click", (e) => {
      e.preventDefault();
      openContact();
    })
);
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
});

/* Form submit */
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("formMsg").style.display = "block";
  e.target.reset();
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
});

/* Year */
document.getElementById("year").textContent = new Date().getFullYear();

/* To Top button */
const toTop = document.getElementById("toTop");
toTop.onclick = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

/* FAQ exclusive open */
document.querySelectorAll('.faq-item').forEach(d => {
  d.addEventListener('toggle', e => {
    if (d.open) {
      document.querySelectorAll('.faq-item').forEach(o => {
        if (o !== d) o.removeAttribute('open');
      });
    }
  });
});

