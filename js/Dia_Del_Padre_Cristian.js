/* =================================================================
   FELIZ DÍA DEL PADRE · CRISTIAN — main.js
   -----------------------------------------------------------------
   1. Loader (la niebla se disipa)
   2. Reveal al hacer scroll (IntersectionObserver)
   3. Linterna que sigue al cursor (solo escritorio)
   4. Parallax suave del hero
   5. Ceniza flotando (canvas)
   Todo respeta "prefers-reduced-motion".
================================================================= */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ----------------------- 1. LOADER ------------------------- */
  const loader = document.getElementById("loader");
  function hideLoader() {
    if (!loader) return;
    loader.classList.add("is-done");
    setTimeout(() => loader.remove(), 1300);
  }
  window.addEventListener("load", () => {
    setTimeout(hideLoader, reduceMotion ? 200 : 1100);
  });
  setTimeout(hideLoader, 4500);

  /* -------------- 2. REVEAL AL HACER SCROLL ------------------ */
  const revealEls = document.querySelectorAll("[data-reveal]");

  revealEls.forEach((el) => {
    const d = el.getAttribute("data-delay");
    if (d) el.style.setProperty("--d", d);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ------------- 3. LINTERNA QUE SIGUE AL CURSOR ------------- */
  const flashlight = document.getElementById("flashlight");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (flashlight && finePointer && !reduceMotion) {
    let raf = null;
    let tx = 50, ty = 50;
    window.addEventListener(
      "pointermove",
      (e) => {
        tx = (e.clientX / window.innerWidth) * 100;
        ty = (e.clientY / window.innerHeight) * 100;
        if (!raf) {
          raf = requestAnimationFrame(() => {
            flashlight.style.setProperty("--mx", tx + "%");
            flashlight.style.setProperty("--my", ty + "%");
            flashlight.style.opacity = "1";
            raf = null;
          });
        }
      },
      { passive: true }
    );
    window.addEventListener("pointerleave", () => {
      flashlight.style.opacity = "0";
    });
  }

  /* ---------------- 4. PARALLAX DEL HERO --------------------
     Solo en modo inmersivo (pantallas apaisadas). En la banda
     vertical la imagen no se transforma.                       */
  const heroImg = document.querySelector(".hero__img");
  const immersive = window.matchMedia("(min-aspect-ratio: 1/1)");
  if (heroImg && !reduceMotion) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (immersive.matches && window.scrollY < window.innerHeight) {
              const y = window.scrollY;
              heroImg.style.transform =
                "scale(1.06) translate3d(0," + y * 0.18 + "px,0)";
            } else if (!immersive.matches) {
              heroImg.style.transform = "";
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ------------------ 5. CENIZA (CANVAS) -------------------- */
  const canvas = document.getElementById("ash");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w, h, particles, dpr;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const count = Math.round((window.innerWidth * window.innerHeight) / 32000);
      particles = Array.from({ length: Math.min(count, 70) }, makeParticle);
    }

    function makeParticle() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.6 + 0.4) * dpr,
        vy: (Math.random() * 0.25 + 0.05) * dpr,
        vx: (Math.random() - 0.5) * 0.2 * dpr,
        a: Math.random() * 0.4 + 0.1,
        drift: Math.random() * Math.PI * 2,
      };
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.drift += 0.01;
        p.x += p.vx + Math.sin(p.drift) * 0.15 * dpr;
        p.y -= p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(205, 212, 213," + p.a + ")";
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    size();
    tick();

    let resizeT;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(size, 200);
    });
  }

  /* ------------------ 6. AUDIO DE FONDO --------------------- */
  const bgMusic = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");

  if (bgMusic) {
    bgMusic.volume = 0.5;

    // Truco: empezar muteado (los navegadores permiten autoplay mudo)
    // y desmutear inmediatamente después — así suena solo al entrar
    bgMusic.muted = true;
    bgMusic.play().then(() => {
      bgMusic.muted = false;
    }).catch(() => {
      // Si el navegador bloquea incluso el muted, esperar primera interacción
      bgMusic.muted = false;
      const unlock = () => {
        bgMusic.play().catch(() => {});
        document.removeEventListener("click", unlock);
        document.removeEventListener("touchstart", unlock);
      };
      document.addEventListener("click", unlock);
      document.addEventListener("touchstart", unlock, { passive: true });
    });

    // Botón mute/unmute
    if (musicBtn) {
      musicBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
          bgMusic.play();
          musicBtn.classList.remove("is-muted");
          musicBtn.setAttribute("aria-label", "Silenciar música");
        } else {
          bgMusic.pause();
          musicBtn.classList.add("is-muted");
          musicBtn.setAttribute("aria-label", "Reanudar música");
        }
      });
    }
  }
})();
