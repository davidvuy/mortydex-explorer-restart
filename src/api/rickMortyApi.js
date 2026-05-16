const API_URL = 'https://rickandmortyapi.com/api/character';

export const fetchCharacters = async (amountOfPages = 3) => {
  const pages = Array.from({ length: amountOfPages }, (item, index) => index + 1);

  const requests = pages.map(page => {
    return fetch(`${API_URL}?page=${page}`).then(response => {
      if (!response.ok) {
        throw new Error('Characters konden niet geladen worden.');
      }

      return response.json();
    });
  });

  const data = await Promise.all(requests);

  return data.flatMap(page => page.results || []);
};
