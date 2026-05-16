export class Character {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.status = data.status;
    this.species = data.species;
    this.type = data.type;
    this.gender = data.gender;
    this.origin = data.origin;
    this.location = data.location;
    this.episodes = data.episodes;
    this.created = data.created;
  }

  static fromList(characters = []) {
    return characters.map(character => new Character(character));
  }

  get originName() {
    return this.origin?.name || this.origin || 'unknown';
  }

  get locationName() {
    return this.location?.name || this.location || 'unknown';
  }

  get episodeCount() {
    return this.episodes?.length ?? 0;
  }

  get statusText() {
    return this.status || 'unknown';
  }

  get shortInfo() {
    return `${this.statusText} - ${this.species || 'unknown'}`;
  }
}
