export function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



export function initScrollButtons() {
  const sections = document.querySelectorAll('[data-section]');

  sections.forEach(section => {
    const container = section.querySelector('[data-movies]');
    const buttonLeft = section.querySelector('[data-slide-left]');
    const buttonRight = section.querySelector('[data-slide-right]');

    if (!container) return;

    buttonRight?.addEventListener('click', () => {
      container.scrollLeft += 620;
    });

    buttonLeft?.addEventListener('click', () => {
      container.scrollLeft -= 620;
    });
  });
}



export function initMenuToggle() {
  const menuIcon = document.querySelector('[data-menu]');
  const header = document.querySelector('[data-header]');
  const body = document.querySelector('[data-body]');

  if (!menuIcon || !header || !body) return;

  menuIcon.addEventListener('click', () => {
    header.classList.toggle('open');
    body.classList.toggle('shifted');
  });
}
