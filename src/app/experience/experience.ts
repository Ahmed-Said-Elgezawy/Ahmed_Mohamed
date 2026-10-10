import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
 
/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */
 
interface ExperienceGroup {
  id: string;
  title: string;
  icon: string; // SVG path data (24x24, stroke based)
  items: string[];
}
 
interface ExperienceRole {
  id: string;
  title: string;
  company: string;
  location: string;
  period: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM
  summary: string;
  groups: ExperienceGroup[];
}
 
interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: string[];
}
 
interface SectionLink {
  id: string;
  label: string;
}
 
interface StrengthTile {
  label: string;
  icon: string;
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
  layers: 'm12 2 10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5',
  list: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01',
} as const;
 
/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
 
const ROLES: ExperienceRole[] = [
  {
    id: 'accurad',
    title: 'Business Development & Social Media Specialist & Graphic Designer',
    company: 'Accurad Teleradiology Solutions',
    location: 'Cairo, Egypt',
    period: 'Sep 2025 – Sep 2026',
    start: '2025-09',
    end: '2026-09',
    summary:
      "Worked across business development, sales support, social media marketing, graphic design, and digital presence to support the company's growth and strengthen its position in the teleradiology market.",
    groups: [
      {
        id: 'accurad-bd',
        title: 'Business Development & Sales',
        icon: ICONS.briefcase,
        items: [
          "Communicated directly with radiology centers, managers, doctors, and decision-makers to introduce the company's teleradiology services and understand their business needs.",
          'Identified potential clients and supported lead generation and prospecting activities.',
          "Presented the company's services, explained their key benefits, and communicated their value based on each client's needs.",
          'Built and maintained professional relationships with radiology center managers, representatives, and potential clients.',
          'Handled client questions and objections and provided appropriate information to support the sales process.',
          'Negotiated with potential clients and supported the conversion of qualified prospects into contracted customers.',
          'Followed up with potential and existing clients to maintain strong business relationships and support customer satisfaction.',
          'Supported sales activities from initial communication and service presentation through follow-up and relationship management.',
          'Maintained and organized customer and prospect information using CRM-oriented workflows.',
        ],
      },
      {
        id: 'accurad-smm',
        title: 'Social Media Marketing',
        icon: ICONS.megaphone,
        items: [
          "Planned and created marketing content to promote the company's services across social media platforms.",
          'Created promotional content designed to increase brand awareness and attract potential customers.',
          'Contributed to social media marketing campaigns and promotional activities.',
          "Developed content ideas based on the company's services, target audience, and marketing objectives.",
          "Supported the company's digital presence by combining business knowledge with marketing and visual communication.",
          'Helped communicate complex healthcare and teleradiology services in a clear and accessible way for potential clients.',
        ],
      },
      {
        id: 'accurad-gd',
        title: 'Graphic Design & Visual Communication',
        icon: ICONS.pen,
        items: [
          "Created marketing designs and promotional materials for the company's services.",
          "Designed social media creatives and visual content aligned with the company's brand identity.",
          'Developed visual concepts for marketing campaigns and promotional activities.',
          'Combined typography, layouts, colors, imagery, and branding elements to create professional marketing materials.',
          'Used design tools to transform marketing ideas and business objectives into clear visual content.',
        ],
      },
      {
        id: 'accurad-fe',
        title: 'Front-End Development & Web Design',
        icon: ICONS.code,
        items: [
          "Designed and developed the company's website to create a professional, responsive, and user-friendly online presence.",
          'Translated business and marketing requirements into practical website structures and user interfaces.',
          'Built responsive interfaces optimized for desktop, tablet, and mobile devices.',
          'Applied modern front-end development practices to create clean, scalable, and maintainable interfaces.',
          'Focused on user experience, visual consistency, responsive layouts, accessibility, and performance.',
          "Integrated the company's branding, services, content, and marketing objectives into the website experience.",
          'Combined development, design, and marketing knowledge to create a website that supports both brand communication and business objectives.',
        ],
      },
      {
        id: 'accurad-cf',
        title: 'Cross-Functional Contribution',
        icon: ICONS.layers,
        items: [
          "Combined Business Development, Sales, Social Media Marketing, Graphic Design, and Front-End Development skills to support the company's growth.",
          'Connected business requirements with marketing strategies, visual communication, and digital experiences.',
          "Contributed across multiple stages of the customer journey, from attracting potential clients and communicating with prospects to presenting services and strengthening the company's online presence.",
          'Worked across both commercial and technical aspects of the business, allowing marketing and development decisions to be aligned with business objectives.',
        ],
      },
    ],
  },
  {
    id: 'freelance',
    title: 'Freelance Front-End Developer & Web Designer',
    company: 'Self-Employed',
    location: 'Cairo, Egypt',
    period: 'Jul 2025 – Sep 2025',
    start: '2025-07',
    end: '2025-09',
    summary:
      'Worked independently with clients to design and develop responsive, modern, and user-focused web experiences.',
    groups: [
      {
        id: 'freelance-main',
        title: 'Key responsibilities',
        icon: ICONS.list,
        items: [
          'Built high-performance, responsive, and user-centric web applications for various clients.',
          'Transformed client concepts, requirements, and UI designs into clean and scalable front-end implementations.',
          'Developed modern interfaces using Angular, HTML5, CSS3, JavaScript, and TypeScript.',
          'Created reusable components and structured front-end architectures to improve scalability and maintainability.',
          'Converted design concepts into responsive layouts optimized for desktop, tablet, and mobile devices.',
          'Focused on creating intuitive user experiences with clear visual hierarchy, responsive interactions, and consistent design systems.',
          'Managed the development lifecycle from initial layout planning and component structuring to testing, refinement, and deployment.',
          'Managed GitHub repositories and maintained organized version-control workflows.',
          'Deployed completed web projects and ensured that the final interfaces were functional and production-ready.',
          'Communicated with clients to understand requirements, discuss design decisions, collect feedback, and deliver solutions aligned with their objectives.',
          'Combined web development and visual design skills to deliver complete digital experiences rather than isolated UI components.',
        ],
      },
    ],
  },
];
 
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'skills-bd',
    title: 'Business Development',
    icon: ICONS.briefcase,
    skills: [
      'Lead Generation',
      'Prospecting',
      'Client Communication',
      'Sales Presentation',
      'Negotiation',
      'Follow-up',
      'Relationship Management',
      'CRM',
    ],
  },
  {
    id: 'skills-smm',
    title: 'Social Media Marketing',
    icon: ICONS.megaphone,
    skills: [
      'Content Creation',
      'Social Media Management',
      'Marketing Campaigns',
      'Brand Awareness',
      'Promotional Content',
      'Digital Marketing',
    ],
  },
  {
    id: 'skills-gd',
    title: 'Graphic Design',
    icon: ICONS.pen,
    skills: [
      'Social Media Design',
      'Marketing Creatives',
      'Promotional Materials',
      'Visual Communication',
      'Brand Identity',
      'Canva',
    ],
  },
  {
    id: 'skills-fe',
    title: 'Front-End Development',
    icon: ICONS.code,
    skills: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'SCSS',
      'Bootstrap',
      'Responsive Design',
      'UI Development',
      'GitHub',
      'Deployment',
    ],
  },
];
 
