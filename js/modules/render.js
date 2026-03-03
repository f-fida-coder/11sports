function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function renderTicker(items, container) {
  container.innerHTML = items.map((item) => `<span class="ticker-item">${item}</span>`).join('');
}

export function renderSportsMenu(items, container) {
  container.innerHTML = items
    .map(
      (item) => `
      <a href="pages/sportsbook.html" class="sports-link">
        <span class="sports-icon">${item.icon}</span>
        <span>${item.name}</span>
        <span class="sports-count">${item.count}</span>
      </a>
    `
    )
    .join('');
}

export function renderStats(stats, container) {
  container.innerHTML = stats
    .map(
      (item) => `
      <article class="card-elevated">
        <p class="text-2xl font-extrabold text-fuchsia-400">${item.value}</p>
        <p class="muted mt-1 text-xs uppercase tracking-wide">${item.label}</p>
      </article>
    `
    )
    .join('');
}

function renderOdds(odds, context) {
  const contextKey = slug(context.key);
  const contextLabel = escapeAttr(context.label);

  return odds
    .filter((odd) => Number(odd) > 0)
    .map((odd, idx) => {
      const key = `${contextKey}:${idx}`;
      const oddLabel = `${contextLabel} • ${context.market} ${idx + 1}`;
      return `<button type="button" class="odds-pill" data-odds-key="${key}" data-odds-value="${odd}" data-odds-label="${oddLabel}" aria-pressed="false">${odd}</button>`;
    })
    .join('');
}

export function renderTopEvents(events, container) {
  if (!events.length) {
    container.innerHTML = '<p class="muted text-sm">No events match your filter right now.</p>';
    return;
  }

  container.innerHTML = events
    .map(
      (event) => `
      <article class="card-elevated">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs font-semibold uppercase text-fuchsia-400">${event.league}</p>
          <span class="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-fuchsia-300">${event.sport}</span>
        </div>
        <h3 class="mt-3 text-lg font-bold">${event.home} <span class="muted">vs</span> ${event.away}</h3>
        <p class="muted mt-1 text-xs">${event.time}</p>
        <div class="mt-4 flex items-center gap-2">${renderOdds(event.odds, {
          key: `${event.league}-${event.home}-${event.away}`,
          label: `${event.home} vs ${event.away}`,
          market: '1X2'
        })}</div>
      </article>
    `
    )
    .join('');
}

export function renderFeatured(items, container) {
  container.innerHTML = items
    .map(
      (item) => `
      <article class="card-elevated">
        <p class="text-xs font-semibold uppercase text-fuchsia-300">${item.sport}</p>
        <h3 class="mt-2 text-sm font-bold">${item.match}</h3>
        <div class="mt-3 flex items-center gap-2">${renderOdds(item.odds, {
          key: `${item.sport}-${item.match}`,
          label: item.match,
          market: 'Winner'
        })}</div>
      </article>
    `
    )
    .join('');
}

export function renderLiveRows(rows, container) {
  if (!rows.length) {
    container.innerHTML = '<p class="muted text-sm">No live matches match your filter right now.</p>';
    return;
  }

  container.innerHTML = rows
    .map(
      (row) => `
      <article class="live-row">
        <div>
          <p class="text-xs uppercase text-fuchsia-300">${row.league}</p>
          <p class="mt-1 text-xs text-rose-300 font-semibold">${row.minute}</p>
          <h3 class="mt-1 text-sm font-semibold">${row.home} <span class="muted">vs</span> ${row.away}</h3>
          <p class="muted text-xs">${row.score}</p>
        </div>
        <div class="live-odds">${renderOdds(row.odds, {
          key: `${row.league}-${row.home}-${row.away}`,
          label: `${row.home} vs ${row.away}`,
          market: 'Live'
        })}</div>
      </article>
    `
    )
    .join('');
}

export function renderGames(games, container) {
  container.innerHTML = games
    .map(
      (game) => `
      <article class="game-card ${game.theme}">
        <span class="game-tag">${game.tag}</span>
        <h3>${game.name}</h3>
      </article>
    `
    )
    .join('');
}

export function renderPromotions(promos, container) {
  container.innerHTML = promos
    .map(
      (promo) => `
      <article class="card-elevated">
        <h3 class="text-sm font-bold">${promo.title}</h3>
        <p class="muted mt-2 min-h-12 text-sm">${promo.description}</p>
        <button type="button" class="btn-secondary mt-4">${promo.cta}</button>
      </article>
    `
    )
    .join('');
}

export function renderPayments(items, container) {
  container.innerHTML = items.map((item) => `<span class="payment-pill">${item}</span>`).join('');
}
