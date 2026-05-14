export const formatValue = value => {
  if (value === null || value === undefined || value === '') {
    return 'Onbekend';
  }

  return value;
};

export const formatEpisodeCount = episodes => {
  if (!Array.isArray(episodes)) {
    return '0';
  }

  return `${episodes.length} episode(s)`;
};
