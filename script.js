/**
 * Portfolio interactions
 * - Smooth scrolling for in-page anchors (with sticky-nav offset)
 * - Active nav link highlighting while scrolling
 * - Mobile hamburger menu
 */

(() => {
  document.getElementById("current-year").textContent = new Date().getFullYear();

  const NAV_OFFSET = 80;
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = ["about", "skills", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const updateReadMoreButtons = () => {
    document.querySelectorAll(".project-card").forEach((card) => {
      const description = card.querySelector(".project-desc");
      const button = card.querySelector(".btn-read-more");
      if (!description || !button) return;

      if (description.classList.contains("is-expanded")) {
        button.style.display = "inline-block";
        return;
      }

      button.style.display = "inline-block";
      button.style.display =
        description.scrollHeight > description.clientHeight
          ? "inline-block"
          : "none";
    });
  };

  document.querySelectorAll(".btn-read-more").forEach((button) => {
    button.addEventListener("click", () => {
      const description = button
        .closest(".project-body")
        .querySelector(".project-desc");
      const expanded = description.classList.toggle("is-expanded");

      button.textContent = expanded ? "show less" : "read more...";
      button.setAttribute("aria-expanded", String(expanded));
      updateReadMoreButtons();
    });
  });
  window.addEventListener("resize", updateReadMoreButtons);
  window.addEventListener("load", updateReadMoreButtons);
  updateReadMoreButtons();

  /* ----- Mobile menu ----- */
  const setMenuOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("is-open"));
  });

  /* Close the drawer after navigating or clicking outside */
  document.addEventListener("click", (event) => {
    if (!menu.classList.contains("is-open")) return;
    const insideNav = navbar.contains(event.target);
    if (!insideNav) setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  /* ----- Smooth scroll with header offset ----- */
  const scrollToHash = (hash) => {
    const id = hash.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "smooth" });
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();
      setMenuOpen(false);
      scrollToHash(hash);
      history.pushState(null, "", hash);
    });
  });

  /* ----- Active section highlighting ----- */
  const setActiveLink = () => {
    const fromTop = window.scrollY + NAV_OFFSET + 24;
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      if (section.offsetTop <= fromTop) {
        currentId = section.id;
      }
    });

    /* Clear highlight near the very top (hero) */
    if (window.scrollY < 120) {
      currentId = null;
    }

    navLinks.forEach((link) => {
      const isActive = currentId && link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("is-active", Boolean(isActive));
    });
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setActiveLink();
        ticking = false;
      });
    },
    { passive: true }
  );

  setActiveLink();
})();
