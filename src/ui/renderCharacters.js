import { formatEpisodeCount, formatValue } from '../utils/formatters.js';

export const renderCharacters = (container, characters) => {
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
      <tr>
        <td>${formatValue(character.name)}</td>
        <td>${formatValue(character.status)}</td>
        <td>${formatValue(character.species)}</td>
        <td>${formatValue(character.gender)}</td>
        <td>${formatValue(character.origin)}</td>
        <td>${formatValue(character.location)}</td>
        <td>${formatEpisodeCount(character.episodes)}</td>
      </tr>
    `;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table class="characters-table">
        <thead>
          <tr>
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

export const renderCharacterCards = (container, characters) => {
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
    .map(character => {
      return `
        <article class="character-card">
          <h3>${formatValue(character.name)}</h3>
          <p>${formatValue(character.status)} - ${formatValue(character.species)}</p>
          <dl>
            <div>
              <dt>Gender</dt>
              <dd>${formatValue(character.gender)}</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>${formatValue(character.origin)}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>${formatValue(character.location)}</dd>
            </div>
            <div>
              <dt>Episodes</dt>
              <dd>${formatEpisodeCount(character.episodes)}</dd>
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
