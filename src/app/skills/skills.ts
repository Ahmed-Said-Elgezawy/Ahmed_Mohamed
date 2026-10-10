import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
 
/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */
 
interface RichPart {
  text: string;
  strong?: boolean;
}
 
interface Technology {
  name: string;
  text: string;
}
 
interface Flow {
  title: string;
  steps: string[];
}
 
interface SkillCategory {
  id: string;
  number: string;
  title: string;
  icon: string; // SVG path data (24x24, stroke based)
  intro: string[];
  skillsTitle: string;
  skills: string[];
  techTitle: string;
  technologies: Technology[];
  flow?: Flow;
}
 
interface ToolkitGroup {
  id: string;
  title: string;
  items: string[];
}
 
interface TogetherStep {
  title: string;
  parts: RichPart[];
}
 
interface SectionLink {
  id: string;
  label: string;
}
 
interface Stat {
  label: string;
  value: string;
  note: string;
}
 
interface ResultGroup {
  id: string;
  title: string;
  items: string[];
}
 
/* ------------------------------------------------------------------ */
/*  Icons (Lucide-style paths, drawn with stroke, 24x24)               */
/* ------------------------------------------------------------------ */
 
const ICONS = {
  briefcase:
    'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 7h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
  megaphone: 'm3 11 18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6',
  pen: 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.586 7.586',
  code: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  server: 'M2 3h20v7H2z M2 14h20v7H2z M6 6.5h.01 M6 17.5h.01',
  layout: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M3 9h18 M9 21V9',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
} as const;
 
/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
 
const HEADLINE = 'Skills That Connect Business, Creativity & Technology';
 
const OVERVIEW: RichPart[][] = [
  [
    { text: 'My skill set combines ' },
    {
      text: 'Business Development, Digital Marketing, Graphic Design, and Front-End Development',
      strong: true,
    },
    {
      text: ', allowing me to approach projects from both a business and technical perspective.',
    },
  ],
  [
    {
      text: 'I continuously develop my skills to create better solutions, stronger digital experiences, and more effective business outcomes.',
    },
  ],
];
 
const CATEGORIES: SkillCategory[] = [
  {
    id: 'business-development',
    number: '01',
    title: 'Business Development',
    icon: ICONS.briefcase,
    intro: [
      'I have experience in identifying business opportunities, communicating with potential clients, understanding their needs, presenting solutions, and supporting the sales process.',
    ],
    skillsTitle: 'Key Skills',
    skills: [
      'Business Development',
      'Lead Generation',
      'Prospecting',
      'Client Communication',
      'Needs Discovery',
      'B2B Communication',
      'Service Presentation',
      'Sales Follow-up',
      'Objection Handling',
      'Negotiation Support',
      'Relationship Management',
      'Customer Follow-up',
      'CRM Management',
      'Market Research',
      'Business Opportunity Identification',
    ],
    techTitle: '',
    technologies: [],
  },
  {
    id: 'social-media-marketing',
    number: '02',
    title: 'Social Media Marketing',
    icon: ICONS.megaphone,
    intro: [
      'I create and manage digital content designed to strengthen brand presence, increase awareness, and communicate products and services effectively.',
    ],
    skillsTitle: 'Key Skills',
    skills: [
      'Social Media Marketing',
      'Content Creation',
      'Content Planning',
      'Social Media Management',
      'Brand Awareness',
      'Digital Marketing',
      'Promotional Content',
      'Marketing Campaign Support',
      'Audience Research',
      'Content Strategy',
      'Social Media Communication',
      'Marketing Coordination',
    ],
    techTitle: '',
    technologies: [],
    flow: {
      title: 'What I Focus On',
      steps: ['Strategy', 'Content', 'Design', 'Publishing', 'Engagement', 'Improvement'],
    },
  },
  {
    id: 'graphic-design',
    number: '03',
    title: 'Graphic Design',
    icon: ICONS.pen,
    intro: [
      'I create visual content that combines creativity, clear communication, and consistent brand presentation.',
    ],
    skillsTitle: 'Key Skills',
    skills: [
      'Graphic Design',
      'Social Media Design',
      'Marketing Designs',
      'Promotional Materials',
      'Advertising Creatives',
      'Visual Communication',
      'Brand Visuals',
      'Typography',
      'Layout & Composition',
      'Color & Visual Balance',
      'Presentation Design',
      'Digital Content Design',
    ],
    techTitle: '',
    technologies: [],
    flow: {
      title: 'Design Focus',
      steps: ['Concept', 'Visual Direction', 'Design', 'Refinement', 'Final Delivery'],
    },
  },
  {
    id: 'front-end-development',
    number: '04',
    title: 'Front-End Development',
    icon: ICONS.code,
    intro: [
      'I build modern, responsive, and user-friendly interfaces with a focus on clean structure, usability, and visual quality.',
    ],
    skillsTitle: '',
    skills: [],
    techTitle: 'Core Technologies',
    technologies: [
      { name: 'HTML5', text: 'Building semantic and well-structured web pages.' },
      { name: 'CSS3', text: 'Creating responsive layouts and modern visual interfaces.' },
      { name: 'SCSS / Sass', text: 'Writing organized, scalable, and maintainable styles.' },
      {
        name: 'JavaScript',
        text: 'Adding functionality and interactive behavior to web applications.',
      },
      { name: 'TypeScript', text: 'Building more structured and maintainable applications.' },
      {
        name: 'Angular',
        text: 'Developing modern component-based web applications and responsive interfaces.',
      },
      { name: 'Bootstrap', text: 'Creating responsive layouts and reusable UI structures.' },
    ],
  },
  {
    id: 'back-end-development',
    number: '05',
    title: 'Back-End Development',
    icon: ICONS.server,
    intro: [
      'I also have experience with back-end technologies that allow me to understand and work with the server side of web applications.',
    ],
    skillsTitle: '',
    skills: [],
    techTitle: 'Technologies',
    technologies: [
      { name: 'Node.js', text: 'Building server-side applications and APIs.' },
      {
        name: 'Express.js',
        text: 'Creating RESTful APIs and server-side application structures.',
      },
      { name: 'MongoDB', text: 'Working with NoSQL databases and application data.' },
    ],
    flow: {
      title: 'Development Stack',
      steps: ['Angular', 'Node.js', 'Express.js', 'MongoDB'],
    },
  },
  {
    id: 'ui-web-design',
    number: '06',
    title: 'UI & Web Design',
    icon: ICONS.layout,
    intro: [
      'I combine design and development to create interfaces that are visually appealing and practical to use.',
    ],
    skillsTitle: 'Skills',
    skills: [
      'UI Design',
      'Responsive Web Design',
      'Landing Page Design',
      'Website Design',
      'User-Friendly Interfaces',
      'Component-Based UI',
      'Mobile-First Design',
      'Layout Design',
      'Visual Hierarchy',
      'Design-to-Code Implementation',
      'Website Redesign',
      'Digital Experience Design',
    ],
    techTitle: '',
    technologies: [],
  },
  {
    id: 'professional-skills',
    number: '07',
    title: 'Professional Skills',
    icon: ICONS.users,
    intro: [
      'Technical skills are only part of my work. I also rely on strong professional and communication skills.',
    ],
    skillsTitle: 'Professional Skills',
    skills: [
      'Communication',
      'Client Relationship Management',
      'Presentation Skills',
      'Negotiation',
      'Problem Solving',
      'Teamwork',
      'Time Management',
      'Adaptability',
      'Attention to Detail',
      'Creative Thinking',
      'Analytical Thinking',
      'Continuous Learning',
    ],
    techTitle: '',
    technologies: [],
  },
];
 
