const FAVORITES_KEY = 'mortydexFavorites';

export const getFavoriteIds = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);

  if (!favorites) {
    return [];
  }

  return JSON.parse(favorites);
};

export const saveFavoriteIds = favoriteIds => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
};

export const isFavorite = (characterId, favoriteIds = getFavoriteIds()) => {
  return favoriteIds.includes(characterId);
};

export const toggleFavorite = characterId => {
  let favoriteIds = getFavoriteIds();

  if (favoriteIds.includes(characterId)) {
    favoriteIds = favoriteIds.filter(favoriteId => favoriteId !== characterId);
  } else {
    favoriteIds.push(characterId);
  }

  saveFavoriteIds(favoriteIds);

  return favoriteIds;
};
