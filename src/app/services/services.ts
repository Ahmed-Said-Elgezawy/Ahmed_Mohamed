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
 
interface Step {
  title: string;
  text: string;
}
 
interface Flow {
  title: string;
  lead: string[];
  steps: string[];
}
 
interface Service {
  id: string;
  number: string;
  title: string;
  headline: string;
  icon: string; // SVG path data (24x24, stroke based)
  intro: string[];
  help: string[];
  technologies?: string[];
  principles?: { lead: string[]; items: Step[] };
  process?: { title: string; steps: Step[] };
  bestFor?: string[];
  flow?: Flow;
  pillars?: Step[];
  result?: { label: string; text: string };
}
 
interface SectionLink {
  id: string;
  label: string;
}
 
interface ResultGroup {
  id: string;
  number: string;
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
  layout: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M3 9h18 M9 21V9',
  layers: 'm12 2 10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5',
} as const;
 
/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
 
const OVERVIEW: string[] = [
  'I provide a combination of business, marketing, design, and technology services that help businesses build a stronger presence, communicate their value, and create effective digital experiences.',
  'By combining strategic thinking with creative and technical skills, I help transform ideas into practical solutions that support both business objectives and customer needs.',
];
 
const SERVICES: Service[] = [
  {
    id: 'business-development',
    number: '01',
    title: 'Business Development',
    headline: 'Turning Opportunities Into Business Relationships',
    icon: ICONS.briefcase,
    intro: [
      'I help businesses identify potential opportunities, connect with the right prospects, communicate their value effectively, and build long-term professional relationships.',
      "My approach focuses on understanding the client's needs first, then presenting the right solution rather than simply selling a product or service.",
    ],
    help: [
      'Lead Generation & Prospecting',
      'Potential Client Identification',
      'Client Communication',
      'Business-to-Business (B2B) Outreach',
      'Product & Service Presentation',
      'Needs Discovery',
      'Sales Follow-up',
      'Objection Handling',
      'Negotiation Support',
      'Customer Relationship Management',
      'Prospect & Client Follow-up',
      'Business Relationship Building',
    ],
    process: {
      title: 'My Process',
      steps: [
        {
          title: 'Research',
          text: 'Understand the target market, industry, audience, and potential opportunities.',
        },
        {
          title: 'Prospecting',
          text: 'Identify and reach out to potential clients and decision-makers.',
        },
        {
          title: 'Communication',
          text: 'Understand their needs, challenges, and business requirements.',
        },
        {
          title: 'Presentation',
          text: 'Present the appropriate product or service and communicate its value clearly.',
        },
        {
          title: 'Follow-up',
          text: 'Maintain communication, answer questions, handle objections, and move qualified prospects forward.',
        },
        {
          title: 'Relationship Building',
          text: 'Build professional relationships that can develop into long-term business opportunities.',
        },
      ],
    },
    bestFor: [
      'B2B Businesses',
      'Startups',
      'Service-Based Companies',
      'Healthcare Businesses',
      'Technology Companies',
      'Companies Looking to Expand Their Client Base',
    ],
  },
  {
    id: 'social-media-marketing',
    number: '02',
    title: 'Social Media Marketing',
    headline: 'Building a Stronger Digital Presence',
    icon: ICONS.megaphone,
    intro: [
      'I help businesses communicate their products and services through strategic social media content designed to increase visibility, strengthen brand awareness, and reach potential customers.',
      'My approach combines marketing objectives with visual communication to create content that is not only attractive but also purposeful.',
    ],
    help: [
      'Social Media Strategy',
      'Content Planning',
      'Content Ideas & Development',
      'Social Media Posts',
      'Promotional Content',
      'Brand Awareness Campaigns',
      'Product & Service Promotion',
      'Audience Research',
      'Content Calendars',
      'Social Media Management',
      'Campaign Support',
      'Marketing Communication',
    ],
    process: {
      title: 'My Process',
      steps: [
        {
          title: 'Understand',
          text: 'Understand the business, products, services, target audience, and marketing objectives.',
        },
        {
          title: 'Plan',
          text: 'Develop content directions and promotional ideas based on the business goals.',
        },
        {
          title: 'Create',
          text: 'Produce engaging visual and written content aligned with the brand identity.',
        },
        {
          title: 'Publish',
          text: 'Prepare and publish content across relevant social media platforms.',
        },
        {
          title: 'Improve',
          text: 'Review content performance and identify opportunities to improve future campaigns.',
        },
      ],
    },
    flow: {
      title: 'The Goal',
      lead: [
        'The objective is not simply to publish more content.',
        'It is to create content that helps businesses:',
      ],
      steps: ['Get Attention', 'Build Trust', 'Communicate Value', 'Reach Potential Customers'],
    },
  },
  {
    id: 'graphic-design',
    number: '03',
    title: 'Graphic Design',
    headline: 'Visuals That Communicate Your Brand',
    icon: ICONS.pen,
    intro: [
      'I create professional visual content that helps businesses communicate their identity, products, and services clearly and consistently.',
      'From social media creatives to promotional materials, I focus on creating designs that combine visual appeal with a clear communication purpose.',
    ],
    help: [
      'Social Media Designs',
      'Marketing Creatives',
      'Promotional Materials',
      'Advertising Designs',
      'Digital Marketing Visuals',
      'Brand Visuals',
      'Visual Content',
      'Typography & Layout',
      'Color & Visual Composition',
      'Presentation Graphics',
      'Campaign Creatives',
      'Basic Brand Identity Materials',
    ],
    principles: {
      lead: ['Every design should have a purpose.', 'I focus on:'],
      items: [
        { title: 'Clear Communication', text: 'The audience should understand the message quickly.' },
        {
          title: 'Visual Hierarchy',
          text: 'Important information should receive the right level of attention.',
        },
        {
          title: 'Brand Consistency',
          text: 'Visual content should feel connected to the overall brand identity.',
        },
        {
          title: 'Professional Presentation',
          text: 'Design should build credibility and create a positive impression.',
        },
      ],
    },
    flow: {
      title: 'Design Workflow',
      lead: [],
      steps: [
        'Brief',
        'Concept',
        'Visual Direction',
        'Design',
        'Feedback',
        'Refinement',
        'Final Delivery',
      ],
    },
  },
  {
    id: 'front-end-development',
    number: '04',
    title: 'Front-End Development',
    headline: 'Turning Designs Into Digital Experiences',
    icon: ICONS.code,
    intro: [
      'I design and develop responsive, modern, and user-focused web interfaces that transform ideas and designs into functional digital experiences.',
      'I focus on clean structure, responsive behavior, usability, visual consistency, and maintainable code.',
    ],
    help: [
      'Portfolio Websites',
      'Business Websites',
      'Landing Pages',
      'Responsive Websites',
      'Front-End Web Applications',
      'UI Implementation',
      'Website Redesign',
      'Interactive User Interfaces',
      'Component-Based Development',
      'Responsive Layouts',
      'Website Deployment',
    ],
    technologies: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'SCSS',
      'Bootstrap',
      'Git & GitHub',
    ],
    process: {
      title: 'My Development Process',
      steps: [
        {
          title: 'Understand',
          text: 'Understand the project goals, target users, requirements, and business objectives.',
        },
        {
          title: 'Structure',
          text: 'Plan the page structure, components, content hierarchy, and responsive behavior.',
        },
        { title: 'Design', text: 'Create or refine the visual direction and user interface.' },
        {
          title: 'Develop',
          text: 'Transform the design into a responsive and interactive web experience.',
        },
        {
          title: 'Test',
          text: 'Check responsiveness, usability, interactions, and overall visual consistency.',
        },
        {
          title: 'Deploy',
          text: 'Prepare and deploy the final website and manage the project repository.',
        },
      ],
    },
  },
  {
    id: 'website-design',
    number: '05',
    title: 'Website Design & UI Implementation',
    headline: 'From Concept to Interface',
    icon: ICONS.layout,
    intro: [
      'Beyond writing code, I can help transform ideas, wireframes, and visual concepts into polished web interfaces.',
      'I combine design thinking with front-end development to ensure that the final interface remains faithful to the visual concept while providing a smooth user experience.',
    ],
    help: [
      'Website Layout Design',
      'UI Design',
      'Responsive UI',
      'Component Design',
      'Design-to-Code',
      'Landing Page Design',
      'Portfolio Design',
      'Website Redesign',
      'Visual Hierarchy',
      'User-Friendly Interfaces',
      'Mobile-First Layouts',
    ],
  },
  {
    id: 'digital-presence',
    number: '06',
    title: 'Digital Presence',
    headline: 'Connecting Business, Marketing, Design & Technology',
    icon: ICONS.layers,
    intro: [
      'One of my strongest capabilities is combining my four areas of experience into one integrated approach.',
      'Instead of looking at a business website, social media presence, visual identity, and customer communication as separate elements, I can help connect them into a consistent digital presence.',
    ],
    help: [],
    pillars: [
      { title: 'Business Development', text: 'Understand the customer and business opportunity.' },
      { title: 'Marketing', text: 'Communicate the right message to the right audience.' },
      {
        title: 'Graphic Design',
        text: 'Present the message through professional visual communication.',
      },
      {
        title: 'Front-End Development',
        text: 'Turn the brand and message into a functional digital experience.',
      },
    ],
    result: {
      label: 'Strategy + Marketing + Design + Technology',
      text: 'A more consistent and professional digital presence built around the actual goals of the business.',
    },
  },
];
 
