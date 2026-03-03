function navLinks(basePath) {
  return [
    { href: `${basePath}pages/sportsbook.html`, label: 'Sports' },
    { href: `${basePath}pages/live.html`, label: 'Live' },
    { href: `${basePath}pages/casino.html`, label: 'Casino' },
    { href: `${basePath}pages/live-casino.html`, label: 'Live Casino' },
    { href: `${basePath}pages/virtual.html`, label: 'Virtual' },
    { href: `${basePath}pages/promotions.html`, label: 'Promotions' }
  ];
}

function isActivePath(href) {
  const current = window.location.pathname.replace(/\/+$/, '');
  const target = new URL(href, window.location.href).pathname.replace(/\/+$/, '');
  return current === target || (target.endsWith('/index.html') && current === '');
}

export function headerTemplate(basePath = '') {
  const links = navLinks(basePath);
  return `
    <header class="border-b border-fuchsia-500/20 bg-[#07150e]/95 backdrop-blur">
      <div class="mx-auto max-w-[1400px] px-4">
        <div class="flex items-center justify-between gap-3 py-2">
          <div class="flex items-center gap-3 text-xs">
            <a class="topbar-link" href="#">Help</a>
            <a class="topbar-link" href="#">Responsible Gaming</a>
            <a class="topbar-link" href="#">Contact</a>
          </div>
          <div class="flex items-center gap-2 text-xs text-slate-300">
            <span>EN</span>
            <span class="text-slate-600">|</span>
            <span>USD</span>
          </div>
        </div>

        <div class="flex items-center justify-between gap-4 py-3">
          <a href="${basePath}index.html" class="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span class="inline-flex h-8 w-8 items-center justify-center rounded bg-fuchsia-500 text-sm text-[#032211]">11</span>
            <span>SPORT<span class="text-fuchsia-400">.BET</span></span>
          </a>

          <button id="mobile-menu-toggle" class="btn-icon lg:hidden" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">☰</button>

          <nav class="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold text-slate-200 lg:flex" aria-label="Primary">
            ${links
              .map((item) => {
                const active = isActivePath(item.href);
                return `<a href="${item.href}" class="hover:text-fuchsia-400 ${active ? 'text-fuchsia-300' : ''}" ${
                  active ? 'aria-current="page"' : ''
                }>${item.label}</a>`;
              })
              .join('')}
          </nav>

          <div class="hidden items-center gap-2 lg:flex">
            <a href="${basePath}pages/signin.html" class="btn-secondary">Sign in</a>
            <a href="${basePath}pages/signup.html" class="btn-primary">Register</a>
          </div>
        </div>

        <div id="mobile-nav" class="mobile-nav hidden pb-3 lg:hidden">
          <div class="grid gap-2 text-sm text-slate-200">
            ${links
              .map((item) => {
                const active = isActivePath(item.href);
                return `<a href="${item.href}" class="rounded px-2 py-1 hover:bg-fuchsia-500/10 ${
                  active ? 'bg-fuchsia-500/10 text-fuchsia-300' : ''
                }" ${active ? 'aria-current="page"' : ''}>${item.label}</a>`;
              })
              .join('')}
            <div class="mt-2 flex gap-2">
              <a href="${basePath}pages/signin.html" class="btn-secondary">Sign in</a>
              <a href="${basePath}pages/signup.html" class="btn-primary">Register</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `;
}

export function bindHeaderEvents() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  function setMenu(nextOpen) {
    mobileNav.classList.toggle('hidden', !nextOpen);
    toggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
  }

  toggle.addEventListener('click', () => {
    const isHidden = mobileNav.classList.contains('hidden');
    setMenu(isHidden);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (mobileNav.classList.contains('hidden')) return;
    setMenu(false);
    toggle.focus();
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (mobileNav.classList.contains('hidden')) return;
    if (mobileNav.contains(target) || toggle.contains(target)) return;
    setMenu(false);
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    if (!(link instanceof HTMLAnchorElement)) return;
    link.addEventListener('click', () => {
      setMenu(false);
    });
  });

  const media = window.matchMedia('(min-width: 1024px)');
  media.addEventListener('change', () => {
    if (media.matches) {
      setMenu(false);
    }
  });

  setMenu(false);
}
