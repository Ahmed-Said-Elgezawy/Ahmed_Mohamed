import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

/* ------------------------------------------------------------------ */
/*  Models                                                             */
/* ------------------------------------------------------------------ */

export interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

interface ContactMethod {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: string; // SVG path data (24x24, stroke based)
  copyable: boolean;
}

interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface Step {
  title: string;
  text: string;
}

interface HighlightPart {
  text: string;
  match: boolean;
}

type FieldName = keyof ContactMessage;

/* ------------------------------------------------------------------ */
/*  Icons (Lucide-style paths, drawn with stroke, 24x24)               */
/* ------------------------------------------------------------------ */

const ICONS = {
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M22 7l-10 7L2 7',
  phone:
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
} as const;

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const TOPICS: string[] = [
  'Business Development',
  'Social Media Marketing',
  'Graphic Design',
  'Front-End Development',
  'Website Design & UI Implementation',
  'Digital Presence',
  'Something else',
];

const BRIEF: Step[] = [
  { title: 'Your goal', text: 'What do you want to achieve, and why does it matter now?' },
  { title: 'Your audience', text: 'Who are you trying to reach, and what do they care about?' },
  {
    title: 'Scope & deliverables',
    text: 'Roughly what do you need: a website, designs, content, or a mix?',
  },
  { title: 'Timeline', text: 'Is there a launch date or a deadline I should plan around?' },
  {
    title: 'References',
    text: 'Share links, examples, or brand materials that show the direction you like.',
  },
];

const NEXT_STEPS: Step[] = [
  { title: 'You send a message', text: 'Tell me about your idea, project, or challenge.' },
  { title: 'I review it', text: 'I read it carefully and reply with questions or next steps.' },
  { title: 'We align', text: 'We clarify goals, priorities, and what success looks like.' },
  { title: 'Proposal & kickoff', text: 'You get a clear plan and we start building together.' },
];

const FAQS: Faq[] = [
  {
    id: 'faq-projects',
    question: 'What kind of projects do you take on?',
    answer:
      'I work on business development support, social media marketing, graphic design, front-end development, and website design and UI implementation. Many projects combine two or more of these, such as a website with matching social media visuals.',
  },
  {
    id: 'faq-clients',
    question: 'Who do you usually work with?',
    answer:
      'B2B businesses, startups, service-based companies, healthcare businesses, and technology companies, as well as any company looking to expand its client base.',
  },
  {
    id: 'faq-reply',
    question: 'How quickly will I hear back?',
    answer:
      'I read and reply to every message personally. The typical reply time is listed in the contact details on this page.',
  },
  {
    id: 'faq-first-message',
    question: 'What should I include in my first message?',
    answer:
      'Your goal, your audience, the rough scope, any timeline, and a few references. A short description is enough; we can refine the details together.',
  },
  {
    id: 'faq-process',
    question: 'How does the process work?',
    answer:
      'We start by discovering your business, goals, and audience. Then we define the direction and deliverables, I create the strategy, design, or digital solution, we refine it with your feedback, and finally I deliver it ready for implementation, publication, or deployment.',
  },
  {
    id: 'faq-tech',
    question: 'Which technologies do you build with?',
    answer:
      'Angular, TypeScript, JavaScript, HTML5, CSS3, SCSS, and Bootstrap on the front end, with Node.js, Express.js, and MongoDB for back-end work. I manage projects with Git and GitHub.',
  },
  {
    id: 'faq-redesign',
    question: 'Can you redesign my existing website?',
    answer:
      'Yes. I can refresh the layout, improve the visual hierarchy, and rebuild the interface so it is responsive, mobile-first, and easier to use.',
  },
  {
    id: 'faq-design-dev',
    question: 'Do you handle both design and development?',
    answer:
      'Yes. I combine design thinking with front-end development, so the final interface stays faithful to the visual concept and works smoothly on every screen.',
  },
  {
    id: 'faq-pricing',
    question: 'How is pricing decided?',
    answer:
      'It depends on the scope, complexity, and timeline. After we discuss your goals, I send a clear proposal so you know what to expect before we start.',
  },
  {
    id: 'faq-small',
    question: 'Can we start with a small task?',
    answer:
      'Absolutely. A landing page, a set of social media designs, or a focused UI task is a good way to start working together.',
  },
];

const DEFAULT_VALUES: ContactMessage = {
  name: '',
  email: '',
  topic: '',
  message: '',
};

const MESSAGE_MAX = 1000;
const MESSAGE_MIN = 20;

const ERROR_MESSAGES: Record<FieldName, Record<string, string>> = {
  name: {
    required: 'Please enter your name.',
    minlength: 'Your name should be at least 2 characters.',
  },
  email: {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  },
  topic: {
    required: 'Please choose what you need help with.',
  },
  message: {
    required: 'Please write a message.',
    minlength: `Please write at least ${MESSAGE_MIN} characters so I can understand your request.`,
    maxlength: `Please keep your message under ${MESSAGE_MAX} characters.`,
  },
};

const FIELD_ORDER: FieldName[] = ['name', 'email', 'topic', 'message'];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:scroll)': 'onScroll()',
    '(window:beforeprint)': 'printing.set(true)',
    '(window:afterprint)': 'printing.set(false)',
  },
})
export class Contact {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private copyTimer?: ReturnType<typeof setTimeout>;

