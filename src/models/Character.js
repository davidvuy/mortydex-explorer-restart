export class Character {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name || 'unknown';
    this.status = data.status || 'unknown';
    this.species = data.species || 'unknown';
    this.type = data.type || '';
    this.gender = data.gender || 'unknown';
    this.origin = data.origin || {};
    this.location = data.location || {};
    this.episodes = Array.isArray(data.episode) ? data.episode : data.episodes || [];
    this.image = data.image || '';
    this.created = data.created || '';
  }

  static fromList(characters = []) {
    return characters.map(character => new Character(character));
  }

  static compareByName(firstCharacter, secondCharacter) {
    return firstCharacter.name.localeCompare(secondCharacter.name);
  }

  get originName() {
    return this.origin?.name || this.origin || 'unknown';
  }

  get locationName() {
    return this.location?.name || this.location || 'unknown';
  }

  get episodeCount() {
    return this.episodes.length;
  }

  get statusText() {
    return this.status || 'unknown';
  }

  get speciesText() {
    return this.species || 'unknown';
  }

  get typeText() {
    return this.type || 'unknown';
  }

  get shortInfo() {
    return `${this.statusText} - ${this.speciesText}`;
  }

  get createdYear() {
    return this.created ? new Date(this.created).getFullYear() : 'unknown';
  }
}
