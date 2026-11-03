const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

const slides = document.querySelectorAll("#heroMedia .hs");
if (!reduced && slides.length > 1) {
  let current = 0;
  const dots = document.querySelector("#heroDots");
  if (dots) {
    dots.innerHTML = [...slides].map((_, i) => `<i${i ? "" : ' class="is-on"'}></i>`).join("");
  }
  const show = (index) => {
    slides[current].classList.remove("is-on");
    dots?.children[current]?.classList.remove("is-on");
    current = (index + slides.length) % slides.length;
    const next = slides[current];
    if (next.dataset.src && !next.getAttribute("src")) {
      next.src = next.dataset.src;
    }
    next.classList.add("is-on");
    dots?.children[current]?.classList.add("is-on");
  };
  setInterval(() => show(current + 1), 5600);
}

if (!reduced) {
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);
  const parallax = [...document.querySelectorAll("[data-parallax]")];
  let ticking = false;
  const frame = () => {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    parallax.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const shift = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.08;
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.08)`;
    });
  };
  addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }, { passive: true });
  frame();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal, .feature-list, .climate-list, .ex-top, .film-row, .stats").forEach((el) => io.observe(el));

  const count = (el) => {
    const to = Number(el.dataset.count);
    if (!Number.isFinite(to)) return;
    const start = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - start) / 1100);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach(count);
      statsIO.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll(".stats, .fact-strip").forEach((el) => statsIO.observe(el));

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".btn-primary").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.25;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
      button.addEventListener("pointerleave", () => { button.style.transform = ""; });
    });
  }
}
