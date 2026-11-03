(() => {
  const dreamscapeLink = document.querySelector('.dreamscape-link');
  if (dreamscapeLink && window.location.protocol === 'file:') {
    dreamscapeLink.href = window.location.pathname.includes('/dist/')
      ? 'landing-pages/kage.html'
      : 'public/landing-pages/kage.html';
  }

  const revealItems = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.querySelector('.reading-progress span');
  let scrollFrame = 0;

  function updateProgress() {
    scrollFrame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();

  if (!reduceMotion) {
    const field = document.querySelector('.petal-field');
    const marks = ['♡', '✧', '·', '❀'];
    for (let index = 0; index < 17; index += 1) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = marks[index % marks.length];
      petal.style.setProperty('--left', `${Math.random() * 100}%`);
      petal.style.setProperty('--size', `${10 + Math.random() * 12}px`);
      petal.style.setProperty('--duration', `${13 + Math.random() * 14}s`);
      petal.style.setProperty('--delay', `${-Math.random() * 25}s`);
      petal.style.setProperty('--sway', `${-60 + Math.random() * 120}px`);
      petal.style.setProperty('--alpha', `${0.2 + Math.random() * 0.42}`);
      field.append(petal);
    }
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        const item = entry.target;
        if (item.matches('.gallery-card')) {
          item.classList.toggle('scroll-present', entry.isIntersecting);
          if (entry.isIntersecting) item.classList.add('is-visible');
        } else if (entry.isIntersecting) {
          item.classList.add('is-visible');
          activeObserver.unobserve(item);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const cards = [...document.querySelectorAll('.gallery-card')];
  const viewer = document.querySelector('.lightbox');
  const viewerImage = viewer.querySelector('img');
  const viewerCaption = viewer.querySelector('figcaption');
  let currentPhoto = 0;

  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    cards.forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--card-ry', `${(x * 9).toFixed(2)}deg`);
        card.style.setProperty('--card-rx', `${(-y * 8).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--card-ry', '0deg');
        card.style.setProperty('--card-rx', '0deg');
      });
    });
  }

  function showPhoto(index) {
    currentPhoto = (index + cards.length) % cards.length;
    const card = cards[currentPhoto];
    const sourceImage = card.querySelector('img');
    viewerImage.src = sourceImage.src;
    viewerImage.alt = sourceImage.alt;
    viewerCaption.textContent = card.querySelector('.gallery-label').textContent.trim();
    viewerImage.classList.remove('photo-arrive');
    requestAnimationFrame(() => viewerImage.classList.add('photo-arrive'));
  }

  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      showPhoto(index);
      viewer.showModal();
    });
  });

  viewer.querySelector('.lightbox-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
  viewer.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
    if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
  });

  let touchStartX = 0;
  viewer.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  viewer.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 55) showPhoto(currentPhoto + (distance < 0 ? 1 : -1));
  }, { passive: true });
})();