const SECTIONS: SectionLink[] = [
  { id: 'summary', label: 'Overview' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Core experience' },
  { id: 'strength', label: 'Professional strength' },
];
 
const STRENGTH: StrengthTile[] = [
  { label: 'Business', icon: ICONS.briefcase },
  { label: 'Marketing', icon: ICONS.megaphone },
  { label: 'Design', icon: ICONS.pen },
  { label: 'Technology', icon: ICONS.code },
];
 
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
 
const monthIndex = (ym: string): number => {
  const [year, month] = ym.split('-').map(Number);
  return year * 12 + (month - 1);
};
 
const formatMonths = (total: number): string => {
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (months) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
  return parts.join(' ') || '< 1 mo';
};
 
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-experience',
  imports: [],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:beforeprint)': 'printing.set(true)',
    '(window:afterprint)': 'printing.set(false)',
  },
})
export class Experience {
private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;
 
  /* ---- static data ---- */
  readonly sections = SECTIONS;
  readonly skillCategories = SKILL_CATEGORIES;
  readonly strength = STRENGTH;
 
  /* ---- ui state ---- */
  readonly query = signal('');
  readonly openGroups = signal<ReadonlySet<string>>(new Set(['accurad-bd', 'freelance-main']));
  readonly active = signal('summary');
  readonly progress = signal(0);
  readonly showTop = signal(false);
  readonly printing = signal(false);
 
  /* ---- derived data ---- */
  readonly filteredRoles = computed<ExperienceRole[]>(() => {
    const q = this.query();
    if (!q) return ROLES;
 
    return ROLES.map((role) => ({
      ...role,
      groups: role.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.toLowerCase().includes(q)),
        }))
        .filter((group) => group.items.length > 0),
    })).filter((role) => role.groups.length > 0);
  });
 
  readonly visibleCount = computed(() =>
    this.filteredRoles().reduce(
      (sum, role) => sum + role.groups.reduce((s, g) => s + g.items.length, 0),
      0,
    ),
  );
 
  readonly stats = (() => {
    const totalItems = ROLES.reduce(
      (sum, role) => sum + role.groups.reduce((s, g) => s + g.items.length, 0),
      0,
    );
    const first = Math.min(...ROLES.map((r) => monthIndex(r.start)));
    const last = Math.max(...ROLES.map((r) => monthIndex(r.end)));
    return [
      { label: 'Roles', value: String(ROLES.length), note: 'Employment and freelance' },
      {
        label: 'Disciplines',
        value: String(SKILL_CATEGORIES.length),
        note: 'Business, marketing, design, code',
      },
      { label: 'Time span', value: formatMonths(last - first), note: 'Jul 2025 – Sep 2026' },
      { label: 'Responsibilities', value: String(totalItems), note: 'Across both roles' },
    ];
  })();
 
  constructor() {
    afterNextRender(() => this.initScrollSpy());
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }
 
  /* ---- template helpers ---- */
  duration(role: ExperienceRole): string {
    return formatMonths(monthIndex(role.end) - monthIndex(role.start));
  }
 
  isOpen(groupId: string): boolean {
    return this.query().length > 0 || this.printing() || this.openGroups().has(groupId);
  }
 
  toggle(groupId: string): void {
    this.openGroups.update((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }
 
  expandAll(): void {
    this.openGroups.set(new Set(ROLES.flatMap((r) => r.groups.map((g) => g.id))));
  }
 
  collapseAll(): void {
    this.openGroups.set(new Set());
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
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    this.active.set(id);
  }
 
  scrollToTop(): void {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
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
    this.onScroll();
  }
}
