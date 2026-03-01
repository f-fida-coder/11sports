import { eventsApi } from '../api/client.js';
import { renderLiveRows, renderTopEvents } from './render.js';

export function initMarketControls({ topEvents, liveRows }) {
  const searchInput = document.getElementById('market-search');
  const filterRoot = document.getElementById('market-filters');
  const tabsRoot = document.getElementById('market-tabs');
  const topPane = document.getElementById('top-events-pane');
  const livePane = document.getElementById('live-events-pane');
  const eventsGrid = document.getElementById('events-grid');
  const liveGrid = document.getElementById('live-grid');

  if (!searchInput || !filterRoot || !tabsRoot || !topPane || !livePane || !eventsGrid || !liveGrid) {
    return;
  }

  const sports = ['All', ...new Set([...topEvents, ...liveRows].map((item) => item.sport))];
  const state = {
    tab: 'top',
    sport: 'All',
    query: ''
  };
  let refreshToken = 0;
  let searchTimer = 0;

  filterRoot.innerHTML = sports
    .map(
      (sport) =>
        `<button type="button" class="filter-chip ${
          sport === 'All' ? 'is-active' : ''
        }" data-filter-sport="${sport}" aria-pressed="${sport === 'All' ? 'true' : 'false'}">${sport}</button>`
    )
    .join('');

  function updateTabsUi() {
    tabsRoot.querySelectorAll('[data-market-tab]').forEach((button) => {
      const isActive = button.getAttribute('data-market-tab') === state.tab;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
      button.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    topPane.classList.toggle('hidden', state.tab !== 'top');
    livePane.classList.toggle('hidden', state.tab !== 'live');
    topPane.setAttribute('aria-hidden', state.tab !== 'top' ? 'true' : 'false');
    livePane.setAttribute('aria-hidden', state.tab !== 'live' ? 'true' : 'false');
  }

  async function refresh() {
    const token = ++refreshToken;
    const { results } = await eventsApi.search({
      query: state.query,
      sport: state.sport,
      tab: state.tab
    });
    if (token !== refreshToken) return;

    if (state.tab === 'top') {
      renderTopEvents(results, eventsGrid);
    } else {
      renderLiveRows(results, liveGrid);
    }

    document.dispatchEvent(new CustomEvent('odds:updated'));
  }

  tabsRoot.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const tab = target.getAttribute('data-market-tab');
    if (!tab || tab === state.tab) return;

    state.tab = tab;
    updateTabsUi();
    void refresh();
  });

  filterRoot.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const nextSport = target.getAttribute('data-filter-sport');
    if (!nextSport || nextSport === state.sport) return;

    state.sport = nextSport;
    filterRoot.querySelectorAll('[data-filter-sport]').forEach((btn) => {
      const isActive = btn.getAttribute('data-filter-sport') === state.sport;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    void refresh();
  });

  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      void refresh();
    }, 220);
  });

  tabsRoot.addEventListener('keydown', (event) => {
    if (!(event.target instanceof HTMLButtonElement)) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();

    const tabs = Array.from(tabsRoot.querySelectorAll('[data-market-tab]')).filter(
      (tab) => tab instanceof HTMLButtonElement
    );
    if (!tabs.length) return;

    const currentIndex = tabs.findIndex((tab) => tab === event.target);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    const nextTab = tabs[nextIndex];
    if (!(nextTab instanceof HTMLButtonElement)) return;
    const tab = nextTab.getAttribute('data-market-tab');
    if (!tab) return;
    state.tab = tab;
    updateTabsUi();
    nextTab.focus();
    void refresh();
  });

  updateTabsUi();
  void refresh();
}
