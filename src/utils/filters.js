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
    character.type
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
    const matchesStatus = matchesSelectedValue(character.status, status);
    const matchesSpecies = matchesSelectedValue(character.species, species);
    const matchesGender = matchesSelectedValue(character.gender, gender);

    return matchesSearch && matchesStatus && matchesSpecies && matchesGender;
  });
};

export const sortCharacters = (characters = [], sortValue = 'name-asc') => {
  const charactersCopy = [...characters];

  if (sortValue === 'name-desc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return secondCharacter.name.localeCompare(firstCharacter.name);
    });
  }

  if (sortValue === 'episodes-desc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return secondCharacter.episodeCount - firstCharacter.episodeCount;
    });
  }

  if (sortValue === 'status-asc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return firstCharacter.status.localeCompare(secondCharacter.status);
    });
  }

  if (sortValue === 'species-asc') {
    return charactersCopy.sort((firstCharacter, secondCharacter) => {
      return firstCharacter.species.localeCompare(secondCharacter.species);
    });
  }

  return charactersCopy.sort((firstCharacter, secondCharacter) => {
    return firstCharacter.name.localeCompare(secondCharacter.name);
  });
};
