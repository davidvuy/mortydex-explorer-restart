import './styles.css';
import { fetchCharacters } from './api/rickMortyApi.js';
import { Character } from './models/Character.js';
import { bindControlEvents, bindFavoriteButtons, bindViewButtons } from './ui/events.js';
import { renderCharacterCards, renderCharacters } from './ui/renderCharacters.js';
import { filterCharacters, sortCharacters } from './utils/filters.js';
import { getFavoriteIds, toggleFavorite } from './utils/favorites.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('App container niet gevonden.');
}

let characters = [];
let visibleCharacters = [];
let currentView = 'table';

app.innerHTML = `
  <div class="page-shell">
    <header class="hero">
      <p class="eyebrow">web advanced - mortydex explorer</p>
      <h1>Rick and Morty characters op een simpele manier tonen</h1>
      <p class="hero-copy">
        Characters worden uit de Rick and Morty API geladen.
        Daarna kan je ze zoeken, filteren en sorteren.
      </p>
    </header>

    <main class="layout">
      <section class="panel controls-panel" aria-labelledby="controls-title">
        <div class="section-heading">
          <p class="section-kicker">module 4</p>
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
              <option value="Humanoid">Humanoid</option>
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
              <option value="status-asc">Status</option>
              <option value="species-asc">Species</option>
              <option value="episodes-desc">Meeste episodes</option>
            </select>
          </label>
        </form>

        <button class="reset-button" id="resetButton" type="button">
          filters wissen
        </button>

        <div class="view-toggle" aria-label="Kies een weergave">
          <button class="toggle-button is-active" type="button" data-view="table">
            tabel
          </button>
          <button class="toggle-button" type="button" data-view="grid">
            cards
          </button>
        </div>

        <p class="status-note" id="statusMessage">
          Characters worden geladen uit de API.
        </p>
      </section>

      <section class="content-stack">
        <section class="panel" aria-labelledby="results-title">
          <div class="section-heading">
            <p class="section-kicker">resultaten</p>
            <h2 id="results-title">Characters uit de API</h2>
          </div>

          <div id="resultsContainer"></div>
        </section>

        <section class="panel side-by-side">
          <div>
            <div class="section-heading">
              <p class="section-kicker">favorieten</p>
              <h2>Eerste test</h2>
            </div>
            <div class="placeholder-box" id="favoritesContainer">
              Nog geen favorieten gekozen.
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
const resetButton = document.querySelector('#resetButton');
const resultsContainer = document.querySelector('#resultsContainer');
const statusMessage = document.querySelector('#statusMessage');
const viewButtons = document.querySelectorAll('[data-view]');
const favoritesContainer = document.querySelector('#favoritesContainer');

const updateStatusMessage = message => {
  if (statusMessage) {
    statusMessage.textContent = message;
  }
};

const updateTable = () => {
  const favoriteIds = getFavoriteIds();

  if (currentView === 'grid') {
    renderCharacterCards(resultsContainer, visibleCharacters, favoriteIds);
    return;
  }

  renderCharacters(resultsContainer, visibleCharacters, favoriteIds);
};

const updateFavoritesBox = () => {
  if (!favoritesContainer) {
    return;
  }

  const favoriteIds = getFavoriteIds();

  if (favoriteIds.length === 0) {
    favoritesContainer.textContent = 'Nog geen favorieten gekozen.';
    return;
  }

  favoritesContainer.textContent = `${favoriteIds.length} favoriet(en) opgeslagen. De lijst zelf komt later.`;
};

const applyFilters = () => {
  const activeFilters = {
    search: searchInput ? searchInput.value : '',
    status: statusFilter ? statusFilter.value : 'all',
    species: speciesFilter ? speciesFilter.value : 'all',
    gender: genderFilter ? genderFilter.value : 'all'
  };
  const selectedSort = sortSelect ? sortSelect.value : 'name-asc';

  visibleCharacters = filterCharacters(characters, activeFilters);
  visibleCharacters = sortCharacters(visibleCharacters, selectedSort);
  updateTable();
  updateStatusMessage(`${visibleCharacters.length} result(a)t(en) zichtbaar.`);
};

const loadCharacters = async () => {
  if (resultsContainer) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        Characters laden...
      </div>
    `;
  }

  try {
    const apiCharacters = await fetchCharacters(3);
    characters = Character.fromList(apiCharacters);
    applyFilters();
    updateStatusMessage(`${characters.length} characters geladen uit de API.`);
  } catch (error) {
    updateStatusMessage('Er ging iets mis met de API.');

    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          De characters konden niet geladen worden. Probeer later opnieuw.
        </div>
      `;
    }
  }
};

updateTable();

bindControlEvents(
  {
    searchInput,
    statusFilter,
    speciesFilter,
    genderFilter,
    sortSelect,
    resetButton
  },
  applyFilters
);

bindViewButtons(viewButtons, view => {
  currentView = view;
  updateTable();
  updateStatusMessage(`Weergave veranderd naar ${view}.`);
});

bindFavoriteButtons(resultsContainer, characterId => {
  const favoriteIds = toggleFavorite(characterId);

  updateTable();
  updateFavoritesBox();
  updateStatusMessage(`${favoriteIds.length} favoriet(en) opgeslagen.`);
});

window.addEventListener('load', () => {
  console.log('MortyDex Explorer is geladen.');
});

loadCharacters();
updateFavoritesBox();
