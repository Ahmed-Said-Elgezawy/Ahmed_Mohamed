import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */

export interface GraphicDesignProject {
  id: string;
  /** Project name shown on the card. */
  name: string;
  /** Year the project was completed. */
  year: number;
  /** Kind of project, used for the type filter (e.g. "Brand Identity"). */
  type: string;
  description: string;
  /** Skills and tools used. */
  tags: string[];
  /** Project image path or URL. Leave empty (or let it fail to load) to show the placeholder. */
  image: string;
  imageAlt: string;
  featured?: boolean;
  /** Optional links. A button is shown only when the link is provided. */
  liveUrl?: string;
  repoUrl?: string;
}

type SortMode = 'newest' | 'oldest' | 'az';
type ViewMode = 'grid' | 'large';

interface HighlightPart {
  text: string;
  match: boolean;
}

interface TypeChip {
  value: string;
  label: string;
  count: number;
}

/* ------------------------------------------------------------------ */
/*  Sample content: replace with your real projects                    */
/*  (images are looked up at assets/projects/graphic-design/<id>.webp; when */
/*  a file is missing the card shows a neutral placeholder instead)    */
/* ------------------------------------------------------------------ */

const IMAGE_BASE = 'assets/projects/graphic-design';

const SAMPLE_PROJECTS: GraphicDesignProject[] = [
  {
    id: 'lumina-brand-identity',
    name: 'Lumina Brand Identity',
    year: 2026,
    type: 'Brand Identity',
    description:
      'A complete visual identity: logo, color system, typography, and a concise set of brand guidelines that keep every touchpoint consistent.',
    tags: ['Logo Design', 'Typography', 'Color System', 'Brand Guidelines'],
    image: `${IMAGE_BASE}/lumina-brand-identity.webp`,
    imageAlt: 'Preview of the Lumina brand identity: logo and color palette',
    featured: true,
  },
  {
    id: 'pulse-social-campaign',
    name: 'Pulse Social Media Campaign',
    year: 2026,
    type: 'Social Media Design',
    description:
      'A cohesive set of social media creatives built around one visual idea, designed to be recognised instantly in a busy feed.',
    tags: ['Social Media Design', 'Campaign Creatives', 'Content Design', 'Canva'],
    image: `${IMAGE_BASE}/pulse-social-campaign.webp`,
    imageAlt: 'Preview of the Pulse social media campaign posts',
    featured: true,
  },
  {
    id: 'nimbus-launch-creatives',
    name: 'Nimbus Product Launch Creatives',
    year: 2026,
    type: 'Advertising Creatives',
    description:
      'Banners, digital ads, and promotional visuals for a product launch, adapted to each platform while keeping one clear message.',
    tags: ['Advertising Designs', 'Digital Marketing Visuals', 'Banners', 'Campaign Creatives'],
    image: `${IMAGE_BASE}/nimbus-launch-creatives.webp`,
    imageAlt: 'Preview of the Nimbus product launch banners and ads',
  },
  {
    id: 'atlas-annual-report',
    name: 'Atlas Annual Report Layout',
    year: 2026,
    type: 'Print & Layout',
    description:
      'An editorial layout that turns dense information into a calm, scannable report with strong hierarchy and generous spacing.',
    tags: ['Layout & Composition', 'Typography', 'Data Presentation', 'Print Design'],
    image: `${IMAGE_BASE}/atlas-annual-report.webp`,
    imageAlt: 'Preview of two spreads from the Atlas annual report',
  },
  {
    id: 'horizon-event-posters',
    name: 'Horizon Event Poster Series',
    year: 2025,
    type: 'Print & Layout',
    description:
      'A series of event posters where bold typography and a restrained palette carry the message from a distance.',
    tags: ['Poster Design', 'Typography', 'Visual Hierarchy', 'Print Design'],
    image: `${IMAGE_BASE}/horizon-event-posters.webp`,
    imageAlt: 'Preview of the Horizon event poster series',
    featured: true,
  },
  {
    id: 'verde-packaging-concept',
    name: 'Verde Packaging Concept',
    year: 2025,
    type: 'Packaging Design',
    description:
      'A packaging concept that pairs a clear visual direction with practical layout decisions for shelf impact and readability.',
    tags: ['Packaging', 'Visual Direction', 'Color & Visual Balance', 'Brand Visuals'],
    image: `${IMAGE_BASE}/verde-packaging-concept.webp`,
    imageAlt: 'Preview of the Verde packaging concept',
  },
  {
    id: 'mosaic-presentation-template',
    name: 'Mosaic Presentation Template',
    year: 2025,
    type: 'Presentation Design',
    description:
      'A flexible slide template with consistent layouts, clear data slides, and an easy structure for teams to reuse.',
    tags: ['Presentation Design', 'Slide Layouts', 'Infographics', 'Brand Consistency'],
    image: `${IMAGE_BASE}/mosaic-presentation-template.webp`,
    imageAlt: 'Preview of slides from the Mosaic presentation template',
  },
  {
    id: 'cedar-cafe-menu',
    name: 'Cedar Cafe Menu & Signage',
    year: 2025,
    type: 'Print & Layout',
    description:
      'A menu and signage system with clean typography and clear sections, designed to be read quickly and printed reliably.',
    tags: ['Menu Design', 'Signage', 'Typography', 'Print Design'],
    image: `${IMAGE_BASE}/cedar-cafe-menu.webp`,
    imageAlt: 'Preview of the Cedar Cafe menu and signage',
  },
  {
    id: 'echo-awareness-posts',
    name: 'Echo Healthcare Awareness Posts',
    year: 2025,
    type: 'Social Media Design',
    description:
      'Clear, friendly infographics and posts that explain healthcare topics simply while staying consistent with the brand.',
    tags: ['Social Media Design', 'Infographics', 'Healthcare Communication', 'Brand Consistency'],
    image: `${IMAGE_BASE}/echo-awareness-posts.webp`,
    imageAlt: 'Preview of the Echo healthcare awareness posts',
  },
];

