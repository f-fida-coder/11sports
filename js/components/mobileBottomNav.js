function normalizePath(pathname) {
  if (!pathname) return '';
  return pathname.replace(/\/+$/, '');
}

export function mobileBottomNavTemplate(basePath = '') {
  const currentPath = normalizePath(window.location.pathname);
  const links = [
    { href: `${basePath}index.html`, label: 'Home', icon: '⌂' },
    { href: `${basePath}pages/sportsbook.html`, label: 'Sports', icon: '◉' },
    { href: `${basePath}pages/live.html`, label: 'Live', icon: '●' },
    { href: `${basePath}pages/casino.html`, label: 'Casino', icon: '◆' },
    { href: `${basePath}pages/signin.html`, label: 'Account', icon: '◌' }
  ];

  return `
    <nav class="mobile-bottom-nav" aria-label="Mobile quick navigation">
      ${links
        .map((item) => {
          const pathname = normalizePath(new URL(item.href, window.location.href).pathname);
          const dirPath = pathname.replace(/\/index\.html$/i, '');
          const active = currentPath === pathname || currentPath === dirPath;
          return `<a href="${item.href}" class="mobile-bottom-link ${active ? 'is-active' : ''}" ${
            active ? 'aria-current="page"' : ''
          }><span aria-hidden="true">${item.icon}</span><span>${item.label}</span></a>`;
        })
        .join('')}
    </nav>
  `;
}
