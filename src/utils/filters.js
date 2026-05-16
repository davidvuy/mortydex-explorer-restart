import { Character } from '../models/Character.js';

const normalizeText = (value = '') => String(value).trim().toLowerCase();

const matchesSearchValue = (character, searchValue = '') => {
  const normalizedSearch = normalizeText(searchValue);

  if (!normalizedSearch) {
    return true;
  }

  const searchableText = [
    character.name,
    character.originName,
    character.locationName,
    character.typeText
  ]
    .map(value => normalizeText(value))
    .join(' ');

  return searchableText.includes(normalizedSearch);
};

const matchesSelectedValue = (characterValue = '', selectedValue = 'all') => {
  return selectedValue === 'all' ? true : characterValue === selectedValue;
};

export const filterCharacters = (characters = [], filters = {}) => {
  const {
    search = '',
    status = 'all',
    species = 'all',
    gender = 'all'
  } = filters;

  return characters.filter(character => {
    const matchesSearch = matchesSearchValue(character, search);
    const matchesStatus = matchesSelectedValue(character.statusText, status);
    const matchesSpecies = matchesSelectedValue(character.speciesText, species);
    const matchesGender = matchesSelectedValue(character.gender, gender);

    return matchesSearch && matchesStatus && matchesSpecies && matchesGender;
  });
};

export const sortCharacters = (characters = [], sortValue = 'name-asc') => {
  const charactersCopy = [...characters];

  if (sortValue === 'name-desc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return Character.compareByName(secondCharacter, firstCharacter);
    });
  }

  if (sortValue === 'episodes-desc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return secondCharacter.episodeCount - firstCharacter.episodeCount;
    });
  }

  if (sortValue === 'status-asc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return firstCharacter.statusText.localeCompare(secondCharacter.statusText);
    });
  }

  if (sortValue === 'species-asc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return firstCharacter.speciesText.localeCompare(secondCharacter.speciesText);
    });
  }

  return charactersCopy.sort(Character.compareByName);
};