const WHY = {
  title: 'Why Work With Me?',
  headline: 'One Perspective. Multiple Skills.',
  paragraphs: [
    'Working with someone who understands different sides of a project can make communication and execution more efficient.',
    'I can understand a business requirement from a commercial perspective, translate it into a marketing message, turn that message into visual content, and then build a digital interface around it.',
  ],
  bringTitle: 'What I Bring',
  bring: [
    'Business-oriented thinking',
    'Strong client communication',
    'Marketing awareness',
    'Visual design skills',
    'Front-end development experience',
    'User-focused approach',
    'Cross-functional problem solving',
    'Attention to detail',
    'Ability to work across multiple disciplines',
  ],
};
 
const HOW = {
  title: 'How I Work',
  headline: 'A Simple Process',
  steps: [
    {
      title: 'Discover',
      text: 'We start by understanding your business, goals, audience, and requirements.',
    },
    { title: 'Define', text: 'We identify the right direction, priorities, and deliverables.' },
    {
      title: 'Create',
      text: 'I develop the strategy, visual direction, content, design, or digital solution depending on the project.',
    },
    {
      title: 'Refine',
      text: 'We review the work, collect feedback, and improve the final result.',
    },
    {
      title: 'Deliver',
      text: 'The completed solution is prepared for implementation, publication, or deployment.',
    },
  ] as Step[],
};
 