const PAGE_SIZE = 6;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-graphic',
  imports:[],
  templateUrl: './graphic.html',
  styleUrl: './graphic.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class GraphicDesign {
  private readonly router = inject(Router);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /* ---- inputs ---- */
  /** The projects to show. Defaults to the sample data above. */
  readonly projects = input<GraphicDesignProject[]>(SAMPLE_PROJECTS);
  /** Path of the projects overview page (used by the breadcrumb and the back button). */
  readonly backPath = input<string>('/Projects');
  /** Optional contact link for the closing call to action. */
  readonly contactHref = input<string>('');

  /* ---- outputs ---- */
  /** Emits the id of the project whose card was pressed (hook for a details page). */
  readonly projectSelected = output<string>();
  readonly talk = output<void>();

  /* ---- ui state ---- */
  readonly query = signal('');
  readonly type = signal('all');
  readonly year = signal('all');
  readonly sort = signal<SortMode>('newest');
  readonly view = signal<ViewMode>('grid');
  readonly featuredOnly = signal(false);
  readonly shown = signal(PAGE_SIZE);
  readonly failedImages = signal<ReadonlySet<string>>(new Set());
  readonly progress = signal(0);
  readonly showTop = signal(false);

  /* ---- derived data ---- */
  readonly stats = computed(() => {
    const list = this.projects();
    const tags = new Set(list.flatMap((p) => p.tags));
    const years = list.map((p) => p.year);
    const span =
      years.length > 0
        ? Math.min(...years) === Math.max(...years)
          ? String(years[0])
          : `${Math.min(...years)} – ${Math.max(...years)}`
        : '—';
    return [
      { label: 'Projects', value: String(list.length), note: 'Brand, social, print, and digital' },
      { label: 'Skills & tools', value: String(tags.size), note: 'Used across the projects' },
      { label: 'Delivered', value: span, note: 'Years of work shown here' },
    ];
  });

  readonly typeChips = computed<TypeChip[]>(() => {
    const list = this.projects();
    const types = [...new Set(list.map((p) => p.type))].sort((a, b) => a.localeCompare(b));
    return [
      { value: 'all', label: 'All', count: list.length },
      ...types.map((value) => ({
        value,
        label: value,
        count: list.filter((p) => p.type === value).length,
      })),
    ];
  });

  readonly years = computed<number[]>(() =>
    [...new Set(this.projects().map((p) => p.year))].sort((a, b) => b - a),
  );

  readonly filtered = computed<GraphicDesignProject[]>(() => {
    const q = this.query();
    const type = this.type();
    const year = this.year();
    const featuredOnly = this.featuredOnly();

    const list = this.projects().filter((project) => {
      if (type !== 'all' && project.type !== type) return false;
      if (year !== 'all' && String(project.year) !== year) return false;
      if (featuredOnly && !project.featured) return false;
      if (!q) return true;
      return (
        project.name.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q) ||
        project.type.toLowerCase().includes(q) ||
        String(project.year).includes(q) ||
        project.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    const sort = this.sort();
    return [...list].sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name);
      const byYear = sort === 'newest' ? b.year - a.year : a.year - b.year;
      return byYear !== 0 ? byYear : a.name.localeCompare(b.name);
    });
  });

  readonly visible = computed(() => this.filtered().slice(0, this.shown()));
  readonly remaining = computed(() => Math.max(0, this.filtered().length - this.shown()));
  readonly nextBatch = computed(() => Math.min(PAGE_SIZE, this.remaining()));

  readonly hasFilters = computed(
    () =>
      this.query().length > 0 ||
      this.type() !== 'all' ||
      this.year() !== 'all' ||
      this.featuredOnly(),
  );

  /* ---- navigation ---- */
  go(event: Event, path: string): void {
    if (
      event instanceof MouseEvent &&
      (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    ) {
      return;
    }
    event.preventDefault();
    this.router.navigateByUrl(path).catch(() => undefined);
  }

  select(id: string): void {
    this.projectSelected.emit(id);
  }

  /* ---- images ---- */
  hasImage(project: GraphicDesignProject): boolean {
    return project.image.length > 0 && !this.failedImages().has(project.id);
  }

  onImageError(id: string): void {
    this.failedImages.update((current) => new Set(current).add(id));
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase();
  }

  /* ---- search / filters / sort / view ---- */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value.trim().toLowerCase());
    this.shown.set(PAGE_SIZE);
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.query.set('');
    this.shown.set(PAGE_SIZE);
    input.focus();
  }

  setType(value: string): void {
    this.type.set(value);
    this.shown.set(PAGE_SIZE);
  }

  onYear(event: Event): void {
    this.year.set((event.target as HTMLSelectElement).value);
    this.shown.set(PAGE_SIZE);
  }

  onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sort.set(value === 'oldest' || value === 'az' ? value : 'newest');
  }

  toggleFeatured(): void {
    this.featuredOnly.update((value) => !value);
    this.shown.set(PAGE_SIZE);
  }

  setView(mode: ViewMode): void {
    this.view.set(mode);
  }

  showMore(): void {
    this.shown.update((value) => value + PAGE_SIZE);
  }

  resetFilters(input: HTMLInputElement): void {
    input.value = '';
    this.query.set('');
    this.type.set('all');
    this.year.set('all');
    this.sort.set('newest');
    this.featuredOnly.set(false);
    this.shown.set(PAGE_SIZE);
  }

  isMatch(text: string): boolean {
    const q = this.query();
    return q.length > 0 && text.toLowerCase().includes(q);
  }

  /** Tags that match the current search (shown on a card only while searching). */
  matchingTags(project: GraphicDesignProject): string[] {
    const q = this.query();
    return q ? project.tags.filter((tag) => tag.toLowerCase().includes(q)) : [];
  }

  highlight(text: string): HighlightPart[] {
    const q = this.query();
    if (!q) return [{ text, match: false }];

    const lower = text.toLowerCase();
    const parts: HighlightPart[] = [];
    let cursor = 0;
    let index = lower.indexOf(q, cursor);

    while (index !== -1) {
      if (index > cursor) parts.push({ text: text.slice(cursor, index), match: false });
      parts.push({ text: text.slice(index, index + q.length), match: true });
      cursor = index + q.length;
      index = lower.indexOf(q, cursor);
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
    return parts;
  }

  /* ---- keyboard shortcut: press "/" to jump to the search box ---- */
  onKeydown(event: KeyboardEvent): void {
    if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey) return;

    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    ) {
      return;
    }

    const input = this.searchInput()?.nativeElement;
    if (input) {
      event.preventDefault();
      input.focus();
    }
  }

  /* ---- page helpers ---- */
  scrollToTop(): void {
    if (typeof window.scrollTo !== 'function') return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }

  onScroll(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(max > 0 ? Math.min(100, (y / max) * 100) : 0);
    this.showTop.set(y > 600);
  }
}