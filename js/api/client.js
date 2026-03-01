import { homeData } from '../../data/homeData.js';

function wait(ms = 250) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function toSlug(value) {
  return String(value).toLowerCase().replace(/\s+/g, '-');
}

export const eventsApi = {
  async fetchHomeFeed() {
    await wait(200);
    return structuredClone(homeData);
  },

  async search({ query = '', sport = 'All', tab = 'top' } = {}) {
    await wait(180);
    const q = query.trim().toLowerCase();
    const source = tab === 'live' ? homeData.liveRows : homeData.topEvents;

    const filtered = source.filter((item) => {
      const bySport = sport === 'All' || item.sport === sport;
      const haystack = `${item.league} ${item.home} ${item.away}`.toLowerCase();
      const byQuery = q === '' || haystack.includes(q);
      return bySport && byQuery;
    });

    return { results: filtered };
  }
};

export const oddsApi = {
  async getSnapshot(eventId) {
    await wait(160);
    return {
      eventId,
      markets: [
        { id: 'winner', label: 'Match Winner', odds: [1.72, 3.45, 4.2] },
        { id: 'goals', label: 'Over/Under 2.5', odds: [1.9, 1.9] }
      ],
      updatedAt: new Date().toISOString()
    };
  }
};

export const authApi = {
  async signIn({ email, password }) {
    await wait(300);
    if (!email || !password) {
      throw new Error('Missing credentials.');
    }

    return {
      token: `mock-token-${Date.now()}`,
      user: { id: 1001, email }
    };
  },

  async signUp({ email, password, confirmPassword, acceptTerms }) {
    await wait(360);
    if (!acceptTerms) {
      throw new Error('You must accept terms to continue.');
    }

    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    return {
      token: `mock-token-${toSlug(email)}-${Date.now()}`,
      user: { id: 1002, email }
    };
  }
};
