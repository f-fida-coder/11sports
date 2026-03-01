import {
  renderTicker,
  renderSportsMenu,
  renderStats,
  renderTopEvents,
  renderFeatured,
  renderLiveRows,
  renderGames,
  renderPromotions,
  renderPayments
} from '../modules/render.js';
import { initHeroSlider } from '../modules/slider.js';
import { initMarketControls } from '../modules/marketControls.js';
import { initBetSlip } from '../modules/betslip.js';
import { eventsApi } from '../api/client.js';

function safeRender(renderFn, data, id) {
  const el = document.getElementById(id);
  if (!el) return;
  renderFn(data, el);
}

export async function initHomePage() {
  let feed;
  try {
    feed = await eventsApi.fetchHomeFeed();
  } catch {
    const ticker = document.getElementById('ticker-strip');
    const markets = document.getElementById('events-grid');
    if (ticker) ticker.innerHTML = '<span class="ticker-item">Feed unavailable. Please retry.</span>';
    if (markets) markets.innerHTML = '<p class="muted text-sm">Unable to load markets right now.</p>';
    return;
  }

  safeRender(renderTicker, feed.ticker, 'ticker-strip');
  safeRender(renderSportsMenu, feed.sportsMenu, 'sports-menu');
  safeRender(renderStats, feed.stats, 'stats-strip');
  safeRender(renderTopEvents, feed.topEvents, 'events-grid');
  safeRender(renderLiveRows, feed.liveRows, 'live-grid');
  safeRender(renderFeatured, feed.featuredMatches, 'featured-grid');
  safeRender(renderGames, feed.games, 'games-grid');
  safeRender(renderPromotions, feed.promotions, 'promotions-grid');
  safeRender(renderPayments, feed.paymentProviders, 'payments-strip');

  initHeroSlider(feed.heroSlides, document.getElementById('hero-slider'));
  initMarketControls({ topEvents: feed.topEvents, liveRows: feed.liveRows });
  initBetSlip();

  document.dispatchEvent(new CustomEvent('odds:updated'));
}
