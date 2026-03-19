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

/* ---- Why Us: relance animation si la section entre dans le viewport ---- */
(function () {
  var cards = document.querySelectorAll('.why-us-card');
  if (!cards.length || !window.IntersectionObserver) return;

  // Retire l'état initial opacité 0 uniquement quand visible
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(function (card) {
    // Bloque l'animation jusqu'à ce que la carte soit visible
    card.style.animationPlayState = 'paused';
    obs.observe(card);
  });
})();

/* ---- Stats counter animation ---- */
(function () {
  var numbers = document.querySelectorAll('.stat-number[data-count]');
  if (!numbers.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    var target  = parseInt(el.dataset.count, 10);
    var suffix  = el.dataset.suffix || '';
    var decimal = el.dataset.decimal === 'true';
    var duration = 1800;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value    = Math.round(easeOut(progress) * target);

      if (decimal) {
        // 49 → "4.9"
        var display = (value / 10).toFixed(1);
        el.textContent = display + suffix;
      } else {
        el.textContent = value.toLocaleString('fr-FR') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.classList.add('is-counted');
      }
    }

    el.classList.add('is-counted');
    requestAnimationFrame(step);
  }

  if (!window.IntersectionObserver) {
    numbers.forEach(animateCount);
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  numbers.forEach(function (el) { obs.observe(el); });
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
