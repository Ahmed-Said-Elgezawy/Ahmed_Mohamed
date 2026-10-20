import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import {
  ChangeDetectionStrategy,
  DestroyRef,
  computed,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Distance (px) the user must scroll before the back-to-top button appears. */
export const BACK_TO_TOP_THRESHOLD = 400;

/** Distance (px) the arrow keys scroll the page when the scroll meter is focused. */
export const KEYBOARD_SCROLL_STEP = 48;
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Footer,Header],
  templateUrl: './app.html',
  styleUrl: './app.css',
    host: {
    '(window:scroll)': 'onScroll()',
  },
})
export class App {

private readonly document = inject(DOCUMENT);
private readonly destroyRef = inject(DestroyRef);

/** Reading progress, 0 to 100. */
readonly progress = signal(0);
/** Whether the back-to-top button is visible. */
readonly showBackToTop = signal(false);
/** True while the scroll meter is being dragged. */
readonly dragging = signal(false);

protected readonly progressRounded = computed(() => Math.round(this.progress()));

private ticking = false;

/** Distance (px) between the pointer and the centre of the badge when a drag starts. */
private dragOffset = 0;
/** The scroll meter element while a drag is in progress. */
private dragMeter: HTMLElement | null = null;
private readonly onDragMove = (event: PointerEvent): void => this.dragTo(event.clientY);
private readonly onDragEnd = (): void => this.endDrag();

constructor() {
  // (your existing afterNextRender(...) stays here)
  this.destroyRef.onDestroy(() => this.endDrag());
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

private readScroll(): void {
  const win = this.document.defaultView;
  if (!win) {
    return;
  }
  const root = this.document.documentElement;
  const scrollTop = win.scrollY || root.scrollTop || 0;
  this.setScrollMetrics(scrollTop, root.scrollHeight - root.clientHeight);
}

onMeterPointerDown(event: PointerEvent): void {
  if (event.button !== 0) {
    return;
  }
  const meter = event.currentTarget as HTMLElement | null;
  if (!meter || meter.getBoundingClientRect().height <= 0) {
    return;
  }

  // Prevents text selection / native scrolling while dragging.
  event.preventDefault();
  this.dragMeter = meter;

  const thumb = meter.querySelector<HTMLElement>('.scroll-meter__thumb');
  const grabbedBadge = !!thumb && event.target instanceof Node && thumb.contains(event.target);
  if (thumb && grabbedBadge) {
    const box = thumb.getBoundingClientRect();
    this.dragOffset = event.clientY - (box.top + box.height / 2);
  } else {
    this.dragOffset = 0;
    this.dragTo(event.clientY);
  }

  this.dragging.set(true);
  this.document.addEventListener('pointermove', this.onDragMove);
  this.document.addEventListener('pointerup', this.onDragEnd);
  this.document.addEventListener('pointercancel', this.onDragEnd);
  meter.focus({ preventScroll: true });
}

/** Scrolls the page so the badge follows the pointer (instantly, with no smooth scrolling). */
private dragTo(clientY: number): void {
  const meter = this.dragMeter;
  const win = this.document.defaultView;
  if (!meter || !win) {
    return;
  }
  const box = meter.getBoundingClientRect();
  if (box.height <= 0) {
    return;
  }

  const ratio = Math.min(1, Math.max(0, (clientY - this.dragOffset - box.top) / box.height));
  const root = this.document.documentElement;
  const scrollable = Math.max(0, root.scrollHeight - root.clientHeight);
  const top = ratio * scrollable;

  // Update the badge straight away, then move the page.
  this.setScrollMetrics(top, scrollable);
  win.scrollTo({ top, behavior: 'instant' });
}

private endDrag(): void {
  this.document.removeEventListener('pointermove', this.onDragMove);
  this.document.removeEventListener('pointerup', this.onDragEnd);
  this.document.removeEventListener('pointercancel', this.onDragEnd);
  this.dragMeter = null;
  this.dragOffset = 0;
  this.dragging.set(false);
}

onMeterKeydown(event: KeyboardEvent): void {
  const win = this.document.defaultView;
  if (!win) {
    return;
  }
  const root = this.document.documentElement;
  let target: number;

  switch (event.key) {
    case 'ArrowDown':
      target = win.scrollY + KEYBOARD_SCROLL_STEP;
      break;
    case 'ArrowUp':
      target = win.scrollY - KEYBOARD_SCROLL_STEP;
      break;
    case 'PageDown':
      target = win.scrollY + win.innerHeight * 0.9;
      break;
    case 'PageUp':
      target = win.scrollY - win.innerHeight * 0.9;
      break;
    case 'Home':
      target = 0;
      break;
    case 'End':
      target = root.scrollHeight - root.clientHeight;
      break;
    default:
      return;
  }

  event.preventDefault();
  win.scrollTo({ top: Math.max(0, target), behavior: this.scrollBehavior() });
}

private scrollBehavior(): ScrollBehavior {
  const reduce = this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  return reduce ? 'auto' : 'smooth';
}
}
