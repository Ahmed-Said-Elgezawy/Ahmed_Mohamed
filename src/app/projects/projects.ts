import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */

export type ProjectGroup = 'Development' | 'Design' | 'Marketing' | 'Business Development';

export interface ProjectCategory {
  id: string;
  number: string;
  title: string;
  description: string;
  group: ProjectGroup;
  icon: string; // SVG path data (24x24, stroke based)
  tags: string[];
}

type GroupFilter = 'all' | ProjectGroup;
type SortMode = 'default' | 'az';
type ViewMode = 'grid' | 'list';

interface HighlightPart {
  text: string;
  match: boolean;
}

interface GroupChip {
  value: GroupFilter;
  label: string;
  count: number;
}

/* ------------------------------------------------------------------ */
/*  Icons (Lucide-style paths, drawn with stroke, 24x24)               */
/* ------------------------------------------------------------------ */

const ICONS = {
  code: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  layout: 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M3 9h18 M9 21V9',
  pen: 'M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z M2 2l7.586 7.586',
  megaphone: 'm3 11 18-5v12L3 14v-3z M11.6 16.8a3 3 0 1 1-5.8-1.6',
  server: 'M2 3h20v7H2z M2 14h20v7H2z M6 6.5h.01 M6 17.5h.01',
  layers: 'm12 2 10 5-10 5L2 7z M2 17l10 5 10-5 M2 12l10 5 10-5',
  trendingUp: 'm22 7-8.5 8.5-5-5L2 17 M16 7h6v6',
} as const;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const CATEGORIES: ProjectCategory[] = [
  {
    id: 'Front-End',
    number: '01',
    title: 'Front-End Projects',
    description:
      'Responsive websites, landing pages, and component-based Angular applications built with clean structure and maintainable code.',
    group: 'Development',
    icon: ICONS.code,
    tags: ['Angular', 'TypeScript', 'SCSS', 'Responsive Design'],
  },
  // {
  //   id: 'ui-web-design',
  //   number: '02',
  //   title: 'UI & Web Design Projects',
  //   description:
  //     'Page layouts, interfaces, and design-to-code work focused on clear visual hierarchy and mobile-first usability.',
  //   group: 'Design',
  //   icon: ICONS.layout,
  //   tags: ['UI Design', 'Landing Pages', 'Mobile-First', 'Design-to-Code'],
  // },
  {
    id: 'Graphic-Design',
    number: '02',
    title: 'Graphic Design Projects',
    description:
      'Social media creatives, marketing materials, and brand visuals that communicate clearly and stay consistent with the brand.',
    group: 'Design',
    icon: ICONS.pen,
    tags: ['Social Media Design', 'Marketing Creatives', 'Brand Visuals', 'Typography'],
  },
  {
    id: 'social-media-marketing',
    number: '03',
    title: 'Social Media Marketing Projects',
    description:
      'Content plans, campaigns, and promotional content created to strengthen brand awareness and reach potential customers.',
    group: 'Marketing',
    icon: ICONS.megaphone,
    tags: ['Content Planning', 'Campaigns', 'Brand Awareness', 'Content Calendars'],
  },
  {
    id: 'business-development',
    number: '04',
    title: 'Business Development Projects',
    description:
      'Strategic business development work focused on lead generation, client relationship management, market research, sales negotiations, and converting prospects into long-term business partnerships.',
    group: 'Business Development',
    icon: ICONS.trendingUp,
    tags: ['Lead Generation', 'Client Relationships', 'Market Research', 'Sales Negotiation'],
  },
  // {
  //   id: 'full-stack',
  //   number: '06',
  //   title: 'Back-End & Full-Stack Projects',
  //   description:
  //     'Server-side applications and APIs that connect Angular front ends to Node.js, Express.js, and MongoDB.',
  //   group: 'Development',
  //   icon: ICONS.server,
  //   tags: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
  // },
  // {
  //   id: 'digital-presence',
  //   number: '07',
  //   title: 'Digital Presence Projects',
  //   description:
  //     'Integrated work that connects a website, social media, and visual identity into one consistent and professional presence.',
  //   group: 'Marketing',
  //   icon: ICONS.layers,
  //   tags: ['Website', 'Social Media', 'Visual Identity', 'Brand Consistency'],
  // },
];

