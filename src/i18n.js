import { ref, watchEffect } from 'vue'
import translations from './translations.json'

const extra = {
  en: { home: 'Home', overview: 'Selected work', allProjects: 'All projects →', more: 'Project details', less: 'Close details',
    email: 'Email', github: 'GitHub', blog: 'Notes', empty: 'No published notes yet.', search: 'Search notes', allTags: 'All topics', noResults: 'No matching notes.',
    missing: 'Page not found', back: 'Back to home →', original: 'Article language', draft: 'Draft preview',
    thesisLabel: 'Master’s thesis', researchLabel: 'Research', educationLabel: 'Education', aboutLabel: 'About me',
    source: 'Source code', role: 'Backend / Cloud Engineer', availability: 'Expected graduation · February 2027', relatedPaper: 'Related paper →',
    thesisSummary: 'Privacy-aware edge service placement with optimization and safe reinforcement learning.',
    notesLink: 'Engineering notes →', footer: 'Backend · Cloud · Research', other: 'Other prototypes', notPublished: 'This draft is excluded from the published site and RSS.',
  },
  zh: { home: '首页', overview: '代表项目', allProjects: '全部项目 →', more: '项目详情', less: '收起详情',
    email: '邮件联系', github: 'GitHub', blog: '技术笔记', empty: '暂无已发布笔记。', search: '搜索笔记', allTags: '全部主题', noResults: '没有找到相关笔记。',
    missing: '页面未找到', back: '返回首页 →', original: '正文语言', draft: '草稿预览',
    thesisLabel: '硕士论文', researchLabel: '研究成果', educationLabel: '教育经历', aboutLabel: '关于我',
    source: '代码仓库', role: '后端 / 云工程师', availability: '预计毕业 · 2027 年 2 月', relatedPaper: '相关论文 →',
    thesisSummary: '结合优化与安全强化学习，研究隐私约束下的边缘服务部署。',
    notesLink: '技术笔记 →', footer: '后端 · 云平台 · 研究', other: '其他原型', notPublished: '此草稿不包含在正式网站或 RSS 中。',
  },
  ko: { home: '홈', overview: '주요 프로젝트', allProjects: '모든 프로젝트 →', more: '프로젝트 상세', less: '상세 닫기',
    email: '이메일', github: 'GitHub', blog: '기술 노트', empty: '아직 게시된 노트가 없습니다.', search: '노트 검색', allTags: '전체 주제', noResults: '검색 결과가 없습니다.',
    missing: '페이지를 찾을 수 없습니다', back: '홈으로 →', original: '본문 언어', draft: '초안 미리보기',
    thesisLabel: '석사논문', researchLabel: '연구성과', educationLabel: '학력', aboutLabel: '소개',
    source: '소스 코드', role: '백엔드 / 클라우드 엔지니어', availability: '졸업 예정 · 2027년 2월', relatedPaper: '관련 논문 →',
    thesisSummary: '최적화와 안전 강화학습을 활용한 프라이버시 제약 기반 엣지 서비스 배치 연구입니다.',
    notesLink: '기술 노트 →', footer: '백엔드 · 클라우드 · 연구', other: '기타 프로토타입', notPublished: '이 초안은 공개 사이트와 RSS에 포함되지 않습니다.',
  },
}
let initial = 'en'
try { const saved = localStorage.getItem('portfolio-language'); if (translations[saved]) initial = saved } catch {}
export const language = ref(initial)
export const t = key => translations[language.value][key] ?? extra[language.value][key] ?? key
export function useLanguage() {
  watchEffect(() => {
    document.documentElement.lang = language.value === 'zh' ? 'zh-CN' : language.value
    try { localStorage.setItem('portfolio-language', language.value) } catch {}
  })
  return { language, t }
}
