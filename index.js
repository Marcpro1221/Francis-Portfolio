const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const heroTrack = document.querySelector("[data-hero-track]");
const heroButtons = [...document.querySelectorAll("[data-hero-dir]")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

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

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
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
  { threshold: 0.45, rootMargin: "-20% 0px -35% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));
