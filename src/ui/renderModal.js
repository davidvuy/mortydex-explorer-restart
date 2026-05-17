import { formatValue } from '../utils/formatters.js';

export const renderCharacterModal = (container, character) => {
  if (!container || !character) {
    return;
  }

  container.classList.add('modal-open');
  container.innerHTML = `
    <div class="modal-card">
      <button class="modal-close-button" type="button">
        sluiten
      </button>
      <img class="modal-image" src="${character.image}" alt="${formatValue(character.name)}" />
      <h3>${formatValue(character.name)}</h3>
      <p>${formatValue(character.shortInfo)}</p>

      <dl class="modal-details">
        <div>
          <dt>Status</dt>
          <dd>${formatValue(character.statusText)}</dd>
        </div>
        <div>
          <dt>Species</dt>
          <dd>${formatValue(character.speciesText)}</dd>
        </div>
        <div>
          <dt>Gender</dt>
          <dd>${formatValue(character.gender)}</dd>
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
    </div>
  `;
};

export const renderEmptyModal = container => {
  if (!container) {
    return;
  }

  container.classList.remove('modal-open');
  container.innerHTML = '';
};
