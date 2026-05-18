import { formatValue } from '../utils/formatters.js';
import { isFavorite } from '../utils/favorites.js';

const getStatusClass = status => {
  return String(status).toLowerCase();
};

const renderFavoriteButton = (character, favoriteIds) => {
  const favorite = isFavorite(character.id, favoriteIds);
  const favoriteIcon = favorite ? '&#9733;' : '&#9734;';
  const favoriteText = favorite ? 'verwijder favoriet' : 'maak favoriet';

  return `
    <button
      class="favorite-button ${favorite ? 'is-favorite' : ''}"
      type="button"
      data-id="${character.id}"
      aria-label="${favoriteText} ${formatValue(character.name)}"
    >
      ${favoriteIcon}
    </button>
  `;
};

export const renderCharacters = (container, characters, favoriteIds = []) => {
  if (!container) {
    return;
  }

  if (characters.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        Geen resultaten gevonden. Probeer iets anders.
      </div>
    `;
    return;
  }

  let rows = '';

  for (const character of characters) {
    rows += `
      <tr class="character-row" data-id="${character.id}">
        <td>${renderFavoriteButton(character, favoriteIds)}</td>
        <td>
          <div class="table-name-cell">
            <img class="table-avatar" src="${character.image}" alt="${formatValue(character.name)}" />
            <span>${formatValue(character.name)}</span>
          </div>
        </td>
        <td>
          <span class="status-badge ${getStatusClass(character.statusText)}">
            ${formatValue(character.statusText)}
          </span>
        </td>
        <td>${formatValue(character.speciesText)}</td>
        <td>${formatValue(character.gender)}</td>
        <td>${formatValue(character.originName)}</td>
        <td>${formatValue(character.locationName)}</td>
        <td>${character.episodeCount} episode(s)</td>
      </tr>
    `;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table class="characters-table">
        <thead>
          <tr>
            <th>Fav</th>
            <th>Name</th>
            <th>Status</th>
            <th>Species</th>
            <th>Gender</th>
            <th>Origin</th>
            <th>Location</th>
            <th>Episodes</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
};

export const renderCharacterCards = (container, characters, favoriteIds = []) => {
  if (!container) {
    return;
  }

  if (characters.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        Geen resultaten gevonden. Probeer iets anders.
      </div>
    `;
    return;
  }

  const cards = characters
    .map((character, index) => {
      const cardStyle =
        index % 9 === 0 ? 'is-wide' : index % 9 === 4 ? 'is-tall' : '';

      return `
        <article class="character-card ${cardStyle}" data-id="${character.id}">
          <div class="image-wrap">
            <img
              class="character-image"
              src="${character.image}"
              alt="${formatValue(character.name)}"
            />
            ${renderFavoriteButton(character, favoriteIds)}
          </div>
          <div class="card-top">
            <h3>${formatValue(character.name)}</h3>
          </div>
          <div class="card-badges">
            <span class="status-badge ${getStatusClass(character.statusText)}">
              ${formatValue(character.statusText)}
            </span>
            <span class="species-badge">${formatValue(character.speciesText)}</span>
          </div>
          <dl>
            <div>
              <dt>Gender</dt>
              <dd>${formatValue(character.gender)}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>${formatValue(character.typeText)}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>${formatValue(character.originName)}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>${formatValue(character.locationName)}</dd>
            </div>
            <div>
              <dt>Episodes</dt>
              <dd>${character.episodeCount} episode(s)</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>${formatValue(character.createdYear)}</dd>
            </div>
          </dl>
        </article>
      `;
    })
    .join('');

  container.innerHTML = `
    <div class="cards-grid">
      ${cards}
    </div>
  `;
};
