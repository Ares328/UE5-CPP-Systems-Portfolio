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

    const isExpanded = flipCard.classList.contains('is-expanded-full');

    if (isExpanded) {
      if (!this.dataset.originalText) {
        this.dataset.originalText = this.textContent.trim();
      }
      this.textContent = 'Hide';
    } else {
      this.textContent = this.dataset.originalText || 'Play Demo Here!';
    }
  });
});

document.querySelectorAll('.view-code-link').forEach(link => {
  link.addEventListener('click', stopPropagation);
});

const firstCard = document.querySelector('.flip__card');

firstCard.addEventListener('click', function() {
    this.classList.add('has-been-opened');

    sessionStorage.setItem('portfolio-nudge-seen', 'true');
});

document.addEventListener('DOMContentLoaded', () => {
  const firstCard = document.querySelector('.flip__card');
  if (sessionStorage.getItem('portfolio-nudge-seen') === 'true') {
    firstCard.classList.add('has-been-opened');
  }
});