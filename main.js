// ======================= main.js =======================

/* Progress bar */
window.addEventListener("scroll", () => {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrolled = (window.scrollY / docHeight) * 100;
  document.getElementById("progress").style.width = scrolled + "%";
});

/* Theme toggle */
const toggleButtons = [
  document.getElementById("themeToggle"),
  document.getElementById("themeToggleMobile"),
];
function setTheme(next) {
  document.documentElement.setAttribute("data-theme", next);
  toggleButtons.forEach(
    (b) => b && (b.textContent = next === "dark" ? "☀️" : "🌙")
  );
  localStorage.setItem("theme", next);
}
toggleButtons.forEach(
  (btn) =>
    btn &&
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    })
);
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}

/* Mobile menu */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
mobileMenu.hidden = true;
hamburger.addEventListener("click", () => {
  const isOpen = !mobileMenu.hidden;
  hamburger.setAttribute("aria-expanded", String(!isOpen));
  mobileMenu.hidden = isOpen;
});

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: "smooth" });
      mobileMenu.hidden = true;
      hamburger.setAttribute("aria-expanded", "false");
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

/* Projects progress */
const track = document.getElementById("projectsTrack");
const progress = document.getElementById("projProgress");
function updateProjProgress() {
  const max = track.scrollWidth - track.clientWidth;
  progress.style.width = max <= 0 ? "0%" : (track.scrollLeft / max) * 100 + "%";
}
track.addEventListener("scroll", updateProjProgress);

/* Filter */
const filterBtns = document.querySelectorAll(".filter-btn");
filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    track.scrollLeft = 0;
    updateProjProgress();
    [...track.children].forEach((el) => {
      el.style.display =
        cat === "all" || el.getAttribute("data-cat") === cat ? "flex" : "none";
    });
  })
);

/* Project modal */
const projectCards = [...document.querySelectorAll(".project-card")];
const projectModal = document.getElementById("projectModal");
const projTitle = document.getElementById("projTitle");
const projDesc = document.getElementById("projDesc");
const projMedia = document.getElementById("projMedia");
const projKpi = document.getElementById("projKpi");
const closeProject = document.getElementById("closeProject");
const projPrevBtn = document.getElementById("projModalPrev");
const projNextBtn = document.getElementById("projModalNext");
let currentIndex = 0;

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
}
projectCards.forEach((card) => {
  const btn = card.querySelector(".see-more");
  btn.addEventListener("click", (e) => {
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
  projectModal.style.display = "none";
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  document.title = "PyDevStudio – Back‑end Python & data";
}
closeProject.addEventListener("click", closeProjModal);
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

/* Skill meters */
const meters = document.querySelectorAll(".meter span");
meters.forEach((m) => {
  const w = m.style.width;
  m.style.width = "0";
  m.dataset.to = w;
});
const meterObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.to;
        meterObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.4 }
);
meters.forEach((m) => meterObs.observe(m));

/* FAQ */
document.querySelectorAll(".faq-item").forEach((item) => {
  const q = item.querySelector(".faq-q");
  const a = item.querySelector(".faq-a");
  q.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((it) => {
      it.classList.remove("open");
      it.querySelector(".faq-a").style.maxHeight = null;
      it.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      a.style.maxHeight = a.scrollHeight + "px";
      q.setAttribute("aria-expanded", "true");
    }
  });
});

/* Contact modal */
const modal = document.getElementById("contactModal");
const openBtns = [
  document.getElementById("contactOpen"),
  document.getElementById("contactOpenMobile"),
  document.getElementById("ctaContact"),
  document.getElementById("ctaContactTop"),
  document.getElementById("ctaSticky"),
  document.getElementById("ctaWrite"),
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

/* Error log */
window.addEventListener("error", (e) => console.warn("[JS Error]", e.message));
window.addEventListener("unhandledrejection", (e) =>
  console.warn("[Promise]", e.reason)
);
