import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
 
/* ------------------------------------------------------------------ */
/*  Models + defaults                                                  */
/* ------------------------------------------------------------------ */
 
export interface FooterLink {
  label: string;
  path: string;
}
 
export interface SocialLink {
  label: string;
  href: string;
}
 
const DEFAULT_PAGES: FooterLink[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/About' },
  { label: 'Services', path: '/Services' },
  { label: 'Experience', path: '/Experience' },
  { label: 'Skills', path: '/Skills' },
  { label: 'Projects', path: '/Projects' },
];
 
const DEFAULT_SERVICES: FooterLink[] = [
  { label: 'Business Development', path: '/services#business-development' },
  { label: 'Social Media Marketing', path: '/services#social-media-marketing' },
  { label: 'Graphic Design', path: '/services#graphic-design' },
  { label: 'Front-End Development', path: '/services#front-end-development' },
  { label: 'Website Design & UI Implementation', path: '/services#website-design' },
  { label: 'Digital Presence', path: '/services#digital-presence' },
];
 
const FULL_NAME = 'Ahmed Elgizawy';
 
const BLURB =
  'A multidisciplinary professional working at the intersection of business, marketing, design, and technology.';
 
const CTA_TITLE = "Let's Work Together";
 
const CTA_TEXT =
  "Let's turn your idea into a clear, professional, and effective digital experience.";
 
const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
private readonly router = inject(Router);
 
  /* ---- inputs ---- */
  readonly pages = input<FooterLink[]>(DEFAULT_PAGES);
  readonly services = input<FooterLink[]>(DEFAULT_SERVICES);
  /** Optional external profiles, e.g. [{ label: 'GitHub', href: 'https://github.com/...' }]. */
  readonly socials = input<SocialLink[]>([]);
  /** Optional contact link (for example a mailto: address). */
  readonly contactHref = input<string>('');
  readonly homePath = input<string>('/');
  readonly showCta = input<boolean>(true);
  /** When set, the "Let's Talk" button becomes a link; otherwise it emits `talk`. */
  readonly talkHref = input<string>('');
  /** When set, the "Start a Project" button becomes a link; otherwise it emits `startProject`. */
  readonly projectHref = input<string>('');
 
  /* ---- outputs ---- */
  readonly talk = output<void>();
  readonly startProject = output<void>();
 
  /* ---- static content ---- */
  readonly fullName = FULL_NAME;
  readonly initials = FULL_NAME.split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  readonly blurb = BLURB;
  readonly ctaTitle = CTA_TITLE;
  readonly ctaText = CTA_TEXT;
  readonly tagline = 'Business. Marketing. Design. Technology.';
  readonly year = new Date().getFullYear();
 
  /** In-app navigation that keeps normal link behaviour (new tab, etc.) intact. */
  navigate(event: Event, path: string): void {
    if (
      event instanceof MouseEvent &&
      (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
    ) {
      return;
    }
    event.preventDefault();
    this.router.navigateByUrl(path).catch(() => undefined);
  }
 
  scrollToTop(): void {
    if (typeof window.scrollTo !== 'function') return;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }
}

