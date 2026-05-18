const PREFERENCES_KEY = 'mortydexPreferences';

const defaultPreferences = {
  theme: 'light',
  view: 'grid',
  search: '',
  status: 'all',
  species: 'all',
  gender: 'all',
  sort: 'name-asc'
};

export const getPreferences = () => {
  const savedPreferences = localStorage.getItem(PREFERENCES_KEY);

  if (!savedPreferences) {
    return defaultPreferences;
  }

  return {
    ...defaultPreferences,
    ...JSON.parse(savedPreferences)
  };
};

export const savePreferences = preferences => {
  const oldPreferences = getPreferences();
  const newPreferences = {
    ...oldPreferences,
    ...preferences
  };

  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(newPreferences));
};
