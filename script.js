const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const motionToggle = document.querySelector(".motion-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

[
  ...document.querySelectorAll(
    ".section-index, .intro-grid > h2, .section-title-row h2, .impact-section > h2, .contact-content h2, .contact-kicker, .proof-item"
  ),
].forEach((element) => element.classList.add("reveal"));

document
  .querySelectorAll(".proof-grid, .project-list, .approach-grid, .impact-grid, .experience-list, .leadership-grid")
  .forEach((group) => {
    [...group.children]
      .filter((element) => element.classList.contains("reveal"))
      .forEach((element, index) => {
        element.style.setProperty("--reveal-delay", `${Math.min(index * 110, 330)}ms`);
      });
  });

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav.classList.toggle("is-open", !isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

motionToggle.addEventListener("click", () => {
  const motionIsOn = motionToggle.getAttribute("aria-pressed") === "true";
  motionToggle.setAttribute("aria-pressed", String(!motionIsOn));
  document.body.classList.toggle("motion-off", motionIsOn);
  motionToggle.innerHTML = motionIsOn
    ? '<span class="motion-symbol">▶</span> MOTION OFF'
    : '<span class="motion-symbol">Ⅱ</span> MOTION ON';
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
document.querySelector("#year").textContent = new Date().getFullYear();

let scrollUpdateQueued = false;
const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  document.documentElement.style.setProperty("--scroll-progress", String(progress));
  scrollUpdateQueued = false;
};

window.addEventListener(
  "scroll",
  () => {
    if (!scrollUpdateQueued) {
      scrollUpdateQueued = true;
      window.requestAnimationFrame(updateScrollProgress);
    }
  },
  { passive: true }
);
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if (reducedMotion.matches) {
  document.body.classList.add("motion-off");
  motionToggle.setAttribute("aria-pressed", "false");
  motionToggle.innerHTML = '<span class="motion-symbol">▶</span> MOTION OFF';
} else {
  document.body.classList.add("motion-ready");
}
