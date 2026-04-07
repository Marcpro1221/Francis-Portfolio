const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const heroTrack = document.querySelector("[data-hero-track]");
const heroButtons = [...document.querySelectorAll("[data-hero-dir]")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const isSmallScreen = () => window.innerWidth <= 560;

if (toggle && header) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    header.classList.toggle("menu-open", !expanded);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!header || !toggle) {
      return;
    }

    header.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

if (heroTrack && heroButtons.length) {
  const scrollHero = (direction) => {
    const firstPanel = heroTrack.querySelector(".hero-panel");
    const panelWidth = firstPanel ? firstPanel.getBoundingClientRect().width : heroTrack.clientWidth;
    const gap = 24;
    heroTrack.scrollBy({
      left: direction * (panelWidth + gap),
      behavior: "smooth",
    });
  };

  heroButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.heroDir === "next" ? 1 : -1;
      scrollHero(direction);
    });
  });
}

let revealObserver;

const setupRevealObserver = () => {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  if (isSmallScreen()) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );

  revealItems.forEach((item) => {
    if (!item.classList.contains("is-visible")) {
      revealObserver.observe(item);
    }
  });
};

let sectionObserver;

const setupSectionObserver = () => {
  if (sectionObserver) {
    sectionObserver.disconnect();
  }

  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const id = `#${entry.target.id}`;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { threshold: 0.35, root: null, rootMargin: "-10% 0px -10% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
};

setupSectionObserver();
setupRevealObserver();
window.addEventListener("resize", setupSectionObserver);
window.addEventListener("resize", setupRevealObserver);
