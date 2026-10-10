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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
 
/* ------------------------------------------------------------------ */
/*  Models + defaults                                                  */
/* ------------------------------------------------------------------ */
 
export interface NavLink {
  label: string;
  path: string;
}
 
const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', path: '/Home' },
  { label: 'About', path: '/About' },
  { label: 'Services', path: '/Services' },
  { label: 'Experience', path: '/Experience' },
  { label: 'Skills', path: '/Skills' },
  { label: 'Projects', path: '/Projects' },
];
 
const FULL_NAME = 'Ahmed Elgizawy';
const DESKTOP_BREAKPOINT = 992;
 
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:resize)': 'onResize()',
    '(document:keydown.escape)': 'closeMenu(true)',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class Header {
private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
 
  /* ---- inputs ---- */
  readonly links = input<NavLink[]>(DEFAULT_LINKS);
  readonly homePath = input<string>('/');
  readonly ctaLabel = input<string>("Let's Talk");
  /** When set, the call to action becomes a link; otherwise it emits `cta`. */
  readonly ctaHref = input<string>('');
 
  /* ---- outputs ---- */
  readonly cta = output<void>();
 
  /* ---- static content ---- */
  readonly fullName = FULL_NAME;
  readonly initials = FULL_NAME.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
 
  /* ---- state ---- */
  readonly menuOpen = signal(false);
  readonly scrolled = signal(false);
  private readonly url = signal(this.router.url);
 
  readonly currentPath = computed(() => this.url().split(/[?#]/)[0] || '/');
 
  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.url.set(event.urlAfterRedirects);
        this.menuOpen.set(false);
      });
  }
 
  /* ---- template helpers ---- */
  isActive(link: NavLink): boolean {
    const path = this.currentPath();
    if (link.path === '/') return path === '/';
    return path === link.path || path.startsWith(`${link.path}/`);
  }
 
  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
 
  closeMenu(restoreFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    if (restoreFocus) {
      this.host.nativeElement.querySelector<HTMLElement>('.menu-btn')?.focus();
    }
  }
 
  /** In-app navigation that keeps normal link behaviour (new tab, etc.) intact. */
  navigate(event: Event, path: string): void {
    if (
      event instanceof MouseEvent &&
      (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    ) {
      return;
    }
    event.preventDefault();
    this.menuOpen.set(false);
    this.router.navigateByUrl(path).catch(() => undefined);
  }
 
  onCta(): void {
    this.menuOpen.set(false);
    this.cta.emit();
  }
 
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
 
  onResize(): void {
    if (window.innerWidth >= DESKTOP_BREAKPOINT) this.menuOpen.set(false);
  }
 
  onDocumentClick(event: Event): void {
    if (!this.menuOpen()) return;
    const target = event.target;
    if (target instanceof Node && !this.host.nativeElement.contains(target)) {
      this.menuOpen.set(false);
    }
  }
}
