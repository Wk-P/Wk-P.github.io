(() => {
  const form = document.querySelector('form[data-search]');
  if (!form) return;
  const input = form.querySelector('input');
  const buttons = [...document.querySelectorAll('[data-tag]')];
  const posts = [...document.querySelectorAll('[data-post]')];
  const count = document.querySelector('[data-count]');
  const empty = document.querySelector('[data-empty]');
  const clear = document.querySelector('[data-clear]');
  const reset = document.querySelector('[data-reset]');
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
    if (clear) clear.hidden = !input.value;
    if (reset) reset.hidden = !query && tag === 'All';
    const url = new URL(location.href);
    query ? url.searchParams.set('q', input.value.trim()) : url.searchParams.delete('q');
    tag !== 'All' ? url.searchParams.set('tag', tag) : url.searchParams.delete('tag');
    history.replaceState(null, '', url);
  }
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
  input.addEventListener('input', update);
  clear?.addEventListener('click', () => { input.value = ''; update(); input.focus(); });
  reset?.addEventListener('click', () => { input.value = ''; tag = 'All'; update(); input.focus(); });
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

// Reading tools work independently of the homepage search.
(() => {
  document.querySelectorAll('.prose pre').forEach(pre => {
    const code = pre.querySelector('code');
    if (!code || !navigator.clipboard || !window.isSecureContext) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-code';
    button.textContent = 'Copy code';
    button.setAttribute('aria-label', 'Copy code block');
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Unable to copy';
      }
      setTimeout(() => { button.textContent = 'Copy code'; }, 2000);
    });
    pre.append(button);
  });
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  const headings = links.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))).filter(Boolean);
  if (!headings.length) return;
  let scheduled = false;
  function update() {
    let current = headings[0];
    headings.forEach(heading => { if (heading.getBoundingClientRect().top <= 100) current = heading; });
    links.forEach(link => {
      if (decodeURIComponent(link.hash.slice(1)) === current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, {passive:true});
  update();
})();
