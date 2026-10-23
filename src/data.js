export const thesisUrl = 'https://wk-p.github.io/thesis/'
export const githubUrl = 'https://github.com/Wk-P'
export const email = 'weekend2000119@gmail.com'

export const papers = [
  {
    id: 'placement', venue: 'KICS 2026',
    title: 'Constraint-Aware Service Placement for Privacy-Preserving Edge Computing Using Safe Reinforcement Learning',
    authors: 'Lingxiao Zhou, Yang Zhou, Taewoon Kim',
    pdf: '/assets/papers/constraint-aware-service-placement-safe-rl.pdf',
  },
  {
    id: 'security', venue: 'KICS 2026',
    title: 'Design and Implementation of an Intelligent Security Management Platform for Private Clouds: A Two-Phase Approach',
    authors: 'Yang Zhou, Lingxiao Zhou, Taewoon Kim',
    pdf: '/assets/papers/private-cloud-security-management-platform.pdf',
  },
  {
    id: 'load-balancing', venue: 'ICMU 2025',
    title: 'Machine Learning-Based Response Time Prediction and Dynamic Load Balancing Optimization for Private Cloud',
    authors: 'Yang Zhou, Lingxiao Zhou, Taewoon Kim',
    pdf: '/assets/papers/private-cloud-response-time-load-balancing.pdf',
  },
]

export const projects = [
  { id: 'cloud', title: 'CloudPlatform', label: 'projects.featured', body: 'projects.cloud.body',
    stack: 'Django · Vue 3 · Kubernetes · MySQL · Redis',
    details: ['projects.cloud.b1', 'projects.cloud.b2'],
    repo: `${githubUrl}/CloudPlatform` },
  { id: 'femoup', title: 'Femoup MVP', label: 'projects.femoup.tag', body: 'projects.femoup.body',
    stack: 'Kakao / Naver · Cloudflare R2 / Stream · AWS',
    details: ['projects.femoup.b1', 'projects.femoup.b2'], status: 'projects.femoup.status' },
  { id: 'security', titleKey: 'projects.security.title', label: 'projects.security.tag', body: 'projects.security.body',
    stack: 'Linux · Kubernetes · eBPF · Hubble',
    details: ['projects.security.b1', 'projects.security.b2'], paper: '/research/#paper-security' },
  { id: 'routing', titleKey: 'projects.routing.title', label: 'projects.routing.tag', body: 'projects.routing.body',
    stack: 'Python · aiohttp · Docker · XGBoost',
    repo: `${githubUrl}/Routing-Monitor-Docker-Request`, paper: '/research/#paper-load-balancing' },
  { id: 'emotion', title: 'Emotion Talk Assistant', label: 'projects.emotion.tag', body: 'projects.emotion.body',
    stack: 'FastAPI · SQLAlchemy · Vue 3 · OpenAI API',
    repo: `${githubUrl}/emotion-talk-assistant`, demo: 'https://emotion.knettf.com' },
]

export const education = [
  { id: 'ms', start: '2024.09', end: '2027.02', school: 'education.ms.school' },
  { id: 'bs', start: '2019.09', end: '2024.08', school: 'common.pnu' },
  { id: 'hs', start: '2015.09', end: '2018.06' },
]

export const skills = [
  { key: 'skills.backend', value: 'Django · FastAPI · REST API · SQLAlchemy · MySQL · Redis' },
  { key: 'skills.cloud', value: 'Linux · Docker · Kubernetes · OpenStack · Terraform' },
  { key: 'skills.programming', value: 'Python · C/C++ · TypeScript · JavaScript' },
  { key: 'skills.research', value: 'Optimization · Safe RL · Network Anomaly Detection' },
]

export const navigation = [
  { path: thesisUrl, key: 'nav.thesis' },
  { path: '/education/', key: 'nav.education' },
  { path: '/about/', key: 'nav.personal' },
  { path: '/projects/', key: 'nav.projects' },
]

// Keep old bookmarks useful without ever claiming the separate thesis site.
export function resolvePage(path, hash = '') {
  const legacy = { '#academic': 'research', '#education': 'education', '#projects': 'projects', '#skills': 'about' }
  if ((path === '/' || path === '/about/') && legacy[hash]) return legacy[hash]
  if (path === '/') return 'home'
  if (path === '/archive/') return 'blog'
  const match = path.match(/^\/(research|education|about|projects|blog)\/?$/)
  return match?.[1] || (path.startsWith('/posts/') ? 'post' : 'missing')
}
