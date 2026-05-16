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
