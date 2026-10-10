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
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
 
export interface NavItem {
  readonly id: string;
  readonly label: string;
}
 
export interface OfferItem {
  readonly title: string;
  readonly text: string;
  readonly linkLabel: string;
  readonly fragment: string;
}
 
export interface StepItem {
  readonly title: string;
  readonly text: string;
}
 
export interface ProjectItem {
  readonly title: string;
  readonly text: string;
  readonly tags: readonly string[];
  readonly linkLabel: string;
}
 
export interface SkillGroup {
  readonly title: string;
  readonly items: readonly string[];
}
 
/** Change these paths to match your app's routes. */
export const ROUTES = {
  about: '/about',
  services: '/services',
  experience: '/experience',
  projects: '/projects',
  contact: '/contact',
} as const;
 
/** Distance (px) the user must scroll before the back-to-top button appears. */
export const BACK_TO_TOP_THRESHOLD = 400;
 
export const NAV_ITEMS: readonly NavItem[] = [
  { id: 'top', label: 'Home' },
  { id: 'introduction', label: 'About' },
  { id: 'what-i-do', label: 'What I Do' },
  { id: 'approach', label: 'Approach' },
  { id: 'experience', label: 'Experience' },
  { id: 'featured-work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'why-work-with-me', label: 'Why Me' },
  { id: 'contact', label: 'Contact' },
];
 
export const JOURNEY: readonly string[] = [
  'Business needs',
  'Marketing',
  'Design',
  'Digital implementation',
];
 
export const OFFERS: readonly OfferItem[] = [
  {
    title: 'Business Development',
    text: 'I help businesses identify opportunities, communicate with potential clients, understand their needs, present the right solutions, and build strong professional relationships.',
    linkLabel: 'Explore Business Development',
    fragment: 'business-development',
  },
  {
    title: 'Social Media Marketing',
    text: 'I create and manage social media content that helps businesses strengthen their online presence, increase brand awareness, and connect with their target audience.',
    linkLabel: 'Explore Social Media Marketing',
    fragment: 'social-media-marketing',
  },
  {
    title: 'Graphic Design',
    text: 'I create professional visual content for social media, marketing campaigns, promotional materials, and digital platforms.',
    linkLabel: 'Explore Graphic Design',
    fragment: 'graphic-design',
  },
  {
    title: 'Front-End Development',
    text: 'I build modern, responsive, and user-friendly websites using modern front-end technologies and development practices.',
    linkLabel: 'Explore Front-End Development',
    fragment: 'front-end-development',
  },
];
 
export const APPROACH_STEPS: readonly StepItem[] = [
  { title: 'Discover', text: 'Understand the business, audience, goals, and challenges.' },
  { title: 'Plan', text: 'Define the right strategy, structure, and direction.' },
  { title: 'Create', text: 'Turn ideas into engaging content, designs, and digital experiences.' },
  { title: 'Develop', text: 'Transform approved concepts into functional and responsive digital products.' },
  { title: 'Refine', text: 'Review, improve, and optimize every detail.' },
  { title: 'Deliver', text: 'Provide a polished result that serves the original goal.' },
];
 
export const EXPERIENCE_AREAS: readonly string[] = [
  'Business Development & Sales',
  'Client Communication',
  'Social Media Marketing',
  'Graphic Design',
  'Marketing Content',
  'Front-End Development',
  'Website Design',
];
 
export const PROJECTS: readonly ProjectItem[] = [
  {
    title: 'Accurad Website',
    text: "A professional healthcare website designed and developed to present Accurad's teleradiology services and digital presence.",
    tags: ['Angular', 'TypeScript', 'SCSS', 'Responsive Design'],
    linkLabel: 'View Project',
  },
  {
    title: 'Social Media & Marketing Designs',
    text: 'Marketing and promotional designs created to strengthen brand identity and communicate products and services effectively.',
    tags: ['Graphic Design', 'Social Media', 'Marketing'],
    linkLabel: 'View Project',
  },
  {
    title: 'Front-End Projects',
    text: 'Modern responsive interfaces built with a focus on usability, structure, performance, and clean visual implementation.',
    tags: ['Angular', 'JavaScript', 'TypeScript', 'HTML', 'SCSS'],
    linkLabel: 'View Projects',
  },
];
 
export const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    title: 'Business',
    items: [
      'Business Development',
      'Lead Generation',
      'Client Communication',
      'Sales Support',
      'Negotiation',
      'CRM',
      'Relationship Management',
    ],
  },
  {
    title: 'Marketing',
    items: [
      'Social Media Marketing',
      'Content Creation',
      'Brand Awareness',
      'Campaign Support',
      'Content Planning',
    ],
  },
  {
    title: 'Design',
    items: [
      'Graphic Design',
      'Social Media Design',
      'Marketing Materials',
      'Visual Communication',
      'UI Design',
    ],
  },
  {
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
      'Git',
      'GitHub',
    ],
  },
];

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class Home {
private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
 
  protected readonly routes = ROUTES;
  protected readonly navItems = NAV_ITEMS;
  protected readonly journey = JOURNEY;
  protected readonly offers = OFFERS;
  protected readonly approachSteps = APPROACH_STEPS;
  protected readonly experienceAreas = EXPERIENCE_AREAS;
  protected readonly projects = PROJECTS;
  protected readonly skillGroups = SKILL_GROUPS;
 
  /** Reading progress, 0 to 100. */
  readonly progress = signal(0);
  /** Whether the back-to-top button is visible. */
  readonly showBackToTop = signal(false);
  /** Id of the section currently in view. */
  readonly activeId = signal<string>(NAV_ITEMS[0].id);
  /** True once the browser has rendered; enables reveal animations. */
  readonly ready = signal(false);
 
  protected readonly progressRounded = computed(() => Math.round(this.progress()));
 
  private ticking = false;
 
  constructor() {
    afterNextRender(() => {
      this.setupObservers();
      this.readScroll();
      this.ready.set(true);
    });
  }
 
  onScroll(): void {
    const win = this.document.defaultView;
    if (!win || this.ticking) {
      return;
    }
    this.ticking = true;
    win.requestAnimationFrame(() => {
      this.ticking = false;
      this.readScroll();
    });
  }
 
  /** Updates scroll-driven state. Public so it can be tested without real scrolling. */
  setScrollMetrics(scrollTop: number, scrollable: number): void {
    const ratio = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    this.progress.set(Math.min(100, Math.max(0, ratio)));
    this.showBackToTop.set(scrollTop > BACK_TO_TOP_THRESHOLD);
  }
 
  scrollToTop(): void {
    this.document.defaultView?.scrollTo({ top: 0, behavior: this.scrollBehavior() });
  }
 
  scrollToSection(id: string, event?: Event): void {
    event?.preventDefault();
    if (id === 'top') {
      this.scrollToTop();
      this.activeId.set(id);
      return;
    }
    const target = this.document.getElementById(id);
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: this.scrollBehavior(), block: 'start' });
    this.activeId.set(id);
  }
 
  print(): void {
    this.document.defaultView?.print();
  }
 
  private readScroll(): void {
    const win = this.document.defaultView;
    if (!win) {
      return;
    }
    const root = this.document.documentElement;
    const scrollTop = win.scrollY || root.scrollTop || 0;
    this.setScrollMetrics(scrollTop, root.scrollHeight - root.clientHeight);
  }
 
  private scrollBehavior(): ScrollBehavior {
    const reduce = this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    return reduce ? 'auto' : 'smooth';
  }
 
  private setupObservers(): void {
    const root = this.host.nativeElement;
    const revealEls = Array.from(root.querySelectorAll<HTMLElement>('.reveal'));
    const sectionEls = Array.from(root.querySelectorAll<HTMLElement>('[data-section]'));
 
    if (typeof IntersectionObserver === 'undefined') {
      revealEls.forEach((el) => el.classList.add('is-visible'));
      return;
    }
 
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    revealEls.forEach((el) => revealObserver.observe(el));
 
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            this.activeId.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -60% 0px', threshold: 0 },
    );
    sectionEls.forEach((el) => sectionObserver.observe(el));
 
    this.destroyRef.onDestroy(() => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    });
  }
}
