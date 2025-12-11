  function stopPropagation(event) {
    event.stopPropagation();
  }

  function resetDemoToggleText(card) {
    const toggleButton = card.querySelector('.expand-iframe-toggle');
    if (toggleButton) {
      toggleButton.textContent = 'Play Demo Here!';
    }
  }

  document.querySelectorAll('.flip__card').forEach(card => {
    card.addEventListener('click', function (event) {
      if (!event.target.closest('a') && !event.target.closest('.expand-iframe-toggle')) {
        this.classList.toggle('is-flipped');

        if (!this.classList.contains('is-flipped')) {
          this.classList.remove('is-expanded-full');
          resetDemoToggleText(this);
        }
      }
    });
  });

  document.querySelectorAll('.expand-iframe-toggle').forEach(toggle => {
    toggle.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const flipCard = this.closest('.flip__card');

      if (!flipCard.classList.contains('is-flipped')) {
        flipCard.classList.add('is-flipped');
      }

      flipCard.classList.toggle('is-expanded-full');

      if (flipCard.classList.contains('is-expanded-full')) {
        this.textContent = 'Hide Demo';
      } else {
        this.textContent = 'Play Demo Here!';
      }
    });
  });

  document.querySelectorAll('.view-code-link').forEach(link => {
    link.addEventListener('click', stopPropagation);
  });