export const bindControlEvents = (controls = {}, onFilterChange = () => {}) => {
  const {
    searchInput,
    statusFilter,
    speciesFilter,
    genderFilter,
    sortSelect,
    resetButton
  } = controls;

  const filterControls = [
    searchInput,
    statusFilter,
    speciesFilter,
    genderFilter,
    sortSelect
  ];

  filterControls.forEach(control => {
    if (!control) {
      return;
    }

    const eventName = control === searchInput ? 'input' : 'change';
    control.addEventListener(eventName, () => {
      onFilterChange();
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }

      if (statusFilter) {
        statusFilter.value = 'all';
      }

      if (speciesFilter) {
        speciesFilter.value = 'all';
      }

      if (genderFilter) {
        genderFilter.value = 'all';
      }

      if (sortSelect) {
        sortSelect.value = 'name-asc';
      }

      onFilterChange();
    });
  }
};

export const bindViewButtons = (buttons, onViewChange = () => {}) => {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(currentButton => {
        currentButton.classList.remove('is-active');
      });

      button.classList.add('is-active');
      onViewChange(button.dataset.view);
    });
  });
};

export const bindFavoriteButtons = (container, onFavoriteClick = () => {}) => {
  if (!container) {
    return;
  }

  container.addEventListener('click', event => {
    const favoriteButton = event.target.closest('.favorite-button');

    if (!favoriteButton) {
      return;
    }

    const characterId = Number(favoriteButton.dataset.id);

    if (!characterId) {
      return;
    }

    onFavoriteClick(characterId);
  });
};

export const bindRemoveFavoriteButtons = (container, onRemoveClick = () => {}) => {
  if (!container) {
    return;
  }

  container.addEventListener('click', event => {
    const removeButton = event.target.closest('.remove-favorite-button');

    if (!removeButton) {
      return;
    }

    const characterId = Number(removeButton.dataset.id);

    if (!characterId) {
      return;
    }

    onRemoveClick(characterId);
  });
};

export const bindCharacterClicks = (container, onCharacterClick = () => {}) => {
  if (!container) {
    return;
  }

  container.addEventListener('click', event => {
    if (event.target.closest('button')) {
      return;
    }

    const characterElement = event.target.closest('.character-card, .character-row');

    if (!characterElement) {
      return;
    }

    const characterId = Number(characterElement.dataset.id);

    if (!characterId) {
      return;
    }

    onCharacterClick(characterId);
  });
};
