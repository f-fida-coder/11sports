// authStore.js (Mock implementation using localStorage)
const USERS_KEY = '11sports_users';
const SESSION_KEY = '11sports_session';

function loadUsers() {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }

    // Default mock data
    const defaultUsers = [
        { id: 'admin1', name: 'Super Admin', email: 'admin@11sport.bet', password: 'password123', role: 'admin' },
        { id: 'agent1', name: 'Master Agent', email: 'agent@11sport.bet', password: 'password123', role: 'agent', creatorId: 'admin1' },
        { id: 'player1', name: 'Test Player', email: 'player@11sport.bet', password: 'password123', role: 'player', agentId: 'agent1', balance: 500 }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

export function getSession() {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return null;
}

export function signInUser({ email, password }) {
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const session = { user: { id: user.id, name: user.name, email: user.email, role: user.role, balance: user.balance } };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

export function signOutUser() {
    localStorage.removeItem(SESSION_KEY);
}

export function signUpPlayer({ name, email, password }) {
    const users = loadUsers();
    if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
    }

    const newUser = {
        id: 'p_' + generateId(),
        name,
        email,
        password,
        role: 'player',
        agentId: null, // Direct signups might not have an agent initially
        balance: 0
    };

    users.push(newUser);
    saveUsers(users);

    return signInUser({ email, password });
}

export function createAgent({ name, email, password }) {
    const session = getSession();
    if (!session || session.user.role !== 'admin') {
        throw new Error('Unauthorized');
    }

    const users = loadUsers();
    if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
    }

    const newUser = {
        id: 'a_' + generateId(),
        name,
        email,
        password,
        role: 'agent',
        creatorId: session.user.id
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
}

export function createPlayer({ name, email, password, agentId }) {
    const session = getSession();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'agent')) {
        throw new Error('Unauthorized');
    }

    const users = loadUsers();
    if (users.some(u => u.email === email)) {
        throw new Error('Email already registered');
    }

    const newUser = {
        id: 'p_' + generateId(),
        name,
        email,
        password,
        role: 'player',
        agentId: agentId || session.user.id,
        balance: 0
    };

    users.push(newUser);
    saveUsers(users);
    return newUser;
}

export function bulkCreatePlayers(playersInfo, fallbackAgentId = null) {
    const session = getSession();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'agent')) {
        throw new Error('Unauthorized');
    }

    const users = loadUsers();
    const newPlayers = [];

    for (const p of playersInfo) {
        if (!users.some(u => u.email === p.email)) {
            const newUser = {
                id: 'p_' + generateId(),
                name: p.name,
                email: p.email,
                password: p.password || 'changeme123',
                role: 'player',
                agentId: p.agentId || fallbackAgentId || session.user.id,
                balance: 0
            };
            newPlayers.push(newUser);
            users.push(newUser);
        }
    }

    saveUsers(users);
    return newPlayers;
}

export function getAgents() {
    return loadUsers().filter(u => u.role === 'admin' || u.role === 'agent');
}

export function getPlayers() {
    return loadUsers().filter(u => u.role === 'player');
}

export function findAgentName(agentId) {
    if (!agentId) return 'Direct';
    const agent = loadUsers().find(u => u.id === agentId);
    return agent ? agent.name : 'Unknown';
}

export function getPlayerViewForUser(user) {
    const users = loadUsers();
    if (user.role === 'admin') {
        return users.filter(u => u.role === 'player');
    } else if (user.role === 'agent') {
        return users.filter(u => u.role === 'player' && u.agentId === user.id);
    }
    return [];
}