const TOOLKIT: ToolkitGroup[] = [
  {
    id: 'toolkit-development',
    title: 'Development',
    items: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'SCSS',
      'Bootstrap',
      'Node.js',
      'Express.js',
      'MongoDB',
    ],
  },
  {
    id: 'toolkit-design',
    title: 'Design',
    items: ['Graphic Design', 'UI Design', 'Visual Communication', 'Marketing Design'],
  },
  {
    id: 'toolkit-marketing',
    title: 'Marketing',
    items: [
      'Social Media Marketing',
      'Content Creation',
      'Content Planning',
      'Digital Marketing',
    ],
  },
  {
    id: 'toolkit-business',
    title: 'Business',
    items: [
      'Business Development',
      'Lead Generation',
      'Sales Support',
      'CRM',
      'Client Communication',
      'Negotiation',
    ],
  },
  {
    id: 'toolkit-workflow',
    title: 'Workflow',
    items: ['Git', 'GitHub', 'Responsive Design', 'Component-Based Development'],
  },
];
 
const TOGETHER_LEAD =
  'My advantage is not only having different skills, but being able to connect them together.';
 
const TOGETHER: TogetherStep[] = [
  {
    title: 'Business Development',
    parts: [{ text: 'I understand the ' }, { text: 'business goal', strong: true }, { text: '.' }],
  },
  {
    title: 'Social Media Marketing',
    parts: [
      { text: 'I understand how to ' },
      { text: 'communicate with the audience', strong: true },
      { text: '.' },
    ],
  },
  {
    title: 'Graphic Design',
    parts: [
      { text: 'I know how to ' },
      { text: 'present the message visually', strong: true },
      { text: '.' },
    ],
  },
  {
    title: 'Front-End Development',
    parts: [
      { text: 'I can turn the idea into a ' },
      { text: 'functional digital experience', strong: true },
      { text: '.' },
    ],
  },
];
 
const TOGETHER_RESULT = 'Business Understanding + Marketing + Design + Technology';
 
const JOURNEY: RichPart[][] = [
  [{ text: 'Technology, marketing, and digital business are constantly evolving.' }],
  [
    {
      text: 'I continuously work on improving my technical knowledge, design skills, business communication, and understanding of modern digital practices.',
    },
  ],
  [
    { text: 'My goal is not simply to learn more tools — it is to become better at ' },
    { text: 'solving real problems and creating meaningful results', strong: true },
    { text: '.' },
  ],
];
 
