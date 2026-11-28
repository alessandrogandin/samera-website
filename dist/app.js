'use strict';

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#nav');
menu.hidden = false;
nav.classList.add('collapsible');

const services = nav.querySelector('.nav-services');
document.addEventListener('click', event => {
  if (!services.contains(event.target)) services.open = false;
});
function setMenu(open) {
  if (!open) services.open = false;
  menu.setAttribute('aria-expanded', String(open));
  menu.textContent = open ? 'Chiudi' : 'Menu';
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && services.open) {
    services.open = false;
    services.querySelector('summary').focus();
    return;
  }
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', () => setMenu(false));
document.querySelector('#year').textContent = new Date().getFullYear();

const gallery = document.querySelector('.folio');
if (gallery) {
  const images = [
    ['samera-compact-machine-dusty.webp', 'Concept di piegalamiera da banco', 'Macchina piegalamiera compatta su un banco da lavoro'],
    ['samera-engineering-dusty.webp', 'Meccanica ed elettronica integrate', 'Dettaglio di una scheda elettronica montata in un componente di alluminio'],
    ['samera-robot.webp', 'Concept di cella robotizzata', 'Braccio robotico industriale con pinza sopra un componente meccanico']
  ];
  let current = 0;
  gallery.querySelector('.folio-controls').hidden = false;
  gallery.querySelectorAll('[data-slide]').forEach(button => button.addEventListener('click', () => {
    current = (current + Number(button.dataset.slide) + images.length) % images.length;
    const [filename, caption, alt] = images[current];
    const photo = document.querySelector('#folio-image');
    photo.src = 'assets/' + filename;
    photo.alt = alt;
    document.querySelector('#folio-caption').textContent = caption;
    document.querySelector('#folio-count').textContent = '0' + (current + 1) + ' / 03';
  }));

  // Preserve bookmarks from the original one-page site.
  const destinations = {
    soluzioni: 'soluzioni.html', metodo: 'metodo.html', design: 'metodo.html',
    make: 'metodo.html', connect: 'metodo.html', contatti: 'contatti.html', progetto: 'contatti.html'
  };
  function followBookmark() {
    const destination = destinations[location.hash.slice(1)];
    if (typeof destination === 'string') location.replace(destination + location.hash);
  }
  followBookmark();
  window.addEventListener('hashchange', followBookmark);
}

const filters = document.querySelectorAll('[data-filter]');
if (filters.length) document.querySelector('#filter-panel').hidden = false;
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelectorAll('.record').forEach(record => {
    record.hidden = button.dataset.filter !== 'all' && record.dataset.category !== button.dataset.filter;
  });
}));

const interest = document.querySelector('[name=interest]');
if (interest) {
  const interests = {
    monitoraggio: 'Monitoraggio di macchine e processi',
    connessione: 'IoT e macchine connesse', qualita: 'AI e controllo qualità', automazione: 'Automazione su misura'
  };
  const selected = interests[new URLSearchParams(location.search).get('ambito')];
  if (typeof selected === 'string') interest.value = selected;
  const dialog = document.querySelector('#brief-dialog');
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
}