  /* ---- inputs (everything optional; empty values are simply not shown) ---- */
  readonly email = input<string>('');
  readonly phone = input<string>('');
  readonly location = input<string>('Cairo, Egypt');
  readonly responseTime = input<string>('Within 24 hours');
  readonly socials = input<SocialLink[]>([]);

  /* ---- outputs ---- */
  readonly send = output<ContactMessage>();

  /* ---- static content ---- */
  readonly topics = TOPICS;
  readonly brief = BRIEF;
  readonly nextSteps = NEXT_STEPS;
  readonly messageMax = MESSAGE_MAX;
  readonly messageMin = MESSAGE_MIN;

  /* ---- form ---- */
  readonly form = this.fb.nonNullable.group({
    name: [DEFAULT_VALUES.name, [Validators.required, Validators.minLength(2)]],
    email: [DEFAULT_VALUES.email, [Validators.required, Validators.email]],
    topic: [DEFAULT_VALUES.topic, [Validators.required]],
    message: [
      DEFAULT_VALUES.message,
      [Validators.required, Validators.minLength(MESSAGE_MIN), Validators.maxLength(MESSAGE_MAX)],
    ],
  });

  /* ---- ui state ---- */
  readonly submitted = signal(false);
  readonly status = signal<'idle' | 'success'>('idle');
  readonly messageLength = signal(0);
  readonly copiedId = signal('');
  readonly query = signal('');
  readonly openFaqs = signal<ReadonlySet<string>>(new Set([FAQS[0].id]));
  readonly printing = signal(false);
  readonly progress = signal(0);
  readonly showTop = signal(false);

  /* ---- derived data ---- */
  readonly methods = computed<ContactMethod[]>(() => {
    const list: ContactMethod[] = [];
    const email = this.email().trim();
    const phone = this.phone().trim();
    const location = this.location().trim();
    const responseTime = this.responseTime().trim();

    if (email) {
      list.push({
        id: 'email',
        label: 'Email',
        value: email,
        href: `mailto:${email}`,
        icon: ICONS.mail,
        copyable: true,
      });
    }
    if (phone) {
      list.push({
        id: 'phone',
        label: 'Phone',
        value: phone,
        href: `tel:${phone.replace(/[\s()-]/g, '')}`,
        icon: ICONS.phone,
        copyable: true,
      });
    }
    if (location) {
      list.push({
        id: 'location',
        label: 'Location',
        value: location,
        href: '',
        icon: ICONS.pin,
        copyable: false,
      });
    }
    if (responseTime) {
      list.push({
        id: 'response',
        label: 'Typical reply time',
        value: responseTime,
        href: '',
        icon: ICONS.clock,
        copyable: false,
      });
    }
    return list;
  });

  readonly filteredFaqs = computed<Faq[]>(() => {
    const q = this.query();
    if (!q) return FAQS;
    return FAQS.filter(
      (faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q),
    );
  });

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.copyTimer) clearTimeout(this.copyTimer);
    });
  }

  /* ---- form helpers ---- */
  onMessageInput(event: Event): void {
    this.messageLength.set((event.target as HTMLTextAreaElement).value.length);
  }

  fieldError(name: FieldName): string {
    const control = this.form.controls[name];
    if (!control.invalid || !(control.touched || this.submitted())) return '';
    const errors = control.errors ?? {};
    const key = Object.keys(errors)[0];
    return ERROR_MESSAGES[name][key] ?? 'Please check this field.';
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const firstInvalid = FIELD_ORDER.find((name) => this.form.controls[name].invalid);
      if (firstInvalid) {
        this.host.nativeElement.querySelector<HTMLElement>(`#field-${firstInvalid}`)?.focus();
      }
      return;
    }

    this.send.emit(this.form.getRawValue());
    this.status.set('success');
  }

  resetForm(): void {
    this.form.reset(DEFAULT_VALUES);
    this.submitted.set(false);
    this.status.set('idle');
    this.messageLength.set(0);
  }

  /* ---- copy to clipboard ---- */
  copy(method: ContactMethod): void {
    const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
    if (!clipboard?.writeText) return;

    clipboard
      .writeText(method.value)
      .then(() => {
        this.copiedId.set(method.id);
        if (this.copyTimer) clearTimeout(this.copyTimer);
        this.copyTimer = setTimeout(() => this.copiedId.set(''), 2000);
      })
      .catch(() => undefined);
  }

  /* ---- faq: search, highlight, accordion ---- */
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value.trim().toLowerCase());
  }

  clearSearch(input: HTMLInputElement): void {
    input.value = '';
    this.query.set('');
    input.focus();
  }

  isFaqOpen(id: string): boolean {
    return this.query().length > 0 || this.printing() || this.openFaqs().has(id);
  }

  toggleFaq(id: string): void {
    this.openFaqs.update((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  expandAll(): void {
    this.openFaqs.set(new Set(FAQS.map((faq) => faq.id)));
  }

  collapseAll(): void {
    this.openFaqs.set(new Set());
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

  /* ---- page helpers ---- */
  scrollTo(id: string, event: Event): void {
    event.preventDefault();
    const target = this.host.nativeElement.querySelector<HTMLElement>(`#${id}`);
    if (!target) return;
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: this.behavior(), block: 'start' });
    }
  }

  scrollToTop(): void {
    if (typeof window.scrollTo !== 'function') return;
    window.scrollTo({ top: 0, behavior: this.behavior() });
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

  private behavior(): ScrollBehavior {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduce ? 'auto' : 'smooth';
  }
}