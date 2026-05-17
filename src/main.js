import './styles.css';
import { fetchCharacters } from './api/rickMortyApi.js';
import { Character } from './models/Character.js';
import {
  bindCharacterClicks,
  bindControlEvents,
  bindFavoriteButtons,
  bindRemoveFavoriteButtons,
  bindViewButtons
} from './ui/events.js';
import { renderCharacterCards, renderCharacters } from './ui/renderCharacters.js';
import { renderCharacterModal, renderEmptyModal } from './ui/renderModal.js';
import { filterCharacters, sortCharacters } from './utils/filters.js';
import { getFavoriteIds, toggleFavorite } from './utils/favorites.js';
import { getPreferences, savePreferences } from './utils/preferences.js';

const app = document.querySelector('#app');

if (!app) {
  throw new Error('App container niet gevonden.');
}

let characters = [];
let visibleCharacters = [];
const savedPreferences = getPreferences();
let currentView = savedPreferences.view;
let currentTheme = savedPreferences.theme;

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
          <p class="section-kicker">module 4 + 6</p>
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

        <button class="theme-button" id="themeButton" type="button">
          donkere modus
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
              <h2>Mijn lijstje</h2>
            </div>
            <div class="placeholder-box" id="favoritesContainer">
              Nog geen favorieten gekozen.
            </div>
          </div>

          <div>
            <div class="section-heading">
              <p class="section-kicker">modal</p>
              <h2>Details</h2>
            </div>
            <div class="placeholder-box">
              Klik op een character om de details te zien.
            </div>
          </div>
        </section>
      </section>
    </main>

    <div id="modalRoot"></div>
  </div>
`;

const searchInput = document.querySelector('#searchInput');
const statusFilter = document.querySelector('#statusFilter');
const speciesFilter = document.querySelector('#speciesFilter');
const genderFilter = document.querySelector('#genderFilter');
const sortSelect = document.querySelector('#sortSelect');
const resetButton = document.querySelector('#resetButton');
const themeButton = document.querySelector('#themeButton');
const resultsContainer = document.querySelector('#resultsContainer');
const statusMessage = document.querySelector('#statusMessage');
const viewButtons = document.querySelectorAll('[data-view]');
const favoritesContainer = document.querySelector('#favoritesContainer');
const modalRoot = document.querySelector('#modalRoot');

const updateStatusMessage = message => {
  if (statusMessage) {
    statusMessage.textContent = message;
  }
};

const updateViewButtons = () => {
  viewButtons.forEach(button => {
    if (button.dataset.view === currentView) {
      button.classList.add('is-active');
    } else {
      button.classList.remove('is-active');
    }
  });
};

const updateTheme = () => {
  document.body.classList.toggle('dark-theme', currentTheme === 'dark');

  if (themeButton) {
    themeButton.textContent = currentTheme === 'dark' ? 'lichte modus' : 'donkere modus';
  }
};

const setSavedControls = () => {
  if (searchInput) {
    searchInput.value = savedPreferences.search;
  }

  if (statusFilter) {
    statusFilter.value = savedPreferences.status;
  }

  if (speciesFilter) {
    speciesFilter.value = savedPreferences.species;
  }

  if (genderFilter) {
    genderFilter.value = savedPreferences.gender;
  }

  if (sortSelect) {
    sortSelect.value = savedPreferences.sort;
  }
};

const saveCurrentPreferences = () => {
  savePreferences({
    theme: currentTheme,
    view: currentView,
    search: searchInput ? searchInput.value : '',
    status: statusFilter ? statusFilter.value : 'all',
    species: speciesFilter ? speciesFilter.value : 'all',
    gender: genderFilter ? genderFilter.value : 'all',
    sort: sortSelect ? sortSelect.value : 'name-asc'
  });
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
    favoritesContainer.innerHTML = 'Nog geen favorieten gekozen.';
    return;
  }

  if (characters.length === 0) {
    favoritesContainer.innerHTML = `${favoriteIds.length} favoriet(en) opgeslagen. Even laden...`;
    return;
  }

  const favoriteCharacters = favoriteIds
    .map(favoriteId => characters.find(character => character.id === favoriteId))
    .filter(character => character);

  if (favoriteCharacters.length === 0) {
    favoritesContainer.innerHTML = "Je favorieten staan nog opgeslagen, maar ze zitten niet tussen deze API pagina's.";
    return;
  }

  const favoriteItems = favoriteCharacters
    .map(character => {
      return `
        <li class="favorite-item">
          <div>
            <strong>${character.name}</strong>
            <span>${character.statusText} - ${character.speciesText}</span>
          </div>
          <button class="remove-favorite-button" type="button" data-id="${character.id}">
            verwijderen
          </button>
        </li>
      `;
    })
    .join('');

  favoritesContainer.innerHTML = `
    <p>${favoriteCharacters.length} favoriet(en)</p>
    <ul class="favorites-list">
      ${favoriteItems}
    </ul>
  `;
};

const openCharacterDetails = characterId => {
  const selectedCharacter = characters.find(character => character.id === characterId);

  if (!selectedCharacter) {
    return;
  }

  renderCharacterModal(modalRoot, selectedCharacter);
  updateStatusMessage(`${selectedCharacter.name} details geopend.`);
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
  saveCurrentPreferences();
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
    updateFavoritesBox();
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

setSavedControls();
updateViewButtons();
updateTheme();
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
  saveCurrentPreferences();
  updateTable();
  updateViewButtons();
  updateStatusMessage(`Weergave veranderd naar ${view}.`);
});

if (themeButton) {
  themeButton.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    saveCurrentPreferences();
    updateTheme();
    updateStatusMessage('Voorkeur voor thema opgeslagen.');
  });
}

bindFavoriteButtons(resultsContainer, characterId => {
  const favoriteIds = toggleFavorite(characterId);

  updateTable();
  updateFavoritesBox();
  updateStatusMessage(`${favoriteIds.length} favoriet(en) opgeslagen.`);
});

bindRemoveFavoriteButtons(favoritesContainer, characterId => {
  const favoriteIds = toggleFavorite(characterId);

  updateTable();
  updateFavoritesBox();
  updateStatusMessage(`${favoriteIds.length} favoriet(en) opgeslagen.`);
});

bindCharacterClicks(resultsContainer, characterId => {
  openCharacterDetails(characterId);
});

if (modalRoot) {
  modalRoot.addEventListener('click', event => {
    const closeButton = event.target.closest('.modal-close-button');

    if (!closeButton) {
      return;
    }

    renderEmptyModal(modalRoot);
    updateStatusMessage('Detail gesloten.');
  });
}

window.addEventListener('load', () => {
  console.log('MortyDex Explorer is geladen.');
});

loadCharacters();
updateFavoritesBox();