const CTA = {
  title: "Let's Work Together",
  paragraphs: [
    'Have a business idea, digital project, marketing challenge, or website you want to build?',
    "Let's turn your idea into a clear, professional, and effective digital experience.",
  ],
};
 
const SECTIONS: SectionLink[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'business-development', label: 'Business Development' },
  { id: 'social-media-marketing', label: 'Social Media Marketing' },
  { id: 'graphic-design', label: 'Graphic Design' },
  { id: 'front-end-development', label: 'Front-End Development' },
  { id: 'website-design', label: 'Website Design' },
  { id: 'digital-presence', label: 'Digital Presence' },
  { id: 'why-me', label: 'Why work with me' },
  { id: 'how-i-work', label: 'How I work' },
  { id: 'contact', label: "Let's work together" },
];
 
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
 
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class Services {
private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
 
  /* ---- optional inputs (when a link is provided, the button becomes a link) ---- */
  readonly talkHref = input<string>('');
  readonly projectHref = input<string>('');
 
  /* ---- outputs (used when no link is provided) ---- */
  readonly talk = output<void>();
  readonly startProject = output<void>();
 
  /* ---- static content ---- */
  readonly sections = SECTIONS;
  readonly overview = OVERVIEW;
  readonly services = SERVICES;
  readonly why = WHY;
  readonly how = HOW;
  readonly cta = CTA;
 
  /* ---- ui state ---- */
  readonly query = signal('');
  readonly active = signal('overview');
  readonly progress = signal(0);
  readonly showTop = signal(false);
 
  /* ---- derived data ---- */
  readonly matchGroups = computed<ResultGroup[]>(() => {
    const q = this.query();
    if (!q) return [];
    return SERVICES.map((service) => ({
      id: service.id,
      number: service.number,
      title: service.title,
      items: service.help.filter((item) => item.toLowerCase().includes(q)),
    })).filter((group) => group.items.length > 0);
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
