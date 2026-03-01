const BETSLIP_STORAGE_KEY = '11sport_betslip_v1';

function parseStake(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

function loadStored() {
  try {
    const raw = window.localStorage.getItem(BETSLIP_STORAGE_KEY);
    if (!raw) return { selections: [], stake: 10 };

    const parsed = JSON.parse(raw);
    const selections = Array.isArray(parsed.selections) ? parsed.selections : [];
    const stake = parseStake(parsed.stake);

    return { selections, stake: stake || 10 };
  } catch {
    return { selections: [], stake: 10 };
  }
}

function saveStored(state) {
  window.localStorage.setItem(BETSLIP_STORAGE_KEY, JSON.stringify(state));
}

function getTotalOdds(selections) {
  if (!selections.length) return 0;
  return selections.reduce((acc, item) => acc * Number(item.odds), 1);
}

function formatMoney(value) {
  return Number(value).toFixed(2);
}

export function initBetSlip() {
  const root = document.getElementById('betslip-root');
  const list = document.getElementById('betslip-selections');
  const empty = document.getElementById('betslip-empty');
  const stakeInput = document.getElementById('stake');
  const clearButton = document.getElementById('betslip-clear');
  const placeButton = document.getElementById('betslip-place');
  const countEl = document.getElementById('betslip-count');
  const totalOddsEl = document.getElementById('betslip-total-odds');
  const potentialWinEl = document.getElementById('betslip-potential-win');
  const messageEl = document.getElementById('betslip-message');

  if (
    !root ||
    !list ||
    !empty ||
    !(stakeInput instanceof HTMLInputElement) ||
    !(clearButton instanceof HTMLButtonElement) ||
    !(placeButton instanceof HTMLButtonElement) ||
    !countEl ||
    !totalOddsEl ||
    !potentialWinEl ||
    !messageEl
  ) {
    return;
  }

  const state = loadStored();
  stakeInput.value = String(state.stake);

  function syncOddsButtons() {
    const keys = new Set(state.selections.map((item) => item.key));
    document.querySelectorAll('[data-odds-key]').forEach((button) => {
      if (!(button instanceof HTMLButtonElement)) return;

      const key = button.dataset.oddsKey;
      const active = Boolean(key && keys.has(key));
      button.classList.toggle('is-selected', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function renderSelections() {
    if (!state.selections.length) {
      empty.classList.remove('hidden');
      list.innerHTML = '';
    } else {
      empty.classList.add('hidden');
      list.innerHTML = state.selections
        .map(
          (item) => `
          <li class="betslip-item">
            <div>
              <p class="betslip-item-label">${item.label}</p>
              <p class="muted text-xs">Odds: ${item.odds}</p>
            </div>
            <button type="button" class="betslip-remove" data-remove-key="${item.key}" aria-label="Remove ${item.label}">Remove</button>
          </li>
        `
        )
        .join('');
    }

    const totalOdds = getTotalOdds(state.selections);
    const stake = parseStake(stakeInput.value);
    const potentialWin = stake * totalOdds;

    countEl.textContent = String(state.selections.length);
    totalOddsEl.textContent = totalOdds > 0 ? formatMoney(totalOdds) : '0.00';
    potentialWinEl.textContent = formatMoney(potentialWin);

    saveStored({ selections: state.selections, stake });
    syncOddsButtons();
  }

  function upsertSelection(payload) {
    const idx = state.selections.findIndex((item) => item.key === payload.key);
    if (idx >= 0) {
      state.selections.splice(idx, 1);
      messageEl.textContent = 'Selection removed from bet slip.';
    } else {
      state.selections.push(payload);
      messageEl.textContent = 'Selection added to bet slip.';
    }

    renderSelections();
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const oddsButton = target.closest('[data-odds-key]');
    if (oddsButton instanceof HTMLButtonElement) {
      const key = oddsButton.dataset.oddsKey;
      const oddsValue = Number(oddsButton.dataset.oddsValue || 0);
      const label = oddsButton.dataset.oddsLabel || 'Selection';

      if (!key || !Number.isFinite(oddsValue)) return;

      upsertSelection({ key, odds: oddsValue, label });
      return;
    }

    const removeButton = target.closest('[data-remove-key]');
    if (removeButton instanceof HTMLButtonElement) {
      const key = removeButton.dataset.removeKey;
      if (!key) return;

      state.selections = state.selections.filter((item) => item.key !== key);
      messageEl.textContent = 'Selection removed from bet slip.';
      renderSelections();
    }
  });

  document.addEventListener('odds:updated', syncOddsButtons);

  stakeInput.addEventListener('input', () => {
    const stake = parseStake(stakeInput.value);
    saveStored({ selections: state.selections, stake });

    const totalOdds = getTotalOdds(state.selections);
    const potentialWin = stake * totalOdds;
    potentialWinEl.textContent = formatMoney(potentialWin);
  });

  clearButton.addEventListener('click', () => {
    state.selections = [];
    messageEl.textContent = 'Bet slip cleared.';
    renderSelections();
  });

  placeButton.addEventListener('click', () => {
    const stake = parseStake(stakeInput.value);
    if (!state.selections.length) {
      messageEl.textContent = 'Add at least one selection before placing a bet.';
      return;
    }

    if (stake <= 0) {
      messageEl.textContent = 'Enter a valid stake greater than 0.';
      stakeInput.focus();
      return;
    }

    messageEl.textContent = `Bet placed (demo): ${state.selections.length} selection(s), stake $${formatMoney(stake)}.`;
  });

  renderSelections();
}
