export const apiContracts = {
  auth: {
    signIn: {
      method: 'POST',
      path: '/api/v1/auth/sign-in',
      request: { email: 'string', password: 'string' },
      response: { token: 'string', user: { id: 'number', email: 'string' } }
    },
    signUp: {
      method: 'POST',
      path: '/api/v1/auth/sign-up',
      request: {
        email: 'string',
        password: 'string',
        confirmPassword: 'string',
        acceptTerms: 'boolean'
      },
      response: { token: 'string', user: { id: 'number', email: 'string' } }
    }
  },
  events: {
    homeFeed: {
      method: 'GET',
      path: '/api/v1/events/home-feed',
      response: {
        ticker: 'string[]',
        topEvents: 'Event[]',
        liveRows: 'LiveEvent[]'
      }
    },
    search: {
      method: 'GET',
      path: '/api/v1/events/search?q={query}&sport={sport}&tab={tab}',
      response: { results: 'Event[]' }
    }
  },
  odds: {
    snapshot: {
      method: 'GET',
      path: '/api/v1/odds/snapshot?eventId={eventId}',
      response: { eventId: 'string', markets: 'Market[]', updatedAt: 'ISODate' }
    }
  }
};
