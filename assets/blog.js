// Shared language state for every generated page. Post bodies keep their authored language.
(() => {
  const copy = {
    en: {
      'common.name':'Lingxiao Zhou','common.skip':'Skip to content','nav.blog':'Blog','nav.archive':'Archive','nav.about':'About','nav.thesis':'Thesis ↗',
      'footer.tagline':'Built for writing and learning.','footer.rss':'RSS feed ↗','footer.email':'Email ↗',
      'home.eyebrow':'Engineering & research notes','home.title':'Notes from building.<br>Questions worth exploring.',
      'home.description':'Cloud-native systems, backend engineering, and the research behind them. A place to think in public and write things down.',
      'home.hello':'Hello, I’m Lingxiao.','home.bio':'Computer Engineering researcher and platform-oriented developer at Pusan National University.',
      'home.about':'More about me ↗','home.latest':'Latest writing','home.preview':'Local preview includes unpublished drafts.',
      'home.noResults':'No matching articles','home.emptyTitle':'The first post is on its way.','home.noResultsHint':'Try another keyword or select All topics.',
      'home.emptyHint':'This is the home for upcoming engineering and research notes. Explore my projects and background on the About page.',
      'home.reset':'Reset filters','home.search':'Find an article','home.searchHint':'Search across titles and article content.',
      'home.tags':'Browse by tag','home.interests':'Areas of interest','home.cloud':'Cloud & infrastructure','home.backend':'Backend systems',
      'home.rl':'Optimization & safe RL','home.beyond':'Beyond the blog','home.beyondDescription':'Projects, academic work, and an ongoing thesis.',
      'home.projects':'Selected projects ↗','home.thesis':'Thesis workspace ↗','home.follow':'Follow along',
      'home.followDescription':'Read new posts in your preferred feed reader.','home.rss':'Subscribe via RSS ↗',
      'article.all':'← All articles','article.back':'← Back to the blog','article.toc':'On this page','article.read':'Read article ↗',
      'article.draftNotice':'Draft preview — this article is excluded from the published site and RSS feed.',
      'archive.description':'All articles, organized by year.','archive.eyebrow':'The notebook','archive.title':'Writing archive','archive.empty':'No published articles yet.',
      'error.title':'A missing page.','error.description':'The link may have changed. Find the latest writing on the blog.','error.back':'Return to the blog →',
      'about.eyebrow':'Background & selected work','search.placeholder':'Search title, topic, or keyword…','search.clear':'Clear search',
      'toc.copy':'Copy code','toc.copied':'Copied','toc.failed':'Unable to copy',
      'count.one':'article','count.many':'articles','read.time':n=>`${n} min read`,
      'content.original':name=>`This article is available in ${name}.`
    },
    zh: {
      'common.name':'周凌霄','common.skip':'跳转到正文','nav.blog':'博客','nav.archive':'归档','nav.about':'关于','nav.thesis':'硕士论文 ↗',
      'footer.tagline':'记录实践，持续学习。','footer.rss':'RSS 订阅 ↗','footer.email':'邮件 ↗',
      'home.eyebrow':'工程与研究笔记','home.title':'记录实践。<br>探索值得追问的问题。',
      'home.description':'分享云原生系统、后端工程和相关研究中的实践与思考。',
      'home.hello':'你好，我是周凌霄。','home.bio':'釜山大学计算机工程研究者，关注平台与后端开发。',
      'home.about':'了解更多 ↗','home.latest':'最新文章','home.preview':'本地预览包含尚未发布的草稿。',
      'home.noResults':'没有找到相关文章','home.emptyTitle':'第一篇文章即将发布。','home.noResultsHint':'试试其他关键词，或选择“全部”。',
      'home.emptyHint':'这里将发布工程与研究笔记。你也可以先查看我的项目和经历。',
      'home.reset':'清除筛选','home.search':'搜索文章','home.searchHint':'可搜索标题、标签和正文。',
      'home.tags':'按标签浏览','home.interests':'关注领域','home.cloud':'云与基础设施','home.backend':'后端系统',
      'home.rl':'优化与安全强化学习','home.beyond':'博客之外','home.beyondDescription':'项目、学术经历与硕士论文。',
      'home.projects':'查看项目 ↗','home.thesis':'硕士论文 ↗','home.follow':'订阅更新',
      'home.followDescription':'在你常用的阅读器中接收新文章。','home.rss':'订阅 RSS ↗',
      'article.all':'← 所有文章','article.back':'← 返回博客','article.toc':'本页目录','article.read':'阅读文章 ↗',
      'article.draftNotice':'草稿预览：本文不会出现在正式网站或 RSS 中。',
      'archive.description':'按年份浏览全部文章。','archive.eyebrow':'笔记','archive.title':'文章归档','archive.empty':'暂无已发布文章。',
      'error.title':'页面未找到。','error.description':'链接可能已变更，请返回博客查看最新内容。','error.back':'返回博客 →',
      'about.eyebrow':'背景与代表作品','search.placeholder':'搜索标题、主题或关键词…','search.clear':'清除搜索',
      'toc.copy':'复制代码','toc.copied':'已复制','toc.failed':'复制失败',
      'count.one':'篇文章','count.many':'篇文章','read.time':n=>`约 ${n} 分钟阅读`,
      'content.original':name=>`本文暂无译文，正文以${name}显示。`
    },
    ko: {
      'common.name':'Lingxiao Zhou','common.skip':'본문으로 이동','nav.blog':'블로그','nav.archive':'글 목록','nav.about':'소개','nav.thesis':'석사논문 ↗',
      'footer.tagline':'만들고 배우며 기록합니다.','footer.rss':'RSS 피드 ↗','footer.email':'이메일 ↗',
      'home.eyebrow':'엔지니어링 · 연구 노트','home.title':'만들며 기록하고,<br>질문하며 탐구합니다.',
      'home.description':'클라우드 네이티브 시스템, 백엔드 엔지니어링과 관련 연구를 기록합니다.',
      'home.hello':'안녕하세요, Lingxiao입니다.','home.bio':'부산대학교 컴퓨터공학 연구자이자 플랫폼 및 백엔드 개발자입니다.',
      'home.about':'자세히 보기 ↗','home.latest':'최근 글','home.preview':'로컬 미리보기에는 미발행 초안이 포함됩니다.',
      'home.noResults':'검색 결과가 없습니다','home.emptyTitle':'첫 글을 준비하고 있습니다.','home.noResultsHint':'다른 검색어를 입력하거나 전체를 선택해 보세요.',
      'home.emptyHint':'앞으로 엔지니어링과 연구 노트를 게시할 예정입니다. 프로젝트와 이력을 먼저 살펴보세요.',
      'home.reset':'필터 초기화','home.search':'글 검색','home.searchHint':'제목, 태그, 본문을 검색할 수 있습니다.',
      'home.tags':'태그별 보기','home.interests':'관심 분야','home.cloud':'클라우드 및 인프라','home.backend':'백엔드 시스템',
      'home.rl':'최적화와 안전 강화학습','home.beyond':'블로그 외 활동','home.beyondDescription':'프로젝트, 학술 활동과 석사논문.',
      'home.projects':'프로젝트 보기 ↗','home.thesis':'석사논문 ↗','home.follow':'새 글 받기',
      'home.followDescription':'사용하는 피드 리더에서 새 글을 받아보세요.','home.rss':'RSS 구독 ↗',
      'article.all':'← 모든 글','article.back':'← 블로그로','article.toc':'목차','article.read':'글 읽기 ↗',
      'article.draftNotice':'초안 미리보기: 이 글은 공개 사이트와 RSS에 포함되지 않습니다.',
      'archive.description':'연도별로 모든 글을 볼 수 있습니다.','archive.eyebrow':'노트','archive.title':'글 목록','archive.empty':'게시된 글이 없습니다.',
      'error.title':'페이지를 찾을 수 없습니다.','error.description':'주소가 바뀌었을 수 있습니다. 블로그에서 최신 글을 확인하세요.','error.back':'블로그로 돌아가기 →',
      'about.eyebrow':'소개 및 주요 프로젝트','search.placeholder':'제목, 주제 또는 키워드 검색…','search.clear':'검색어 지우기',
      'toc.copy':'코드 복사','toc.copied':'복사됨','toc.failed':'복사 실패',
      'count.one':'개 글','count.many':'개 글','read.time':n=>`약 ${n}분 읽기`,
      'content.original':name=>`이 글은 아직 번역되지 않아 ${name}(으)로 표시됩니다.`
    }
  };
  function getLanguage() {
    try { const saved = localStorage.getItem('portfolio-language'); if (copy[saved]) return saved; } catch {}
    return 'en';
  }
  function setLanguage(lang) {
    if (!copy[lang]) return;
    try { localStorage.setItem('portfolio-language', lang); } catch {}
    const t = copy[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const value = t[el.dataset.i18n];
      if (typeof value === 'string') {
        if (el.dataset.i18n === 'home.title') el.innerHTML = value;
        else el.textContent = value;
      }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const selected = btn.dataset.lang === lang;
      btn.classList.toggle('active', selected);
      btn.setAttribute('aria-pressed', String(selected));
    });
    const input = document.querySelector('form[data-search] input');
    if (input) input.placeholder = t['search.placeholder'];
    const clear = document.querySelector('[data-clear]');
    if (clear) clear.setAttribute('aria-label', t['search.clear']);
    document.querySelectorAll('[data-read-minutes]').forEach(el => {
      el.textContent = t['read.time'](Number(el.dataset.readMinutes));
    });
    document.querySelectorAll('time[datetime]').forEach(el => {
      const date = new Date(el.getAttribute('datetime') + 'T12:00:00Z');
      el.textContent = new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : lang, {year:'numeric',month:'short',day:'numeric',timeZone:'UTC'}).format(date);
    });
    const count = document.querySelector('[data-count]');
    if (count) {
      const n = Number(count.dataset.visibleCount ?? count.dataset.totalCount);
      count.textContent = lang === 'en' ? `${n} ${n === 1 ? t['count.one'] : t['count.many']}` : `${n} ${t['count.many']}`;
    }
    const original = document.querySelector('[data-content-language]');
    if (original) {
      const authored = original.dataset.contentLanguage;
      original.hidden = authored === lang;
      original.textContent = t['content.original']({en:'English',zh:'中文',ko:'한국어'}[authored]);
    }
    document.querySelectorAll('.copy-code').forEach(btn => { btn.textContent = t['toc.copy']; });
    document.dispatchEvent(new CustomEvent('blog:language', {detail:{lang}}));
  }
  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => setLanguage(btn.dataset.lang)));
  window.blogLanguage = {get:getLanguage, set:setLanguage, translate:key=>copy[getLanguage()][key]};
  setLanguage(getLanguage());
})();

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
    count.dataset.visibleCount = String(shown);
    const language = window.blogLanguage?.get() || 'en';
    const unit = window.blogLanguage?.translate(shown === 1 ? 'count.one' : 'count.many') || (shown === 1 ? 'article' : 'articles');
    count.textContent = language === 'en' ? `${shown} ${unit}` : `${shown} ${unit}`;
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
    button.textContent = window.blogLanguage?.translate('toc.copy') || 'Copy code';
    button.setAttribute('aria-label', window.blogLanguage?.translate('toc.copy') || 'Copy code block');
    button.setAttribute('aria-live', 'polite');
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = window.blogLanguage?.translate('toc.copied') || 'Copied';
      } catch {
        button.textContent = window.blogLanguage?.translate('toc.failed') || 'Unable to copy';
      }
      setTimeout(() => { button.textContent = window.blogLanguage?.translate('toc.copy') || 'Copy code'; }, 2000);
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
