import './styles.css';
import { renderCharacterCards, renderCharacters } from './ui/renderCharacters.js';
import { filterCharacters, sortCharacters } from './utils/filters.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('App container niet gevonden.');
}

const mockCharacters = [
  {
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: 'Earth (C-137)',
    location: 'Citadel of Ricks',
    episodes: ['S01E01', 'S01E02', 'S01E03', 'S02E10']
  },
  {
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: 'unknown',
    location: 'Earth (Replacement Dimension)',
    episodes: ['S01E01', 'S01E04', 'S03E01']
  },
  {
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    gender: 'Female',
    origin: 'Earth (Replacement Dimension)',
    location: 'Earth (Replacement Dimension)',
    episodes: ['S01E06', 'S02E06', 'S03E05']
  },
  {
    name: 'Birdperson',
    status: 'Dead',
    species: 'Alien',
    gender: 'Male',
    origin: 'Bird World',
    location: 'Planet Squanch',
    episodes: ['S01E05', 'S02E10']
  },
  {
    name: 'Mr. Meeseeks',
    status: 'unknown',
    species: 'Meeseeks',
    gender: 'Male',
    origin: '   ',
    location: 'Interdimensional Cable',
    episodes: ['S01E05']
  },
  {
    name: 'Abradolf Lincler',
    status: 'unknown',
    species: 'Human',
    gender: 'Male',
    origin: 'Earth (Replacement Dimension)',
    location: '',
    episodes: ['S01E10', 'S02E07']
  }
];

let visibleCharacters = [...mockCharacters];
let currentView = 'table';

app.innerHTML = `
  <div class="page-shell">
    <header class="hero">
      <p class="eyebrow">web advanced - mortydex explorer</p>
      <h1>Rick and Morty characters op een simpele manier tonen</h1>
      <p class="hero-copy">
        We zijn terug opnieuw begonnen, dus hier zetten we eerst de basis klaar.
        Eerst de layout, dan wat events, en daarna tijdelijke data in een tabel.
      </p>
    </header>

    <main class="layout">
      <section class="panel controls-panel" aria-labelledby="controls-title">
        <div class="section-heading">
          <p class="section-kicker">dag 1 + dag 2</p>
          <h2 id="controls-title">Zoeken, filteren en sorteren</h2>
        </div>

        <form class="controls-grid" id="controlsForm">
          <label class="field">
            <span>Zoek op naam, origin of locatie</span>
            <input
              id="searchInput"
              name="search"
              type="search"
              placeholder="bv. Rick of Earth"
            />
          </label>

          <label class="field">
            <span>Status</span>
            <select id="statusFilter" name="status">
              <option value="all">Alle statussen</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>

          <label class="field">
            <span>Species</span>
            <select id="speciesFilter" name="species">
              <option value="all">Alle species</option>
              <option value="Human">Human</option>
              <option value="Alien">Alien</option>
              <option value="Meeseeks">Meeseeks</option>
            </select>
          </label>

          <label class="field">
            <span>Gender</span>
            <select id="genderFilter" name="gender">
              <option value="all">Alle genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </select>
          </label>

          <label class="field">
            <span>Sorteer op</span>
            <select id="sortSelect" name="sort">
              <option value="name-asc">Naam A-Z</option>
              <option value="name-desc">Naam Z-A</option>
              <option value="episodes-desc">Meeste episodes</option>
            </select>
          </label>
        </form>

        <div class="view-toggle" aria-label="Kies een weergave">
          <button class="toggle-button is-active" type="button" data-view="table">
            tabel
          </button>
          <button class="toggle-button" type="button" data-view="grid">
            cards
          </button>
        </div>

        <p class="status-note" id="statusMessage">
          6 tijdelijke characters geladen. Da's genoeg om de tabel al te testen.
        </p>
      </section>

      <section class="content-stack">
        <section class="panel" aria-labelledby="results-title">
          <div class="section-heading">
            <p class="section-kicker">resultaten</p>
            <h2 id="results-title">Mock-data in tabelvorm</h2>
          </div>

          <div id="resultsContainer"></div>
        </section>

        <section class="panel side-by-side">
          <div>
            <div class="section-heading">
              <p class="section-kicker">favorieten</p>
              <h2>Nog leeg</h2>
            </div>
            <div class="placeholder-box" id="favoritesContainer">
              Hier komen later je favorieten.
            </div>
          </div>

          <div>
            <div class="section-heading">
              <p class="section-kicker">modal</p>
              <h2>Nog leeg</h2>
            </div>
            <div class="placeholder-box" id="modalRoot">
              Later gaan we hier details tonen van een character.
            </div>
          </div>
        </section>
      </section>
    </main>
  </div>
`;

const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const speciesFilter = document.querySelector('#speciesFilter');
const genderFilter = document.querySelector('#genderFilter');
const sortSelect = document.querySelector('#sortSelect');
const resultsContainer = document.querySelector('#resultsContainer');
const statusMessage = document.querySelector('#statusMessage');
const viewButtons = document.querySelectorAll('[data-view]');

const updateStatusMessage = message => {
  if (statusMessage) {
    statusMessage.textContent = message;
  }
};

const updateTable = () => {
  if (currentView === 'grid') {
    renderCharacterCards(resultsContainer, visibleCharacters);
    return;
  }

  renderCharacters(resultsContainer, visibleCharacters);
};

const applyFilters = () => {
  const activeFilters = {
    search: searchInput ? searchInput.value : '',
    status: statusFilter ? statusFilter.value : 'all',
    species: speciesFilter ? speciesFilter.value : 'all',
    gender: genderFilter ? genderFilter.value : 'all'
  };
  const selectedSort = sortSelect ? sortSelect.value : 'name-asc';

  visibleCharacters = filterCharacters(mockCharacters, activeFilters);
  visibleCharacters = sortCharacters(visibleCharacters, selectedSort);
  updateTable();
  updateStatusMessage(`${visibleCharacters.length} result(a)t(en) zichtbaar.`);
};

updateTable();

if (searchInput) {
  searchInput.addEventListener('input', () => {
    applyFilters();
  });
}

if (statusFilter) {
  statusFilter.addEventListener('change', () => {
    applyFilters();
  });
}

if (speciesFilter) {
  speciesFilter.addEventListener('change', () => {
    applyFilters();
  });
}

if (genderFilter) {
  genderFilter.addEventListener('change', () => {
    applyFilters();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    applyFilters();
  });
}

if (viewButtons.length > 0) {
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      viewButtons.forEach(currentButton => {
        currentButton.classList.remove('is-active');
      });

      currentView = button.dataset.view;
      button.classList.add('is-active');
      updateTable();
      updateStatusMessage(`Weergave veranderd naar ${button.dataset.view}.`);
    });
  });
}

window.addEventListener('load', () => {
  console.log('MortyDex Explorer is geladen.');
});
