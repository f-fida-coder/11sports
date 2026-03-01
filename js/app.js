import { headerTemplate, bindHeaderEvents } from './components/header.js';
import { footerTemplate } from './components/footer.js';
import { mobileBottomNavTemplate } from './components/mobileBottomNav.js';
import { initHomePage } from './pages/home.js';
import { initAuthPage } from './pages/auth.js';

function ensureSkipLink() {
  if (document.querySelector('.skip-link')) return;

  const app = document.getElementById('app');
  const main = document.querySelector('main');
  if (!app || !(main instanceof HTMLElement)) return;

  if (!main.id) {
    main.id = 'main-content';
  }

  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = `#${main.id}`;
  skip.textContent = 'Skip to main content';
  app.insertAdjacentElement('beforebegin', skip);
}

function mountLayoutComponents() {
  const headerHost = document.querySelector('[data-component="header"]');
  const footerHost = document.querySelector('[data-component="footer"]');
  let bottomNavHost = document.querySelector('[data-component="mobile-bottom-nav"]');
  const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
  const app = document.getElementById('app');

  if (!bottomNavHost && app) {
    bottomNavHost = document.createElement('div');
    bottomNavHost.setAttribute('data-component', 'mobile-bottom-nav');
    app.appendChild(bottomNavHost);
  }

  if (headerHost) headerHost.innerHTML = headerTemplate(basePath);
  if (footerHost) footerHost.innerHTML = footerTemplate(basePath);
  if (bottomNavHost) bottomNavHost.innerHTML = mobileBottomNavTemplate(basePath);

  bindHeaderEvents();
}

async function runPageInit() {
  const app = document.getElementById('app');
  if (!app) return;

  const page = app.dataset.page;

  if (page === 'home') await initHomePage();
  if (page === 'signin' || page === 'signup') initAuthPage();
}

document.addEventListener('DOMContentLoaded', async () => {
  ensureSkipLink();
  mountLayoutComponents();
  await runPageInit();
});
