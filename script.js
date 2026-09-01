document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  const onScroll = () => {
    document.body.classList.toggle("solid-nav", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});

// ---------- gallery lightbox ----------
document.addEventListener("DOMContentLoaded", () => {
  const galleryImgs = Array.from(document.querySelectorAll(".gallery figure img"));
  if (!galleryImgs.length) return;

  const slides = galleryImgs.map(img => ({
    src: img.getAttribute("src"),
    caption: img.closest("figure").querySelector("figcaption")?.textContent || ""
  }));

  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">✕</button>
    <button class="lightbox-prev" aria-label="Previous">‹</button>
    <div class="lightbox-img-wrap">
      <img src="" alt="" />
      <p class="lightbox-caption"></p>
    </div>
    <button class="lightbox-next" aria-label="Next">›</button>
  `;
  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector("img");
  const captionEl = lightbox.querySelector(".lightbox-caption");
  let current = 0;

  function show(index) {
    current = (index + slides.length) % slides.length;
    imgEl.src = slides[current].src;
    imgEl.alt = slides[current].caption;
    captionEl.textContent = slides[current].caption;
  }

  function openAt(index) {
    show(index);
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  galleryImgs.forEach((img, i) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => openAt(i));
  });

  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
  lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
});

// ---------- disable right-click on images + show copyright notice ----------
document.addEventListener("DOMContentLoaded", () => {
  const notice = document.createElement("div");
  notice.className = "copyright-notice";
  notice.textContent = "This image is copyrighted © 2026 Mariga Bruce. Get in touch via the contact page.";
  document.body.appendChild(notice);

  document.addEventListener("contextmenu", (e) => {
    if (e.target.tagName !== "IMG") return;
    e.preventDefault();

    notice.style.left = e.pageX + "px";
    notice.style.top = e.pageY + "px";
    notice.classList.add("show");

    clearTimeout(notice._hideTimer);
    notice._hideTimer = setTimeout(() => {
      notice.classList.remove("show");
    }, 2200);
  });
});