const GROUPS: ProjectGroup[] = ['Development', 'Design', 'Marketing', 'Business Development'];

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown)': 'onKeydown($event)',
  },
})
export class Projects {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);

  /* ---- inputs ---- */
  /** Base path of the future details page. A card links to `${basePath}/${category.id}`. */
  readonly basePath = input<string>('/Projects');
  /** Keep false until the details pages exist. When true, selecting a card also navigates. */
  readonly navigateOnSelect = input<boolean>(true);
  /** Optional project counts per category id, e.g. { 'front-end': 8 }. Shown only when provided. */
  readonly projectCounts = input<Record<string, number>>({});
  /** Optional contact link for the closing call to action. */
  readonly contactHref = input<string>('');

  /* ---- outputs ---- */
  /** Emits the id of the selected category card (this is the hook for opening its projects). */
  readonly categorySelected = output<string>();
  readonly talk = output<void>();

  /* ---- static content ---- */
  readonly categories = CATEGORIES;

  /* ---- ui state ---- */
  readonly query = signal('');
  readonly group = signal<GroupFilter>('all');
  readonly sort = signal<SortMode>('default');
  readonly view = signal<ViewMode>('grid');
  readonly progress = signal(0);
  readonly showTop = signal(false);

  /* ---- derived data ---- */
  readonly stats = (() => {
    const tags = new Set(CATEGORIES.flatMap((c) => c.tags));
    return [
      { label: 'Project categories', value: String(CATEGORIES.length), note: 'Development, design, marketing, business' },
      { label: 'Skills & technologies', value: String(tags.size), note: 'Used across the categories' },
      { label: 'Disciplines', value: String(GROUPS.length), note: 'One integrated perspective' },
    ];
  })();

  readonly chips = computed<GroupChip[]>(() => [
    { value: 'all', label: 'All', count: CATEGORIES.length },
    ...GROUPS.map((value) => ({
      value,
      label: value,
      count: CATEGORIES.filter((c) => c.group === value).length,
    })),
  ]);

  readonly visibleCategories = computed<ProjectCategory[]>(() => {
    const q = this.query();
    const group = this.group();

    let list = CATEGORIES.filter((category) => {
      if (group !== 'all' && category.group !== group) return false;
      if (!q) return true;
      return (
        category.title.toLowerCase().includes(q) ||
        category.description.toLowerCase().includes(q) ||
        category.group.toLowerCase().includes(q) ||
        category.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    if (this.sort() === 'az') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  });

  readonly hasFilters = computed(() => this.query().length > 0 || this.group() !== 'all');

  /* ---- template helpers ---- */
  hrefFor(category: ProjectCategory): string {
    const base = this.basePath().replace(/\/+$/, '');
    return `${base}/${category.id}`;
  }

  countFor(category: ProjectCategory): number | null {
    const value = this.projectCounts()[category.id];
    return typeof value === 'number' ? value : null;
  }

  /**
   * Card selection. For now it only emits `categorySelected`, which is where the
   * "open this category's projects" behaviour will be connected later.
   */
  select(event: Event, category: ProjectCategory): void {
    if (
      event instanceof MouseEvent &&
      (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    ) {
      return;
    }
    event.preventDefault();
    this.categorySelected.emit(category.id);
    if (this.navigateOnSelect()) {
      this.router.navigateByUrl(this.hrefFor(category)).catch(() => undefined);
    }
  }

  /* ---- search / filter / sort / view ---- */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value.trim().toLowerCase());
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.query.set('');
    input.focus();
  }

  resetFilters(input: HTMLInputElement): void {
    input.value = '';
    this.query.set('');
    this.group.set('all');
    this.sort.set('default');
  }

  setGroup(value: GroupFilter): void {
    this.group.set(value);
  } 

  onSort(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sort.set(value === 'az' ? 'az' : 'default');
  }

  setView(mode: ViewMode): void {
    this.view.set(mode);
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

    const input = this.host.nativeElement.querySelector<HTMLInputElement>('input[type="search"]');
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