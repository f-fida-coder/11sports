import { adminApi, authApi } from '../api/client.js';

document.addEventListener('DOMContentLoaded', async () => {
    const session = authApi.getSession();
    if (!session || session.user.role !== 'admin') {
        window.location.href = '/pages/signin.html';
        return;
    }

    const agentSelect = document.getElementById('agent-select');
    const createAgentForm = document.getElementById('create-agent-form');
    const createPlayerForm = document.getElementById('create-player-form');
    const agentMsg = document.getElementById('agent-msg');
    const playerMsg = document.getElementById('player-msg');

    // Load agents
    try {
        const summary = await adminApi.getAdminSummary();
        const agents = summary.agents;
        const options = agents.map(a => `<option value="${a.id}">${a.name} (${a.email})</option>`).join('');
        agentSelect.innerHTML += options;
    } catch (err) {
        console.error('Failed to load agents', err);
    }

    createAgentForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(createAgentForm);
        const payload = Object.fromEntries(fd.entries());
        const btn = createAgentForm.querySelector('button');
        btn.disabled = true;
        agentMsg.textContent = 'Creating...';
        agentMsg.className = 'text-sm text-slate-300';

        try {
            await adminApi.createAgent(payload);
            agentMsg.textContent = 'Agent created successfully!';
            agentMsg.className = 'text-sm text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]';
            createAgentForm.reset();

            // Refresh options
            const summary = await adminApi.getAdminSummary();
            const agents = summary.agents;
            agentSelect.innerHTML = '<option value="">No Agent (Direct)</option>' + agents.map(a => `<option value="${a.id}">${a.name} (${a.email})</option>`).join('');
        } catch (err) {
            agentMsg.textContent = err.message || 'Error creating agent.';
            agentMsg.className = 'text-sm text-rose-400';
        } finally {
            btn.disabled = false;
        }
    });

    createPlayerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(createPlayerForm);
        const payload = Object.fromEntries(fd.entries());
        const btn = createPlayerForm.querySelector('button');
        btn.disabled = true;
        playerMsg.textContent = 'Creating...';
        playerMsg.className = 'text-sm text-slate-300';

        try {
            await adminApi.createPlayer(payload);
            playerMsg.textContent = 'Player created successfully!';
            playerMsg.className = 'text-sm text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]';
            createPlayerForm.reset();
        } catch (err) {
            playerMsg.textContent = err.message || 'Error creating player.';
            playerMsg.className = 'text-sm text-rose-400';
        } finally {
            btn.disabled = false;
        }
    });
});
