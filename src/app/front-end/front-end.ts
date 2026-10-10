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

export interface FrontEndProject {
  id: string;
  /** Project name shown on the card. */
  name: string;
  /** Year the project was completed. */
  year: number;
  /** Kind of project, used for the type filter (e.g. "Landing Page"). */
  type: string;
  description: string;
  /** Technologies and skills used. */
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
type ViewMode = 'grid' | 'list';

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
/*  (images are looked up at assets/projects/front-end/<id>.webp; when */
/*  a file is missing the card shows a neutral placeholder instead)    */
/* ------------------------------------------------------------------ */

const IMAGE_BASE = 'assets/projects/front-end';

const SAMPLE_PROJECTS: FrontEndProject[] = [
  {
    id: 'nova-business-website',
    name: 'Nova Business Website',
    year: 2026,
    type: 'Business Website',
    description:
      'A fast, responsive corporate website with a clear service structure, reusable sections, and a consistent visual system across every page.',
    tags: ['Angular', 'TypeScript', 'SCSS', 'Responsive Design'],
    image: `${IMAGE_BASE}/nova-business-website.webp`,
    imageAlt: 'Preview of the Nova Business Website home page',
    featured: true,
  },
  {
    id: 'pulse-analytics-dashboard',
    name: 'Pulse Analytics Dashboard',
    year: 2026,
    type: 'Web Application',
    description:
      'A data dashboard with filterable tables, summary cards, and charts designed for quick scanning and comfortable daily use.',
    tags: ['Angular', 'TypeScript', 'RxJS', 'Data Visualization'],
    image: `${IMAGE_BASE}/pulse-analytics-dashboard.webp`,
    imageAlt: 'Preview of the Pulse Analytics Dashboard overview screen',
    featured: true,
  },
  {
    id: 'atlas-component-library',
    name: 'Atlas Component Library',
    year: 2026,
    type: 'Component Library',
    description:
      'A set of accessible, themeable UI components with documented states, consistent spacing, and a shared set of design tokens.',
    tags: ['Angular', 'TypeScript', 'SCSS', 'Accessibility'],
    image: `${IMAGE_BASE}/atlas-component-library.webp`,
    imageAlt: 'Preview of the Atlas Component Library documentation page',
  },
  {
    id: 'mercato-product-catalog',
    name: 'Mercato Product Catalog',
    year: 2026,
    type: 'Web Application',
    description:
      'A product catalog interface with search, category filters, sorting, and a clean detail view that works smoothly on mobile.',
    tags: ['Angular', 'TypeScript', 'REST APIs', 'Mobile-First'],
    image: `${IMAGE_BASE}/mercato-product-catalog.webp`,
    imageAlt: 'Preview of the Mercato Product Catalog listing page',
  },
  {
    id: 'lumen-portfolio',
    name: 'Lumen Portfolio',
    year: 2025,
    type: 'Portfolio Website',
    description:
      'A minimal personal portfolio with a focus on typography, whitespace, and quick navigation between work, services, and contact.',
    tags: ['Angular', 'SCSS', 'Responsive Design', 'Typography'],
    image: `${IMAGE_BASE}/lumen-portfolio.webp`,
    imageAlt: 'Preview of the Lumen Portfolio home page',
    featured: true,
  },
  {
    id: 'orbit-landing-page',
    name: 'Orbit Landing Page',
    year: 2025,
    type: 'Landing Page',
    description:
      'A conversion-focused landing page with a strong hero, benefit sections, social proof, and a simple call to action.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Landing Pages'],
    image: `${IMAGE_BASE}/orbit-landing-page.webp`,
    imageAlt: 'Preview of the Orbit Landing Page hero section',
  },
  {
    id: 'craft-studio-redesign',
    name: 'Craft Studio Redesign',
    year: 2025,
    type: 'Website Redesign',
    description:
      'A full redesign of an existing studio website: clearer hierarchy, modern layouts, and a mobile-first rebuild.',
    tags: ['Bootstrap', 'SCSS', 'Website Redesign', 'Mobile-First'],
    image: `${IMAGE_BASE}/craft-studio-redesign.webp`,
    imageAlt: 'Preview of the redesigned Craft Studio website',
  },
  {
    id: 'bloom-booking-interface',
    name: 'Bloom Booking Interface',
    year: 2025,
    type: 'UI Implementation',
    description:
      'A booking flow implemented from a design file, with validated forms, clear steps, and helpful feedback at every stage.',
    tags: ['Angular', 'Reactive Forms', 'UI Implementation', 'Design-to-Code'],
    image: `${IMAGE_BASE}/bloom-booking-interface.webp`,
    imageAlt: 'Preview of the Bloom booking flow',
  },
  {
    id: 'vista-listings',
    name: 'Vista Real Estate Listings',
    year: 2025,
    type: 'Business Website',
    description:
      'A listings website with property cards, filters, and a gallery layout that adapts from phones to wide desktop screens.',
    tags: ['Bootstrap', 'JavaScript', 'Responsive Design', 'Gallery'],
    image: `${IMAGE_BASE}/vista-listings.webp`,
    imageAlt: 'Preview of the Vista Real Estate Listings page',
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
  selector: 'app-front-end',
  imports: [],
  templateUrl: './front-end.html',
  styleUrl: './front-end.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class FrontEnd {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /* ---- inputs ---- */
  /** The projects to show. Defaults to the sample data above. */
  readonly projects = input<FrontEndProject[]>(SAMPLE_PROJECTS);
  /** Path of the projects overview page (used by the breadcrumb and the back button). */
  readonly backPath = input<string>('/Projects');
  /** Optional contact link for the closing call to action. */
  readonly contactHref = input<string>('');

  /* ---- outputs ---- */
  /** Emits the id of the project whose "Details" button was pressed (hook for a details page). */
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
      { label: 'Projects', value: String(list.length), note: 'Websites, apps, and interfaces' },
      { label: 'Technologies', value: String(tags.size), note: 'Tools and skills used' },
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

  readonly filtered = computed<FrontEndProject[]>(() => {
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
  hasImage(project: FrontEndProject): boolean {
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

  /** Clicking a technology tag on a card searches for it. */
  filterByTag(tag: string): void {
    const input = this.searchInput()?.nativeElement;
    if (input) input.value = tag;
    this.query.set(tag.toLowerCase());
    this.shown.set(PAGE_SIZE);

    const toolbar = this.host.nativeElement.querySelector<HTMLElement>('#browse');
    if (toolbar && typeof toolbar.scrollIntoView === 'function') {
      toolbar.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    }
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
