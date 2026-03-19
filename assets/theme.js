/* Uncle Vap — Theme JS */
'use strict';

/* ---- Hamburger menu ---- */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.header-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function () {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open', !expanded);
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });
})();

/* ---- Search toggle ---- */
(function () {
  const toggle = document.getElementById('search-toggle');
  const bar = document.getElementById('search-bar');
  if (!toggle || !bar) return;

  toggle.addEventListener('click', function () {
    const hidden = bar.hasAttribute('hidden');
    if (hidden) {
      bar.removeAttribute('hidden');
      bar.querySelector('input')?.focus();
    } else {
      bar.setAttribute('hidden', '');
    }
  });
})();

/* ---- Product slider buttons ---- */
(function () {
  document.querySelectorAll('.slider-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const sliderId = btn.dataset.slider;
      const slider = document.getElementById(sliderId);
      if (!slider) return;
      const cardWidth = slider.querySelector('.product-card')?.offsetWidth || 260;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * 2;
      slider.scrollBy({
        left: btn.classList.contains('slider-btn--next') ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    });
  });
})();

/* ---- Add to cart (AJAX) ---- */
(function () {
  document.querySelectorAll('.btn-add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const variantId = btn.dataset.productId;
      if (!variantId) return;

      btn.disabled = true;
      btn.textContent = '...';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          btn.textContent = '✓ Ajouté';
          // Update cart count
          fetch('/cart.js')
            .then(function (r) { return r.json(); })
            .then(function (cart) {
              const countEl = document.querySelector('.cart-count');
              if (countEl) {
                countEl.textContent = cart.item_count;
                countEl.style.display = cart.item_count > 0 ? 'flex' : 'none';
              }
            });
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = 'Ajouter';
          }, 2000);
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Erreur';
          setTimeout(function () { btn.textContent = 'Ajouter'; }, 2000);
        });
    });
  });
})();
