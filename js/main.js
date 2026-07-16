/* ============================================================
   Conqueingredientes — main.js
   Render de capacidades, proyectos, filtros y micro-interacciones
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Capacidades ---------- */
  const capList = $('#capList');

  function renderCapacidades() {
    capList.innerHTML = CAPACIDADES.map(cap => `
      <li class="cap-item reveal" data-cap="${cap.id}">
        <span class="cap-num">[${cap.num}]</span>
        <h3 class="cap-name">${cap.nombre}</h3>
        <div class="cap-body">
          <p>${cap.desc}</p>
          <div class="cap-chips">
            ${cap.chips.map(c => `<span>${c}</span>`).join('')}
          </div>
        </div>
      </li>
    `).join('');
  }

  /* Imagen flotante al pasar por una capacidad:
     muestra el primer proyecto de esa categoría */
  const preview = $('#capPreview');
  const previewImg = $('img', preview);

  function setupCapPreview() {
    if (reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    let raf = null;
    let x = 0, y = 0;

    document.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          preview.style.left = (x + 24) + 'px';
          preview.style.top = (y - 90) + 'px';
          raf = null;
        });
      }
    });

    $$('.cap-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        const capId = item.dataset.cap;
        const proyecto = PROYECTOS.find(p => p.caps.includes(capId));
        if (!proyecto) return;
        previewImg.src = `${proyecto.img}`;
        previewImg.alt = proyecto.title;
        preview.classList.add('show');
      });
      item.addEventListener('mouseleave', () => preview.classList.remove('show'));
    });
  }

  /* ---------- Proyectos + filtros ---------- */
  const filtersEl = $('#filters');
  const gridEl = $('#worksGrid');
  let activeFilter = 'todos';

  function renderFilters() {
    const btns = [
      `<button class="filter-btn active" data-filter="todos">Todos</button>`,
      ...CAPACIDADES.map(c =>
        `<button class="filter-btn" data-filter="${c.id}">${c.nombre}</button>`)
    ];
    filtersEl.innerHTML = btns.join('');

    filtersEl.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      $$('.filter-btn', filtersEl).forEach(b => b.classList.toggle('active', b === btn));
      renderWorks();
    });
  }

  function renderWorks() {
    const items = activeFilter === 'todos'
      ? PROYECTOS
      : PROYECTOS.filter(p => p.caps.includes(activeFilter));

    if (!items.length) {
      gridEl.innerHTML = `<p class="works-empty">No hay proyectos en esta categoría todavía.</p>`;
      return;
    }

    gridEl.innerHTML = items.map((p, i) => `
      <article class="work-card" style="animation-delay:${Math.min(i * 60, 360)}ms">
        ${p.url ? `<a href="${p.url}" target="_blank" rel="noopener" class="work-link" aria-label="${p.title} (se abre en una pestaña nueva)">` : ''}
        <div class="work-media">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
        </div>
        <h3 class="work-title">${p.title}${p.url ? ' <span class="work-ext">↗</span>' : ''}</h3>
        ${p.url ? '</a>' : ''}
        <p class="work-desc">${p.desc}</p>
        <div class="work-tags">
          ${p.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </article>
    `).join('');
  }

  /* ---------- Ticker ---------- */
  function renderTicker() {
    const track = $('#tickerTrack');
    const items = SKILLS.map(s => `<span>${s}</span><span class="tick-sep">✳</span>`).join('');
    track.innerHTML = items + items; /* duplicado para bucle continuo */
  }

  /* ---------- Reveal on scroll ---------- */
  function setupReveals() {
    if (reducedMotion) {
      $$('.reveal').forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ---------- Contador de stats ---------- */
  function setupCounters() {
    const nums = $$('.stats strong');
    if (reducedMotion) {
      nums.forEach(el => el.textContent = el.dataset.count);
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const dur = 1200;
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(el => io.observe(el));
  }

  /* ---------- Menú móvil ---------- */
  function setupMobileMenu() {
    const toggle = $('.menu-toggle');
    const menu = $('.mobile-menu');

    function close() {
      toggle.classList.remove('open');
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      menu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('.mobile-menu a').forEach(a => a.addEventListener('click', close));
  }

  /* ---------- Init ---------- */
  renderCapacidades();
  renderFilters();
  renderWorks();
  renderTicker();
  setupCapPreview();
  setupReveals();
  setupCounters();
  setupMobileMenu();
})();
