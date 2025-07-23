      // Progress bar
      window.addEventListener("scroll", () => {
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / docHeight) * 100;
        document.getElementById("progress").style.width = scrolled + "%";
      });

      // Theme toggle
      const toggleButtons = [
        document.getElementById("themeToggle"),
        document.getElementById("themeToggleMobile"),
      ];
      toggleButtons.forEach(
        (btn) =>
          btn &&
          btn.addEventListener("click", () => {
            const current = document.documentElement.getAttribute("data-theme");
            const next = current === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            toggleButtons.forEach(
              (b) => b && (b.textContent = next === "dark" ? "☀️" : "🌙")
            );
            localStorage.setItem("theme", next);
          })
      );
      const saved = localStorage.getItem("theme");
      if (saved) {
        document.documentElement.setAttribute("data-theme", saved);
        toggleButtons.forEach(
          (b) => b && (b.textContent = saved === "dark" ? "☀️" : "🌙")
        );
      }

      // Mobile menu
      const hamburger = document.getElementById("hamburger");
      const mobileMenu = document.getElementById("mobileMenu");
      hamburger.addEventListener("click", toggleMenu);
      hamburger.addEventListener("keypress", (e) => {
        if (e.key === "Enter") toggleMenu();
      });
      function toggleMenu() {
        const expanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", String(!expanded));
        mobileMenu.style.display = expanded ? "none" : "flex";
      }

      // Smooth scroll
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener("click", (e) => {
          const id = a.getAttribute("href");
          if (id.length > 1) {
            e.preventDefault();
            document.querySelector(id).scrollIntoView({ behavior: "smooth" });
            mobileMenu.style.display = "none";
            hamburger.setAttribute("aria-expanded", "false");
          }
        });
      });

      // Reveal on scroll
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
      document
        .querySelectorAll(".reveal")
        .forEach((el) => observer.observe(el));

      // -------- Projects INFINITE LOOP ---------
      const track = document.getElementById("projectsTrack");
      const originalCards = [...track.children];
      originalCards.forEach((c) => track.appendChild(c.cloneNode(true))); // clone for seamless loop
      let loopSpeed = 0.5;
      let loopActive = true; // px/frame
      function loop() {
        if (loopActive) {
          track.scrollLeft += loopSpeed;
          const half = track.scrollWidth / 2;
          if (track.scrollLeft >= half) {
            track.scrollLeft = 0;
            document.getElementById("projProgress").style.width = "0%";
          }
          updateProgress();
        }
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
      track.addEventListener("mouseenter", () => (loopActive = false));
      track.addEventListener("mouseleave", () => (loopActive = true));

      const progress = document.getElementById("projProgress");
      function updateProgress() {
        const max = track.scrollWidth / 2 - track.clientWidth;
        if (max <= 0) {
          progress.style.width = "0%";
          return;
        }
        const ratio = track.scrollLeft / max;
        progress.style.width = ratio * 100 + "%";
        if (ratio >= 1) {
          progress.style.width = "0%";
        }
      }

      // filter buttons
      const filterBtns = document.querySelectorAll(".filter-btn");
      filterBtns.forEach((btn) =>
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          const cat = btn.dataset.filter;
          track.scrollLeft = 0;
          updateProgress();
          if (cat === "all") {
            [...track.children].forEach((el) => (el.style.display = "flex"));
            loopActive = true;
          } else {
            loopActive = false;
            [...track.children].forEach((el) => {
              el.style.display =
                el.getAttribute("data-cat") === cat ? "flex" : "none";
            });
          }
        })
      );

      // Project modal
      const projectCards = [...track.children].slice(0, originalCards.length);
      const projectModal = document.getElementById("projectModal");
      const projTitle = document.getElementById("projTitle");
      const projDesc = document.getElementById("projDesc");
      const projMedia = document.getElementById("projMedia");
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
        const media = JSON.parse(card.getAttribute("data-media") || "[]");
        projTitle.textContent = card.getAttribute("data-title");
        projDesc.textContent = card.getAttribute("data-desc");
        projMedia.innerHTML = "";
        media.forEach((m) => {
          if (m.type === "img") {
            const im = document.createElement("img");
            im.src = m.src;
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
        loopActive = false;
      }
      projectCards.forEach((card) =>
        card.addEventListener("click", () =>
          openProject(visibleCards().indexOf(card))
        )
      );
      closeProject.addEventListener("click", () => {
        projectModal.style.display = "none";
        projectModal.setAttribute("aria-hidden", "true");
        if (
          document.querySelector(".filter-btn.active").dataset.filter === "all"
        )
          loopActive = true;
      });
      projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) {
          projectModal.style.display = "none";
          projectModal.setAttribute("aria-hidden", "true");
          if (
            document.querySelector(".filter-btn.active").dataset.filter ===
            "all"
          )
            loopActive = true;
        }
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

      // -------- Testimonials infinite marquee --------
      const tSlider = document.getElementById("tSlider");
      const tTrack = document.getElementById("tTrack");
      const tOriginal = [...tTrack.children];
      tOriginal.forEach((card) => tTrack.appendChild(card.cloneNode(true))); // clone once
      let tOffset = 0;
      let tSpeed = 0.4;
      let tActive = true;
      function tLoop() {
        if (tActive) {
          tOffset += tSpeed;
          const width = tTrack.scrollWidth / 2;
          if (tOffset >= width) {
            tOffset = 0;
          }
          tTrack.style.transform = `translateX(-${tOffset}px)`;
        }
        requestAnimationFrame(tLoop);
      }
      requestAnimationFrame(tLoop);
      tSlider.addEventListener("mouseenter", () => (tActive = false));
      tSlider.addEventListener("mouseleave", () => (tActive = true));

      // Animate skill meters on reveal
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

      // FAQ accordion improved
      document.querySelectorAll(".faq-item").forEach((item) => {
        const q = item.querySelector(".faq-q");
        const a = item.querySelector(".faq-a");
        q.addEventListener("click", () => {
          const isOpen = item.classList.contains("open");
          document.querySelectorAll(".faq-item").forEach((it) => {
            it.classList.remove("open");
            it.querySelector(".faq-a").style.maxHeight = null;
          });
          if (!isOpen) {
            item.classList.add("open");
            a.style.maxHeight = a.scrollHeight + "px";
          }
        });
      });

      // Contact modal
      const modal = document.getElementById("contactModal");
      const openBtns = [
        document.getElementById("contactOpen"),
        document.getElementById("contactOpenMobile"),
        document.getElementById("ctaContact"),
        document.getElementById("ctaContactTop"),
      ];
      const closeModal = document.getElementById("closeModal");
      openBtns.forEach(
        (b) =>
          b &&
          b.addEventListener("click", () => {
            modal.style.display = "flex";
            modal.setAttribute("aria-hidden", "false");
          })
      );
      closeModal.addEventListener("click", () => {
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
      });
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
          modal.setAttribute("aria-hidden", "true");
        }
      });

      // Form submit
      document.getElementById("contactForm").addEventListener("submit", (e) => {
        e.preventDefault();
        document.getElementById("formMsg").style.display = "block";
        e.target.reset();
        const toast = document.getElementById("toast");
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3000);
      });

      // Year
      document.getElementById("year").textContent = new Date().getFullYear();