const CTA_TEXT: string[] = [
  'Have a project, business idea, or opportunity in mind?',
  "Let's discuss how my combination of business, marketing, design, and development skills can contribute to it.",
];
 
const SECTIONS: SectionLink[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'core', label: 'Core skills' },
  { id: 'toolkit', label: 'My toolkit' },
  { id: 'together', label: 'Skills together' },
  { id: 'journey', label: 'Development journey' },
  { id: 'contact', label: 'Skills into results' },
];
 
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
 
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
const totalSkills = CATEGORIES.reduce((sum, c) => sum + c.skills.length + c.technologies.length, 0);
const totalToolkit = TOOLKIT.reduce((sum, g) => sum + g.items.length, 0);
 
const STATS: Stat[] = [
  { label: 'Skill areas', value: String(CATEGORIES.length), note: 'From business to back-end' },
  {
    label: 'Skills & technologies',
    value: String(totalSkills),
    note: 'Across every area',
  },
  { label: 'Toolkit', value: String(totalToolkit), note: 'Tools and practices' },
  { label: 'Disciplines', value: '4', note: 'Business, marketing, design, code' },
];
 
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
@Component({
  selector: 'app-skills',
  imports: [],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class Skills {
private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
 
  /* ---- optional inputs (when a link is provided, the button becomes a link) ---- */
  readonly talkHref = input<string>('');
  readonly projectsHref = input<string>('');
 
  /* ---- outputs (used when no link is provided) ---- */
  readonly talk = output<void>();
  readonly viewProjects = output<void>();
 
  /* ---- static content ---- */
  readonly headline = HEADLINE;
  readonly overview = OVERVIEW;
  readonly stats = STATS;
  readonly sections = SECTIONS;
  readonly categories = CATEGORIES;
  readonly toolkit = TOOLKIT;
  readonly togetherLead = TOGETHER_LEAD;
  readonly together = TOGETHER;
  readonly togetherResult = TOGETHER_RESULT;
  readonly journey = JOURNEY;
  readonly ctaText = CTA_TEXT;
 
  /* ---- ui state ---- */
  readonly query = signal('');
  readonly categoryFilter = signal('all');
  readonly active = signal('overview');
  readonly progress = signal(0);
  readonly showTop = signal(false);
 
  /* ---- derived data ---- */
  readonly visibleCategories = computed<SkillCategory[]>(() => {
    // While searching, every area is shown so that results can always be reached.
    const filter = this.query() ? 'all' : this.categoryFilter();
    return filter === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === filter);
  });
 
  readonly matchGroups = computed<ResultGroup[]>(() => {
    const q = this.query();
    if (!q) return [];
 
    const fromCategories: ResultGroup[] = CATEGORIES.map((category) => ({
      id: category.id,
      title: `${category.number} ${category.title}`,
      items: [...category.skills, ...category.technologies.map((t) => t.name)].filter((item) =>
        item.toLowerCase().includes(q),
      ),
    }));
 
    const fromToolkit: ResultGroup[] = TOOLKIT.map((group) => ({
      id: 'toolkit',
      title: `Toolkit: ${group.title}`,
      items: group.items.filter((item) => item.toLowerCase().includes(q)),
    }));
 
    return [...fromCategories, ...fromToolkit].filter((group) => group.items.length > 0);
  });
 
  readonly matchCount = computed(() =>
    this.matchGroups().reduce((sum, group) => sum + group.items.length, 0),
  );
 
  constructor() {
    afterNextRender(() => this.initScrollSpy());
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }
 
  /* ---- template helpers ---- */
  pad(value: number): string {
    return String(value).padStart(2, '0');
  }
 
  isMatch(item: string): boolean {
    const q = this.query();
    return q.length > 0 && item.toLowerCase().includes(q);
  }
 
  setCategoryFilter(id: string): void {
    this.categoryFilter.set(id);
  }
 
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value.trim().toLowerCase());
  }
 
  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.query.set('');
    input.focus();
  }
 
  goTo(id: string, event: Event): void {
    event.preventDefault();
    const target = this.host.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }
    this.active.set(id);
  }
 
  scrollToTop(): void {
    if (typeof window.scrollTo !== 'function') return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
 
  print(): void {
    window.print();
  }
 
  onScroll(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(100, (y / max) * 100) : 0);
    this.showTop.set(y > 600);
  }
 
  /* ---- scroll spy (browser only: afterNextRender never runs on the server) ---- */
  private initScrollSpy(): void {
    this.onScroll();
    if (typeof IntersectionObserver === 'undefined') return;
 
    const targets = SECTIONS.map((s) =>
      this.host.nativeElement.querySelector<HTMLElement>(`#${s.id}`),
    ).filter((el): el is HTMLElement => el !== null);
 
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
 
    targets.forEach((el) => this.observer?.observe(el));
  }
}
