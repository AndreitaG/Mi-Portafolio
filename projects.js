(() => {
  const carousel = document.querySelector('[data-slide-carousel]');
  if (!carousel) return;

  const slides = [
    { name: 'Portada', alt: 'Portada de MoveFlow con una ilustración de mujeres emprendedoras.' },
    { name: 'Una emprendedora con potencial', alt: 'Elena tiene talento y quiere superar los límites de su emprendimiento.' },
    { name: 'La problemática', alt: 'Situaciones y preguntas que pueden enfrentar las mujeres emprendedoras.' },
    { name: 'El contexto', alt: 'Datos e ideas sobre las barreras y oportunidades para las mujeres emprendedoras.' },
    { name: 'Etapa 1 · Conectar y recolectar', alt: 'Primera etapa: conectar con la emprendedora y recolectar información.' },
    { name: 'Etapa 2 · Inspirar', alt: 'Segunda etapa: inspirar mediante empleabilidad, educación y oportunidades.' },
    { name: 'Etapa 3 · Crecer con IA', alt: 'Tercera etapa: pantallas del prototipo MoveFlow y su asistente de inteligencia artificial.' },
    { name: 'Ecosistema de aliados', alt: 'Organizaciones aliadas para ayudar a cerrar la brecha digital.' },
    { name: 'Conclusiones', alt: 'Conclusión de MoveFlow: que la tecnología trabaje junto a las mujeres emprendedoras.' },
  ];
  const image = carousel.querySelector('.slide-image');
  const counter = carousel.querySelector('.slide-count');
  const caption = carousel.querySelector('.slide-name');
  const dots = Array.from(carousel.querySelectorAll('.slide-dots button'));
  let current = 0;

  slides.forEach((_, index) => {
    if (index === 0) return;
    const preload = new Image();
    preload.src = `assets/moveflow-slides/${index + 1}.jpg`;
  });

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    image.classList.add('is-changing');
    window.setTimeout(() => {
      image.src = `assets/moveflow-slides/${current + 1}.jpg`;
      image.alt = `Diapositiva ${current + 1} de 9: ${slide.alt}`;
      counter.innerHTML = `${String(current + 1).padStart(2, '0')} <i>/</i> 09`;
      caption.textContent = slide.name;
      dots.forEach((dot, dotIndex) => {
        if (dotIndex === current) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
      image.classList.remove('is-changing');
    }, 140);
  }

  carousel.querySelector('.slide-previous').addEventListener('click', () => showSlide(current - 1));
  carousel.querySelector('.slide-next').addEventListener('click', () => showSlide(current + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showSlide(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showSlide(current + 1); }
  });

  let startX = null;
  carousel.addEventListener('touchstart', (event) => { startX = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    if (startX === null) return;
    const delta = event.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 45) showSlide(current + (delta < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });
})();

(() => {
  const section = document.querySelector('.participation-section');
  if (!section) return;

  const dialog = section.querySelector('.experience-dialog');
  const dialogContent = section.querySelector('.experience-dialog-content');
  const closeButton = section.querySelector('.experience-dialog-close');
  const cards = Array.from(section.querySelectorAll('[data-story]'));
  let lastTrigger = null;
  let closeTimer = null;

  function closeExperience() {
    if (!dialog.open) return;
    dialog.classList.add('is-closing');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => dialog.close(), 160);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      const template = section.querySelector(`#${card.dataset.story}`);
      if (!template) return;
      lastTrigger = card;
      dialogContent.replaceChildren(template.content.cloneNode(true));
      dialog.classList.remove('is-closing');
      if (!dialog.open) dialog.showModal();
      closeButton.focus({preventScroll: true});
    });
  });

  closeButton.addEventListener('click', closeExperience);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeExperience();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeExperience();
  });
  dialog.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    dialog.classList.remove('is-closing');
    dialogContent.replaceChildren();
    lastTrigger?.focus({preventScroll: true});
  });
})();
