import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
 
/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */
 
interface AreaCard {
  id: string;
  title: string;
  icon: string; // SVG path data (24x24, stroke based)
  text: string;
  tags: string[];
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
} as const;
 
/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */
 
const FULL_NAME = 'Ahmed Elgizawy';
 
const WHO: string[] = [
  'I’m Ahmed Elgizawy, a multidisciplinary professional with experience across Business Development, Social Media Marketing, Graphic Design, and Front-End Development.',
  'My professional journey has allowed me to work at the intersection of business, marketing, design, and technology, giving me a broader perspective on how digital products and services can be presented, marketed, and developed effectively.',
];
 
const WHAT_INTRO = 'I work across four complementary areas:';
 
const AREAS: AreaCard[] = [
  {
    id: 'area-bd',
    title: 'Business Development',
    icon: ICONS.briefcase,
    text: 'I communicate with potential clients, understand their needs, present solutions, handle objections, build professional relationships, and support the sales process from initial contact to follow-up.',
    tags: [],
  },
  {
    id: 'area-smm',
    title: 'Social Media Marketing',
    icon: ICONS.megaphone,
    text: 'I create and manage marketing content, develop promotional ideas, and help businesses strengthen their online presence, increase brand awareness, and reach potential customers.',
    tags: [],
  },
  {
    id: 'area-gd',
    title: 'Graphic Design',
    icon: ICONS.pen,
    text: "I create visual content and marketing materials that communicate ideas clearly while maintaining consistency with a company's visual identity and brand objectives.",
    tags: [],
  },
  {
    id: 'area-fe',
    title: 'Front-End Development',
    icon: ICONS.code,
    text: 'I design and develop responsive, user-friendly web interfaces using modern technologies such as Angular, TypeScript, JavaScript, HTML5, CSS3, and SCSS.',
    tags: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'SCSS'],
  },
];
 
const APPROACH_LEAD =
  'What makes my approach different is the ability to look at a project from more than one perspective.';
 
const APPROACH: string[] = [
  'I don’t see a website as just code, a design as just visuals, or marketing as just content. I believe successful digital experiences come from connecting business objectives, customer needs, visual communication, marketing strategy, and technology.',
  'This allows me to understand the purpose behind a project and turn ideas into practical digital experiences that are both visually engaging and aligned with business goals.',
];
 
const APPROACH_CONNECTS: string[] = [
  'Business objectives',
  'Customer needs',
  'Visual communication',
  'Marketing strategy',
  'Technology',
];
 
const BRING: string[] = [
  'I bring a combination of commercial thinking, creative problem-solving, visual communication, and technical development.',
  "Whether the goal is to attract new customers, strengthen a brand's digital presence, create engaging marketing content, or build a modern web experience, I can contribute from both the business and technical sides.",
];
 
const BRING_TAGS: string[] = [
  'Commercial thinking',
  'Creative problem-solving',
  'Visual communication',
  'Technical development',
];
 
const BEYOND: string[] = [
  'My experience is not limited to a single career path.',
  'I have developed my skills across multiple disciplines because I believe that understanding how different parts of a business work together creates better results.',
];
 
const BEYOND_CLOSING = 'Four different disciplines — one integrated perspective.';
 
const BUILD_TITLE = "Let's Build Something Meaningful";
 
const BUILD_TEXT =
  'I’m always interested in working on projects where business ideas, creativity, and technology come together to create meaningful digital experiences and measurable value.';
 
const STRENGTH: StrengthTile[] = [
  { label: 'Business', icon: ICONS.briefcase },
  { label: 'Marketing', icon: ICONS.megaphone },
  { label: 'Design', icon: ICONS.pen },
  { label: 'Technology', icon: ICONS.code },
];
 
const SECTIONS: SectionLink[] = [
  { id: 'who', label: 'Who I am' },
  { id: 'what', label: 'What I do' },
  { id: 'approach', label: 'My approach' },
  { id: 'bring', label: 'What I bring' },
  { id: 'beyond', label: 'Beyond the title' },
  { id: 'build', label: "Let's build" },
];
 
/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
 
const WORDS_PER_MINUTE = 200;

/** How long (ms) the scroll spy is paused after a click on a nav link. */
const NAV_LOCK_MS = 900;

/** Distance (px) from the page bottom that counts as "reached the end". */
const BOTTOM_THRESHOLD = 2;

const LAST_SECTION_ID = SECTIONS[SECTIONS.length - 1].id;
 
const countWords = (text: string): number => text.split(/\s+/).filter(Boolean).length;
 
const READING_MINUTES = (() => {
  const all = [
    ...WHO,
    WHAT_INTRO,
    ...AREAS.map((a) => `${a.title} ${a.text}`),
    APPROACH_LEAD,
    ...APPROACH,
    ...BRING,
    ...BEYOND,
    BEYOND_CLOSING,
    BUILD_TITLE,
    BUILD_TEXT,
  ];
  const words = all.reduce((sum, text) => sum + countWords(text), 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
})();
 
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
  },
})

export class About {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  /** Timestamp until which the scroll spy must not override `active` (set by goTo). */
  private navLockUntil = 0;
 
  /* ---- optional inputs (links are rendered only when provided) ---- */
  readonly contactHref = input<string>('');
  readonly experienceHref = input<string>('');
 
  /* ---- static content ---- */
  readonly fullName = FULL_NAME;
  readonly initials = FULL_NAME.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  readonly readingMinutes = READING_MINUTES;
  readonly sections = SECTIONS;
  readonly who = WHO;
  readonly whatIntro = WHAT_INTRO;
  readonly areas = AREAS;
  readonly approachLead = APPROACH_LEAD;
  readonly approach = APPROACH;
  readonly approachConnects = APPROACH_CONNECTS;
  readonly bring = BRING;
  readonly bringTags = BRING_TAGS;
  readonly beyond = BEYOND;
  readonly beyondClosing = BEYOND_CLOSING;
  readonly strength = STRENGTH;
  readonly buildTitle = BUILD_TITLE;
  readonly buildText = BUILD_TEXT;
    protected readonly progressRounded = computed(() => Math.round(this.progress()));
 
  /* ---- ui state ---- */
  readonly active = signal('who');
  readonly progress = signal(0);
  readonly showTop = signal(false);
 
  constructor() {
    afterNextRender(() => this.initScrollSpy());
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }
 
  goTo(id: string, event: Event): void {
    event.preventDefault();
    const target = this.host.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;

    const reduced = prefersReducedMotion();

    // Pause the scroll spy while the smooth scroll passes through
    // intermediate sections, so the nav does not flicker.
    this.navLockUntil = reduced ? 0 : Date.now() + NAV_LOCK_MS;

    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
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

    // Clamp to [0, 100]: scrollY can be negative on iOS (rubber-band effect).
    this.progress.set(max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0);
    this.showTop.set(y > 600);

    // The last section is often too short to reach the observer's narrow band,
    // so when the user hits the bottom of the page we activate it explicitly.
    if (max > 0 && y >= max - BOTTOM_THRESHOLD && !this.isNavLocked()) {
      this.active.set(LAST_SECTION_ID);
    }
  }

  private isNavLocked(): boolean {
    return Date.now() < this.navLockUntil;
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
        if (this.isNavLocked()) return;
        for (const entry of entries) {
          if (entry.isIntersecting) this.active.set(entry.target.id);
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    );
 
    targets.forEach((el) => this.observer?.observe(el));
  }
}