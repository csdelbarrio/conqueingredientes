const grid = document.getElementById('grid');
const filterBar = document.getElementById('filterBar');
const resultCount = document.getElementById('resultCount');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalEl = document.getElementById('modal');

let activeTag = null;

// Build tag list
const allTags = [...new Set(PROJECTS.flatMap(p => p.tags))].sort();
const allBtn = document.createElement('button');
allBtn.className = 'tag-btn active';
allBtn.textContent = 'Todos';
allBtn.addEventListener('click', () => setFilter(null));
filterBar.insertBefore(allBtn, resultCount);

allTags.forEach(tag => {
  const btn = document.createElement('button');
  btn.className = 'tag-btn';
  btn.textContent = tag;
  btn.addEventListener('click', () => setFilter(tag));
  filterBar.insertBefore(btn, resultCount);
});

function setFilter(tag){
  activeTag = tag;
  [...filterBar.querySelectorAll('.tag-btn')].forEach(b => {
    b.classList.toggle('active', (tag === null && b.textContent === 'Todos') || b.textContent === tag);
  });
  render();
}

function render(){
  const list = activeTag ? PROJECTS.filter(p => p.tags.includes(activeTag)) : PROJECTS;
  resultCount.textContent = list.length + ' / ' + PROJECTS.length;
  grid.innerHTML = '';
  if(list.length === 0){
    grid.innerHTML = '<div class="no-results">Sin resultados para este filtro.</div>';
    return;
  }
  list.forEach((p) => {
    const idx = PROJECTS.indexOf(p) + 1;
    const card = document.createElement('article');
    card.className = 'card';
    card.addEventListener('click', () => openModal(p));

    const mediaHtml = p.images.length
      ? `<div class="card-media"><span class="card-index">${String(idx).padStart(2,'0')}/23</span><img src="content/proyectos/${p.slug}/${p.images[0]}" alt="${p.title}" loading="lazy"></div>`
      : `<div class="card-media empty"><span class="card-index">${String(idx).padStart(2,'0')}/23</span><span>Sin imagen archivada</span></div>`;

    card.innerHTML = `
      ${mediaHtml}
      <div class="card-body">
        <p class="card-client">${p.cliente_name ? p.cliente_name : 'Proyecto propio / interno'}</p>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        <div class="stamp-row">${p.tags.map(t => `<span class="stamp">${t}</span>`).join('')}</div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openModal(p){
  const galleryHtml = p.images.length
    ? `<div class="modal-gallery">${p.images.map(img => `<img src="content/proyectos/${p.slug}/${img}" alt="${p.title}">`).join('')}</div>`
    : `<div class="modal-gallery empty"><span>Sin imagen archivada para este proyecto</span></div>`;

  const linksHtml = [
    p.cliente_url ? `<a href="${p.cliente_url}" target="_blank" rel="noopener">Ver cliente ↗</a>` : '',
    p.demo ? `<a href="${p.demo}" target="_blank" rel="noopener">Demo original ↗</a>` : ''
  ].filter(Boolean).join('');

  modalEl.innerHTML = `
    <button class="modal-close" id="modalClose">✕</button>
    ${galleryHtml}
    <div class="modal-body">
      <p class="modal-client">${p.cliente_name ? p.cliente_name : 'Proyecto propio / interno'}</p>
      <h2 class="modal-title">${p.title}</h2>
      <p class="modal-desc">${p.description}</p>
      <div class="stamp-row" style="margin-bottom:20px;">${p.tags.map(t => `<span class="stamp">${t}</span>`).join('')}</div>
      ${linksHtml ? `<div class="modal-links">${linksHtml}</div>` : ''}
    </div>
  `;
  modalBackdrop.classList.add('open');
  document.getElementById('modalClose').addEventListener('click', closeModal);
}

function closeModal(){
  modalBackdrop.classList.remove('open');
}
modalBackdrop.addEventListener('click', (e) => { if(e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

render();
