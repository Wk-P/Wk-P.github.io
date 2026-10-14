(() => {
  const form = document.querySelector('[data-search]');
  if (!form) return;
  const input = form.querySelector('input');
  const buttons = [...document.querySelectorAll('[data-tag]')];
  const posts = [...document.querySelectorAll('[data-post]')];
  const count = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');
  const params = new URLSearchParams(location.search);
  let tag = params.get('tag') || 'All';
  if (!buttons.some(button => button.dataset.tag === tag)) tag = 'All';
  input.value = params.get('q') || '';
  function update() {
    const query = input.value.trim().toLowerCase();
    let shown = 0;
    posts.forEach(post => {
      const tags = JSON.parse(post.dataset.tags);
      const match = (tag === 'All' || tags.includes(tag)) && post.dataset.search.includes(query);
      post.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tag === tag)));
    count.textContent = `${shown} ${shown === 1 ? 'article' : 'articles'}`;
    empty.hidden = shown > 0;
    const url = new URL(location.href);
    query ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
    tag !== 'All' ? url.searchParams.set('tag', tag) : url.searchParams.delete('tag');
    history.replaceState(null, '', url);
  }
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
  input.addEventListener('input', update);
  buttons.forEach(button => button.addEventListener('click', () => { tag = button.dataset.tag; update(); }));
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(location.search);
    input.value = params.get('q') || '';
    tag = params.get('tag') || 'All';
    if (!buttons.some(button => button.dataset.tag === tag)) tag = 'All';
    update();
  });
  update();
})();
